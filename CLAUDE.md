# CLAUDE.md - Bambu CRM V2 Prototipo

## Entorno

- **OS**: Windows (usar PowerShell, NO bash)
- **Fecha actual**: 06 Enero 2026
- **Proyecto**: Prototipos HTML para validar UX antes de desarrollo
- **Stack prototipo**: HTML5 + CSS3 + JavaScript vanilla (NO frameworks)
- **Idioma**: Español siempre

---

## Comandos Frecuentes

```powershell
# Abrir en navegador
start prototipos/index.html

# Verificar estructura
Get-ChildItem -Recurse -Name

# Git
git status
git add . && git commit -m "mensaje"
```

---

## Estructura del Proyecto

```
bambu_v2_prototipo/
├── docs/                    # Documentación (README, CHANGELOG, TODO, FLUJOS-NEGOCIO, ARQUITECTURA)
├── prd/                     # PRDs HTML (especificaciones por módulo)
├── prototipos/              # Prototipos HTML interactivos
│   ├── shared/
│   │   ├── tokens.css       # Variables CSS (fuente de verdad colores/espaciado)
│   │   ├── components.css   # Componentes genéricos reutilizables
│   │   ├── mock-data.js     # Datos mock centralizados
│   │   └── utils.js         # Helpers + dark mode (toggleTheme, formatCurrency, etc.)
│   └── assets/{modulo}/
│       ├── script.js
│       └── {modulo}-specific.css
└── .claude/skills/          # Skills disponibles
```

---

## Reglas CRÍTICAS

### NUNCA hacer
- ❌ Usar frameworks (React, Vue, Alpine)
- ❌ Inventar campos sin revisar código existente
- ❌ Usar CUIT, Razón Social, SKU (NO existen en V2)
- ❌ Mensajes largos sin pedido explícito
- ❌ Tocar sistema V1 producción

### SIEMPRE hacer
- ✅ HTML + CSS + JS vanilla puro
- ✅ Revisar prototipos existentes antes de crear estructuras
- ✅ Usar sistema CSS: tokens.css → components.css → specific.css
- ✅ Mensajes concisos (economizar tokens)
- ✅ Dark mode desde inicio en nuevos componentes
- ✅ **Comentar lógica JS** para auditorías contra PRD (ver abajo)

---

## Regla de Comentarios en JavaScript

**OBLIGATORIO**: Toda lógica de negocio en archivos `.js` debe estar comentada para facilitar auditorías y validación contra el PRD.

**Formato de comentarios:**
```javascript
// ============================================================================
// REGLA DE NEGOCIO: [Nombre de la regla]
// PRD: prd/{modulo}.html - Sección X.X
// ============================================================================

/**
 * [Descripción de la función]
 *
 * LÓGICA DE NEGOCIO:
 * - Si condición A → resultado X
 * - Si condición B → resultado Y
 *
 * VALIDACIONES:
 * - Campo obligatorio
 * - Valor debe ser > 0
 */
function miFuncion() {
    // Paso 1: Obtener datos
    // Paso 2: Validar según PRD sección X.X
    // Paso 3: Aplicar regla de negocio
}
```

**Propósito**: Permite comparar el mock con la especificación del PRD durante auditorías

---

## Sistema CSS Actual

**Imports en cada prototipo:**
```html
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="shared/components.css">
<link rel="stylesheet" href="assets/{modulo}/{modulo}-specific.css">
```

**Paleta minimalista (3 colores funcionales):**
- Verde `#36b37e` → Estados completados (ENTREGADO)
- Naranja `#ffab00` → Estados en proceso (PENDIENTE, EN TRÁNSITO)
- Gris `#6b778c` → Todo lo demás

---

## Campos de Datos (Clientes)

**USAR:**
- `direccion` (identificador principal)
- `telefono`, `ciudad`, `email`
- `lista_precio` (L1/L2/L3)
- `saldo`

**NO EXISTEN:**
- ~~CUIT~~, ~~Razón Social~~, ~~Nombre~~, ~~SKU~~

---

## Negocio (Resumen)

- **Cliente**: Química Bambu S.R.L. (Neuquén, Argentina)
- **Tipos pedido**: REPARTO (entrega) | FÁBRICA (retira cliente)
- **Estados**: Borrador → En tránsito → Entregado
- **Listas precio**: L1 (caro) → L2 (-6.25%) → L3 (-10%)
- **Vehículos**: Reparto 1, Reparto 2, Reparto 3
- **Cuenta Corriente**: Integrada en cliente-detalle.html (tab)

---

## Skills Disponibles

- `/construir-prototipo` - Proceso 7 fases para crear nuevo HTML con reglas de compactación y dark mode
- `/analizar-estado-modulo` - Auditar prototipo vs PRD, genera documento ESTADO-{MODULO}.md
- `/migrar-css-tokens` - Migrar CSS antiguo al sistema tokens.css + components.css

---

## Prototipos Existentes (10 módulos)

| Archivo | Descripción |
|---------|-------------|
| `dashboard.html` | Buscador global, calendario, alertas |
| `cotizador.html` | Crear pedidos (REPARTO/FÁBRICA) |
| `ventas.html` | Lista + borradores + calendario semana |
| `repartos-dia.html` | Vista día, asignar vehículos |
| `clientes.html` | Listado con filtros |
| `cliente-detalle.html` | Detalle + Cuenta Corriente (tabs) |
| `productos.html` | CRUD productos, stock, promociones |
| `estadisticas.html` | Filtros, tabla, gráfico Chart.js, exportar |
| `configuracion.html` | Vehículos, ciudades, listas precio, stock |
| `backup.html` | Crear/restaurar backups, logs auditoría |

---

## Comunicación

- Mensajes cortos y directos
- Solo expandir si se pide
- Actualizar CHANGELOG.md con cambios significativos

---

## Referencias

- **PRDs**: `prd/index.html`
- **Docs**: `docs/` (CHANGELOG, TODO, FLUJOS-NEGOCIO, ARQUITECTURA)
- **V1 Producción**: https://gestion.quimicabambu.com.ar (NO tocar)
