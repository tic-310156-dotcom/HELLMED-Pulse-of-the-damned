# HELLMED: PWA y secciones nuevas — cómo ponerlo

## 1. Qué contiene esta carpeta
| Archivo | Qué es |
|---|---|
| `index.html` | **Reemplaza** el tuyo (trae todo lo anterior + Supabase + secciones nuevas) |
| `app.js` | **Reemplaza** el tuyo (agrega registro del service worker, botón instalar, aviso sin conexión) |
| `extras.css` | **Nuevo.** Estilos de Jugar, Escenarios, Equipo. Se carga después de `style.css` |
| `manifest.webmanifest` | **Nuevo.** Nombre, colores, iconos, `start_url`, `display`, orientación |
| `sw.js` | **Nuevo.** Service worker: caché, versiones y modo sin conexión |
| `offline.html` | **Nuevo.** Página que sale cuando no hay internet y la página no está guardada |
| `icons/` | **Nuevo.** Iconos PNG 192, 512, maskable 512 y apple-touch |
| `assets/img/` | **Nuevo.** 3 ilustraciones de los escenarios |
| `downloads/` | **Nuevo.** Aquí va el APK: `downloads/hellmed-hub.apk` |

**No toques tu `style.css`.** Todo va en la raíz del repositorio, junto a `index.html`.

## 2. Pasos
1. Copia todo al repositorio `HELLMED-Pulse-of-the-damned` (reemplazando `index.html` y `app.js`).
2. Edita en `index.html` la sección **Equipo** (busca `AGREGAR AQUÍ`): nombres, roles y participación de los 5.
3. Confirma los **controles** (sección `jugar`) con la build real del juego.
4. Sube a GitHub: `git add .` → `git commit -m "PWA y secciones nuevas"` → `git push`.
5. Publica con **GitHub Pages**: repositorio → Settings → Pages → Branch `main` / carpeta `/ (root)` → Save.
   La PWA **solo se instala desde HTTPS** (o `localhost`); GitHub Pages ya es HTTPS.

## 3. Cómo comprobar cada punto de la rúbrica (Chrome, F12 → pestaña Application)
- **Manifest:** Application → Manifest. Debe mostrar nombre, colores, iconos 192 y 512 sin errores.
- **Service worker activo:** Application → Service Workers → estado **activated and is running**.
- **Caché:** Application → Cache Storage → `hellmed-v1` con los archivos.
- **Sin conexión:** Network → marca **Offline** → recarga (F5). Debe verse el sitio con el aviso amarillo "Sin conexión".
  Para ver `offline.html`: estando Offline entra a una dirección que no exista (ej. `/prueba`).
- **Instalable:** en la barra de direcciones aparece el icono de instalar, o el botón **Instalar como app** en la sección Descargar.
- **Abre con nombre e icono propios:** ya instalada, abre como ventana "HELLMED" con el icono de la cruz y el pulso.

## 4. IMPORTANTE: cada vez que cambies archivos
Abre `sw.js` y sube la versión: `const VERSION = 'v1';` → `'v2'` → `'v3'`...
Así el navegador borra la caché vieja y descarga lo nuevo (criterio 3.8).

## 5. El APK (criterio 2.12)
El APK no se puede generar aquí; se hace **después de publicar la PWA**:
1. Entra a **pwabuilder.com**, pega la URL de tu GitHub Pages y pulsa **Start**.
2. Cuando termine el análisis, elige **Package for stores → Android → Generate Package**
   (si pide "Package ID" usa algo como `mx.hellmed.hub`; para pruebas elige la opción que genera APK).
3. Descarga el `.zip`, dentro viene un `.apk`. Renómbralo `hellmed-hub.apk`.
4. Ponlo en la carpeta `downloads/`, haz `git push`.
5. En un celular Android abre el sitio → **Descargar APK (Android)** → permite instalar desde este origen → instala.

Hasta que el APK exista en `downloads/`, ese botón dará error 404.

## 6. Pendientes que solo el equipo puede completar
- Nombres y participación de los integrantes (sección Equipo).
- Capturas reales: cambia el `src` de las 3 imágenes de Escenarios y agrega el video del hero (ver comentarios en `index.html`).
- Enlaces reales de Steam, itch.io, Google Play, Discord y redes (siguen como `href="#"`).
- Confirmar controles y requisitos con la build.
