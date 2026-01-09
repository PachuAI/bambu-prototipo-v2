# PRD: Configuración General - Parámetros del sistema

> **Fuente**: `prd/configuracion.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Configuración General
**Parámetros del sistema**

| | |
|---|---|
| **Versión** | 2.0 |
| **Fecha** | 31 Diciembre 2024 |
| **Estado** | ⚠️ Borrador (pendiente prototipar y validar) |

**⚠️ Nota importante:** Este PRD es documentación modular de referencia. Solo Cotizador y Ventas están prototipados/validados al 100%. El contenido de Configuración probablemente cambie al prototipar e implementar.

## 1. Contexto y Objetivo

### 1.1 Propósito del módulo

El módulo **Configuración General** centraliza todos los parámetros del sistema que afectan el comportamiento transversal del CRM. Permite al administrador ajustar precios, vehículos, ciudades, y reglas de negocio sin tocar código.

### 1.2 Problema que resuelve

- Gestión centralizada de parámetros del sistema
- Configuración de listas de precios (L1, L2, L3) y umbrales
- Administración de vehículos de reparto
- Gestión de ciudades habilitadas
- Configuración de comportamiento de stock
- Evita hard-coding de valores que deben ser configurables

### 1.3 Usuarios principales

- **Administrador:** Acceso completo a todas las configuraciones
- **Vendedor:** SIN ACCESO (módulo exclusivo admin)

### 1.4 Simplificación v1 → v2

| Aspecto | v1 | v2 |
|---------|----|----|
| Ubicación configuraciones | Dispersas en diferentes módulos | Centralizadas en un solo módulo |
| Vehículos | Marca/modelo/patente detallados | Solo nombre simple ("Reparto 1, 2, 3") |
| Listas de precio | Fijas en código | Configurables desde UI |

## 2. Funcionalidad Principal

### 2.1 Descripción general

El módulo Configuración General agrupa 4 áreas principales:

- **Vehículos:** CRUD de vehículos de reparto (nombre, capacidad en kg)
- **Ciudades:** CRUD de ciudades disponibles para entregas
- **Listas de precios:** Configuración de % descuento L2/L3 y umbrales de acceso
- **Comportamiento stock:** Bloquear vs advertir cuando no hay stock suficiente

**Nota importante:** CRUD = Create-Read-Update-Delete (alta, consulta, modificación, baja)

### 2.2 Características clave

- ✅ Acceso exclusivo para administrador
- ✅ CRUD de vehículos (nombre, capacidad kg)
- ✅ CRUD de ciudades
- ✅ Configuración de listas de precios (L2/L3 porcentajes + umbrales)
- ✅ Toggle comportamiento stock (bloquear/advertir)
- ✅ Cambios aplicados inmediatamente en todo el sistema
- ✅ Validaciones para evitar configuraciones inválidas
- ✅ Historial de cambios (auditoría)

## 3. Secciones del Módulo

### 3.1 Pestaña: Vehículos

**Tabla de vehículos:**

| Columna | Descripción |
|---------|-------------|
| **Nombre** | Nombre del vehículo (ej: "Reparto 1", "Reparto 2") |
| **Capacidad (kg)** | Capacidad máxima de carga en kilogramos |
| **Modelo** | Modelo del vehículo (opcional, ej: "Fiat Fiorino") |
| **Patente** | Patente del vehículo (opcional, ej: "AB 123 CD") |
| **Acciones** | Botones: [Editar] [Eliminar] |

**Modal: Crear/Editar Vehículo**

- **Nombre:** Text input (obligatorio, único)
- **Capacidad (kg):** Number input (obligatorio, mayor a 0)
- **Modelo:** Text input (opcional)
- **Patente:** Text input (opcional)
- **Botones:** [Cancelar] [Guardar]

**⭐ Campos opcionales:** Modelo y Patente son opcionales para permitir identificación rápida del vehículo físico. Nomenclatura sugerida: "Reparto 1", "Reparto 2", "Reparto 3".

### 3.2 Pestaña: Ciudades

**Tabla de ciudades:**

| Columna | Descripción |
|---------|-------------|
| **Ciudad** | Nombre de la ciudad (ej: "Neuquén", "Plottier") |
| **Provincia** | Provincia a la que pertenece (ej: "Neuquén", "Río Negro") |
| **Clientes Asociados** | Cantidad de clientes con esta ciudad asignada |
| **Acciones** | Botones: [Editar] [Eliminar] |

**Modal: Crear/Editar Ciudad**

- **Ciudad:** Text input (obligatorio, único)
- **Provincia:** Text input (obligatorio)
- **Botones:** [Cancelar] [Guardar]

**⚠️ Restricción de eliminación:** No se puede eliminar una ciudad que tenga clientes asociados. Mensaje: "No se puede eliminar esta ciudad porque tiene X clientes asociados".

### 3.3 Sección: Listas de Precio

**Tabla de listas:**

| Columna | Descripción |
|---------|-------------|
| **Lista** | Nombre de la lista (ej: "L2", "L3") |
| **Descuento** | Porcentaje de descuento sobre precio L1 (ej: 6.25%, 10%) |
| **Umbral Mínimo** | Monto mínimo del pedido para acceder a esta lista (opcional) |
| **Acciones** | Botones: [Editar] [Eliminar] |

**Nota:** L1 es el precio base (sin descuento), no aparece en la tabla. Solo se configuran las listas con descuento (L2, L3, etc.)

**Modal: Crear/Editar Lista**

- **Nombre:** Text input (obligatorio, único, ej: "L4")
- **Descuento (%):** Number input (obligatorio, entre 0 y 100)
- **Umbral Mínimo ($):** Number input (opcional)
- **Botones:** [Cancelar] [Guardar]

**💡 Umbrales de acceso:** Si se configuran umbrales, el cotizador solo permitirá seleccionar L2/L3 si el subtotal del pedido supera esos montos. Dejar en blanco para permitir acceso sin restricciones.

### 3.4 Sección: Comportamiento de Stock

**Opciones:**

- ○ Bloquear venta
- ● Advertir y permitir

**ℹ️ Productos BAMBU siempre permiten stock negativo**

**Comportamiento según configuración:**

| Opción | Comportamiento |
|--------|----------------|
| **Bloquear venta** | Si no hay stock suficiente, el botón "Confirmar pedido" queda deshabilitado con mensaje: "Stock insuficiente en: [producto]" |
| **Advertir pero permitir** | Muestra alerta ⚠️ "Stock insuficiente en: [producto]" pero permite confirmar de todos modos (stock queda negativo) |

**⚠️ Excepción proveedor BAMBU:** Los productos del proveedor "BAMBU" (producción propia) siempre pueden tener stock negativo sin límite, sin importar esta configuración. Esto permite seguir vendiendo mientras se produce más.

## 4. Reglas de Negocio Específicas

### 4.1 Validaciones - Vehículos

| Campo | Validación | Mensaje de error |
|-------|------------|------------------|
| **Nombre** | Único, no puede haber 2 vehículos con mismo nombre | "Ya existe un vehículo con este nombre" |
| **Capacidad (kg)** | Mayor a 0 | "La capacidad debe ser mayor a 0" |
| **Eliminar vehículo** | No puede tener pedidos asignados | "No se puede eliminar este vehículo porque tiene X pedidos asignados" |

### 4.2 Validaciones - Ciudades

| Campo | Validación | Mensaje de error |
|-------|------------|------------------|
| **Nombre** | Único, no puede haber 2 ciudades con mismo nombre | "Ya existe una ciudad con este nombre" |
| **Eliminar ciudad** | No puede tener clientes asociados | "No se puede eliminar esta ciudad porque tiene X clientes asociados" |

### 4.3 Validaciones - Listas de precio

| Campo | Validación | Mensaje de error |
|-------|------------|------------------|
| **Descuento L2 (%)** | Entre 0% y 100% | "El descuento debe estar entre 0 y 100" |
| **Descuento L3 (%)** | Entre 0% y 100%, mayor que L2 | "L3 debe ser mayor que L2" |
| **Umbral L2 ($)** | Mayor a 0 (si se completa) | "El umbral debe ser mayor a 0" |
| **Umbral L3 ($)** | Mayor que umbral L2 (si se completa) | "El umbral L3 debe ser mayor que L2" |

### 4.4 Impacto de cambios en el sistema

**Cambios en listas de precio:**

- Se aplican inmediatamente a todos los pedidos nuevos
- Los pedidos existentes (borradores o confirmados) NO se modifican
- Al editar un pedido existente, se recalculan precios con la configuración actual

**Cambios en vehículos:**

- Se aplican inmediatamente en calendario de repartos
- Los pedidos ya asignados a un vehículo mantienen la asignación
- Si se elimina un vehículo, sus pedidos asignados quedan "sin vehículo"

**Cambios en ciudades:**

- Se aplican inmediatamente en dropdowns de clientes y filtros
- Los clientes con ciudades eliminadas mantienen el valor (pero aparece como "Ciudad inválida")

**Cambios en comportamiento stock:**

- Se aplican inmediatamente en el cotizador
- No afecta pedidos ya confirmados

### 4.5 Regla especial: Productos del proveedor BAMBU

**Comportamiento:**

- Los productos del proveedor "BAMBU" (producción propia) pueden tener stock negativo sin límite
- Esto permite seguir vendiendo mientras se produce más
- La configuración "Bloquear venta" NO aplica para productos BAMBU
- Solo muestra advertencia informativa: ℹ️ "Stock negativo en producto BAMBU: X unidades"

## 5. Integración con Otros Módulos

### 5.1 Cotizador

**Relación:** El cotizador consume configuración de precios y stock

**Sincronización:**

- Listas de precio (L1/L2/L3) se calculan según % configurados
- Umbrales de acceso a L2/L3 se validan al seleccionar lista
- Comportamiento stock (bloquear/advertir) se aplica al confirmar pedido
- Productos BAMBU siempre permiten stock negativo

### 5.2 Ventas (Calendario de Repartos)

**Relación:** El calendario de repartos muestra vehículos configurados

**Sincronización:**

- Vehículos configurados aparecen como opciones en asignación de pedidos
- Capacidad (kg) se usa para calcular carga total por vehículo
- Si se elimina vehículo, pedidos asignados quedan "sin vehículo"

### 5.3 Productos

**Relación:** Los productos calculan precios según listas configuradas

**Sincronización:**

- Precio L1 se ingresa manualmente en producto
- Precio L2 = L1 - (L1 * descuento_l2_porciento / 100)
- Precio L3 = L1 - (L1 * descuento_l3_porciento / 100)
- Productos en promoción ignoran listas (precio fijo)

### 5.4 Clientes

**Relación:** Los clientes usan ciudades configuradas

**Sincronización:**

- Dropdown de ciudad en formulario cliente consume lista configurada
- Filtros por ciudad en tabla clientes usan ciudades configuradas
- Si se elimina ciudad, clientes asociados quedan con "Ciudad inválida"
