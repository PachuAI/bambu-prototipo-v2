# PRD: Estadísticas de Ventas - Análisis de ventas por producto

> **Fuente**: `prd/estadisticas.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Estadísticas de Ventas
**Análisis de ventas por producto**

| | |
|---|---|
| **Versión** | 2.0 |
| **Fecha** | 31 Diciembre 2024 |
| **Estado** | ✅ Prototipado y validado (Enero 2026) |

**Nota:** Este PRD describe funcionalidades y reglas de negocio. Para referencia visual, ver el [prototipo HTML](../prototipos/estadisticas.html).

## 1. Contexto y Objetivo

### 1.1 Propósito del módulo

El módulo **Estadísticas de Ventas por Producto** permite analizar el desempeño comercial de cada producto en períodos de tiempo específicos. Provee métricas clave para decisiones de inventario, producción y estrategia comercial.

### 1.2 Problema que resuelve

- Identificar productos más vendidos vs menos vendidos
- Analizar tendencias de ventas por período
- Tomar decisiones de stock basadas en datos
- Detectar productos de baja rotación
- Generar reportes de ventas por producto

### 1.3 Usuarios principales

- **Administrador:** Acceso completo a estadísticas y reportes
- **Vendedor:** SIN ACCESO (módulo exclusivo admin)

## 2. Funcionalidad Principal

### 2.1 Descripción general

El módulo muestra una tabla con todos los productos del catálogo y sus métricas de venta en un período seleccionado. Permite filtrar por fecha, ordenar por cantidad vendida o monto total, y exportar resultados a Excel.

### 2.2 Características clave

- ✅ Selector de período (desde-hasta)
- ✅ Cards resumen: productos vendidos, unidades, monto total, pedidos
- ✅ Tabla de productos con métricas de venta
- ✅ Ordenamiento por cantidad vendida o monto total
- ✅ Gráfico Top 10 productos (Chart.js) con toggle cantidad/monto
- ✅ Exportación CSV con resumen detallado
- ✅ Filtros adicionales: Por proveedor, búsqueda por nombre

### 2.3 Flujo de trabajo típico

```
Administrador accede a Estadísticas
        ↓
Selecciona período (ej: Diciembre 2024)
        ↓
Sistema calcula métricas por producto:
├─ Cantidad vendida
├─ Monto total
└─ Participación en ventas (%)
        ↓
Tabla muestra productos ordenados por cantidad vendida
        ↓
Administrador puede:
├─ Reordenar por monto total
├─ Filtrar por proveedor
├─ Exportar Excel
└─ Ver gráfico de tendencia
```

## 3. Interfaz de Usuario

### 3.1 Filtros superiores

| Filtro | Tipo | Descripción |
|--------|------|-------------|
| **Desde (fecha)** | Date picker | Fecha inicial del período (obligatorio) |
| **Hasta (fecha)** | Date picker | Fecha final del período (obligatorio) |
| **Proveedor** | Dropdown | Filtrar solo productos de un proveedor específico (opcional) |
| **Buscar producto** | Input text | Buscar producto por nombre (opcional) |

### 3.2 Tabla de resultados

**Columnas:**

- **Producto:** Nombre del producto
- **Cantidad vendida:** Total de unidades vendidas en el período (clickeable para ordenar)
- **Monto total:** Suma de ventas en pesos (clickeable para ordenar)
- **% Participación:** Porcentaje del total de ventas
- **Acciones:** [Ver detalle] (abre modal con ventas individuales)

**Fila TOTAL:**

- Al final de la tabla
- Suma total de cantidades, montos y 100%
- Fondo destacado para diferenciarlo

**Ordenamiento:**

- Default: Por cantidad vendida (descendente)
- Clickeable en headers: Permite ordenar por cualquier columna

### 3.3 Gráfico Top 10 Productos

**Tipo:** Gráfico de barras verticales (Chart.js)

**Contenido:**

- Eje X: Productos (top 10 más vendidos, nombres truncados a 20 chars)
- Eje Y: Cantidad vendida o Monto total (según toggle)
- Toggle botones: "Cantidad" / "Monto" para cambiar visualización
- Tooltips formateados según tipo (unidades vs $)
- Dark mode compatible (colores adaptan al tema)

### 3.4 Modal: Ver detalle de producto

**Acceso:** Click en [Ver detalle] de un producto en la tabla

**Contenido:**

- Nombre del producto (header)
- Período seleccionado
- Tabla con pedidos individuales:
  - Fecha del pedido
  - Pedido # (clickeable → abre pedido en Ventas)
  - Cliente
  - Cantidad vendida
  - Precio unitario
  - Subtotal
- Total al final de la tabla

### 3.5 Exportar Excel

**Ubicación:** Botón [Exportar Excel] en header superior

**Archivo generado:**

- Nombre: `estadisticas_ventas_YYYY-MM-DD.xlsx`
- Columnas: Producto | Cantidad vendida | Monto total | % Participación
- Fila TOTAL al final
- Filtros aplicados se incluyen como información en el archivo (período, proveedor si aplica)

## 4. Reglas de Negocio Específicas

### 4.1 Validaciones

| Campo | Validación | Mensaje de error |
|-------|------------|------------------|
| **Desde (fecha)** | No puede ser mayor que "Hasta" | "La fecha inicial no puede ser posterior a la fecha final" |
| **Hasta (fecha)** | No puede ser anterior a "Desde" | "La fecha final no puede ser anterior a la fecha inicial" |
| **Período máximo** | No más de 1 año (opcional, por performance) | "El período máximo es de 1 año" |

### 4.2 Cálculo de métricas

**Cantidad vendida:**

- Suma de cantidades de ese producto en TODOS los pedidos confirmados (estado != borrador)
- Incluye pedidos entregados y en tránsito
- NO incluye borradores (nunca confirmados)

**Monto total:**

- Suma de (cantidad * precio_unitario) en cada pedido
- Usa el precio al momento de la venta (histórico)
- Incluye descuentos aplicados en ese momento

**% Participación:**

- Fórmula: (Monto total del producto / Monto total de todos) * 100
- Permite identificar productos que representan mayor porcentaje de ventas

### 4.3 Productos sin ventas

**Comportamiento:**

- Por defecto, NO se muestran productos con 0 ventas en el período
- Toggle opcional: "Mostrar productos sin ventas" (marca productos inactivos)
- Si se activa, productos con 0 ventas aparecen al final con cantidad = 0, monto = $0

### 4.4 Pedidos incluidos en estadísticas

**Regla:** Solo se cuentan pedidos con estado != "borrador"

**Estados incluidos:**

- ✅ Pendiente
- ✅ Asignado
- ✅ En tránsito
- ✅ Entregado

**Estados NO incluidos:**

- ❌ Borrador (nunca confirmado)

*Nota: El estado "Cancelado" no existe actualmente en el sistema.*

## 5. Integración con Otros Módulos

### 5.1 Ventas

**Relación:** Estadísticas consume datos de pedidos del módulo Ventas

**Sincronización:**

- Query a tabla de pedidos filtrando por rango de fechas
- Click en pedido individual en modal "Ver detalle" abre ese pedido en Ventas
- Los cambios en pedidos (ediciones, eliminaciones) se reflejan inmediatamente en estadísticas

### 5.2 Productos

**Relación:** Estadísticas muestra productos del catálogo

**Sincronización:**

- Lista de productos se obtiene de la tabla de productos
- Productos eliminados del catálogo siguen apareciendo en estadísticas si tuvieron ventas históricas
- Filtro por proveedor consume tabla de proveedores

### 5.3 Dashboard (opcional)

**Relación:** Dashboard puede mostrar widget con top 5 productos más vendidos

**Sincronización:**

- Widget en Dashboard usa misma query que Estadísticas pero limitado a top 5
- Click en widget redirige a Estadísticas con período del mes actual
