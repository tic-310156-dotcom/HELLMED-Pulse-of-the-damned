# assets/personajes/

Imágenes **optimizadas** de los personajes (las genera `tools/optimizar_imagenes.py`).
No pongas aquí los originales: van en `originales/personajes/`.

| Personaje      | Nombre base que espera `app.js` |
|----------------|---------------------------------|
| Hermano Cruz   | `hermano-cruz`                  |
| Phantom        | `phantom`                       |
| La Gárgola     | `gargola`                       |
| La Muerte      | `muerte`                        |
| El Minotauro   | `minotauro`                     |
| Hermano Cruz (sacerdote) | `hermano-cruz-sacerdote` (solo galería) |

Por cada nombre base deben existir 4 archivos:
`<base>-400.webp`, `<base>-800.webp`, `<base>-1200.webp`, `<base>-800.jpg`.
Proporción: **3:4 (vertical)**. Mientras no existan, la web muestra las iniciales.
Para agregar otro personaje: añádelo en `CHARACTERS` y/o `GALERIA` dentro de `app.js`.
