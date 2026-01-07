# ESTADO-REPARTOS-DIA.md - Auditoría Módulo Repartos Día

**Fecha**: 06 Enero 2026
**Prototipo**: `prototipos/repartos-dia.html`
**PRD**: `prd/ventas.html` sección 8 (NO tiene PRD propio)

---

## Resumen Cuantitativo

| Estado | Cantidad | % |
|--------|----------|---|
| ✅ Implementadas (HTML + JS) | 29 | 85% |
| ⚠️ Visuales sin lógica | 3 | 9% |
| ❌ Faltantes | 2 | 6% |

**Total funcionalidades**: 34

---

## BUG CRÍTICO ENCONTRADO

### Modal muestra "undefined" en nombre cliente
- **Ubicación**: Modal "Asignar Vehículo"
- **Muestra**: "undefined - AV ROCA 123"
- **Debería**: "CLIENTE X - AV ROCA 123" o solo "AV ROCA 123"
- **Causa**: Acceso a `pedido.cliente` que no existe en mock
- **Prioridad**: ALTA - fix visual urgente

---

## NOTA IMPORTANTE: FALTA PRD ESPECÍFICO

El módulo NO tiene PRD propio. Solo está mencionado en `prd/ventas.html` sección 8 (~32 líneas).

El prototipo tiene **799 líneas de JS funcional** con muchas características NO documentadas.

**Recomendación**: Crear PRD específico `prd/repartos-dia.html` basado en prototipo actual.

---

## IMPLEMENTADAS (29 funcionalidades)

### Header y Navegación
1. ✅ Navegación fecha con flechas < >
2. ✅ Display fecha formateada "Mar, 23 Dic 2025"
3. ✅ Badge stats: cantidad pedidos
4. ✅ Badge stats: monto total ($4.2M)
5. ✅ Badge stats: peso total (5,218 kg)
6. ✅ Botón "Exportar" (UI existe)
7. ✅ Botón "← Volver"
8. ✅ Parámetro URL `?fecha=YYYY-MM-DD`

### Tabs Vista
9. ✅ Tab "Por Vehículo" (activo por defecto)
10. ✅ Tab "Por Ciudad"
11. ✅ Switch entre tabs funcional

### Vista Por Vehículo
12. ✅ Card por cada vehículo (Reparto 1, 2, 3)
13. ✅ Nombre vehículo + modelo (Mercedes-Benz Sprinter, Toyota Hiace)
14. ✅ Barra de progreso capacidad
15. ✅ Porcentaje de carga (70%, 59%, 87%)
16. ✅ Badge estado: ÓPTIMA (verde), ALTA (rosa), CASI LLENO (naranja)
17. ✅ Stats: X ped | X kg
18. ✅ Tabla pedidos expandible/colapsable
19. ✅ Columnas tabla: #, Dirección, Ciudad, Teléfono, Peso, Monto, Acción
20. ✅ Botón "Cambiar" (cambiar vehículo asignado)
21. ✅ Botón "X" (desasignar)

### Sección Sin Asignar
22. ✅ Badge "PENDIENTE" (rojo)
23. ✅ Stats: X pedidos | X kg
24. ✅ Lista pedidos sin vehículo
25. ✅ Botón "Asignar" por pedido

### Modal Asignar Vehículo
26. ✅ Card info del pedido (dirección, fecha, peso)
27. ✅ Lista de vehículos disponibles
28. ✅ Capacidad actual vs proyectada por vehículo
29. ✅ Barra progreso con colores según carga
30. ✅ Preview "Con este pedido: X kg / Y kg (Z%)"
31. ✅ Nota informativa fecha asignación
32. ✅ Botones Cancelar / Asignar Vehículo

### Vista Por Ciudad (BONUS - no en PRD)
33. ✅ Agrupación pedidos por ciudad
34. ✅ Stats por ciudad

---

## VISUALES SIN LÓGICA (3 funcionalidades)

### 1. Botón Exportar
- **HTML**: ✅ Existe (verde, header derecha)
- **JS actual**: `alert()` o stub
- **JS falta**: Generar PDF/Excel hoja de reparto
- **Complejidad**: Media

### 2. Navegación cambiar día
- **HTML**: ✅ Flechas < > existen
- **JS actual**: `console.log()`
- **JS falta**: Cambiar fecha y recargar datos
- **Complejidad**: Baja

### 3. Desasignar vehículo (botón X)
- **HTML**: ✅ Botón X existe
- **JS actual**: `alert()` + TODO en código
- **JS falta**: Mover pedido a "Sin Asignar"
- **Complejidad**: Baja

---

## FALTANTES (2 funcionalidades)

### 1. Drag & Drop para asignar
- Arrastrar pedido de "Sin Asignar" a vehículo
- **Complejidad**: Alta
- **Prioridad**: Baja (modal funciona bien)

### 2. Optimización automática de rutas
- Sugerir asignación óptima por ciudad/peso
- **Complejidad**: Alta
- **Prioridad**: Baja (feature avanzado)

---

## DISCREPANCIAS PRD vs PROTOTIPO

| Aspecto | PRD (ventas.html §8) | Prototipo tiene |
|---------|---------------------|-----------------|
| Vista por Ciudad | No mencionada | ✅ Implementada completa |
| Modal asignación | "Selector vehículo" | Modal completo con preview capacidad |
| Cambiar vehículo | No mencionado | ✅ Botón "Cambiar" funcional |
| Badges estado carga | No mencionados | ÓPTIMA/ALTA/CASI LLENO |
| Navegación días | No mencionada | ✅ Flechas < > |
| Estadísticas header | No mencionadas | Pedidos, monto, peso |

**El prototipo es SIGNIFICATIVAMENTE más completo que el PRD.**

---

## Verificación Screenshots

### Screenshot 1 - Vista principal
✅ Header con fecha "Mar, 23 Dic 2025"
✅ Stats: 16 pedidos | $4.2M | 5,218 kg
✅ Tabs Por Vehículo / Por Ciudad
✅ 3 vehículos con pedidos
✅ Barras de progreso con colores
✅ Badges ALTA/ÓPTIMA/CASI LLENO
✅ Sección SIN ASIGNAR con 7 pedidos
✅ Botones Cambiar/X/Asignar

### Screenshot 2 - Modal Asignar
✅ Título "Asignar Vehículo" + #501
⚠️ BUG: "undefined - AV ROCA 123"
✅ 3 opciones vehículo con preview
✅ Barras progreso proyectadas
✅ Botones Cancelar / Asignar Vehículo

---

## Roadmap Sugerido

### Sprint 1 - Críticos
1. **FIX BUG**: Corregir "undefined" en modal
2. Implementar navegación días (flechas)
3. Implementar desasignar (botón X)

### Sprint 2 - Importantes
4. Exportar hoja de reparto (PDF)
5. Crear PRD específico del módulo

### Sprint 3 - Mejoras
6. Drag & drop (opcional)
7. Optimización rutas (opcional)

---

## Calidad del Código

- ✅ Vanilla JS puro (799 líneas)
- ✅ Bien comentado con secciones
- ✅ Sistema tokens CSS correcto
- ✅ Dark mode completo
- ✅ Funciones separadas de renderizado

---

**Estado general: MUY BUENO (85% implementado)**
**PRD necesita creación/expansión significativa**
