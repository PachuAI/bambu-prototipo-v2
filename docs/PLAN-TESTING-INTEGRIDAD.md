# Plan de Testing de Integridad - Bambu CRM V2 Prototipo

**Fecha de creación**: 07 Enero 2026
**Objetivo**: Validar que el prototipo funciona como un sistema integrado antes de pasar a desarrollo Laravel
**Estado**: 🔴 Pendiente

---

## Índice

1. [Contexto y Objetivo](#1-contexto-y-objetivo)
2. [Arquitectura de Datos](#2-arquitectura-de-datos)
3. [Tests de Código (Automáticos)](#3-tests-de-código-automáticos)
4. [Tests Manuales (Navegador)](#4-tests-manuales-navegador)
5. [Checklist por Módulo](#5-checklist-por-módulo)
6. [Matriz de Conectividad](#6-matriz-de-conectividad)
7. [Registro de Sesiones](#7-registro-de-sesiones)

---

## 1. Contexto y Objetivo

### ¿Qué estamos validando?

El prototipo debe comportarse como un **sistema real con datos mock**, no como pantallas aisladas con datos inventados en cada lugar.

### Criterios de éxito

- [ ] **Datos únicos**: Un pedido tiene UNA sola versión en todo el sistema
- [ ] **Cálculos dinámicos**: Totales, kilos, saldos se CALCULAN, no están hardcodeados
- [ ] **Navegación completa**: Click en cualquier entidad lleva a su detalle real
- [ ] **Consistencia visual**: Los mismos datos se ven igual en todos los módulos
- [ ] **BambuState**: Todos los módulos usan el state manager centralizado

### Fuentes de verdad

| Archivo | Contenido |
|---------|-----------|
| `shared/mock-data.js` | Datos centralizados (clientes, productos, pedidos, etc.) |
| `shared/state-manager.js` | BambuState - gestión de estado |
| `docs/FLUJOS-NEGOCIO.md` | Reglas de negocio y estados |

---

## 2. Arquitectura de Datos

### Entidades principales

```
CLIENTES
├── id, direccion, telefono, ciudad, email
├── lista_precio (L1/L2/L3)
├── saldo (calculado de cuenta corriente)
└── descuento_fijo (%)

PRODUCTOS
├── id, nombre, precio_base
├── peso_kg
├── stock_actual
└── precio_promocional (opcional)

PEDIDOS
├── id, cliente_id, fecha, tipo (REPARTO/FÁBRICA)
├── estado (borrador/en_transito/entregado)
├── vehiculo_id (si es reparto)
├── productos[] (con cantidad, precio_unitario, descuento)
├── total (calculado)
└── peso_total_kg (calculado)

VEHICULOS
├── id, nombre, capacidad_kg
└── modelo, patente

CUENTA_CORRIENTE (por cliente)
├── movimientos[] (cargo/pago)
├── saldo (calculado)
└── fecha, concepto, monto
```

### Relaciones críticas

```
Pedido.cliente_id → Cliente.id
Pedido.productos[].producto_id → Producto.id
Pedido.vehiculo_id → Vehiculo.id
CuentaCorriente.cliente_id → Cliente.id
CuentaCorriente.pedido_id → Pedido.id (para cargos)
```

---

## 3. Tests de Código (Automáticos)

Estas verificaciones se hacen revisando el código fuente. Claude puede ejecutarlas.

### 3.1 Uso de BambuState

**Verificar en cada script.js:**

| Módulo | Archivo | Importa BambuState | Usa getState() | No tiene datos hardcodeados |
|--------|---------|-------------------|----------------|----------------------------|
| Dashboard | `assets/dashboard/script.js` | [ ] | [ ] | [ ] |
| Cotizador | `assets/cotizador/script.js` | [ ] | [ ] | [ ] |
| Ventas | `assets/ventas/script.js` | [ ] | [ ] | [ ] |
| Repartos | `assets/repartos-dia/script.js` | [ ] | [ ] | [ ] |
| Clientes | `assets/clientes/script.js` | [ ] | [ ] | [ ] |
| Cliente Detalle | `assets/cliente-detalle/script.js` | [ ] | [ ] | [ ] |
| Productos | `assets/productos/script.js` | [ ] | [ ] | [ ] |
| Estadísticas | `assets/estadisticas/script.js` | [ ] | [ ] | [ ] |
| Configuración | `assets/configuracion/script.js` | [ ] | [ ] | [ ] |
| Backup | `assets/backup/script.js` | [ ] | [ ] | [ ] |

**Qué buscar como problemas:**
```javascript
// ❌ MAL - Datos hardcodeados
const pedidos = [
    { id: 1, cliente: "Juan", total: 15000 },
    ...
];

// ✅ BIEN - Datos del state
const pedidos = BambuState.getState().pedidos;
```

### 3.2 Cálculos dinámicos

**Verificar que estas funciones EXISTEN y se USAN:**

| Cálculo | Función esperada | Archivo | Existe | Se usa |
|---------|-----------------|---------|--------|--------|
| Total pedido | `calcularTotalPedido()` | state-manager.js o script | [ ] | [ ] |
| Kilos pedido | `calcularPesoTotal()` | state-manager.js o script | [ ] | [ ] |
| Saldo cliente | `calcularSaldoCliente()` | state-manager.js o script | [ ] | [ ] |
| Capacidad vehículo | `calcularCapacidadDisponible()` | repartos script | [ ] | [ ] |
| Subtotal línea | `precio * cantidad * (1 - descuento)` | cotizador/ventas | [ ] | [ ] |

**Qué buscar como problemas:**
```javascript
// ❌ MAL - Total hardcodeado
pedido.total = 25000;

// ✅ BIEN - Total calculado
pedido.total = pedido.productos.reduce((sum, p) =>
    sum + (p.precio * p.cantidad * (1 - p.descuento/100)), 0
);
```

### 3.3 Navegación con parámetros

**Verificar que los links pasan IDs:**

| Origen | Destino | Parámetro | Implementado |
|--------|---------|-----------|--------------|
| Lista pedidos → Detalle pedido | Modal o página | `pedido_id` | [ ] |
| Pedido → Cliente | cliente-detalle.html | `?cliente=ID` | [ ] |
| Lista clientes → Detalle cliente | cliente-detalle.html | `?cliente=ID` | [ ] |
| Calendario → Día específico | repartos-dia.html | `?fecha=YYYY-MM-DD` | [ ] |
| Dashboard búsqueda → Entidad | Módulo correspondiente | ID de entidad | [ ] |

**Qué buscar:**
```javascript
// ❌ MAL - Link sin parámetro
window.location.href = 'cliente-detalle.html';

// ✅ BIEN - Link con parámetro
window.location.href = `cliente-detalle.html?cliente=${clienteId}`;
```

### 3.4 Lectura de parámetros URL

**Verificar que los módulos destino LEEN los parámetros:**

| Módulo | Lee parámetros URL | Carga datos según parámetro |
|--------|-------------------|----------------------------|
| cliente-detalle.html | [ ] | [ ] |
| repartos-dia.html | [ ] | [ ] |
| cotizador.html (modo edición) | [ ] | [ ] |

**Qué buscar:**
```javascript
// ✅ BIEN - Lee parámetro y carga datos
const params = new URLSearchParams(window.location.search);
const clienteId = params.get('cliente');
if (clienteId) {
    const cliente = BambuState.getCliente(clienteId);
    renderClienteDetalle(cliente);
}
```

---

## 4. Tests Manuales (Navegador)

Estos tests los ejecuta una persona usando el prototipo en el navegador.

### 4.1 Flujo: Crear pedido REPARTO y verificar consistencia

```
PASOS:
1. Abrir cotizador.html
2. Seleccionar modo REPARTO
3. Seleccionar cliente existente (ej: "Av. Argentina 123")
4. Agregar 3 productos diferentes
5. Aplicar descuento 10%
6. Confirmar pedido → Seleccionar fecha (ej: mañana)
7. Ir a ventas.html

VERIFICAR:
[ ] El pedido aparece en la lista de ventas
[ ] El cliente mostrado coincide con el seleccionado
[ ] El total coincide con el calculado en cotizador
[ ] Los kilos coinciden
[ ] El estado es "En tránsito"
[ ] La fecha es la seleccionada

8. Click en el pedido para ver detalle

VERIFICAR:
[ ] Los productos son los mismos (nombre, cantidad, precio)
[ ] El descuento está aplicado
[ ] El subtotal de cada línea es correcto
[ ] El total general es correcto
[ ] Los kilos totales son correctos

9. Click en el nombre del cliente

VERIFICAR:
[ ] Navega a cliente-detalle.html
[ ] Muestra el cliente correcto
[ ] En cuenta corriente aparece el cargo del pedido
[ ] El monto del cargo coincide con el total del pedido
```

**Estado del test:** [ ] Pasó | [ ] Falló | [ ] Parcial

**Notas:**
```
(Anotar aquí problemas encontrados)
```

---

### 4.2 Flujo: Verificar calendario de repartos

```
PASOS:
1. Abrir ventas.html
2. Ir al calendario semanal
3. Identificar un día con pedidos (ej: tiene badge "3 pedidos - 150kg")
4. Click en ese día

VERIFICAR EN EL BADGE DEL DÍA:
[ ] Cantidad de pedidos coincide con pedidos reales de esa fecha
[ ] Kilos totales = suma de kilos de esos pedidos

5. Se abre repartos-dia.html

VERIFICAR EN REPARTOS-DIA:
[ ] La fecha mostrada es la correcta
[ ] Los pedidos listados son los de esa fecha
[ ] Los kilos de cada pedido son correctos
[ ] El total de kilos del día coincide con el badge

6. Asignar un pedido a un vehículo

VERIFICAR:
[ ] La capacidad del vehículo se actualiza
[ ] El pedido se mueve a la columna del vehículo
[ ] Los kilos se descuentan de la capacidad disponible
```

**Estado del test:** [ ] Pasó | [ ] Falló | [ ] Parcial

**Notas:**
```
(Anotar aquí problemas encontrados)
```

---

### 4.3 Flujo: Verificar cuenta corriente del cliente

```
PASOS:
1. Abrir clientes.html
2. Buscar un cliente con saldo (ej: saldo $15.000)
3. Click en el cliente

VERIFICAR EN LISTA:
[ ] El saldo mostrado es un número específico (no genérico)

4. Se abre cliente-detalle.html

VERIFICAR:
[ ] Los datos del cliente coinciden
[ ] El saldo en el header coincide con la lista

5. Ir a pestaña "Cuenta Corriente"

VERIFICAR:
[ ] Hay movimientos listados
[ ] Los cargos corresponden a pedidos reales del cliente
[ ] Los pagos tienen fechas y montos
[ ] Saldo = Σ(cargos) - Σ(pagos)
[ ] El saldo calculado coincide con el mostrado

6. Click en un cargo (si es clickeable)

VERIFICAR:
[ ] Lleva al detalle del pedido correspondiente
[ ] O muestra modal con info del pedido
```

**Estado del test:** [ ] Pasó | [ ] Falló | [ ] Parcial

**Notas:**
```
(Anotar aquí problemas encontrados)
```

---

### 4.4 Flujo: Verificar productos y stock

```
PASOS:
1. Abrir productos.html
2. Identificar un producto con stock específico (ej: "Lavandina 5L" - Stock: 50)
3. Anotar: Producto, Stock actual, Precio

4. Abrir cotizador.html
5. Crear pedido con 10 unidades de ese producto
6. Confirmar pedido (modo FÁBRICA para que sea inmediato)

7. Volver a productos.html

VERIFICAR:
[ ] El stock se redujo en 10 unidades (50 → 40)
[ ] O hay indicador de "reservado" si el stock no se descuenta en borrador

8. Cancelar el pedido desde ventas.html

VERIFICAR:
[ ] El stock se restauró (40 → 50)
```

**Estado del test:** [ ] Pasó | [ ] Falló | [ ] Parcial

**Notas:**
```
(Anotar aquí problemas encontrados)
```

---

### 4.5 Flujo: Dashboard - Búsqueda global

```
PASOS:
1. Abrir dashboard.html
2. En el buscador, escribir nombre de un cliente existente

VERIFICAR:
[ ] Aparece en resultados
[ ] Click lleva a cliente-detalle.html con datos correctos

3. Buscar número de pedido existente

VERIFICAR:
[ ] Aparece en resultados
[ ] Click lleva al detalle del pedido

4. Buscar nombre de producto

VERIFICAR:
[ ] Aparece en resultados
[ ] Click lleva a productos.html o muestra detalle

5. Revisar alertas de stock bajo

VERIFICAR:
[ ] Los productos con alerta tienen stock real bajo el mínimo
[ ] Click en alerta lleva al producto
```

**Estado del test:** [ ] Pasó | [ ] Falló | [ ] Parcial

**Notas:**
```
(Anotar aquí problemas encontrados)
```

---

### 4.6 Flujo: Edición de pedido entregado

```
PASOS:
1. Abrir ventas.html
2. Buscar un pedido con estado "Entregado"
3. Click en "Editar"

VERIFICAR:
[ ] Se puede editar (no está bloqueado)
[ ] Los datos cargados son los correctos

4. Cambiar cantidad de un producto (ej: 10 → 8)
5. Guardar

VERIFICAR:
[ ] El total se recalcula
[ ] Los kilos se recalculan
[ ] En cuenta corriente del cliente aparece AJUSTE
[ ] El ajuste tiene el monto correcto (diferencia)
```

**Estado del test:** [ ] Pasó | [ ] Falló | [ ] Parcial

**Notas:**
```
(Anotar aquí problemas encontrados)
```

---

## 5. Checklist por Módulo

### 5.1 Dashboard
- [ ] Usa BambuState para datos
- [ ] Buscador funciona con datos reales
- [ ] Alertas stock calculadas dinámicamente
- [ ] Calendario muestra pedidos reales
- [ ] Links a entidades funcionan

### 5.2 Cotizador
- [ ] Lista clientes viene de BambuState
- [ ] Lista productos viene de BambuState
- [ ] Precios según lista del cliente (L1/L2/L3)
- [ ] Descuentos se calculan correctamente
- [ ] Total se calcula en tiempo real
- [ ] Kilos se calculan en tiempo real
- [ ] Al confirmar, pedido se guarda en state
- [ ] Stock se actualiza (si aplica)

### 5.3 Ventas
- [ ] Lista pedidos viene de BambuState
- [ ] Filtros funcionan sobre datos reales
- [ ] Detalle pedido muestra datos correctos
- [ ] Productos del pedido son los reales
- [ ] Totales coinciden con cotizador
- [ ] Click en cliente navega correctamente
- [ ] Cambio de estado funciona
- [ ] Edición actualiza state

### 5.4 Repartos-día
- [ ] Lee fecha de URL o parámetro
- [ ] Muestra pedidos de esa fecha
- [ ] Kilos por pedido son correctos
- [ ] Total del día es suma real
- [ ] Vehículos vienen de configuración
- [ ] Capacidad se calcula dinámicamente
- [ ] Drag & drop actualiza asignaciones

### 5.5 Clientes
- [ ] Lista viene de BambuState
- [ ] Saldos son calculados (no hardcodeados)
- [ ] Filtros funcionan
- [ ] Click navega a detalle con ID

### 5.6 Cliente-detalle
- [ ] Lee cliente_id de URL
- [ ] Carga datos del cliente correcto
- [ ] Cuenta corriente tiene movimientos reales
- [ ] Saldo = cargos - pagos
- [ ] Pedidos del cliente son los correctos
- [ ] Puede registrar pagos

### 5.7 Productos
- [ ] Lista viene de BambuState
- [ ] Stock es el real
- [ ] Precios son los de mock-data
- [ ] Edición actualiza state
- [ ] Alertas stock son dinámicas

### 5.8 Estadísticas
- [ ] Datos vienen de pedidos reales
- [ ] Filtros funcionan sobre datos reales
- [ ] Totales son calculados
- [ ] Gráficos reflejan datos reales
- [ ] Exportar incluye datos correctos

### 5.9 Configuración
- [ ] Vehículos vienen de BambuState
- [ ] Ciudades vienen de BambuState
- [ ] Listas de precio configurables
- [ ] Cambios se guardan en state

### 5.10 Backup
- [ ] Exporta datos reales del state
- [ ] Importar restaura state correctamente
- [ ] Logs reflejan acciones reales

---

## 6. Matriz de Conectividad

Verificar que cada combinación origen→destino funciona:

| Desde ↓ / Hacia → | Cliente Detalle | Pedido Detalle | Producto Detalle | Repartos Día |
|-------------------|-----------------|----------------|------------------|--------------|
| **Dashboard** | [ ] | [ ] | [ ] | [ ] |
| **Cotizador** | [ ] | N/A | [ ] | N/A |
| **Ventas** | [ ] | [ ] | [ ] | [ ] |
| **Clientes** | [ ] | [ ] | N/A | N/A |
| **Cliente Detalle** | N/A | [ ] | N/A | N/A |
| **Repartos Día** | [ ] | [ ] | N/A | N/A |
| **Productos** | N/A | N/A | [ ] | N/A |
| **Estadísticas** | [ ] | [ ] | [ ] | N/A |

**Leyenda:**
- [ ] = Pendiente de verificar
- [x] = Funciona
- [!] = No funciona / Tiene bugs
- N/A = No aplica (no hay navegación directa)

---

## 7. Registro de Sesiones

### Sesión 1 - [FECHA]
**Módulos testeados:**
-

**Tests ejecutados:**
-

**Problemas encontrados:**
1.

**Acciones tomadas:**
1.

**Estado al finalizar:**
- Tests código: _/_ pasados
- Tests manuales: _/_ pasados

---

### Sesión 2 - [FECHA]
**Módulos testeados:**
-

**Tests ejecutados:**
-

**Problemas encontrados:**
1.

**Acciones tomadas:**
1.

**Estado al finalizar:**
- Tests código: _/_ pasados
- Tests manuales: _/_ pasados

---

### Sesión 3 - [FECHA]
(Copiar template anterior)

---

## Resumen de Estado

| Categoría | Total | Pasados | Fallidos | Pendientes |
|-----------|-------|---------|----------|------------|
| Tests código (3.x) | ~40 | 0 | 0 | 40 |
| Tests manuales (4.x) | 6 flujos | 0 | 0 | 6 |
| Checklist módulos (5.x) | 10 | 0 | 0 | 10 |
| Matriz conectividad (6.x) | ~30 | 0 | 0 | 30 |

**Estado general:** 🔴 No iniciado

---

## Notas Adicionales

### Datos de prueba recomendados

Para facilitar el testing, asegurar que mock-data.js tenga:

- [ ] Al menos 5 clientes con datos variados
- [ ] Al menos 10 productos con precios y pesos diferentes
- [ ] Al menos 15 pedidos en diferentes estados
- [ ] Pedidos distribuidos en varios días (para calendario)
- [ ] Al menos 1 cliente con saldo positivo (debe)
- [ ] Al menos 1 cliente con saldo negativo (a favor)
- [ ] Productos con stock bajo (para alertas)
- [ ] Pedidos asignados a diferentes vehículos

### Criterios de "Listo para Laravel"

El prototipo está listo cuando:

1. **100% de tests de código pasan** (sección 3)
2. **100% de tests manuales pasan** (sección 4)
3. **90%+ de checklist por módulo** (sección 5)
4. **Matriz de conectividad completa** (sección 6)
5. **Cero bugs críticos abiertos**

---

**Última actualización**: 07 Enero 2026
**Próxima sesión programada**: [PENDIENTE]
