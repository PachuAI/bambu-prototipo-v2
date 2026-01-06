# Sistema Bambu CRM v2 - Documentación

**Fecha**: 04 Enero 2026
**Estado**: ✅ SISTEMA CSS COMPLETO - Listo para migración
**Última actualización**: 04/01/2026 - 20:45

**NUEVO**: 🎯 Sistema de tokens.css + components.css con **100% de cobertura** CSS

---

## 📍 CONTEXTO ACTUAL

**Fase**: Prototipado y especificación **COMPLETA**
**Sistema CSS**: ✅ Tokens + Components listos
**Cobertura**: 100% (todas las clases HTML cubiertas)
**Próximo paso**: Migrar prototipos al sistema nuevo (FASE 3)

**Ciclos completados**:
1. ✅ Ciclo 1: Especificación inicial de módulos
2. ✅ Ciclo 2: Resolución de gaps (pagos, flujos, cuenta corriente)
3. ✅ Ciclo 3: Sistema de diseño (tokens CSS + 3 colores)
4. ✅ Ciclo 4: Auditoría CSS + correcciones (100% cobertura)

---

## 🎨 SISTEMA DE DISEÑO CSS (Enero 2026)

### Sistema de Tokens + Components

**Arquitectura CSS completa**:
```
shared/
├── tokens.css        (248 líneas) - Variables CSS centralizadas
├── components.css    (811 líneas) - 85 componentes genéricos
└── common.css        (deprecado) - NO usar
```

**Cobertura por módulo**:
- cotizador: 93% (95/102 clases)
- ventas: 70% (120/170 clases)
- clientes: 96% (46/48 clases)
- dashboard: 96% (72/75 clases)
- repartos: 95% (77/81 clases)

**Clases no cubiertas**: Solo Font Awesome (66 clases) - Librería externa

### Documentación del Sistema

1. **`DISEÑO-VISUAL.md`** - Sistema completo de diseño (paleta, tipografía, espaciado)
2. **`PLAN-MIGRACION-TOKENS.md`** - Plan de migración en 3 fases (FASE 1 y 2 ✅)
3. **`AUDITORIA-COBERTURA-CSS.md`** - Análisis exhaustivo de cobertura
4. **`CORRECCIONES-CSS-04-ENE-2026.md`** - Detalle de 12 correcciones aplicadas

### Próxima Sesión: FASE 3 - Migración

**Orden sugerido** (de simple a complejo):
1. dashboard.html (75 clases)
2. clientes.html (48 clases)
3. repartos-dia.html (81 clases)
4. cliente-detalle.html (119 clases)
5. ventas.html (170 clases)
6. cotizador.html (102 clases)

**Proceso por prototipo**:
- Cambiar imports CSS (tokens + components + específico)
- Mover estilos específicos a nuevo archivo
- Verificar visualmente
- Eliminar CSS viejo

---

## 📂 ESTRUCTURA Y FUENTES DE VERDAD

### **Especificaciones Completas (Actualizadas 27/12/2025)**

#### 1. **COTIZADOR-ESPECIFICACION-COMPLETA.md** ⭐
- Spec completa del cotizador v2
- Incluye método de pago en modo FÁBRICA
- Pagos: completo / parcial / mixto / sin pago
- Validación cliente "Sin registro"
- Sistema híbrido de listas de precios (auto + manual)

#### 2. **html/ventas.html**
- Módulo VENTAS (fusión Pedidos + Histórico)
- Flujos REPARTO y FÁBRICA completos
- **Sistema de pagos híbrido**: genéricos vs específicos
- Pagos parciales permitidos en ambos modos
- Edición post-entrega con ajustes en CC
- Integración bidireccional con Cuenta Corriente

#### 3. **html/cuenta-corriente.html**
- Módulo Cuenta Corriente expandido
- **Pagos genéricos** (no asociados a pedido)
- **Pagos a pedido específico** (dropdown)
- Discriminación efectivo/digital
- Validaciones: monto no puede exceder pendiente
- Ajustes automáticos por edición de pedidos

### **Prototipos Funcionales**

#### 4. **prototipo-html-simple/cotizador-v2.html**
- Prototipo HTML + JS vanilla (mock)
- Lógica híbrida listas de precios (auto + botones forzar)
- Método de pago modo FÁBRICA (efectivo/digital/mixto)
- Validaciones en tiempo real

#### 5. **prototipo-html-simple/ventas-v2.html** ⭐ NUEVO
- Prototipo interactivo completo con mock data funcional
- **20 pedidos** (40% EN TRÁNSITO, 60% ENTREGADOS)
- **5 borradores** con flujo confirmar → pedido
- **3 vistas**: Pedidos | Borradores | Calendario Semana
- **Filtros funcionales** combinables (Estado, Período, Tipo, Vehículo, Método Pago)
- **Paginación separada** (5 pedidos/página = 4 páginas)
- **Marcar como entregado** con registro pago obligatorio (efectivo/digital/mixto)
- **Stats dinámicas** que se actualizan con filtros
- Tabla con anchos fijos (sin saltos entre páginas)
- Resetea al F5

#### 6. **prototipo-html-simple/repartos-dia-v2.html** ⭐ NUEVO (30/12)
- Prototipo interactivo vista detalle día de reparto
- **Navegación integrada**: Botón "Ver detalle" en calendario ventas → repartos-dia-v2.html?fecha=XXX
- **2 vistas**: Por Vehículo | Por Ciudad
- **3 vehículos mock** con capacidades reales (Mercedes Sprinter x2, Toyota Hiace)
- **7 pedidos sin asignar** inicialmente
- **Modal asignar vehículo** con preview capacidad en tiempo real
- **Asignación/reasignación** de pedidos funcional
- **Barras capacidad** con diseño profesional (color único azul, badges para estado)
- **Stats globales** actualizadas dinámicamente
- **Tablas colapsables** con datos: Dirección, Ciudad, Teléfono, Peso, Monto
- Exportar hoja reparto (mock)
- **Diseño unificado**: Sidebar coherente con cotizador/ventas

#### 7. **prototipos/cliente-detalle.html** - Cuenta Corriente Integrada ⭐
- **IMPORTANTE**: Cuenta Corriente NO es módulo independiente
- **Ubicación**: Pestaña "Cuenta Corriente" dentro de vista detalle cliente
- **Pestañas disponibles**: Cuenta Corriente | Historial Pedidos | Información
- **Funcionalidad CC completa**:
  - Tabla movimientos (cargos/pagos) con detalle expandible
  - Modal "Registrar Pago" con sistema híbrido (genérico/específico)
  - Split efectivo/digital funcional
  - Validaciones monto vs pendiente
  - Saldo actualizado en tiempo real
- **Integración**: Sincronizado con módulo Ventas (pagos bidireccionales)

---

## 🎯 MÓDULOS PRINCIPALES (Estado)

| Módulo | Spec | HTML | Prototipo | Estado |
|--------|------|------|-----------|--------|
| **Cotizador** | ✅ | - | ✅ | Completo |
| **Ventas** | ✅ | ✅ | ✅ | Completo + Prototipo Funcional |
| **Cuenta Corriente** | ✅ | ✅ | ✅ | **Integrado en cliente-detalle.html (Tab CC)** ⭐ |
| **Repartos Día** | ⏳ | - | ✅ | **Prototipo v2 + Navegación (30/12)** ⭐ |
| **Productos/Stock** | ⏳ | - | - | Pendiente |

---

## 🔄 FLUJO DE PEDIDOS (Integración Completa)

```
COTIZADOR
├─ Modo FÁBRICA
│  ├─ (Opcional) Registrar pago → Actualiza CC
│  └─ Estado: "Entregado" → VENTAS
│
└─ Modo REPARTO
   ├─ Calendario → Estado: "En tránsito"
   ├─ REPARTOS (asignar vehículo)
   └─ VENTAS → Marcar entregado + Pago OBLIGATORIO → CC

CUENTA CORRIENTE
├─ Cargos automáticos (al confirmar pedido)
├─ Pagos desde cotizador (modo fábrica)
├─ Pagos desde ventas (marcar entregado)
├─ Pagos manuales:
│  ├─ Genéricos (no asociados a pedido)
│  └─ Específicos (dropdown pedido)
└─ Ajustes (edición pedidos en VENTAS)
```

---

## 🚀 PRÓXIMOS PASOS

1. **Procesar audios nuevo feedback** (Ciclo 3)
2. **Aplicar cambios a specs actuales**
3. **Generar HTML cotizador** desde spec completa
4. **PRD consolidado final** (cuando todos los módulos estén listos)

---

## 📋 CAMBIOS RECIENTES (27/12/2025)

### Gaps Resueltos:
- ✅ Sistema de pagos híbrido (genéricos + específicos)
- ✅ Pagos parciales en AMBOS modos (REPARTO + FÁBRICA)
- ✅ Validación cliente "Sin registro" (pago obligatorio completo)
- ✅ Listas de precios: Automáticas + override manual
- ✅ Consistencia total entre COTIZADOR ↔ VENTAS ↔ CC

### Documentos Eliminados (obsoletos):
- ❌ PRD-v2-base.md
- ❌ CAMBIOS-PRD-consolidado.md
- ❌ 02-VENTAS-especificacion.md (migrado a HTML)
- ❌ 03-CUENTA-CORRIENTE-especificacion.md (migrado a HTML)
- ❌ 01-AUDIOS-CUENTA-CORRIENTE.md (ya procesado)
- ❌ 01-CAMBIOS-CLIENTE-PDF-ORIGINAL.md (ya aplicado)

---

## 🔗 LINKS ÚTILES

- **Producción**: https://gestion.quimicabambu.com.ar
- **Credenciales**: admin@bambu.com / kajxUl20Sax
- **Docs principales**: `/docs` (en raíz del proyecto)
- **Tracking refactor**: `/docs/refactorizacion/TRACKING.md`

---

**Última actualización**: 27/12/2025
