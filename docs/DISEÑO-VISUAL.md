# Diseño Visual - Bambu CRM V2

**Última actualización**: 03 Enero 2026
**Extraído de**: Prototipos existentes (cotizador, ventas, clientes, cliente-detalle)

---

## 🎨 Paleta de Colores

### Variables CSS (`:root`)

```css
:root {
    /* Backgrounds */
    --bg-app: #f4f5f7;              /* Fondo general aplicación */
    --bg-white: #ffffff;            /* Fondo cards, sidebar, modales */

    /* Texto */
    --primary: #172b4d;             /* Texto principal (azul oscuro) */
    --text-dark: #172b4d;           /* Texto títulos y enfatizado */
    --text-light: #6b778c;          /* Texto secundario */
    --text-muted: #9ca3af;          /* Texto deshabilitado/hints */

    /* Colores de acción */
    --accent: #0052cc;              /* Links, botones primarios azul */
    --green-success: #36b37e;       /* Success, logo, confirmaciones */
    --red-danger: #ff5630;          /* Errores, eliminar, negativos */
    --orange-warning: #ffab00;      /* Advertencias, badge NUEVO */

    /* Bordes */
    --border-subtle: #ebecf0;       /* Bordes suaves (tablas, cards) */

    /* Tipografía */
    --font-stack: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

    /* Sidebar */
    --nav-width-expanded: 240px;
    --nav-width-collapsed: 64px;
}
```

### Uso por Contexto

| Elemento | Color | Variable CSS | Ejemplo Screenshot |
|----------|-------|--------------|-------------------|
| Fondo general | #f4f5f7 | `--bg-app` | Fondo app completa |
| Sidebar/Cards | #ffffff | `--bg-white` | Sidebar, modales, tablas |
| Títulos/Headers | #172b4d | `--text-dark` | "9 DE JULIO 902" |
| Texto secundario | #6b778c | `--text-light` | Labels, descripciones |
| Botones primarios | #172b4d | `--primary` | "Guardar Cambios" |
| Links/Acciones | #0052cc | `--accent` | "Agregar producto", tabs activas |
| Logo hoja | #36b37e | `--green-success` | Icono Bambú sidebar |
| Estado ENTREGADO | #36b37e | `--green-success` | Badge verde |
| Estado EN TRÁNSITO | #ffab00 | `--orange-warning` | Badge amarillo |
| Tipo REPARTO | #0052cc | `--accent` | Badge azul |
| Saldo negativo | #ff5630 | `--red-danger` | "-$130.000" |
| Badge NUEVO | #ffab00 | `--orange-warning` | Badge amarillo "NUEVO" |
| Bordes/Separadores | #ebecf0 | `--border-subtle` | Bordes tablas, cards |

---

## 📏 Tipografía

### Font Family

```css
font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
```

**Razón**: Tipografía nativa del sistema (San Francisco en macOS, Segoe UI en Windows).

### Escala de Tamaños

| Elemento | Size | Weight | Line Height | Uso |
|----------|------|--------|-------------|-----|
| **H1 - Títulos principales** | 24px | 700 | 1.2 | "9 DE JULIO 902", "Ventas" |
| **H2 - Subtítulos** | 18px | 600 | 1.3 | "Datos del Cliente", "Resumen Financiero" |
| **H3 - Secciones** | 16px | 600 | 1.4 | Headers modales, tabs |
| **Body - Texto normal** | 14px | 400 | 1.5 | Contenido general, descripción |
| **Small - Texto secundario** | 12px | 400 | 1.4 | IDs, metadatos, hints |
| **Labels - Etiquetas forms** | 13px | 500 | 1.4 | Labels inputs |
| **Table headers** | 11px | 600 | 1.3 | Headers tablas (MAYÚSCULAS) |
| **Badges** | 11px | 600 | 1.2 | Estados, tipos (ENTREGADO, REPARTO) |

### Reglas de Uso

- **Headers tablas**: SIEMPRE en mayúsculas (`text-transform: uppercase`)
- **Números/Totales destacados**: `font-weight: 700`, tamaño aumentado 16-28px
- **Badges**: `font-weight: 600`, `text-transform: uppercase`
- **Botones**: `font-weight: 600`, size 14px

---

## 📐 Espaciado

### Sistema Base (múltiplos de 4px)

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;
--spacing-2xl: 24px;
--spacing-3xl: 32px;
```

### Padding por Componente

| Componente | Padding | Ubicación Ejemplo |
|------------|---------|-------------------|
| **Tablas - Celdas compactas** | `8px 16px` | Tablas productos en modales |
| **Tablas - Celdas estándar** | `12px 16px` | Tabla ventas principal |
| **Cards/Sections** | `16px 20px` | Secciones "Datos del Cliente" |
| **Modales - Body** | `24px` | Contenido modales |
| **Sidebar - Items** | `0 12px` | Items navegación |
| **Botones pequeños** | `6px 12px` | Botones secundarios |
| **Botones medianos** | `10px 20px` | Botones primarios |
| **Botones grandes** | `12px 24px` | Botones destacados |
| **Inputs** | `10px 12px` | Inputs text, select |

### Margins

- **Entre secciones**: 20-24px
- **Entre elementos relacionados**: 12px
- **Entre labels e inputs**: 6px
- **Entre párrafos**: 16px

### Grid Layouts

**Modal Editar/Detalle**:
```css
.modal-body-grid {
    display: grid;
    grid-template-columns: 70% 30%;
    gap: 24px;
}
```

---

## 🧩 Componentes

### 1. Sidebar

**Dimensiones**:
- Expandido: 240px
- Colapsado: 64px
- Transición: `0.3s cubic-bezier(0.2, 0, 0, 1)`

**Botón COTIZADOR** (destacado):
```css
background: #e3fcef;         /* Verde claro */
color: #006644;              /* Verde oscuro */
padding: 10px 16px;
border-radius: 6px;
font-weight: 600;
```

**Items navegación**:
```css
height: 40px;
padding: 0 12px;
border-radius: 6px;
transition: background 0.15s;
```

**Badge NUEVO**:
```css
background: #ffab00;         /* Amarillo */
color: white;
padding: 2px 6px;
border-radius: 3px;
font-size: 9px;
font-weight: 600;
text-transform: uppercase;
```

**Estado hover**:
```css
background: #f4f5f7;
```

**Estado activo**:
```css
background: #e3fcef;         /* Verde claro */
color: #0052cc;
font-weight: 600;
```

**Logo**:
- Icono: Font Awesome `fa-leaf`
- Color: `var(--green-success)` #36b37e
- Size: 24px

### 2. Botones

#### Primario (Guardar, Confirmar)
```css
background: #172b4d;         /* Azul oscuro */
color: white;
padding: 10px 20px;
border-radius: 6px;
font-weight: 600;
border: none;
cursor: pointer;
transition: background 0.2s;
```

**Hover**: `background: #0e1f38`

#### Secundario (Cancelar)
```css
background: transparent;
color: #172b4d;
padding: 10px 20px;
border-radius: 6px;
border: 1px solid #ebecf0;
font-weight: 600;
cursor: pointer;
```

**Hover**: `background: #f4f5f7`

#### Icono (Acciones tabla)
```css
width: 32px;
height: 32px;
border-radius: 6px;
border: 1px solid #ebecf0;
background: white;
color: #6b778c;
cursor: pointer;
```

**Colores por acción**:
- Ver: `#0052cc` (azul)
- Editar: `#ffab00` (amarillo)
- Eliminar: `#ff5630` (rojo)

### 3. Tablas

#### Headers
```css
background: #f4f5f7;         /* Mismo que fondo app */
color: #6b778c;              /* Texto light */
font-size: 11px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.5px;
padding: 12px 16px;
border-bottom: 1px solid #ebecf0;
```

#### Celdas
```css
padding: 8px 16px;           /* Compacto en modales */
padding: 12px 16px;          /* Estándar en vistas principales */
border-bottom: 1px solid #ebecf0;
font-size: 14px;
```

#### Hover Fila
```css
background: #f9fafb;
cursor: pointer;
```

#### Fila Total (última fila tablas)
```css
background: #f4f5f7;
font-weight: 700;
border-top: 2px solid #ebecf0;
```

**IMPORTANTE**:
- ❌ NO usar columna SKU (eliminado en V2)
- ✅ Alineación derecha: Montos, cantidades, totales
- ✅ Alineación izquierda: Texto, descripciones

### 4. Badges de Estado

**ENTREGADO**:
```css
background: #e3fcef;         /* Verde claro */
color: #006644;              /* Verde oscuro */
padding: 4px 8px;
border-radius: 4px;
font-size: 11px;
font-weight: 600;
text-transform: uppercase;
```

**EN TRÁNSITO**:
```css
background: #fff3cd;         /* Amarillo claro */
color: #856404;              /* Amarillo oscuro */
/* resto igual */
```

**REPARTO** (tipo):
```css
background: #e3f2fd;         /* Azul claro */
color: #0052cc;              /* Azul oscuro */
/* resto igual */
```

**FÁBRICA** (tipo):
```css
background: #fff3e0;         /* Naranja claro */
color: #e65100;              /* Naranja oscuro */
/* resto igual */
```

**Con iconos**:
- Efectivo: `fa-money-bill`
- Digital: `fa-credit-card`
- Reparto: `fa-truck`
- Fábrica: `fa-warehouse`

### 5. Modales

#### Estructura Base
```css
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    border-radius: 8px;
    max-width: 900px;          /* Modal grande (editar) */
    max-width: 600px;          /* Modal mediano (detalle) */
    max-width: 450px;          /* Modal pequeño (confirmar) */
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}
```

#### Header
```css
padding: 20px 24px;
border-bottom: 1px solid #ebecf0;
display: flex;
justify-content: space-between;
align-items: center;
```

#### Body (Grid 70/30)
```css
.modal-body-grid {
    display: grid;
    grid-template-columns: 70% 30%;
    gap: 24px;
    padding: 24px;
}
```

#### Sidebar (panel derecho)
```css
background: #f9fafb;         /* Gris muy claro */
padding: 24px;
border-radius: 6px;
```

#### Footer
```css
padding: 16px 24px;
border-top: 1px solid #ebecf0;
display: flex;
justify-content: flex-end;
gap: 12px;
```

### 6. Forms

#### Input Text/Number
```css
width: 100%;
padding: 10px 12px;
border: 1px solid #ebecf0;
border-radius: 6px;
font-size: 14px;
font-family: var(--font-stack);
transition: border-color 0.2s;
```

**Focus**:
```css
border-color: #0052cc;
outline: none;
box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
```

#### Select
```css
/* Igual que input, pero con: */
background: white;
cursor: pointer;
appearance: none;
background-image: url("data:image/svg+xml,..."); /* Icono dropdown */
background-repeat: no-repeat;
background-position: right 12px center;
padding-right: 36px;
```

#### Checkbox/Radio
```css
width: 18px;
height: 18px;
accent-color: #0052cc;       /* Color checked */
cursor: pointer;
```

#### Labels
```css
display: block;
margin-bottom: 6px;
font-size: 13px;
font-weight: 500;
color: #172b4d;
```

### 7. Tabs

**Container**:
```css
display: flex;
gap: 24px;
border-bottom: 2px solid #ebecf0;
padding: 0 24px;
```

**Tab Link**:
```css
padding: 12px 0;
font-size: 14px;
font-weight: 500;
color: #6b778c;
cursor: pointer;
border-bottom: 2px solid transparent;
margin-bottom: -2px;
transition: all 0.2s;
```

**Tab Activo**:
```css
color: #0052cc;
border-bottom-color: #0052cc;
font-weight: 600;
```

### 8. Stats/Métricas

**Panel de stats** (ventas, dashboard):
```css
display: flex;
gap: 16px;
padding: 16px 20px;
background: white;
border-radius: 8px;
border: 1px solid #ebecf0;
```

**Stat Item**:
```css
.stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stat-icon {
    width: 32px;
    height: 32px;
    background: #e3fcef;     /* Verde claro */
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #36b37e;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #172b4d;
}

.stat-label {
    font-size: 12px;
    color: #6b778c;
}
```

### 9. Filtros

**Container**:
```css
display: flex;
gap: 12px;
padding: 16px 20px;
background: white;
border-radius: 8px;
flex-wrap: wrap;
```

**Select filtro**:
```css
min-width: 160px;
/* Resto igual que select normal */
```

### 10. Avatar Cliente

**Circle Badge** (inicial letra):
```css
width: 48px;
height: 48px;
background: #172b4d;         /* Azul oscuro */
color: white;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 20px;
font-weight: 700;
```

---

## 🚫 Reglas Críticas de Diseño

### ❌ NUNCA HACER:

1. **NO usar "carditis"** (cards dentro de cards innecesarias)
   - ✅ Correcto: Secciones planas con borders sutiles
   - ❌ Incorrecto: Cards anidadas con sombras múltiples

2. **NO usar columna SKU** (eliminado en V2)
   - ✅ Solo: Producto, Precio Unit, Cantidad, Subtotal

3. **NO usar sombras exageradas**
   - ✅ Modales: `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12)`
   - ❌ Sombras oscuras/múltiples: NO

4. **NO inventar colores fuera de paleta**
   - ✅ Usar solo variables CSS definidas

5. **NO usar padding inconsistente**
   - ✅ Tablas compactas en modales: 8px
   - ✅ Tablas estándar: 12-16px

### ✅ SIEMPRE HACER:

1. **Consistencia sidebar**
   - Mismo diseño en TODOS los módulos
   - Botón COTIZADOR verde destacado
   - Badge NUEVO amarillo en item correcto
   - Auto-collapse a los 5 segundos

2. **Tablas sin SKU**
   - Columnas: Producto | Peso | P. Unit. | Cant. | Subtotal

3. **Modales con grid 70/30**
   - Izquierda: Contenido editable
   - Derecha: Resumen/totales (fondo #f9fafb)

4. **Headers tablas en mayúsculas**
   - `text-transform: uppercase`
   - Font-size: 11px
   - Font-weight: 600

5. **Badges con iconos**
   - SIEMPRE incluir icono Font Awesome relevante

6. **Espaciado consistente**
   - Usar múltiplos de 4px
   - Padding modales: 24px
   - Gap elements: 12-16px

---

## 🎯 Checklist Nuevo Prototipo

Antes de crear un nuevo módulo HTML, verificar:

- [ ] Variables CSS `:root` copiadas de cotizador/ventas
- [ ] Sidebar idéntica (logo verde, botón cotizador destacado, collapse)
- [ ] Tablas SIN columna SKU
- [ ] Headers tablas en mayúsculas (11px, weight 600)
- [ ] Badges de estado con iconos
- [ ] Modales con grid 70/30 (si aplica)
- [ ] Padding tablas: 8px (modal) o 12px (vista principal)
- [ ] Botones primarios: #172b4d
- [ ] Links/acciones: #0052cc
- [ ] Fondo app: #f4f5f7
- [ ] Border-radius consistente: 6-8px
- [ ] Font-family: var(--font-stack)

---

## 📸 Referencias Visuales

**Screenshots de referencia** (ubicación):
- `chrome_LzqcNXXK4E.png` - Cliente detalle (Info)
- `chrome_gTy659kIsI.png` - Cliente detalle (Historial Pedidos)
- `chrome_rsfQv0zCr5.png` - Modal Editar Pedido
- `chrome_yipaYgzNKH.png` - Modal Ver Detalle
- `chrome_dudqoUzvV4.png` - Tabla Ventas principal
- `chrome_GiL7Cn4aF4.png` - Tabla Clientes
- `chrome_Q7R3FFvkyf.png` - Cuenta Corriente (tab)

**Archivos CSS de referencia**:
- `prototipos/assets/cotizador/styles.css` - Base V2 completo
- `prototipos/assets/ventas/styles.css` - Variables + componentes
- `prototipos/assets/clientes/styles.css` - Sidebar coherente

---

**Última actualización**: 03 Enero 2026
**Mantenido por**: Giuliano (desarrollador)
**Para**: Consistencia visual total en todos los prototipos
