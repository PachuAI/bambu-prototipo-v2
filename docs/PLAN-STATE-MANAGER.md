# Plan: Sistema de Datos Mock Consistente - Bambu CRM V2

**Fecha creación**: 06 Enero 2026
**Estado**: EN PROGRESO
**Alcance**: Consistencia de datos + navegación (sin creación de pedidos aún)

---

## Resumen Ejecutivo

Crear un sistema de estado centralizado (`state-manager.js`) que:
- Unifique todos los datos mock en una sola fuente de verdad
- Persista cambios en localStorage
- Calcule totales/pesos desde productos reales
- Sincronice fechas en todos los módulos (HOY = Miércoles 8 enero 2026)

---

## Objetivo

- **Fecha central**: Miércoles 8 enero 2026
- **~80 pedidos** distribuidos lun-vie (15-20 por día)
- **Datos consistentes**: peso = suma real de productos, total = suma real de precios
- **Persistencia localStorage**: cambios sobreviven refresh
- **Botón Reset**: en Configuración para volver a datos frescos
- **Navegación funcional**: click en cliente → carga ese cliente

---

## Problemas Actuales a Resolver

| Problema | Impacto |
|----------|---------|
| Cada módulo genera sus propios datos mock | Datos diferentes en cada pantalla |
| Fechas inconsistentes (Dic 2025 vs Ene 2026) | Calendario muestra días distintos |
| `peso` y `total` son random, no calculados | Números no cuadran |
| Falta `cliente_id` en pedidos | No se puede navegar cliente→pedidos |
| `?id=` en URL no se lee | Click en cliente no carga sus datos |

---

## Arquitectura Propuesta

```
┌─────────────────────────────────────────────────┐
│              localStorage                        │
│         'bambu_crm_state' (JSON)                │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│           state-manager.js (NUEVO)              │
│                                                  │
│  BambuState.init()      → Carga o genera datos  │
│  BambuState.get('pedidos')  → Lee datos         │
│  BambuState.getPedidosByFecha('2026-01-08')     │
│  BambuState.calcularPesoPedido(pedidoId)        │
│  BambuState.reset()     → Regenera datos        │
└─────────────────────┬───────────────────────────┘
                      │
    ┌─────────┬───────┼───────┬─────────┐
    ▼         ▼       ▼       ▼         ▼
Dashboard  Ventas  Repartos Clientes  Productos
```

---

## Fases de Implementación

### Progreso Actual

| Fase | Descripción | Estado | Commit |
|------|-------------|--------|--------|
| 0 | Crear state-manager.js base | ⬜ Pendiente | `feat: crear state-manager.js base` |
| 1 | Estructuras normalizadas | ⬜ Pendiente | `feat: estructuras de datos normalizadas` |
| 2 | Generador datos consistentes | ⬜ Pendiente | `feat: generador datos consistentes` |
| 3 | Persistencia localStorage | ⬜ Pendiente | `feat: persistencia localStorage` |
| 4 | Migrar Dashboard | ⬜ Pendiente | `refactor(dashboard): usar state-manager` |
| 5 | Migrar Clientes + ?id= | ⬜ Pendiente | `refactor(clientes): migrar + soporte ?id=` |
| 6 | Migrar Ventas | ⬜ Pendiente | `refactor(ventas): eliminar datos locales` |
| 7 | Migrar Repartos-día | ⬜ Pendiente | `refactor(repartos): datos dinámicos` |

---

### FASE 0: Crear state-manager.js (base)

**Archivo nuevo**: `prototipos/shared/state-manager.js`

```javascript
const BambuState = {
    VERSION: '1.0.0',
    FECHA_SISTEMA: '2026-01-08',
    STORAGE_KEY: 'bambu_crm_state',

    init(),           // Carga desde localStorage o genera
    get(entidad),     // Retorna array de entidad
    getById(entidad, id),
    save(),           // Persiste en localStorage
    reset()           // Regenera datos frescos
};
```

---

### FASE 1: Estructuras normalizadas

**Cambio clave en PEDIDOS**:
```javascript
// ANTES (actual)
{ id: 500, cliente: 'ARAUCARIAS 371', peso: 35.2, total: 45000, items: 5 }

// DESPUÉS (normalizado)
{ id: 500, cliente_id: 1, direccion: 'ARAUCARIAS 371', vehiculo_id: 1 }
// peso, total, items → SE CALCULAN desde pedido_items
```

**Nueva tabla PEDIDO_ITEMS**:
```javascript
{ id: 1, pedido_id: 500, producto_id: 1, cantidad: 3, precio_unitario: 15000 }
```

---

### FASE 2: Generador de datos consistentes

**Distribución de ~80 pedidos**:

| Día | Fecha | Pedidos | Estado |
|-----|-------|---------|--------|
| Lunes | 06/01 | 18 | Controlado (todos entregados) |
| Martes | 07/01 | 16 | A controlar (80% entregados) |
| **Miércoles** | **08/01** | **16** | **HOY** (en tránsito/asignado) |
| Jueves | 09/01 | 16 | Mañana (pendiente/asignado) |
| Viernes | 10/01 | 12 | Planificando (pendiente) |
| Borradores | - | 3 | Sin fecha |

**Cálculos reales**:
```javascript
function calcularPesoPedido(pedidoId) {
    return pedido_items
        .filter(i => i.pedido_id === pedidoId)
        .reduce((sum, i) => {
            const prod = productos.find(p => p.id === i.producto_id);
            return sum + (prod.peso_kg * i.cantidad);
        }, 0);
}
```

---

### FASE 3: Persistencia localStorage

- Al cargar: verificar si existe estado guardado
- Si existe y versión compatible: usar datos guardados
- Si no: generar datos frescos
- Cada cambio: `BambuState.save()` automático

**Botón Reset** (en Configuración):
```javascript
function resetearDatos() {
    if (confirm('¿Regenerar todos los datos? Se perderán los cambios.')) {
        BambuState.reset();
        location.reload();
    }
}
```

---

### FASE 4: Migrar Dashboard

**Archivos**:
- `prototipos/dashboard.html` - agregar `<script src="shared/state-manager.js">`
- `prototipos/assets/dashboard/script.js` - usar `BambuState.*`

**Cambios**:
```javascript
// ANTES
const HOY = new Date(2026, 0, 8);
const pedidos = PEDIDOS.filter(...);

// DESPUÉS
BambuState.init();
const HOY = new Date(BambuState.FECHA_SISTEMA);
const pedidos = BambuState.getPedidosByFecha(fechaStr);
```

---

### FASE 5: Migrar Clientes + URL params

**Archivos**:
- `prototipos/clientes.html`
- `prototipos/cliente-detalle.html` - **LEER parámetro ?id=**
- `prototipos/assets/clientes/script.js`

**Implementar lectura de ?id=**:
```javascript
// cliente-detalle.html
const params = new URLSearchParams(window.location.search);
const clienteId = parseInt(params.get('id'));
const cliente = BambuState.getById('clientes', clienteId);

// Cargar datos del cliente
document.getElementById('direccion').textContent = cliente.direccion;
// Cargar pedidos del cliente
const pedidos = BambuState.getPedidosByCliente(clienteId);
```

---

### FASE 6: Migrar Ventas

**Archivo**: `prototipos/assets/ventas/script.js`

**ELIMINAR** (~200 líneas de datos hardcodeados):
- `generateMockPedidos()`
- `PEDIDOS_MOCK`
- `BORRADORES_MOCK`
- `CATALOGO_PRODUCTOS`
- `VEHICULOS_POR_DIA`

**REEMPLAZAR** por:
```javascript
BambuState.init();
const pedidos = BambuState.getPedidos({ estado: ['en transito', 'entregado'] });
const borradores = BambuState.getPedidos({ estado: 'borrador' });
```

**Calendario dinámico** (actualmente hardcodeado Dic 2025):
```javascript
// Generar semana desde FECHA_SISTEMA
const fechas = BambuState.getSemanaActual(); // ['2026-01-06', ..., '2026-01-10']
```

---

### FASE 7: Migrar Repartos-día

**Archivo**: `prototipos/assets/repartos/script.js`

**ELIMINAR** (~150 líneas de MOCK_DATA hardcodeado)

**REEMPLAZAR**:
```javascript
BambuState.init();
const fecha = getUrlParameter('fecha') || BambuState.FECHA_SISTEMA;
const pedidos = BambuState.getPedidosByFecha(fecha);
const vehiculos = BambuState.get('vehiculos');

// Calcular capacidad real de cada vehículo
vehiculos.forEach(v => {
    const pedidosVeh = pedidos.filter(p => p.vehiculo_id === v.id);
    v.pesoActual = pedidosVeh.reduce((sum, p) =>
        sum + BambuState.calcularPesoPedido(p.id), 0);
});
```

---

## Archivos a Modificar (Resumen)

| Fase | Archivo | Acción |
|------|---------|--------|
| 0 | `shared/state-manager.js` | **CREAR** |
| 4 | `dashboard.html` | Agregar import |
| 4 | `assets/dashboard/script.js` | Refactorizar |
| 5 | `cliente-detalle.html` | Leer ?id= |
| 5 | `assets/clientes/script.js` | Refactorizar |
| 6 | `ventas.html` | Agregar import |
| 6 | `assets/ventas/script.js` | **REFACTOR MAYOR** |
| 7 | `repartos-dia.html` | Agregar import |
| 7 | `assets/repartos/script.js` | **REFACTOR MAYOR** |

---

## Validaciones de Consistencia

Al inicializar, verificar:
- [ ] Todo pedido tiene `cliente_id` válido
- [ ] Todo `pedido_item` tiene `producto_id` válido
- [ ] Todo pedido con `vehiculo_id` tiene vehículo válido
- [ ] Pedidos no-borrador tienen al menos 1 item

Mostrar warnings en consola si hay errores.

---

## Qué NO incluye esta versión (v1)

- ❌ Crear pedidos desde Cotizador (Fase 2 futura)
- ❌ Editar pedidos con persistencia
- ❌ CRUD de clientes con persistencia
- ❌ Migrar productos.html, estadisticas.html, configuracion.html, backup.html

Estos quedan para una segunda iteración una vez que la base esté sólida.

---

## Criterios de Éxito

1. **Consistencia visual**: Mismo pedido muestra mismo total/peso en Dashboard, Ventas y Repartos
2. **Navegación funcional**: Click en cliente → cliente-detalle.html?id=X → muestra ese cliente
3. **Calendario sincronizado**: Todos muestran semana 6-10 enero 2026
4. **Persistencia**: Refresh no pierde cambios
5. **Reset funciona**: Botón en Configuración regenera datos frescos

---

## Notas para Retomar Contexto

Si retomás este plan después de un `/clear`:

1. **Leer este archivo** para entender el plan completo
2. **Ver docs/TODO.md** para saber en qué fase estamos
3. **Verificar último commit** con `git log -1` para saber qué se completó
4. **Continuar con la siguiente fase** pendiente

### Comandos útiles:
```bash
# Ver estado actual
git status
git log --oneline -5

# Ver qué fases están completas
grep "✅" docs/PLAN-STATE-MANAGER.md
```
