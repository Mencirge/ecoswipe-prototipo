# Sistema de Diseño e Identidad Visual — EcoSwipe (rediseno-v1.1)

Documento técnico del sistema de diseño, tokens, directrices de accesibilidad y excepciones funcionales implementadas para el prototipo de **EcoSwipe**.

---

## 1. Tokens de Diseño

### Paleta de Color Oficial
* **Verde Bosque** (`#1C3B20`): Color primario de marca. Usado para titulares, textos principales, botones secundarios, cabeceras y elementos estructurales.
* **Verde Hoja** (`#1E8449`): Color secundario de marca y acento activo. Usado para botones principales (`.btn-primary` con texto blanco), íconos destacados y enlaces de llamada a la acción.
* **Crema** (`#FBF7EE`): Fondo principal de la aplicación. Proporciona una base orgánica, cálida y artesanal que evita el blanco digital puro.
* **Menta** (`#C8E6C9`): Color de apoyo y contraste suave. Utilizado para badges (`badge-entrega`), bordes de tarjetas y contenedores secundarios.
* **Terracota** (`#E4793B`): Color de acento cálido y artesanal. Su uso está estrictamente regulado por reglas de contraste WCAG.
* **Gris Cálido** (`#5A6B5C`): Color neutro para metadatos, etiquetas secundarias y textos complementarios.
* **Blanco** (`#FFFFFF`): Fondo de tarjetas interactivas, modales y campos de formulario.

### Estados Derivados
* **Brand Hover** (`#196F3D`): Oscurecimiento del Verde Hoja para hover en `.btn-primary`.
* **Brand Active** (`#145A32`): Estado presionado en `.btn-primary`.
* **Brand Light / Tinte** (`#EAF3EB`): Fondo de acento sutil para contenedores.
* **Rojo Alerta** (`#B91C1C`): Validación de campos requeridos y estados de error.

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

Todas las combinaciones de la interfaz han sido verificadas mediante `scripts/contraste.mjs`:

1. **Verde Bosque**:
   * Sobre Crema: **11.58:1** (Cumple AAA).
   * Sobre Blanco: **12.38:1** (Cumple AAA).
   * Sobre Menta: **9.21:1** (Cumple AAA).
2. **Gris Cálido**:
   * Sobre Crema: **5.32:1** (Cumple AA Normal ≥4.5:1).
   * Sobre Blanco: **5.69:1** (Cumple AA Normal ≥4.5:1).
   * Sobre `bg-menta/60` (mezclado en Crema): **4.64:1** (Cumple AA Normal).
   * *Restricción*: Sobre Menta sólida pura `#C8E6C9` da 4.23:1 (solo apto para texto grande; en texto regular se usa tinte o Crema).
3. **Verde Hoja**:
   * Sobre Blanco: **4.72:1** (Cumple AA Normal).
   * Sobre Crema: **4.41:1** (**Falla AA Normal <4.5:1**).
   * *Regla*: Verde Hoja sobre Crema solo está permitido en **Texto Grande** (≥24px regular o ≥18.66px negrita) o como ícono interactivo.
4. **Regla de Terracota**:
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
5. **Lista de Frases Propuestas Pendientes de Aprobación Formal**:
   * *"Balance de impacto del taller"* (propuesta alternativa a "Calculadora de Impacto").
   * *"Talleres participantes en Gamarra"* (propuesta alternativa a "Ranking de Talleres").
   * *"Taller activo en EcoSwipe"* / *"Actividad registrada"* (propuesta para sustituir "Nivel del taller", dado que `tiendas.json` no cuenta con gamificación de niveles registrada).
   * *"Material textil aprovechado"* (propuesta de métrica para kilogramos recuperados).
   * *"Retazos y saldos al peso. Algunos lotes también por metro."* (subtítulo de hero).
   * *"Lo último que subieron los talleres"* (sección de lotes recientes).
   * *"Último lote publicado"* (etiqueta del lote reciente protagonista).
   * *"Contacto directo de taller a taller, sin intermediarios."* (modal de contacto).
   * *"¡Trato hecho! Ese retazo ya tiene dónde seguir."* (voz de Swipee en modal de confirmación).
   * *"¡Listo! Tu retazo ya está publicado."* (voz de Swipee en modal de publicación).
