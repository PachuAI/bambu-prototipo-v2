# PRD: Módulo Cuenta Corriente

> **Fuente**: `prd/cuenta-corriente.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Módulo Cuenta Corriente

| | |
|---|---|
| **Versión** | 2.0 (Limpio - Enero 2026) |
| **Prototipo** | [prototipos/cliente-detalle.html](../prototipos/cliente-detalle.html) (Tab CC) |
| **Estado** | Prototipo validado |

**Nota:** Este PRD describe funcionalidades y reglas de negocio. Para referencia visual, ver el prototipo HTML.

## 1. Contexto y Objetivo

### 1.1 Descripción

Centro financiero de cada cliente. Registra cargos, pagos y saldo actual.

### 1.2 Necesidades del negocio

- Discriminar efectivo vs digital en todos los pagos
- Registrar pagos parciales (cliente paga menos del total)
- Registrar pagos genéricos (sin asociar a pedido específico)
- Historial completo de movimientos por cliente
- Exportar para contabilidad

### 1.3 Ubicación

**Ruta:** Clientes → Seleccionar cliente → Pestaña "Cuenta Corriente"

## 2. Funcionalidad Principal

### 2.1 Características

- Todos los clientes tienen cuenta corriente (obligatorio)
- Cargos automáticos al confirmar pedidos
- Pagos manuales registrados por operadores
- Discriminación método de pago (efectivo, digital, mixto)
- Pagos parciales permitidos
- Pagos genéricos (no asociados a pedido)
- Historial cronológico completo

### 2.2 Cálculo de saldo

**Fórmula:** Saldo = Suma de cargos - Suma de pagos

| Saldo | Significado | Color |
|-------|-------------|-------|
| Negativo (-$50.000) | Cliente DEBE dinero | Rojo |
| Cero ($0) | Al día | Gris |
| Positivo (+$10.000) | Cliente tiene SALDO A FAVOR | Verde |

## 3. Vista Cuenta Corriente

### 3.1 Panel superior (Resumen)

- Saldo actual (con color según estado)
- Total de pedidos
- Fecha última compra
- Botones: [+ Registrar pago] [Exportar Excel]

### 3.2 Tabla de movimientos

**Columnas:**

- Fecha
- Tipo (Cargo / Pago / Ajuste)
- Descripción (ej: "Pedido #155", "Pago genérico")
- Cargo (+$)
- Pago (-$)
- Método (efectivo/digital/mixto)
- Saldo resultante

**Ordenamiento:** Cronológico descendente (más recientes primero)

### 3.3 Detalle expandible

Al hacer click en fila, muestra información adicional:

- Para cargos: productos del pedido, estado, vehículo
- Para pagos: usuario que registró, fecha/hora, notas
- Para ajustes: razón del ajuste, pedido relacionado

## 4. Tipos de Movimiento

### 4.1 Cargo

**Origen:** Automático al confirmar pedido con cliente

- Aumenta el saldo deudor del cliente
- Se genera al confirmar desde Cotizador (no en borrador)
- Contiene referencia al pedido

### 4.2 Pago

**Origen:** Manual desde VENTAS o Cuenta Corriente

- Reduce el saldo deudor del cliente
- Requiere método de pago (efectivo/digital/mixto)
- Puede ser asociado a pedido o genérico

### 4.3 Ajuste

**Origen:** Automático al editar pedido entregado

- Registra diferencia entre total anterior y nuevo
- Puede ser positivo (cliente debe más) o negativo (debe menos)
- Mantiene trazabilidad - cargo original NO se modifica

## 5. Sistema de Pagos

### 5.1 Métodos de pago

| Método | Descripción | Icono |
|--------|-------------|-------|
| Efectivo | Pago en efectivo | 💵 |
| Digital | MercadoPago, transferencia, débito, crédito | 💳 |
| Mixto | Combinación de ambos (requiere desglose) | 💵💳 |

### 5.2 Pagos asociados vs genéricos

| Tipo | Cuándo usar | Efecto en pedido |
|------|-------------|------------------|
| **Asociado** | Cliente especifica "es para el pedido #X" | Actualiza `monto_pagado` del pedido |
| **Genérico** | Cliente transfiere sin especificar | Solo reduce saldo CC, NO actualiza pedidos |

### 5.3 Pagos parciales

**Regla:** El monto NO tiene que igualar el total del pedido.

- Si paga menos → saldo pendiente queda en CC
- Si paga más → saldo a favor del cliente
- Permite múltiples pagos parciales al mismo pedido

### 5.4 Sincronización VENTAS ↔ CC

Los pagos se pueden registrar desde ambos módulos:

- **Desde VENTAS:** Al marcar pedido como entregado
- **Desde CC:** Botón "+ Registrar pago"

**Sincronización automática:**

- Pago en VENTAS → se crea en CC automáticamente
- Pago a pedido específico en CC → actualiza columna "Pagado" en VENTAS
- Anti-duplicados: sistema verifica antes de crear

### 5.5 Modal "Registrar Pago"

**Campos:**

- Tipo: Pago genérico / Pago a pedido específico (dropdown)
- Monto: número
- Método: Efectivo / Digital / Ambos
- Si mixto: campos para desglose
- Nota: texto libre (opcional)

**Validación mixto:** Suma de efectivo + digital debe igualar monto total

## 6. Ajustes por Edición de Pedidos

### 6.1 Cuándo se genera

Cuando se edita un pedido ya confirmado/entregado desde módulo VENTAS.

### 6.2 Regla crítica

**El cargo original NUNCA se modifica.** Se crea un nuevo movimiento tipo "Ajuste" con la diferencia.

### 6.3 Ejemplo

Pedido original: $10.000 (10 unidades). Cliente devuelve 1 unidad.

1. Nuevo total: $9.000
2. Sistema crea Ajuste: -$1.000
3. Cargo original permanece: +$10.000
4. Saldo neto correcto: +$9.000

### 6.4 Campos del ajuste

- Tipo: "Ajuste"
- Descripción: "Ajuste pedido #X"
- Monto: diferencia (puede ser + o -)
- Pedido relacionado
- Usuario que editó
- Fecha/hora
- Razón (opcional)

## 7. Integración con Otros Módulos

### 7.1 Cotizador

- Al confirmar pedido con cliente → genera Cargo automático
- Si modo FÁBRICA + registra pago → genera Pago automático
- Sin cliente → NO genera movimiento en CC

### 7.2 Ventas

- Muestra columna "Pagado" por pedido (solo pagos asociados)
- Al marcar entregado → puede registrar pago
- Al editar pedido → genera Ajuste en CC

### 7.3 Clientes

- Tab "Cuenta Corriente" en detalle de cliente
- Saldo visible en selector de cliente del cotizador
- Badge de saldo en listado de clientes

### 7.4 Exportar

- Botón "Exportar Excel" en vista CC
- Incluye todos los movimientos del período
- Formato profesional para contador
