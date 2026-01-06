# CLAUDE.md - Bambu CRM V2 Prototipo

## ⏰ FECHA ACTUAL DEL PROYECTO

**HOY ES**: 03 Enero 2026 (Viernes)

**IMPORTANTE**:
- ✅ Año correcto: **2026** (NO 2024, NO 2025)
- ✅ Última reunión con Carlos: 30 Diciembre 2025
- ✅ Sistema V1 lanzado: Octubre 2024
- ✅ Inicio prototipado V2: Diciembre 2025
- ✅ Mock data usa semana: 23-27 Diciembre 2025

**Contexto temporal**:
- Estamos en **inicio de año 2026**
- Proyecto V2 lleva ~1 mes de prototipado
- Próxima reunión con Carlos: Por confirmar (enero 2026)

---

## 🎯 CONTEXTO DEL PROYECTO

**Cliente**: Química Bambu S.R.L. (Neuquén, Argentina) - Carlos (dueño)
**Desarrollador**: Giuliano
**Fase actual**: Prototipado y especificación (NO desarrollo)
**Objetivo**: Prototipos HTML interactivos + PRD para validar con cliente ANTES de desarrollo real

### Sistema V1 (Producción - NO TOCAR)
- URL: https://gestion.quimicabambu.com.ar
- Stack: React 19 + Laravel 12 + PostgreSQL 17
- Estado: ✅ Operativo, cliente satisfecho

### Sistema V2 (Este proyecto)
- **Stack final planeado**: Laravel monolito + Livewire (NO React, NO REST API)
- **Stack prototipo**: HTML5 + CSS3 + JavaScript vanilla puro
- **Enfoque**: Mejorar UX, simplificar flujos, agregar módulos nuevos, quitar los que no se usan.

---

## 📁 ESTRUCTURA DEL PROYECTO

```
bambu_v2_prototipo/
├── docs/                         # Documentación proyecto
│   ├── README.md                 # Estado general
│   ├── CHANGELOG.md              # Registro cambios por reunión
│   ├── TODO.md                   # Tareas pendientes
│   ├── ESTADO-VENTAS.md          # Estado implementación Ventas (gaps HTML/CSS/JS)
│   ├── FLUJOS-NEGOCIO.md         # Flujos de negocio principales
│   └── DISEÑO-VISUAL.md          # Paleta, tipografía
│
├── prd/                          # PRDs HTML modulares (especificaciones técnicas)
│   ├── index.html                # PRD padre (vista general, links a módulos)
│   ├── cotizador-especificacion.html  # Spec Cotizador
│   ├── ventas.html               # Spec Ventas
│   ├── cuenta-corriente.html     # Spec Cuenta Corriente
│   ├── productos.html            # Spec Productos y Stock
│   ├── clientes.html             # Spec Clientes
│   ├── dashboard.html            # Spec Dashboard
│   ├── estadisticas.html         # Spec Estadísticas
│   ├── configuracion.html        # Spec Configuración
│   ├── backup.html               # Spec Backup y Logs
│   └── assets/styles.css
│
├── prototipos/                   # Prototipos HTML interactivos
│   ├── index.html                # Índice navegable de todos los prototipos
│   ├── dashboard.html
│   ├── ventas.html
│   ├── cotizador.html
│   ├── clientes.html
│   ├── cliente-detalle.html      # ⭐ INCLUYE Cuenta Corriente (tab integrada)
│   ├── repartos-dia.html
│   │
│   ├── shared/                   # Assets compartidos
│   │   ├── mock-data.js          # Datos mock centralizados
│   │   ├── common.css            # Estilos base
│   │   └── utils.js              # Funciones helper
│   │
│   └── assets/                   # Assets específicos por módulo
│       ├── cotizador/{script.js, styles.css}
│       ├── ventas/{script.js, styles.css}
│       ├── clientes/{script.js, styles.css}
│       ├── dashboard/{script.js, styles.css}
│       └── repartos/{script.js, styles.css}
│
├── wireframes/                   # Screenshots wireframes cliente
└── CLAUDE.md                     # Este archivo
```

---

## 🚫 RESTRICCIONES CRÍTICAS

### NUNCA hacer:
1. ❌ **Modificar sistema V1 producción** (carpeta diferente, no tocar)
2. ❌ **Usar frameworks** en prototipos (React, Vue, Alpine, etc.)
3. ❌ **Usar librerías externas** innecesarias (solo vanilla JS/CSS)
4. ❌ **Crear backend funcional** (solo mock data en JavaScript)
5. ❌ **Mezclar archivos PRD con prototipos** (separación estricta)
6. ❌ **Mensajes largos** sin pedido explícito (economizar tokens)
7. ❌ **INVENTAR CAMPOS O ESTRUCTURAS** sin revisar código/docs existentes primero

### SIEMPRE hacer:
1. ✅ **HTML5 + CSS3 + JS vanilla puro**
2. ✅ **Datos mock en `shared/mock-data.js`**
3. ✅ **Consistencia PRD ↔ Prototipos**
4. ✅ **Actualizar CHANGELOG.md** al incorporar feedback cliente
5. ✅ **Mensajes concisos** (expandir solo si se pide)
6. ✅ **REVISAR CÓDIGO EXISTENTE** antes de crear nuevas estructuras

---

## ⚠️ REGLA DE ORO: NO INVENTAR

**ANTES de crear cualquier estructura de datos (mock data, componentes, etc.):**

1. **LEER** prototipos existentes que usarán esa estructura
2. **EXTRAER** campos exactos que ya se usan
3. **COPIAR** esa estructura, NO inventar campos nuevos
4. **VERIFICAR** contra PRDs si hay dudas

**Campos que NO existen en Bambu CRM y NUNCA se deben usar:**
- ❌ CUIT
- ❌ Razón Social
- ❌ Nombre (clientes)
- ❌ SKU (eliminado en V2)

**Campos que SÍ se usan:**
- ✅ Dirección (identificador principal de cliente)
- ✅ Teléfono
- ✅ Ciudad
- ✅ Email (opcional)
- ✅ Lista de precio (L1/L2/L3)
- ✅ Saldo cuenta corriente

**Si no está en el código existente, NO existe.**

---

## 🔄 WORKFLOW PRINCIPAL

```
1. Reunión Carlos → Feedback/ajustes
2. Actualizar docs/CHANGELOG.md
3. Actualizar PRD HTML correspondiente
4. Actualizar/crear prototipo HTML
5. Validar consistencia docs ↔ prototipo
6. Envío a Carlos para validación
7. Iterar ciclo
```

---

## 💼 PARTICULARIDADES DEL NEGOCIO

### Datos clave:
- **Productos**: Pueden tener cantidad negativa (devoluciones)
- **Listas de precios**: 3 niveles (L1, L2, L3) - L1 más caro, L3 más barato
- **Tipos de pedido**:
  - REPARTO: Cliente recibe en domicilio
  - FÁBRICA: Cliente retira en planta
- **Vehículos**: Repartos propios (Reparto 1, Reparto 2, Reparto 3)
- **Ciudades**: Neuquén Capital, Plottier, Centenario (mayoría)
- **Cuenta corriente**: Muchas ventas a crédito (control financiero estricto)
- **Pagos**: Efectivo + digital (transferencia, débito, crédito)

### Estados de pedidos:
- **Borrador**: Pedido en creación (puede editarse)
- **Pendiente**: Confirmado pero sin asignar a reparto
- **Asignado**: Asignado a vehículo para reparto
- **En reparto**: Salió a entregar
- **Entregado**: Completado
- **Cancelado**: Anulado

---

## 🎨 DISEÑO Y ESTILO

### Archivos CSS:
- **Compartido**: `prototipos/shared/common.css` (layout, botones, forms, tablas)
- **Específico**: `prototipos/assets/{modulo}/styles.css` (solo ese módulo)

### Paleta (placeholder - pendiente definir final):
Ver `docs/DISEÑO-VISUAL.md`

### Convenciones:
- Variables CSS en `:root` (--color-primary, --spacing-md, etc.)
- Clases utilitarias (`.btn`, `.form-group`, `.table`, etc.)
- Mobile-first approach (responsive)

---

## 📊 DATOS MOCK

### Archivo centralizado: `prototipos/shared/mock-data.js`

Contiene:
- `PRODUCTOS`: Array de productos con precios L1/L2/L3
- `CLIENTES`: Array de clientes con ciudad, CUIT, lista precio, saldo CC
- `PEDIDOS`: Array de pedidos/ventas con items, estados, totales
- `VEHICULOS`: Array de vehículos de reparto
- Funciones helper: `getClienteById()`, `getProductoById()`, etc.

**Uso en prototipos**:
```html
<script src="shared/mock-data.js"></script>
<script src="shared/utils.js"></script>
<script>
  // Ya disponibles: PRODUCTOS, CLIENTES, PEDIDOS, VEHICULOS
  console.log(CLIENTES[0].razon_social);
</script>
```

---

## 🛠️ FUNCIONES HELPER

### Archivo: `prototipos/shared/utils.js`

**Formateo**:
- `formatCurrency(amount)` → "$12.345,67"
- `formatDate(dateString)` → "31/12/2024"
- `formatCUIT(cuit)` → "30-71234567-8"
- `formatPhone(phone)` → "299-4567890"

**Validación**:
- `isValidEmail(email)`
- `isValidCUIT(cuit)`

**DOM**:
- `toggleElement(id)`, `showElement(id)`, `hideElement(id)`
- `showNotification(message, type, duration)`

**Storage**:
- `saveToStorage(key, data)`, `getFromStorage(key)`, `removeFromStorage(key)`

**Cálculos**:
- `calculateDiscount(amount, percentage)`
- `calculateSubtotalWithDiscount(amount, percentage)`
- `roundTo2Decimals(num)`

---

## 📝 DOCUMENTACIÓN PRD

### Formato PRD HTML:
Los PRDs en `prd/` son documentos HTML profesionales que especifican:
- Objetivo del módulo
- Casos de uso
- Flujos de usuario
- Requisitos funcionales
- Requisitos no funcionales
- Diseño de UI/UX
- Validaciones y reglas de negocio

**Estructura típica**:
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>PRD - Nombre Módulo</title>
    <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
    <h1>PRD: Nombre Módulo</h1>

    <section id="objetivo">...</section>
    <section id="casos-uso">...</section>
    <section id="requisitos-funcionales">...</section>
    <section id="requisitos-no-funcionales">...</section>
    <section id="ui-ux">...</section>
    <section id="validaciones">...</section>
</body>
</html>
```

---

## ✅ ÚLTIMO CICLO DE FEEDBACK

**Fecha**: 30 Diciembre 2024
**Ajustes solicitados**: 18 total
**Estado**: 13/18 documentados en PRD, 5 pendientes revisar

Ver detalles completos en `docs/CHANGELOG.md`

---

## 🎯 OBJETIVO FINAL PROTOTIPO

**Meta inmediata**: Construir prototipo mockeado funcional que simule flujo completo de un pedido:

1. **Dashboard** → Ver resumen
2. **Cotizador** → Crear cotización para cliente
3. **Ventas** → Convertir cotización en pedido
4. **Repartos** → Asignar pedido a vehículo
5. **Cliente detalle** → Ver historial y cuenta corriente

**Persistencia**: Los datos se pierden al refrescar (mock temporal OK). Opcionalmente usar `localStorage` para persistir entre páginas durante sesión.

---

## 💬 ESTILO DE COMUNICACIÓN

### Preferencias del usuario:
- ✅ **Mensajes concisos** (ahorrar tokens)
- ✅ **Ir al grano** (sin rodeos)
- ✅ **Solo expandir** cuando se pida desarrollo amplio
- ✅ **Siempre en español**

### Ejemplo bueno:
```
✅ "Reorganización completa. Archivos en carpetas correctas.
   Creados: CHANGELOG.md, mock-data.js, common.css, utils.js, index.html.
   ¿Revisamos prototipos existentes para integrar mock-data centralizado?"
```

### Ejemplo malo:
```
❌ "He procedido a realizar una exhaustiva reorganización de la estructura
   de carpetas del proyecto, moviendo meticulosamente cada archivo a su
   ubicación correspondiente según las mejores prácticas de la industria...
   [500 palabras más]"
```

---

## 🔗 CREDENCIALES (SOLO REFERENCIA)

### Sistema V1 producción (NO TOCAR):
- URL: https://gestion.quimicabambu.com.ar
- Admin: admin@bambu.com / kajxUl20Sax

### Cliente:
- Nombre: Química Bambu S.R.L.
- Ubicación: Neuquén, Argentina
- Contacto: Carlos (dueño)
- Rubro: Venta productos químicos (detergentes, limpieza industrial)
- Modelo: B2B mayorista + B2C minorista

---

## 📌 NOTAS ADICIONALES

- **Skills/Comandos/Subagentes**: Serán creados manualmente por Giuliano
- **Stack V2 definitivo**: Laravel + Livewire (posibilidad Inertia/Alpine si necesario)
- **Antes de stack**: Solidificar PRD → Prototipos → Validar → Decidir stack
- **Enfoque**: Paso a paso, sin adelantarse

---

**Última actualización**: 03 Enero 2026
