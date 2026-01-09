# PRD: Vista Detalle Día (Repartos)

> **Fuente**: `prd/repartos-dia.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Vista Detalle Día (Repartos)

| | |
|---|---|
| **Versión** | 1.0 (Enero 2026) |
| **Prototipo** | [prototipos/repartos-dia.html](../prototipos/repartos-dia.html) |
| **Relacionado** | [PRD Ventas](ventas.md) (sección 8) |
| **Estado** | ✅ Prototipo validado (100%) |

**Relación con Ventas:** Esta vista es accesible desde el Calendario Semana en el módulo Ventas. NO es un módulo independiente, pero su complejidad justifica documentación separada.

## 1. Contexto y Propósito

### 1.1 Descripción

Vista detallada de un día específico de reparto. Permite gestionar la asignación de pedidos a vehículos, visualizar capacidad de carga, y organizar la logística de entrega.

### 1.2 Problema que resuelve

- Visualizar todos los pedidos REPARTO de un día específico
- Asignar pedidos a vehículos según capacidad disponible
- Evitar sobrecarga de vehículos
- Generar hoja de reparto para choferes
- Reorganizar pedidos entre vehículos

### 1.3 Usuarios objetivo

- **Administrador:** Planifica asignaciones y exporta hojas de reparto
- **Chofer:** Consulta su hoja de reparto del día

## 2. Acceso a la Vista

### 2.1 Desde Calendario Semana (Ventas)

Click en cualquier día del calendario abre esta vista con la fecha seleccionada.

### 2.2 URL directa

Parámetro `?fecha=YYYY-MM-DD`

- Ejemplo: `repartos-dia.html?fecha=2026-01-08`
- Si no hay parámetro, usa fecha del sistema

### 2.3 Botón Volver

Regresa a `ventas.html` (módulo padre).

## 3. Header y Navegación

### 3.1 Navegación de fecha

| Elemento | Comportamiento |
|----------|----------------|
| Flecha izquierda (<) | Día anterior (dentro de la semana laboral) |
| Título fecha | Formato: "Mié, 08 Ene 2026" |
| Flecha derecha (>) | Día siguiente (dentro de la semana laboral) |

**Límite:** Navegación restringida a días de la semana actual (Lunes a Viernes).

### 3.2 Estadísticas globales

Chips informativos que muestran totales del día:

- **Pedidos:** Cantidad total (asignados + sin asignar)
- **Monto:** Suma total en formato compacto ($4.1M)
- **Peso:** Kilogramos totales a entregar

### 3.3 Acciones del header

- **Exportar:** Genera hoja de reparto imprimible
- **Volver:** Regresa a Ventas

## 4. Vistas (Tabs)

### 4.1 Tab: Por Vehículo (default)

Agrupa pedidos según el vehículo asignado. Vista principal para gestión de carga.

### 4.2 Tab: Por Ciudad

Agrupa pedidos según la ciudad de entrega. Útil para planificar rutas geográficas.

- Solo muestra pedidos YA asignados a vehículos
- Incluye badge indicando qué vehículo tiene cada pedido

## 5. Cards de Vehículos

### 5.1 Información mostrada

| Campo | Descripción |
|-------|-------------|
| Badge | Identificador corto (REPARTO 1, REPARTO 2, REPARTO 3) |
| Modelo | Modelo del vehículo (Mercedes-Benz Sprinter, Toyota Hiace) |
| Barra capacidad | Visual de carga actual vs máxima |
| Porcentaje | % de capacidad utilizada |
| Estado | Badge según nivel de carga |
| Stats | Cantidad pedidos y peso total asignado |

### 5.2 Estados de capacidad

| Estado | Rango | Color |
|--------|-------|-------|
| ÓPTIMA | 0% - 69% | Verde |
| ALTA | 70% - 84% | Naranja |
| CASI LLENO | 85% - 100% | Rojo/Rosa |

### 5.3 Tabla de pedidos (colapsable)

Cada vehículo tiene tabla expandible con sus pedidos asignados.

**Columnas:**

- # Pedido (número identificador)
- Dirección (destino de entrega)
- Ciudad
- Teléfono (del cliente)
- Peso (kg)
- Monto ($)
- Acciones (Cambiar, Desasignar)

## 6. Sección Sin Asignar

### 6.1 Cuándo aparece

Solo visible si existen pedidos del día sin vehículo asignado.

### 6.2 Información mostrada

- Badge "PENDIENTE" (color naranja/rojo)
- Cantidad de pedidos sin asignar
- Peso total pendiente de asignación

### 6.3 Tabla de pedidos

Mismas columnas que vehículos, pero acción es "Asignar" en lugar de "Cambiar/Desasignar".

### 6.4 Objetivo

Esta sección debe quedar VACÍA antes de iniciar el día de reparto. Todos los pedidos deben estar asignados a un vehículo.

## 7. Modal de Asignación

### 7.1 Cuándo se abre

- Click en "Asignar" desde pedido sin asignar
- Click en "Cambiar" desde pedido ya asignado

### 7.2 Información del pedido

Card superior muestra:

- Número de pedido
- Dirección + Ciudad
- Fecha de entrega
- Peso del pedido (badge)

### 7.3 Selector de vehículos

Lista todos los vehículos disponibles con:

- Nombre y modelo del vehículo
- Capacidad actual (kg usados / kg máximos)
- **Preview:** "Con este pedido: X kg / Y kg (Z%)"
- Barra de progreso proyectada (con colores según nivel)

### 7.4 Colores del preview

| Color | Significado |
|-------|-------------|
| Verde | Carga resultante < 70% |
| Naranja | Carga resultante 70-84% |
| Rojo | Carga resultante ≥ 85% |

### 7.5 Flujo de asignación

1. Usuario selecciona vehículo (click en card)
2. Card queda resaltado como seleccionado
3. Botón "Asignar Vehículo" se habilita
4. Click en confirmar → pedido se mueve al vehículo
5. Vista se actualiza automáticamente

### 7.6 Nota informativa

El modal muestra mensaje: "Se asignará el vehículo seleccionado al reparto programado para [fecha]"

## 8. Acciones sobre Pedidos

### 8.1 Asignar (desde Sin Asignar)

- Abre modal de asignación
- Mueve pedido de "Sin Asignar" al vehículo seleccionado
- Recalcula capacidad del vehículo destino

### 8.2 Cambiar (desde vehículo asignado)

- Abre modal de asignación
- Permite reasignar a otro vehículo
- Recalcula capacidad de ambos vehículos (origen y destino)

### 8.3 Desasignar (botón X)

- Mueve pedido de vuelta a "Sin Asignar"
- Recalcula capacidad del vehículo origen
- NO requiere confirmación (acción reversible)

### 8.4 Recálculo automático

Tras cualquier acción, el sistema automáticamente:

1. Recalcula peso total del vehículo
2. Recalcula porcentaje de capacidad
3. Actualiza estado (ÓPTIMA/ALTA/CASI LLENO)
4. Actualiza estadísticas del header
5. Re-renderiza ambas vistas (Por Vehículo y Por Ciudad)

## 9. Exportar Hoja de Reparto

### 9.1 Funcionalidad

Genera documento imprimible con todos los pedidos del día organizados por vehículo.

### 9.2 Contenido del documento

- **Header:** "QUÍMICA BAMBU S.R.L. - Hoja de Reparto" + fecha
- **Estadísticas:** Total pedidos, peso total, monto total
- **Por vehículo:** Nombre, stats, tabla de pedidos
- **Footer:** Fecha/hora de generación

### 9.3 Columnas por pedido

- # (orden de entrega)
- Dirección
- Ciudad
- Teléfono
- Peso
- Monto

### 9.4 Flujo de exportación

1. Click en botón "Exportar"
2. Se abre nueva ventana con documento formateado
3. Automáticamente abre diálogo de impresión del navegador
4. Usuario puede imprimir o "Guardar como PDF"

### 9.5 Consideraciones

- Solo incluye pedidos ASIGNADOS a vehículos
- Pedidos "Sin Asignar" NO aparecen en la hoja
- Formato optimizado para impresión (page-break entre vehículos)

## 10. Features Avanzadas

### 10.1 Drag & Drop ✅ IMPLEMENTADO

Arrastrar pedidos directamente entre secciones:

- Desde "Sin Asignar" hacia un vehículo
- Feedback visual durante arrastre (zonas resaltadas)
- Icono de grip para indicar arrastrabilidad
- **Estado:** Implementado (07 Enero 2026)

### 10.2 Optimización automática por ciudad ✅ IMPLEMENTADO

Botón "Auto-asignar" que sugiere asignación óptima:

- Agrupa pedidos sin asignar por ciudad
- Busca vehículo con más capacidad disponible
- Muestra preview de capacidad resultante
- Permite aplicar sugerencias individual o todas juntas
- **Estado:** Implementado (07 Enero 2026)

### 10.3 Reordenamiento de ruta (Futuro)

Dentro de cada vehículo, reordenar pedidos para optimizar ruta de entrega.

- **Estado:** No implementado
- **Prioridad:** Media
