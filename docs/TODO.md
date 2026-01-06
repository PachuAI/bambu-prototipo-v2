# TODO - Bambu CRM V2 Prototipo

**Última actualización**: 06 Enero 2026
**Fase actual**: Auditoría PRD

---

## Fases del Proyecto

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1. Prototipado UI | Construir HTML/CSS de todos los módulos | ✅ Completada |
| 2. Auditoría PRD | Comparar prototipos vs PRDs, identificar gaps | **EN CURSO** |
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

## Fase 2: Auditoría PRD (EN CURSO)

### Objetivo
Comparar cada prototipo HTML contra su PRD para identificar:
- **Implementado**: Funcionalidad visible y con lógica
- **Visual sin lógica**: UI existe pero falta JS
- **Faltante**: No prototipado aún

### Checklist por Módulo

| # | Módulo | PRD | Prototipo | Auditoría | Estado |
|---|--------|-----|-----------|-----------|--------|
| 1 | Dashboard | `prd/dashboard.html` | `dashboard.html` | - | ⏸️ En trabajo (otra instancia) |
| 2 | Cotizador | `prd/cotizador-especificacion.html` | `cotizador.html` | ESTADO-COTIZADOR.md | ⬜ Pendiente |
| 3 | Ventas | `prd/ventas.html` | `ventas.html` + `repartos-dia.html` | ESTADO-VENTAS.md | ⬜ Pendiente |
| 4 | Clientes | `prd/clientes.html` | `clientes.html` | ESTADO-CLIENTES.md | ⬜ Pendiente |
| 5 | Cliente Detalle | `prd/cuenta-corriente.html` | `cliente-detalle.html` | ESTADO-CUENTA-CORRIENTE.md | ⬜ Pendiente |
| 6 | Productos | `prd/productos.html` | `productos.html` | ESTADO-PRODUCTOS.md | ⬜ Pendiente |
| 7 | Estadísticas | `prd/estadisticas.html` | `estadisticas.html` | ESTADO-ESTADISTICAS.md | ⬜ Pendiente |
| 8 | Configuración | `prd/configuracion.html` | `configuracion.html` | ESTADO-CONFIGURACION.md | ⬜ Pendiente |
| 9 | Backup | `prd/backup.html` | `backup.html` | ESTADO-BACKUP.md | ⬜ Pendiente |

### Método
Usar skill `/analizar-estado-modulo` para generar documento de estado por módulo

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

## Referencias

- **PRDs**: `prd/index.html` (fuente de verdad)
- **Skills**: `/construir-prototipo`, `/analizar-estado-modulo`, `/migrar-css-tokens`
- **Docs**: `CHANGELOG.md`, `ARQUITECTURA-PROTOTIPOS.md`, `FLUJOS-NEGOCIO.md`
