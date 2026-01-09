# PRD: Dashboard

> **Fuente**: `prd/dashboard.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Dashboard

| | |
|---|---|
| **Versión** | 2.0 (Limpio - Enero 2026) |
| **Prototipo** | [prototipos/dashboard.html](../prototipos/dashboard.html) |
| **Estado** | Prototipo validado |

**Nota:** Este PRD describe funcionalidades y reglas de negocio. Para referencia visual, ver el prototipo HTML.

## 1. Contexto y Objetivo

### 1.1 Propósito

Pantalla principal al ingresar al sistema. Vista ejecutiva del estado operativo diario.

### 1.2 Problema que resuelve

- Vista panorámica del estado operativo en un solo vistazo
- Acceso rápido a cualquier entidad mediante buscador global
- Identificación inmediata de alertas críticas
- Resumen diario de repartos

### 1.3 Cambios v1 → v2

| Aspecto | v1 | v2 |
|---------|----|----|
| Buscador global | No existía | Búsqueda unificada con atajo teclado |
| Alertas stock bajo | Lista larga | Formato compacto (8-10 productos) |
| Pedidos pendientes asignar | Existía | Eliminado (no aportaba valor) |

## 2. Funcionalidad Principal

### 2.1 Áreas del Dashboard

- **Buscador global:** Campo prominente en la parte superior
- **Carrusel de calendario:** Resumen de cada día (pedidos + kg)
- **Repartos del día siguiente:** Lista de repartos para mañana
- **Widgets inferiores:** Alertas de stock, métricas de ventas, etc.

### 2.2 Flujo típico

1. Usuario ingresa al sistema → Dashboard se carga
2. Ve vista panorámica del estado operativo
3. Puede buscar cualquier entidad desde buscador global
4. Click en día del calendario → Ventas filtrado por esa fecha
5. Click en alerta stock → Ir a Productos

## 3. Componentes

### 3.1 Buscador Global

**Busca simultáneamente en:**

- Clientes (por dirección, teléfono)
- Productos (por nombre)
- Pedidos (por número o dirección)

**Comportamiento:**

- Resultados agrupados por tipo con ícono identificador
- Máximo 4 resultados por categoría
- Click en resultado → navega al detalle
- Atajo de teclado: Ctrl+K o Cmd+K

### 3.2 Carrusel de Calendario

**Vista:** Días de la semana (L-V) con métricas

**Información por día:**

- Fecha
- Cantidad de pedidos REPARTO programados
- Total kg a repartir
- Indicador visual si es día actual

**Interacción:**

- Click en día → Navega a Repartos del día (repartos-dia.html?fecha=YYYY-MM-DD)
- Flechas para navegar entre semanas
- Botón "HOY" para volver a semana actual (visible solo si navegó)

### 3.3 Repartos del Día Siguiente

**Vista:** Lista de pedidos programados para mañana

**Información:**

- Número de pedido (clickeable)
- Dirección del cliente
- Vehículo asignado (si tiene)
- Peso total (kg)

**Agrupación:** 4 columnas: Sin asignar + Reparto 1 + Reparto 2 + Reparto 3

### 3.4 Alertas de Stock Bajo

**Vista:** Panel compacto (máximo 5 productos)

**Información:**

- Nombre del producto
- Stock actual
- Stock mínimo configurado

**Indicadores de criticidad:**

- 🔴 Crítico: stock actual ≤ 50% del mínimo
- 🟡 Advertencia: stock actual entre 50% y 100% del mínimo

**Click:** Ir a Productos (abre modal Ajustar Stock)

### 3.5 Ciudades a Visitar Mañana

**Vista:** Widget con lista de ciudades con pedidos programados para mañana

**Información por ciudad:**

- Nombre de la ciudad
- Cantidad de pedidos
- Total kg a entregar

**Ordenamiento:** Por cantidad de pedidos (descendente)

**Click:** Botón "Ver repartos" → navega a repartos-dia.html

## 4. Reglas de Negocio

### 4.1 Buscador global

| Categoría | Campos de búsqueda | Resultado mostrado |
|-----------|--------------------|--------------------|
| Clientes | Dirección, teléfono | Dirección \| Teléfono \| Saldo |
| Productos | Nombre | Nombre \| Precio L1 \| Stock |
| Pedidos | Número, dirección | Pedido # \| Cliente \| Fecha \| Total |

### 4.2 Calendario

- Solo muestra días laborales (L-V)
- Cantidad pedidos: COUNT de pedidos REPARTO no entregados para ese día
- Total kg: SUM del peso de todos los productos en esos pedidos

### 4.3 Alertas stock

- Incluye solo productos con `disponible = true`
- Criterio: `stock_actual < stock_minimo`
- Ordenado por criticidad (más críticos primero)
