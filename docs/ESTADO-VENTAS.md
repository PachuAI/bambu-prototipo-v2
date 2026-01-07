# ESTADO-VENTAS.md - Auditoría Módulo Ventas

**Fecha**: 06 Enero 2026
**Última actualización**: 07 Enero 2026 (Edición Post-Entrega + Ajustes CC PRD 7.2, 10.1)
**Prototipo**: `prototipos/ventas.html`
**PRD**: `prd/ventas.html` (versión limpia: 340 líneas, secciones 1-10)
**JavaScript**: `prototipos/assets/ventas/script.js`

---

## Resumen Cuantitativo

| Estado | Cantidad | % |
|--------|----------|---|
| ✅ Implementadas (HTML + JS) | 107 | 100% |
| ⚠️ Visuales sin lógica | 0 | 0.0% |
| ❌ Faltantes | 0 | 0.0% |

**Total funcionalidades**: 107 (desglose en detalle abajo)

**Nota**: El PRD limpio (Enero 2026) simplificó la documentación a 10 secciones funcionales.

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
39. **Editar borrador** - Redirige a cotizador.html?editar={id} (Sprint 4 Cotizador)

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

### Cambio de Estado Inverso (Sprint 07/01/2026)
67. Botón "Volver a En Tránsito" con onclick
68. Función `volverAEnTransito()` con validación y confirmación
69. Actualización en BambuState

### Buscador de Pedidos (Sprint 07/01/2026)
70. Input búsqueda en header filtros
71. Función `buscarPedido()` con filtrado tiempo real
72. Búsqueda en número, cliente, dirección, ciudad

### Navegación Calendario (Sprint 07/01/2026)
73. Botones Anterior/Hoy/Siguiente funcionales
74. Función `navegarSemana()` con offset
75. Función `renderizarCalendario()` dinámico
76. Actualización de título y tarjetas de días

### Eliminar Pedido (Sprint 07/01/2026)
77. Función `eliminarPedido()` con confirmación
78. Reintegro de stock (mock) si entregado
79. Generación nota de crédito en CC

### Control Reparto Lista (Sprint 07/01/2026)
80. Actualización de calendario al marcar controlado

### Sistema Bulk Mejorado (Sprint 07/01/2026)
81. Botón "Eliminar" en barra bulk actions
82. Función `eliminarSeleccionados()` con reintegro

### Pedidos Sin Cliente - Ventas Casuales (Sprint 07/01/2026)
83. Cliente especial "SIN REGISTRO" (id: 0) en state-manager.js
84. Validación: Solo modo FÁBRICA permitido para ventas casuales
85. Pago obligatorio (validación en confirmarEntregado)
86. NO genera cargo en Cuenta Corriente
87. Mensaje diferenciado en notificación

### Sistema Mock Data
88. `generateMockPedidos()` - 60 pedidos
89. `BORRADORES_MOCK` - 5 borradores
90. `VEHICULOS_POR_DIA` - Capacidades
91. `DIAS_CALENDARIO` - Estados de control

### Funciones de Control de Días
92. `calcularEstadoDia()`
93. `calcularPagosDia()`
94. `marcarDiaControlado()`
95. `marcarDiaControladoDesdeLista()`

### Cambiar Tipo Pedido (Sprint 07/01/2026)
96. ~~**Cambiar Tipo Pedido (REPARTO ↔ FÁBRICA)**~~ ✅ IMPLEMENTADO Sprint 2
   - Badge "FÁBRICA/REPARTO" en modal detalle
   - Botón "Cambiar Tipo" en footer del modal
   - Función `cambiarTipoPedido()` con validación
   - Solo permite cambio en pedidos "En tránsito"
   - Si REPARTO→FÁBRICA: desasigna vehículo automáticamente
   - Confirmación con mensaje contextual según dirección del cambio
   - Actualización en BambuState y re-render automático

### Exportar Hoja de Reparto (Sprint 07/01/2026)
97. ~~**Exportar Hoja de Reparto**~~ ✅ IMPLEMENTADO 07/01/2026
   - Botón "Hoja de Reparto" en navegación del calendario
   - Modal selección formato: Con precios / Sin precios
   - Función `exportarHojaReparto()` agrupa pedidos por vehículo
   - Mock de exportación con resumen formateado
   - Validación: requiere día seleccionado en calendario

### Exportar Excel con Selección de Columnas (Sprint 07/01/2026)
98. ~~**Exportar Excel**~~ ✅ IMPLEMENTADO 07/01/2026
   - Modal selección de columnas (2 obligatorias + 13 opcionales)
   - Columnas obligatorias: # Pedido, Fecha entrega (deshabilitadas)
   - Columnas opcionales: Cliente, Dirección, Teléfono, Tipo, Vehículo, Repartidor, Productos, Subtotal, Descuentos, Ajustes, Total, Método pago, Estado
   - Botón "Seleccionar todas" toggle
   - localStorage para recordar preferencias del usuario
   - Generación Excel mock con preview de datos exportados
   - Funciones: abrirModalExportarExcel(), exportarExcel(), cargarPreferenciasColumnas(), guardarPreferenciasColumnas()

### Sistema de Auditoría (Sprint 07/01/2026)
99. ~~**Sistema de Auditoría (PRD 10.1)**~~ ✅ IMPLEMENTADO 07/01/2026
   - Timeline de historial de cambios en modal detalle
   - Función renderizarHistorialCambios() en script.js
   - Pedido #999 con 4 cambios de prueba para demostración
   - Estilos CSS para timeline (horizontal/vertical según layout)
   - Registro de: usuario, fecha, campo, valor anterior/nuevo

### Pagos Parciales (Sprint 07/01/2026)
100. ~~**Pagos Parciales (PRD 6.2, 6.3)**~~ ✅ IMPLEMENTADO 07/01/2026
   - Lista de pagos registrados en modal detalle
   - Botón "Registrar Pago" si hay saldo pendiente
   - Modal para registrar pagos adicionales
   - Función validarSumaMixto() permite montos < total
   - Función confirmarEntregado() guarda monto_pagado y array pagos[]
   - Pedido #998 con pago parcial de prueba ($50k de $80k)
   - Cálculo automático de saldo pendiente

### Reasignación de Vehículos (vive en repartos-dia.html)
101. ~~**Reasignación de Vehículos (PRD 8.3)**~~ ✅ IMPLEMENTADO
   - **Ubicación**: `prototipos/repartos-dia.html` (acceso desde calendario ventas → "Ver detalle")
   - Vista por vehículo con pedidos asignados
   - Vista por ciudad
   - Modal asignar vehículo
   - Botón "Cambiar" para reasignar a otro vehículo
   - Botón "Desasignar" para quitar asignación
   - Drag & drop para asignar arrastrando
   - Sistema "Auto-asignar" con sugerencias por ciudad
   - Exportar hoja de reparto
   - Navegación entre días de la semana
   - **Conexión**: `ventas.html` → botón "Ver detalle" → `repartos-dia.html?fecha={fecha}`

### Control de Stock en Edición (Sprint 07/01/2026)
102. ~~**Control de Stock en Edición (PRD 7.2)**~~ ✅ IMPLEMENTADO 07/01/2026
   - **state-manager.js**: Nuevos métodos `getStock()`, `verificarStock()`, `actualizarStock()`, `ajustarStockPorEdicion()`
   - **ventas/script.js**: Variables `productosOriginales[]`, `estadoPedidoEditando`
   - Al editar pedido ENTREGADO, compara items originales vs nuevos
   - Calcula delta por producto (original - nuevo)
   - Si delta < 0 (agregó): valida stock disponible antes de guardar
   - Si delta > 0 (quitó): reintegra stock automáticamente
   - Mensaje de advertencia si stock insuficiente (lista productos faltantes)
   - Validación en tiempo real al agregar productos (`agregarProductoAlPedido()`)
   - Validación en tiempo real al aumentar cantidad (`actualizarCantidad()`)
   - Historial de movimientos de stock (`_registrarMovimientoStock()`)
   - Método `getMovimientosStock()` para consultar historial

### Edición Post-Entrega con Auditoría (Sprint 07/01/2026)
103. ~~**Edición Post-Entrega con Auditoría (PRD 7, 10.1)**~~ ✅ IMPLEMENTADO 07/01/2026
   - **state-manager.js v1.2.0**: Nuevos métodos `registrarAjusteCC()`, `registrarCambioPedido()`
   - **ventas/script.js**: Modificado `guardarEdicion()` para registrar auditoría
   - Al editar pedido ENTREGADO con cambio de total:
     - Genera movimiento de ajuste en Cuenta Corriente (cargo si aumentó, abono si disminuyó)
     - Registra cambio en `historial_cambios[]` del pedido
   - Historial incluye: usuario, fecha, campo, valor anterior/nuevo, razón, IP
   - Sincronización automática con appState para visualización en modal detalle
   - Notificación incluye "CC ajustada" cuando aplica

---

## VISUALES SIN LÓGICA (Prioridad Alta)

**Actualmente: 0 items** (Todos los visuales pendientes han sido completados)


---

## FALTANTES (Ni HTML ni JS)

**Actualmente: 0 items** - ¡Módulo 100% completo!

### ~~1. Integración con Cuenta Corriente~~ ✅ IMPLEMENTADO (07/01/2026)
- **PRD**: Sección 6.4 - Sincronización bidireccional
- **Implementado**:
  - ✅ Generar cargo en CC al confirmar pedido (`confirmarEntregado()`)
  - ✅ Movimientos compartidos via `BambuState.movimientos_cc`
  - ✅ Pagos registrados desde CC aparecen sincronizados
- ✅ **Completado**: Ajuste CC al editar pedido (07/01/2026)

### ~~1. Edición Post-Entrega con Auditoría~~ ✅ IMPLEMENTADO (07/01/2026)
- **PRD**: Sección 7 - Edición Post-Entrega
- **Implementado**:
  - ✅ Editar pedidos en estado "Entregado" (ya permitido)
  - ✅ Generar ajuste en Cuenta Corriente (`BambuState.registrarAjusteCC()`)
  - ✅ Historial de cambios automático (`BambuState.registrarCambioPedido()`)
  - ✅ Registro: usuario, fecha, campo, valor anterior/nuevo, IP, razón
  - ✅ Sincronización historial con appState para visualización
  - ✅ Notificación "CC ajustada" al guardar edición
- **Archivos modificados**: state-manager.js, ventas/script.js

### ~~2. Control de Stock en Edición~~ ✅ IMPLEMENTADO (07/01/2026)
- **PRD**: Sección 7.2 - Impacto automático
- **Implementado**:
  - ✅ Reintegrar/descontar stock automáticamente al editar
  - ✅ Validar stock disponible antes de agregar/aumentar
  - ✅ Advertencias si stock insuficiente
  - ✅ Historial de movimientos de stock
- **Archivos modificados**: state-manager.js, ventas/script.js

### ~~3. Modo Fábrica: Registro de Pago en Cotizador~~ ✅ IMPLEMENTADO (07/01/2026)
- **PRD**: Sección 2.2 - Flujo de datos
- **Implementado**:
  - ✅ Tag "Requerido" en lugar de "Opcional" cuando modo FÁBRICA
  - ✅ Validación: no permite confirmar sin método de pago seleccionado
  - ✅ Guarda metodo_pago y monto_pagado en el pedido
  - ✅ CSS para tag .required-tag
- **Archivos modificados**: cotizador/script.js, cotizador-specific.css

### ~~4. Reordenamiento de Pedidos en Vehículo (REPARTOS-DÍA)~~ ✅ IMPLEMENTADO (07/01/2026)
- **PRD**: Sección 8.2 - Reordenamiento de pedidos (ruta de entrega)
- **Implementado**:
  - ✅ Drag & drop para reordenar pedidos dentro de vehículo
  - ✅ Campo `orden_visita` actualizado al reordenar
  - ✅ Columna "Orden" con badges #1, #2, #3...
  - ✅ Hoja de reparto exportada respeta orden
  - ✅ CSS para indicadores de drop (arriba/abajo)
- **Archivos modificados**: repartos/script.js, repartos-specific.css

---

## Notas Técnicas

### Archivos Analizados
- **HTML**: 867 líneas
- **JavaScript**: 1999 líneas
- **CSS**: 2036 líneas
- **PRD**: 340 líneas (versión limpia Enero 2026, secciones 1-10)

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

**Verificado contra PRD versión limpia (Enero 2026)**
