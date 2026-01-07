# FLUJOS DE NEGOCIO - Bambu CRM V2

**Documento de referencia rápida para lógica de pedidos y estados**

---

## ESTADOS DEL SISTEMA (V2)

El sistema maneja **3 estados** (simplificado de 6 en V1):

| Estado | Descripción | Stock | Cuenta Corriente |
|--------|-------------|-------|------------------|
| **Borrador** | Guardado temporalmente, no confirmado | Intacto | Intacta |
| **En tránsito** | Confirmado para reparto, pendiente de entrega | Descontado | Cargado |
| **Entregado** | Venta finalizada (fábrica) o reparto completado | Descontado | Cargado |

### Estados NO utilizados en V2
- Confirmado
- Listo para despacho
- Para despacho
- Cancelado (se elimina el pedido, no hay estado intermedio)

---

## TRANSICIONES DE ESTADOS

```
                    ┌─────────────┐
                    │  BORRADOR   │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         Modo REPARTO              Modo FÁBRICA
              │                         │
              ▼                         ▼
       ┌─────────────┐           ┌─────────────┐
       │ EN TRÁNSITO │◄─────────►│  ENTREGADO  │
       └─────────────┘           └─────────────┘
              │                         │
              └────────┬────────────────┘
                       ▼
              ┌─────────────────┐
              │  ELIMINACIÓN    │ (Reintegra stock + anula CC)
              └─────────────────┘
```

### Transiciones permitidas
- **Borrador → En tránsito**: Confirmar pedido modo REPARTO
- **Borrador → Entregado**: Confirmar pedido modo FÁBRICA
- **En tránsito ↔ Entregado**: Cambio manual desde VENTAS (reversible)
- **Cualquier estado → Eliminado**: Con reintegro de stock y nota de crédito en CC

---

## FLUJO COMPLETO: MODO REPARTO

```
1. COTIZADOR
   │ Usuario selecciona modo REPARTO (switch)
   │ Agrega productos (buscador predictivo)
   │ Selecciona cliente (muestra saldo en dropdown)
   │ Aplica descuentos (manual > cliente > lista)
   │ Confirma pedido
   │ ├→ Valida fecha solo L-V
   │ └→ Si finde → sugiere próximo laborable
   │
   ▼
2. SISTEMA (automático)
   │ Estado: BORRADOR → EN TRÁNSITO
   │ Stock: Descontado inmediatamente
   │ Cuenta Corriente: Cargo generado (si hay cliente)
   │ Fecha: Asignada al día seleccionado
   │
   ▼
3. MÓDULO VENTAS
   │ Pedido aparece en lista (filtro "En tránsito")
   │ Visible en calendario semanal
   │ Usuario puede editar si necesario
   │
   ▼
4. MÓDULO REPARTOS DÍA
   │ Click en día desde calendario (ventas o dashboard)
   │ Vista por vehículo: 4 columnas (Sin asignar + R1 + R2 + R3)
   │ Vista por ciudad: agrupado por localidad
   │ Capacidad: kg usados / kg totales por vehículo
   │
   ▼
5. ASIGNACIÓN VEHÍCULO
   │ Opción 1: Modal con preview de capacidad
   │ Opción 2: Drag & drop entre columnas
   │ Opción 3: Auto-asignar (agrupa por ciudad)
   │ Reordenar visitas dentro del vehículo (drag & drop)
   │ Exportar hoja de reparto (ventana imprimible)
   │
   ▼
6. REPARTIDOR
   │ Sale a repartir con hoja impresa
   │ Entrega pedidos (puede haber cambios)
   │ Vuelve TARDE (fin del día)
   │
   ▼
7. CONTROL DÍA VENCIDO (al día siguiente)
   │ Usuario abre VENTAS → Vista Calendario
   │ Día de ayer muestra badge "CONTROLAR"
   │ Click "Controlar" o "Ver pedidos"
   │ Por cada pedido:
   │ ├→ Ajustar cantidades (si entregó menos/más)
   │ ├→ Corregir descuentos olvidados
   │ ├→ Agregar/quitar productos de último momento
   │ └→ MARCAR COMO ENTREGADO
   │
   ▼
8. REGISTRAR MÉTODO DE PAGO (OBLIGATORIO)
   │ Modal solicita método de pago
   │ Opciones: Efectivo | Digital | Mixto
   │ ✅ PAGO PARCIAL permitido (genera saldo pendiente)
   │ Guarda en historial de pagos del pedido
   │ Genera movimiento de pago en Cuenta Corriente
   │
   ▼
9. RESULTADO FINAL
   │ Estado: EN TRÁNSITO → ENTREGADO
   │ Datos reales registrados (cantidades, montos)
   │ Método de pago guardado
   │ Historial de cambios con auditoría completa
   │ Ajuste automático en CC si hubo diferencia de total
```

---

## FLUJO COMPLETO: MODO FÁBRICA

```
1. COTIZADOR
   │ Usuario selecciona modo FÁBRICA (switch)
   │ Agrega productos
   │ Cliente: Selecciona cliente O deja "SIN REGISTRO"
   │ Aplica descuentos
   │ ⚠️ MÉTODO DE PAGO REQUERIDO (tag rojo visible)
   │ Selecciona método: Efectivo | Digital | Mixto
   │ ✅ Pago parcial permitido
   │ Confirma pedido
   │
   ▼
2. SISTEMA (automático)
   │ Estado: BORRADOR → ENTREGADO (directo)
   │ Stock: Descontado
   │ Cuenta Corriente:
   │ ├→ Con cliente: Cargo + Pago generados
   │ └→ Sin cliente (SIN REGISTRO): NO genera movimiento CC
   │ Fecha: HOY (automática)
   │
   ▼
3. MÓDULO VENTAS
   │ Pedido aparece con estado "Entregado"
   │ Tipo: FÁBRICA (badge naranja)
   │ Usuario puede editar si necesario
   │ Sistema genera ajuste CC si cambia el total
   │
   ▼
4. RESULTADO FINAL
   │ Venta de fábrica registrada
   │ Cliente retiró en planta
   │ Pago registrado (total o parcial)
   │ Si cliente tiene saldo: visible en su CC
```

### Ventas sin cliente (SIN REGISTRO)
- Solo permitido en modo FÁBRICA
- NO genera movimiento en Cuenta Corriente
- SÍ descuenta stock normalmente
- Útil para ventas ocasionales a desconocidos

---

## CONTROL A DÍA VENCIDO

**Regla fundamental**: Los repartos se controlan al DÍA SIGUIENTE porque los repartidores vuelven tarde.

### Ejemplo práctico
```
HOY = 08/01/2026 (Miércoles)

Vista desde HOY:
├─ 06/01 (Lunes):    Hace 2 días → CONTROLADO ✅
├─ 07/01 (Martes):   AYER → A CONTROLAR 📋 (controlando HOY)
├─ 08/01 (Miércoles): HOY → SALIENDO 🚚 (control mañana)
├─ 09/01 (Jueves):   MAÑANA → PREPARANDO 📦 (asignar vehículos)
└─ 10/01 (Viernes):  Pasado → PLANIFICADO 📅
```

### Estados de días en calendario
| Badge | Color | Descripción | Acciones |
|-------|-------|-------------|----------|
| **CONTROLADO** | Verde | Día pasado ya revisado | Solo consulta |
| **CONTROLAR** | Naranja | Ayer, pendiente de revisar | Marcar entregados, ajustar, pagar |
| **HOY** | Azul | Día actual | Repartos en curso |
| **PLANIFICADO** | Gris | Días futuros | Asignar vehículos |

### Datos de pago según estado del día
- **Días sin controlar**: Muestran "XXX" en pagos (no calculados aún)
- **Días controlados**: Muestran totales reales (efectivo + digital)

---

## INTERACCIÓN ENTRE MÓDULOS

### COTIZADOR
**Responsabilidad**: Crear pedidos nuevos
- Buscar y agregar productos (teclado: ↑↓ Enter)
- Seleccionar cliente (muestra saldo)
- Aplicar descuentos (jerarquía: manual > cliente > lista)
- Generar resumen WhatsApp / Remito PDF
- Guardar borrador o confirmar pedido
- **Transición**: `Borrador → En tránsito` o `→ Entregado`

### VENTAS
**Responsabilidad**: Gestionar TODOS los pedidos
- 3 vistas: Calendario | Lista | Borradores
- Filtros: Estado, Tipo, Vehículo, Pago, Período
- Editar pedidos (incluso entregados, con auditoría)
- Cambiar estados: `En tránsito ↔ Entregado`
- Cambiar tipo: `REPARTO ↔ FÁBRICA`
- Registrar pagos (parciales o totales)
- Eliminar con reintegro de stock
- Exportar hoja reparto / Excel
- Ver historial de cambios (timeline)

### REPARTOS DÍA
**Responsabilidad**: Organización logística diaria
- Acceso: Click en día desde Dashboard o Ventas
- Vista por vehículo (4 columnas)
- Vista por ciudad
- Asignar vehículos (modal, drag & drop, auto)
- Reordenar visitas (drag & drop con campo orden_visita)
- Exportar hoja de reparto imprimible
- **NO cambia estados** (solo organiza)

### CLIENTES
**Responsabilidad**: Gestión de clientes y cuenta corriente
- Tab 1: Información general
- Tab 2: Cuenta Corriente (movimientos, pagos, saldo)
- Tab 3: Historial de pedidos
- Registrar pagos genéricos
- Exportar estado de cuenta
- Sincronización bidireccional con Ventas

---

## MÉTODOS DE PAGO

### Dónde se registran
1. **COTIZADOR modo FÁBRICA**: Obligatorio al confirmar
2. **VENTAS al marcar Entregado**: Obligatorio en modal
3. **CUENTA CORRIENTE**: Pagos genéricos manuales

### Tipos de pago
| Tipo | Descripción |
|------|-------------|
| **Efectivo** | Dinero en mano |
| **Digital** | MercadoPago, transferencia, débito/crédito |
| **Mixto** | Combinación (ej: $10.000 efectivo + $5.000 digital) |

### Pagos parciales
```
Pedido total: $80.000
Pago registrado: $50.000 (efectivo)
Saldo pendiente: $30.000 (queda en CC del cliente)

El pedido puede marcarse como ENTREGADO aunque no esté pago completo.
```

### Múltiples pagos
Un pedido puede tener varios pagos:
```
Pedido #998 - Total: $80.000
├─ Pago 1: $50.000 efectivo (al entregar)
├─ Pago 2: $20.000 digital (días después)
└─ Saldo: $10.000 pendiente
```

---

## EDICIÓN POST-ENTREGA

### Caso de uso típico
```
Pedido planificado: 10 unidades Producto A @ $10.000
Total original: $100.000

Entregado real: 9 unidades (cliente no quiso una)

Usuario en VENTAS:
1. Abre modal detalle del pedido
2. Click "Editar"
3. Cambia cantidad: 10 → 9
4. Guarda

Sistema (automático):
├─ Reintegra 1 unidad al stock
├─ Recalcula total: $100.000 → $90.000
├─ Genera AJUSTE en CC: -$10.000 (abono)
├─ Registra en historial de cambios:
│   ├─ Usuario: admin@bambu.com
│   ├─ Fecha: 08/01/2026 10:30
│   ├─ Campo: cantidad Producto A
│   ├─ Anterior: 10
│   └─ Nuevo: 9
└─ Cargo original NO se modifica (trazabilidad)
```

### Qué se puede editar post-entrega
- ✅ Cantidades de productos
- ✅ Agregar/quitar productos
- ✅ Descuentos
- ✅ Método de pago (agregar pagos adicionales)
- ✅ Cambiar tipo: REPARTO ↔ FÁBRICA

### Impacto en stock
| Acción | Efecto en stock |
|--------|-----------------|
| Aumentar cantidad | Descuenta más (valida disponibilidad) |
| Reducir cantidad | Reintegra diferencia |
| Agregar producto | Descuenta (valida disponibilidad) |
| Quitar producto | Reintegra completo |

### Sistema de auditoría
Cada cambio se registra con:
- Usuario que modificó
- Fecha y hora
- Campo modificado
- Valor anterior → valor nuevo
- IP (para backend)

Timeline visible en modal de detalle del pedido.

---

## REGLAS DE STOCK

### Por estado
| Estado | Efecto en stock |
|--------|-----------------|
| Borrador | NO descuenta |
| En tránsito | Descontado |
| Entregado | Descontado |
| Eliminado | REINTEGRADO |

### Productos BAMBU (producción propia)
- proveedor_id = 1 → "BAMBU"
- Se pueden vender aunque stock sea 0 o negativo
- No aplica restricción de stock (producción bajo demanda)

### Advertencias de stock
- Stock < mínimo → Badge naranja "Stock bajo (X disponibles)"
- Stock negativo → Badge rojo "NEGATIVO" con animación

---

## CUENTA CORRIENTE

### Tipos de movimientos
| Tipo | Descripción | Efecto saldo |
|------|-------------|--------------|
| **CARGO** | Pedido confirmado | Aumenta deuda |
| **PAGO** | Pago registrado | Reduce deuda |
| **AJUSTE** | Edición post-entrega | +/- según diferencia |
| **NOTA_CREDITO** | Pedido eliminado | Reduce deuda |

### Saldos
- **Negativo** (rojo): Cliente debe dinero
- **Cero** (gris): Al día
- **Positivo** (verde): Saldo a favor del cliente

### Sincronización
Los movimientos se sincronizan entre:
- Ventas (al confirmar, editar, eliminar)
- Cuenta Corriente (pagos manuales)
- Cotizador (al confirmar con pago)

---

## LISTAS DE PRECIOS

| Lista | Descuento | Umbral sugerido |
|-------|-----------|-----------------|
| **L1** | 0% (base) | Sin umbral |
| **L2** | 6.25% | Compras >$250k |
| **L3** | 10% | Compras >$1M |

### Jerarquía de descuentos (NO acumulativos)
1. **Descuento manual** (input %) - máxima prioridad
2. **Descuento fijo del cliente** (configurado en perfil)
3. **Lista de precios** (L1/L2/L3)

### Base de cálculo
Los descuentos se aplican sobre subtotal **MENOS productos en promoción**:
```
Subtotal: $100.000
├─ Producto regular: $80.000
└─ Producto en promoción: $20.000 (precio fijo, sin descuento adicional)

Base para descuento: $80.000
Descuento 10%: $8.000
Total: $100.000 - $8.000 = $92.000
```

---

## ATAJOS DE TECLADO

### Cotizador
| Atajo | Acción |
|-------|--------|
| `↑` `↓` | Navegar resultados búsqueda |
| `Enter` | Seleccionar producto/cliente |
| `Esc` | Cerrar modal/dropdown |

### Global
| Atajo | Acción |
|-------|--------|
| `Ctrl+K` / `Cmd+K` | Abrir buscador global (Dashboard) |

---

## NOTAS TÉCNICAS

### Borradores
- Se guardan en localStorage (prototipo) / DB (producción)
- Recuperables desde Ventas → Pestaña "Borradores"
- Click "Editar" → abre Cotizador con datos precargados
- NO afectan stock ni CC hasta confirmar

### Cambio tipo pedido (REPARTO ↔ FÁBRICA)
**REPARTO → FÁBRICA**:
- Estado: En tránsito → Entregado
- Vehículo: Se desasigna automáticamente
- Fecha: Se mantiene

**FÁBRICA → REPARTO**:
- Estado: Entregado → En tránsito
- Requiere fecha de entrega
- Vehículo: Sin asignar (asignar desde Repartos)

### Productos en remito
El orden de productos en remito/WhatsApp respeta el campo `orden` del producto:
- Orden menor = primero en lista
- Lógica: productos que van primero se cargan primero en camioneta

---

**Última actualización**: 07 Enero 2026
**Versión**: 2.0
