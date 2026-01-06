# Bambu CRM V2 - Documentación

**Última actualización**: 06 Enero 2026

---

## Estado del Proyecto

**Fase actual**: Auditoría PRD (Fase 2)
**Fase anterior**: ✅ Prototipado UI completado (8/8 módulos)
**Sistema CSS**: ✅ Migrado (tokens.css + components.css + dark mode)

---

## Prototipos Implementados (11 archivos)

| Prototipo | PRD | Descripción |
|-----------|-----|-------------|
| `dashboard.html` | `prd/dashboard.html` | Buscador global, calendario, alertas stock |
| `cotizador.html` | `prd/cotizador-especificacion.html` | Crear pedidos REPARTO/FÁBRICA |
| `ventas.html` | `prd/ventas.html` | Lista pedidos, borradores, calendario semana |
| `repartos-dia.html` | (parte de ventas) | Vista día, asignación vehículos |
| `clientes.html` | `prd/clientes.html` | Listado clientes con filtros |
| `cliente-detalle.html` | `prd/cuenta-corriente.html` | Detalle + Cuenta Corriente (tabs) |
| `productos.html` | `prd/productos.html` | CRUD productos, stock, promociones |
| `estadisticas.html` | `prd/estadisticas.html` | Ventas por producto, gráficos, exportar |
| `configuracion.html` | `prd/configuracion.html` | Vehículos, ciudades, listas precio, stock |
| `backup.html` | `prd/backup.html` | Crear/restaurar backups, logs auditoría |

---

## Arquitectura CSS

```
prototipos/
├── shared/
│   ├── tokens.css          # Variables CSS (colores, espaciado, tipografía)
│   ├── components.css      # Componentes genéricos reutilizables
│   └── utils.js            # Funciones helper + dark mode
│
└── assets/{modulo}/
    └── {modulo}-specific.css  # Estilos específicos del módulo
```

---

## Documentación Disponible

| Archivo | Contenido |
|---------|-----------|
| `CHANGELOG.md` | Registro de cambios por sesión |
| `TODO.md` | Tareas pendientes |
| `ARQUITECTURA-PROTOTIPOS.md` | Estructura de módulos y prototipos |
| `FLUJOS-NEGOCIO.md` | Lógica de pedidos, estados, pagos |

---

## Skills Disponibles

- `/construir-prototipo` - Construir nuevos prototipos HTML (7 fases)
- `/analizar-estado-modulo` - Auditar prototipo vs PRD, genera ESTADO-{MODULO}.md
- `/migrar-css-tokens` - Migrar CSS antiguo al sistema tokens.css

---

## Links

- **Producción V1**: https://gestion.quimicabambu.com.ar
- **PRDs**: `/prd/index.html`
- **Prototipos**: `/prototipos/index.html`
