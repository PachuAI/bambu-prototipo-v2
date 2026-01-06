# Bambu CRM V2 - Documentación

**Última actualización**: 06 Enero 2026

---

## Estado del Proyecto

**Fase**: Prototipado y especificación
**Sistema CSS**: ✅ Migración completada (tokens.css + components.css + dark mode)

---

## Prototipos Implementados

| Prototipo | Estado | Descripción |
|-----------|--------|-------------|
| `dashboard.html` | ✅ | Buscador global, calendario, alertas stock |
| `cotizador.html` | ✅ | Crear pedidos, modos REPARTO/FÁBRICA |
| `ventas.html` | ✅ | Lista pedidos, borradores, calendario semana |
| `clientes.html` | ✅ | Listado clientes con filtros |
| `cliente-detalle.html` | ✅ | Detalle + Cuenta Corriente (tab integrada) |
| `repartos-dia.html` | ✅ | Vista día, asignación vehículos |

---

## Prototipos Pendientes

| Prototipo | PRD | Descripción |
|-----------|-----|-------------|
| `productos.html` | `prd/productos.html` | CRUD productos, stock, alertas |
| `estadisticas.html` | `prd/estadisticas.html` | Ventas por producto |
| `configuracion.html` | `prd/configuracion.html` | Vehículos, ciudades, listas |
| `backup.html` | `prd/backup.html` | Respaldos y logs |

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

- `/construir-prototipo` - Guía para construir nuevos prototipos HTML

---

## Links

- **Producción V1**: https://gestion.quimicabambu.com.ar
- **PRDs**: `/prd/index.html`
- **Prototipos**: `/prototipos/index.html`
