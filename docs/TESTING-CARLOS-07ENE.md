# Testing Prototipo - 7 Enero 2026

Hola Carlos! Hoy avanzamos bastante con el prototipo. Acá te dejo qué probar.

---

## Lo que arreglamos hoy

1. **Stock se actualiza correctamente**
   - Antes: creabas un pedido y el stock no bajaba
   - Ahora: al confirmar pedido, el stock se descuenta automáticamente
   - Si eliminás un pedido, el stock vuelve

2. **Repartos guarda los cambios**
   - Antes: asignabas un vehículo y al refrescar se perdía
   - Ahora: la asignación queda guardada
   - El orden de la ruta también se guarda si reordenás

3. **Precios según lista del cliente**
   - Si editás un pedido y agregás productos, usa el precio correcto (L1/L2/L3) según el cliente

4. **Atajos de teclado en Cotizador**
   - F2 = Abre resumen para WhatsApp
   - F4 = Va al buscador de productos
   - Ctrl+Enter = Confirma el pedido

---

## Qué probar

### Prueba 1: Crear pedido y ver stock
1. Abrí `productos.html` y fijate el stock de "Lavandina x5L"
2. Abrí `cotizador.html`
3. Agregá 3 unidades de Lavandina x5L
4. Confirmá el pedido
5. Volvé a `productos.html` → El stock debería haber bajado 3

### Prueba 2: Eliminar pedido y recuperar stock
1. Abrí `ventas.html`
2. Buscá el pedido que creaste
3. Eliminalo
4. Volvé a `productos.html` → El stock debería haber vuelto

### Prueba 3: Asignar vehículo en repartos
1. Abrí `repartos-dia.html`
2. Asigná un pedido a Reparto 2
3. Refrescá la página (F5)
4. El pedido debería seguir en Reparto 2

### Prueba 4: Reordenar ruta
1. En repartos, desplegá los pedidos de un vehículo
2. Arrastrá un pedido para cambiar el orden
3. Refrescá la página
4. El orden debería mantenerse

### Prueba 5: Editar pedido con precio correcto
1. Abrí `ventas.html`
2. Editá un pedido de un cliente que tenga Lista L2 o L3
3. Agregá un producto nuevo
4. Fijate que el precio sea el de su lista (no el L1)

---

## Estado general

- **9 módulos** funcionando
- **332 funcionalidades** implementadas
- **Stock y Cuenta Corriente** integrados
- **Listos para testing** antes de pasar a desarrollo

---

## Si encontrás algo raro

Anotalo con:
- En qué pantalla estabas
- Qué hiciste
- Qué esperabas que pase
- Qué pasó en realidad

Mañana lo revisamos juntos!
