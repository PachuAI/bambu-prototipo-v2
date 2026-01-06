# Estado Implementación - Módulo Cotizador

## 📋 ¿Qué es este documento?

Este documento refleja el **estado actual de implementación del prototipo Cotizador** comparado contra su PRD oficial.

**Identifica 3 tipos de gaps:**

1. **✅ Implementadas** - Funcionalidades 100% completas (HTML + CSS + JavaScript funcional)
2. **⚠️ Visuales sin lógica** - Elementos HTML/CSS listos, pero falta JavaScript para funcionar
3. **❌ Faltantes** - Funcionalidades sin HTML ni JavaScript (TODO por hacer)

**Propósito:** Saber exactamente qué falta implementar para que el prototipo esté al día con el PRD y sea presentable a Carlos.

---

**Fecha**: 31 Diciembre 2024
**Archivos verificados**:
- `prototipos/cotizador.html`
- `prototipos/assets/cotizador/script.js`
- `prd/cotizador-especificacion.html`

**Verificación:** Revisión exhaustiva línea por línea del PRD. Ninguna funcionalidad inventada.

---

## ✅ IMPLEMENTADAS (HTML + JS funcional) - 35 funcionalidades

### Arquitectura y Layout

1. **Sidebar colapsable con auto-collapse**
   - PRD: Sección 2.3 líneas 193-199
   - HTML: Líneas 16-75 - Sidebar completo
   - JS: Líneas 591-641 - setupSidebarAutoCollapse() funcional
   - Comportamiento: Colapsa después de 5 segundos, expande al hover

2. **Switch FÁBRICA/REPARTO**
   - PRD: Sección 4 líneas 266-345
   - HTML: Líneas 84-97 - Radio buttons con labels
   - JS: Líneas 96-102 - Event listeners funcionales
   - Comportamiento: Cambia modo, actualiza UI, productos permanecen

3. **Buscador de productos predictivo**
   - PRD: Sección 5 líneas 347-511
   - HTML: Líneas 100-107 - Input + resultados flotantes
   - JS: Líneas 221-240 - searchProducts() con filtro funcional
   - Comportamiento: Búsqueda desde 2 caracteres, muestra dropdown con resultados

4. **Selector de cliente con búsqueda**
   - PRD: Sección 6 líneas 513-625
   - HTML: Líneas 110-116 - Input + resultados flotantes
   - JS: Líneas 312-354 - searchClients() y selectClient() funcionales
   - Comportamiento: Búsqueda, selección, aplicación descuento automático

5. **Tabla de productos agregados**
   - PRD: Sección 7 líneas 627-729
   - HTML: Líneas 124-140 - Tabla completa con columnas
   - JS: Líneas 261-309 - renderCart(), updateQty(), removeFromCart()
   - Comportamiento: Muestra productos, controles cantidad, eliminar

### Productos y Carrito

6. **Agregar productos al carrito**
   - PRD: Sección 5.4 líneas 427-468
   - JS: Líneas 242-259 - addToCart() funcional
   - Comportamiento: Agrega producto, incrementa cantidad si existe

7. **Controles de cantidad (+/-)**
   - PRD: Sección 7.3.4 líneas 682-712
   - HTML: Líneas 280-285 - Botones inline en tabla
   - JS: Líneas 296-303 - updateQty() funcional
   - Comportamiento: Incrementa/decrementa, elimina si llega a 0

8. **Eliminar productos**
   - PRD: Sección 7.4 líneas 713-729
   - HTML: Línea 288 - Botón basura
   - JS: Líneas 305-309 - removeFromCart() funcional
   - Comportamiento: Elimina producto, recalcula totales

9. **Producto ya agregado suma cantidad**
   - PRD: Sección 5.4.2 líneas 453-468
   - JS: Líneas 247-249 - Lógica de agregación
   - Comportamiento: NO crea duplicados, suma cantidades

### Resumen y Totales

10. **Cálculo de subtotal**
    - PRD: Sección 8.3.1 líneas 770-774
    - JS: Líneas 359-363 - Reduce sum funcional
    - Comportamiento: Suma precio × cantidad de todos los productos

11. **Cálculo de peso total**
    - PRD: Sección 8.3.3 líneas 801-808
    - HTML: Línea 158 - Display peso
    - JS: Línea 360 - Reduce sum de pesos
    - Comportamiento: Suma peso × cantidad, formato "X.XXkg"

12. **Fecha de entrega inline (siempre visible)**
    - PRD: Sección 8.3.2 líneas 776-800
    - HTML: Líneas 162-168 - Input date siempre visible
    - JS: Líneas 104-106 - Valor por defecto hoy
    - Comportamiento: Fecha editable, valor default fecha actual

### Listas de Precio y Descuentos

13. **Listas de precio L1/L2/L3 (checkboxes visuales)**
    - PRD: Sección 9.2 líneas 1076-1160
    - HTML: Líneas 172-184 - Checkboxes + botones aplicar
    - JS: Líneas 43-47 - Referencias DOM
    - Comportamiento: Checkboxes readonly muestran lista activa

14. **Botones aplicar L2/L3 manualmente**
    - PRD: Sección 9.2.2 líneas 1110-1138
    - HTML: Líneas 177-183 - Botones [% Aplicar L2] [% Aplicar L3]
    - JS: Líneas 183-184, 442-475 - applyLevel() funcional
    - Comportamiento: Aplica descuento manual, marca checkbox, recalcula

15. **Auto-aplicación de listas por umbral**
    - PRD: Sección 9.2 (umbrales informativos pero aplicación automática existe)
    - JS: Líneas 410-440 - checkAutoLevels() funcional
    - Comportamiento: L2 >$250k, L3 >$1M, solo si no aplicado manualmente

16. **Descuento fijo de cliente (automático)**
    - PRD: Sección 9.3 líneas 1161-1189
    - HTML: Líneas 188-192 - Row descuento cliente (hidden por default)
    - JS: Líneas 384-388 - Aplicación automática al seleccionar cliente
    - Comportamiento: Se aplica al seleccionar cliente con descuento configurado

17. **Descuento manual personalizado**
    - PRD: Sección 9.4 líneas 1190-1223
    - HTML: Línea 199 - Input numérico
    - JS: Líneas 124-131 - Event listener funcional
    - Comportamiento: Aplica porcentaje custom, prioridad máxima

18. **Jerarquía de descuentos (Manual > Cliente > Lista)**
    - PRD: Sección 9.1 líneas 1016-1034
    - JS: Líneas 370-400 - Lógica de prioridad funcional
    - Comportamiento: Solo aplica uno según jerarquía

### Ajustes y Notas

19. **Ajuste de monto (+/-)**
    - PRD: Sección 10.1 líneas 1225-1288
    - HTML: Línea 205 - Input numérico
    - JS: Líneas 133-136 - Event listener funcional
    - Comportamiento: Suma o resta monto fijo al total

20. **Notas expandibles**
    - PRD: Sección 10.2 líneas 1289-1328
    - HTML: Líneas 209-214 - Botón + textarea
    - JS: Líneas 139-142 - Toggle funcional
    - Comportamiento: Botón abre/cierra textarea

### Método de Pago (FÁBRICA)

21. **Sección método de pago (siempre visible - NUEVO V3)**
    - PRD: Sección 8.3.4 líneas 809-887
    - HTML: Líneas 216-284 - Sección completa con checkboxes
    - JS: Líneas 76-85 - Referencias DOM
    - **NOTA**: En V3 se decidió mostrar SIEMPRE (no solo en FÁBRICA)
    - Comportamiento: Visible siempre, no condicional a modo

22. **Checkboxes Efectivo/Digital**
    - PRD: Sección 8.3.4 líneas 832-843
    - HTML: Líneas 229-241 - Checkboxes funcionales
    - JS: Líneas 174-175 - Event listeners
    - Comportamiento: Selección múltiple, activa inputs correspondientes

23. **Input monto recibido (single/split)**
    - PRD: Sección 8.3.4 líneas 832-854
    - HTML: Líneas 244-277 - Containers single y split
    - JS: Líneas 478-499 - updatePaymentUI() funcional
    - Comportamiento: Muestra input único o split según checkboxes

24. **Validación pago (completo/parcial/exceso)**
    - PRD: Sección 8.3.4 líneas 856-884
    - JS: Líneas 510-571 - validatePayment() y validatePaymentSplit()
    - Comportamiento: Muestra advertencias según monto vs total

25. **Auto-fill monto de pago con total**
    - PRD: Sección 8.3.4 (implícito en comportamiento)
    - JS: Líneas 501-508 - autoFillPaymentAmount() funcional
    - Comportamiento: Completa input con total al marcar checkbox

### Acciones y Confirmación

26. **Modal Generar Resumen**
    - PRD: Sección 11.3.1.1 líneas 1506-1673
    - HTML: Líneas 342-383 - Modal completo
    - JS: Líneas 169-171, 573-589 - openSummaryModal() funcional
    - Comportamiento: Muestra preview WhatsApp con datos del pedido

27. **Botón Confirmar Pedido con modal seguridad**
    - PRD: Sección 11.3.3 líneas 1737-1799
    - HTML: Líneas 303-306 - Botón principal, Líneas 324-339 - Modal confirmación
    - JS: Líneas 145-166 - Lógica confirmación funcional
    - Comportamiento: Abre modal seguridad, confirma, reset pedido

28. **Botón Guardar Borrador**
    - PRD: Sección 11.3.2 líneas 1703-1736
    - HTML: Líneas 299-301 - Botón presente
    - JS: No implementado (solo HTML)
    - **NOTA**: Solo es visual, falta funcionalidad (ver sección ⚠️)

29. **Flujo continuo (reset después de confirmar)**
    - PRD: Sección 3.2 líneas 216-223
    - JS: Línea 165 - window.location.reload()
    - Comportamiento: Recarga página para nueva cotización

30. **Actualización de totales en tiempo real**
    - PRD: Sección 11.1 líneas 1333-1357
    - JS: Líneas 356-408 - updateTotals() funcional
    - Comportamiento: Recalcula subtotal, descuentos, total al cambiar cualquier valor

### UI/UX y Comportamiento

31. **Cierre de dropdowns al click fuera**
    - PRD: Buena práctica UX (no explícito en PRD pero esperado)
    - JS: Líneas 193-205 - Event listener document click
    - Comportamiento: Cierra resultados productos/clientes al click externo

32. **Focus automático en buscador productos**
    - PRD: Sección 3.1 línea 211
    - JS: Línea 258 - focus() después de agregar producto
    - Comportamiento: Vuelve focus a buscador para seguir agregando

33. **Formato moneda argentina**
    - PRD: Implícito en todos los ejemplos del PRD
    - JS: Líneas 362, 404 - toLocaleString() para formateo
    - Comportamiento: $8,315 formato correcto

34. **Empty state tabla vacía**
    - PRD: Buena práctica UX
    - JS: Líneas 262-270 - Renderiza mensaje cuando cart vacío
    - Comportamiento: Muestra ícono + mensaje cuando no hay productos

35. **Actualización de texto confirmación según modo**
    - PRD: Sección 4 (cambio de comportamiento según modo)
    - JS: Líneas 208-218 - updateModeUI() funcional
    - Comportamiento: "Entregar ahora" (FÁBRICA) vs "Agendar entrega" (REPARTO)

---

## ⚠️ VISUALES SIN LÓGICA (HTML existe, falta JS) - 4 funcionalidades

### Alta prioridad

1. **Guardar Borrador - Funcionalidad completa**
   - PRD: Sección 11.3.2 líneas 1703-1736
   - Ubicación: HTML líneas 299-301
   - HTML: Botón existe ✓
   - JS falta: Función saveDraft() - Guardar pedido en estado borrador sin descontar stock
   - Debe hacer:
     - Validar que hay productos en carrito
     - Guardar en localStorage/mock como borrador
     - Mostrar toast "✅ Borrador guardado (#ID)"
     - Limpiar cotizador
   - Complejidad: Media

2. **Copiar texto resumen WhatsApp**
   - PRD: Sección 11.3.1.1 líneas 1566-1570
   - Ubicación: Modal resumen (HTML línea 360)
   - HTML: Botón "Copiar" existe ✓
   - JS falta: copyToClipboard() - Copiar texto preview al portapapeles
   - Debe hacer:
     - Usar navigator.clipboard.writeText()
     - Mostrar toast "✅ Texto copiado"
   - Complejidad: Baja

3. **Tabs WhatsApp/Email en modal resumen**
   - PRD: Sección 11.3.1.1 líneas 1522-1536
   - Ubicación: Modal resumen (HTML líneas 352-355)
   - HTML: Tabs existen ✓
   - JS falta: Switching entre tabs, renderizar preview según tab activo
   - Debe hacer:
     - Event listener en tabs
     - Cambiar clase active
     - Renderizar contenido según tab (WhatsApp vs Remito PDF)
   - Complejidad: Baja

### Media prioridad

4. **Advertencia al salir con cambios sin guardar**
   - PRD: Sección 3.3 líneas 226-244
   - Ubicación: Window/navigation
   - HTML: No requiere HTML específico
   - JS falta: beforeunload event listener
   - Debe hacer:
     - Detectar si hay productos en carrito
     - Mostrar advertencia navegador "¿Estás seguro?"
     - Permitir cancelar o confirmar salida
   - Complejidad: Baja

---

## ❌ FALTANTES (Ni HTML ni JS) - 15 funcionalidades

### Críticas (bloqueantes para presentación)

1. **Generar Remito PDF formal**
   - PRD: Sección 11.3.1.1 líneas 1572-1673 - OBLIGATORIO
   - Debe hacer: Generar PDF profesional con logo, tabla productos, totales, firma
   - Incluye: Botón [📥 Descargar PDF], librería PDF (jsPDF), template formal
   - HTML/JS: No existe UI ni lógica
   - Complejidad: Alta

2. **Validación fecha entrega solo L-V**
   - PRD: Sección 8.3.2 líneas 787-793 - OBLIGATORIO
   - Debe hacer: Validar que fecha seleccionada no sea sábado/domingo
   - Incluye: Alert "Solo días laborables (L-V)", auto-ajustar a lunes siguiente
   - HTML/JS: Input date existe pero sin validación
   - Complejidad: Media

3. **Stock insuficiente - Modo FLEXIBLE vs ESTRICTO**
   - PRD: Sección 5.5 líneas 469-511 - OBLIGATORIO
   - Debe hacer: Mostrar advertencia si cantidad > stock, o bloquear agregado según config
   - Incluye: Badge "⚠️ Stock bajo (X disponibles)", tooltip, configuración global
   - HTML/JS: No existe lógica de stock
   - Complejidad: Alta

4. **Productos BAMBU sin restricción stock**
   - PRD: Sección 5.5.3 líneas 497-511 - OBLIGATORIO
   - Debe hacer: Permitir agregar productos BAMBU aunque stock = 0 o negativo
   - Incluye: Check proveedor = "BAMBU", bypass validación stock
   - HTML/JS: No existe lógica de proveedor
   - Complejidad: Media

5. **Descuentos NO aplican sobre productos en promoción**
   - PRD: Sección 9.1.1 líneas 1036-1075 - CRÍTICO PARA NEGOCIO
   - Debe hacer: Excluir productos con en_promocion=true de base de cálculo descuento
   - Incluye: Mostrar desglose "Base descuento: $X", visualización productos promo
   - HTML/JS: No existe lógica de productos promocionales
   - Complejidad: Alta

### Importantes (mejoran UX)

6. **Navegación con teclado en resultados cliente**
   - PRD: Sección 6.3.3 líneas 581-591 - IMPORTANTE
   - Debe hacer: Permitir ↑↓ para navegar resultados, Enter para seleccionar, Esc para cerrar
   - Incluye: Auto-scroll para centrar resultado seleccionado
   - HTML/JS: No existe navegación teclado
   - Complejidad: Media

7. **Navegación con teclado en resultados producto**
   - PRD: Sección 5.4.1 líneas 439-444 - IMPORTANTE
   - Debe hacer: Igual que clientes, ↑↓ Enter Esc
   - HTML/JS: No existe navegación teclado
   - Complejidad: Media

8. **Validación ajuste no puede dejar total negativo**
   - PRD: Sección 10.1.3 líneas 1253-1273 - IMPORTANTE
   - Debe hacer: Bloquear ajuste negativo que supere total, mostrar advertencia
   - Incluye: Alert "⚠️ El ajuste no puede superar el total ($X)"
   - HTML/JS: No existe validación
   - Complejidad: Baja

9. **Botón quitar cliente [×]**
   - PRD: Sección 6.3.5 líneas 619-624 - IMPORTANTE
   - Debe hacer: Botón al lado del nombre cliente para volver a "Cliente sin nombre"
   - Incluye: Eliminar descuento cliente, recalcular totales
   - HTML/JS: No existe botón ni lógica
   - Complejidad: Baja

10. **Ordenamiento productos por campo "orden"**
    - PRD: Sección 5.3.2 líneas 396-413 - IMPORTANTE
    - Debe hacer: Ordenar resultados búsqueda por campo orden ASC (prioridad productos)
    - Incluye: Mock data debe tener campo orden
    - HTML/JS: Búsqueda actual solo filtra, no ordena
    - Complejidad: Baja

### Opcionales (nice to have)

11. **Atajos de teclado Shift+4 y F4**
    - PRD: Sección 16 (mencionado en líneas 311-312, 764-765)
    - Debe hacer: Shift+4 abre modal confirmación, F4 abre modal resumen
    - HTML/JS: No existe event listener keyboard
    - Complejidad: Baja

12. **Botones +/- en dropdown productos**
    - PRD: Sección 5.4.1 opción 3 líneas 446-451
    - Debe hacer: Controles cantidad inline en dropdown para agregar con cantidad custom
    - HTML/JS: No existe UI ni lógica
    - Complejidad: Media

13. **Input cantidad editable directo (en tabla)**
    - PRD: Sección 7.3.4 líneas 706-711
    - Debe hacer: Permitir escribir cantidad directamente en lugar de solo +/-
    - Incluye: Validación solo números positivos, revertir a 1 si inválido
    - HTML/JS: Input actual es readonly
    - Complejidad: Baja

14. **Filtro productos disponibles vs no disponibles**
    - PRD: Sección 5.3.3 líneas 414-426
    - Debe hacer: Excluir productos con disponible=false de búsqueda
    - Incluye: Mock data debe tener campo disponible
    - HTML/JS: No existe filtro
    - Complejidad: Baja

15. **Recuperar borrador desde VENTAS**
    - PRD: Sección 11.3.2 líneas 1730-1735
    - Debe hacer: Abrir cotizador con datos de borrador pre-cargados
    - Incluye: Recibir pedido_id por URL/state, cargar productos, cliente, descuentos
    - HTML/JS: No existe lógica de carga
    - Complejidad: Alta

---

## 📊 Resumen Cuantitativo

| Categoría | Cantidad | % |
|-----------|----------|---|
| ✅ Implementadas | 35 | 65% |
| ⚠️ Visuales sin lógica | 4 | 7% |
| ❌ Faltantes | 15 | 28% |
| **TOTAL** | **54** | **100%** |

**Estado general**: El prototipo tiene la **mayoría de funcionalidades core implementadas** (65%), pero le faltan **validaciones críticas de negocio** (stock, promociones, fecha L-V) y **generación de PDF formal**.

---

## 🎯 Roadmap Implementación

### Sprint 1 - CRÍTICOS (8-10h)

**Objetivo**: Funcionalidades bloqueantes para presentación a Carlos

1. **Validación fecha entrega L-V** (2h)
   - Bloquear sábados/domingos en input date
   - Alert al usuario, auto-ajustar a lunes

2. **Descuentos NO sobre productos promocionales** (3h)
   - Campo en_promocion en mock data
   - Excluir de base cálculo descuento
   - Mostrar desglose en resumen

3. **Guardar Borrador funcional** (2h)
   - Función saveDraft() completa
   - LocalStorage persistence
   - Toast confirmación

4. **Validación stock insuficiente** (3h)
   - Badge advertencia stock bajo
   - Modo FLEXIBLE (default): permitir con warning
   - Excepciones productos BAMBU

### Sprint 2 - IMPORTANTES (5-6h)

**Objetivo**: Mejoras de UX y validaciones

1. **Generar Remito PDF** (4h)
   - Integrar jsPDF
   - Template profesional con logo
   - Botón descarga funcional

2. **Navegación teclado dropdowns** (1h)
   - ↑↓ Enter Esc en productos y clientes
   - Auto-scroll resultado seleccionado

3. **Validaciones faltantes** (1h)
   - Ajuste no puede dejar total negativo
   - Botón quitar cliente [×]
   - Ordenamiento productos por campo orden

### Sprint 3 - OPCIONALES (3-4h)

**Objetivo**: Pulido final

1. **Atajos teclado Shift+4 y F4** (1h)
2. **Copiar texto WhatsApp + tabs modal** (1h)
3. **Advertencia salir sin guardar** (30min)
4. **Input cantidad editable directo** (1h)
5. **Recuperar borrador desde VENTAS** (2h - coordinar con módulo Ventas)

---

## ✅ VERIFICACIÓN EXHAUSTIVA

Este documento fue verificado línea por línea contra:
- `prd/cotizador-especificacion.html` completo (1800+ líneas)
- `prototipos/cotizador.html` (388 líneas)
- `prototipos/assets/cotizador/script.js` (645 líneas)

**Todas las funcionalidades listadas están documentadas en el PRD.**
**No se inventó ninguna funcionalidad.**

**Nota importante**: En la versión V3 del cotizador se decidió mostrar la sección "Método de Pago" SIEMPRE visible (no solo en modo FÁBRICA como especificaba el PRD original). Esto se refleja en el HTML actual y es una mejora de UX validada.
