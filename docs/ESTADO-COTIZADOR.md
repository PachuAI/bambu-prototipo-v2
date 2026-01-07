# Estado Implementación - Módulo COTIZADOR

## Qué es este documento

Este documento refleja el **estado actual de implementación del prototipo Cotizador** comparado contra su PRD oficial.

**Identifica 3 tipos de gaps:**

1. **Implementadas** - Funcionalidades 100% completas (HTML + CSS + JavaScript funcional)
2. **Visuales sin lógica** - Elementos HTML/CSS listos, pero falta JavaScript para funcionar
3. **Faltantes** - Funcionalidades sin HTML ni JavaScript (TODO por hacer)

**Propósito:** Saber exactamente qué falta implementar para que el prototipo esté al día con el PRD.

---

**Fecha**: 06 Enero 2026
**Última actualización**: 06 Enero 2026 (alineado con PRD limpio Enero 2026)
**Archivos verificados**:
- `prototipos/cotizador.html`
- `prototipos/assets/cotizador/script.js`
- `prd/cotizador-especificacion.html` (versión limpia: 420 líneas, secciones 1-12)

---

## IMPLEMENTADAS (HTML + JS funcional) - 28 funcionalidades

### Layout y Estructura
1. **Switch FÁBRICA/REPARTO** - Toggle funcional, cambia estado y texto botón confirmar
2. **Buscador de productos** - Input con búsqueda predictiva (2+ chars)
3. **Selector de cliente** - Input con búsqueda y selección
4. **Tabla productos agregados** - Columnas: Producto, Subtotal, Unitario, Cant, Eliminar
5. **Panel lateral derecho** - Sticky con scroll independiente

### Buscador Productos
6. **Búsqueda predictiva** - Filtra MOCK_PRODUCTS por nombre
7. **Click para agregar** - Agrega producto con cantidad 1
8. **Agregación automática** - Si producto existe, suma cantidad (no duplica línea)
9. **Cierre dropdown** - Click fuera cierra resultados

### Selector Cliente
10. **Búsqueda clientes** - Filtra MOCK_CLIENTS por nombre
11. **Selección cliente** - Actualiza input y estado
12. **Auto-aplicar descuento** - Al seleccionar cliente con descuento, se aplica automáticamente

### Lista Productos
13. **Botones [-] [+]** - Modifican cantidad del producto
14. **Eliminar producto** - Botón trash remueve línea
15. **Recálculo automático** - Subtotal/Total se actualizan al cambiar cantidad

### Panel Lateral - Financials
16. **Subtotal** - Suma de todos los productos
17. **Peso total** - Suma de pesos (usa campo weight de productos)
18. **Fecha entrega** - Input date con valor default hoy
19. **Listas precio L1/L2/L3** - Checkboxes visuales del estado actual
20. **Botones Aplicar L2/L3** - Aplican descuento manual por lista
21. **Auto-level por umbral** - L2 automático si subtotal >$250k, L3 si >$1M
22. **Descuento manual %** - Input que aplica % sobre subtotal
23. **Ajuste $** - Input que suma/resta monto fijo
24. **Notas toggle** - Botón muestra/oculta textarea

### Método de Pago
25. **Checkboxes Efectivo/Digital** - Seleccionables
26. **Input monto único** - Visible cuando solo uno está marcado
27. **Split efectivo/digital** - Visible cuando ambos marcados
28. **Validación pago** - Muestra mensaje pago parcial/completo/excedente

### Botones Acción
29. **Generar Resumen** - Abre modal con preview WhatsApp
30. **Guardar Borrador** - Botón existe (solo alert)
31. **Confirmar Pedido** - Abre modal confirmación

### Modales
32. **Modal Confirmación** - Con botones Cancelar/Confirmar
33. **Modal Resumen WhatsApp** - Preview con datos del pedido

### Cálculos
34. **Jerarquía descuentos** - Manual > Cliente > Lista (correcta)
35. **Total final** - Subtotal - descuento + ajuste

---

## VISUALES SIN LÓGICA (HTML existe, falta JS) - 8 funcionalidades

### Alta prioridad

1. **Guardar Borrador - Lógica real**
   - PRD: Sección 8.2 - Botones de acción
   - HTML: Botón existe (línea 280)
   - JS falta: Guardar en localStorage, generar ID, mantener en lista borradores
   - Complejidad: Media

2. **Confirmar Pedido - Lógica real**
   - PRD: Sección 8.2 - Botones de acción
   - HTML: Modal existe
   - JS falta: Guardar pedido, descontar stock mock, agregar a lista PEDIDOS
   - Actual: Solo muestra alert y hace reload
   - Complejidad: Alta

3. **Input cantidad editable**
   - PRD: Sección 5.2 - "Input central: permite edición directa"
   - HTML: Input existe pero es `readonly`
   - JS falta: Permitir edición directa del número
   - Complejidad: Baja

### Media prioridad

4. **Tab Email/Remito en modal resumen**
   - PRD: Sección 8.3 - Formatos de resumen (WhatsApp + Remito PDF)
   - HTML: Solo tab WhatsApp visible
   - JS falta: Tab Remito PDF con generación de documento
   - Complejidad: Alta

5. **Botón Copiar en modal resumen**
   - PRD: Sección 8.3 - Formatos de resumen
   - HTML: Botón "Copiar" existe (línea 339)
   - JS falta: `navigator.clipboard.writeText()`
   - Complejidad: Baja

6. **Descuento cliente visible en panel**
   - PRD: Sección 6.1 - Jerarquía de descuentos
   - HTML: Row existe `#row-client-discount` (hidden)
   - JS: Se muestra pero solo si cliente tiene descuento Y no hay manual
   - Parcial: Funciona pero podría mejorar feedback visual
   - Complejidad: Baja

7. **Validación fecha solo L-V**
   - PRD: Sección 10.1 - "Solo días laborables (Lunes a Viernes)"
   - HTML: Input date sin restricción
   - JS falta: Validar fin de semana, mostrar alerta
   - Complejidad: Baja

8. **Quitar cliente seleccionado**
   - PRD: Sección 4 - Selector de Cliente
   - HTML: No hay botón X
   - JS falta: Resetear a "Cliente sin nombre"
   - Complejidad: Baja

---

## FALTANTES (Ni HTML ni JS) - 11 funcionalidades

### Alta prioridad

1. **⚠️ CRÍTICO: Descuento sobre base sin promociones**
   - PRD: **Sección 6.3** - Base de cálculo
   - Debe hacer: Excluir productos `en_promocion=true` del cálculo de descuentos
   - Cálculo correcto:
     ```javascript
     // Base descuento = subtotal - suma(productos con en_promocion=true)
     const baseDescuento = productos.reduce((sum, p) => {
       return p.en_promocion ? sum : sum + (p.precio * p.qty)
     }, 0)
     descuentoMonto = baseDescuento * (descuentoPorcentaje / 100)
     ```
   - HTML/JS: No implementado
   - Complejidad: Media
   - **PRIORIDAD MÁXIMA**: Regla de negocio crítica

2. **Atajos de teclado**
   - PRD: Sección 8.4 - Atajos de teclado
   - Debe hacer:
     - `Shift+4` → Confirmar Pedido
     - `F4` → Generar Resumen
     - `Esc` → Cerrar dropdowns/modales
     - `Enter` → Agregar producto seleccionado
     - `↑↓` → Navegar resultados búsqueda
   - HTML/JS: No existe
   - Complejidad: Media

3. **Cierre con advertencia cambios sin guardar**
   - PRD: Sección 10.4 - "¿Estás seguro? Se perderán los cambios no guardados"
   - Debe hacer: Si hay productos y usuario intenta salir → Modal confirmación
   - HTML/JS: No existe
   - Complejidad: Media

4. **Flujo continuo post-confirmación**
   - PRD: Sección 1.2 - "Flujo continuo: al confirmar, vuelve automáticamente a nueva cotización"
   - Debe hacer: Al confirmar → Limpiar campos → Focus en buscador → NO hacer reload
   - Actual: Hace `window.location.reload()`
   - Complejidad: Baja

5. **Calendario modal solo L-V (modo REPARTO)**
   - PRD: Sección 2.2 y 10.1 - "Solo días laborables"
   - Debe hacer: Modal con calendario, solo días laborables seleccionables
   - Actual: Input date inline sin restricción
   - Complejidad: Media

### Media prioridad

6. **Navegación teclado en buscadores**
   - PRD: Sección 3.3 - "Flechas ↑↓ + Enter → navegar y seleccionar"
   - Debe hacer: Flechas ↑↓ navegan, Enter selecciona, auto-scroll al item seleccionado
   - HTML/JS: No existe
   - Complejidad: Media

7. **Saldo cliente en resultados búsqueda**
   - PRD: Sección 4.2 y 4.3 - "Muestra: dirección, teléfono, saldo cuenta corriente"
   - Debe hacer: Mostrar "-$15.000" en rojo o "+$5.000" en verde
   - HTML/JS: No existe en dropdown
   - Complejidad: Baja

8. **Advertencia stock bajo**
   - PRD: Sección 10.2 - Modo FLEXIBLE muestra advertencia
   - Debe hacer: Badge naranja "Stock bajo (5 disponibles)" si cantidad > stock
   - HTML/JS: No existe
   - Complejidad: Baja

9. **Productos BAMBU sin restricción stock**
   - PRD: Sección 10.3 - "Productos con proveedor=BAMBU siempre se pueden agregar"
   - Debe hacer: Identificar proveedor="BAMBU" y permitir agregar sin límite
   - Mock actual: No tiene campo proveedor
   - Complejidad: Baja

10. **Remito PDF formal**
    - PRD: Sección 8.3 - "Remito PDF: Documento formal descargable"
    - Debe hacer: Generar PDF profesional con logo, tabla, totales
    - HTML/JS: No existe
    - Complejidad: Alta

### Baja prioridad

11. **Edición pedido desde VENTAS**
    - PRD: Sección 12.1 - "Borradores se pueden recuperar y editar"
    - Debe hacer: Cargar pedido existente en cotizador para editar
    - Nota: Requiere integración con módulo Ventas
    - Complejidad: Alta

---

## Resumen Cuantitativo

| Categoría | Cantidad | % |
|-----------|----------|---|
| Implementadas | 35 | 76% |
| Visuales sin lógica | 8 | 17% |
| Faltantes | 11 | 24% |
| **TOTAL funcionalidades** | **46** | **100%** |

**Nota**: El PRD limpio (Enero 2026) simplificó la documentación. Algunas funcionalidades se superponen entre categorías.

---

## Roadmap Implementación

### Sprint 1 - CRÍTICOS (Flujo básico funcional) ✅ COMPLETADO (07-Ene-2026)
1. ✅ **Descuento sobre base sin promociones** (Sección 6.3) - baseDescuento excluye promociones
2. ✅ Flujo continuo post-confirmación (quitar reload) - resetearFormulario()
3. ✅ Guardar Borrador con localStorage - BambuState.crearBorrador()
4. ✅ Confirmar Pedido con persistencia - BambuState.crearPedido() + agregarItemPedido()

**Además completado:**
- ✅ Migración a BambuState (productos/clientes dinámicos)
- ✅ Saldo cliente en resultados búsqueda (rojo/verde)

### Sprint 2 - UX IMPORTANTE
5. Atajos de teclado (Shift+4, F4, Esc)
6. Navegación teclado en buscadores
7. Validación fecha solo L-V
8. Botón copiar en modal resumen
9. Input cantidad editable

### Sprint 3 - COMPLETITUD
10. Quitar cliente (botón X)
11. Saldo cliente en resultados
12. Advertencia stock bajo
13. Cierre con advertencia cambios
14. Productos BAMBU sin restricción stock

### Sprint 4 - AVANZADO
15. Remito PDF formal
16. Edición pedido desde VENTAS
17. Calendario modal mejorado
18. Tab Remito en modal resumen

---

## VERIFICACIÓN

Este documento fue verificado contra:
- `prd/cotizador-especificacion.html` (versión limpia Enero 2026, secciones 1-12)
- `prototipos/cotizador.html`
- `prototipos/assets/cotizador/script.js`

**Todas las funcionalidades listadas están documentadas en el PRD actualizado.**
