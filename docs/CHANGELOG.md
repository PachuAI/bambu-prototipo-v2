# CHANGELOG - Bambu CRM V2 Prototipo

## [06 Enero 2026] - Módulo Productos y Stock ✅

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
- **Skill `/construir-prototipo`**: FASE 0 (leer PRD obligatorio) + checklist comentarios

### Navegación
Link a `productos.html` agregado en sidebar de todos los prototipos.

---

## Historial Resumido

### 06 Enero 2026
- Modal Nuevo Cliente en `clientes.html`
- Headers estandarizados (padding 10px 24px) en todos los módulos
- Limpieza docs obsoletos + CLAUDE.md rediseñado
- Compactación modales + header unificado cliente-detalle

### 03-04 Enero 2026
- Sistema de diseño: `tokens.css` + `components.css`
- Auditoría CSS completa (100% cobertura)
- Skill `/construir-prototipo` creado

### 31 Diciembre 2025
- Refactorización PRDs modular (10 PRDs específicos)
- Corrección error conceptual: Repartos integrado en Ventas
- Ajustes visuales Ventas + documentación ESTADO-VENTAS.md

### 30 Diciembre 2025
- Reunión Carlos: 18 ajustes solicitados (implementados en PRD)

### Octubre 2024
- V1 Producción lanzada: https://gestion.quimicabambu.com.ar
