# Sistema de Diseño e Identidad Visual — EcoSwipe (rediseno-v1.1)

Documento técnico del sistema de diseño, tokens, directrices de accesibilidad y excepciones funcionales implementadas para el prototipo de **EcoSwipe**.

---

## 1. Tokens de Diseño

### Paleta de Color Oficial
* **Verde Bosque** (`#12372A`): Color primario de marca. Usado para titulares, textos principales, botones secundarios, cabeceras y elementos estructurales.
* **Verde Hoja** (`#1E8449`): Color secundario de marca y acento activo. Usado para botones principales (`.btn-primary` con texto blanco), íconos destacados y enlaces de llamada a la acción.
* **Crema** (`#FBF7EE`): Fondo principal de la aplicación. Proporciona una base orgánica, cálida y artesanal que evita el blanco digital puro.
* **Menta** (`#DDF3E6`): Color de apoyo y contraste suave. Utilizado para badges (`badge-entrega`), bordes de tarjetas y contenedores secundarios.
* **Terracota** (`#E4793B`): Color de acento cálido y artesanal. Su uso está estrictamente regulado por reglas de contraste WCAG.
* **Gris Cálido** (`#6B6F6A`): Color neutro para metadatos, etiquetas secundarias y textos complementarios.
* **Blanco** (`#FFFFFF`): Fondo de tarjetas interactivas, modales y campos de formulario.

### Estados Derivados
* **Brand Hover** (`#196F3D`): Oscurecimiento del Verde Hoja para hover en `.btn-primary`.
* **Brand Active** (`#145A32`): Estado presionado en `.btn-primary`.
* **Brand Light / Tinte** (`#EAF3EB`): Fondo de acento sutil para contenedores.
* **Rojo Alerta** (`#B91C1C` / `#D32F2F`): Validación de campos requeridos y estados de error.

### Tipografía
* **Fredoka** (`500 Medium`, `600 SemiBold`, `700 Bold`): Exclusivamente para titulares (`h1` a `h3`), subtítulos principales y cifras numéricas (`.stat-figure`).
* **Inter** (`400 Regular`, `600 SemiBold`): Para todo el texto funcional de la interfaz. No se utilizan pesos 500 ni 700 para Inter.
  * **16px Regular (`text-base`, leading 1.5)**: Párrafos de lectura, guías explicativas y cuerpo descriptivo general.
  * **14px SemiBold (`text-sm font-semibold`)**: Exclusivo para controles (botones, inputs), etiquetas de formulario (`label`), badges, chips y metadatos complementarios.
  * **Textos menores a 14px**: Prohibidos según el brandbook.

### Radios y Elevaciones
* **Tarjetas y Contenedores**: `16px` (`rounded-tarjeta` / `--radio-tarjeta: 16px`).
* **Controles y Botones**: `14px` (`rounded-boton` / `--radio-boton: 14px`).
* **Píldoras y Badges**: `9999px` (`rounded-full`).
* **Sombras**: Sutiles y artesanales (`shadow-xs`, `shadow-sm`, `shadow-card`), sin efectos difuminados artificiales.

---

## 2. Reglas de Contraste WCAG 2.1 (Nivel AA)

Todas las combinaciones de la interfaz han sido verificadas con los tokens reales oficiales (`#12372A`, `#6B6F6A`, `#FBF7EE`, `#DDF3E6`, `#FFFFFF`):

1. **Verde Bosque (`#12372A`)**:
   * Sobre Crema (`#FBF7EE`): **12.23:1** (Cumple AAA).
   * Sobre Blanco (`#FFFFFF`): **13.08:1** (Cumple AAA).
   * Sobre Menta (`#DDF3E6`): **11.23:1** (Cumple AAA).
2. **Gris Cálido (`#6B6F6A`)**:
   * Sobre Crema (`#FBF7EE`): **4.78:1** (Cumple AA Normal ≥4.5:1).
   * Sobre Blanco (`#FFFFFF`): **5.11:1** (Cumple AA Normal ≥4.5:1).
   * Sobre Menta (`#DDF3E6`): **4.39:1** (Cumple AA Large ≥3.0:1; sobre Menta se usa texto mediano/negrita o tinte).
3. **Verde Hoja (`#1E8449`)**:
   * Sobre Blanco: **4.72:1** (Cumple AA Normal).
   * Sobre Crema: **4.41:1** (**Falla AA Normal <4.5:1**).
   * *Regla*: Verde Hoja sobre Crema solo está permitido en **Texto Grande** (≥24px regular o ≥18.66px negrita) o como ícono interactivo.
4. **Regla de Terracota (`#E4793B`)**:
   * Terracota sobre Crema: **2.77:1** (**PROHIBIDO para texto**; no cumple AA ni en texto grande).
   * Terracota sobre Blanco: **2.96:1** (**PROHIBIDO para texto**).
   * Terracota sobre Verde Bosque: **4.18:1** (Cumple AA únicamente en **Texto Grande** ≥18.66px negrita).
   * *Implementación*: En cifras métricas sobre fondo claro, el número se renderiza en **Verde Bosque** con una línea inferior decorativa Terracota (`.stat-figure`).
5. **Botones Primarios**:
   * Texto Blanco sobre Verde Hoja `#1E8449`: **4.72:1** (Cumple AA).
   * Hover (Blanco sobre `#196F3D`): **6.21:1** (Cumple AA).
   * Active (Blanco sobre `#145A32`): **8.27:1** (Cumple AA).

---

## 3. Excepciones Documentadas a "Lógica Intacta"

Para garantizar la integridad del prototipo sin alterar su modelo de datos ni su comportamiento funcional, se establecieron tres únicas excepciones debidamente aprobadas:

1. **Carrusel en Inicio (`Inicio.jsx`)**:
   * Se añadieron botones de navegación horizontal honesta ("Anterior" / "Siguiente", con tap targets de 44px) usando un `useRef` sobre el contenedor con scroll nativo suave. No se alteró el array de lotes ni se implementó un swipe de descarte destructivo.
2. **Reinicio de Filtros en Mercado (`Mercado.jsx`)**:
   * Se agregó el botón interactivo "Restablecer todos los filtros" en la vista de estado vacío para restablecer los estados existentes (`setTela('Todas')`, `setEntrega('todas')`, `setQuery('')`), mejorando la usabilidad sin crear estado nuevo.
3. **Modal de Trato Cerrado en DetalleLote (`DetalleLote.jsx`)**:
   * Se incorporó la vista intermedia con la mascota **Swipee** y la frase oficial de cierre de trato al confirmar la entrega ("Entregué"). Esta vista reutiliza el estado booleano existente `confirmDone` (pasando de `confirmDone ? "Trato cerrado" : "Confirmar entrega"`) sin crear estados adicionales ni alterar la mutación de datos.

---

## 4. Puntos Pendientes de Producto y Marca

1. **Discrepancia del Logo**:
   * El archivo SVG oficial entregado contiene el texto en una sola tinta Verde Bosque (`#1C3B20`) y en minúsculas continuas (`eco swipe`).
   * El Brandbook estipula la marca como `EcoSwipe` en dos palabras/tintas ("Eco" en Verde Bosque `#1C3B20` y "Swipe" en Verde Hoja `#1E8449`). Se respeta el SVG oficial entregado sin simulación tipográfica por software.
2. **Vectores Reales de Activos**:
   * Los archivos gráficos provistos originalmente en la carpeta de insumos contenían imágenes rasterizadas (mapas de bits PNG) encapsuladas dentro de etiquetas `<image>` en formato SVG. Para producción comercial se requiere la entrega de curvas vectoriales puras en formato SVG optimizado por el equipo de diseño gráfico.
3. **Swipe Real Ausente**:
   * El brandbook y la narrativa de producto contemplan gestos táctiles de deslizamiento tipo Tinder ("Me sirve" / "Paso"). El prototipo actual opera sobre un carrusel navegable y filtros por catálogo.
4. **Colores de Producto en Muestras de Tela**:
   * Los componentes de muestra fotográfica y placeholders requieren alimentarse de los colores reales del corte por cada lote publicado.
5. **Lista de Frases y su Estado de Aprobación**:
   * *Oficiales del Brandbook*:
     - *"¡Listo! Tu retazo ya está publicado."* (voz de Swipee en modal de éxito de Publicar).
     - *"Aún no hay coincidencias. Vuelvo a buscar por ti."* (voz de Swipee en estado vacío de Mercado).
   * *Propuestas y Aprobadas por el Usuario (no del Brandbook)*:
     - *"Encuentra el retazo exacto para tu confección."* (hero de Inicio).
     - *"¡Trato hecho! Ese retazo ya tiene dónde seguir."* (modal de confirmación de entrega / trato cerrado).
     - *"¿Ya entregaste o recibiste el lote?"* (pregunta de confirmación).
     - *"Balance de impacto del taller"* (alternativa a Calculadora de Impacto).
     - *"Talleres participantes en Gamarra"* (alternativa a Ranking de Talleres).
     - *"Taller activo en EcoSwipe"* / *"Actividad registrada"* (sustitución de Nivel del taller).
     - *"Material textil aprovechado"* (métrica de kg recuperados).
     - *"Retazos y saldos al peso. Algunos lotes también por metro."* (subtítulo de hero).
     - *"Lo último que subieron los talleres"* (lotes recientes).
     - *"Último lote publicado"* (etiqueta del lote protagonista).
     - *"Contacto directo de taller a taller, sin intermediarios."* (modal de contacto).
   * *Texto Preexistente del Prototipo Original (Baseline)*:
     - *"Tienda no encontrada / No encontramos ningún taller registrado con este identificador."* (`PerfilVendedor.jsx`, condición `if (!tienda)` preexistente desde el prototipo original).
   * *Escrito en el Rediseño [PENDIENTE DE APROBACIÓN]*:
     - *"Este taller no tiene lotes activos en este momento."* (`PerfilVendedor.jsx`, estado vacío; no existía en el commit baseline original `d63bcb4`).
     - *"Anota el peso y el precio del lote."* (`PublicarLote.jsx`, cabecera paso 2 — pose Anotando).
     - *"No encuentro ese lote. Revisa el enlace o vuelve al mercado."* (`DetalleLote.jsx` — pose Triste en lote no encontrado; en el baseline original `d63bcb4` ya existía el enlace de regreso `<Link to="/mercado">Ir al mercado</Link>`, el cual se conserva intacto).
6. **Ruta 404 Global en `App.jsx` (Pendiente de Producto)**:
   * Se constata que `App.jsx` no define una ruta comodín (`<Route path="*" ... />`), por lo que URLs arbitrarias no coincidentes no cargan una vista de error 404 formal. Bajo el mandato estricto de "lógica intacta", no se modificó el árbol de rutas ni se crearon páginas adicionales; queda agendado como requerimiento de producto para próximas versiones.

---

## 5. Swipee: Poses y Sistema de Ilustración (rediseno-v1.2.1)

### Regla Fundamental
La mascota original (`mascota.webp` / `mascota.png`) permanece intacta como versión principal y por defecto. Las nuevas emociones amplían el sistema visual sin alterar el modelo de datos, rutas ni lógica funcional preexistente.

### Factor de Escala Común y Relación Archivo -> CSS
Todas las poses se calibraron con un **factor de escala unificado (0.3045)** contra la mascota principal de referencia (cuerpo de pie = 380 px en el archivo fuente exportado, correspondiente a 147 px CSS en tamaño `md`).
* **Factor de densidad real Archivo -> CSS**: **~2.59×** (380 px / 147 px = 2.585×; no es 2.0× sino ~2.6×), garantizando nitidez Retina ultra-alta (>2.5×) ideal para pantallas móviles modernas de 3× sin degradación visual.
* **Alineación**: Todas las ilustraciones están alineadas por su base anatómica inferior (línea de apoyo de pies).
* **Validación**:
  - `capturas/swipee_validacion_magenta.png`: Inspección al 400% sobre `#FF00FF` certificando la remoción total de blancos encerrados (entre piernas, bajo carta, entre brazos) preservando 100% de los brillos en ojos y lágrimas.
  - `capturas/swipee_hoja_poses.png`: Hoja de verificación comparativa de las 7 poses sobre fondos Crema `#FBF7EE` y Verde Bosque `#12372A`.

### Tabla Final de Implementación de Poses (rediseno-v1.2.1)

| Pose | Pantalla / Momento | Archivo (`px`) | Tamaño CSS Final | Factor Real (Archivo/CSS) | Copy Asociado | Estado / Origen del Copy |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **`principal`** | Inicio (Hero de bienvenida) | 320 × 392 | 88 × 108 px (hero) | 3.63× | *“Encuentra el retazo exacto para tu confección.”* | Aprobado por el usuario |
| **`celebrando`** | PublicarLote (Modal de éxito) | 391 × 429 | 151 × 166 px (`md`) | 2.58× | *“¡Listo! Tu retazo ya está publicado.”* | **Oficial Brandbook** |
| **`celebrando`** | DetalleLote (Modal de trato cerrado) | 391 × 429 | 151 × 166 px (`md`) | 2.58× | *“¡Trato hecho! Ese retazo ya tiene dónde seguir.”* | Aprobado por el usuario |
| **`pensando`** | Mercado (Sin coincidencias de filtro) | 343 × 400 | 132 × 154 px (`md`) | 2.60× | *“Aún no hay coincidencias. Vuelvo a buscar por ti.”* | **Oficial Brandbook** |
| **`durmiendo`** | PerfilVendedor (Taller sin lotes activos) | 336 × 381 | 130 × 147 px (`md`) | 2.59× | *“Este taller no tiene lotes activos en este momento.”* | **Escrito en rediseño [Pendiente]** |
| **`anotando`** | PublicarLote (Cabecera paso 2: Peso/Precio) | 270 × 380 | 52 × 74 px (`sm`) | 5.14× | *“Anota el peso y el precio del lote.”* | **Escrito en rediseño [Pendiente]** |
| **`triste`** | DetalleLote (Lote no encontrado) | 271 × 380 | 105 × 147 px (`md`) | 2.58× | *“No encuentro ese lote. Revisa el enlace o vuelve al mercado.”* | **Escrito en rediseño [Pendiente]** (Enlace preexistente) |
| **`triste`** | PerfilVendedor (Tienda no encontrada) | 271 × 380 | 105 × 147 px (`md`) | 2.58× | *“Tienda no encontrada / No encontramos ningún taller registrado...”* | **Preexistente baseline original** |
| **`carta`** | *(Sin uso)* | 275 × 398 | 106 × 154 px (`md`) | 2.58× | — | Disponible en biblioteca |
| **`molesto`** | *(Sin uso)* | 227 × 384 | 88 × 148 px (`md`) | 2.59× | — | Disponible en biblioteca |

### Poses Sin Uso (Disponibles en Biblioteca)
* **`mascota-carta`**: Descartada en Inicio para evitar saturación y cumplir la regla de oro: *"Máximo una mascota por pantalla o modal visible"*. Queda disponible para futuros flujos de correspondencia, mensajería o guía de remisión.
* **`mascota-molesto`**: Sin uso por directriz de tono de marca: en EcoSwipe no se regaña al usuario, no se transmiten culpas ambientales y no hay estados de furia en las transacciones. Queda archivada en la biblioteca de activos.

### Especificaciones Técnicas del Componente `<Swipee />`
1. **Contenedor `<picture>`**: Entrega formato moderno WebP de alto rendimiento (20–38 KB) con respaldo PNG automático.
2. **Dimensiones explícitas**: `width` y `height` definidos de forma exacta según la escala del cuerpo para evitar saltos de layout (CLS = 0).
3. **Carga en modales y viewport prioritario**: `priority={true}` activa `loading="eager"` y `decoding="sync"` en el Hero de Inicio y en los modales instantáneos (éxito de publicación y trato cerrado) para evitar cualquier retardo de aparición. Se mantiene `loading="lazy"` en el resto de vistas.
4. **Regla de unicidad visual**: Se verificó exhaustivamente que ningún modal ni vista renderice simultáneamente más de una mascota visible en pantalla.
5. **Accesibilidad**: `alt=""` decorativo cuando el componente acompaña textos o titulares; texto alternativo semántico (`alt="Swipee, la hojita de EcoSwipe"`) en apariciones autónomas.
6. **Canal alfa y contraste**: Extracción de fondo con defringe asistido por alpha matting; verificado al 400% sobre Magenta (`#FF00FF`), Crema (`#FBF7EE`), Menta (`#DDF3E6`) y Blanco (`#FFFFFF`) con 0% de halo blanquecino o artefactos oscuros.

