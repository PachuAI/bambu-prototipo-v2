# Auditoría Mock Data - 07 Enero 2026

**Archivo auditado**: `prototipos/shared/mock-data.js`
**Objetivo**: Verificar datos suficientes para features pendientes de ventas
**Fuentes de verdad**: `docs/ESTADO-VENTAS.md`, `prd/ventas.html`

---

## Features Pendientes que Requieren Datos

| Feature | PRD Sección | Estado Previo |
|---------|-------------|---------------|
| Exportar Excel con columnas | 9.1 | Parcial |
| Edición Post-Entrega + Auditoría | 7, 10 | Faltante |
| Reasignación Vehículos | 8.3 | OK |
| Sistema de Auditoría | 10.1 | Faltante |
| Pagos Parciales | 6.2, 6.3 | Faltante |
| Reordenamiento Pedidos | 8.2 | Faltante |

---

## Resultado de Auditoría ANTES de Cambios

### 1. Pedidos Variados

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Pedidos REPARTO y FÁBRICA | ✅ | Ambos tipos en `crearPedido()` |
| Pedidos en cada estado | ✅ | borrador, pendiente, asignado, en_transito, entregado |
| Pedidos con/sin vehículo | ✅ | FÁBRICA y pendientes sin vehículo |
| Pedidos con múltiples productos | ✅ | `PEDIDOS_PRODUCTOS` genera 2-6 por pedido |
| Pedidos con descuentos aplicados | ❌ | No existía campo `descuento` |
| Pedidos en diferentes fechas | ✅ | 06/01 al 10/01/2026 |

### 2. Sistema Auditoría (PRD 10.1)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Estructura `historial_cambios[]` | ❌ | No existía |
| Campos auditoría completos | ❌ | Sin usuario, fecha, campo, valores, IP |

### 3. Pagos Parciales (PRD 6.2, 6.3)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Estructura `pagos[]` | ❌ | No existía array de pagos |
| Campo `monto_pagado` | ❌ | No existía |
| Pedidos con pago parcial | ❌ | montoEfectivo + montoDigital = total siempre |

### 4. Para Exportaciones (PRD 9.1)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Datos completos pedido | ✅ | Campos base presentes |
| Campo `subtotal` | ❌ | No existía (antes de descuento) |
| Campo `descuento_monto` | ❌ | No existía |
| Vehículos completos | ✅ | nombre, capacidadKg, modelo, patente |

### 5. Reordenamiento (PRD 8.2)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Campo `orden_visita` | ❌ | No existía |

### 6. Clientes

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Diferentes listas precio | ✅ | L1, L2, L3 distribuidos |
| Saldo positivo/negativo | ✅ | Rango -150000 a +15000 |

### 7. Productos

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| precio_promocional | ✅ | Productos 9 y 13 en promoción |
| Stock bajo | ✅ | Productos 6 (18<40) y 10 (8<30) |
| peso_kg variado | ✅ | Rango 0.5 a 8.0 kg |

---

## Resumen Pre-Cambios

| Categoría | Cubiertos | Total | % |
|-----------|-----------|-------|---|
| Pedidos variados | 5 | 6 | 83% |
| Sistema Auditoría | 0 | 2 | 0% |
| Pagos Parciales | 0 | 3 | 0% |
| Exportaciones | 2 | 4 | 50% |
| Reordenamiento | 0 | 1 | 0% |
| Clientes | 2 | 2 | 100% |
| Productos | 3 | 3 | 100% |
| **TOTAL** | **12** | **21** | **57%** |

---

## Cambios Implementados

### Campos Agregados a Pedidos

```javascript
// PRD 9.1 - Exportar Excel
subtotal: number,              // Monto antes de descuento
descuento_porcentaje: number,  // % descuento (0, 5, 10, 15)
descuento_monto: number,       // Monto descontado ($)

// PRD 8.2 - Reordenamiento
orden_visita: number | null,   // Orden en ruta de entrega

// PRD 6.2, 6.3 - Pagos parciales
monto_pagado: number,          // Total cobrado (puede ser < total)
pagos: [{                      // Array de pagos
  id: number,
  fecha: string,               // ISO datetime
  monto: number,
  metodo: 'efectivo' | 'digital',
  tipo: 'asociado' | 'generico',
  registrado_por: string
}],

// PRD 10.1 - Auditoría
historial_cambios: [{
  id: number,
  fecha: string,               // ISO datetime
  usuario_id: number,
  usuario_nombre: string,
  accion: 'CREACION' | 'EDICION' | 'ESTADO',
  campo_modificado: string | null,
  valor_anterior: any,
  valor_nuevo: any,
  razon: string,
  ip: string
}]
```

### Distribución de Datos Generados

| Tipo de Dato | % de Pedidos | Detalle |
|--------------|--------------|---------|
| Con descuento | ~30% | 5%, 10% o 15% aleatorio |
| Pago parcial | ~20% | Solo pedidos entregados |
| Con historial cambios | ~15% | Solo pedidos entregados |
| Con orden_visita | 100% | Solo si tiene vehículo asignado |

### Pedidos de Testing (Datos Conocidos)

**Pedido #999** - Testing Auditoría Completa:
- 4 cambios en historial (CREACION, EDICION x2, ESTADO)
- Descuento 10% ($5,500)
- Pago mixto completo (efectivo $30k + digital $19.5k)

**Pedido #998** - Testing Pago Parcial:
- Total: $80,000
- Pagado: $50,000 (2 pagos de $30k y $20k)
- Pendiente: $30,000

---

## Resumen Post-Cambios

| Categoría | Cubiertos | Total | % |
|-----------|-----------|-------|---|
| Pedidos variados | 6 | 6 | 100% |
| Sistema Auditoría | 2 | 2 | 100% |
| Pagos Parciales | 3 | 3 | 100% |
| Exportaciones | 4 | 4 | 100% |
| Reordenamiento | 1 | 1 | 100% |
| Clientes | 2 | 2 | 100% |
| Productos | 3 | 3 | 100% |
| **TOTAL** | **21** | **21** | **100%** |

---

## Validación contra PRD

| PRD Sección | Requisito | Implementado |
|-------------|-----------|--------------|
| 6.2 | Pagos parciales (monto < total) | ✅ `monto_pagado`, ~20% pedidos |
| 6.3 | Pagos asociados vs genéricos | ✅ `pagos[].tipo` |
| 7 | Edición post-entrega | ✅ `historial_cambios[]` |
| 8.2 | Reordenamiento pedidos | ✅ `orden_visita` |
| 9.1 | Exportar Excel columnas | ✅ `subtotal`, `descuento_*` |
| 10.1 | Historial cambios completo | ✅ Todos los campos PRD |

---

## Notas Adicionales

- Los campos fueron agregados tanto a pedidos generados dinámicamente como a borradores
- La documentación del bloque PEDIDOS fue actualizada con referencia a secciones PRD
- No se agregó `descuento_fijo` a clientes porque es requisito de Cotizador, no de Ventas

---

**Auditoría realizada**: 07 Enero 2026
**Estado**: Mock data 100% compatible con features pendientes de ventas
