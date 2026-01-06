---
name: construir-prototipo
description: Construye nuevas secciones HTML, modales y componentes para prototipos Bambu V2. Aplica sistema de diseño (tokens.css + components.css), reglas de compactación, dark mode, y conecta con PRDs. Usar cuando se necesite crear nuevo HTML para prototipos.
---

# Construir Nuevo Prototipo HTML - Bambu V2

## Proceso de Construcción

### FASE 0: Leer PRD (OBLIGATORIO - SIEMPRE PRIMERO)

**⚠️ CRÍTICO: NO empezar a construir sin haber leído el PRD completo.**

```
ANTES DE CUALQUIER OTRA COSA:
1. Leer `prd/{modulo}.html` completo
2. Identificar: campos, validaciones, flujos, reglas de negocio
3. Extraer estructura de datos (mock data)
4. Anotar integraciones con otros módulos
```

El PRD es la **fuente de verdad** para:
- Qué campos incluir (y cuáles NO)
- Validaciones y mensajes de error
- Estados y badges
- Flujos de usuario
- Casos de uso a cubrir

---

### FASE 1: Análisis

**1.1 Identificar qué construir:**
- ¿Es modal, sección, página completa, componente?
- ¿En qué archivo HTML va? (`prototipos/{modulo}.html`)
- ¿Es módulo nuevo o extensión de existente?

**1.2 Revisar contexto:**
- Leer ASCII/wireframe si el usuario lo proporciona
- Identificar datos mock necesarios (`shared/mock-data.js`)
- Listar qué es solo HTML/CSS vs qué necesita JS
- Revisar prototipos existentes similares para consistencia

---

### FASE 2: Implementación HTML

**Estructura base para MODALES:**
```html
<div id="modal-{nombre}" class="modal-overlay hidden">
    <div class="modal-container modal-{size}">
        <div class="modal-header">
            <h2><i class="fas fa-{icon}"></i> Título</h2>
            <button class="modal-close" onclick="cerrarModal('{nombre}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <!-- Contenido compacto -->
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" onclick="cerrarModal('{nombre}')">Cancelar</button>
            <button class="btn-primary" onclick="accion{Nombre}()">Confirmar</button>
        </div>
    </div>
</div>
```

**Tamaños de modal:** `modal-small` (400px), `modal-medium` (600px), `modal-large` (800px)

---

### FASE 3: Reglas de Compactación (CRÍTICO)

**NUNCA overflow vertical en modales.** Si hay scroll, reestructurar.

| Elemento | Valor |
|----------|-------|
| Modal padding | 12-16px |
| Gap entre elementos | 6-10px |
| Font labels | 11-12px |
| Font inputs | 13px |
| Input padding | 6-8px vertical |
| Margin secciones | 10-12px |
| Border radius | 4-6px |

**Form groups compactos:**
```css
.form-group { margin-bottom: 10px; }
.form-group label { font-size: 12px; margin-bottom: 3px; }
.form-input { padding: 8px 12px; font-size: 13px; }
```

---

### FASE 4: Sistema de Diseño

**Imports requeridos (en orden):**
```html
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="shared/components.css">
<link rel="stylesheet" href="assets/{modulo}/{modulo}-specific.css">
```

**Variables CSS a usar (tokens.css):**
```css
/* Colores */
var(--color-primary)      /* Azul principal */
var(--color-success)      /* Verde */
var(--color-warning)      /* Amarillo */
var(--color-danger)       /* Rojo */
var(--text-primary)       /* Texto principal */
var(--text-secondary)     /* Texto secundario */
var(--bg-white)           /* Fondo blanco */
var(--bg-sidebar)         /* Fondo sidebar */
var(--border-color)       /* Bordes */

/* Espaciado */
var(--spacing-sm)  /* 8px */
var(--spacing-md)  /* 12px */
var(--spacing-lg)  /* 16px */
```

**Componentes disponibles (components.css):**
- `.btn-primary`, `.btn-secondary`, `.btn-icon-sm`
- `.form-group`, `.form-label`, `.form-input`
- `.modal-overlay`, `.modal-container`, `.modal-header/body/footer`
- `.badge-status`, `.badge-status.active`
- `.table`, `.ledger-table`

---

### FASE 5: Dark Mode (OBLIGATORIO)

**Implementar desde el inicio.** Agregar en `{modulo}-specific.css`:

```css
/* Dark mode overrides */
[data-theme="dark"] .mi-componente {
    background: var(--bg-sidebar) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

[data-theme="dark"] .mi-input {
    background: #1a1f2e !important;
    border-color: #3d4556 !important;
}
```

**Colores dark mode:**
- Fondo inputs: `#1a1f2e`
- Bordes: `#3d4556`
- Hover: `#242938`
- Texto secundario: `#9ca3af`

---

### FASE 6: Lógica JavaScript Mock

**⚠️ CRÍTICO: Toda lógica debe estar COMENTADA para auditorías contra PRD.**

**Estructura función con comentarios obligatorios:**
```javascript
// ============================================================================
// REGLA DE NEGOCIO: Crear/Editar Producto
// PRD: prd/productos.html - Sección 4.2
// ============================================================================

/**
 * Guarda un producto nuevo o actualiza uno existente.
 *
 * LÓGICA DE NEGOCIO:
 * - Si en_promocion=true → precio_base disabled, usar precio_promocional
 * - Si en_promocion=false → precio_promocional disabled, usar precio_base
 * - stock_minimo es opcional (default: 20 para filtro stock bajo)
 *
 * VALIDACIONES:
 * - Nombre: obligatorio, único
 * - Precio activo: debe ser > 0
 * - Stock actual: obligatorio
 * - Peso: obligatorio, > 0
 */
function guardarProducto() {
    // 1. Obtener valores del formulario
    const nombre = document.getElementById('prod-nombre').value.trim();

    // 2. Validar nombre único (PRD sección 4.2.1)
    const nombreExiste = productosLocal.some(p => p.nombre === nombre);

    // 3. Validar precio según modo promoción (PRD sección 4.5)
    if (enPromocion) {
        // Producto en promoción: validar precio promocional
    } else {
        // Producto normal: validar precio base
    }

    // 4. Guardar con estructura de datos según PRD
    // 5. Feedback y actualizar UI
}
```

**Conectar con mock-data.js:**
```javascript
// Usar datos existentes
const cliente = CLIENTES.find(c => c.id === clienteId);
const productos = PRODUCTOS.filter(p => p.categoria === 'limpieza');
```

**Propósito de los comentarios:**
- Facilitar auditorías comparando mock vs PRD
- Documentar reglas de negocio implementadas
- Identificar secciones del PRD que cubre cada función

---

### FASE 7: Checklist Final

**Antes de dar por terminado:**

✅ **Conformidad con PRD:**
- [ ] Todos los campos del PRD incluidos
- [ ] Validaciones según PRD implementadas
- [ ] Flujos de usuario cubiertos
- [ ] Reglas de negocio respetadas
- [ ] NO hay campos inventados que no estén en PRD

✅ **Sistema de diseño:**
- [ ] Usa tokens.css (no hardcodear colores)
- [ ] Usa components.css (no reinventar)
- [ ] Estilos específicos en `{modulo}-specific.css`

✅ **UX y accesibilidad:**
- [ ] HTML semántico y accesible
- [ ] Dark mode implementado
- [ ] NO hay overflow vertical
- [ ] Compactación aplicada
- [ ] Probado en light y dark mode

✅ **Funcionalidad:**
- [ ] JS mock funcional
- [ ] Datos conectados con mock-data.js
- [ ] Notificaciones de feedback
- [ ] **Lógica comentada con referencias a PRD** (obligatorio para auditorías)

---

## Ejemplo: Modal Nuevo Cliente

```html
<div id="modal-nuevo-cliente" class="modal-overlay hidden">
    <div class="modal-container modal-medium">
        <div class="modal-header">
            <h2><i class="fas fa-user-plus"></i> Nuevo Cliente</h2>
            <button class="modal-close" onclick="cerrarModal('nuevo-cliente')">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Dirección *</label>
                <input type="text" class="form-input" id="nc-direccion" placeholder="Ej: Av. Argentina 123">
            </div>
            <div class="form-row-2">
                <div class="form-group">
                    <label class="form-label">Teléfono</label>
                    <input type="text" class="form-input" id="nc-telefono">
                </div>
                <div class="form-group">
                    <label class="form-label">Ciudad</label>
                    <select class="form-input" id="nc-ciudad">
                        <option>Neuquén</option>
                        <option>Plottier</option>
                        <option>Centenario</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Lista de Precio</label>
                <div class="btn-group-toggle">
                    <button class="btn-toggle active" data-value="l1">L1</button>
                    <button class="btn-toggle" data-value="l2">L2</button>
                    <button class="btn-toggle" data-value="l3">L3</button>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" onclick="cerrarModal('nuevo-cliente')">Cancelar</button>
            <button class="btn-primary" onclick="guardarNuevoCliente()">
                <i class="fas fa-save"></i> Guardar
            </button>
        </div>
    </div>
</div>
```

---

## Archivos de Referencia

- **Sistema diseño:** `shared/tokens.css`, `shared/components.css`
- **Mock data:** `shared/mock-data.js`
- **PRDs:** `prd/*.html`
- **Ejemplos:** `prototipos/cliente-detalle.html` (modal pago, header unificado)
