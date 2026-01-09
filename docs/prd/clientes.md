# PRD: Clientes - Gestión de la base de clientes

> **Fuente**: `prd/clientes.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Clientes
**Gestión de la base de clientes**

| | |
|---|---|
| **Versión** | 2.0 |
| **Fecha** | 31 Diciembre 2024 |
| **Estado** | ✅ Prototipado y validado (Enero 2026) |

## 1. Contexto y Objetivo

### 1.1 Propósito del módulo

El módulo **Clientes** gestiona la base de datos de todos los clientes de Química Bambu. Centraliza información de contacto, configuración comercial (lista de precios, descuentos) y acceso a cuenta corriente y historial de pedidos.

### 1.2 Problema que resuelve

- Gestión centralizada de datos de clientes
- Configuración de descuentos fijos por cliente (L2/L3)
- Acceso rápido a cuenta corriente y saldo
- Historial completo de pedidos por cliente
- Búsqueda y filtrado eficiente de clientes

### 1.3 Usuarios principales

- **Administrador:** CRUD completo, configuración de descuentos, acceso total a cuenta corriente
- **Vendedor:** Solo lectura + selección de clientes en cotizador

### 1.4 Simplificación v1 → v2

| Aspecto | v1 | v2 |
|---------|----|----|
| Identificación principal | CUIT + Razón Social | Dirección (más natural para el negocio) |
| Descuento fijo | Campo porcentaje personalizado | Radio buttons: Sin descuento / L2 (6.25%) / L3 (10%) |
| Cuenta Corriente | Pestaña dentro de Cliente | Pestaña dentro de Cliente + Módulo independiente (sincronizados) |

## 2. Funcionalidad Principal

### 2.1 Descripción general

El módulo Clientes permite gestionar toda la información comercial de cada cliente. Cada cliente almacena:

- Datos de contacto: Dirección (principal), teléfono, email, ciudad
- Configuración comercial: Descuento fijo, lista de precios predeterminada
- Datos financieros: Saldo en cuenta corriente
- Historial: Pedidos realizados, movimientos de cuenta corriente

La dirección es el identificador natural del cliente (no se usa CUIT ni razón social).

### 2.2 Características clave

- ✅ CRUD completo de clientes (crear, leer, editar, eliminar)
- ✅ Dirección como identificador principal
- ✅ Descuento fijo configurable (Sin descuento / L2 / L3)
- ✅ Búsqueda por dirección, teléfono o ciudad
- ✅ Filtrado por ciudad, descuento, saldo
- ✅ Vista detallada con 2 pestañas: Información + Cuenta Corriente
- ✅ Historial de pedidos del cliente
- ✅ Acceso directo a cuenta corriente desde tabla
- ✅ Indicador visual de saldo (verde/rojo)
- ✅ Exportación de listado de clientes

### 2.3 Flujo de trabajo típico

```
Usuario accede a Clientes
        ↓
Visualiza tabla con todos los clientes
        ↓
Puede filtrar por: Ciudad | Descuento | Saldo positivo/negativo
        ↓
Acciones disponibles:
├─ [+ Crear cliente]
├─ Búsqueda por dirección/teléfono/ciudad
├─ Click en cliente → Vista detallada
│   ├─ Pestaña "Información": Datos + Editar
│   └─ Pestaña "Cuenta Corriente": Movimientos + Registrar pago
├─ Exportar listado Excel
└─ Eliminar (si no tiene pedidos asociados)
```

## 3. Interfaz de Usuario

### 3.1 Layout general

**Vista principal:** Tabla de clientes con filtros superiores y botón [+ Crear cliente]

**Estructura:**

```
┌──────────────────────────────────────────────────────────────┐
│  CLIENTES                                     [+ Crear]       │
├──────────────────────────────────────────────────────────────┤
│  Filtros:  [Ciudad ▼]  [Descuento ▼]  [Saldo ▼]  [Búsqueda] │
├──────────────────────────────────────────────────────────────┤
│  Dirección              │ Teléfono    │ Ciudad  │ Saldo      │
│  Calle Falsa 123        │ 299-1234567 │ Neuquén │ -$50.000 🔴│
│  Av. Argentina 456      │ 299-7654321 │ Plottier│  $0      ✓ │
│  Ruta 22 Km 5           │ 298-1112233 │ Centenar│ +$12.300 🟢│
└──────────────────────────────────────────────────────────────┘
        🔴 = Debe | 🟢 = A favor
```

### 3.2 Filtros y búsqueda

| Filtro | Tipo | Opciones | Descripción |
|--------|------|----------|-------------|
| **Ciudad** | Dropdown | Todas / Neuquén / Plottier / Centenario / Otras | Filtra clientes por ciudad |
| **Descuento** | Dropdown | Todos / Sin descuento / L2 (6.25%) / L3 (10%) | Filtra por descuento fijo configurado |
| **Saldo** | Dropdown | Todos / Debe (negativo) / A favor (positivo) / $0 | Filtra por estado de cuenta corriente |
| **Búsqueda** | Input text | Busca en dirección, teléfono, ciudad | Filtrado en tiempo real |

### 3.3 Tabla principal

**Columnas visibles:**

- **Dirección**: Identificador principal (clickeable → abre detalle)
- **Teléfono**: Número de contacto
- **Ciudad**: Ciudad del cliente
- **Saldo CC**: Saldo cuenta corriente con indicador visual:
  - 🔴 Rojo: Saldo negativo (debe)
  - 🟢 Verde: Saldo positivo (a favor)
  - ✓ Neutro: Saldo $0
- **Acciones**: Botones Ver detalle | Editar | Eliminar

**Ordenamiento:**

- Default: Por dirección (A-Z)
- Clickeable en headers: Permite ordenar por cualquier columna

### 3.4 Modal: Crear/Editar Cliente

**Campos del formulario:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| **Nombre** | Text | ❌ No | Nombre del cliente (opcional) |
| **Dirección** | Text | ✅ Sí | Identificador principal (único) |
| **Teléfono** | Text | ✅ Sí | Número de contacto |
| **Email** | Email | ❌ No | Email del cliente (opcional) |
| **Ciudad** | Dropdown | ✅ Sí | Neuquén / Plottier / Centenario / Otras |
| **Descuento fijo** | Radio buttons | - | Sin descuento (default) / L2 (6.25%) / L3 (10%) |
| **Nota** | Textarea | ❌ No | Nota interna sobre el cliente (opcional) |
| **Activo** | Checkbox (header modal) | - | Toggle para marcar cliente activo/inactivo |

**⭐ Descuento fijo por cliente (NUEVO):** En lugar de campo de texto personalizado, se usan **radio buttons** para seleccionar descuento estándar (L2/L3). Esto simplifica la gestión al usar solo las listas de precios estándar en lugar de porcentajes custom.

**Ejemplo visual del formulario - Sección descuento:**

```
┌────────────────────────────────────┐
│  Descuento fijo del cliente        │
├────────────────────────────────────┤
│  ● Sin descuento                   │
│  ○ L2 (6.25%)                      │
│  ○ L3 (10.00%)                     │
└────────────────────────────────────┘
```

### 3.5 Vista detallada del cliente

**Acceso:** Click en dirección del cliente en la tabla principal

**Header:** Dirección + badges (estado, descuento) + botones editar/eliminar

**Estructura con 3 pestañas:** (Cuenta Corriente es la tab por defecto)

#### 3.5.1 Pestaña "Cuenta Corriente" (default)

**Contenido:** Vista completa de la cuenta corriente del cliente

**📄 Especificación detallada:** [Ver PRD Cuenta Corriente completo](cuenta-corriente.md)

#### 3.5.2 Pestaña "Historial Pedidos"

**Contenido:**

- Tabla con todos los pedidos del cliente
- Columnas: Fecha | Pedido # | Estado | Total | Método pago
- Clickeable → Abre detalle del pedido en módulo Ventas
- Ordenamiento: Cronológico descendente (más recientes primero)

#### 3.5.3 Pestaña "Información"

**Panel muestra:**

- Datos de contacto: Teléfono, Email, Ciudad
- Nota interna (si existe)
- Fecha de creación

**Panel superior de Cuenta Corriente muestra:**

- **Saldo actual:** Indicador visual (rojo si debe, verde si a favor)
- Total de pedidos realizados
- Fecha de última compra
- Botones: [+ Registrar pago genérico] [Exportar Excel]

**Tabla de movimientos:**

- Fecha | Tipo (Cargo/Pago) | Descripción | Cargo | Pago | Método | Saldo
- Ordenamiento cronológico descendente
- Detalle expandible por movimiento

### 3.6 Barra de acciones rápidas

**Ubicación:** Columna "Acciones" a la derecha de cada fila

**Botones disponibles:**

- **[Ver detalle]**: Abre vista detallada del cliente
- **[Editar]**: Abre modal Editar Cliente
- **[Eliminar]**: Confirmación → Elimina cliente (si no tiene pedidos asociados)

**⚠️ Restricción de eliminación:** No se puede eliminar un cliente que tenga pedidos asociados (activos o históricos). La cuenta corriente siempre debe tener trazabilidad completa.

### 3.7 Exportar listado de clientes

**Ubicación:** Botón [Exportar Excel] en header superior

**Archivo generado:**

- Nombre: `clientes_bambu_YYYY-MM-DD.xlsx`
- Columnas: Dirección | Teléfono | Email | Ciudad | Descuento | Saldo CC
- Ordenado por ciudad y dirección
- Filtros aplicados en la tabla se respetan en la exportación

**Uso:** Reporte para control administrativo, envío a contador, o análisis comercial

## 4. Reglas de Negocio Específicas

### 4.1 Validaciones

| Campo | Validación | Mensaje de error |
|-------|------------|------------------|
| **Dirección** | Único (no puede haber 2 clientes con misma dirección) | "Ya existe un cliente con esta dirección" |
| **Teléfono** | Formato numérico (sin validación estricta) | - |
| **Email** | Formato email válido (si se completa) | "Email inválido" |
| **Ciudad** | Debe ser una ciudad existente en el sistema | "Seleccione una ciudad válida" |

### 4.2 Descuento fijo por cliente

**Comportamiento:**

- Si tiene descuento L2 o L3, **reemplaza** el descuento de lista en todas sus compras
- Pensado para empleados, VIPs, revendedores frecuentes
- No se combina con el descuento de lista seleccionado en cotizador, lo sustituye
- Al seleccionar el cliente en el cotizador, se aplica automáticamente su descuento fijo (L2 o L3)

**Ventaja:** Simplifica la gestión al usar solo las listas de precios estándar (L2 y L3) en lugar de porcentajes custom

**Ejemplo:**

| Producto | Precio L1 | Cliente sin descuento | Cliente con L2 | Cliente con L3 |
|----------|-----------|----------------------|----------------|----------------|
| Detergente | $4.500 | $4.500 | $4.218 (L2 -6.25%) | $4.050 (L3 -10%) |

### 4.3 Cuenta corriente automática

**Regla:** Todos los clientes tienen cuenta corriente (obligatorio)

**Características:**

- Cargos automáticos al confirmar pedidos
- Pagos manuales (totales, parciales, genéricos)
- Discriminación efectivo/digital/mixto
- Historial cronológico completo
- Saldo actualizado en tiempo real

**No hay límite de crédito:** El sistema no bloquea ventas por deuda. El control es manual por parte del administrador.

### 4.4 Identificación por dirección

**Razón:** En el negocio de Química Bambu, los clientes se identifican naturalmente por su dirección (punto de entrega), no por CUIT o razón social.

**Implicaciones:**

- La dirección es única y obligatoria
- El buscador del cotizador busca por dirección
- Los reportes muestran dirección como identificador principal
- En repartos, los pedidos se ordenan por dirección/ciudad

### 4.5 Restricciones de eliminación

**No se puede eliminar un cliente si:**

- Tiene pedidos asociados (activos o históricos)
- Tiene movimientos en cuenta corriente
- Tiene saldo diferente de $0

**Mensaje:** "No se puede eliminar este cliente porque tiene pedidos o movimientos asociados"

**Alternativa:** Marcar como "inactivo" (funcionalidad futura) en lugar de eliminar

## 5. Integración con Otros Módulos

### 5.1 Cotizador

**Relación:** El cotizador selecciona clientes para asignar pedidos

**Sincronización:**

- Buscador de clientes consume la tabla de clientes
- Al seleccionar cliente, se carga automáticamente:
  - Dirección de entrega
  - Ciudad (define disponibilidad de reparto)
  - Descuento fijo (si tiene L2/L3 configurado)
  - Saldo actual de cuenta corriente (visible para operador)
- Al confirmar pedido → Cargo automático en cuenta corriente del cliente

### 5.2 Cuenta Corriente

**Relación:** Cuenta Corriente es una vista integrada dentro de Cliente + Módulo independiente

**Sincronización bidireccional:**

- Desde Cliente → Pestaña "Cuenta Corriente" muestra movimientos del cliente
- Desde módulo CC independiente → Selecciona cliente y muestra mismos datos
- Pagos registrados en cualquiera de los dos lados se sincronizan
- Saldo mostrado en tabla de Clientes proviene de CC

**📄 Especificación detallada:** [Ver PRD Cuenta Corriente completo](cuenta-corriente.md)

### 5.3 Ventas

**Relación:** Ventas muestra pedidos asociados a clientes

**Sincronización:**

- Desde Clientes → Historial de pedidos clickeable abre pedido en Ventas
- Desde Ventas → Click en cliente abre detalle de Cliente
- Filtro por cliente en Ventas consume tabla de clientes
- Pagos registrados en Ventas actualizan cuenta corriente del cliente

### 5.4 Configuración

**Relación:** Configuración define parámetros que afectan a clientes

**Dependencias:**

- **Listas de precio:** Configuración define % de descuento L2 (6.25%) y L3 (10%)
- **Ciudades:** Dropdown de ciudades se alimenta desde Configuración

## 6. Casos de Uso

### Caso 1: Crear cliente nuevo

**Contexto:** Administrador necesita agregar un cliente nuevo

**Acción:**

1. Usuario abre módulo Clientes
2. Click en [+ Crear cliente]
3. Completa formulario:
   - Dirección: "Calle Falsa 123"
   - Teléfono: "299-1234567"
   - Email: "cliente@ejemplo.com"
   - Ciudad: "Neuquén"
   - Descuento fijo: ○ Sin descuento
4. Click [Guardar]

**Resultado:**

- ✅ Cliente creado correctamente
- ✅ Aparece en tabla de clientes
- ✅ Cuenta corriente creada automáticamente con saldo $0
- ✅ Ya disponible en buscador del cotizador

### Caso 2: Configurar descuento fijo para cliente VIP

**Contexto:** Cliente frecuente merece descuento permanente

**Acción:**

1. Usuario busca cliente "Av. Argentina 456"
2. Click en [Editar]
3. Cambia radio button de "Sin descuento" a "○ L2 (6.25%)"
4. Click [Guardar]

**Resultado:**

- ✅ Cliente configurado con descuento L2
- ✅ Badge "L2" visible en tabla de clientes
- ✅ Al crear pedidos en cotizador, se aplica automáticamente L2
- ✅ Todos los productos (excepto promocionales) se cobran con 6.25% descuento

### Caso 3: Consultar cuenta corriente de un cliente

**Contexto:** Operador necesita verificar saldo antes de autorizar pedido

**Acción:**

1. Usuario busca cliente "Ruta 22 Km 5" en tabla
2. Click en dirección → Vista detallada
3. Click en pestaña "Cuenta Corriente"

**Resultado:**

- ✅ Ve saldo actual: -$50.000 (debe)
- ✅ Ve historial completo de movimientos (cargos y pagos)
- ✅ Ve última compra: 28/12/2024
- ✅ Puede registrar pago genérico si cliente pagó
- ✅ Puede exportar Excel de movimientos

### Caso 4: Filtrar clientes con saldo a favor

**Contexto:** Administrador quiere ver clientes que pagaron adelantos

**Acción:**

1. Usuario abre módulo Clientes
2. Aplica filtro: Saldo → "A favor (positivo)"

**Resultado:**

- ✅ Tabla muestra solo clientes con saldo positivo
- ✅ Indicador 🟢 verde en columna Saldo
- ✅ Puede exportar Excel de esta selección

### Caso 5: Ver historial de pedidos de un cliente

**Contexto:** Vendedor quiere revisar qué compra habitualmente un cliente

**Acción:**

1. Usuario busca cliente en tabla
2. Click en dirección → Vista detallada
3. Pestaña "Información" muestra historial de pedidos

**Resultado:**

- ✅ Tabla con últimos pedidos del cliente (fecha, #, estado, total)
- ✅ Puede ver productos frecuentes
- ✅ Click en pedido → Abre detalle en módulo Ventas

### Caso 6: Exportar listado de clientes por ciudad

**Contexto:** Administrador necesita reporte de clientes de Plottier

**Acción:**

1. Usuario abre módulo Clientes
2. Aplica filtro: Ciudad → "Plottier"
3. Click en [Exportar Excel]

**Resultado:**

- ✅ Descarga archivo `clientes_bambu_2024-12-31.xlsx`
- ✅ Contiene solo clientes de Plottier
- ✅ Columnas: Dirección | Teléfono | Email | Ciudad | Descuento | Saldo CC

## 7. Flujos de Usuario

### 7.1 Flujo principal: Gestión de cliente

```
Usuario accede a módulo Clientes
        ↓
Vista tabla completa de clientes
        ↓
Aplica filtros (opcional)
├─ Por ciudad
├─ Por descuento
├─ Por saldo
└─ Búsqueda por dirección/teléfono
        ↓
Selecciona acción:
├─ [+ Crear cliente] → Modal crear → Guardar → Cliente agregado
├─ Click en dirección → Vista detallada
│   ├─ Pestaña "Información" → Ver datos + Historial pedidos
│   └─ Pestaña "Cuenta Corriente" → Ver movimientos + Registrar pago
├─ [Editar] → Modal editar → Guardar → Cliente actualizado
├─ [Eliminar] → Confirmación → Cliente eliminado (si no tiene pedidos)
└─ [Exportar Excel] → Descargar listado filtrado
```

### 7.2 Flujo: Configurar descuento fijo

```
Administrador identifica cliente VIP
        ↓
Busca cliente en tabla
        ↓
Click [Editar]
        ↓
Modal muestra formulario con radio buttons:
├─ ● Sin descuento (default)
├─ ○ L2 (6.25%)
└─ ○ L3 (10.00%)
        ↓
Selecciona L2 o L3
        ↓
Click [Guardar]
        ↓
Sistema actualiza:
- Badge en tabla de clientes
- Descuento aplicado automáticamente en cotizador
- Todos los pedidos futuros usan ese descuento
        ↓
Notificación: ✅ "Cliente actualizado correctamente"
```

### 7.3 Flujo: Consultar cuenta corriente

```
Usuario busca cliente en tabla
        ↓
Click en dirección → Vista detallada
        ↓
Click en pestaña "Cuenta Corriente"
        ↓
Sistema muestra:
├─ Panel superior:
│   ├─ Saldo actual (con color: rojo/verde)
│   ├─ Total pedidos realizados
│   ├─ Fecha última compra
│   └─ Botones: [+ Pago genérico] [Exportar Excel]
└─ Tabla de movimientos cronológicos:
    ├─ Fecha | Tipo | Descripción
    ├─ Cargo | Pago | Método | Saldo
    └─ Expandible para ver detalles
        ↓
Usuario puede:
├─ Registrar pago genérico
├─ Exportar Excel de movimientos
└─ Ver historial completo
```

### 7.4 Flujo: Seleccionar cliente en cotizador

```
Usuario crea pedido en Cotizador
        ↓
Click en campo "Cliente"
        ↓
Buscador muestra lista de clientes:
- Búsqueda por dirección/teléfono
- Ordenados alfabéticamente
        ↓
Usuario selecciona cliente
        ↓
Sistema carga automáticamente:
├─ Dirección de entrega
├─ Ciudad (define disponibilidad reparto)
├─ Descuento fijo (si tiene L2/L3)
└─ Saldo actual CC (visible para operador)
        ↓
Usuario continúa agregando productos
        ↓
Al confirmar pedido:
- Se genera cargo en cuenta corriente del cliente
- Saldo se actualiza automáticamente
```

## 8. Notas Técnicas para Desarrollo

### 8.1 Estructura de datos (Mock data)

```javascript
// Ejemplo de estructura para prototipos
const CLIENTE_EJEMPLO = {
    id: 1,
    nombre: null, // Opcional
    direccion: "Calle Falsa 123", // Identificador principal (único)
    telefono: "299-1234567",
    email: "cliente@ejemplo.com", // Opcional
    ciudad: "Neuquén",
    descuento_fijo: null, // null = sin descuento | "L2" | "L3"
    saldo_cc: -50000, // Saldo cuenta corriente (negativo = debe)
    total_pedidos: 15, // Cantidad de pedidos realizados
    fecha_ultima_compra: "2024-12-28",
    created_at: "2024-01-10",
    updated_at: "2024-12-30"
};

// Ejemplo cliente con descuento L2
const CLIENTE_VIP = {
    id: 5,
    nombre: "Juan Pérez", // Opcional
    direccion: "Av. Argentina 456",
    telefono: "299-7654321",
    email: null,
    ciudad: "Plottier",
    descuento_fijo: "L2", // Descuento permanente 6.25%
    saldo_cc: 0, // Saldo $0
    total_pedidos: 42,
    fecha_ultima_compra: "2024-12-29",
    created_at: "2023-05-20",
    updated_at: "2024-12-29"
};

// Ejemplo cliente con saldo a favor
const CLIENTE_ADELANTO = {
    id: 8,
    nombre: null,
    direccion: "Ruta 22 Km 5",
    telefono: "298-1112233",
    email: "contacto@empresa.com",
    ciudad: "Centenario",
    descuento_fijo: "L3", // Descuento permanente 10%
    saldo_cc: 12300, // Saldo positivo (a favor)
    total_pedidos: 8,
    fecha_ultima_compra: "2024-12-20",
    created_at: "2024-08-15",
    updated_at: "2024-12-27"
};
```

### 8.2 Consideraciones de implementación

- ⚠️ **Dirección única:** Implementar validación en tiempo real (al escribir) para evitar duplicados
- ⚠️ **Saldo CC:** Calculado en tiempo real desde tabla movimientos_cc (no almacenar redundante)
- ⚠️ **Descuento fijo:** Al seleccionar cliente en cotizador, aplicar descuento automáticamente
- ⚠️ **Restricción de eliminación:** Query pre-eliminación: `SELECT COUNT(*) FROM pedidos WHERE cliente_id = ?`
- 💡 **Búsqueda eficiente:** Índice en columna dirección para búsquedas rápidas
- 💡 **Indicador visual de saldo:** Usar clases CSS condicionales (rojo/verde) según signo del saldo
- 💡 **Exportación Excel:** Respetar filtros activos en la tabla al exportar
