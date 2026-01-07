# Bambu CRM V2 - Prototipos

Prototipos HTML/CSS/JS vanilla para validar UX antes del desarrollo Laravel.

---

## Estado del Proyecto

| Métrica | Valor |
|---------|-------|
| **Fase** | Prototipo completo - Listo para migración |
| **Módulos** | 9 módulos, 332 funcionalidades |
| **Implementación** | 100% |
| **Sistema CSS** | tokens.css + components.css + dark mode |
| **Estado compartido** | BambuState (state-manager.js) |

---

## Módulos Implementados

| Módulo | Funcionalidades | Descripción |
|--------|-----------------|-------------|
| Dashboard | 23 | Buscador global, calendario, alertas stock |
| Cotizador | 48 | Crear pedidos FÁBRICA/REPARTO |
| Ventas | 107 | Gestión completa de pedidos |
| Repartos Día | 35 | Asignación vehículos, drag & drop |
| Clientes | 36 | CRUD + Cuenta Corriente integrada |
| Productos | 30 | Stock, precios, promociones |
| Estadísticas | 16 | Reportes con Chart.js |
| Configuración | 20 | Vehículos, ciudades, listas precio |
| Backup/Logs | 17 | Respaldos y auditoría |

---

## Documentación

### Principal
| Archivo | Contenido |
|---------|-----------|
| `../CLAUDE.md` | Instrucciones para Claude Code |
| `ESTADO-GENERAL.md` | Vista consolidada de todos los módulos |
| `FLUJOS-NEGOCIO.md` | Lógica de pedidos, estados, pagos |
| `CHANGELOG.md` | Historial de cambios por sesión |

### Auditorías por Módulo
| Archivo | Módulo |
|---------|--------|
| `ESTADO-DASHBOARD.md` | Dashboard |
| `ESTADO-COTIZADOR.md` | Cotizador |
| `ESTADO-VENTAS.md` | Ventas |
| `ESTADO-REPARTOS-DIA.md` | Repartos Día |
| `ESTADO-CLIENTES.md` | Clientes |
| `ESTADO-PRODUCTOS.md` | Productos |
| `ESTADO-ESTADISTICAS.md` | Estadísticas |
| `ESTADO-CONFIGURACION.md` | Configuración |
| `ESTADO-BACKUP.md` | Backup y Logs |

### Archivados
| Archivo | Razón |
|---------|-------|
| `archive/PLAN-STATE-MANAGER.md` | Plan completado (7/7 fases) |
| `archive/AUDITORIA-MOCK-DATA-2026-01-07.md` | Auditoría puntual concluida |

---

## Links Rápidos

- **PRDs**: `prd/index.html`
- **Prototipos**: `prototipos/index.html`
- **V1 Producción**: https://gestion.quimicabambu.com.ar

---

## Stack Técnico (Prototipo)

```
HTML5 + CSS3 + JavaScript Vanilla
├── shared/tokens.css      → Variables CSS (colores, espaciado)
├── shared/components.css  → Componentes reutilizables
├── shared/mock-data.js    → Datos de prueba centralizados
├── shared/state-manager.js→ Estado compartido (BambuState)
└── shared/utils.js        → Helpers (formatCurrency, dark mode)
```

## Stack Final (Producción)

```
Laravel + Livewire + PostgreSQL
├── React/Inertia (islas interactivas: Cotizador)
├── Spatie Laravel Backup
├── SheetJS (exportar Excel)
└── Chart.js (gráficos)
```

---

**Última actualización**: 07 Enero 2026
