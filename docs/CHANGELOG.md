# CHANGELOG - Bambu CRM V2 Prototipo

## [07 Enero 2026] - ✅ State-Manager COMPLETADO (7/7 fases)

### Sistema de Estado Centralizado
**Nuevo archivo**: `prototipos/shared/state-manager.js`

Fuente única de verdad para todos los módulos del prototipo.

**Características**:
- ~80 pedidos generados consistentemente (lun-vie, 15-20/día)
- Datos normalizados: clientes, productos, pedidos, pedido_items, vehículos
- Persistencia localStorage (sobrevive refresh)
- Fecha sistema centralizada: Miércoles 08 Enero 2026
- Cálculos derivados: peso, total, carga vehículos

**Módulos migrados**:
| Módulo | Líneas eliminadas | Mejoras |
|--------|-------------------|---------|
| Dashboard | ~50 | Alertas dinámicas, stats reales |
| Clientes | ~100 | Soporte `?id=` en URL |
| Ventas | ~430 | Calendario enero 2026, items reales |
| Repartos | ~250 | Navegación entre días funcional |

**Total**: ~830 líneas de datos mock hardcodeados eliminadas

**API disponible**:
```javascript
BambuState.init()
BambuState.get('pedidos')
BambuState.getPedidos({ fecha, estado, tipo })
BambuState.calcularPesoPedido(id)
BambuState.calcularCargaVehiculo(vehiculoId, fecha)
```

**Documentación**: `docs/PLAN-STATE-MANAGER.md`

---

## [06 Enero 2026] - ✅ FASE 2 COMPLETADA: Auditoría PRD al 100%

### Fase 2: Auditoría PRD - COMPLETADA
**Estado**: 10/10 módulos auditados (100%) 🎉

**Documentos generados**:
- `ESTADO-CONFIGURACION.md` (12 funcionalidades, 92% implementadas)
- `ESTADO-COTIZADOR.md` (estado completo)
- `ESTADO-PRODUCTOS.md` (estado completo)
- `ESTADO-VENTAS.md` (estado completo)
- `ESTADO-DASHBOARD.md` (21 funcionalidades, 91% implementadas)
- `ESTADO-CLIENTES.md` (estado completo)
- `ESTADO-REPARTOS-DIA.md` (80% completado)
- `ESTADO-ESTADISTICAS.md` (16 funcionalidades, 100% implementadas)
- `ESTADO-BACKUP.md` (17 funcionalidades, 100% implementadas)

**Métricas globales**:
- Total funcionalidades auditadas: ~140+
- Implementación promedio: 95%
- Gaps identificados: documentados por módulo
- Discrepancias PRD vs Prototipo: documentadas

**Hallazgos clave**:
- Estadísticas: Gráfico Chart.js completo (PRD decía "pendiente")
- Backup: Validaciones completas (extensión, tamaño, confirmaciones)
- Dashboard: Widget ciudades mañana no estaba en PRD
- Todos los módulos: Dark mode implementado (no en PRDs)

**Próxima fase**: Mock Logic (Fase 3)
- Cotizador: calcular totales, descuentos
- Clientes: CRUD con localStorage
- Cuenta Corriente: cargos/pagos actualizan saldo
- Productos: drag & drop, toggle disponible
- Ventas: filtros, cambio estado, registro pago

**Archivos actualizados**:
- `TODO.md`: Progreso 10/10 (100%)
- Skill `auditor-modulo`: utilizado exitosamente

---

## [06 Enero 2026] - Módulos Backup + Configuración + UI Tweaks

### Renombramiento global
- **"Reportes" → "Estadísticas"** en todos los sidebars (10 HTMLs) y PRDs
- Estandariza nomenclatura para evitar confusión con "Repartos" y "Respaldos"

### Módulo Estadísticas
- Página ahora es **scrollable** (antes contenido se cortaba)

### Módulo Backup compactado
- Botones acción: padding 12px 20px → 8px 14px
- Card header: 14px 20px → 10px 16px
- Tabla: headers 12px → 8px, celdas 14px → 10px
- Filtros logs: padding 16px → 10px 12px

### Módulo Configuración - Rediseño completo
**Estructura nueva (2 tabs en lugar de 4):**
- Tab "Configuración": Vehículos + Listas de Precio + Stock
- Tab "Ciudades": CRUD ciudades

**Tab Vehículos:**
- Quitada columna "Pedidos Asignados" (dato volátil, inútil)
- Agregadas columnas "Modelo" y "Patente" (opcionales)
- Modal actualizado con campos Modelo/Patente

**Tab Ciudades:**
- Agregada columna "Provincia" (obligatorio)
- Modal actualizado: "Nombre" → "Ciudad" + campo Provincia

**Listas de Precio (antes: form estático, ahora: CRUD):**
- Tabla editable: Lista, Descuento %, Umbral Mínimo
- Modal crear/editar/eliminar listas
- Sin L1 (precio base no configurable)

**Comportamiento Stock (simplificado):**
- De radio buttons grandes a inline compacto
- Auto-guardado al cambiar opción
- Info box compacta con fondo

### Modales compactados (Configuración)
- Border-radius reducido
- Header: 20px 24px → 12px 16px
- Body: 24px → 16px
- Footer: 16px 24px → 12px 16px
- Inputs border-radius reducido

### Mock data actualizado
- `VEHICULOS`: Agregados campos modelo, patente
- `CIUDADES`: Agregado campo provincia
- `LISTAS_PRECIO`: Nuevo array CRUD (reemplaza CONFIG_PRECIOS)

---

## [06 Enero 2026] - Sidebar Persistente + Estadísticas + Limpieza

### Sidebar refactorizado
- **Comportamiento simplificado**: Solo toggle con botón (sin setTimeout, sin hover auto-collapse)
- **Estado persistente**: Guardado en localStorage, persiste entre páginas
- **Sin flash**: Script inline aplica estado antes del renderizado
- **Código centralizado**: Lógica en `utils.js`, eliminada de 9 scripts individuales
- **Badge "NUEVO" eliminado**: Removido de item Ventas en todos los sidebars

### Nuevo prototipo: `estadisticas.html`
- **Filtros**: Período desde-hasta, proveedor, búsqueda producto, toggle "sin ventas"
- **Tabla estadísticas**: Producto, cantidad vendida, monto total, % participación
- **Ordenamiento**: Click en columnas para ordenar asc/desc
- **Modal detalle**: Ver pedidos individuales de cada producto
- **Gráfico Chart.js**: Top 10 productos (toggle cantidad/monto)
- **Exportar Excel**: Genera CSV con datos filtrados
- **Cards resumen**: Productos, unidades, monto total, pedidos en período

### Mock data actualizado (`shared/mock-data.js`)
- `PEDIDOS_PRODUCTOS`: Detalle de productos por pedido (generado dinámicamente)
- Permite calcular estadísticas de ventas por producto

### Archivos creados
| Archivo | Descripción |
|---------|-------------|
| `estadisticas.html` | Layout + filtros + tabla + modal + gráfico |
| `estadisticas-specific.css` | Estilos + dark mode completo |
| `script.js` | Lógica comentada con referencias PRD |

### Sidebar actualizado
- Link "Reportes" funcional en los 10 prototipos existentes

### Progreso proyecto
- **Fase 1 Prototipado UI**: 8/8 módulos (100%) ✅
- Listo para Fase 2: Auditoría PRD

---

## [06 Enero 2026] - Módulo Clientes Compactado + Datos Mock

### Tabla clientes compactada
- Eliminado avatar circular (irrelevante para el negocio)
- Columna "Acciones" alineada a la derecha con sus botones
- Padding reducido ~40% (th: 8px 12px, td: 10px 12px)
- Font-size headers: 11px, contenido: 13px

### Mock data actualizado (`shared/mock-data.js`)
- `CLIENTES`: Expandido de 8 a 12 clientes
- Campos nuevos: ciudad, saldo, estado, lista_precio, email, nota
- Saldos variados: deudores, a favor, al día, inactivos

### Renderizado dinámico
- Clientes se cargan desde mock-data.js al iniciar
- Formato saldo con separador de miles y colores (rojo/verde)
- Badge estado activo/inactivo con estilos diferenciados

---

## [06 Enero 2026] - Módulo Productos y Stock

### Nuevo prototipo: `productos.html`
- CRUD productos completo con validaciones según PRD
- Filtros: búsqueda, proveedor, disponibilidad, promoción, stock bajo
- Persistencia filtros en localStorage
- 4 modales: crear/editar, ajustar stock, exportar, eliminar

### Lógica de negocio implementada (PRD 4.x)
- **Switch precios mutuamente excluyentes** (PRD 4.5): precio base y promocional nunca activos simultáneamente
- **Alerta stock bajo** configurable (default 20 unidades)
- **Validaciones**: nombre único, precio activo > 0, stock obligatorio

### Mock data actualizado (`shared/mock-data.js`)
- `PROVEEDORES`: 4 proveedores
- `PRODUCTOS`: 15 productos con estructura completa (promociones, stock bajo, no disponible)
- `MOVIMIENTOS_STOCK`: 5 movimientos de ejemplo

### Archivos creados
| Archivo | Descripción |
|---------|-------------|
| `productos.html` | Layout + 4 modales |
| `productos-specific.css` | Estilos + dark mode + inputs disabled |
| `script.js` | Lógica comentada con referencias PRD |

### Documentación actualizada
- **CLAUDE.md**: Sección "Regla de Comentarios en JavaScript" + lista prototipos
- **Skill `/construir-prototipo`**: FASE 0 (leer PRD obligatorio) + checklist comentarios JS

---

## [06 Enero 2026] - Modal Nuevo Cliente + Headers Estandarizados ✅

### Modal Nuevo Cliente (`clientes.html`)
- Campos: Dirección*, Teléfono*, Ciudad*, Descuento (L1/L2/L3), Nombre, Email, Nota
- Toggle "Activo" en header del modal
- Validación campos requeridos + dark mode

### Headers estandarizados (padding 10px 24px)
- Clientes: `.header-toolbar-standard`, filtros compactos
- Cliente-detalle: Tabs compactados, título 14px
- Dashboard: Título agregado, buscador compacto

---

## [06 Enero 2026] - Limpieza Docs + CLAUDE.md Rediseñado ✅

### Archivos eliminados (7)
Docs obsoletos de migración CSS completada:
- `PLAN-MIGRACION-TOKENS.md`, `AUDITORIA-*.md`, `CORRECCIONES-*.md`
- `ESTADO-VENTAS.md`, `ESTADO-COTIZADOR.md`, `DISEÑO-VISUAL.md`

### CLAUDE.md actualizado
- Sección "Entorno" (Windows, fecha, stack)
- Comandos PowerShell
- Sistema CSS: tokens.css → components.css → specific.css
- Skill `/construir-prototipo` documentado

---

## [06 Enero 2026] - UX Compactación + Skill Creado ✅

### Header unificado cliente-detalle
- De 2 líneas a 1 línea (nombre + badges + tabs + botón)
- Eliminado: Avatar circular, ID cliente

### Compactación modales
- Modal "Detalle Pedido" (ventas): paddings reducidos ~40%
- Modal "Registrar Pago" (cliente-detalle): sin overflow vertical

### Skill `/construir-prototipo`
- Proceso 7 fases para construir HTML
- Reglas compactación documentadas
- Dark mode desde inicio obligatorio

---

## [04 Enero 2026] - Auditoría CSS + Sistema 100% Cubierto ✅

### Auditoría completa
- 6 prototipos analizados, 389 clases CSS únicas
- 11 clases faltantes identificadas y agregadas
- Cobertura final: **100%** (excluyendo Font Awesome)

### components.css expandido
- 703 → 811 líneas (+108)
- 9 componentes genéricos agregados: `.header-toolbar`, `.page-header-title`, `.badge-status`, etc.

---

## [03 Enero 2026] - Sistema de Diseño ✅

### Tokens CSS + Sistema 3 Colores
**Paleta minimalista:**
- Verde `#36b37e` → Estados completados (ENTREGADO)
- Naranja `#ffab00` → Estados en proceso (PENDIENTE, EN TRÁNSITO)
- Gris `#6b778c` → Todo lo demás

### Archivos creados
- `shared/tokens.css` (248 líneas): Variables colores, tipografía, espaciado
- `shared/components.css` (487 líneas): Sidebar, badges, botones, tablas, modales, forms

---

## [31 Diciembre 2025] - Refactorización PRDs Modular ✅

### PRDs creados (10 total)
1. `index.html` - PRD padre (reducido 46%)
2. `cotizador-especificacion.html` (~1,700 líneas)
3. `ventas.html` (~1,200 líneas)
4. `cuenta-corriente.html` (~500 líneas)
5. `productos.html` (~850 líneas)
6. `clientes.html` (~650 líneas)
7. `configuracion.html` (~700 líneas)
8. `estadisticas.html` (~550 líneas)
9. `dashboard.html` (~700 líneas)
10. `backup.html` (~500 líneas)

### Corrección error conceptual crítico
- ❌ INCORRECTO: "Módulo Repartos separado"
- ✅ CORRECTO: Calendario de Repartos es **vista filtrada DENTRO de Ventas**
- Archivo `prd/repartos.html` eliminado (965 líneas incorrectas)

---

## [31 Diciembre 2025] - Ajustes Visuales Ventas ✅

### Implementados (9)
1. Fila TOTAL en tabla ventas con cálculo suma
2. Columna teléfono agregada
3. Label "Fecha" en borradores (no "Fecha Creación")
4. Vehículos "Reparto 1/2/3"
5. Botón desasignar vehículo
6. SKU eliminado en cotizador
7. Filtro vehículo arreglado
8. Fábrica primero en calendario
9. Suma total calculada dinámicamente

---

## [31 Diciembre 2025] - Estandarización Proyecto ✅

### Estructura reorganizada
- `docs/`, `prd/`, `prototipos/`, `wireframes/`
- Eliminados sufijos `-v2` de todos los archivos
- Archivos obsoletos eliminados

### Mock data centralizado (`shared/mock-data.js`)
- 83 pedidos, 8 clientes, 8 productos, 3 vehículos
- **Campos eliminados**: CUIT, razón_social, nombre, SKU
- **Campos correctos**: dirección (identificador), teléfono, ciudad, lista_precio

---

## [30 Diciembre 2025] - Reunión Carlos (Ciclo 3)

### Ajustes solicitados implementados en PRD (17/17)
1. Fila TOTAL en tabla ventas
2. Columna teléfono en ventas
3. Exportación Excel con selección columnas
4. Label "Fecha" en borradores
5. Cambiar tipo pedido REPARTO ↔ FÁBRICA
6. Control reparto desde módulo VENTAS
7. Pedidos sin asignar ordenados por ciudad
8. Dos botones exportación (con/sin precio)
9. Vehículos: "Reparto X"
10. Productos: orden drag & drop
11. SKU eliminado
12. Descuento cliente: botones L2/L3
13. Descuentos sobre subtotal MENOS promocionales
14. Registro pagos VENTAS + CC sin duplicación
15. Desasignar vehículo
16. Formato descuento más claro (sin L1/L2/L3)
17. Remito PDF formal (eliminar Email)

---

## Histórico

### Diciembre 2025
- 7 bugs V1 producción corregidos
- Feedback inicial módulo Cotizador

### Octubre 2024
- V1 Producción lanzada: https://gestion.quimicabambu.com.ar
- Stack: React 19 + Laravel 12 + PostgreSQL 17
