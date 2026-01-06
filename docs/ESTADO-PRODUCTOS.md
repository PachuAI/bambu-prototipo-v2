# Estado Implementación - Módulo PRODUCTOS

**Fecha**: 06 Enero 2026
**PRD**: `prd/productos.html`
**Prototipo**: `prototipos/productos.html`
**JavaScript**: `prototipos/assets/productos/script.js`

---

## Resumen Cuantitativo

| Categoría | Cantidad | % |
|-----------|----------|---|
| **Implementadas** | 18 | 58% |
| **Visuales sin lógica** | 5 | 16% |
| **Faltantes** | 8 | 26% |
| **TOTAL** | 31 | 100% |

---

## IMPLEMENTADAS (HTML + JS funcional) - 18 funcionalidades

### CRUD Productos
1. **Crear producto** - Modal completo con validaciones
2. **Editar producto** - Carga datos existentes y actualiza
3. **Eliminar producto** - Modal confirmación + lógica eliminación
4. **Validación nombre único** - Verifica duplicados case-insensitive

### Gestión de Precios
5. **Precio base L1** - Input con validación > 0
6. **Cálculo automático L2/L3** - L2 = L1 × 0.9375, L3 = L1 × 0.90
7. **Promociones con precio fijo** - Switch + input precio promocional
8. **Lógica mutuamente excluyente** - Solo un precio activo según switch

### Control de Stock
9. **Stock actual editable** - Permite 0 o negativos
10. **Stock mínimo configurable** - Opcional, default 0
11. **Alerta stock bajo visual** - Badge naranja cuando stock < mínimo
12. **Modal ajustar stock** - INGRESO/AJUSTE con vista previa
13. **Lógica ajuste stock** - Suma/resta según tipo movimiento

### Filtros y Búsqueda
14. **Búsqueda por nombre** - Filtrado en tiempo real con debounce
15. **Filtro por proveedor** - Dropdown con opciones dinámicas
16. **Filtro disponibilidad** - Todos/Disponibles/No disponibles
17. **Filtro promoción** - Checkbox solo promocionales
18. **Filtro stock bajo** - Checkbox con lógica de alertas
19. **Persistencia filtros** - localStorage + carga al iniciar
20. **Limpiar filtros** - Resetea todos los filtros

### Interfaz y Visualización
21. **Tabla productos** - Columnas: orden, nombre, proveedor, precio, stock, peso, estado, acciones
22. **Badge PROMO** - Indicador visual productos en promoción
23. **Toggle disponible** - Switch en modal header
24. **Toast notifications** - Feedback visual acciones

---

## VISUALES SIN LÓGICA (HTML existe, falta JS) - 5 funcionalidades

### 1. Drag & Drop para Reordenar
- **PRD**: Sección 3.4, 4.5
- **HTML**: ✅ Existe handle + estructura
- **CSS**: ✅ Estilos para .drag-handle
- **JS falta**: Implementar drag & drop con SortableJS
- **Complejidad**: Media
- **Impacto**: El orden define aparición en cotizador (PRIORITARIO)

### 2. Modal Exportar Excel - Descarga Real
- **PRD**: Sección 3.8
- **HTML**: ✅ Modal completo
- **JS existente**: Abre modal, filtra productos, muestra preview
- **JS falta**: Generar archivo Excel real con SheetJS
- **Complejidad**: Baja

### 3. Historial de Movimientos de Stock
- **PRD**: Sección 4.7
- **HTML**: ❌ No existe vista
- **JS falta**: Modal/pestaña con tabla de movimientos
- **Datos**: MOVIMIENTOS_STOCK existe en mock-data.js
- **Complejidad**: Media
- **Impacto**: Auditoría de cambios de inventario

### 4. Validación Precio Promocional < Precio L1
- **PRD**: Sección 4.1
- **HTML**: ✅ Input precio promo existe
- **JS actual**: Solo valida > 0
- **JS falta**: Validar que precio_promo < precio_L1
- **Complejidad**: Baja

### 5. Restricción Eliminación si Tiene Pedidos
- **PRD**: Sección 3.7
- **HTML**: ✅ Modal confirmación existe
- **JS falta**: Verificar pedidos asociados antes de eliminar
- **Complejidad**: Baja
- **Impacto**: Integridad de datos históricos

---

## FALTANTES (Ni HTML ni JS) - 8 funcionalidades

### Alta prioridad

1. **Vista Detalle Producto**
   - PRD: Sección 4.7 (implícito)
   - Descripción: Vista con pestañas: Info general, Historial stock, Estadísticas
   - Complejidad: Alta

2. **Alertas Stock Bajo - Dashboard Widget**
   - PRD: Sección 4.6
   - Descripción: Panel en dashboard.html mostrando productos críticos
   - Complejidad: Baja

3. **Panel Stock Negativo**
   - PRD: Sección 4.1, 4.6
   - Descripción: Panel superior si hay productos con stock < 0
   - Complejidad: Baja

### Media prioridad

4. **Campo Proveedor: Gestionar desde Configuración**
   - PRD: Sección 5.3
   - HTML: Dropdown proveedor hardcodeado
   - Falta: CRUD proveedores en módulo Configuración
   - Complejidad: Media

5. **Integración con Cotizador - Orden Productos**
   - PRD: Sección 4.5, 5.1
   - Descripción: Orden drag & drop debe reflejarse en buscador cotizador
   - Complejidad: Baja (integración)

6. **Exportar Inventario - Filtro Múltiple Proveedores**
   - PRD: Sección 3.8
   - HTML: Dropdown simple
   - Falta: Permitir selección múltiple
   - Complejidad: Baja

### Baja prioridad

7. **Promociones con Fecha Inicio/Fin**
   - PRD: No explícito pero útil
   - Descripción: Activar/desactivar promoción automáticamente por fecha
   - Complejidad: Media

8. **Campo Peso - Validación y Unidad**
   - PRD: Sección 3.5
   - Mejora: Mostrar "(kg)" en input y validar decimales
   - Complejidad: Baja

---

## Roadmap Implementación

### Sprint 1 - Críticos
1. **Drag & Drop reordenar productos** (SortableJS) - 4-6 horas
2. **Validación precio promocional < precio L1** - 30 min
3. **Restricción eliminación si tiene pedidos** - 1 hora

### Sprint 2 - Importantes
4. **Historial movimientos de stock** - 3-4 horas
5. **Exportar Excel real** (SheetJS) - 2-3 horas
6. **Vista detalle producto completa** - 6-8 horas
7. **Alertas stock bajo en dashboard** - 2 horas

### Sprint 3 - Mejoras
8. **Panel stock negativo** - 1 hora
9. **Proveedores desde Configuración** - 3-4 horas
10. **Promociones con fecha inicio/fin** - 2-3 horas
11. **Exportar múltiples proveedores** - 1 hora
12. **Mejora campo peso con unidad** - 30 min

---

## Notas Técnicas

### Fortalezas del Prototipo
- ✅ Sistema de filtros robusto con persistencia localStorage
- ✅ Validaciones de negocio implementadas correctamente
- ✅ UI limpia y responsive con dark mode
- ✅ Mock data completo (15 productos + historial stock)
- ✅ Comentarios detallados explicando reglas de negocio
- ✅ Cálculo L2/L3 según fórmulas PRD

### Áreas de Mejora
- ⚠️ Drag & drop (crítica según PRD)
- ⚠️ Historial de stock no visible (auditoría)
- ⚠️ Exportar Excel es simulación
- ⚠️ Falta vista detalle completa

### Compatibilidad con PRD
Campos coinciden con estructura PRD (sección 8.1):
- id, nombre, proveedor_id, precio_l1, stock_actual, stock_minimo
- peso_kg, orden, disponible, en_promocion, precio_promocional

---

**Estado general**: 58% implementado funcionalmente
**Nivel de madurez**: Prototipo funcional con CRUD completo y lógica core implementada
