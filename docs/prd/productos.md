# PRD: Productos - Gestión del catálogo de productos

> **Fuente**: `prd/productos.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Productos
**Gestión del catálogo de productos**

| | |
|---|---|
| **Versión** | 2.0 |
| **Fecha** | 31 Diciembre 2024 |
| **Estado** | En especificación |

## 1. Contexto y Objetivo

### 1.1 Propósito del módulo

El módulo **Productos** es el catálogo centralizado de todos los artículos comercializados por Química Bambu. Gestiona desde productos químicos individuales hasta packs promocionales, incluyendo su información comercial, inventario y configuración de precios.

### 1.2 Problema que resuelve

- Gestión unificada del catálogo de productos
- Control de stock y alertas de inventario
- Configuración de precios por lista (L1, L2, L3) y promociones
- Orden de productos para buscadores (drag & drop)
- Activación/desactivación de productos sin eliminarlos
- Generación de reportes de inventario

### 1.3 Usuarios principales

- **Administrador:** CRUD completo, configuración de precios, stock, promociones
- **Vendedor:** Solo lectura (ve productos en cotizador según disponibilidad)

### 1.4 Simplificación v1 → v2

| Aspecto | v1 | v2 |
|---------|----|----|
| Campo SKU | ✅ Existía | ❌ Eliminado (identificación por nombre únicamente) |
| Orden de productos | Manual (campo numérico) | Drag & drop visual |
| Tipos de producto | 2 tipos: Producto / Combo | 1 tipo único: Todos son "productos" (combos = productos en promoción con precio fijo) |
| Promociones | Switch + precio promocional | Switch + precio promocional (sin cambios) |

## 2. Funcionalidad Principal

### 2.1 Descripción general

El módulo Productos centraliza la gestión del catálogo comercial. Cada producto almacena información completa:

- Datos básicos: Nombre, proveedor, peso
- Precios: Lista 1 (base), L2 y L3 se calculan automáticamente
- Stock: Actual, mínimo, alertas
- Configuración: Disponibilidad, promociones, orden

El sistema permite gestionar productos estándar y promocionales (incluyendo combos/packs) usando una única estructura simplificada.

### 2.2 Características clave

- ✅ CRUD completo de productos (crear, leer, editar, eliminar)
- ✅ Control de disponibilidad (activar/desactivar sin eliminar)
- ✅ Orden visual drag & drop (define aparición en buscadores)
- ✅ Productos en promoción con precio fijo
- ✅ Combos/packs como productos promocionales
- ✅ Stock automático + movimientos manuales
- ✅ Alertas de stock mínimo
- ✅ Exportación de inventario por proveedor
- ✅ Persistencia de filtros entre sesiones
- ✅ Barra de acciones rápidas por producto

### 2.3 Flujo de trabajo típico

```
Usuario accede a Productos
        ↓
Visualiza tabla con todos los productos
        ↓
Puede filtrar por: Proveedor | Disponibilidad | En promoción
        ↓
Acciones disponibles:
├─ [+ Crear producto]
├─ Reordenar drag & drop
├─ Editar producto existente
├─ Ajustar stock
├─ Activar/desactivar
├─ Eliminar (si no tiene pedidos asociados)
└─ Exportar inventario Excel
```

## 3. Interfaz de Usuario

### 3.1 Layout general

**Vista principal:** Tabla de productos con filtros superiores y botón [+ Crear producto]

**Estructura:**

```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCTOS                                     [+ Crear]     │
├─────────────────────────────────────────────────────────────┤
│  Filtros:  [Proveedor ▼]  [Disponibilidad ▼]  [Búsqueda]   │
│            [☐ En promoción]  [Limpiar filtros]               │
├─────────────────────────────────────────────────────────────┤
│  #  │ Nombre         │ Proveedor │ Precio L1 │ Stock │ ...  │
│  1  │ Detergente X   │ Prov A    │ $4.500    │ 120   │ ⋮    │
│  2  │ Lavandina Y    │ Prov B    │ $3.200    │ 85    │ ⋮    │
│  3  │ Pack Combo Z   │ -         │ $15.000 🏷│ 20    │ ⋮    │
└─────────────────────────────────────────────────────────────┘
        🏷 = En promoción
```

### 3.2 Filtros y búsqueda

| Filtro | Tipo | Opciones | Descripción |
|--------|------|----------|-------------|
| **Proveedor** | Dropdown múltiple | Lista de proveedores existentes | Filtra productos de uno o varios proveedores |
| **Disponibilidad** | Dropdown | Todos / Disponibles / No disponibles | Filtra por estado de disponibilidad |
| **En promoción** | Checkbox | ✓ Solo promocionales | Muestra solo productos con precio promocional activo |
| **Búsqueda** | Input text | Busca en nombre de producto | Filtrado en tiempo real por nombre |

**⭐ Persistencia de filtros (NUEVO):** Al salir del módulo y volver, los filtros permanecen activos. Útil para trabajar con subconjuntos (ej: solo productos de un proveedor). Botón "Limpiar filtros" resetea todo.

### 3.3 Tabla principal

**Columnas visibles:**

- **#**: Número de orden (editable drag & drop)
- **Nombre**: Nombre del producto + badge 🏷 si en promoción
- **Proveedor**: Nombre del proveedor
- **Precio L1**: Precio base lista 1 (o promocional si activo)
- **Stock**: Cantidad actual (⚠️ si bajo stock mínimo)
- **Peso (kg)**: Peso unitario del producto
- **Estado**: Badge verde "Disponible" / gris "No disponible"
- **Acciones**: Botones Editar | Ajustar Stock | Eliminar

### 3.4 Drag & Drop para reordenar

**Funcionalidad:**

- Icono ⋮⋮ a la izquierda del número de orden permite arrastrar productos
- Al soltar, el producto se reposiciona en la lista
- Los números de orden se recalculan automáticamente
- Define orden de aparición en buscador del cotizador (productos prioritarios arriba)
- Productos nuevos se agregan automáticamente al final

**Flujo visual:**

```
Antes de arrastrar:
  1. Detergente A
  2. Lavandina B    ← usuario agarra este
  3. Cloro C

Durante arrastre:
  1. Detergente A
  [espacio vacío]
  3. Cloro C

Después de soltar arriba de "1":
  1. Lavandina B    ← ahora es #1
  2. Detergente A   ← bajó a #2
  3. Cloro C
```

### 3.5 Modal: Crear/Editar Producto

**Campos del formulario:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| **Nombre** | Text | ✅ Sí | Nombre del producto (único) |
| **Proveedor** | Dropdown | ❌ No | Selección de proveedor existente (combos pueden no tener) |
| **Precio base (L1)** | Number | ✅ Sí | Precio lista 1 (base). L2 y L3 se calculan automáticamente |
| **Stock actual** | Number | ✅ Sí | Cantidad en inventario |
| **Stock mínimo** | Number | ✅ Sí | Umbral para alerta de stock bajo |
| **Peso (kg)** | Number | ✅ Sí | Peso unitario del producto |
| **Disponible** | Switch | - | ON = aparece en cotizador \| OFF = no se puede vender |
| **En promoción** | Switch | - | Activa campo de precio promocional |
| **Precio promocional** | Number | Condicional | Solo si "En promoción" = ON. Precio fijo que ignora listas |

**Campo SKU eliminado** ⭐ NUEVO (Dic 2024): El campo SKU ha sido eliminado completamente. Los productos se identifican únicamente por su nombre.

### 3.6 Modal: Ajustar Stock

**Acceso:** Botón "Ajustar Stock" en barra de acciones de cada producto

**Campos:**

- **Producto:** Nombre (solo lectura)
- **Stock actual:** Cantidad (solo lectura)
- **Tipo de movimiento:**
  - ○ Ingreso (+): Producción, compra
  - ○ Ajuste (-): Corrección de inventario, merma, rotura
- **Cantidad:** Monto a sumar o restar
- **Motivo:** Descripción del movimiento (obligatorio)
- **Fecha:** Fecha del movimiento (default: hoy)

**Vista previa:** "Stock después del movimiento: XXX unidades"

**Efecto:**

- Actualiza stock del producto
- Registra movimiento en historial
- Muestra notificación: ✅ "Stock actualizado correctamente"

### 3.7 Barra de acciones rápidas

**Ubicación:** Columna "Acciones" a la derecha de cada fila

**Botones disponibles:**

- **[Editar]**: Abre modal Editar Producto
- **[Ajustar Stock]**: Abre modal Ajustar Stock
- **[Eliminar]**: Confirmación → Elimina producto (si no tiene pedidos asociados)

**⚠️ Restricción de eliminación:** No se puede eliminar un producto que tenga pedidos asociados (activos o históricos). En su lugar, usar "No disponible" para desactivarlo.

### 3.8 Exportar inventario

**Ubicación:** Botón [Exportar Excel] en header superior

**Modal de exportación:**

- **Filtro por proveedor:** Selector múltiple (permite elegir uno o varios)
- **Vista previa:** "X productos seleccionados"
- **Botón:** [Descargar Excel]

**Archivo generado:**

- Nombre: `inventario_bambu_YYYY-MM-DD.xlsx`
- Columnas: Nombre | Proveedor | Stock Actual | Stock Mínimo | Precio L1
- Ordenado por proveedor y nombre

**Uso:** Reporte rápido de inventario para control interno o envío a proveedores

## 4. Reglas de Negocio Específicas

### 4.1 Validaciones

| Campo | Validación | Mensaje de error |
|-------|------------|------------------|
| **Nombre** | Único (no puede haber 2 productos con mismo nombre) | "Ya existe un producto con este nombre" |
| **Precio base L1** | Mayor a 0 | "El precio debe ser mayor a 0" |
| **Precio promocional** | Menor a precio L1 | "El precio promocional debe ser menor al precio L1" |
| **Stock actual** | Puede ser negativo (devoluciones) | - |
| **Stock mínimo** | Mayor o igual a 0 | "El stock mínimo no puede ser negativo" |
| **Peso (kg)** | Mayor a 0 | "El peso debe ser mayor a 0" |

### 4.2 Producto no disponible

**Comportamiento:**

- Switch en modal de edición
- Si `Disponible = OFF`:
  - ❌ NO aparece en buscador del cotizador
  - ✅ Permanece en el sistema para consulta
  - ✅ Los pedidos existentes que lo contengan NO se afectan
  - ✅ Es reversible (se puede volver a activar)

**Uso típico:** Productos descontinuados, temporalmente sin stock, o reemplazados por nuevas versiones

### 4.3 Producto en promoción

**Comportamiento:**

- Switch "En promoción" en modal de edición
- Al activar, habilita campo "Precio promocional"
- El precio promocional es **fijo**, independiente de la lista seleccionada
- Productos promocionales NO entran en cálculo de umbral de descuento automático

**Ejemplo:**

| Concepto | Precio normal | Precio en promoción |
|----------|---------------|---------------------|
| Lista 1 (L1) | $4.500 | **$4.100** (precio fijo) |
| Lista 2 (L2) | $4.300 | **$4.100** (precio fijo) |
| Lista 3 (L3) | $4.100 | **$4.100** (precio fijo) |

**Regla:** Si está en promoción a $4.100, **siempre** se cobra $4.100 sin importar la lista seleccionada

### 4.4 Combos y packs

**Concepto simplificado:** NO existe una categoría separada de "Combo". Los combos se crean como **productos normales** activando el campo "En promoción" con un precio fijo.

**Ejemplo de combo:**

- **Nombre:** "Pack Limpieza Completo"
- **En promoción:** ✓ Activado
- **Precio promocional:** $15.000 (precio fijo)
- **Proveedor:** (opcional, puede no tener)
- **Stock:** Se controla manualmente si se desea

**Simplificación v2:** Esta aproximación elimina la complejidad de tener dos tipos de productos diferentes. Todo es un "producto" con la opción de precio promocional para combos. El precio promocional actúa de forma independiente a las listas de descuento, permitiendo ofrecer combos a precio fijo.

### 4.5 Orden de productos

**Funcionalidad drag & drop:**

- Los productos nuevos se agregan automáticamente al final de la lista
- Se puede reordenar arrastrando y soltando productos
- El número de orden se ajusta automáticamente al reordenar
- Define el orden de aparición en el buscador del cotizador (productos prioritarios aparecen primero)
- Interfaz visual intuitiva sin necesidad de ingresar números manualmente

**Impacto en el cotizador:**

- Al buscar productos en el cotizador, aparecen ordenados según este campo
- Productos frecuentes pueden colocarse arriba para acceso rápido
- Productos de temporada pueden priorizarse temporalmente

### 4.6 Stock

**Movimientos automáticos:**

- Se confirma un pedido → se descuenta stock
- Se modifica un pedido → se ajusta stock (suma o resta según el cambio)
- Se elimina un pedido → se reintegra stock

**Movimientos manuales:**

- Ingreso de stock (+): Producción, compra
- Ajuste de stock (-): Corrección de inventario, merma, rotura
- Cada movimiento registra: cantidad, motivo, fecha, usuario

**Alertas de stock bajo:**

- Si `stock_actual < stock_minimo` → Badge ⚠️ en tabla
- Dashboard puede mostrar panel "Productos con stock bajo"

**⚠️ Stock negativo permitido:** El sistema permite stock negativo para manejar casos de devoluciones o ajustes de inventario.

### 4.7 Historial de movimientos de stock

**Acceso:** Desde detalle de producto → Pestaña "Historial de stock"

**Información registrada:**

- Fecha del movimiento
- Tipo: Ingreso (+) / Egreso (-) / Ajuste
- Cantidad afectada
- Motivo (si es manual) o Pedido #XXX (si es automático)
- Stock resultante después del movimiento
- Usuario que realizó el movimiento (si manual)

**Ordenamiento:** Cronológico descendente (más recientes primero)

## 5. Integración con Otros Módulos

### 5.1 Cotizador

**Relación:** El cotizador consume el catálogo de productos para armar pedidos

**Sincronización:**

- Solo aparecen productos con `Disponible = ON`
- El orden en el buscador del cotizador respeta el campo "Orden" de productos
- Los precios se calculan según la lista seleccionada (L1/L2/L3), excepto promocionales que usan precio fijo
- Al confirmar pedido, el stock se descuenta automáticamente

### 5.2 Stock

**Relación:** El módulo Stock registra todos los movimientos de inventario

**Sincronización:**

- Movimientos automáticos desde pedidos (confirmar, modificar, eliminar)
- Movimientos manuales desde modal "Ajustar Stock" en Productos
- Alertas de stock mínimo se muestran en ambos módulos
- Historial completo de movimientos por producto

### 5.3 Configuración

**Relación:** Configuración general define parámetros que afectan a productos

**Dependencias:**

- **Listas de precio:** Configuración define % de descuento L2 y L3 sobre L1
- **Proveedores:** Dropdown de proveedores se alimenta desde Configuración
- **Comportamiento stock:** Configuración define si stock puede ser negativo

### 5.4 Ventas

**Relación:** Ventas muestra pedidos que contienen productos

**Sincronización:**

- Al editar un pedido en Ventas, se recalcula stock automáticamente
- Productos eliminados o no disponibles siguen visibles en pedidos históricos
- Estadísticas de ventas por producto se generan desde este módulo

## 6. Casos de Uso

### Caso 1: Crear producto nuevo

**Contexto:** Administrador necesita agregar un producto nuevo al catálogo

**Acción:**

1. Usuario abre módulo Productos
2. Click en [+ Crear producto]
3. Completa formulario:
   - Nombre: "Desengrasante Industrial 5L"
   - Proveedor: "Proveedor A"
   - Precio L1: $8.500
   - Stock actual: 50
   - Stock mínimo: 10
   - Peso: 5.2 kg
   - Disponible: ON
4. Click [Guardar]

**Resultado:**

- ✅ Producto creado correctamente
- ✅ Aparece al final de la tabla (último orden)
- ✅ Ya disponible en buscador del cotizador

### Caso 2: Crear combo promocional

**Contexto:** Administrador quiere crear pack promocional con precio fijo

**Acción:**

1. Usuario abre módulo Productos
2. Click en [+ Crear producto]
3. Completa formulario:
   - Nombre: "Pack Limpieza Hogar Completo"
   - Proveedor: (vacío - es combo)
   - Precio L1: $18.000
   - Stock actual: 20
   - Stock mínimo: 5
   - Peso: 8.0 kg
   - Disponible: ON
   - En promoción: ON
   - Precio promocional: $15.000
4. Click [Guardar]

**Resultado:**

- ✅ Combo creado como producto promocional
- ✅ Se vende siempre a $15.000 sin importar lista
- ✅ Badge 🏷 en tabla indica promoción
- ✅ NO entra en cálculo de umbral de descuento automático

### Caso 3: Reordenar productos con drag & drop

**Contexto:** Administrador quiere priorizar productos frecuentes en buscador

**Acción:**

1. Usuario abre módulo Productos
2. Identifica producto frecuente (ej: "Detergente X" en posición #15)
3. Arrastra icono ⋮⋮ del producto
4. Suelta en posición #1

**Resultado:**

- ✅ "Detergente X" ahora es #1
- ✅ Productos anteriores bajan una posición
- ✅ Números de orden se recalculan automáticamente
- ✅ En cotizador, "Detergente X" aparece primero en búsquedas

### Caso 4: Ajustar stock por producción

**Contexto:** Llegó producción nueva de un producto

**Acción:**

1. Usuario busca producto "Lavandina 2L"
2. Click en [Ajustar Stock]
3. Selecciona: Ingreso (+)
4. Cantidad: 100
5. Motivo: "Producción lote #245"
6. Click [Guardar]

**Resultado:**

- ✅ Stock aumentado en 100 unidades
- ✅ Movimiento registrado en historial
- ✅ Notificación: "Stock actualizado correctamente"

### Caso 5: Desactivar producto descontinuado

**Contexto:** Producto descontinuado que ya no se vende

**Acción:**

1. Usuario busca producto "Producto Viejo"
2. Click en [Editar]
3. Cambia switch "Disponible" a OFF
4. Click [Guardar]

**Resultado:**

- ✅ Producto marcado como "No disponible"
- ❌ Ya NO aparece en buscador del cotizador
- ✅ Pedidos históricos que lo contienen NO se afectan
- ✅ Permanece en sistema para consultas
- ✅ Reversible (se puede volver a activar)

### Caso 6: Exportar inventario por proveedor

**Contexto:** Administrador necesita reporte de stock de un proveedor específico

**Acción:**

1. Usuario abre módulo Productos
2. Click en [Exportar Excel]
3. Selecciona proveedor: "Proveedor A"
4. Vista previa: "15 productos seleccionados"
5. Click [Descargar Excel]

**Resultado:**

- ✅ Descarga archivo `inventario_bambu_2024-12-31.xlsx`
- ✅ Contiene solo productos de "Proveedor A"
- ✅ Columnas: Nombre | Proveedor | Stock Actual | Stock Mínimo | Precio L1

## 7. Flujos de Usuario

### 7.1 Flujo principal: Gestión de producto

```
Usuario accede a módulo Productos
        ↓
Vista tabla completa de productos
        ↓
Aplica filtros (opcional)
├─ Por proveedor
├─ Por disponibilidad
├─ Solo promocionales
└─ Búsqueda por nombre
        ↓
Selecciona acción:
├─ [+ Crear producto] → Modal crear → Guardar → Producto agregado al final
├─ [Editar] → Modal editar → Guardar → Producto actualizado
├─ [Ajustar Stock] → Modal ajustar → Guardar → Stock actualizado
├─ Drag & drop → Reordenar → Orden actualizado automáticamente
├─ [Eliminar] → Confirmación → Producto eliminado (si no tiene pedidos)
└─ [Exportar Excel] → Seleccionar proveedor → Descargar archivo
```

### 7.2 Flujo alternativo: Crear combo promocional

```
Usuario accede a módulo Productos
        ↓
Click [+ Crear producto]
        ↓
Completa campos básicos:
- Nombre del combo
- Precio base L1
- Stock inicial
        ↓
Activa switch "En promoción"
        ↓
Campo "Precio promocional" se habilita
        ↓
Ingresa precio fijo del combo
        ↓
Completa resto de campos
        ↓
Click [Guardar]
        ↓
Sistema valida:
- Precio promocional < Precio L1 ✓
- Nombre único ✓
        ↓
Combo creado como producto promocional
        ↓
Badge 🏷 visible en tabla
        ↓
Disponible en cotizador con precio fijo
```

### 7.3 Flujo: Desactivar producto sin eliminar

```
Usuario identifica producto descontinuado
        ↓
Click [Editar]
        ↓
Cambia switch "Disponible" a OFF
        ↓
Click [Guardar]
        ↓
Sistema actualiza:
- Badge gris "No disponible" en tabla
- Producto oculto en buscador cotizador
- Pedidos históricos NO afectados
        ↓
Producto permanece en sistema para consulta
        ↓
(Reversible: puede volver a activarse)
```

### 7.4 Flujo: Reordenar productos drag & drop

```
Usuario abre módulo Productos
        ↓
Identifica producto a priorizar
        ↓
Hover sobre icono ⋮⋮ (cursor cambia a "mano")
        ↓
Click y mantener presionado
        ↓
Arrastra producto hacia arriba/abajo
        ↓
Suelta en nueva posición
        ↓
Sistema recalcula orden automáticamente:
- Producto movido toma nueva posición
- Productos intermedios se ajustan
- Números de orden se actualizan
        ↓
Orden guardado automáticamente
        ↓
Impacta en buscador del cotizador inmediatamente
```
