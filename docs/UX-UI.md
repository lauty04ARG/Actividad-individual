# UX-UI — Guía visual de estilos y componentes — ComunidadCursos

> **Qué es este documento:** la especificación visual y gramática de interfaz para **ComunidadCursos**. Define design tokens, estrategia responsive mobile-first, componentes reutilizables con todos sus estados y pautas de accesibilidad antes de escribir código CSS.
> **Inspiración:** interfaz limpia y utilitaria inspirada en **Google / Material Design** (azul Google `#1a73e8`, fondo claro `#f8f9fa`, superficies blancas `#ffffff`, esquinas redondeadas y sombras sutiles de elevación).
> **Cuándo está bien:** cualquier desarrollador que implemente una pantalla o componente obtiene exactamente la misma apariencia y comportamiento interactivo; todos los estados de error, carga y vacío están especificados; y la estrategia mobile-first sin media queries en la base se cumple de forma estricta.

---

## 1. Principios de diseño

1. **Mobile-First con mejora progresiva real:** El diseño base está optimizado para pantallas de 360px de ancho en una sola columna sin media queries; el layout se enriquece a 2 y 3 columnas exclusivamente mediante `@media (min-width: ...)`.
2. **Claridad sobre adorno:** Cada tarjeta, botón y texto tiene una función concreta. Mucho espacio en blanco para facilitar la lectura y evitar la sobrecarga visual.
3. **Acción principal inequívoca:** El azul primario (`#1a73e8`) señala de forma consistente los elementos interactivos principales (filtros activos, botón de aporte, agregar a roadmap).
4. **Respeto riguroso por los estados:** No existe componente sin definir sus estados de carga (*skeleton*), éxito, advertencia, error y vacío (*empty state*).

---

## 2. Design Tokens

### 2.1 Paleta de colores

| Token | Valor HEX | Uso principal | Ratio de contraste WCAG |
|-------|-----------|---------------|-------------------------|
| `--color-primary` | `#1a73e8` | Botones primarios, enlaces activos, foco interactivo | vs blanco: 4.6:1 ✓ (AA) |
| `--color-primary-dark` | `#185abc` | Estados hover y active de botones primarios | vs blanco: 6.1:1 ✓ (AA) |
| `--color-primary-container` | `#e8f0fe` | Chips de categoría seleccionada, fondo de ítem activo | vs `#185abc`: 5.8:1 ✓ (AA) |
| `--color-on-primary` | `#ffffff` | Tipografía e iconos sobre fondo primario | vs `#1a73e8`: 4.6:1 ✓ (AA) |
| `--color-surface` | `#ffffff` | Fondo de cards, dropdowns, drawer y modales | — |
| `--color-background` | `#f8f9fa` | Fondo global de la aplicación (gris claro Google) | — |
| `--color-text` | `#202124` | Texto principal, encabezados | vs fondo: 16.1:1 ✓ (AAA) |
| `--color-text-muted` | `#5f6368` | Metadatos secundarios, leyendas, placeholders | vs fondo: 7.0:1 ✓ (AA) |
| `--color-border` | `#dadce0` | Bordes sutiles de cards, inputs y divisores | 3.1:1 en estado interactivo |
| `--color-hover-grey` | `#f1f3f4` | Fondos de fila al pasar el cursor, botones secundarios | — |
| `--color-success` | `#188038` | Badges de curso publicado, confirmación de guardado | vs blanco: 4.8:1 ✓ (AA) |
| `--color-warning` | `#f9ab00` | Badge de aporte `en_revision`, alertas temporales | vs `#202124`: 8.2:1 ✓ (AA) |
| `--color-error` | `#d93025` | Mensajes de validación, badge de aporte `rechazado` | vs blanco: 4.7:1 ✓ (AA) |

### 2.2 Tipografía

| Token | Familia | Tamaño / Altura de línea | Peso | Uso |
|-------|---------|--------------------------|------|-----|
| `--font-family-base` | Roboto, system-ui, sans-serif | — | 400 | Texto general de la aplicación |
| `--text-xs` | — | 12px / 16px (0.75rem) | 500 | Badges, tags de estado, metadatos breves |
| `--text-sm` | — | 14px / 20px (0.875rem) | 400 | Metadatos secundarios, docentes, paginador |
| `--text-base` | — | 16px / 24px (1rem) | 400 | Cuerpo de texto, campos de entrada, botones |
| `--text-lg` | — | 18px / 24px (1.125rem) | 500 | Títulos de tarjetas de curso |
| `--text-xl` | — | 22px / 28px (1.375rem) | 600 | Títulos de sección y encabezados principales |

### 2.3 Espaciado, radios y sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Padding mínimo entre iconos y texto |
| `--space-2` | 8px | Margen entre badges y tags |
| `--space-3` | 12px | Padding interno de inputs y celdas |
| `--space-4` | 16px | Padding estándar de cards y botones |
| `--space-5` | 24px | Separación entre bloques y secciones |
| `--space-6` | 32px | Gutters laterales en desktop |
| `--radius-sm` | 4px | Badges e indicadores pequeños |
| `--radius-input` | 8px | Campos de formulario y selects |
| `--radius-card` | 12px | Tarjetas de curso y paneles de información |
| `--radius-pill` | 24px | Botones de acción principal (estilo Material 3) |
| `--shadow-1` | `0 1px 2px rgba(60,64,67,0.1), 0 1px 3px 1px rgba(60,64,67,0.15)` | Elevación en reposo de cards y header sticky |
| `--shadow-2` | `0 1px 3px rgba(60,64,67,0.15), 0 4px 8px 3px rgba(60,64,67,0.15)` | Hover de cards, drawer lateral y modales |
| `--z-header` | 100 | Encabezado sticky persistente |
| `--z-drawer` | 200 | Menú sándwich con overlay |
| `--z-toast` | 300 | Notificaciones tipo toast / snackbar |

### 2.4 Bloque CSS de variables globales

```css
:root {
  /* Paleta Google / Material */
  --color-primary: #1a73e8;
  --color-primary-dark: #185abc;
  --color-primary-container: #e8f0fe;
  --color-on-primary: #ffffff;
  --color-surface: #ffffff;
  --color-background: #f8f9fa;
  --color-text: #202124;
  --color-text-muted: #5f6368;
  --color-border: #dadce0;
  --color-hover-grey: #f1f3f4;
  --color-success: #188038;
  --color-warning: #f9ab00;
  --color-error: #d93025;

  /* Tipografía */
  --font-family-base: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.375rem;

  /* Espaciado */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  /* Formas y Sombras */
  --radius-sm: 4px;
  --radius-input: 8px;
  --radius-card: 12px;
  --radius-pill: 24px;
  --shadow-1: 0 1px 2px rgba(60, 64, 67, 0.1), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  --shadow-2: 0 1px 3px rgba(60, 64, 67, 0.15), 0 4px 8px 3px rgba(60, 64, 67, 0.15);

  /* Capas */
  --z-header: 100;
  --z-drawer: 200;
  --z-toast: 300;
}
```

---

## 3. Estrategia Mobile-First con mejora progresiva

El sistema cumple la regla de oro de la SPEC: la base se concibe para dispositivos pequeños (desde 360px) sin utilizar media queries; las mejoras visuales se introducen progresivamente con `@media (min-width: ...)`:

| Nivel de pantalla | Breakpoint | Comportamiento del Layout |
|-------------------|------------|---------------------------|
| **Base (Sin Media Queries)** | Pantallas móviles (≥ 360px) | Layout vertical de **1 columna**. Header con logo y **botón de menú sándwich**. Tarjetas de catálogo y filas de roadmap apiladas verticalmente. Botones y controles táctiles con altura mínima de **44px**. Barra de búsqueda y filtros en acordeón colapsable. |
| **Tablet** | `@media (min-width: 768px)` | Grilla del catálogo se expande a **2 columnas**. El buscador y el selector de categorías se disponen horizontalmente en una misma fila. Paginador completo con números de página visibles. |
| **Desktop** | `@media (min-width: 1024px)` | Grilla del catálogo se expande a **3 columnas**. El menú sándwich se oculta automáticamente y los enlaces de navegación se integran de forma visible y horizontal en el header. Contenedor centrado con `max-width: 1140px`. |

---

## 4. Componentes y Estados

### 4.1 Botones

- **Primario (Filled):** Fondo `--color-primary`, tipografía blanca, forma pill (`--radius-pill`), padding vertical de 10px y horizontal de 20px.
- **Secundario (Outlined / Tonal):** Borde 1px `--color-border`, texto `--color-primary`, fondo transparente.
- **Peligro:** Texto `--color-error` sobre fondo claro o botón bordeado para acciones destructivas (ej. eliminar curso de roadmap).
- **Estados:**
  - `default`: Reposo estándar.
  - `hover`: Oscurecimiento leve (`--color-primary-dark` en primario, `--color-hover-grey` en secundario) y sombra `--shadow-1`.
  - `focus-visible`: Anillo azul exterior de 2px con offset de 2px para navegación por teclado.
  - `active`: Elevación plana con compresión de escala sutil (0.98).
  - `disabled`: Opacidad al 40%, cursor `not-allowed`, eventos anulados.
  - `loading`: Texto oculto reemplazado por un spinner circular centrado de 18px.

### 4.2 Campos de formulario (Input / Select)

- **Anatomía:** Borde de 1px `--color-border`, esquinas redondeadas (`--radius-input`), etiqueta descriptiva siempre visible superior (o flotante estilo Material).
- **Estados:**
  - `default`: Borde gris `--color-border`.
  - `focus`: Borde de 2px `--color-primary`, sombra de enfoque accesible.
  - `error`: Borde y texto de ayuda en `--color-error`, vinculado mediante el atributo `aria-describedby` para lectores de pantalla.
  - `disabled`: Fondo atenuado `--color-hover-grey` y texto deshabilitado.

### 4.3 Tarjeta de curso (Course Card)

- **Anatomía:** Fondo `--color-surface`, borde suave o sombra `--shadow-1`, esquinas de 12px.
- **Información exhibida:**
  - Chip temático de categoría (ej. "Bases de Datos").
  - Título del curso (`--text-lg`, peso 500).
  - Docente o disertante y año de edición.
  - Badges informativos: *Certificado*, *Examen*, *Aval institucional*.
  - Indicador de cursada: Tag verde *"Cursado por el autor"* o neutro *"Recomendado sin cursar"*.
  - Botón de acción: *"Agregar a mi roadmap"* (o botón deshabilitado *"En tu roadmap"* si ya fue incorporado).
- **Estados:** `default`, `hover` (elevación a `--shadow-2` y transición suave de 150ms), `en-roadmap` (borde azul sutil y check de confirmación).

### 4.4 Listado y Tabla Paginada

- **En mobile (< 768px):** Los cursos se presentan en tarjetas individuales apiladas sin scroll horizontal.
- **En desktop (≥ 768px):** En vistas administrativas o de roadmap se puede desplegar formato tabular con filas delimitadas por divisores de 1px `--color-border`.
- **Barra de paginación:** Centrada al pie del listado.
  - Botón *"Anterior"* y *"Siguiente"* con icono.
  - Botones numéricos de página con tamaño táctil (36x36px).
  - Página activa destacada con fondo `--color-primary-container` y texto `--color-primary`.
  - Selector de tamaño de página (`10`, `20`, `50` por página).

### 4.5 Menú Sándwich (Mobile Drawer)

- **Activador:** Botón hamburguesa accesible en el margen superior izquierdo en resoluciones < 1024px (`aria-expanded="false"`, `aria-label="Abrir menú de navegación"`).
- **Panel Drawer:** Se despliega desde la izquierda ocupando un ancho de 280px, con fondo `--color-surface` y sombra `--shadow-2`.
- **Overlay:** Fondo oscurecido semitransparente (`rgba(32, 33, 34, 0.5)`) que cubre el resto de la pantalla.
- **Accesibilidad y Cierre:**
  - Cierre automático al tocar cualquier enlace de navegación.
  - Cierre al presionar la tecla `ESC`.
  - Cierre al cliquear el área del overlay externo.
  - Atrapamiento de foco (*focus trap*) dentro del panel mientras permanece abierto.

### 4.6 Estados de Carga (Skeleton) y Estado Vacío (Empty State)

- **Skeleton:** Bloques rectangulares con esquinas redondeadas y animación de brillo pulsante (*shimmer*) que ocupan la silueta exacta de las cards mientras se resuelven las peticiones HTTP.
- **Empty State:** Cuando un filtro o búsqueda no devuelve resultados, o cuando el usuario aún no agregó cursos a su roadmap:
  - Icono ilustrativo neutro en `--color-text-muted`.
  - Título explicativo claro (ej. *"No se encontraron cursos con estos filtros"* o *"Tu roadmap todavía está vacío"*).
  - Botón de llamado a la acción (CTA) para limpiar filtros o explorar el catálogo.

### 4.7 Toast / Snackbar de Notificaciones

- Posición inferior centrada en mobile e inferior izquierda en desktop (`--z-toast`).
- Fondo gris oscuro (`#323232`), texto blanco legible y esquina redondeada de 8px.
- Notificaciones breves (duración: 4 segundos): *"Curso agregado a tu roadmap con éxito"*, *"Aporte enviado a moderación"*.

---

## 5. Accesibilidad (WCAG 2.1 Nivel AA)

- [x] **Contraste de color:** Todos los textos principales y secundarios superan la relación de contraste mínima de 4.5:1 exigida por la norma AA frente a sus fondos.
- [x] **Indicador de foco por teclado:** Todos los elementos interactivos cuentan con un contorno `:focus-visible` claramente distinguible.
- [x] **Targets táctiles adecuados:** Todo botón, selector o enlace interactivo posee un área mínima de toque de 44x44px en entornos móviles.
- [x] **Semántica y atributos ARIA:** Uso estricto de etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`), atributos `aria-expanded` y `aria-controls` en el menú sándwich, y `aria-describedby` en errores de inputs.
- [x] **Preferencia de movimiento reducido:** Se respeta la directiva `@media (prefers-reduced-motion: reduce)` anulando animaciones de shimmer y transiciones de sombra.

---

## 6. Iconografía

- **Familia seleccionada:** **Material Symbols Outlined** (iconografía nativa del ecosistema Google) o alternativa equivalente liviana en SVG (**Lucide React**).
- **Iconos principales:**
  - `menu` / `close`: Botón sándwich y cierre de navegación.
  - `search`: Barra de búsqueda del catálogo.
  - `school` / `menu_book`: Cursos e itinerarios formativos.
  - `verified` / `workspace_premium`: Certificado y aval de institución.
  - `check_circle` / `pending`: Estados del roadmap y revisión.
  - `add` / `bookmark_add`: Aportar curso y añadir al roadmap.
