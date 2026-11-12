# assets/img/lugares/

Imágenes **optimizadas** de escenarios/lugares (las genera `tools/optimizar_imagenes.py`).
No pongas aquí los originales: van en `originales/lugares/`.

| Lugar                  | Nombre base                 |
|------------------------|-----------------------------|
| Catedral en Ruinas     | `catedral-en-ruinas`        |
| Ciudad                 | `ciudad`                    |
| Bosque de las Sombras  | `bosque-de-las-sombras`     |
| El Infierno            | `infierno` (solo galería)   |
| Mapa del mundo         | `mapa-del-mundo` (solo galería) |

Por cada nombre base: `<base>-400.webp`, `<base>-800.webp`, `<base>-1200.webp`, `<base>-800.jpg`.
Proporción: **16:9 (horizontal)**, ideal 1920×1080 o más.
Mientras no existan, se ve la ilustración SVG de `assets/img/`.
Para agregar otro lugar: añade un objeto `tipo: 'lugares'` al arreglo `GALERIA` de `app.js`.
