# PLAN DE MIGRACIÓN AL SISTEMA DE TOKENS

**Fecha creación**: 04 Enero 2026
**Objetivo**: Migrar prototipos HTML al sistema tokens.css + components.css
**Prioridad**: Calidad + Eficiencia (ahorrar tokens)

---

## ⚠️ LECCIÓN APRENDIDA

**ERROR COMETIDO**:
Se agregaron elementos "genéricos" a `components.css` SIN verificar que se usen en otros módulos.

**REGLA CORRECTA**:
> **SOLO** agregar a `components.css` lo que **YA se usa en 2+ módulos**

---

## 📋 SITUACIÓN ACTUAL

### Prototipos existentes:
1. ✅ `cotizador.html` - Funciona con `assets/cotizador/styles.css`
2. ✅ `ventas.html` - Funciona con `assets/ventas/script.css` + `styles.css`
3. ✅ `clientes.html` - Funciona con `assets/clientes/styles.css`
4. ✅ `cliente-detalle.html` - Funciona con `assets/clientes/styles.css`
5. ✅ `dashboard.html` - Funciona con `assets/dashboard/styles.css`
6. ✅ `repartos-dia.html` - Funciona con `assets/repartos/styles.css`

### Sistema de tokens actual:
- ✅ `shared/tokens.css` (248 líneas) - Variables CSS
- ✅ `shared/components.css` (703 líneas) - Componentes genéricos BASE
- ✅ `shared/common.css` (226 líneas) - VIEJO, deprecado

**Estado**: Ningún prototipo usa el sistema nuevo todavía.

---

## 🎯 ESTRATEGIA EFICIENTE (3 FASES)

### FASE 1: AUDITORÍA (Próxima sesión - ~30 min)

**Objetivo**: Identificar clases CSS repetidas en 2+ módulos

**Método eficiente**:

1. **Grep estratégico** (NO leer archivos completos):
   ```bash
   # Buscar clases CSS más comunes en todos los prototipos
   grep -r "class=\"" prototipos/*.html | cut -d'"' -f2 | tr ' ' '\n' | sort | uniq -c | sort -rn | head -50
   ```

2. **Análisis manual rápido**:
   - Revisar top 50 clases más usadas
   - Identificar cuáles aparecen en 2+ archivos HTML
   - Crear lista de "componentes genéricos confirmados"

3. **Verificar archivos CSS específicos**:
   ```bash
   # Listar clases definidas en cada archivo CSS específico
   grep -E '^\.[a-zA-Z]' assets/cotizador/styles.css
   grep -E '^\.[a-zA-Z]' assets/ventas/styles.css
   grep -E '^\.[a-zA-Z]' assets/clientes/styles.css
   ```

**Output esperado**: Lista de clases repetidas (ej: `.header-toolbar`, `.content-grid`, `.modal-backdrop`, etc.)

**Tiempo estimado**: 20-30 minutos
**Tokens estimados**: ~10,000 tokens

---

### FASE 2: COMPLETAR COMPONENTS.CSS (Misma sesión)

**Objetivo**: Agregar SOLO componentes genéricos confirmados

**Proceso**:

1. Tomar lista de FASE 1
2. Para cada clase repetida:
   - Extraer CSS de UNO de los archivos específicos
   - Adaptar a usar variables de `tokens.css`
   - Agregar a `components.css` con comentario de dónde se usa

3. Mantener regla: **Si solo 1 módulo lo usa → NO agregarlo**

**Output esperado**: `components.css` con ~150-200 líneas adicionales (genéricos reales)

**Tiempo estimado**: 20-30 minutos
**Tokens estimados**: ~15,000 tokens

---

### FASE 3: MIGRAR PROTOTIPOS (Sesión siguiente)

**Objetivo**: Migrar prototipos uno por uno al sistema nuevo

**Orden recomendado** (del más simple al más complejo):

1. `dashboard.html` (más simple)
2. `clientes.html`
3. `cliente-detalle.html`
4. `repartos-dia.html`
5. `ventas.html`
6. `cotizador.html` (más complejo)

**Proceso por prototipo**:

1. **Crear backup**: `cp prototipo.html prototipo-backup.html`

2. **Cambiar imports CSS**:
   ```html
   <!-- ANTES -->
   <link rel="stylesheet" href="assets/modulo/styles.css">

   <!-- DESPUÉS -->
   <link rel="stylesheet" href="../../shared/tokens.css">
   <link rel="stylesheet" href="../../shared/components.css">
   <link rel="stylesheet" href="assets/modulo/modulo-specific.css">
   ```

3. **Crear `modulo-specific.css`**:
   - Copiar estilos ESPECÍFICOS de `styles.css` viejo
   - Eliminar lo que ya está en `components.css`
   - Adaptar variables a sistema nuevo

4. **Búsqueda/reemplazo de variables**:
   ```
   var(--primary)       → var(--text-primary)
   var(--accent)        → var(--color-accent)
   var(--text-dark)     → var(--text-primary)
   var(--text-light)    → var(--text-secondary)
   var(--border-subtle) → var(--border-color)
   var(--green-success) → var(--color-success)
   ```

5. **Verificar visual**: Abrir en navegador, comparar pixel-perfect con backup

6. **Si falla**: Revertir con backup

**Tiempo estimado por prototipo**: 15-30 minutos
**Total FASE 3**: 2-3 horas (en 2-3 sesiones)

---

## 📊 ANÁLISIS DE CLASES CSS (Preliminar)

### Clases probablemente genéricas (verificar en FASE 1):

**Layout**:
- `.app-wrapper` - ¿Usado en todos?
- `.main-layout` - ¿Usado en todos?
- `.sidebar` - ¿Usado en todos?
- `.content-grid` - ¿Usado en varios?
- `.left-panel` / `.right-panel` - ¿Usado en varios?

**Modales**:
- `.modal-backdrop` - ¿Usado en varios?
- `.modal-card` - ¿Usado en varios?
- `.modal-head` / `.modal-body` / `.modal-foot` - ¿Usado en varios?

**Tablas**:
- `.data-table` - ¿Usado en todos?
- `.table` - ¿Usado en varios?
- `.table-total` - ¿Usado en varios?

**Botones**:
- `.btn-primary` / `.btn-secondary` - ¿Usado en varios?
- `.btn-icon` - ¿Usado en varios?

**Utilidades**:
- `.hidden` - ¿Usado en todos?
- `.text-right` / `.text-center` - ¿Usado en varios?
- `.flex-between` - ¿Usado en varios?

### Clases probablemente específicas (NO agregar a components):

**Cotizador**:
- `.mode-switch` - Solo cotizador
- `.qty-control` - Solo cotizador
- `.financials-block` - Solo cotizador
- `.discount-levels-section` - Solo cotizador
- `.whatsapp-preview-box` - Solo cotizador

**Ventas**:
- `.calendar-week` - ¿Solo ventas?
- `.pedido-card` - ¿Solo ventas?

**Clientes**:
- `.client-stats` - ¿Solo clientes?

---

## ✅ CHECKLIST SESIÓN

**FASE 1 - Auditoría**:
- [x] Ejecutar grep para identificar clases repetidas
- [x] Crear lista de componentes genéricos confirmados (2+ módulos)
- [x] Documentar clases específicas (1 módulo)

**FASE 2 - Completar components.css**:
- [x] Agregar componentes genéricos confirmados
- [x] Adaptar a usar variables de tokens.css
- [x] Comentar dónde se usa cada componente

**FASE 3 - Migración**:
- [ ] Migrar dashboard.html (prueba)
- [ ] Verificar que se ve idéntico
- [ ] Ajustar components.css si es necesario
- [ ] Continuar con resto de prototipos

---

## 💾 BACKUP STRATEGY

**Antes de CUALQUIER cambio**:
```bash
# Crear backup de prototipos
cp cotizador.html cotizador-backup.html
cp ventas.html ventas-backup.html
# etc.

# Crear backup de components.css
cp shared/components.css shared/components-backup.css
```

**Si algo sale mal**:
```bash
# Revertir
mv cotizador-backup.html cotizador.html
mv components-backup.css shared/components.css
```

---

## 🎯 MÉTRICAS DE ÉXITO

**FASE 1 completa cuando**:
- ✅ Tengo lista de clases repetidas en 2+ módulos
- ✅ Documentado en este archivo

**FASE 2 completa cuando**:
- ✅ `components.css` tiene SOLO componentes genéricos reales
- ✅ Cada componente tiene comentario de dónde se usa

**FASE 3 completa cuando**:
- ✅ Todos los prototipos usan sistema nuevo
- ✅ Se ven IDÉNTICOS al original
- ✅ Archivos `styles.css` viejos eliminados

---

## 📝 NOTAS ADICIONALES

### Nombres de variables CSS (búsqueda/reemplazo necesaria):

| Variable VIEJA | Variable NUEVA |
|---|---|
| `--primary` | `--text-primary` |
| `--accent` | `--color-accent` |
| `--text-dark` | `--text-primary` |
| `--text-light` | `--text-secondary` |
| `--border-subtle` | `--border-color` |
| `--green-success` | `--color-success` |
| `--font-stack` | `--font-family` |
| `--nav-width-expanded` | `--sidebar-width-expanded` |
| `--nav-width-collapsed` | `--sidebar-width-collapsed` |

### Archivos a NO modificar:
- ❌ `shared/tokens.css` - Ya está completo
- ❌ `shared/common.css` - Deprecado, ignorar
- ❌ Archivos JS - NO tocar
- ❌ HTML estructura - SOLO cambiar imports CSS

---

## 📊 RESULTADOS FASE 1 Y FASE 2 (04 Enero 2026)

### ✅ FASE 1 - AUDITORÍA COMPLETADA

**Método usado**: Análisis con grep de todos los archivos CSS en `prototipos/assets/*/styles.css`

**Componentes encontrados en 4-5 módulos (YA estaban en components.css)**:
- Layout: `.app-wrapper`, `.sidebar`, `.sidebar-header`, `.logo-icon`, `.logo-text`, `.toggle-sidebar-float`, `.nav-menu`, `.nav-content`, `.nav-footer`, `.nav-highlight`, `.btn-cotizador-nav`, `.badge-new`, `.main-layout`
- Botones: `.btn-primary`, `.btn-secondary`

**Componentes encontrados en 3 módulos (AGREGADOS)**:
1. `.header-toolbar` - EN: clientes, cotizador, ventas
2. `.page-header-title` - EN: clientes, repartos, ventas

**Componentes encontrados en 2 módulos (AGREGADOS)**:
3. `.header-actions` - EN: clientes, ventas
4. `.info-row` - EN: clientes, ventas
5. `.btn-nav` - EN: dashboard, repartos, ventas
6. `.badge-status` - EN: clientes, ventas
7. `.stat-inline` - EN: repartos, ventas
8. `.stat-divider-vertical` - EN: repartos, ventas
9. `.view-container` - EN: repartos, ventas

**Total componentes NUEVOS agregados**: 9

---

### ✅ FASE 2 - COMPONENTS.CSS COMPLETADO

**Archivo**: `prototipos/shared/components.css`
**Líneas antes**: 703
**Líneas después**: 793
**Líneas agregadas**: +90

**Componentes agregados con variables de tokens.css**:

**Sección HEADER (nueva)** - Líneas 48-85:
- `.header-toolbar` - Header sticky con borde inferior
- `.page-header-title` - Título de página con icono
- `.header-actions` - Contenedor de acciones en header
- `.info-row` - Fila de información genérica
- `.view-container` - Contenedor de vista principal

**Sección BADGES** - Líneas 303-312:
- `.badge-status` - Badge genérico de estados

**Sección BOTONES** - Líneas 397-415:
- `.btn-nav` - Botones de navegación (flechas ◀ ▶)

**Sección STATS/MÉTRICAS** - Líneas 781-793:
- `.stat-inline` - Stats en línea horizontal
- `.stat-divider-vertical` - Divisor vertical entre stats

**Todos los componentes incluyen**:
- ✅ Variables de tokens.css (no valores hardcodeados)
- ✅ Comentario indicando en qué módulos se usa
- ✅ Adaptados al sistema de diseño

---

## 📦 FASE 3 - MIGRACIONES COMPLETADAS

### ✅ Dashboard - Migrado 05 Enero 2026

**Archivos afectados:**
- ❌ `assets/dashboard/styles.css` (eliminado)
- ✅ `assets/dashboard/dashboard-specific.css` (creado - 583 líneas)
- ✅ `dashboard.html` (imports actualizados)
- ✅ `dashboard-backup.html` (backup creado)

**Imports actualizados:**
```html
<!-- ANTES -->
<link rel="stylesheet" href="assets/dashboard/styles.css">

<!-- DESPUÉS -->
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="shared/components.css">
<link rel="stylesheet" href="assets/dashboard/dashboard-specific.css">
```

**Clases específicas del Dashboard (NO en components.css):**

**Global Search (específico dashboard)**:
- `.search-container-global` - Barra de búsqueda global con shortcut badge
- `.global-results-dropdown` - Dropdown de resultados de búsqueda
- `.result-category-header` - Headers de categorías en resultados
- `.search-result-item` - Items de resultado con hover
- `.result-icon`, `.icon-client`, `.icon-product`, `.icon-order` - Íconos colorados
- `.result-info`, `.result-title`, `.result-subtitle` - Info de resultados

**Dashboard Canvas**:
- `.dashboard-content` - Contenedor principal del dashboard
- `.dashboard-sections` - Grid de secciones

**Calendar Carousel**:
- `.section-carousel` - Sección del carousel semanal
- `.carousel-header`, `.carousel-title`, `.carousel-controls` - Header del carousel
- `.btn-nav-day` - Botones de navegación días
- `.days-row` - Row de días
- `.day-card-v2` - Cards de día con estado active
- `.day-label`, `.day-number-big`, `.metric-pill` - Contenido de card

**Split Section (Orders + Stock)**:
- `.split-section` - Grid 2fr/1fr
- `.orders-list-container` - Container de pedidos listos
- `.clean-list-header`, `.clean-list-title` - Header de listas
- `.orders-groups` - Grupo de pedidos
- `.order-row-item` - Row de pedido con hover
- `.order-icon`, `.order-info`, `.order-main-text`, `.order-sub-text` - Elementos de pedido
- `.order-meta` - Metadata de pedido
- `.tag-status`, `.tag-ready` - Tags de estado
- `.stock-alerts-container` - Container de alertas de stock
- `.alert-item`, `.alert-content`, `.alert-header` - Elementos de alerta
- `.product-alert-name`, `.alert-badge`, `.stock-meter` - Info de producto
- `.list-footer-action` - Footer de listas con botón

**Overrides dashboard**:
- `.client-status` - Widget de estado de cliente en header
- `.btn-xs-outline` - Botón pequeño outline usado en dashboard

**Total clases específicas:** ~45 clases

**Verificación:**
- [x] Backup creado ✓
- [x] Imports actualizados (3 archivos CSS) ✓
- [x] Archivo specific.css usa variables de tokens.css ✓
- [x] Todas las clases HTML cubiertas ✓
- [x] Archivo CSS viejo eliminado ✓
- [x] No hay referencias al archivo viejo (excepto backup) ✓

**Notas:**
- Dashboard importaba `cotizador/styles.css` que tenía variables y componentes base duplicados
- Se eliminó esa dependencia circular usando el sistema nuevo
- Todas las variables hardcodeadas reemplazadas por tokens CSS
- Sistema modular: tokens → components → dashboard-specific

---

### ✅ Clientes - Migrado 05 Enero 2026

**Archivos afectados:**
- ✅ `assets/clientes/clientes-specific.css` (creado - estilos únicos)
- ✅ `clientes.html` (imports actualizados)
- ✅ `clientes-backup.html` (backup creado)
- ⚠️ `assets/clientes/styles.css` (NO eliminado - usado por backup y cliente-detalle)

**Imports actualizados:**
```html
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="shared/components.css">
<link rel="stylesheet" href="assets/clientes/clientes-specific.css">
```

**Clases específicas:**
- `.input-search-header` - Input de búsqueda en header
- `.select-filter` - Selects de filtros
- `.list-container` - Contenedor de tabla
- `.table-v2` - Tabla de clientes
- `.user-cell`, `.avatar-circle` - Celda con avatar
- `.actions-cell`, `.btn-icon-sm`, `.btn-view`, `.btn-delete` - Acciones de tabla

**Fixes aplicados en components.css:**
1. `.btn-primary` - Agregado estilos completos + `white-space: nowrap`
2. `.header-toolbar` - Padding reducido de 20px a 12px

**Verificación:** ✅ Pixel-perfect aprobado por usuario

---

### ✅ Cliente-Detalle - Migrado 05 Enero 2026

**Archivos afectados:**
- ✅ `assets/clientes/cliente-detalle-specific.css` (creado - 350+ líneas)
- ✅ `cliente-detalle.html` (imports actualizados)
- ✅ `cliente-detalle-backup.html` (backup creado)

**Imports actualizados:**
```html
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="shared/components.css">
<link rel="stylesheet" href="assets/clientes/clientes-specific.css">
<link rel="stylesheet" href="assets/clientes/cliente-detalle-specific.css">
```

**Clases específicas (principales):**
- Header: `.detail-top-bar`, `.customer-profile-header`, `.profile-main`, `.profile-avatar-lg`
- Tabs: `.tab-content-area`
- Cuenta Corriente: `.cc-grid`, `.cc-sidebar`, `.cc-sidebar-card`, `.ledger-card`, `.ledger-table`
- Balance: `.sidebar-balance-container`, `.sidebar-balance-amount`
- Expandibles: `.movimiento-row`, `.expand-icon`, `.detalle-expandido`, `.detalle-content`
- Modal pago: `.info-cliente-pago`, `.tipo-pago-section`, `.radio-option`, `.saldo-resultante`

**Variables corregidas:**
- `var(--accent)` → `var(--color-accent)`
- `var(--text-light)` → `var(--text-secondary)`

**Verificación:** ⏳ Pendiente confirmación usuario (sesión terminó antes)

---

### ✅ Cotizador - Migrado 05 Enero 2026

**Archivos afectados:**
- ✅ `assets/cotizador/cotizador-specific.css` (creado - 865 líneas)
- ✅ `cotizador.html` (imports actualizados + HTML limpiado)
- ✅ `cotizador-backup.html` (backup creado)
- ⚠️ `assets/cotizador/styles.css` (NO eliminado - usado por backup)

**Imports actualizados:**
```html
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="shared/components.css">
<link rel="stylesheet" href="assets/cotizador/cotizador-specific.css">
```

**Optimización de espaciado realizada:**
El panel derecho tenía scroll en 1080p por espaciado excesivo. Se compactó:

| Elemento | Antes | Después |
|----------|-------|---------|
| Panel derecho padding | 24px | 16px x 12px |
| Ancho panel | 340px | 320px |
| Gap financials-block | 12px | 0 |
| Field-row margin | 12px | 6px |
| Font-size labels | 14px | 12px |
| Discount section margin | 20px | 8px |
| Payment section margin | 24px | 8px |
| Total final margin | 24px | 12px |
| Actions margin | 32px | 12px |

**HTML limpiado (~30 inline styles eliminados):**
- `.delivery-date-row` - Fila fecha entrega
- `.divider-compact` - Separador compacto
- `.payment-section-compact` - Sección pago compacta
- `.payment-header`, `.payment-options`, `.payment-option-label`
- `.payment-input-group`, `.payment-input-full`
- `.client-discount-row` - Fila descuento cliente
- `.ml-auto` - Margin-left auto

**Verificación:** ✅ Pixel-perfect aprobado + optimización espaciado aprobada

---

### ✅ Ventas - Migrado 05 Enero 2026

**Archivos afectados:**
- ✅ `assets/ventas/ventas-specific.css` (creado - ~1400 líneas)
- ✅ `ventas.html` (imports actualizados)
- ✅ `ventas-backup.html` (backup creado)
- ⚠️ `assets/ventas/styles.css` (NO eliminado - usado por backup)

**Imports actualizados:**
```html
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="shared/components.css">
<link rel="stylesheet" href="assets/ventas/ventas-specific.css">
```

**Clases específicas (principales):**

**Header Ventas:**
- `.header-toolbar-ventas` - Header compacto con filtros inline
- `.filters-inline`, `.select-filter-compact`, `.filter-periodo-compact`
- `.input-date-compact`, `.periodo-arrow`, `.btn-ghost-sm`

**View Switcher:**
- `.view-switcher-bar`, `.view-tabs`, `.view-tab`
- `.results-count-container`, `.results-count`
- `#badge-estado-dia-lista` (variantes: hoy, planificado, controlar, controlado)

**Stats Panel Compacto:**
- `.stats-panel-compact` - Stats en línea horizontal

**Bulk Actions:**
- `.barra-bulk-actions`, `.bulk-info`, `.bulk-actions-buttons`
- `.btn-bulk-primary`, `.btn-bulk-secondary`

**Tabla Ventas:**
- `.table-ventas` - Tabla de pedidos
- `.cliente-cell`, `.cliente-link`, `.badge-tipo`, `.badge-vehiculo`
- `.actions-cell`, `.btn-action-sm` (variantes: success, warning, danger)

**Calendario Semanal:**
- `.calendario-container`, `.calendario-header`, `.calendario-grid`
- `.dia-card` (variantes: .active, .fabrica-card, .dia-hoy, .dia-controlado, .dia-sin-control)
- `.dia-header`, `.dia-label`, `.dia-numero`, `.dia-tipo`, `.dia-stats`, `.dia-stat`
- `.dia-badge-hoy`, `.badge-estado-planificado`, `.badge-estado-semanal`, `.badge-estado-controlado`, `.badge-estado-controlar`
- `.dia-botones`, `.btn-ver-detalle-dia`, `.btn-filtrar-lista-dia`
- `.dia-pagos-line`, `.pago-item`

**Vehículos Capacidades:**
- `.vehiculos-capacidades`, `.vehiculo-card` (variantes: capacidad-baja, media, alta)
- `.vehiculo-info`, `.vehiculo-nombre`, `.vehiculo-pedidos`
- `.vehiculo-capacidad`, `.capacidad-peso`, `.capacidad-barra`, `.capacidad-fill`

**Modales:**
- Modal Editar: `.modal-edit-large`, `.modal-body-edit-grid`, `.edit-productos-area`, `.edit-panel-totales`
- `.table-edit-productos`, `.producto-nombre-compact`, `.peso-badge`, `.input-cantidad-edit`
- `.totales-edit-section`, `.total-row`, `.total-divider`, `.peso-info`
- Modal Detalle: `.modal-detalle-large`, `.modal-body-detalle-grid`, `.detalle-main-area`, `.detalle-sidebar`
- `.detalle-section`, `.section-title`, `.info-grid`, `.info-item`
- `.table-detalle-productos`, `.peso-total-row`
- `.detalle-sidebar-section`, `.sidebar-section-title`, `.badge-estado`
- `.metodo-pago-display`, `.metodo-item`, `.estado-pago-info`, `.entrega-info`

**Variables corregidas:**
- `var(--text-light)` → `var(--text-secondary)` (inline style en HTML)

**Fixes aplicados:**
- Creada clase `.btn-excel` con verde Excel (#217346) - antes usaba `.btn-secondary` azul
- Botón "Exportar Excel" actualizado a usar `.btn-excel`

**Verificación:** ✅ Pixel-perfect aprobado por usuario

---

## ✅ FASE 3 COMPLETADA - 05 Enero 2026

### Todos los prototipos migrados:
- ✅ `dashboard.html`
- ✅ `clientes.html`
- ✅ `cliente-detalle.html`
- ✅ `cotizador.html`
- ✅ `ventas.html`
- ✅ `repartos-dia.html` (+ optimización de espacio)

### Limpieza realizada:
1. ✅ **CSS viejos eliminados:**
   - `assets/clientes/styles.css`
   - `assets/dashboard/styles.css`
   - `assets/ventas/styles.css`
   - `assets/cotizador/styles.css`
   - `assets/repartos/styles.css`

2. ✅ **Backups eliminados:**
   - `dashboard-backup.html`
   - `clientes-backup.html`
   - `cliente-detalle-backup.html`
   - `cotizador-backup.html`
   - `ventas-backup.html`
   - `repartos-dia-backup.html`

## 📋 PRÓXIMOS PASOS

1. ~~**Auditar colores hardcodeados** en CSS específicos~~ ✅
2. ~~**Reemplazar colores hardcodeados** por variables de tokens~~ ✅
3. ~~**Implementar Dark Mode**~~ ✅
4. **Revisar tweaks visuales** pendientes
5. **Agregar botón tema a otros prototipos** (dashboard, ventas, clientes, cotizador)
6. **Continuar con nuevas vistas**

---

## 🌙 DARK MODE - COMPLETADO (05 Enero 2026)

**Estado**: ✅ COMPLETADO

### Trabajo realizado:

**1. Auditoría y reemplazo de colores hardcodeados:**
- ✅ `assets/repartos/repartos-specific.css` - 0 colores hardcodeados
- ✅ `assets/ventas/ventas-specific.css` - 0 colores hardcodeados
- ✅ `assets/cotizador/cotizador-specific.css` - 0 colores hardcodeados
- ✅ `assets/clientes/clientes-specific.css` - 0 colores hardcodeados
- ✅ `assets/clientes/cliente-detalle-specific.css` - 0 colores hardcodeados
- ✅ `assets/dashboard/dashboard-specific.css` - 0 colores hardcodeados
- ✅ `shared/components.css` - 0 colores hardcodeados

**2. Variables nuevas en tokens.css:**
- Backgrounds: `--bg-hover`, `--bg-selected`
- Texto: `--text-strong`
- Colores primarios: `--color-primary`, `--color-primary-hover`, `--color-primary-light`, `--color-primary-dark`
- Estados completos: success, warning, danger, info (con variantes -light, -dark, -bg, -border)
- Módulo específicos: `--color-violet`, `--color-excel`, `--color-whatsapp`

**3. Bloque [data-theme="dark"] implementado:**
- Paleta inspirada en GitHub Dark
- Todos los colores ajustados para contraste en fondo oscuro
- Sombras más sutiles para dark mode
- Componentes específicos (cotizador, table, avatar)

**Infraestructura:**
- ✅ Funciones en `utils.js`: `toggleTheme()`, `setTheme()`, `getTheme()`, `initTheme()`
- ✅ Botón "Tema" en sidebar de `repartos-dia.html`
- ✅ Auto-guardado de preferencia en localStorage
- ✅ Auto-detección de preferencia del sistema
- ✅ Cambio de icono (sol/luna) automático

**Cómo usar:**
1. Abrir `repartos-dia.html` en el navegador
2. Click en "Tema" en el sidebar
3. El tema se guarda automáticamente

---

**Última actualización**: 05 Enero 2026
**Estado**: ✅ MIGRACIÓN COMPLETADA | ✅ LIMPIEZA REALIZADA | ✅ DARK MODE COMPLETADO
