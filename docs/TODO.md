# TODO - Bambu CRM V2 Prototipo

**Última actualización**: 07 Enero 2026
**Fase actual**: Mock Logic - Interactividad (Fase 3.2)

---

## Fases del Proyecto

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1. Prototipado UI | Construir HTML/CSS de todos los módulos | ✅ Completada |
| 2. Auditoría PRD | Comparar prototipos vs PRDs, identificar gaps | ✅ Completada |
| 3.1 State Manager | Sistema de datos centralizado | ✅ Completada |
| 3.2 Mock Logic | Implementar lógica JS interactiva | **EN CURSO** |

---

## Fase 3.1: State Manager - ✅ COMPLETADA

**Plan**: `docs/PLAN-STATE-MANAGER.md`

| Sub-fase | Descripción | Estado |
|----------|-------------|--------|
| 0 | Crear state-manager.js base | ✅ |
| 1-2 | Estructuras normalizadas + generador | ✅ |
| 3 | Persistencia localStorage | ✅ |
| 4 | Migrar Dashboard | ✅ |
| 5 | Migrar Clientes + ?id= | ✅ |
| 6 | Migrar Ventas | ✅ |
| 7 | Migrar Repartos-día | ✅ |

**Resultado**: ~830 líneas de mock eliminadas, datos consistentes en 4 módulos.

---

## Fase 3.2: Mock Logic - Interactividad (PRÓXIMOS PASOS)

Implementar lógica JS para flujos críticos de UX.

### Prioridad Alta (core business)
| Tarea | Módulo | Descripción |
|-------|--------|-------------|
| [ ] Cotizador funcional | `cotizador.html` | Calcular totales, descuentos L1/L2/L3, confirmar pedido |
| [ ] CRUD Clientes | `clientes.html` | Crear/editar/eliminar con persistencia |
| [ ] Cuenta Corriente | `cliente-detalle.html` | Cargos/pagos actualizan saldo |
| [ ] Cambio estado pedido | `ventas.html` | Marcar entregado, registrar pago |

### Prioridad Media
| Tarea | Módulo | Descripción |
|-------|--------|-------------|
| [ ] Asignar vehículo | `repartos-dia.html` | Modal asignar funcional |
| [ ] CRUD Productos | `productos.html` | Crear/editar, toggle disponible |
| [ ] Filtros funcionales | `ventas.html` | Filtrar por estado/fecha/tipo real |

### Prioridad Baja
| Tarea | Módulo | Descripción |
|-------|--------|-------------|
| [ ] Drag & drop productos | `productos.html` | Reordenar lista |
| [ ] Exportar Excel mock | `estadisticas.html` | Generar CSV/descarga |
| [ ] Reset datos | `configuracion.html` | Botón para BambuState.reset() |

### Cómo Retomar

Si retomás después de `/clear`:
1. Leer este archivo para ver próximos pasos
2. `git log --oneline -5` para contexto reciente
3. Elegir tarea de "Prioridad Alta" y empezar

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

## Fase 2: Auditoría PRD (✅ COMPLETADA)

### Objetivo
Comparar cada prototipo HTML contra su PRD para identificar:
- **Implementado**: Funcionalidad visible y con lógica
- **Visual sin lógica**: UI existe pero falta JS
- **Faltante**: No prototipado aún

### Checklist por Módulo

| # | Módulo | PRD | Prototipo | Auditoría | Estado |
|---|--------|-----|-----------|-----------|--------|
| 1 | Configuración | `prd/configuracion.html` | `configuracion.html` | `ESTADO-CONFIGURACION.md` | ✅ Completado |
| 2 | Cotizador | `prd/cotizador-especificacion.html` | `cotizador.html` | `ESTADO-COTIZADOR.md` | ✅ Completado |
| 3 | Productos | `prd/productos.html` | `productos.html` | `ESTADO-PRODUCTOS.md` | ✅ Completado |
| 4 | Ventas | `prd/ventas.html` | `ventas.html` | `ESTADO-VENTAS.md` | ✅ Completado |
| 5 | Dashboard | `prd/dashboard.html` | `dashboard.html` | `ESTADO-DASHBOARD.md` | ✅ Completado |
| 6 | Clientes | `prd/clientes.html` | `clientes.html` | `ESTADO-CLIENTES.md` | ✅ Completado |
| 7 | Cliente Detalle | `prd/cuenta-corriente.html` | `cliente-detalle.html` | `ESTADO-CLIENTES.md` | ✅ Completado |
| 8 | Estadísticas | `prd/estadisticas.html` | `estadisticas.html` | `ESTADO-ESTADISTICAS.md` | ✅ Completado |
| 9 | Backup | `prd/backup.html` | `backup.html` | `ESTADO-BACKUP.md` | ✅ Completado |
| 10 | Repartos Día | (parte de ventas) | `repartos-dia.html` | `ESTADO-REPARTOS-DIA.md` | ✅ Completado |

**Progreso**: 10/10 módulos auditados (100%) 🎉

### Método
Usar skill `/analizar-estado-modulo` para generar documento de estado por módulo

### Nota importante (06 Enero 2026)
Los PRDs fueron limpiados masivamente (~11,000 → ~1,240 líneas). Los documentos ESTADO-*.md fueron actualizados para reflejar las nuevas referencias de sección.

---

## Referencias

- **PRDs**: `prd/index.html` (fuente de verdad)
- **Skills**: `/construir-prototipo`, `/analizar-estado-modulo`, `/migrar-css-tokens`
- **Docs**: `CHANGELOG.md`, `ARQUITECTURA-PROTOTIPOS.md`, `FLUJOS-NEGOCIO.md`
