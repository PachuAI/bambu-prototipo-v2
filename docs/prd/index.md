# Bambu CRM v2 - Documento de Requisitos del Producto (PRD)

> **Fuente**: `prd/index.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# Bambu CRM v2
**Documento de Requisitos del Producto (PRD)**

| | |
|---|---|
| **Cliente** | Química Bambu S.R.L. |
| **Fecha** | 22 de Diciembre 2025 |
| **Versión** | 1.0 - Draft para aprobación |
| **Preparado por** | ÍTERA |
| **Estado** | 🟡 En revisión |

## 1. Introducción

### 1.1 Propósito del documento

Este documento describe todas las funcionalidades que tendrá Bambu CRM v2. Una vez aprobado, este PRD será la referencia definitiva para el desarrollo.

### 1.2 Contexto

El sistema Bambu CRM está en producción desde Octubre 2025, sirviendo exitosamente la operación diaria de Química Bambu. Después de 2 meses de uso real, se ha recopilado feedback valioso que permite identificar con claridad qué funciona bien, qué necesita mejorar, y qué nuevas necesidades han surgido.

### 1.3 Análisis de los cambios solicitados

Se han recibido aproximadamente 30 cambios y mejoras. Al analizarlos en conjunto, se identificó que:

**Cambios estructurales (afectan la arquitectura del sistema):**

- Eliminación del sistema de combos como módulo separado
- Simplificación de estados de pedido (de 6 a 3)
- Eliminación del módulo de devoluciones
- Eliminación del flujo de "asignación de pedidos" en dashboard
- Cambio completo en el flujo del cotizador (orden de elementos, switch FÁBRICA/REPARTO)

**Módulos nuevos a desarrollar:**

- Gestión de cuenta corriente por cliente (cargos, pagos, saldos)
- Estadísticas de ventas por producto
- Buscador global en dashboard
- Módulo de configuración general unificado

**Mejoras de interfaz:**

- Redistribución de elementos en múltiples pantallas
- Optimización de espacio y densidad de información
- Nuevos campos y controles en formularios existentes

### 1.4 Decisión técnica: Nueva versión (v2)

Dado que los cambios solicitados afectan componentes estructurales del sistema (flujo de cotización, estados de pedidos, módulos completos a eliminar), **la opción más eficiente es desarrollar una nueva versión** en lugar de modificar el sistema actual pieza por pieza.

**Esta decisión permite:**

- Implementar todos los cambios de forma coherente, sin parches sobre parches
- Eliminar código y funcionalidades que ya no se usan (combos, devoluciones)
- Optimizar la interfaz desde la base, no como ajustes superficiales
- Aprovechar el conocimiento adquirido en estos 2 meses de operación real
- Entregar un sistema más limpio y fácil de mantener a futuro

**Qué se aprovecha del sistema actual:**

- Toda la lógica de negocio ya validada en producción
- La estructura de base de datos (simplificada)
- Los mecanismos de seguridad, autenticación y respaldos
- El conocimiento del flujo de trabajo real de los usuarios

### 1.5 Objetivos del nuevo sistema

1. Mejorar la calidad de las estadísticas de ventas diarias
2. Mejorar la calidad de las estadísticas de stock
3. Mejorar la experiencia de cotización para optimizar el tiempo por cliente
4. Reducir errores y eliminar funcionalidades que no se usan
5. Agregar gestión de cuenta corriente por cliente
6. Facilitar la búsqueda rápida de información desde el dashboard

## 2. Usuarios del Sistema

### 2.1 Roles

### Administrador

- Acceso completo a todas las funcionalidades
- Acceso a reportes, estadísticas e informes financieros
- Gestión de configuraciones del sistema

### Vendedor

- Cotización y gestión de pedidos
- Gestión de clientes
- Gestión de productos y stock
- Gestión de repartos
- Registro de pagos en cuenta corriente
- Tiene acceso a estadísticas de ventas y reportes operativos
- **NO tiene acceso** a reportes financieros avanzados

## 2.2 Navegación y Estructura del Sistema

### Sidebar - Estructura definitiva v2

**Orden de elementos en el menú lateral del sistema:**

**📌 COTIZADOR** (botón superior destacado)

**Menú principal:**

- 🏠 **Dashboard**
- 👥 **Clientes**
- 📦 **Productos y Stock**
- 💰 **Ventas** ⭐ NUEVO (incluye calendario de repartos integrado)
- 📊 **Estadísticas**
- 💾 **Respaldos**
- ⚙️ **Configuración**

### Comparativa v1 → v2

| Módulo v1 | Acción | Módulo v2 |
|-----------|--------|-----------|
| Cotizador | ✅ Se mantiene | Cotizador (botón superior) |
| Dashboard | ✅ Se mantiene | Dashboard |
| Clientes | ✅ Se mantiene | Clientes |
| Inventario (dropdown) | 🔄 Simplifica | Productos y Stock (sección única) |
| Pedidos | ❌ Elimina | → Fusionado en **Ventas** |
| Devoluciones | ❌ Elimina | - |
| Repartos (dropdown con 4 subsecciones) | ❌ Elimina como módulo separado | → Calendario de repartos integrado en **Ventas** (vista filtrada) |
| Repartos → Histórico | ❌ Elimina | → Fusionado en **Ventas** (tab Lista Pedidos) |
| - | ➕ Nuevo | **Ventas** (fusión Pedidos + Histórico) |
| Respaldos | ✅ Se mantiene | Respaldos |
| Reportes | 🔄 Amplía | Estadísticas |
| Administración (Filament) | 🔄 Reemplaza | Configuración (frontend nativo) |

### Detalles por módulo

#### 📌 Cotizador (botón superior)

- Botón destacado siempre visible
- Acceso rápido desde cualquier sección
- Al abrir: colapsa el menú lateral para maximizar espacio

#### 🏠 Dashboard

- Pantalla principal al ingresar
- Buscador global + resumen diario + alertas stock

#### 👥 Clientes

- CRUD completo de clientes
- Acceso a cuenta corriente por cliente (subsección expandida)

#### 📦 Productos y Stock

- Sección única (antes era dropdown con "Productos" y "Stock" separados)
- Gestión completa de catálogo
- Ajustes de stock

#### 💰 Ventas (NUEVO)

- Fusión de "Pedidos" + "Histórico de repartos"
- Listado completo de todos los pedidos
- Incluye calendario de repartos integrado (vista filtrada, lunes-viernes)
- Filtros avanzados, edición masiva
- Gestión de vehículos para calendario movida a Configuración

#### 📊 Estadísticas

- Antes llamado "Reportes" en v1
- Incluye nuevas estadísticas de ventas por producto

#### 💾 Respaldos

- Igual que v1
- Crear y restaurar backups

#### ⚙️ Configuración

- Reemplaza el panel Filament Admin
- Interfaz frontend nativa
- CRUD: vehículos, ciudades, listas de precio, proveedores

## 3. Módulos del Sistema

### 📊 3.1 Dashboard

**Descripción:** Pantalla principal al ingresar al sistema, optimizada para acceso rápido a información clave y navegación eficiente.

**Funcionalidad clave:**

- ✅ Buscador global rápido (clientes, productos, pedidos) con atajo de teclado
- ✅ Carrusel de calendario con resumen diario (pedidos y kilos)
- ✅ Pedidos en tránsito del día para repartos organizados
- ✅ Alertas de stock bajo formato compacto (muestra 8-10 productos simultáneamente)
- ✅ Elimina zona de "pedidos pendientes de asignar" (no se usa)

**Integración:** El buscador global busca en clientes, productos y pedidos simultáneamente, navegando directamente al detalle desde los resultados.

📄 [Ver especificación completa →](dashboard.md)

### 💳 3.2 Cotizador

**Descripción:** Módulo central rediseñado completamente para optimizar el tiempo de cotización, con switch FÁBRICA/REPARTO como elemento principal.

**Funcionalidad clave:**

- ✅ Switch FÁBRICA/REPARTO en primera posición (determina flujo final)
- ✅ Buscador de productos con predicción y orden prioritario
- ✅ Selector de cliente opcional (permite "Cliente sin nombre")
- ✅ Configuración de descuentos jerárquicos (manual > cliente > lista)
- ✅ Flujo continuo: al confirmar vuelve a "nueva cotización" automáticamente

**Integración:** FÁBRICA genera pedidos entregados, REPARTO abre calendario para fecha. Ambos desglosan stock y generan cargo en cuenta corriente si hay cliente.

📄 [Ver especificación completa →](cotizador.md)

### 👥 3.3 Clientes

**Descripción:** Gestión completa de la base de clientes con acceso directo a cuenta corriente financiera por cliente.

**Funcionalidad clave:**

- ✅ CRUD de clientes (dirección como identificador principal, nombre opcional)
- ✅ Descuento fijo por cliente (radio buttons: Sin descuento / L2 / L3)
- ✅ Cuenta corriente integrada (cargos automáticos, pagos manuales, historial)
- ✅ Discriminación efectivo/digital/mixto en pagos
- ✅ Saldo actualizado en tiempo real con indicador visual (rojo/verde)

**Integración:** Al confirmar pedido en cotizador con cliente seleccionado, se genera cargo automático. Pagos reducen saldo y se sincronizan con módulo Ventas.

📄 [Ver especificación completa (Cuenta Corriente) →](cuenta-corriente.md)

### 📦 3.4 Productos y Stock

**Descripción:** Gestión unificada del catálogo de productos con control de stock, eliminando SKU y usando drag & drop para ordenamiento.

**Funcionalidad clave:**

- ✅ Campo SKU eliminado (productos se identifican solo por nombre)
- ✅ Orden de productos con drag & drop (define prioridad en cotizador)
- ✅ Productos en promoción con precio fijo (independiente de listas)
- ✅ Combos como productos simples con switch "En promoción"
- ✅ Exportar inventario por proveedor (filtro múltiple, descarga Excel)

**Integración:** El orden drag & drop afecta el buscador del cotizador. Productos marcados "no disponible" no aparecen en cotizador pero conservan historial.

📄 [Ver especificación completa →](productos.md)

### 💰 3.5 Ventas

**Descripción:** Módulo central que fusiona "Pedidos" e "Histórico", mostrando TODOS los pedidos con filtros avanzados y edición flexible. Incluye vista de Calendario de Repartos integrada.

**Funcionalidad clave:**

- ✅ Listado completo de pedidos (en tránsito + entregados)
- ✅ Vista Calendario de Repartos integrada (lunes-viernes, asignación a vehículos)
- ✅ Editar pedidos en cualquier estado (incluso entregados)
- ✅ Registro obligatorio de método de pago al marcar "Entregado"
- ✅ Pagos parciales con saldo pendiente automático
- ✅ Sincronización bidireccional con cuenta corriente

**Integración:** Calendario de repartos es una vista filtrada dentro de Ventas (NO un módulo separado). Pagos registrados aquí se crean automáticamente en cuenta corriente del cliente. Modificar pedidos actualiza stock y saldo en tiempo real.

📄 [Ver especificación completa →](ventas.md)

📄 [Ver PRD Vista Detalle Día (Repartos) →](repartos-dia.md)

### 📊 3.6 Estadísticas

**Descripción:** Módulo de análisis con estadísticas de ventas por producto, reportes financieros y exportación a Excel.

**Funcionalidad clave:**

- ✅ Selector de período personalizado (desde-hasta)
- ✅ Lista de productos con cantidad vendida ordenada
- ✅ Reportes de ganancias semanales y ventas por período
- ✅ Cuentas por cobrar (clientes con saldo pendiente)
- ✅ Exportar reportes a Excel con detalle completo

**Integración:** Acceso completo para administrador, vendedor solo ve estadísticas operativas (no reportes financieros avanzados).

📄 [Ver especificación completa →](estadisticas.md)

### ⚙️ 3.7 Configuración General

**Descripción:** Panel unificado para configuraciones del sistema, reemplaza Filament Admin con interfaz frontend nativa.

**Funcionalidad clave:**

- ✅ CRUD de vehículos (nombre, capacidad en kg)
- ✅ CRUD de ciudades disponibles
- ✅ Configuración de listas de descuento (%, umbrales L1/L2/L3)
- ✅ Boolean de comportamiento de stock (bloquear/advertir sin stock)
- ✅ Solo acceso administrador

**Integración:** Vehículos configurados aquí aparecen en calendario de Ventas (tab Calendario Semana). Listas de descuento afectan cálculos en Cotizador y Ventas.

📄 [Ver especificación completa →](configuracion.md)

### 💾 3.8 Respaldos

**Descripción:** Gestión de backups de base de datos y logs de sistema para trazabilidad y recuperación ante desastres.

**Funcionalidad clave:**

- ✅ Crear respaldo manual de base de datos
- ✅ Restaurar desde respaldo seleccionado
- ✅ Registro de accesos al sistema
- ✅ Registro de cambios críticos en stock
- ✅ Solo acceso administrador

**Integración:** Logs registran usuario y timestamp de operaciones críticas (eliminaciones, ajustes de stock, cambios en pedidos entregados).

📄 [Ver especificación completa →](backup.md)

## 4. Reglas de Negocio

### 4.1 Stock

1. El stock se descuenta al **confirmar** un pedido, no antes
2. El stock se reintegra al **eliminar** un pedido
3. El stock se ajusta al **modificar** un pedido (suma o resta según corresponda)
4. Los productos del proveedor BAMBU pueden tener stock negativo sin límite
5. Para otros productos, el comportamiento con stock insuficiente es configurable (bloquear o advertir)

### 4.2 Precios y descuentos

1. Existen 3 listas de precios: L1 (base), L2, L3
2. El porcentaje de cada lista es configurable
3. Un producto en promoción tiene precio fijo independiente de la lista
4. Un cliente puede tener descuento fijo personalizado
5. **El descuento fijo del cliente REEMPLAZA el descuento de lista** (no se suman)
6. El ajuste +/- es un monto fijo que se suma o resta del total
7. El ajuste negativo no puede superar el total (el pedido no puede quedar en negativo)

### 4.3 Pedidos

1. Solo existen 3 estados: borrador, en tránsito, entregado
2. Los pedidos de FÁBRICA van directo a entregado
3. Los pedidos de REPARTO van a en tránsito con fecha asignada
4. **Cualquier pedido puede modificarse en cualquier estado**
5. Eliminar un pedido es permanente (hard delete) y reintegra el stock
6. Un pedido puede existir sin cliente ("Cliente sin nombre")
7. Se puede asignar cliente a un pedido después de crearlo

### 4.4 Cuenta corriente

1. Los cargos se generan automáticamente al confirmar un pedido
2. Los pagos se registran manualmente
3. No hay límite de crédito
4. El saldo puede ser positivo (debe) o negativo (a favor)
5. Si se modifica un pedido, la cuenta corriente se actualiza automáticamente

### 4.5 Calendario

1. Solo se trabaja de lunes a viernes
2. Muestra capacidad en kilos y cantidad de pedidos.

## 5. Funcionalidades Eliminadas de v2

Para claridad, estas funcionalidades **NO existirán en v2:**

| Funcionalidad | Motivo |
|---------------|--------|
| Módulo de Devoluciones | No se usa |
| Combos como módulo separado | Ahora son productos simples |
| Estado "cancelado" | Solo existe eliminar (hard delete) |
| Estado "en tránsito" | No es necesario |
| Estado "confirmado" | Eliminado, no aporta valor |
| Ventanilla rápida | Reemplazado por switch FÁBRICA/REPARTO |
| Zona de asignación en dashboard | Ya no es necesaria |
| Módulo "Repartos" separado | Calendario integrado en módulo "Ventas" como vista filtrada |
| Título "Cotizador Bambu" | Eliminado para liberar espacio |
| Nombre de cliente en listados | Se usa la dirección como identificador |

## 6. Flujos de Usuario Principales

### 6.1 Cotizar una venta de fábrica

1. Usuario abre "Nueva Cotización"
2. Selecciona switch en modo **FÁBRICA**
3. Busca y agrega productos al pedido
4. (Opcional) Selecciona cliente o deja como "Cliente sin nombre"
5. (Opcional) Ajusta descuentos, notas
6. Confirma el pedido
7. El pedido queda en estado **"entregado"**
8. El stock se descuenta
9. Si hay cliente, se genera cargo en cuenta corriente
10. El sistema vuelve a modo "nueva cotización"

### 6.2 Cotizar un pedido para reparto

1. Usuario abre "Nueva Cotización"
2. Selecciona switch en modo **REPARTO**
3. Busca y agrega productos al pedido
4. Selecciona cliente
5. (Opcional) Ajusta descuentos, notas
6. Confirma el pedido
7. Se abre calendario para elegir fecha de entrega (solo lunes a viernes)
8. Selecciona fecha (o acepta la fecha actual)
9. El pedido queda en estado **"en tránsito"** con fecha asignada
10. El stock se descuenta
11. Se genera cargo en cuenta corriente del cliente
12. El sistema vuelve a modo "nueva cotización"

### 6.3 Modificar un pedido existente

1. Usuario busca el pedido (por número, cliente o dirección)
2. Abre el detalle del pedido
3. Hace clic en "Modificar"
4. Agrega/quita productos o cambia cantidades
5. (Opcional) Cambia lista, ajustes, nota
6. Guarda los cambios
7. El stock se ajusta automáticamente según los cambios
8. La cuenta corriente se actualiza si cambió el monto

### 6.4 Registrar un pago

1. Usuario busca el cliente
2. Abre la ficha del cliente
3. Ve el saldo actual en cuenta corriente
4. Hace clic en "Registrar pago"
5. Selecciona tipo: efectivo o digital
6. Ingresa el monto
7. (Opcional) Agrega nota
8. Confirma
9. El saldo se actualiza

### 6.5 Organizar repartos del día

1. Usuario abre el calendario de repartos
2. Selecciona un día
3. Ve los pedidos "en tránsito"
4. Selecciona pedidos para asignar a vehículos
5. Reordena según la ruta de entrega
6. (Opcional) Descarga Excel para el repartidor
7. Durante el día, marca pedidos como "entregado" cuando se entregan

### 6.6 Consultar estadísticas de ventas

1. Administrador abre "Estadísticas de Ventas"
2. Selecciona período (ej: último mes)
3. Ve la lista de productos con cantidades vendidas
4. (Opcional) Descarga Excel con el detalle

### 6.7 Buscar desde dashboard (buscador global)

**Objetivo:** Encontrar información rápidamente sin navegar módulo por módulo

1. Usuario presiona atajo de teclado o hace clic en el buscador global
2. Escribe el término de búsqueda (nombre cliente, dirección, producto, # pedido)
3. Ve resultados agrupados por tipo: Clientes (3) | Productos (2) | Pedidos (1)
4. Hace clic en el resultado deseado
5. El sistema navega directamente al detalle correspondiente
6. **Ahorro de tiempo:** No necesita entrar módulo por módulo buscando

### 6.8 Cotizar cliente ocasional (sin nombre)

**Objetivo:** Agilizar ventas ocasionales sin registro completo de cliente

1. Usuario abre "Nueva Cotización"
2. Selecciona modo (FÁBRICA o REPARTO)
3. Agrega productos al pedido
4. **NO selecciona cliente** (deja el campo vacío)
5. (Opcional) Configura descuentos, ajustes, notas
6. Confirma el pedido
7. El sistema guarda el pedido como "Cliente sin nombre"
8. El stock se descuenta normalmente
9. *Opcional posterior:* Puede editar el pedido y asignar un cliente real

### 6.9 Cambiar lista de precio post-confirmación

**Objetivo:** Corregir lista de precio sin eliminar y rehacer el pedido

1. Usuario busca y abre un pedido (en cualquier estado: en tránsito, entregado)
2. Hace clic en "Modificar" o "Cambiar lista"
3. Selecciona nueva lista de precios (ej: de L1 a L2)
4. El sistema recalcula todos los totales automáticamente
5. Guarda los cambios
6. Si el pedido tiene cliente con cuenta corriente, se actualiza automáticamente el cargo

### 6.10 Activar promoción en producto

**Objetivo:** Establecer precio especial independiente de las listas de descuento

1. Usuario abre el módulo "Productos"
2. Selecciona un producto específico
3. Hace clic en "Editar"
4. Activa el switch "En promoción"
5. Ingresa el precio fijo promocional (ej: $4.100)
6. Guarda los cambios
7. **Efecto:** En el cotizador, ese producto siempre se venderá a $4.100, independientemente de la lista seleccionada (L1, L2, L3)

### 6.11 Configurar descuento fijo para cliente VIP

**Objetivo:** Asignar precio preferencial permanente a clientes especiales (empleados, revendedores, VIPs)

1. Usuario abre la ficha de un cliente (ej: empleado de la empresa)
2. Hace clic en "Editar"
3. Activa el campo "Descuento fijo"
4. Ingresa el porcentaje personalizado (ej: 15%)
5. Guarda los cambios
6. **Efecto:** Todas las compras futuras de ese cliente aplicarán automáticamente el 15% de descuento, reemplazando los descuentos de lista (L1, L2, L3)

### 6.12 Consultar cuenta corriente y saldos pendientes

**Objetivo:** Control financiero detallado por cliente

1. Usuario abre la ficha del cliente
2. Ve el saldo actual en la parte superior: **$12.500** (debe) o **-$3.000** (saldo a favor)
3. Hace clic en "Ver historial de cuenta corriente"
4. Ve el listado completo de movimientos:
   - 20/12: Cargo pedido #145 → +$8.000 | Saldo: $8.000
   - 21/12: Pago efectivo → -$5.000 | Saldo: $3.000
   - 22/12: Pago digital (transferencia) → -$3.500 | Saldo: -$500
5. Puede filtrar por tipo de movimiento: Todos | Solo efectivo | Solo digital | Solo cargos
6. (Opcional) Exporta el historial a Excel para enviar al cliente
7. **Uso:** Saber cuánto debe cada cliente, discriminar método de pago, hacer seguimiento financiero

### 6.13 Exportar inventario por proveedor

**Objetivo:** Generar reporte rápido de stock para reposición

1. Usuario abre el módulo "Productos"
2. Hace clic en "Exportar inventario"
3. Selecciona uno o varios proveedores (ej: Bambu, Proveedor A, Proveedor B)
4. Hace clic en "Descargar Excel"
5. El sistema genera archivo Excel con: Nombre del producto | Stock actual
6. **Uso:** Enviar al proveedor para hacer pedido de reposición, análisis de stock por proveedor

### 🔄 Flujos Operativos por Módulo

#### Productos

### 6.14 Crear producto nuevo

**Objetivo:** Agregar nuevo producto al catálogo

1. Usuario abre "Productos" → Click "Nuevo"
2. Completa campos del producto:
   - Nombre (obligatorio)
   - Proveedor (selecciona de lista)
   - Precio base (obligatorio)
   - Stock inicial
   - Peso en kg
   - Orden (número manual para prioridad en buscador)
3. **Si es un combo/pack:** Activa switch "En promoción" e ingresa precio fijo
4. Guarda
5. **Efecto:** Producto disponible inmediatamente en cotizador

### 6.15 Reordenar productos con drag & drop

**Objetivo:** Priorizar productos importantes en el buscador del cotizador

1. Usuario abre "Productos"
2. Ve la lista completa ordenada por campo "orden"
3. Arrastra un producto hacia arriba o abajo
4. Suelta en la nueva posición
5. El sistema ajusta automáticamente el número de orden de todos los productos afectados
6. **Efecto:** El buscador del cotizador muestra los productos en este nuevo orden
7. **Uso:** Los productos más vendidos o prioritarios aparecen primero al buscar

### 6.16 Ajustar stock de producto

**Objetivo:** Corregir stock por conteo físico, devoluciones o errores

1. Usuario abre "Productos"
2. Busca el producto específico
3. Hace clic en "Ajustar stock" (botón en barra de acciones)
4. Ingresa nuevo valor de stock
5. (Opcional) Agrega motivo: "Conteo físico", "Devolución de cliente", "Error de carga"
6. Confirma
7. **Efecto:** Stock actualizado + Registro en log de sistema

### 6.17 Marcar producto como "no disponible"

**Objetivo:** Temporalmente ocultar producto del cotizador sin eliminarlo

1. Usuario abre "Productos"
2. Busca el producto (ej: fuera de temporada o discontinuado temporalmente)
3. Hace clic en "Editar"
4. Desactiva switch "Disponible"
5. Guarda
6. **Efecto:** Producto NO aparece en cotizador pero sigue visible en listado de productos
7. **Reversible:** Puede volver a activarse cuando esté disponible

#### Clientes

### 6.18 Crear cliente nuevo

**Objetivo:** Registrar nuevo cliente en el sistema

1. Usuario abre "Clientes" → Click "Nuevo"
2. Completa campos:
   - Dirección (obligatorio - identificador principal)
   - Teléfono (obligatorio)
   - Nombre (opcional)
   - Email (opcional)
   - Ciudad (selector)
   - Descuento fijo: Sin descuento / L2 / L3
3. Guarda
4. **Efecto:** Cliente disponible en cotizador + Cuenta corriente creada con saldo $0

### 6.19 Registrar pago genérico (sin pedido asociado)

**Objetivo:** Reducir saldo cuando el cliente paga sin especificar pedidos

1. Usuario abre ficha del cliente
2. Ve saldo actual: $45.000 (debe)
3. Click "Registrar pago genérico"
4. Modal muestra:
   - Saldo actual: $45.000
   - Checkboxes: ☐ Efectivo | ☐ Digital
   - Campo monto
   - Nota opcional
5. Ingresa: $20.000 efectivo
6. Confirma
7. **Efecto:** Nuevo saldo: $25.000 | Historial registra "Pago genérico - $20.000 efectivo"

### 6.20 Registrar pago parcial desde módulo Ventas

**Objetivo:** Marcar pedido entregado cuando cliente paga menos del total

1. Usuario abre módulo "Ventas"
2. Busca pedido en estado "En tránsito" (ej: Pedido #234 - Total $15.000)
3. Hace clic en "Marcar entregado"
4. Modal pago muestra:
   - Total pedido: $15.000
   - Checkboxes: ☐ Efectivo | ☐ Digital
   - Campo "Monto recibido"
5. Cliente solo paga $10.000 → Ingresa $10.000 efectivo
6. Sistema detecta: ⚠️ Pago parcial - Saldo pendiente: $5.000
7. Confirma
8. **Efecto:**
   - Pedido: Estado "Entregado" + Método "Efectivo (parcial)"
   - Cuenta corriente: Pago registrado $10.000 + Saldo pendiente $5.000 queda en CC

#### Ventas - Calendario de Repartos

### 6.21 Asignar pedidos a vehículo por drag & drop

**Objetivo:** Organizar entregas del día por vehículo

1. Usuario abre "Ventas" → Tab "Calendario Semana"
2. Selecciona día: Lunes 15/01
3. Ve columnas:
   - Sin asignar (10 pedidos ordenados por ciudad)
   - Reparto 1 (vacío)
   - Reparto 2 (vacío)
4. Arrastra pedidos de Neuquén → Reparto 1
5. Arrastra pedidos de Plottier → Reparto 2
6. Reordena dentro de cada vehículo según ruta de entrega
7. **Efecto:** Pedidos asignados a vehículos + Orden guardado

### 6.22 Exportar orden de reparto SIN precios (para chofer)

**Objetivo:** Generar Excel simple para que el chofer sepa qué entregar

1. Usuario abre "Ventas" → Tab "Calendario Semana" → Selecciona día y vehículo (ej: Reparto 1)
2. Click "Exportar SIN precios"
3. Sistema genera Excel con:
   - # Pedido
   - Cliente (dirección)
   - Teléfono
   - Ciudad
   - Productos con cantidades
   - Orden de visita
   - **SIN precios ni totales**
4. Descarga archivo: "Reparto_1_15-01-2025_SIN_PRECIOS.xlsx"
5. **Uso:** Entregar al chofer para que organice entregas sin ver información financiera

#### Ventas

### 6.23 Filtrar ventas por múltiples criterios

**Objetivo:** Encontrar pedidos específicos rápidamente

1. Usuario abre "Ventas"
2. Ve listado completo (todos los estados)
3. Aplica filtros:
   - Estado: Entregado
   - Método de pago: Efectivo
   - Período: Última semana
   - Ciudad: Neuquén
4. Sistema filtra y muestra solo pedidos que cumplan TODOS los criterios
5. Ve totales actualizados: XX pedidos | $XXX.XXX en ventas
6. **Puede exportar** estos resultados filtrados a Excel

### 6.24 Editar pedido ya entregado

**Objetivo:** Corregir errores en pedidos completados

1. Usuario busca pedido en "Ventas" (Estado: Entregado)
2. Abre detalle del pedido
3. Click "Modificar"
4. Ejemplo: Cliente devolvió 2 unidades de producto X
5. Reduce cantidad de producto X de 10 a 8
6. Guarda cambios
7. **Efecto:**
   - Stock: +2 unidades de producto X (reintegro)
   - Total pedido: Recalculado automáticamente
   - Cuenta corriente: Cargo ajustado al nuevo total
   - Log: Registro de modificación con usuario y timestamp

#### Configuración

### 6.25 Crear vehículo nuevo

**Objetivo:** Agregar vehículo para organización de repartos

1. Administrador abre "Configuración" → Sección "Vehículos"
2. Click "Nuevo vehículo"
3. Completa:
   - Nombre: "Reparto 3"
   - Capacidad (kg): 500
4. Guarda
5. **Efecto:** Vehículo aparece en calendario de repartos como nueva columna

### 6.26 Modificar porcentajes de listas de descuento

**Objetivo:** Ajustar descuentos de L2 y L3 según estrategia comercial

1. Administrador abre "Configuración" → "Listas de precio"
2. Ve configuración actual:
   - L1 (base): 0%
   - L2: 6.25%
   - L3: 10.00%
3. Modifica L2 a 7%
4. Guarda cambios
5. **Efecto:** Todas las cotizaciones futuras con L2 aplicarán 7% de descuento
6. **Nota:** NO afecta pedidos existentes (solo nuevos)
