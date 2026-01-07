# ESTADO-VENTAS.md - Auditoría Módulo Ventas

**Fecha**: 06 Enero 2026
**Última actualización**: 07 Enero 2026 (Exportar Hoja de Reparto)
**Prototipo**: `prototipos/ventas.html`
**PRD**: `prd/ventas.html` (versión limpia: 340 líneas, secciones 1-10)
**JavaScript**: `prototipos/assets/ventas/script.js`

---

## Resumen Cuantitativo

| Estado | Cantidad | % |
|--------|----------|---|
| ✅ Implementadas (HTML + JS) | 98 | 92.5% |
| ⚠️ Visuales sin lógica | 3 | 2.8% |
| ❌ Faltantes | 5 | 4.7% |

**Total funcionalidades**: 106 (desglose en detalle abajo)

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

---

## VISUALES SIN LÓGICA (Prioridad Alta)

### ~~1. Sistema de Selección Bulk (Checkboxes)~~ ✅ IMPLEMENTADO (07/01/2026)
- Mejorado con botón "Eliminar" en bulk

### ~~2. Modal Registro de Pago Completo~~ ✅ IMPLEMENTADO 07/01/2026
- Selector método de pago (Efectivo/Digital/Mixto)
- Campos `montoEfectivo` y `montoDigital` para pago mixto
- Validación: suma debe igualar total del pedido
- Guardado en `pedido.metodoPago`, `pedido.montoEfectivo`, `pedido.montoDigital`
- Sincronización con BambuState
- Icono dual 💵💳 en tabla con tooltip desglose

### 3. Exportar Excel con Selección de Columnas
- **PRD**: Sección 9.1 - Exportar Excel
- **HTML**: ✅ Botón existe
- **JS Falta**:
  - Modal selección de columnas (15 opciones)
  - Checkboxes con obligatorias (# Pedido, Fecha)
  - localStorage para recordar selección
  - Generación Excel
- **Complejidad**: Alta

### 4. Edición Post-Entrega con Auditoría
- **PRD**: Sección 7 - Edición Post-Entrega
- **HTML**: ✅ Modal editar existe
- **JS Falta**:
  - Permitir editar pedidos "entregado"
  - Generar ajuste en cuenta corriente
  - **Historial de cambios** (usuario, fecha, campo, valor anterior/nuevo, IP)
- **Complejidad**: Alta

### ~~5. Cambiar Estado Manualmente (Entregado → En Tránsito)~~ ✅ IMPLEMENTADO (07/01/2026)

### ~~6. Cambiar Tipo Pedido (REPARTO ↔ FÁBRICA)~~ ✅ IMPLEMENTADO (07/01/2026)
- Badge de tipo en modal detalle (FÁBRICA/REPARTO)
- Botón "Cambiar Tipo" en footer del modal
- Validación: solo pedidos en tránsito
- Si REPARTO→FÁBRICA: desasigna vehículo
- Actualización en BambuState + re-render automático

### ~~7. Control de Reparto desde Vista Lista~~ ✅ IMPLEMENTADO (07/01/2026)

### 3. Reasignación de Vehículos desde VENTAS
- **PRD**: Sección 8.3 - Click en día
- **HTML**: ❌ No existe panel/modal
- **JS Falta**:
  - Modal "Repartos del día"
  - Vista por vehículo
  - Botón [Mover a...▼] y [Desasignar]
- **Complejidad**: Alta

### ~~4. Paginación Borradores~~ ✅ YA IMPLEMENTADO (funciona si >12 borradores)

### ~~5. Eliminar Pedido con Reintegro Stock~~ ✅ IMPLEMENTADO (07/01/2026)

### ~~11. Agregar Producto a Pedido en Edición~~ ✅ IMPLEMENTADO 07/01/2026
   - Modal "Agregar Producto" con buscador
   - Lista productos disponibles (excluye sin stock y ya agregados)
   - Click en producto lo agrega con cantidad 1
   - Funciones: abrirModalAgregarProducto(), renderizarProductosDisponibles(), filtrarProductosModal(), agregarProductoAlPedido()
   - Re-render automático de tabla y totales

### ~~5. Navegación Calendario (Semana Anterior/Siguiente)~~ ✅ IMPLEMENTADO (07/01/2026)

### ~~5. Exportar Hoja de Reparto~~ ✅ IMPLEMENTADO 07/01/2026
- Botón "Hoja de Reparto" en navegación del calendario
- Modal selección formato: Con precios / Sin precios
- Función `exportarHojaReparto()` que agrupa pedidos por vehículo
- Mock de exportación (alert con resumen formateado)
- Validación: requiere día seleccionado en calendario

### ~~6. Buscar Pedido (Campo búsqueda)~~ ✅ IMPLEMENTADO (07/01/2026)

---

## FALTANTES (Ni HTML ni JS)

### ~~1. Integración con Cuenta Corriente~~ ✅ IMPLEMENTADO (07/01/2026)
- **PRD**: Sección 6.4 - Sincronización bidireccional
- **Implementado**:
  - ✅ Generar cargo en CC al confirmar pedido (`confirmarEntregado()`)
  - ✅ Movimientos compartidos via `BambuState.movimientos_cc`
  - ✅ Pagos registrados desde CC aparecen sincronizados
- **Pendiente para producción**: Ajuste CC al editar pedido

### 2. Sistema de Auditoría (Historial de Cambios)
- **PRD**: Sección 10 - Auditoría y Trazabilidad (OBLIGATORIO)
- **Requiere**:
  - Tabla `pedidos_historial`
  - Registrar: usuario, fecha, campo, valor anterior/nuevo, IP, razón
  - Vista cronológica en modal
  - Exportar auditoría a Excel
- **Complejidad**: Alta

### 3. Pagos Parciales y Pagos Asociados vs Genéricos
- **PRD**: Sección 6.2 y 6.3 - Pagos parciales y tipos
- **Requiere**:
  - Campo `monto_pagado`
  - Permitir monto < total
  - Distinguir pago asociado vs genérico
  - Múltiples pagos parciales
- **Complejidad**: Alta

### ~~4. Pedidos Sin Cliente (Ventas Casuales)~~ ✅ IMPLEMENTADO 07/01/2026
- Cliente especial "SIN REGISTRO" (id: 0) en state-manager.js
- Solo modo FÁBRICA permitido
- Pago obligatorio (validación en confirmarEntregado)
- NO genera cargo en Cuenta Corriente
- Mensaje diferenciado en notificación

### ~~5. Método de Pago Mixto con Validación~~ ✅ IMPLEMENTADO 07/01/2026
- Selector método de pago en modal "Marcar como Entregado"
- Campos `montoEfectivo` y `montoDigital` para pago mixto
- Validación JS: suma debe igualar total del pedido
- Icono dual 💵💳 con tooltip mostrando desglose de montos
- Guardado en `pedido.metodoPago`, `pedido.montoEfectivo`, `pedido.montoDigital`
- Sincronización con BambuState

### 6. Control de Stock en Edición
- **PRD**: Sección 7.2 - Impacto automático
- **Requiere**:
  - Reintegrar/descontar stock automáticamente
  - Validar stock disponible
  - Advertencias si insuficiente
- **Complejidad**: Alta

### 7. Reordenamiento de Pedidos en Vehículo
- **PRD**: Sección 8.2 - Reordenamiento de pedidos (ruta de entrega)
- **Requiere**:
  - Drag & drop para reordenar
  - Campo `orden_visita`
  - Exportar con orden correcto
- **Complejidad**: Alta

### 8. Modo Fábrica: Registro de Pago en Cotizador
- **PRD**: Sección 2.2 - Flujo de datos
- **Requiere**:
  - Modificar Cotizador con sección pago opcional
  - Checkboxes Efectivo/Digital/Ambos
  - Sincronización automática
- **Complejidad**: Alta

### 9. Vista Detalle Día Completa
- **PRD**: Sección 8.3 y 8.4 - Click en día y Flujo de pedido REPARTO
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
