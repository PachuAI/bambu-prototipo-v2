# AUDITORÍA: MIGRACIÓN COTIZADOR.HTML A SISTEMA DE TOKENS

**Fecha**: 04 Enero 2026
**Objetivo**: Verificar que sistema nuevo (tokens.css + components.css) cubre TODOS los estilos de cotizador.html antes de migrar
**Estado**: 🔴 INCOMPLETO - Faltan elementos críticos

---

## 📊 RESUMEN EJECUTIVO

| Categoría | Total Elementos | ✅ Cubiertos | ❌ Faltantes | ⚠️ Cambios |
|---|---|---|---|---|
| **Variables CSS** | 11 | 11 | 0 | 11 (nombres diferentes) |
| **Layout Base** | 5 | 2 | 3 | 0 |
| **Sidebar** | 11 | 11 | 0 | 0 |
| **Header Toolbar** | 7 | 0 | 7 | 0 |
| **Tabla Pedidos** | 8 | 4 | 4 | 0 |
| **Panel Derecho** | 15 | 0 | 15 | 0 |
| **Botones Acción** | 5 | 2 | 3 | 0 |
| **Modales** | 12 | 8 | 4 | 0 |
| **Floating Results** | 4 | 0 | 4 | 0 |
| **Utilidades** | 3 | 3 | 0 | 0 |
| **TOTAL** | **81** | **41** | **40** | **11** |

**🚨 COBERTURA: 51% - NO LISTO PARA MIGRACIÓN**

---

## 🔍 ANÁLISIS DETALLADO POR COMPONENTE

### 1. VARIABLES CSS ⚠️

**Resultado**: Valores existen pero con nombres DIFERENTES (requiere búsqueda/reemplazo)

| Variable VIEJA (styles.css) | Variable NUEVA (tokens.css) | Estado |
|---|---|---|
| `--bg-app` | `--bg-app` | ✅ Mismo nombre |
| `--bg-white` | `--bg-white` | ✅ Mismo nombre |
| `--primary` | `--text-primary` | ⚠️ **CAMBIO NOMBRE** |
| `--accent` | `--color-accent` | ⚠️ **CAMBIO NOMBRE** |
| `--text-dark` | `--text-primary` | ⚠️ **CAMBIO NOMBRE** |
| `--text-light` | `--text-secondary` | ⚠️ **CAMBIO NOMBRE** |
| `--border-subtle` | `--border-color` | ⚠️ **CAMBIO NOMBRE** |
| `--green-success` | `--color-success` | ⚠️ **CAMBIO NOMBRE** |
| `--font-stack` | `--font-family` | ⚠️ **CAMBIO NOMBRE** |
| `--nav-width-expanded` | `--sidebar-width-expanded` | ⚠️ **CAMBIO NOMBRE** |
| `--nav-width-collapsed` | `--sidebar-width-collapsed` | ⚠️ **CAMBIO NOMBRE** |

**Impacto**: Al migrar, TODO el CSS que use estas variables se romperá si no se hace búsqueda/reemplazo.

**Solución requerida**:
```css
/* Antes de migrar, buscar y reemplazar en assets/cotizador/styles.css: */
var(--primary)           → var(--text-primary)
var(--accent)            → var(--color-accent)
var(--text-dark)         → var(--text-primary)
var(--text-light)        → var(--text-secondary)
var(--border-subtle)     → var(--border-color)
var(--green-success)     → var(--color-success)
var(--font-stack)        → var(--font-family)
var(--nav-width-expanded) → var(--sidebar-width-expanded)
var(--nav-width-collapsed) → var(--sidebar-width-collapsed)
```

---

### 2. LAYOUT BASE ❌

| Clase | Sistema VIEJO | Sistema NUEVO | Estado |
|---|---|---|---|
| `.app-wrapper` | ✅ styles.css:30 | ✅ components.css:23 | ✅ CUBIERTO |
| `.main-layout` | ✅ styles.css:36 | ✅ components.css:28 | ✅ CUBIERTO |
| `.content-grid` | ✅ styles.css:370 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.left-panel` | ✅ styles.css:377 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.right-panel` | ✅ styles.css:383 | ❌ **NO EXISTE** | ❌ **FALTA** |

**🚨 Elementos faltantes críticos**:

```css
/* AGREGAR A components.css: */

/* Grid 70/30 del cotizador */
.content-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 340px;
    overflow: hidden;
}

.left-panel {
    padding: 32px;
    overflow-y: auto;
    background: var(--bg-white);
}

.right-panel {
    background: #f9fafb;
    padding: 24px;
    border-left: 1px solid var(--border-color);
    overflow-y: auto;
}
```

---

### 3. SIDEBAR ✅

**Resultado**: 100% CUBIERTO

| Elemento | Sistema VIEJO | Sistema NUEVO | Estado |
|---|---|---|---|
| `.sidebar` | styles.css:36 | components.css:45 | ✅ IDÉNTICO |
| `.sidebar.collapsed` | styles.css:48 | components.css:57 | ✅ IDÉNTICO |
| `.sidebar-header` | styles.css:54 | components.css:61 | ✅ IDÉNTICO |
| `.logo-icon` | styles.css:63 | components.css:71 | ✅ IDÉNTICO |
| `.logo-text` | styles.css:71 | components.css:79 | ✅ IDÉNTICO |
| `.toggle-sidebar-float` | styles.css:92 | components.css:95 | ✅ IDÉNTICO |
| `.nav-content` | styles.css:122 | components.css:124 | ✅ IDÉNTICO |
| `.nav-highlight` | styles.css:130 | components.css:130 | ✅ IDÉNTICO |
| `.btn-cotizador-nav` | styles.css:134 | components.css:135 | ✅ IDÉNTICO |
| `.nav-menu` | styles.css:171 | components.css:159 | ✅ IDÉNTICO |
| `.badge-new` | styles.css:224 | components.css:199 | ✅ IDÉNTICO |

---

### 4. HEADER TOOLBAR ❌

| Clase | Sistema VIEJO | Sistema NUEVO | Estado |
|---|---|---|---|
| `.header-toolbar` | ✅ styles.css:250 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.mode-switch-container` | ✅ styles.css:261 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.mode-switch` | ✅ styles.css:266 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.switch-label` | ✅ styles.css:277 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.product-search-bar` | ✅ styles.css:307 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.client-search-container` | ✅ styles.css:339 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.date-input-inline` | ✅ styles.css (usado en HTML) | ❌ **NO EXISTE** | ❌ **FALTA** |

**🚨 TODO EL HEADER DEL COTIZADOR FALTA**

```css
/* AGREGAR A components.css: */

.header-toolbar {
    height: 72px;
    background: var(--bg-white);
    border-bottom: var(--border-width) solid var(--border-color);
    display: flex;
    align-items: center;
    padding: 0 var(--spacing-2xl);
    gap: var(--spacing-2xl);
}

.mode-switch-container { flex-shrink: 0; }

.mode-switch {
    background: var(--bg-app);
    padding: 4px;
    border-radius: 20px;
    display: inline-flex;
    position: relative;
}

.mode-switch input { display: none; }

.switch-label {
    padding: 6px 16px;
    border-radius: 16px;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-secondary);
    cursor: pointer;
    z-index: 2;
    transition: color var(--transition-base);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

#mode-fabrica:checked + label {
    color: #0052cc;
    background: white;
    box-shadow: var(--shadow-sm);
}

#mode-reparto:checked + label {
    color: #ff5630;
    background: white;
    box-shadow: var(--shadow-sm);
}

.product-search-bar {
    flex: 1;
    position: relative;
    max-width: 600px;
}

.product-search-bar input {
    width: 100%;
    padding: 12px 16px 12px 40px;
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius-lg);
    font-size: 15px;
    outline: none;
    background: var(--bg-white);
    transition: all var(--transition-base);
}

.product-search-bar input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.2);
}

.product-search-bar i {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.client-search-container {
    margin-left: auto;
    position: relative;
    width: 300px;
    flex-shrink: 0;
}

.client-search-container input {
    width: 100%;
    padding: 12px 16px 12px 40px;
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius-lg);
    font-size: 15px;
    outline: none;
    background: var(--bg-white);
    transition: all var(--transition-base);
}

.client-search-container input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.2);
}

.client-search-container i {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}
```

---

### 5. TABLA DE PEDIDOS (CANVAS) ⚠️

| Clase | Sistema VIEJO | Sistema NUEVO | Estado |
|---|---|---|---|
| `.order-container` | ✅ styles.css:391 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.data-table` | ✅ styles.css:397 | ⚠️ components.css:344 (`.table`) | ⚠️ Nombre diferente |
| `.data-table th` | ✅ styles.css:402 | ✅ components.css:350 | ✅ CUBIERTO |
| `.data-table td` | ✅ styles.css:412 | ✅ components.css:362 | ✅ CUBIERTO |
| `.text-right` | ✅ styles.css:418 | ✅ components.css:390 | ✅ CUBIERTO |
| `.text-center` | ✅ styles.css:424 | ✅ components.css:392 | ✅ CUBIERTO |
| `.qty-control` | ✅ styles.css:426 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.qty-control button` | ✅ styles.css:437 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.qty-control input` | ✅ styles.css:451 | ❌ **NO EXISTE** | ❌ **FALTA** |

**🚨 Faltantes críticos**:

```css
/* AGREGAR A components.css: */

.order-container {
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
}

/* Alias para retrocompatibilidad */
.data-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--bg-white);
}

.qty-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius-sm);
    overflow: hidden;
    width: 90px;
    margin: 0 auto;
}

.qty-control button {
    border: none;
    background: var(--bg-white);
    width: 28px;
    height: 28px;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all var(--transition-fast);
}

.qty-control button:hover {
    background: var(--bg-app);
    color: var(--text-primary);
}

.qty-control input {
    width: 34px;
    border: none;
    text-align: center;
    font-size: 13px;
    font-weight: var(--font-weight-semibold);
    border-left: var(--border-width) solid var(--border-color);
    border-right: var(--border-width) solid var(--border-color);
}
```

---

### 6. PANEL DERECHO (FINANCIALS + ACTIONS) ❌

**TODO EL PANEL DERECHO FALTA EN EL SISTEMA NUEVO**

| Clase | Sistema VIEJO | Sistema NUEVO | Estado |
|---|---|---|---|
| `.sticky-container` | ✅ Usado en HTML | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.financials-block` | ✅ Usado en HTML | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.field-row` | ✅ styles.css:506 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.align-right` | ✅ styles.css:519 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.money-input` | ✅ styles.css:528 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.discount-levels-section` | ✅ styles.css:462 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.level-row` | ✅ styles.css:466 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.btn-xs-outline` | ✅ styles.css:484 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.notes-section` | ✅ styles.css:537 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.btn-toggle-notes` | ✅ styles.css:541 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.notes-area` | ✅ styles.css:550 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.payment-section` | ✅ Usado en HTML | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.total-final-v3` | ✅ styles.css:562 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.actions-stack` | ✅ styles.css:585 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.shortcuts-hint` | ✅ styles.css:642 | ❌ **NO EXISTE** | ❌ **FALTA** |

**🚨 CRÍTICO**: Todo el panel derecho del cotizador (totales, descuentos, notas, pago, acciones) NO EXISTE en el sistema nuevo.

**Código a agregar** (muy extenso, ver styles.css líneas 462-651)

---

### 7. BOTONES DE ACCIÓN ⚠️

| Clase | Sistema VIEJO | Sistema NUEVO | Estado |
|---|---|---|---|
| `.btn-primary` | ✅ styles.css:727 | ✅ components.css:277 | ✅ CUBIERTO |
| `.btn-secondary` | ✅ styles.css:737 | ✅ components.css:287 | ✅ CUBIERTO |
| `.btn-black-block` | ✅ styles.css:589 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.btn-confirm-v3` | ✅ styles.css:611 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.btn-icon` | ❌ No usado en cotizador | ✅ components.css:309 | ➖ N/A |

**🚨 Faltantes**:

```css
/* AGREGAR A components.css: */

.btn-black-block {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    background: var(--text-primary);
    color: var(--text-white);
    border: none;
    padding: 12px;
    border-radius: var(--border-radius-base);
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-base);
    cursor: pointer;
    margin-bottom: var(--spacing-md);
    transition: background var(--transition-fast);
}

.btn-black-block:hover {
    background: #091e42;
}

.btn-confirm-v3 {
    width: 100%;
    border: none;
    border-radius: var(--border-radius-base);
    padding: 16px;
    background: var(--color-success);
    color: var(--text-white);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 12px rgba(54, 179, 126, 0.3);
    transition: transform var(--transition-fast);
}

.btn-confirm-v3:hover {
    background: #2d996b;
}

.btn-confirm-v3 .main-text {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
}

.btn-confirm-v3 .sub-text {
    font-size: var(--font-size-xs);
    opacity: 0.9;
    margin-top: 2px;
}
```

---

### 8. MODALES ⚠️

| Clase | Sistema VIEJO | Sistema NUEVO | Estado |
|---|---|---|---|
| `.modal-backdrop` | ✅ styles.css:654 | ⚠️ `.modal-overlay` (components.css:458) | ⚠️ Nombre diferente |
| `.modal-card.small` | ✅ styles.css:668 | ⚠️ `.modal-content.modal-sm` | ⚠️ Nombre diferente |
| `.modal-card.medium` | ✅ styles.css:676 | ⚠️ `.modal-content` (default) | ⚠️ Nombre diferente |
| `.modal-head` | ✅ styles.css:684 | ⚠️ `.modal-header` | ⚠️ Nombre diferente |
| `.close-modal` | ✅ styles.css:697 | ⚠️ `.btn-close-modal` | ⚠️ Nombre diferente |
| `.modal-body` | ✅ styles.css:704 | ✅ components.css:533 | ✅ CUBIERTO |
| `.modal-foot` | ✅ styles.css:716 | ⚠️ `.modal-footer` | ⚠️ Nombre diferente |
| `.flex-between` | ✅ styles.css:721 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.flex-end` | ✅ Usado en HTML | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.tabs-simple` | ✅ styles.css:748 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.whatsapp-preview-box` | ✅ styles.css:771 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.preview-header` | ✅ styles.css:777 | ❌ **NO EXISTE** | ❌ **FALTA** |

**⚠️ PROBLEMA**: Sistema nuevo usa nombres diferentes para modales (`.modal-overlay` vs `.modal-backdrop`, `.modal-header` vs `.modal-head`, etc.)

**🚨 Faltantes específicos del cotizador**:

```css
/* AGREGAR A components.css: */

/* Alias para retrocompatibilidad */
.modal-backdrop { /* mismo que .modal-overlay */ }
.modal-card { /* mismo que .modal-content */ }
.modal-head { /* mismo que .modal-header */ }
.modal-foot { /* mismo que .modal-footer */ }
.close-modal { /* mismo que .btn-close-modal */ }

/* Utilidades de flex */
.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.flex-end {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/* Tabs simples del modal resumen */
.tabs-simple {
    display: flex;
    gap: 4px;
    margin-bottom: var(--spacing-lg);
    border-bottom: var(--border-width) solid var(--border-color);
}

.tabs-simple .tab {
    background: none;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--font-size-base);
    color: var(--text-secondary);
    cursor: pointer;
    border-bottom: var(--border-width-thick) solid transparent;
    margin-bottom: calc(var(--border-width-thick) * -1);
}

.tabs-simple .tab.active {
    color: var(--text-primary);
    font-weight: var(--font-weight-semibold);
    border-bottom-color: var(--text-primary);
}

/* WhatsApp Preview (modal resumen) */
.whatsapp-preview-box {
    background: #f0fdf4;
    border: var(--border-width) solid #bbf7d0;
    border-radius: var(--border-radius-base);
    overflow: hidden;
}

.preview-header {
    background: #dcfce7;
    padding: var(--spacing-sm) var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-sm);
    color: #166534;
    font-weight: var(--font-weight-semibold);
}

.preview-content {
    padding: var(--spacing-lg);
    font-size: 13px;
    color: #14532d;
    font-family: monospace;
    line-height: var(--line-height-base);
}

.btn-copy-sm {
    background: var(--bg-white);
    border: var(--border-width) solid #86efac;
    color: #166534;
    font-size: var(--font-size-xs);
    padding: 2px var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
}
```

---

### 9. FLOATING RESULTS (BUSCADORES) ❌

| Clase | Sistema VIEJO | Sistema NUEVO | Estado |
|---|---|---|---|
| `.floating-results` | ✅ styles.css:813 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.prod-row.compact` | ✅ styles.css:828 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.prod-info-line` | ✅ styles.css:844 | ❌ **NO EXISTE** | ❌ **FALTA** |
| `.client-dropdown` | ✅ styles.css:870 | ❌ **NO EXISTE** | ❌ **FALTA** |

**🚨 TODO EL SISTEMA DE RESULTADOS FLOTANTES FALTA**

```css
/* AGREGAR A components.css: */

.floating-results {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--bg-white);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    margin-top: 6px;
    z-index: var(--z-dropdown);
    max-height: 400px;
    overflow-y: auto;
}

.prod-row.compact {
    display: grid;
    grid-template-columns: 1fr 30px;
    padding: var(--spacing-sm) var(--spacing-md);
    gap: 0;
    align-items: center;
    border-bottom: var(--border-width) solid var(--border-color);
    cursor: pointer;
    transition: background var(--transition-fast);
}

.prod-row.compact:hover {
    background: var(--bg-app);
}

.prod-info-line {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.p-name {
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
}

.p-meta {
    color: var(--text-secondary);
}

.prod-add {
    color: var(--color-accent);
    cursor: pointer;
    text-align: right;
    font-size: var(--font-size-base);
}

.client-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 300px;
    background: var(--bg-white);
    border: var(--border-width) solid var(--border-color);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-base);
    margin-top: var(--spacing-sm);
    z-index: var(--z-dropdown);
    padding: var(--spacing-sm);
}

.client-row {
    padding: var(--spacing-sm);
    cursor: pointer;
    border-radius: var(--border-radius-sm);
}

.client-row:hover {
    background: var(--bg-app);
}
```

---

### 10. UTILIDADES ✅

| Clase | Sistema VIEJO | Sistema NUEVO | Estado |
|---|---|---|---|
| `.hidden` | ✅ styles.css:808 | ✅ components.css:626 | ✅ CUBIERTO |
| `.text-muted` | ✅ styles.css:524 | ✅ components.css:629 | ✅ CUBIERTO |
| `.text-right` | ✅ styles.css:418 | ✅ components.css:390 | ✅ CUBIERTO |

---

## 🚨 LISTA DE ELEMENTOS FALTANTES (40 TOTAL)

### CRÍTICOS (Bloquean funcionalidad):

1. `.content-grid` - Layout principal 70/30
2. `.left-panel` - Panel izquierdo
3. `.right-panel` - Panel derecho (totales)
4. `.header-toolbar` - Header completo
5. `.mode-switch` - Switch REPARTO/FÁBRICA
6. `.product-search-bar` - Buscador productos
7. `.client-search-container` - Buscador clientes
8. `.financials-block` - Bloque de totales
9. `.field-row` - Filas de totales
10. `.money-input` - Inputs de dinero
11. `.discount-levels-section` - Niveles L1/L2/L3
12. `.level-row` - Fila de nivel
13. `.btn-xs-outline` - Botones aplicar L2/L3
14. `.notes-section` - Sección notas
15. `.notes-area` - Textarea notas
16. `.payment-section` - Sección método pago
17. `.total-final-v3` - Total grande
18. `.actions-stack` - Stack de botones
19. `.btn-black-block` - Botones negros
20. `.btn-confirm-v3` - Botón confirmar verde
21. `.shortcuts-hint` - Hint atajos teclado
22. `.order-container` - Contenedor tabla
23. `.qty-control` - Control cantidad
24. `.floating-results` - Resultados buscadores
25. `.prod-row.compact` - Fila producto compacto
26. `.client-dropdown` - Dropdown clientes
27. `.whatsapp-preview-box` - Preview WhatsApp
28. `.preview-header` - Header preview
29. `.tabs-simple` - Tabs modal resumen
30. `.flex-between` - Utilidad flex
31. `.flex-end` - Utilidad flex
32. `.sticky-container` - Container sticky panel derecho
33. `.align-right` - Alineación derecha
34. `.btn-toggle-notes` - Botón toggle notas
35. `.prod-info-line` - Línea info producto
36. `.p-name` - Nombre producto
37. `.p-meta` - Metadata producto
38. `.prod-add` - Icono agregar producto
39. `.client-row` - Fila cliente
40. `.preview-content` - Contenido preview

### ADVERTENCIAS (Requieren búsqueda/reemplazo):

1. Variables CSS con nombres diferentes (11 variables)
2. `.modal-backdrop` → `.modal-overlay`
3. `.modal-card` → `.modal-content`
4. `.modal-head` → `.modal-header`
5. `.modal-foot` → `.modal-footer`
6. `.close-modal` → `.btn-close-modal`
7. `.data-table` → `.table`

---

## 📝 RECOMENDACIONES

### ANTES DE MIGRAR:

1. ✅ **Agregar elementos faltantes a `components.css`** (40 clases)
2. ✅ **Crear alias de retrocompatibilidad** para clases con nombres diferentes
3. ✅ **Preparar script de búsqueda/reemplazo** para variables CSS
4. ✅ **Testear en prototipo de prueba** antes de tocar cotizador.html

### ESTRATEGIA DE MIGRACIÓN:

**OPCIÓN A - Migración agresiva** (Recomendada cuando sistema nuevo esté completo):
1. Agregar todos los faltantes a `components.css`
2. Crear archivo `assets/cotizador/styles.css` NUEVO solo con estilos específicos del cotizador
3. Cambiar HTML a:
   ```html
   <link rel="stylesheet" href="../../shared/tokens.css">
   <link rel="stylesheet" href="../../shared/components.css">
   <link rel="stylesheet" href="assets/cotizador/styles.css">
   ```

**OPCIÓN B - Migración conservadora** (Más segura):
1. Agregar todos los faltantes a `components.css`
2. Crear aliases de retrocompatibilidad en `components.css`
3. NO tocar `assets/cotizador/styles.css` todavía
4. Cambiar HTML a:
   ```html
   <link rel="stylesheet" href="../../shared/tokens.css">
   <link rel="stylesheet" href="../../shared/components.css">
   <link rel="stylesheet" href="assets/cotizador/styles.css"> <!-- Mantener temporalmente -->
   ```
5. Verificar que TODO funciona
6. DESPUÉS hacer limpieza de `styles.css` eliminando duplicados

**OPCIÓN C - Híbrida** (LA MEJOR):
1. Completar `components.css` con elementos GENÉRICOS reutilizables
2. Mover elementos ESPECÍFICOS del cotizador a nuevo archivo `assets/cotizador/cotizador-custom.css`
3. Mantener separación clara: sistema base vs customizaciones

---

## ✅ CHECKLIST PRE-MIGRACIÓN

- [ ] Agregar 40 elementos faltantes a `components.css`
- [ ] Crear aliases retrocompatibilidad (7 clases)
- [ ] Preparar tabla de búsqueda/reemplazo variables (11 variables)
- [ ] Decidir estrategia migración (A/B/C)
- [ ] Crear backup de `cotizador.html` actual
- [ ] Crear backup de `assets/cotizador/styles.css` actual
- [ ] Preparar plan de rollback si algo sale mal
- [ ] Verificar que TODOS los prototipos usan estructura similar (ventas, clientes, dashboard)

---

## 🎯 PRÓXIMOS PASOS

1. **AHORA**: Revisar este reporte con Giuliano
2. **DECISIÓN**: ¿Agregar faltantes a `components.css` o crear archivo intermedio?
3. **IMPLEMENTACIÓN**: Completar sistema nuevo con faltantes
4. **VALIDACIÓN**: Verificar que faltantes cubrirán TODOS los prototipos (no solo cotizador)
5. **MIGRACIÓN PRUEBA**: Migrar cotizador.html como prueba
6. **VALIDACIÓN**: Comparar visual pixel-perfect antes vs después
7. **CORRECCIONES**: Ajustar lo que sea necesario
8. **MIGRACIÓN COMPLETA**: Migrar resto de prototipos
9. **PROTOTIPO NUEVO**: Crear módulo nuevo usando sistema de tokens desde cero

---

**Fecha reporte**: 04 Enero 2026
**Estado**: 🔴 Sistema nuevo INCOMPLETO - Requiere agregar 40 elementos antes de migrar
**Recomendación**: **NO MIGRAR** hasta completar `components.css`
