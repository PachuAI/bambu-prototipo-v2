# TODO - Bambu CRM V2 Prototipo

**Última actualización**: 06 Enero 2026
**Fase actual**: Prototipado UI

---

## Fases del Proyecto

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1. Prototipado UI | Construir HTML/CSS de todos los módulos | **EN CURSO** |
| 2. Auditoría PRD | Comparar prototipos vs PRDs, identificar gaps | Pendiente |
| 3. Mock Logic | Implementar lógica JS simulada para validar UX | Pendiente |

---

## Fase 1: Prototipado UI

### Matriz de Avance por Módulo

| # | Módulo PRD | Archivo PRD | Prototipo | Estado | Notas |
|---|------------|-------------|-----------|--------|-------|
| 3.1 | Dashboard | `prd/dashboard.html` | `dashboard.html` | ✅ Completo | Buscador global, calendario, alertas |
| 3.2 | Cotizador | `prd/cotizador-especificacion.html` | `cotizador.html` | ✅ Completo | Switch FÁBRICA/REPARTO |
| 3.3 | Clientes | `prd/clientes.html` + `prd/cuenta-corriente.html` | `clientes.html` + `cliente-detalle.html` | ✅ Completo | CRUD + Modal editar + Cuenta Corriente |
| 3.4 | Productos y Stock | `prd/productos.html` | `productos.html` | ✅ Completo | CRUD, stock, promociones |
| 3.5 | Ventas | `prd/ventas.html` | `ventas.html` + `repartos-dia.html` | ✅ Completo | Lista + Calendario integrado |
| 3.6 | Reportes y Estadísticas | `prd/estadisticas.html` | `estadisticas.html` | ✅ Completo | Filtros, tabla, gráfico, exportar |
| 3.7 | Configuración | `prd/configuracion.html` | `configuracion.html` | ✅ Completo | CRUD vehículos, ciudades, listas, stock |
| 3.8 | Respaldos | `prd/backup.html` | `backup.html` | ✅ Completo | Crear/restaurar backup, logs auditoría |

**Progreso**: 8/8 módulos (100%) ✅

---

## Deuda Técnica: CSS Pendiente

**Contexto:** Se priorizó completar todos los HTML pendientes antes de pulir estilos. Los siguientes prototipos necesitan ajustes CSS:

### `configuracion.html`
- [ ] Revisar espaciados y consistencia visual
- [ ] Ajustar estilos de formularios
- [ ] Verificar responsive

### `backup.html`
- [ ] Revisar espaciados y consistencia visual
- [ ] Ajustar tabla de logs
- [ ] Verificar responsive

### Sidebar - Menú lateral
- [ ] Item "Repartos" comentado (evaluar si descomentar)
- [ ] Verificar consistencia de navegación

---

## Fase 2: Auditoría PRD (Pendiente)

Usar skill `/analizar-estado-modulo` para cada módulo:
- [ ] Dashboard
- [ ] Cotizador
- [ ] Clientes + Cliente Detalle
- [ ] Productos
- [ ] Ventas + Repartos
- [ ] Estadísticas
- [ ] Configuración
- [ ] Backup

**Output**: Documento `ESTADO-{MODULO}.md` por cada uno

---

## Fase 3: Mock Logic (Pendiente)

Implementar lógica JS para simular flujos críticos:
- [ ] Cotizador: calcular totales, descuentos, confirmar pedido
- [ ] Clientes: CRUD completo con persistencia localStorage
- [ ] Cuenta Corriente: cargos/pagos actualizan saldo
- [ ] Productos: drag & drop orden, toggle disponible
- [ ] Ventas: filtros, cambio estado, registro pago
- [ ] Calendario: asignar pedidos a vehículos

---

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 06/01/2026 | Item "Repartos" comentado en sidebar (9 archivos) - pendiente evaluar |
| 06/01/2026 | Agregada sección "Deuda Técnica CSS" al TODO |
| 06/01/2026 | **Nuevo prototipo: backup.html** (2 tabs: Backups, Logs auditoría) |
| 06/01/2026 | Agregado mock data: BACKUPS, LOGS_SISTEMA |
| 06/01/2026 | Links sidebar: Configuración y Respaldos en todos los prototipos |
| 06/01/2026 | **Nuevo prototipo: configuracion.html** (4 tabs: Vehículos, Ciudades, Precios, Stock) |
| 06/01/2026 | Agregado mock data: CONFIG_PRECIOS, CONFIG_STOCK, CIUDADES |
| 06/01/2026 | Simplificado VEHICULOS según PRD (solo nombre + capacidad) |
| 06/01/2026 | Reestructuración TODO, matriz de avance |
| 06/01/2026 | Agregado botón Editar en clientes.html |
| 06/01/2026 | Corregido estilos inputs en cliente-detalle.html |
| 05/01/2026 | Migración CSS a tokens.css + components.css |
| 05/01/2026 | Modal Nuevo Cliente en clientes.html |

---

## Referencias

- **PRDs**: `prd/index.html` (fuente de verdad)
- **Skills**: `/construir-prototipo`, `/analizar-estado-modulo`
- **Docs**: `ARQUITECTURA-PROTOTIPOS.md`, `FLUJOS-NEGOCIO.md`
