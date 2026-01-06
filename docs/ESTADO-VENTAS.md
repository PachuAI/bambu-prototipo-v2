# Estado Implementación - Módulo Ventas

## 📋 ¿Qué es este documento?

Este documento refleja el **estado actual de implementación del prototipo Ventas** comparado contra su PRD oficial.

**Identifica 3 tipos de gaps:**

1. **✅ Implementadas** - Funcionalidades 100% completas (HTML + CSS + JavaScript funcional)
2. **⚠️ Visuales sin lógica** - Elementos HTML/CSS listos, pero falta JavaScript para funcionar
3. **❌ Faltantes** - Funcionalidades sin HTML ni JavaScript (TODO por hacer)

**Propósito:** Saber exactamente qué falta implementar para que el prototipo esté al día con el PRD y sea presentable a Carlos.

---

**Fecha**: 31 Diciembre 2024
**Archivos verificados**:
- `prototipos/ventas.html`
- `prototipos/assets/ventas/script.js`
- `prd/ventas.html` (líneas 552-2400+)

**Verificación:** Revisión exhaustiva línea por línea del PRD. Ninguna funcionalidad inventada.

---

## ✅ IMPLEMENTADAS (HTML + JS funcional) - 50 funcionalidades

### Filtros (5)
1. Filtro por Estado (Todos/En Tránsito/Entregado)
2. Filtro por Período (fecha desde-hasta)
3. Filtro por Tipo (Todos/Fábrica/Reparto)
4. Filtro por Vehículo (Todos/Sin asignar/Reparto 1/2/3)
5. Filtro por Método pago (Todos/Efectivo/Digital/Mixto/Sin registrar)

### Visualización (10)
6. Tabla con todas las columnas (# Pedido, Fecha, Cliente, Teléfono, Tipo, Estado, Vehículo, Total, Pago, Acciones)
7. Fila TOTAL con suma de montos
8. Columna "Fecha" en Borradores (no "Fecha de Creación")
9. Ordenamiento por fecha descendente
10. Paginación completa
11. Contador resultados dinámico
12. Checkboxes selección múltiple
13. Estadísticas panel (pedidos, monto, peso)
14. Badges visuales (estado, tipo, vehículo, pago)
15. Links a cliente-detalle

### Vistas (3)
16. Vista Calendario Semana (con tarjetas días + fábrica)
17. Vista Lista Pedidos
18. Vista Borradores

### Calendario (5)
19. Selección de día (muestra capacidades vehículos)
20. Ver detalle día (redirige a repartos-dia.html)
21. Filtrar lista por día
22. Ver ventas fábrica (filtro semana)
23. Capacidades vehículos por día

### Modales - Marcar Entregado (5)
24. Abrir modal
25. Mostrar datos pedido
26. Confirmar entregado (cambia estado)
27. Ir a Cuenta Corriente
28. Cerrar modal (X, fuera, ESC)

### Modales - Ver Detalle (6)
29. Abrir modal detalle
30. Renderizar productos
31. Mostrar totales (subtotal, descuentos, total, peso)
32. Mostrar método de pago
33. Info entrega (si está entregado)
34. Abrir editar desde detalle

### Modales - Editar Pedido (6)
35. Abrir modal editar
36. Renderizar productos editables
37. Editar cantidad con recálculo
38. Eliminar producto
39. Recalcular totales y diferencia
40. Guardar edición

### Borradores (4)
41. Renderizar borradores con datos mock
42. Paginación borradores
43. Confirmar borrador (mueve a EN TRÁNSITO)
44. Eliminar borrador con confirmación

### Sistema General (6)
45. Inicialización app (60 pedidos + 5 borradores)
46. Switch entre vistas (Calendario/Lista/Borradores)
47. Sidebar auto-collapse
48. Notificaciones toast
49. Formateo montos ($12.345)
50. Bulk actions: Marcar seleccionados como Entregado

---

## ⚠️ VISUALES SIN LÓGICA (HTML existe, falta JS) - 7 funcionalidades

### Alta prioridad

#### 1. **Exportar Excel**
- **PRD**: Sección 3.8.1 "Exportar reportes"
- **Ubicación**: Header filtros (línea 126)
- **HTML**: Botón existe
- **JS falta**: `exportarExcel()` - generar archivo con pedidos filtrados
- **Complejidad**: Media

#### 2. **Eliminar pedido**
- **PRD**: Sección 3.8.4 "Acciones disponibles" (línea 718)
- **Ubicación**: Tabla acciones, botón 🗑️
- **HTML**: Botón existe
- **JS falta**: `eliminarPedido(pedidoId)` con confirmación + reintegro stock
- **Complejidad**: Baja

#### 3. **Volver a En Tránsito**
- **PRD**: Sección 3.8.4 "Cambiar estado" (línea 716)
- **Ubicación**: Tabla acciones, botón ↩️
- **HTML**: Botón existe
- **JS falta**: `revertirAEnTransito(pedidoId)` - limpiar fechaEntrega y metodoPago
- **Complejidad**: Baja

#### 4. **Navegación calendario (Anterior/Siguiente/Hoy)**
- **PRD**: Implícito en vista calendario
- **Ubicación**: Calendario header (líneas 286-288)
- **HTML**: Botones existen
- **JS falta**: `navegarSemanaAnterior()`, `navegarSemanaSiguiente()`, `irAHoy()`
- **Complejidad**: Media

#### 5. **Agregar producto (modal editar)**
- **PRD**: Sección 3.8.5 "Casos de uso" - sumar productos (línea 729)
- **Ubicación**: Modal editar, botón "Agregar producto" (línea 572)
- **HTML**: Botón existe
- **JS**: `abrirModalAgregarProducto()` muestra alert (línea 1870)
- **Complejidad**: Alta

### Media prioridad

#### 6. **Editar borrador (abrir cotizador)**
- **PRD**: Implícito en flujo borradores
- **Ubicación**: Vista Borradores, botón ✏️
- **HTML**: Botón existe
- **JS**: `editarBorrador()` muestra alert (línea 946)
- **Complejidad**: Media

#### 7. **Estados visuales días calendario (dinámico)**
- **PRD**: Sección 7.11 "Estados de días"
- **Ubicación**: Tarjetas días (líneas 329-517)
- **HTML**: Estructura existe
- **JS**: `calcularEstadoDia()` existe pero no se usa para renderizar
- **Complejidad**: Media

---

## ❌ FALTANTES (Ni HTML ni JS) - 5 funcionalidades

### Alta prioridad

#### 1. **Auditoría/Historial de cambios**
- **PRD**: Sección 3.8.4 "Historial de cambios" (líneas 696-711) - OBLIGATORIO
- **Debe hacer**: Registrar automáticamente todas las modificaciones post-entrega
- **Campos**: Usuario, fecha/hora, campo modificado, valor anterior/nuevo, IP, razón opcional
- **Visualización**: Línea de tiempo cronológica
- **HTML/JS**: No existe UI ni lógica
- **Complejidad**: Alta

#### 2. **Cambiar tipo pedido (REPARTO ↔ FÁBRICA)**
- **PRD**: Sección 3.8.5 h4 "Cambiar tipo de pedido" (líneas 748-794) - NUEVO Dic 2025
- **Debe hacer**: Modal para cambiar tipo con confirmación y efectos automáticos
- **Efectos**: Cambio estado, vehículo, fecha entrega según tipo
- **HTML/JS**: No existe botón ni modal
- **Complejidad**: Media

#### 3. **Notas/Observaciones del pedido**
- **PRD**: Mencionado en secciones 3.8.5 (líneas 422, 443, 693, 853)
- **Debe hacer**: Campo textarea en modal editar/detalle para agregar/editar notas
- **Estado actual**: Modal detalle MUESTRA notas si existen, pero no hay UI para editarlas
- **Complejidad**: Baja

### Media prioridad

#### 4. **Vista agrupada por vehículo**
- **PRD**: Flujo 5 "Propuesta Nueva Arquitectura" (línea 276) - "Agrupar por vehículo"
- **Debe hacer**: Vista alternativa que agrupa pedidos por Reparto 1/2/3/Fábrica
- **Estado actual**: Solo tabla plana
- **Complejidad**: Media

#### 5. **Remito PDF**
- **PRD**: Ajuste Carlos #17 documentado en CHANGELOG
- **Debe hacer**: Botón para generar PDF con datos pedido (sin email)
- **Estado actual**: No existe
- **Complejidad**: Media

---

## 🚫 FUERA DE SCOPE (según PRD)

- **Asignar/cambiar vehículo**: Se hace en módulo REPARTOS (PRD sección 3.8.4)
- **Registro pago directo**: Sistema híbrido VENTAS + CC, ya implementado

---

## 📊 Resumen Cuantitativo

| Categoría | Cantidad | % |
|-----------|----------|---|
| ✅ Implementadas (HTML + JS funcional) | 50 | 81% |
| ⚠️ Visuales sin lógica (HTML OK, falta JS) | 7 | 11% |
| ❌ Faltantes (Ni HTML ni JS) | 5 | 8% |
| **TOTAL** | **62** | **100%** |

**Porcentaje completado funcional**: 81% (50/62)

---

## 🎯 Roadmap Implementación

### Sprint 1 - CRÍTICOS (10h)
**Objetivo**: Dejar prototipo funcionalmente completo
1. Exportar Excel (3h)
2. Eliminar pedido (1h)
3. Volver a En Tránsito (1h)
4. Navegación calendario (2h)
5. Agregar producto (3h)

### Sprint 2 - FALTANTES CRÍTICOS (15h)
**Objetivo**: Implementar funcionalidades core del PRD
1. Cambiar tipo REPARTO ↔ FÁBRICA (4h)
2. Notas/Observaciones editables (2h)
3. Auditoría/Historial de cambios (9h) - más complejo

### Sprint 3 - MEJORAS (8h)
**Objetivo**: Pulir detalles
1. Estados visuales días calendario (3h)
2. Editar borrador (2h)
3. Vista agrupada por vehículo (3h)

### Futuro (Post-prototipo)
- Remito PDF (requiere librería generación PDF)

---

## ✅ VERIFICACIÓN EXHAUSTIVA

Este documento fue verificado línea por línea contra:
- `prd/ventas.html` completo (2400+ líneas)
- `prototipos/ventas.html`
- `prototipos/assets/ventas/script.js`
- Ajustes de Carlos documentados en CHANGELOG

**Todas las funcionalidades listadas están documentadas en el PRD.**
**No se inventó ninguna funcionalidad.**
