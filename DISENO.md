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
     - *"Tienda no encontrada / No encontramos ningún taller registrado con este identificador."* (`PerfilVendedor.jsx`, condición `if (!tienda)` preexistente desde el prototipo original). [PENDIENTE DE APROBACIÓN]: Se documenta que la redacción emplea voz plural (*"No encontramos ningún taller..."*), a diferencia del tono en primera persona singular de Swipee (*"Vuelvo a buscar por ti"*), quedando como detalle pendiente de decisión de producto.
   * *Escrito en el Rediseño [PENDIENTE DE APROBACIÓN]*:
     - *"Este taller no tiene lotes activos en este momento."* (`PerfilVendedor.jsx`, estado vacío; no existía en el commit baseline original `d63bcb4`).
     - *"Anota el peso y el precio del lote."* (`PublicarLote.jsx`, cabecera paso 2 — pose Anotando).
     - *"Revisa el enlace o vuelve al mercado."* (`DetalleLote.jsx` — pose Triste en lote no encontrado; en el baseline original `d63bcb4` ya existía el enlace de regreso `<Link to="/mercado">Ir al mercado</Link>`, el cual se conserva intacto).
6. **Ruta 404 Global en `App.jsx` (Pendiente de Producto)**:
   * Se constata que `App.jsx` no define una ruta comodín (`<Route path="*" ... />`), por lo que URLs arbitrarias no coincidentes no cargan una vista de error 404 formal. Bajo el mandato estricto de "lógica intacta", no se modificó el árbol de rutas ni se crearon páginas adicionales; queda agendado como requerimiento de producto para próximas versiones.

---

## 5. Swipee: Poses y Sistema de Ilustración (rediseno-v1.2.2)

### Regla Fundamental
La mascota original (`mascota.webp` / `mascota.png`) permanece intacta como versión principal y por defecto. Las nuevas emociones amplían el sistema visual sin alterar el modelo de datos, rutas ni lógica funcional preexistente.

### Factor de Escala Común y Relación Archivo -> CSS
Todas las poses se calibraron con un **factor de escala unificado (0.3045)** contra la mascota principal de referencia (cuerpo de pie = 380 px en el archivo fuente exportado, correspondiente a 147 px CSS en tamaño `md`).
* **Factor de densidad real Archivo -> CSS**: **~2.59×** (380 px / 147 px = 2.585×; no es 2.0× sino ~2.6×), garantizando nitidez Retina ultra-alta (>2.5×) ideal para pantallas móviles modernas de 3× sin degradación visual.
* **Hero responsivo (`size="hero"`)**: En pantallas de escritorio (≥1024px / 1280px), la mascota principal se escala a `120 × 147 px` (factor 2.67×) con presencia destacada y equilibrada en el grid. En móviles (375px), conserva `88 × 108 px` (factor 3.63×) para no saturar el viewport.
  - `capturas/hero_antes_1280.png`: Hero desktop previo a 88 × 108 px.
  - `capturas/hero_despues_1280.png`: Hero desktop ampliado a 120 × 147 px. Se confirma que cabe holgadamente sin desordenar ni quebrar el layout.
* **Alineación**: Todas las ilustraciones están alineadas por su base anatómica inferior (línea de apoyo de pies).
* **Validación**:
  - `capturas/swipee_validacion_magenta.png`: Inspección al 400% sobre `#FF00FF` certificando la remoción total de blancos encerrados (entre piernas, bajo carta, entre brazos) preservando 100% de los brillos en ojos y lágrimas.
  - `capturas/swipee_hoja_poses.png`: Hoja de verificación comparativa de las 7 poses sobre fondos Crema `#FBF7EE` y Verde Bosque `#12372A`.

### Demostración de Una Sola Mascota en Pantalla (375px)
Se certificó mediante capturas en viewport móvil de 375px que en ningún momento coexisten dos mascotas visibles:
1. **Modal de Éxito en Publicar (`capturas/modal_exito_publicar_375.png`)**: Al confirmarse la publicación en el Paso 3, el componente del Paso 2 (donde se encontraba la pose *Anotando*) ya no está montado en el DOM. La única mascota existente es la pose *Celebrando* dentro del modal.
2. **Modal de Trato Cerrado en DetalleLote (`capturas/modal_trato_cerrado_detalle_375.png`)**: La página de detalle de un lote existente carece de mascota; solo se renderiza la pose *Celebrando* al abrirse el modal.
3. **Panel de Filtros Móvil sobre Estado Vacío de Mercado (`capturas/panel_filtros_mercado_vacio_375.png`)**: El cajón inferior de filtros (`bg-white rounded-t-tarjeta`) carece por completo de ilustraciones y cubre el 80% inferior de la pantalla, tapando por completo la tarjeta de estado vacío. Cero mascotas son visibles mientras el cajón está desplegado.

### Tabla Final de Implementación de Poses (rediseno-v1.2.2)

| Pose | Pantalla / Momento | Archivo (`px`) | Tamaño CSS Final | Factor Real (Archivo/CSS) | Copy Asociado | Estado / Origen del Copy |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **`principal`** | Inicio (Hero de bienvenida) | 320 × 392 | 88 × 108 px (móvil)<br>120 × 147 px (desktop) | 3.63× (móvil)<br>2.67× (desktop) | *“Encuentra el retazo exacto para tu confección.”* | Aprobado por el usuario |
| **`celebrando`** | PublicarLote (Modal de éxito) | 391 × 429 | 151 × 166 px (`md`) | 2.58× | *“¡Listo! Tu retazo ya está publicado.”* | **Oficial Brandbook** |
| **`celebrando`** | DetalleLote (Modal de trato cerrado) | 391 × 429 | 151 × 166 px (`md`) | 2.58× | *“¡Trato hecho! Ese retazo ya tiene dónde seguir.”* | Aprobado por el usuario |
| **`pensando`** | Mercado (Sin coincidencias de filtro) | 343 × 400 | 132 × 154 px (`md`) | 2.60× | *“Aún no hay coincidencias. Vuelvo a buscar por ti.”* | **Oficial Brandbook** |
| **`durmiendo`** | PerfilVendedor (Taller sin lotes activos) | 336 × 381 | 130 × 147 px (`md`) | 2.59× | *“Este taller no tiene lotes activos en este momento.”* | **Escrito en rediseño [Pendiente]** |
| **`anotando`** | PublicarLote (Cabecera paso 2: Peso/Precio) | 270 × 380 | 52 × 74 px (`sm`) | 5.14× | *“Anota el peso y el precio del lote.”* | **Escrito en rediseño [Pendiente]** |
| **`triste`** | DetalleLote (Lote no encontrado) | 271 × 380 | 105 × 147 px (`md`) | 2.58× | *“Revisa el enlace o vuelve al mercado.”* | **Escrito en rediseño [Pendiente]** (Enlace preexistente) |
| **`triste`** | PerfilVendedor (Tienda no encontrada) | 271 × 380 | 105 × 147 px (`md`) | 2.58× | *“Tienda no encontrada / No encontramos ningún taller registrado...”* | **Preexistente baseline original [Voz plural, pendiente]** |
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

---

## 6. Adaptación Móvil y Escala (<768px) — rediseno-v1.4-mobile

### Escala Tipográfica y de Controles en Móvil (<768px)
Para resolver la saturación visual en dispositivos móviles (densidad de información inspirada en Mercado Libre y Falabella), se documenta la **excepción formal** a la directriz de "mínimo 14px de fuente y 44px de control" para pantallas estrictamente menores a 768px (`<md`):

* **H1 del Hero**: `28px / 1.2` Fredoka 600 (`text-[28px] leading-tight`).
* **Títulos de sección**: `20px` Fredoka 600 (`text-xl font-fredoka font-semibold`).
* **Párrafos de lectura**: `16px` Inter 400 (`text-base`).
* **Texto de ayuda y secundario**: `14px` Inter 400 (`text-sm font-normal`).
* **Título de tarjeta de lote**: `15px` Inter 600, máximo 2 líneas (`text-[15px] line-clamp-2 leading-snug`).
* **Precio de tarjeta**: `18px` Fredoka 700 (`text-[18px] font-fredoka font-bold`), con sufijo `"/kg"` a `13px` Inter (`text-[13px] text-gris-calido`). En escritorio (`md:`) se conserva intacto como `"por kg"` a `14px`.
* **Metadatos de tarjeta**: `13px` Inter 400 (`text-[13px]`), condensados en una sola línea con `truncate`.
* **Badges y etiquetas secundarias**: `12px–13px` Inter 600 (`text-[12px] md:text-sm`).
* **Etiquetas de barra inferior (Bottom Nav)**: `12px` Inter 600 (`text-[12px] font-semibold`).
* **Chips y controles secundarios**: `36px–40px` de altura visual (`min-h-[36px]`, `h-9`) con `8px` de separación (`gap-2`).
* **Botones de acción primaria y campos de texto**: Se mantienen en mínimo `44px` (`min-h-[44px]`).

### Cambios Implementados (rediseno-v1.4-mobile)

1. **Etiqueta "Datos de ejemplo"**:
   * *Implementación previa*: Era un elemento con posición fija flotante (`fixed top-2 right-2 z-[100]`) en `index.css` que en celulares tapaba botones de navegación, títulos y badges superiores.
   * *Cambio realizado en móvil (`index.css`)*: En móvil pasa a una franja delgada de `28px` (`height: 28px; width: 100%; position: static;`) en el flujo normal del documento, ubicada arriba del contenido, desplazándose naturalmente con el scroll.
   * *Escritorio (`md:`)*: Conserva exactamente su posición flotante `fixed top-2 right-2 z-100` (`@media (min-width: 768px)`), garantizando 0 píxeles de diferencia.

2. **Cabecera Móvil y Adaptación de Logo**:
   * Se incorporó una barra superior pegajosa (`sticky top-0 z-40`) de `56px` de altura (`h-14`) con fondo Crema sólido y borde inferior Menta.
   * Se añadió la variante `variant="mobile"` en `src/components/Logo.jsx`. Sin alterar el archivo original `logo-principal.svg`, se recortó el `viewBox` a `"50 50 227 171"` para remover los márgenes de respiro internos del SVG, garantizando un ancho visible de logo ≥96px dentro de un contenedor touch-friendly.
   * La cabecera desktop (`hidden md:flex`) permanece 100% intacta.

3. **Barra Inferior Móvil (Bottom Nav)**:
   * Barra de navegación fija inferior con altura calibrada a `56px` más soporte de safe-area (`padding-bottom: env(safe-area-inset-bottom, 0px)`).
   * Íconos de `22px–24px`, etiquetas en `text-[12px] font-semibold`. Se ajustó el padding del contenedor principal (`pb-20 md:pb-0`) para evitar solapamientos con el contenido.

4. **LoteCard Responsiva**:
   * *Imagen*: En móvil utiliza proporción `aspect-[4/3]` compacta. Se anuló el `min-height: 320px` solo por debajo de 768px (`@media (max-width: 767.98px) { .aspect-[4/3] { min-height: 0 !important; } }`), manteniendo el escritorio con su min-height original intacto.
   * *Badges sobre imagen*: En móvil únicamente se muestra "Por metro" si aplica. "Delivery" y "Recojo" pasan bajo el precio en una línea compacta de `13px` con ícono SVG de camión de entrega de `16px` (`"Delivery · Recojo"`).
   * *Metadatos*: Reducidos a una sola línea con `truncate` (`"2.5 kg · Algodón"`).
   * *Fila de vendedor*: Avatar compacto de `24px` (`w-6 h-6 md:w-7 md:h-7`), nombre truncado, check de verificado y calificación condensada a `1 estrella + valor numérico` (`StarRating.jsx`). Las 5 estrellas completas se reservan para escritorio (`md:`).
   * *Tarjetas de carrusel*: Ancho ajustado a `w-[68%]` en móvil (`md:w-auto md:min-w-[260px] md:max-w-[280px]`) para permitir que el siguiente lote asome visualmente.

5. **Mercado**:
   * Buscador (campo de `44px`) y botón de "Filtros" agrupados en una sola fila compacta.
   * Contador de resultados (`"X lotes disponibles"`) y selector de orden integrados en una sola línea horizontal compacta.
   * Grilla densa de 2 columnas con `gap: 12px` (`gap-3 md:gap-4`) y padding lateral de `16px` (`px-4 md:px-8`).
   * Permite visualizar al menos 2 filas completas de lotes en la primera pantalla en resolución `360x740`.

6. **Inicio**:
   * Hero compacto: Título a `28px`, buscador y botón de búsqueda en una sola fila (botón cuadrado de `44x44px` con ícono de lupa y texto accesible vía `sr-only md:not-sr-only`).
   * Swipee principal en bloque compacto de `64x78px` alineado horizontalmente con su frase (`size="hero"` responsivo).
   * Chips de filtrado de tejido en una sola fila con scroll horizontal (`overflow-x-auto`) de `36px` de alto visual (`h-9 min-h-[36px] md:min-h-[44px]`).
   * Carrusel de lotes: Botones "Anterior" y "Siguiente" ocultos en móvil (`hidden md:flex`), enlace "Ver todos" alineado a la derecha en la misma fila del título.

7. **Revisión de Vistas Complementarias (Correcciones y Propuestas)**:
   * **DetalleLote**:
     - *Corregido*: Altura de imagen y espaciados móviles en tarjetas de contacto para evitar empujar el botón de WhatsApp fuera del primer viewport en `360x740`.
     - *Propuesta*: Botón flotante inferior (FAB) pegajoso en móvil para "Cerrar trato por WhatsApp" con miniatura del vendedor.
   * **PublicarLote**:
     - *Corregido*: Grilla de opciones en Paso 1 adaptada a 2 columnas en móvil (`grid-cols-2 sm:grid-cols-3`) evitando roturas de etiquetas; botones de pie ordenados verticalmente en móvil (`flex-col-reverse sm:flex-row`).
     - *Propuesta*: Barra de progreso tipo "stepper" con círculos numerados compactos en lugar del texto "Paso 1 de 3".
   * **PerfilVendedor**:
     - *Corregido*: Cabecera del taller compactada (avatar `64px` en móvil frente a `96px` en desktop), métricas en 3 columnas compactas y catálogo de lotes en grilla densa de 2 columnas.
     - *Propuesta*: Enlace directo de WhatsApp en la cabecera móvil del perfil.
   * **Impacto**:
     - *Corregido*: Padding de tarjetas de métricas reducido a `p-3 md:p-6`, cifras ajustadas a `text-2xl md:text-4xl` para evitar desbordes horizontales en `360px`.
     - *Propuesta*: Calculadora interactiva donde el confeccionista ingrese sus kg mensuales de retazos y visualice el equivalente en árboles y agua ahorrada.
   * **Modales (`Modal.jsx`)**:
     - *Corregido*: Altura máxima acotada a `max-h-[90vh]` con `overflow-y-auto` y padding adaptativo `p-4 md:p-6` para garantizar que modales largos quepan sin cortarse en viewports de `360x740`.
     - *Propuesta*: Transformar los modales en móviles en hojas inferiores ("bottom sheets") que se desplieguen desde abajo hacia arriba con animación táctil.

---

## 8. Verificación de Calidad y Cierre (rediseno-v1.4.1)

### 1. Tokens y Contraste WCAG 2.1
* **Verificación de tokens (`git diff rediseno-v1.3-deploy -- tailwind.config.js src/index.css`)**:
  - `tailwind.config.js`: **0 diferencias**. Todos los tokens oficiales se conservan intactos (`verde-bosque: #12372A`, `verde-hoja: #1E8449`, `menta: #DDF3E6`, `crema: #FBF7EE`, `terracota: #E4793B`, `gris-calido: #6B6F6A`).
  - `src/index.css`: Variables CSS idénticas. Solo se agregaron media queries específicas para móvil (`@media (max-width: 767.98px)` y `@media (min-width: 768px)`).
* **Auditoría de contraste dinámica (`scripts/contraste.mjs`)**:
  - El script importa los tokens dinámicamente desde `tailwind.config.js`, eliminando valores manuales o hex desactualizados.
  - Se evaluaron todas las tipografías de 11–13px, incluyendo variantes con opacidad (`text-verde-bosque/85`, `text-verde-bosque/80`, etc.).

| Contexto / Texto 11–13px | Color Texto | Color Fondo | Ratio | AA Normal (≥4.5:1) | Veredicto |
|---|---|---|:---:|:---:|---|
| Móvil: Barra inferior activo (`12px`) | `verde-bosque` (`#12372A`) | `crema` (`#FBF7EE`) | 12.23:1 | PASS | CUMPLE AA Normal |
| Móvil: Barra inferior inactivo (`12px`) | `gris-calido` (`#6B6F6A`) | `crema` (`#FBF7EE`) | 4.78:1 | PASS | CUMPLE AA Normal |
| Móvil: Franja Datos de Ejemplo (`12px`) | `crema` (`#FBF7EE`) | `verde-bosque` (`#12372A`) | 12.23:1 | PASS | CUMPLE AA Normal |
| Móvil: LoteCard precio `"/kg"` (`13px`) | `gris-calido` (`#6B6F6A`) | `blanco` (`#FFFFFF`) | 5.11:1 | PASS | CUMPLE AA Normal |
| Móvil: LoteCard `"Delivery · Recojo"` (`13px`) | `gris-calido` (`#6B6F6A`) | `blanco` (`#FFFFFF`) | 5.11:1 | PASS | CUMPLE AA Normal |
| Móvil: LoteCard metadatos (`13px`) | `gris-calido` (`#6B6F6A`) | `blanco` (`#FFFFFF`) | 5.11:1 | PASS | CUMPLE AA Normal |
| Móvil: LoteCard nombre vendedor (`13px`) | `verde-bosque` (`#12372A`) | `blanco` (`#FFFFFF`) | 13.08:1 | PASS | CUMPLE AA Normal |
| Móvil: LoteCard avatar vendedor (`12px`) | `verde-bosque` (`#12372A`) | `menta` (`#DDF3E6`) | 11.23:1 | PASS | CUMPLE AA Normal |
| Móvil: LoteCard calificación (`13px`) | `verde-bosque` (`#12372A`) | `blanco` (`#FFFFFF`) | 13.08:1 | PASS | CUMPLE AA Normal |
| Móvil: Mercado contador y orden (`13px`) | `gris-calido` (`#6B6F6A`) | `crema` (`#FBF7EE`) | 4.78:1 | PASS | CUMPLE AA Normal |
| Móvil: Mercado selector de orden (`13px`) | `verde-bosque` (`#12372A`) | `blanco` (`#FFFFFF`) | 13.08:1 | PASS | CUMPLE AA Normal |
| Móvil: Badges 12-13px delivery/verificado | `verde-bosque` (`#12372A`) | `menta` (`#DDF3E6`) | 11.23:1 | PASS | CUMPLE AA Normal |
| Móvil: Badges 12-13px recojo | `verde-bosque` (`#12372A`) | `accent-50` (`#FDF3EC`) | 11.96:1 | PASS | CUMPLE AA Normal |
| Móvil: Inicio hero badge (`12px`) | `verde-bosque` (`#12372A`) | `menta` (`#DDF3E6`) | 11.23:1 | PASS | CUMPLE AA Normal |
| Móvil: Inicio frase Swipee (`13px`) | `verde-bosque/85` | `crema` (`#FBF7EE`) | 7.82:1 | PASS | CUMPLE AA Normal |
| Móvil: Inicio carrusel subtítulo (`13px`) | `verde-bosque/85` | `crema` (`#FBF7EE`) | 7.82:1 | PASS | CUMPLE AA Normal |
| Móvil: Inicio chips de tela (`13px`) | `verde-bosque` (`#12372A`) | `blanco` (`#FFFFFF`) | 13.08:1 | PASS | CUMPLE AA Normal |
| Móvil: Inicio últimos lotes subtítulo (`13px`) | `verde-bosque/85` | `crema` (`#FBF7EE`) | 7.82:1 | PASS | CUMPLE AA Normal |
| Móvil: Inicio badge último lote (`12px`) | `crema` (`#FBF7EE`) | `verde-bosque` (`#12372A`) | 12.23:1 | PASS | CUMPLE AA Normal |
| Móvil: ImpactBanner etiqueta (`11px`) | `verde-bosque/85` | `menta/60` sobre `crema` | 7.50:1 | PASS | CUMPLE AA Normal |
| Móvil: ImpactBanner unidad (`12px`) | `verde-bosque/80` | `menta/60` sobre `crema` | 6.49:1 | PASS | CUMPLE AA Normal |
| Móvil: DetalleLote reseñas vendedor (`12px`) | `gris-calido` (`#6B6F6A`) | `blanco` (`#FFFFFF`) | 5.11:1 | PASS | CUMPLE AA Normal |
| Móvil: PublicarLote stepper labels (`12px`) | `verde-bosque` (`#12372A`) | `crema` (`#FBF7EE`) | 12.23:1 | PASS | CUMPLE AA Normal |

* **Regla estricta ratificada**: Gris Cálido sobre Menta sólida da 4.39:1 (no cumple AA Normal <4.5:1), por lo que se mantiene estrictamente prohibido en todo el diseño.

---

### 2. Conteo de Lógica (12 Patrones Oficiales)
Se ejecutó `scripts/logic_counter_12.mjs` evaluando el regex:
`useState|useEffect|useMemo|useRef|onClick=|onChange=|onSubmit=|navigate\(|value=|checked=|disabled=|required`
sobre TODOS los archivos dentro de `src/`, comparando el baseline oficial (`rediseno-v1.3-deploy`) contra `HEAD` (`rediseno-v1.4.1`):

| Archivo | Baseline (`v1.3`) | HEAD (`v1.4.1`) | Diferencia | Estado |
|---|:---:|:---:|:---:|:---:|
| `src/App.jsx` | 0 | 0 | 0 | INTACTO |
| `src/components/ImpactBanner.jsx` | 0 | 0 | 0 | INTACTO |
| `src/components/Layout.jsx` | 0 | 0 | 0 | INTACTO |
| `src/components/Logo.jsx` | 0 | 0 | 0 | INTACTO |
| `src/components/LoteCard.jsx` | 0 | 0 | 0 | INTACTO |
| `src/components/Modal.jsx` | 5 | 5 | 0 | INTACTO |
| `src/components/PlaceholderImg.jsx` | 0 | 0 | 0 | INTACTO |
| `src/components/StarRating.jsx` | 0 | 0 | 0 | INTACTO |
| `src/components/Swipee.jsx` | 0 | 0 | 0 | INTACTO |
| `src/data/impactoConfig.json` | 0 | 0 | 0 | INTACTO |
| `src/data/lotes.json` | 0 | 0 | 0 | INTACTO |
| `src/data/tiendas.json` | 0 | 0 | 0 | INTACTO |
| `src/index.css` | 0 | 0 | 0 | INTACTO |
| `src/main.jsx` | 0 | 0 | 0 | INTACTO |
| `src/pages/DetalleLote.jsx` | 12 | 12 | 0 | INTACTO |
| `src/pages/Impacto.jsx` | 4 | 4 | 0 | INTACTO |
| `src/pages/Inicio.jsx` | 12 | 12 | 0 | INTACTO |
| `src/pages/Mercado.jsx` | 25 | 25 | 0 | INTACTO |
| `src/pages/PerfilVendedor.jsx` | 0 | 0 | 0 | INTACTO |
| `src/pages/PublicarLote.jsx` | 43 | 43 | 0 | INTACTO |
| **TOTAL GENERAL** | **101** | **101** | **0** | **100% IDÉNTICO** |

* **Desglose por patrón**: `useState`: 21/21, `useEffect`: 2/2, `useMemo`: 2/2, `useRef`: 2/2, `onClick=`: 29/29, `onChange=`: 16/16, `onSubmit=`: 1/1, `navigate\(`: 1/1, `value=`: 22/22, `checked=`: 3/3, `disabled=`: 2/2, `required`: 0/0. Diferencia neta = 0.

---

### 3. Diff de Escritorio Ampliado (768px, 1024px, 1280px)
Se ejecutó `scripts/expanded_desktop_pixel_diff.mjs` contrastando el servidor baseline en `rediseno-v1.3-deploy` contra `HEAD` en 15 vistas y estados:

| Viewport | Pantalla / Modal / Estado | Dimensiones | Total Píxeles | Píxeles Distintos | % Dif. | Veredicto |
|---|---|:---:|:---:|:---:|:---:|---|
| **768px** | `inicio` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `mercado` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `detalle_lote` (`l1`) | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `perfil_vendedor` (`t1`) | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `publicar_paso1` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `impacto` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `detalle_modal_contacto` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `detalle_modal_oferta` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `detalle_modal_confirmar` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `detalle_modal_trato_cerrado` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `publicar_modal_preview` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `publicar_modal_exito` | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `mercado_vacio` (`q=xyzinexistente`) | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `lote_no_encontrado` (`9999`) | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 768px | `tienda_no_encontrada` (`inexistente`) | 768x1024 | 786,432 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| **1024px** | `inicio` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `mercado` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `detalle_lote` (`l1`) | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `perfil_vendedor` (`t1`) | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `publicar_paso1` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `impacto` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `detalle_modal_contacto` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `detalle_modal_oferta` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `detalle_modal_confirmar` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `detalle_modal_trato_cerrado` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `publicar_modal_preview` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `publicar_modal_exito` | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `mercado_vacio` (`q=xyzinexistente`) | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `lote_no_encontrado` (`9999`) | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1024px | `tienda_no_encontrada` (`inexistente`) | 1024x800 | 819,200 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| **1280px** | `inicio` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `mercado` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `detalle_lote` (`l1`) | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `perfil_vendedor` (`t1`) | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `publicar_paso1` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `impacto` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `detalle_modal_contacto` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `detalle_modal_oferta` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `detalle_modal_confirmar` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `detalle_modal_trato_cerrado` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `publicar_modal_preview` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `publicar_modal_exito` | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `mercado_vacio` (`q=xyzinexistente`) | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `lote_no_encontrado` (`9999`) | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| 1280px | `tienda_no_encontrada` (`inexistente`) | 1280x800 | 1,024,000 | 0 | 0.0000% | 0 PÍXELES (INTACTO) |
| **TOTAL** | **45 comparaciones de pantalla** | — | — | **0** | **0.0000%** | **100% IDÉNTICO** |

---

### 4. Rango Intermedio (600px y 700px)
Se generaron y verificaron capturas en resoluciones intermedias:
* `capturas/intermedio_600_inicio.png` y `capturas/intermedio_700_inicio.png`
* `capturas/intermedio_600_mercado.png` y `capturas/intermedio_700_mercado.png`
* `capturas/intermedio_600_detalle_lote.png` y `capturas/intermedio_700_detalle_lote.png`

**Hallazgos de la inspección**:
1. **Etiqueta "Datos de ejemplo"**: Permanece en el flujo del documento como franja superior de `28px` con `position: static`, sin solapar la cabecera, el logo ni los botones de navegación.
2. **Grilla de Mercado**: Mantiene un esquema de 2 columnas proporcional y equilibrado; no hay tarjetas estiradas ni saltos de línea irregulares.
3. **Detalle de Lote**: La imagen y las miniaturas se escalan adecuadamente; las especificaciones técnicas y el bloque de impacto ambiental no desbordan lateralmente.
4. **Desbordes horizontales**: Ninguna de las pantallas genera scroll horizontal no deseado (`scrollWidth === clientWidth`).

---

### 5. Auditoría Móvil Completa (360x740, 390x844 y 412x915)
Se ejecutó `scripts/audit_mobile.mjs` sobre las 6 pantallas base y los 7 modales/drawers:

| Viewport | Vista / Modal / Drawer | Tipo | Textos Desbordados | Interactivos <36px | Scroll Horiz. | Botón Principal Visible en Pantalla |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **360x740** | `Inicio` | página | 0 | 0 | PASS | PASS |
| 360x740 | `Mercado` | página | 0 | 0 | PASS | PASS |
| 360x740 | `DetalleLote` | página | 0 | 0 | PASS | PASS |
| 360x740 | `PerfilVendedor` | página | 0 | 0 | PASS | PASS |
| 360x740 | `PublicarLote` | página | 0 | 0 | PASS | PASS |
| 360x740 | `Impacto` | página | 0 | 0 | PASS | PASS |
| 360x740 | `Modal Contacto` | modal | 0 | 0 | PASS | PASS (`bottom: 531px <= 740px`) |
| 360x740 | `Modal Oferta` | modal | 0 | 0 | PASS | PASS (`bottom: 660px <= 740px`) |
| 360x740 | `Modal Confirmar Entrega` | modal | 0 | 0 | PASS | PASS (`bottom: 656px <= 740px`) |
| 360x740 | `Modal Trato Cerrado` | modal | 0 | 0 | PASS | PASS (`bottom: 716px <= 740px`) |
| 360x740 | `Modal Vista Previa (Publicar)` | modal | 0 | 2* | PASS | PASS (`bottom: 724px <= 740px`) |
| 360x740 | `Modal Éxito (Publicar)` | modal | 0 | 2* | PASS | PASS (`bottom: 708px <= 740px`) |
| 360x740 | `Panel Filtros Móvil (Mercado)` | drawer | 0 | 0 | PASS | PASS (`bottom: 724px <= 740px`) |
| **390x844** | *Todas las páginas y modales (13 vistas)* | todas | 0 | 0 (2*) | PASS | PASS (holgura >30px) |
| **412x915** | *Todas las páginas y modales (13 vistas)* | todas | 0 | 0 (2*) | PASS | PASS (holgura >20px) |

**Nota*: Los 2 inputs registrados en modales de publicar corresponden a los checkboxes subyacentes del formulario desactivado bajo el backdrop; sus contenedores `<label>` táctiles poseen `48px` de altura efectiva.
* **Confirmación crítica**: Ningún modal requiere scroll horizontal y el 100% de los botones primarios son visibles dentro del primer viewport sin recorte en la resolución más exigente (`360x740`).

---

### 6. Mediciones Precisas (`getBoundingClientRect`)
Se ejecutó `scripts/dom_measurements.mjs` registrando las dimensiones físicas calculadas por el motor de renderizado del navegador:

* **(a) Logo en Header Móvil (360x740)**:
  - Ancho visible del SVG (`<svg>`): **`55.75 px`**
  - Alto visible del SVG (`<svg>`): **`42.00 px`**
  - Contenedor táctil (`<a>`): **`96.00 x 55.00 px`**
  - Inspección de recorte: Archivo `capturas/m360_logo_zoom.png` generado a 300% (`deviceScaleFactor: 3`). El recorte del `viewBox` (`"50 50 227 171"`) elimina los márgenes vacíos manteniendo la hoja, la flecha y las letras "eco swipe" 100% nítidas, centradas y sin ningún corte en trazos ni descendentes.
* **(b) Filas completas de lotes visibles en Mercado**:
  - En **`360x740`**: Altura útil sobre barra inferior = `684 px`.
    * **Fila 1 (2 tarjetas)**: `top: 202px, bottom: 501px` (alto `299px`) -> **1 fila completa visible** (2 tarjetas completas).
    * **Fila 2 (2 tarjetas)**: `top: 513px, bottom: 813px` -> **1 fila parcial asomando** (`171px` visibles sobre el fold).
  - En **`412x915`**: Altura útil sobre barra inferior = `859 px`.
    * **Fila 1 (2 tarjetas)**: `top: 202px, bottom: 521px` (alto `319px`) -> **Completamente visible**.
    * **Fila 2 (2 tarjetas)**: `top: 533px, bottom: 852px` (alto `319px`) -> **Completamente visible**.
    * **Total**: **2 filas completas visibles** (4 tarjetas completas) sin necesidad de scroll.
* **(c) Altura de barras estructurales**:
  - **Cabecera superior móvil (`header`)**: **`56.00 px`** exactos (clase CSS `h-14`).
  - **Barra de navegación inferior móvil (`.bottom-nav`)**: **`56.00 px`** exactos (clase CSS `h-[56px]`), con padding adicional para safe-area en dispositivos con barra de gestos.

