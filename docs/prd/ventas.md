# PRD: Módulo Ventas

> **Fuente**: `prd/ventas.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Módulo Ventas

| | |
|---|---|
| **Versión** | 2.0 (Limpio - Enero 2026) |
| **Prototipo** | [prototipos/ventas.html](../prototipos/ventas.html) |
| **Estado** | Prototipo validado |

**Nota:** Este PRD describe funcionalidades y reglas de negocio. Para referencia visual, ver el prototipo HTML.

## 1. Contexto y Propósito

### 1.1 Descripción

Módulo unificado para gestión de TODOS los pedidos post-cotización. Fusiona los conceptos de "Pedidos" e "Histórico" de la v1.

### 1.2 Función principal

"Pulir" pedidos post-entrega con los datos reales de lo que se vendió:

- Corregir cantidades entregadas vs planificadas
- Ajustar descuentos olvidados
- Sumar/restar productos por cambios de último momento
- Registrar métodos de pago reales

### 1.3 Cambios clave vs V1

| Aspecto | V1 | V2 |
|---------|----|----|
| Estados | 6 estados | 3 estados: Borrador, En tránsito, Entregado |
| Edición post-entrega | No permitido | Permitido con auditoría |
| Método de pago | No registrado | Campo obligatorio |
| Módulos | Pedidos + Histórico separados | Todo en VENTAS |

## 2. Arquitectura

### 2.1 Interacción con otros módulos

| Módulo | Responsabilidad |
|--------|-----------------|
| **COTIZADOR** | Crear pedidos, asignar fecha, descontar stock, generar cargo CC |
| **VENTAS** | Ver, editar, cambiar estados, registrar pagos, exportar |
| **CUENTA CORRIENTE** | Reflejar cargos, pagos y ajustes |

### 2.2 Flujo de datos

1. COTIZADOR crea pedido → Estado "En tránsito" o "Entregado"
2. VENTAS muestra pedido (editable)
3. Usuario puede editar, cambiar estado, registrar pago
4. Cambios generan ajustes automáticos en CC

**Aclaración crítica:** NO existe módulo "Repartos" separado. El "Calendario de Repartos" es una VISTA dentro de VENTAS.

## 3. Vistas (Tabs)

### 3.1 Tab: Lista Pedidos

Listado principal de todos los pedidos con filtros.

**Columnas:**

- # Pedido, Fecha entrega, Cliente/Dirección
- Estado (badge), Tipo (badge Fábrica/Reparto)
- Vehículo (si aplica), Monto total
- Método pago (icono), Acciones

**Fila de totales:** Al final, muestra suma de pedidos filtrados, monto total, desglose efectivo/digital.

### 3.2 Tab: Calendario Semana

Vista calendario (L-V) con pedidos tipo REPARTO pendientes de entrega.

- Filtro automático: solo pedidos REPARTO no entregados
- Click en día → abre vista detallada con asignación de vehículos
- Permite drag & drop entre vehículos

### 3.3 Tab: Borradores

Pedidos guardados sin confirmar desde Cotizador.

- No descuentan stock
- No generan cargo en CC
- Columna "Fecha" = fecha de creación del borrador

## 4. Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| Estado | En tránsito \| Entregado \| Todos |
| Período | Desde - Hasta (fechas) |
| Tipo | Fábrica \| Reparto \| Todos |
| Vehículo | Reparto 1 \| Reparto 2 \| Sin asignar \| Todos |
| Método pago | Efectivo \| Digital \| Mixto \| Sin registrar |
| Cliente | Búsqueda por dirección, incluye "Sin registro" |

**Todos los filtros son combinables.**

## 5. Acciones por Pedido

### 5.1 Ver detalle

Modal con información completa: cliente, productos, descuentos, ajustes, total, método pago, historial de cambios.

### 5.2 Editar

Abre cotizador en modo edición. Permite modificar productos, cantidades, precios, descuentos.

### 5.3 Cambiar estado

| Transición | Requisito |
|------------|-----------|
| En tránsito → Entregado | Debe registrar método de pago |
| Entregado → En tránsito | Confirmación (casos de error) |

### 5.4 Cambiar tipo (REPARTO ↔ FÁBRICA)

- **REPARTO → FÁBRICA:** Estado pasa a "Entregado", se elimina vehículo asignado
- **FÁBRICA → REPARTO:** Estado pasa a "En tránsito", abre calendario para seleccionar fecha

### 5.5 Eliminar

Con confirmación. Reintegra stock y revierte cargo en CC.

## 6. Sistema de Pagos

### 6.1 Opciones de método de pago

- **Efectivo:** Pago en efectivo
- **Digital:** MercadoPago, transferencia, débito, crédito
- **Mixto:** Combinación de ambos (requiere desglose)
- **Sin registrar:** Estado temporal

### 6.2 Pagos parciales

**Regla:** El monto recibido NO tiene que igualar el total. Se permiten pagos parciales.

- Si monto < total → saldo pendiente en cuenta corriente
- Si monto > total → saldo a favor del cliente

### 6.3 Pagos asociados vs genéricos

| Tipo | Dónde se registra | Efecto en pedido |
|------|-------------------|------------------|
| **Asociado** | Cotizador (fábrica) o CC → "Pago a pedido específico" | Actualiza campo `monto_pagado` |
| **Genérico** | Cuenta Corriente → "Pago genérico" | NO actualiza pedido, solo reduce saldo CC |

### 6.4 Sincronización bidireccional

- Pago en VENTAS → se crea automáticamente en Cuenta Corriente
- Pago a pedido específico desde CC → actualiza columna "Pagado" en VENTAS
- Anti-duplicados: sistema verifica si ya existe pago antes de crear

### 6.5 Ventas sin cliente ("Sin registro")

- Cliente ficticio para ventas casuales de mostrador
- Solo modo FÁBRICA
- Pago obligatorio completo (no permite fiado)
- No genera cargo en Cuenta Corriente

## 7. Edición Post-Entrega

### 7.1 Casos de uso

- Cliente devolvió producto → restar cantidad
- Se olvidó aplicar descuento → aplicar retroactivo
- Cliente compró extra → sumar productos
- Error en precio → corregir

### 7.2 Impacto automático

Al editar un pedido, el sistema automáticamente:

1. Ajusta stock (reintegra o descuenta según cambio)
2. Recalcula total del pedido
3. Genera AJUSTE en cuenta corriente (diferencia entre total anterior y nuevo)
4. El cargo original NUNCA se modifica (trazabilidad)

### 7.3 Ejemplo

Pedido original: $10.000 (10 unidades). Cliente devolvió 1 unidad.

- Nuevo total: $9.000
- Sistema reintegra 1 unidad al stock
- Crea AJUSTE en CC: -$1.000
- Saldo final cliente: correcto

## 8. Calendario Semana (Vista de Repartos)

### 8.1 Concepto

NO es un módulo separado. Es una vista filtrada dentro de VENTAS que muestra pedidos REPARTO pendientes organizados por día.

### 8.2 Funcionalidades

- Vista semanal (L-V) con capacidad por día
- Asignación de pedidos a vehículos
- Reordenamiento de pedidos (ruta de entrega)
- Control de capacidad (kg actual vs máximo por vehículo)

### 8.3 Click en día

Abre panel con:

- Pedidos por vehículo
- Pedidos sin asignar
- Acciones: mover, reasignar, desasignar
- Link a vista completa

### 8.4 Flujo de pedido REPARTO

1. Cotizador crea pedido → Estado "En tránsito", aparece en calendario
2. Usuario asigna a vehículo desde calendario
3. Chofer entrega
4. Usuario marca como "Entregado" desde Lista Pedidos
5. Pedido desaparece del calendario (filtro automático), permanece en VENTAS

## 9. Exportar Reportes

### 9.1 Exportar Excel

Modal con selección de columnas:

- **Obligatorias:** # Pedido, Fecha entrega
- **Opcionales:** Cliente, Dirección, Teléfono, Tipo, Vehículo, Repartidor, Productos, Subtotal, Descuentos, Ajustes, Total, Método pago, Estado

El sistema recuerda última selección del usuario.

### 9.2 Exportar hoja de reparto

Desde vista de día en calendario:

- **Con precios:** Para control interno
- **Sin precios:** Para chofer

## 10. Auditoría y Trazabilidad

### 10.1 Historial de cambios

Registro automático de todas las modificaciones post-entrega:

- Usuario que editó (nombre + ID)
- Fecha/hora exacta
- Campo modificado
- Valor anterior → Valor nuevo
- IP del usuario
- (Opcional) Razón del cambio

### 10.2 Visualización

Línea de tiempo cronológica en el detalle del pedido.

### 10.3 Propósito

- Trazabilidad total de cambios
- Auditoría fiscal
- Detección de errores o fraudes
