# ESTADO-VENTAS.md - Auditoría Módulo Ventas

**Fecha**: 06 Enero 2026
**Prototipo**: `prototipos/ventas.html`
**PRD**: `prd/ventas.html`
**JavaScript**: `prototipos/assets/ventas/script.js`

---

## Resumen Cuantitativo

| Estado | Cantidad | % |
|--------|----------|---|
| ✅ Implementadas (HTML + JS) | 38 | 61% |
| ⚠️ Visuales sin lógica | 14 | 23% |
| ❌ Faltantes | 10 | 16% |

**Total funcionalidades identificadas en PRD**: 62

---

## IMPLEMENTADAS (HTML + JS Funcional)

### Vista General y Navegación
1. Header con filtros integrados compactos
2. Filtro por Estado (Todos/En tránsito/Entregado)
3. Filtro por Período (Fecha desde-hasta)
4. Filtro por Tipo (Todos/Fábrica/Reparto)
5. Filtro por Vehículo (Todos/Sin asignar/R1/R2/R3)
6. Filtro por Método de Pago (Todos/Efectivo/Digital/Mixto/Sin registrar)
7. Botón limpiar filtros
8. Sistema de paginación (12 pedidos/página)

### Vista Calendario Semana
9. Calendario semanal (L-V) - Grid de 6 tarjetas
10. Tarjeta día con capacidades (pedidos/kg usados vs totales)
11. Tarjeta Fábrica especial con badge "Semanal"
12. Highlight día actual (HOY)
13. Selección de día (click)
14. Capacidades de vehículos por día
15. Indicadores de color por ocupación (<50% verde, 50-80% naranja, >80% rojo)
16. Botones "Ver detalle" por día
17. Botones "Ver pedidos" por día
18. Botón Fábrica "Ver pedidos"
19. Navegación semana (Anterior/Hoy/Siguiente) - botones presentes

### Sistema de Estados de Días
20. Badge "Planificado" (días futuros)
21. Badge "HOY" (día actual)
22. Badge "Controlado" (días pasados controlados)
23. Badge/Botón "Controlar" (días pasados sin control)
24. Borde lateral días sin control (naranja)
25. Borde lateral días controlados (verde)
26. Datos de pago "XXX" para días no controlados
27. Datos de pago reales para días controlados

### Vista Lista Pedidos
28. Tabla de pedidos completa (11 columnas)
29. Renderizado dinámico desde `appState.pedidosFiltrados`
30. Badges de tipo (Fábrica/Reparto)
31. Badges de estado (En tránsito/Entregado)
32. Iconos de pago
33. Link a cliente con hover
34. Fila de totales (tfoot) dinámica
35. Contador de resultados

### Vista Borradores
36. Tabla de borradores
37. Renderizado dinámico desde `BORRADORES_MOCK`
38. Acciones: Editar, Confirmar, Eliminar

### Stats Panel Compacto
39. Panel estadísticas inline horizontal
40. Total pedidos (contador)
41. Monto total (suma con $)
42. Peso total (suma con kg)
43. Breakdown Fábrica
44. Breakdown Reparto

### View Switcher
45. Tabs de vistas (Calendario/Lista/Borradores)
46. Vista por defecto: Calendario
47. Reordenamiento correcto (Calendario primero)

### Sistema de Filtrado
48. Función `aplicarFiltros()`
49. Función `render()`
50. Event listeners en filtros
51. Persistencia estado filtros en `appState.filtros`

### Modales
52. Modal Marcar como Entregado con info pedido
53. Info panel Cuenta Corriente
54. Botón "Ir a Cuenta Corriente"
55. Modal Editar Pedido - Layout dual (70/30)
56. Tabla productos editable
57. Campos totales calculados
58. Botón eliminar producto
59. Modal Ver Detalle Pedido - Layout dual
60. Info cliente completa
61. Panel financiero lateral
62. Método de pago display
63. Estado de pago calculado

### Funciones Auxiliares
64. `formatearMonto()`, `formatearFechaEntrega()`
65. `renderBadgeTipo()`, `renderBadgeEstado()`
66. `renderIconoPago()`, `renderAcciones()`

### Sistema Mock Data
67. `generateMockPedidos()` - 60 pedidos
68. `BORRADORES_MOCK` - 5 borradores
69. `VEHICULOS_POR_DIA` - Capacidades
70. `DIAS_CALENDARIO` - Estados de control

### Funciones de Control de Días
71. `calcularEstadoDia()`
72. `calcularPagosDia()`
73. `marcarDiaControlado()`
74. `marcarDiaControladoDesdeLista()`

---

## VISUALES SIN LÓGICA (Prioridad Alta)

### 1. Sistema de Selección Bulk (Checkboxes)
- **PRD**: Sección 3.8.3
- **HTML**: ✅ Existe header checkbox + checkboxes por fila
- **JS Falta**: Integración con modal de registro de pago en bulk
- **Complejidad**: Media

### 2. Modal Registro de Pago Completo
- **PRD**: Sección 3.8.7
- **HTML**: ✅ Modal "Marcar como Entregado" existe
- **JS Falta**:
  - Input Efectivo/Digital/Mixto
  - Si Mixto: inputs `montoEfectivo` y `montoDigital`
  - Validación: suma debe igualar total
- **Nota**: Comentado "Los pagos ahora se registran solo desde CC"
- **Complejidad**: Media

### 3. Exportar Excel con Selección de Columnas
- **PRD**: Sección 3.8.10
- **HTML**: ✅ Botón existe
- **JS Falta**:
  - Modal selección de columnas (15 opciones)
  - Checkboxes con obligatorias (# Pedido, Fecha)
  - localStorage para recordar selección
  - Generación Excel
- **Complejidad**: Alta

### 4. Edición Post-Entrega con Auditoría
- **PRD**: Sección 3.8.5
- **HTML**: ✅ Modal editar existe
- **JS Falta**:
  - Permitir editar pedidos "entregado"
  - Generar ajuste en cuenta corriente
  - **Historial de cambios** (usuario, fecha, campo, valor anterior/nuevo, IP)
- **Complejidad**: Alta

### 5. Cambiar Estado Manualmente (Entregado → En Tránsito)
- **PRD**: Sección 3.8.8
- **HTML**: ✅ Botón "Volver a En Tránsito" existe
- **JS Falta**: Función para cambiar estado inverso
- **Complejidad**: Baja

### 6. Cambiar Tipo Pedido (REPARTO ↔ FÁBRICA)
- **PRD**: Sección 3.8.5
- **HTML**: ❌ No existe botón
- **JS Falta**:
  - Botón [🔄 Cambiar tipo] en modal detalle
  - Modal confirmación con efectos
  - Lógica bidireccional
- **Complejidad**: Alta

### 7. Control de Reparto desde Vista Lista
- **PRD**: Sección 3.8.8.1
- **HTML**: ✅ Badge estado día existe
- **JS Falta**:
  - Botón "Marcar día como controlado" clickeable
  - Validación pedidos en tránsito
  - Actualizar badge calendario
- **Complejidad**: Media

### 8. Reasignación de Vehículos desde VENTAS
- **PRD**: Sección 3.8.8.1
- **HTML**: ❌ No existe panel/modal
- **JS Falta**:
  - Modal "Repartos del día"
  - Vista por vehículo
  - Botón [Mover a...▼] y [Desasignar]
- **Complejidad**: Alta

### 9. Paginación Borradores
- **PRD**: Sección 3.8.3
- **HTML**: ✅ Contenedor existe vacío
- **JS Falta**: Renderizar botones paginación
- **Complejidad**: Baja

### 10. Eliminar Pedido con Reintegro Stock
- **PRD**: Sección 3.8.4
- **HTML**: ✅ Botón existe
- **JS Falta**:
  - Confirmación con advertencia
  - Reintegrar productos al stock
  - Ajuste en CC si tiene pago
- **Complejidad**: Media

### 11. Agregar Producto a Pedido en Edición
- **PRD**: Sección 3.8.5
- **HTML**: ✅ Botón existe
- **JS Falta**:
  - Modal selección de producto
  - Buscador de productos
  - Integración catálogo
- **Complejidad**: Alta

### 12. Navegación Calendario (Semana Anterior/Siguiente)
- **PRD**: Sección 7.6
- **HTML**: ✅ Botones existen
- **JS Falta**:
  - Función cambiar semana
  - Actualizar fechas y header
  - Recalcular datos mock
- **Complejidad**: Media

### 13. Exportar Hoja de Reparto
- **PRD**: Sección 3.8.11
- **HTML**: ❌ No existe botón
- **JS Falta**:
  - Modal selección: CON/SIN precios
  - Generar documento Word/Excel
- **Complejidad**: Alta

### 14. Buscar Pedido (Campo búsqueda)
- **PRD**: No especificado pero útil
- **HTML**: ❌ No existe
- **JS Falta**: Input búsqueda + filtro tiempo real
- **Complejidad**: Baja

---

## FALTANTES (Ni HTML ni JS)

### 1. Integración con Cuenta Corriente
- **PRD**: Secciones 3.8.6, 3.8.7
- **Requiere**:
  - Generar cargo en CC al confirmar pedido
  - Generar ajuste en CC al editar pedido
  - Registrar pago en CC desde Ventas
  - Consultar saldo cliente
  - Validar pagos: suma ≤ total pedido
- **Complejidad**: Alta

### 2. Sistema de Auditoría (Historial de Cambios)
- **PRD**: Sección 3.8.4 (OBLIGATORIO)
- **Requiere**:
  - Tabla `pedidos_historial`
  - Registrar: usuario, fecha, campo, valor anterior/nuevo, IP, razón
  - Vista cronológica en modal
  - Exportar auditoría a Excel
- **Complejidad**: Alta

### 3. Pagos Parciales y Pagos Asociados vs Genéricos
- **PRD**: Secciones 3.8.7.1, 3.8.7.2
- **Requiere**:
  - Campo `monto_pagado`
  - Permitir monto < total
  - Distinguir pago asociado vs genérico
  - Múltiples pagos parciales
- **Complejidad**: Alta

### 4. Pedidos Sin Cliente (Ventas Casuales)
- **PRD**: Sección 3.8.7.3
- **Requiere**:
  - Cliente especial "Sin registro"
  - Pago obligatorio en modo FÁBRICA
  - NO genera cargo en CC
- **Complejidad**: Media

### 5. Método de Pago Mixto con Validación
- **PRD**: Sección 3.8.7
- **Requiere**:
  - Campos `monto_efectivo` y `monto_digital`
  - Validación JS: suma = total
  - Icono dual 💵💳
- **Complejidad**: Media

### 6. Control de Stock en Edición
- **PRD**: Sección 3.8.5
- **Requiere**:
  - Reintegrar/descontar stock automáticamente
  - Validar stock disponible
  - Advertencias si insuficiente
- **Complejidad**: Alta

### 7. Reordenamiento de Pedidos en Vehículo
- **PRD**: Sección 3.8.11
- **Requiere**:
  - Drag & drop para reordenar
  - Campo `orden_visita`
  - Exportar con orden correcto
- **Complejidad**: Alta

### 8. Modo Fábrica: Registro de Pago en Cotizador
- **PRD**: Sección 4 - Flujo 6.1
- **Requiere**:
  - Modificar Cotizador con sección pago opcional
  - Checkboxes Efectivo/Digital/Ambos
  - Sincronización automática
- **Complejidad**: Alta

### 9. Estadísticas Avanzadas
- **PRD**: Sección 3.8.9
- **Requiere**:
  - Breakdown por vehículo/ciudad
  - Gráficos Chart.js
- **Complejidad**: Media

### 10. Vista Detalle Día Completa
- **PRD**: Sección 3.8.11
- **Requiere**:
  - Página `repartos-dia.html` completa
  - 3 vistas agrupación
  - Drag & drop
- **Complejidad**: Alta

---

## Notas Técnicas

### Archivos Analizados
- **HTML**: 867 líneas
- **JavaScript**: 1999 líneas
- **CSS**: 2036 líneas
- **PRD**: >2000 líneas

### Calidad del Código
- ✅ Comentarios exhaustivos en JS
- ✅ Estructura modular
- ✅ Mock data realista (60 pedidos, 5 borradores)
- ✅ Sistema de estados consistente
- ⚠️ Falta manejo de errores en async
- ⚠️ Sin validaciones de formularios complejas

### Dependencias Externas Necesarias
- Módulo Cuenta Corriente
- Módulo Productos (stock)
- Módulo Clientes (saldo)
- Módulo Configuración (vehículos)
- Backend API
- Librería Excel (SheetJS recomendado)

---

**Próxima revisión**: Post implementación de gaps
