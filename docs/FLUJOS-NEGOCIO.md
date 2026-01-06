# FLUJOS DE NEGOCIO - Bambu CRM V2

**Documento de referencia rápida para lógica de pedidos y estados**

---

## 📊 ESTADOS DEL SISTEMA (V2)

El sistema maneja **3 estados** (simplificado de 6 en V1):

| Estado | Descripción | Stock | Cuenta Corriente |
|--------|-------------|-------|------------------|
| **Borrador** | Guardado temporalmente, no confirmado | Intacto | Intacta |
| **En tránsito** | Confirmado para reparto, pendiente de entrega | Descontado | Cargado |
| **Entregado** | Venta finalizada (fábrica) o reparto completado | Descontado | Cargado |

### Estados NO utilizados en V2
❌ Confirmado
❌ Listo para despacho
❌ Para despacho

---

## 🔄 TRANSICIONES DE ESTADOS

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
                ┌─────────────┐
                │  CANCELADO  │ (Reintegra stock + saldo)
                └─────────────┘
```

### Transiciones permitidas
- **Borrador → En tránsito**: Confirmar pedido modo REPARTO
- **Borrador → Entregado**: Confirmar pedido modo FÁBRICA
- **En tránsito ↔ Entregado**: Cambio manual desde VENTAS (reversible)
- **Cualquier estado → Cancelado**: Anulación con reintegro

---

## 🚚 FLUJO COMPLETO: MODO REPARTO

```
1. COTIZADOR
   │ Usuario selecciona modo REPARTO
   │ Agrega productos, cliente, descuentos
   │ Confirma pedido
   │ ├→ Abre calendario (solo L-V)
   │ └→ Selecciona fecha entrega
   │
   ▼
2. SISTEMA (automático)
   │ Estado: BORRADOR → EN TRÁNSITO
   │ Stock: Descontado
   │ Cuenta Corriente: Cargo generado
   │ Fecha: Asignada al día seleccionado
   │
   ▼
3. MÓDULO VENTAS
   │ Pedido aparece con filtro "En tránsito"
   │ Estado: SIN vehículo asignado
   │ Usuario puede editar si necesario
   │
   ▼
4. MÓDULO REPARTOS → CALENDARIO
   │ Entrar al día seleccionado
   │ Ver capacidad (pedidos + kilos)
   │ Vista: Agrupar por vehículo
   │
   ▼
5. ASIGNACIÓN VEHÍCULO
   │ Seleccionar pedido
   │ Asignar a vehículo (R1, R2, R3)
   │ Ordenar visitas dentro del vehículo
   │ Exportar hoja de reparto (Word)
   │
   ▼
6. REPARTIDOR
   │ Sale a repartir con hoja
   │ Entrega pedidos (puede haber cambios)
   │ Vuelve TARDE (fin del día)
   │
   ▼
7. CONTROL DÍA VENCIDO (al día siguiente)
   │ Usuario abre VENTAS
   │ Filtra pedidos de AYER
   │ Revisa cada pedido:
   │ ├→ Ajusta cantidades (si entregó menos/más)
   │ ├→ Corrige descuentos olvidados
   │ ├→ Suma/resta productos de último momento
   │ └→ MARCA COMO ENTREGADO
   │
   ▼
8. REGISTRAR MÉTODO DE PAGO (OBLIGATORIO)
   │ Sistema solicita método de pago
   │ Opciones: Efectivo | Digital | Mixto
   │ Registra montos
   │ Genera pago en Cuenta Corriente
   │
   ▼
9. RESULTADO FINAL
   │ Estado: EN TRÁNSITO → ENTREGADO
   │ Datos reales de lo vendido
   │ Método de pago registrado
   │ Auditoría completa de cambios
   │ Sistema genera AJUSTE en CC si hubo cambios
```

---

## 🏭 FLUJO COMPLETO: MODO FÁBRICA

```
1. COTIZADOR
   │ Usuario selecciona modo FÁBRICA
   │ Agrega productos
   │ (Opcional) Selecciona cliente o "Sin cliente"
   │ (Opcional) Aplica descuentos
   │ Confirma pedido
   │
   ▼
2. SISTEMA (automático)
   │ Estado: BORRADOR → ENTREGADO (directo)
   │ Stock: Descontado
   │ Cuenta Corriente: Cargo generado (si hay cliente)
   │ Fecha: HOY
   │
   ▼
3. MÓDULO VENTAS
   │ Pedido aparece con filtro "Entregado"
   │ Usuario puede:
   │ ├→ Editar cantidades/precios si hubo cambios
   │ ├→ Registrar método de pago
   │ └→ Sistema genera AJUSTE en CC si necesario
   │
   ▼
4. RESULTADO FINAL
   │ Venta de fábrica registrada
   │ Cliente retiró en planta
   │ Método de pago registrado
```

---

## 📅 CONTROL A DÍA VENCIDO

**Regla fundamental**: Los repartos se controlan al DÍA SIGUIENTE porque los repartidores vuelven tarde.

### Ejemplo práctico
```
HOY = 26/12/2024 (Jueves)

Vista desde HOY:
├─ 23/12 (Lunes): Hace 3 días → CONTROLADO ✅
├─ 24/12 (Martes): Hace 2 días → CONTROLADO ✅
├─ 25/12 (Miércoles): AYER → A CONTROLAR 📋 (controlando HOY)
├─ 26/12 (Jueves): HOY → SALIENDO 🚚 (control mañana)
└─ 27/12 (Viernes): MAÑANA → PREPARANDO 📦 (asignar vehículos)
```

### Estados según contexto temporal
| Día | Relación | Estados pedidos | Acciones disponibles |
|-----|----------|-----------------|---------------------|
| Hace 2+ días | Controlado | Todos entregados | Solo lectura |
| Ayer | A controlar | En tránsito → marcar entregado | Controlar, ajustar, registrar pago |
| Hoy | Activo | En tránsito, asignado | Saliendo a repartir |
| Mañana | Futuro | Pendiente, asignado | Asignar vehículos, preparar |

---

## 🔀 INTERACCIÓN ENTRE MÓDULOS

### COTIZADOR
**Responsabilidad**: Crear pedidos
- Asignar fecha (modo reparto)
- Generar cargo en CC
- Descontar stock
- Transición: `Borrador → En tránsito/Entregado`

### VENTAS
**Responsabilidad**: Gestionar TODOS los pedidos
- Ver todos (en tránsito + entregados)
- Editar (incluso entregados con auditoría)
- Cambiar estados: `En tránsito ↔ Entregado`
- Registrar métodos de pago
- Generar ajustes en CC
- Exportar reportes

### REPARTOS
**Responsabilidad**: Organización logística
- Visualizar calendario
- Asignar vehículos
- Ordenar visitas
- Exportar hojas de reparto
- **NO cambia estados** (solo lectura)

---

## 💰 MÉTODOS DE PAGO

### Dónde se registran
1. **COTIZADOR modo FÁBRICA**: (Opcional) Al momento de la venta
2. **MÓDULO VENTAS**: (Obligatorio) Al marcar como "Entregado"
3. **MÓDULO CUENTA CORRIENTE**: Pagos genéricos manuales

### Tipos de pago
- **Efectivo**: Monto en efectivo
- **Digital**: MercadoPago, transferencia, débito/crédito
- **Mixto**: Combinación de efectivo + digital

### Regla obligatoria
❗ **NO se puede marcar un pedido como "Entregado" sin registrar método de pago**

---

## 🔧 EDICIÓN POST-ENTREGA

### Caso de uso típico
```
Pedido planificado: 10 unidades Producto A
Entregado real: 9 unidades (cliente no quiso una)

Usuario en VENTAS:
1. Busca pedido entregado
2. Click "Editar"
3. Cambia cantidad: 10 → 9
4. Guarda

Sistema (automático):
├─ Reintegra 1 unidad al stock
├─ Recalcula total: $10.000 → $9.000
├─ Genera AJUSTE en CC: -$1.000
└─ Cargo original NO se modifica (trazabilidad)
```

### Qué se puede editar post-entrega
- ✅ Cantidades de productos
- ✅ Descuentos
- ✅ Sumar/restar productos
- ✅ Método de pago
- ✅ Cambiar tipo: REPARTO ↔ FÁBRICA

### Auditoría
- Todos los cambios se registran
- Usuario + fecha/hora de modificación
- Historial completo de ajustes en CC

---

## ⚠️ REGLAS IMPORTANTES

### Stock
- Borrador: NO descuenta stock
- En tránsito: Stock descontado
- Entregado: Stock descontado
- Cancelado: Stock REINTEGRADO

### Cuenta Corriente
- Borrador: NO genera cargo
- En tránsito: Cargo generado
- Entregado: Cargo generado + pago registrado
- Cancelado: Cargo ANULADO + pago reintegrado

### Tipos de pedido
- **REPARTO**: Requiere vehículo asignado, fecha de entrega
- **FÁBRICA**: Cliente retira, estado "Entregado" directo

### Productos con cantidad negativa
✅ **Permitido**: Los productos pueden tener cantidad negativa (devoluciones)

### Listas de precios
- **L1**: Precio base (más caro)
- **L2**: 6.25% descuento
- **L3**: 10% descuento
- **Promocional**: Precio fijo independiente de lista

### Descuentos
**Jerarquía** (no acumulativos):
1. Descuento personalizado manual
2. Descuento fijo del cliente
3. Descuento por lista (L2/L3)

---

## 🎯 ESTADOS DE DÍAS EN CALENDARIO

| Badge | Descripción | Qué hacer |
|-------|-------------|-----------|
| **CONTROLADO** ✅ | Día pasado ya revisado | Solo consulta |
| **A CONTROLAR** 📋 | Día de ayer, repartidores volvieron | Marcar entregados, ajustar, registrar pagos |
| **HOY** 📍 | Día actual | Repartos saliendo, control mañana |
| **PLANIFICADO** 📦 | Días futuros | Asignar vehículos, preparar repartos |

---

## 📝 NOTAS TÉCNICAS

### Pedidos sin cliente
- Se permite crear pedidos sin cliente (ventas fábrica ocasionales)
- Aparecen como "Cliente sin nombre"
- NO generan cargo en cuenta corriente
- Sí descontarán stock

### Borradores
- Pueden guardarse en cualquier momento
- Se recuperan desde VENTAS → Pestaña "Borradores"
- Click "Editar" reabre cotizador con datos cargados
- Útil para cotizaciones complejas o interrupciones

### Cambio tipo pedido (REPARTO ↔ FÁBRICA)
**REPARTO → FÁBRICA**:
- Estado: En tránsito → Entregado
- Vehículo: Se elimina
- Fecha: Se asigna HOY

**FÁBRICA → REPARTO**:
- Estado: Entregado → En tránsito
- Abre calendario para fecha
- Vehículo: Sin asignar (asignar desde REPARTOS)

---

**Última actualización**: 31 Diciembre 2024
**Versión**: 1.0
