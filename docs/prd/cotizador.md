# PRD: Módulo Cotizador

> **Fuente**: `prd/cotizador-especificacion.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Módulo Cotizador

| | |
|---|---|
| **Versión** | 2.0 (Limpio - Enero 2026) |
| **Prototipo** | [prototipos/cotizador.html](../prototipos/cotizador.html) |
| **Estado** | Prototipo validado |

**Nota:** Este PRD describe funcionalidades y reglas de negocio. Para referencia visual, ver el prototipo HTML.

## 1. Contexto y Objetivo

### 1.1 Descripción

El Cotizador es el módulo central para crear pedidos. Optimizado para completar una cotización en ~30 segundos.

### 1.2 Objetivos

- Reducir tiempo de cotización (de ~2 min a ~30 seg)
- Flujo continuo: al confirmar, vuelve automáticamente a "nueva cotización"
- Navegación eficiente con teclado (atajos: Shift+4, F4)

### 1.3 Acceso

- Botón "COTIZADOR" en sidebar (siempre visible, destacado en verde)
- Al abrir: colapsa menú lateral para maximizar espacio

## 2. Modos: FÁBRICA vs REPARTO

### 2.1 Modo FÁBRICA

**Uso:** Cliente retira producto en el momento

| Aspecto | Comportamiento |
|---------|----------------|
| Estado al confirmar | "Entregado" (directo) |
| Stock | Se descuenta inmediatamente |
| Fecha | Fecha actual (sin calendario) |
| Método de pago | Visible - permite registrar pago en el momento |
| Cuenta corriente | Genera cargo automático si tiene cliente |

### 2.2 Modo REPARTO

**Uso:** Pedidos para entrega posterior

| Aspecto | Comportamiento |
|---------|----------------|
| Estado al confirmar | "En tránsito" |
| Calendario | Se abre para elegir fecha (solo L-V) |
| Stock | Se descuenta inmediatamente |
| Método de pago | No visible (se registra al entregar) |
| Cuenta corriente | Genera cargo automático si tiene cliente |

### 2.3 Cambio de modo

**Regla:** Cambiar el switch NO reinicia los productos cargados, solo cambia el comportamiento al confirmar.

## 3. Buscador de Productos

### 3.1 Comportamiento

- Auto-focus al abrir cotizador
- Búsqueda predictiva desde 2 caracteres
- Busca por: nombre del producto (case-insensitive)
- Ordenamiento: por campo `orden` del producto (menor = mayor prioridad)

### 3.2 Información mostrada por resultado

- Nombre del producto
- Precio (según lista aplicada)
- Stock disponible

### 3.3 Agregar productos

- Click en resultado → agrega con cantidad 1
- Flechas ↑↓ + Enter → navegar y seleccionar
- Si producto ya está en lista → suma cantidad (no duplica línea)

### 3.4 Productos excluidos

- NO aparecen: productos con `disponible = false`
- SÍ aparecen con stock 0: productos BAMBU (siempre vendibles)

## 4. Selector de Cliente

### 4.1 Estado por defecto

"Cliente sin nombre" → pedido sin cliente asignado, NO genera cargo en cuenta corriente.

### 4.2 Búsqueda

- Busca por: dirección (identificador principal en Bambu)
- Muestra: dirección, teléfono, saldo cuenta corriente

### 4.3 Indicadores de saldo

| Saldo | Color | Significado |
|-------|-------|-------------|
| -$15.000 | Rojo | Debe $15.000 |
| $0 | Gris | Al día |
| +$5.000 | Verde | A favor $5.000 |

### 4.4 Al seleccionar cliente

- Si tiene descuento fijo configurado → se aplica automáticamente
- Total se recalcula

## 5. Lista de Productos Agregados

### 5.1 Columnas

| Columna | Contenido |
|---------|-----------|
| Producto | Nombre del producto |
| Subtotal | Precio unitario × cantidad |
| Unitario | Precio por unidad (según lista) |
| Cantidad | Botones [-] [número] [+] |
| Acciones | Botón eliminar (sin confirmación) |

### 5.2 Comportamiento cantidad

- Botón [-]: si cantidad = 1, se deshabilita (no permite 0)
- Botón [+]: suma 1 sin límite (excepto modo estricto de stock)
- Input central: permite edición directa

## 6. Sistema de Descuentos

### 6.1 Jerarquía (NO acumulativos)

**Solo se aplica UNO a la vez, en este orden de prioridad:**

1. **Descuento manual** (input %) - máxima prioridad
2. **Descuento fijo del cliente** (configurado en perfil)
3. **Lista de precios** (L1/L2/L3)

### 6.2 Listas de precio

| Lista | Descuento | Umbral sugerido |
|-------|-----------|-----------------|
| L1 | 0% (base) | Sin umbral |
| L2 | 6.25% | Compras >$250k |
| L3 | 10% | Compras >$1M |

**Nota:** Los umbrales son informativos, no se aplican automáticamente.

### 6.3 Base de cálculo

**Regla crítica:** Los descuentos se aplican sobre el subtotal MENOS productos en promoción y combos.

- Productos con `en_promocion = true` ya tienen precio especial
- NO reciben descuento adicional
- Su precio se suma directo al total

### 6.4 Descuento manual

- Campo numérico: 0-100%
- Permite decimales (5.5%, 12.75%)
- Si > 0: ignora descuento cliente y lista

## 7. Ajustes y Notas

### 7.1 Ajuste de monto ($)

Campo que permite valores positivos o negativos.

| Uso | Ejemplo |
|-----|---------|
| Cobrar deudas pendientes | +$5.000 |
| Devolver dinero a favor | -$2.000 |
| Redondeo | +$15 |
| Descuento fijo en pesos | -$500 |

### 7.2 Validación ajuste negativo

**Regla:** El ajuste negativo NO puede superar el total de la compra.

**Mensaje error:** "El ajuste no puede superar el total ($X)"

### 7.3 Notas del pedido

- Textarea expandible, máximo 500 caracteres
- Opcional
- Ejemplo: "Cliente pidió entrega antes de las 10am"

## 8. Totales y Acciones

### 8.1 Cálculo del total

1. Subtotal = suma(precio_unitario × cantidad)
2. Aplicar descuento según jerarquía (solo uno)
3. Aplicar ajuste (+/-)
4. Validar que total >= 0

### 8.2 Botones de acción

| Botón | Función |
|-------|---------|
| Generar Resumen | Vista previa imprimible (no confirma) |
| Guardar Borrador | Guarda sin descontar stock ni generar cargo CC |
| Confirmar Pedido | Confirma según modo (Fábrica/Reparto) |

### 8.3 Formatos de resumen para compartir

| Formato | Uso |
|---------|-----|
| WhatsApp | Texto con emojis, copiar/pegar |
| Remito PDF | Documento formal descargable |

### 8.4 Atajos de teclado

| Atajo | Acción |
|-------|--------|
| Shift + 4 | Confirmar Pedido |
| F4 | Generar Resumen |

## 9. Método de Pago (Solo modo FÁBRICA)

### 9.1 Visibilidad

Solo se muestra cuando switch = FÁBRICA. Permite registrar pago en el momento de la venta.

### 9.2 Opciones

- **Sin marcar:** Pedido sin pago, cliente queda con saldo pendiente
- **Efectivo:** Monto se auto-completa con total
- **Digital:** Igual que efectivo
- **Ambos (mixto):** Dos inputs, suma debe igualar monto recibido

### 9.3 Pago parcial

**Regla:** El monto recibido NO tiene que igualar el total. Se permite pago parcial.

- Si monto < total → saldo pendiente queda en cuenta corriente
- Si monto > total → saldo a favor del cliente

### 9.4 Concepto importante

**Pagos "asociados" vs "atados":**

- Los pagos en Bambu NO están ATADOS a pedidos específicos
- SÍ pueden registrarse EN EL MOMENTO de crear un pedido
- Reducen el SALDO TOTAL del cliente, no un pedido específico
- Pagos posteriores desde Cuenta Corriente son genéricos

## 10. Validaciones y Reglas de Negocio

### 10.1 Al confirmar pedido

| Validación | Mensaje de error |
|------------|------------------|
| Debe tener al menos 1 producto | "Agregá al menos un producto" |
| Total no puede ser negativo | "El total no puede ser negativo" |
| Fecha reparto solo L-V | "Solo días laborables (Lunes a Viernes)" |

### 10.2 Stock

| Configuración | Comportamiento |
|---------------|----------------|
| Modo FLEXIBLE | Permite agregar aunque stock insuficiente, muestra advertencia |
| Modo ESTRICTO | Bloquea agregado si supera stock disponible |

### 10.3 Excepción productos BAMBU

Productos con `proveedor = "BAMBU"` siempre se pueden agregar aunque tengan stock 0 o negativo (producción propia).

### 10.4 Cierre con cambios sin guardar

Si hay productos cargados y no guardados, muestra confirmación: "¿Estás seguro? Se perderán los cambios no guardados"

## 11. Estados y Transiciones

### 11.1 Estados de pedido

| Estado | Descripción | Stock | Cuenta Corriente |
|--------|-------------|-------|------------------|
| Borrador | Guardado sin confirmar | No descuenta | No afecta |
| En tránsito | Confirmado, pendiente de entrega | Descontado | Cargo generado |
| Entregado | Completado | Descontado | Cargo generado |

### 11.2 Transiciones desde Cotizador

- **Guardar Borrador:** → Estado "Borrador"
- **Confirmar (FÁBRICA):** → Estado "Entregado"
- **Confirmar (REPARTO):** → Estado "En tránsito"

## 12. Integraciones con Otros Módulos

### 12.1 Ventas

- Pedidos confirmados aparecen en listado
- Borradores se pueden recuperar y editar
- Pedidos REPARTO aparecen en calendario

### 12.2 Cuenta Corriente

- Al confirmar pedido con cliente → genera cargo automático
- Si se registra pago (modo FÁBRICA) → genera movimiento de pago

### 12.3 Productos

- Stock se descuenta al confirmar (no al guardar borrador)
- Productos con `disponible = false` no aparecen en buscador
- Campo `orden` determina prioridad en resultados

### 12.4 Clientes

- Descuento fijo del cliente se aplica automáticamente al seleccionarlo
- Saldo se muestra en selector para contexto

### 12.5 Configuración

- Listas de precio (L1/L2/L3) se configuran en módulo Configuración
- Comportamiento de stock (flexible/estricto) es configurable
