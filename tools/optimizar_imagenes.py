#!/usr/bin/env python3
"""
HELLMED · Optimizador de imágenes para la galería web
=====================================================

Convierte tus imágenes originales (PNG/JPG grandes, capturas, arte) en
versiones ligeras y responsivas que usa la web:

    originales/personajes/hermano-cruz.png
        → assets/img/personajes/hermano-cruz-400.webp
        → assets/img/personajes/hermano-cruz-800.webp
        → assets/img/personajes/hermano-cruz-1200.webp
        → assets/img/personajes/hermano-cruz-800.jpg   (respaldo para navegadores viejos)

    originales/lugares/ciudad.png → assets/img/lugares/ciudad-{400,800,1200}.webp + -800.jpg

Uso (desde la carpeta raíz del sitio, donde está index.html):
    pip install pillow
    python tools/optimizar_imagenes.py            # procesa todo
    python tools/optimizar_imagenes.py --pixel personajes   # sprites de pixel art nítidos

Reglas:
  - El nombre del archivo original = nombre que usa app.js (minúsculas, guiones,
    sin acentos ni espacios). Ej.: "La Gárgola.png" → renómbralo "gargola.png".
  - Personajes se recortan a 3:4 (retrato) y lugares a 16:9 (paisaje), centrados.
    Usa --sin-recorte si ya vienen con la proporción correcta.
  - Nunca se agranda una imagen fotográfica (pierde calidad); el pixel art sí,
    con escalado "vecino más cercano" para que los píxeles queden nítidos.
  - La carpeta originales/ NO hace falta subirla a GitHub (ver .gitignore).
"""
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta Pillow. Instálalo con:  pip install pillow")

ANCHOS = [400, 800, 1200]
PROPORCION = {"personajes": (3, 4), "lugares": (16, 9)}
EXTENSIONES = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}


def recortar(img, proporcion):
    """Recorta al centro para que la imagen tenga la proporción indicada."""
    w, h = img.size
    pw, ph = proporcion
    objetivo = pw / ph
    actual = w / h
    if abs(actual - objetivo) < 0.01:
        return img
    if actual > objetivo:  # sobra ancho
        nuevo_w = round(h * objetivo)
        x = (w - nuevo_w) // 2
        return img.crop((x, 0, x + nuevo_w, h))
    nuevo_h = round(w / objetivo)  # sobra alto: para personajes conserva la cabeza (arriba)
    y = 0 if proporcion == PROPORCION["personajes"] else (h - nuevo_h) // 2
    return img.crop((0, y, w, y + nuevo_h))


def procesar(origen, destino_dir, proporcion, pixel, sin_recorte):
    img = Image.open(origen)
    img = ImageOps.exif_transpose(img)  # respeta la rotación de fotos de celular
    tiene_alfa = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
    img = img.convert("RGBA" if tiene_alfa else "RGB")
    if not sin_recorte:
        img = recortar(img, proporcion)

    base = origen.stem.lower().replace(" ", "-")
    filtro = Image.NEAREST if pixel else Image.LANCZOS
    destino_dir.mkdir(parents=True, exist_ok=True)
    generados = []

    for ancho in ANCHOS:
        if img.width < ancho and not pixel:
            # No agrandamos fotos: se guarda al tamaño original con el nombre esperado
            version = img.copy()
        else:
            alto = round(img.height * ancho / img.width)
            version = img.resize((ancho, alto), filtro)

        webp = destino_dir / f"{base}-{ancho}.webp"
        version.save(webp, "WEBP", quality=82, method=6, lossless=pixel)
        generados.append(webp)

        if ancho == 800:
            jpg = destino_dir / f"{base}-800.jpg"
            fondo = Image.new("RGB", version.size, (11, 7, 8))  # color de fondo de la web
            fondo.paste(version, mask=version.split()[-1] if version.mode == "RGBA" else None)
            fondo.save(jpg, "JPEG", quality=84, optimize=True, progressive=True)
            generados.append(jpg)

    kb = sum(p.stat().st_size for p in generados) / 1024
    print(f"  ✔ {origen.name:32s} → {base}-*.webp/.jpg  ({kb:,.0f} KB en total)")


def main():
    parser = argparse.ArgumentParser(description="Optimiza imágenes de HELLMED para la web.")
    parser.add_argument("--origen", default="originales", help="carpeta con personajes/ y lugares/ (por defecto: originales)")
    parser.add_argument("--destino", default="assets/img", help="carpeta de salida (por defecto: assets/img)")
    parser.add_argument("--pixel", nargs="*", choices=list(PROPORCION), default=None,
                        help="pixel art: escalado sin suavizado y WebP sin pérdida. "
                             "Sin valores = todo; o indica cuáles: --pixel personajes")
    parser.add_argument("--sin-recorte", action="store_true", help="no recortar a 3:4 / 16:9")
    args = parser.parse_args()

    raiz_origen = Path(args.origen)
    if not raiz_origen.exists():
        for sub in PROPORCION:
            (raiz_origen / sub).mkdir(parents=True, exist_ok=True)
        sys.exit(f"Creé {raiz_origen}/personajes y {raiz_origen}/lugares. Pon ahí tus imágenes y vuelve a correr el script.")

    total = 0
    for sub, proporcion in PROPORCION.items():
        carpeta = raiz_origen / sub
        archivos = sorted(p for p in carpeta.glob("*") if p.suffix.lower() in EXTENSIONES) if carpeta.exists() else []
        print(f"\n{sub.upper()} ({len(archivos)} imágenes)")
        for archivo in archivos:
            try:
                pixel = args.pixel is not None and (len(args.pixel) == 0 or sub in args.pixel)
                procesar(archivo, Path(args.destino) / sub, proporcion, pixel, args.sin_recorte)
                total += 1
            except Exception as e:  # una imagen dañada no detiene las demás
                print(f"  ✘ {archivo.name}: {e}")

    print(f"\nListo: {total} imágenes procesadas. Recuerda subir la VERSION en sw.js antes del git push.")


if __name__ == "__main__":
    main()
