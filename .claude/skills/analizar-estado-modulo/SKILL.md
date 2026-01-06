---
name: analizar-estado-modulo
description: Analiza exhaustivamente un módulo del prototipo contra su PRD, clasificando funcionalidades en Implementadas/Visuales sin lógica/Faltantes y genera documento ESTADO-{MODULO}.md
---

# Analizar Estado Implementación de Módulo

## Objetivo
Generar documento `docs/ESTADO-{MODULO}.md` que refleje el estado exacto de implementación del prototipo comparado contra su PRD oficial.

## Proceso paso a paso

### 1. Identificar archivos a analizar
- PRD: `prd/{modulo}.html` o `prd/{modulo}-especificacion.html`
- Prototipo HTML: `prototipos/{modulo}.html`
- Prototipo JS: `prototipos/assets/{modulo}/script.js`

### 2. Leer PRD exhaustivamente
**CRÍTICO:** Leer el PRD COMPLETO línea por línea, no asumir ni inventar funcionalidades.

**Buscar secciones:**
- Especificación del módulo
- Funcionalidades principales
- Requisitos funcionales
- Casos de uso
- Flujos de usuario
- Acciones disponibles
- Validaciones

**Extraer TODAS las funcionalidades mencionadas:**
- Filtros
- Acciones (botones, modales)
- Vistas/pestañas
- Campos editables
- Exportaciones
- Validaciones
- Integraciones con otros módulos

### 3. Verificar contra prototipo actual
Para CADA funcionalidad del PRD, verificar:

**HTML/CSS:**
- ¿Existe el botón/elemento/campo?
- ¿Está en el lugar correcto?
- ¿Tiene los estilos adecuados?

**JavaScript:**
- ¿Tiene función asociada?
- ¿La función está implementada o solo muestra alert/console.log?
- ¿Funciona correctamente con mock data?

### 4. Clasificar en 3 categorías

#### ✅ IMPLEMENTADAS (HTML + CSS + JS funcional)
**Criterio:** Funcionalidad 100% completa en prototipo
- HTML existe
- CSS aplicado
- JavaScript funciona con mock data
- Usuario puede interactuar y ver resultado

**Ejemplo:**
```
1. Filtro por Estado (Todos/En Tránsito/Entregado)
   - Dropdown funcional
   - Filtra tabla correctamente
   - Re-renderiza resultados
```

#### ⚠️ VISUALES SIN LÓGICA (HTML/CSS OK, falta JS)
**Criterio:** Elemento visible pero no funciona
- HTML existe (botón, input, modal)
- CSS aplicado (se ve correctamente)
- JavaScript falta, incompleto, o solo alert/stub

**Ejemplo:**
```
1. **Exportar Excel**
   - PRD: Sección 3.8.1 "Exportar reportes"
   - Ubicación: Header filtros (línea 126)
   - HTML: Botón existe ✓
   - JS falta: exportarExcel() - generar archivo con pedidos filtrados
   - Complejidad: Media
```

#### ❌ FALTANTES (Ni HTML ni JS)
**Criterio:** Funcionalidad documentada en PRD pero sin implementar
- No existe HTML
- No existe JavaScript
- TODO por hacer

**Ejemplo:**
```
1. **Auditoría/Historial de cambios**
   - PRD: Sección 3.8.4 líneas 696-711 - OBLIGATORIO
   - Debe hacer: Registrar automáticamente modificaciones post-entrega
   - HTML/JS: No existe UI ni lógica
   - Complejidad: Alta
```

### 5. Generar documento ESTADO-{MODULO}.md

**Estructura obligatoria:**

```markdown
# Estado Implementación - Módulo {NOMBRE}

## 📋 ¿Qué es este documento?

Este documento refleja el **estado actual de implementación del prototipo {NOMBRE}** comparado contra su PRD oficial.

**Identifica 3 tipos de gaps:**

1. **✅ Implementadas** - Funcionalidades 100% completas (HTML + CSS + JavaScript funcional)
2. **⚠️ Visuales sin lógica** - Elementos HTML/CSS listos, pero falta JavaScript para funcionar
3. **❌ Faltantes** - Funcionalidades sin HTML ni JavaScript (TODO por hacer)

**Propósito:** Saber exactamente qué falta implementar para que el prototipo esté al día con el PRD y sea presentable a Carlos.

---

**Fecha**: {FECHA}
**Archivos verificados**:
- `prototipos/{modulo}.html`
- `prototipos/assets/{modulo}/script.js`
- `prd/{modulo}.html`

**Verificación:** Revisión exhaustiva línea por línea del PRD. Ninguna funcionalidad inventada.

---

## ✅ IMPLEMENTADAS (HTML + JS funcional) - X funcionalidades

[Listar funcionalidades agrupadas por tipo]

---

## ⚠️ VISUALES SIN LÓGICA (HTML existe, falta JS) - X funcionalidades

### Alta prioridad
[Funcionalidades con PRD reference, ubicación, qué falta, complejidad]

---

## ❌ FALTANTES (Ni HTML ni JS) - X funcionalidades

[Funcionalidades documentadas en PRD sin implementar]

---

## 📊 Resumen Cuantitativo

| Categoría | Cantidad | % |
|-----------|----------|---|
| ✅ Implementadas | X | X% |
| ⚠️ Visuales sin lógica | X | X% |
| ❌ Faltantes | X | X% |
| **TOTAL** | **X** | **100%** |

---

## 🎯 Roadmap Implementación

### Sprint 1 - CRÍTICOS (Xh)
[Funcionalidades prioritarias]

### Sprint 2 - IMPORTANTES (Xh)
[Funcionalidades secundarias]

---

## ✅ VERIFICACIÓN EXHAUSTIVA

Este documento fue verificado línea por línea contra:
- `prd/{modulo}.html` completo
- `prototipos/{modulo}.html`
- `prototipos/assets/{modulo}/script.js`

**Todas las funcionalidades listadas están documentadas en el PRD.**
**No se inventó ninguna funcionalidad.**
```

## Reglas CRÍTICAS

### ❌ NUNCA hacer:
1. **NO inventar funcionalidades** - Solo listar lo que está en el PRD
2. **NO asumir** - Si no está en el PRD, no existe
3. **NO usar agentes** para validación inicial - Revisar manualmente primero
4. **NO crear múltiples documentos** - Solo uno: ESTADO-{MODULO}.md

### ✅ SIEMPRE hacer:
1. **Leer PRD completo** antes de clasificar
2. **Referenciar líneas específicas** del PRD en cada funcionalidad
3. **Verificar HTML Y JavaScript** antes de clasificar
4. **Incluir complejidad estimada** (Baja/Media/Alta)
5. **Agregar descripción clara** al inicio del documento

## Ejemplo de uso

```
Usuario: "Quiero analizar el estado del módulo Cotizador"

Pasos:
1. Leer prd/cotizador-especificacion.html completo
2. Extraer todas las funcionalidades (filtros, buscador, cálculos, etc.)
3. Leer prototipos/cotizador.html
4. Leer prototipos/assets/cotizador/script.js
5. Clasificar cada funcionalidad en las 3 categorías
6. Generar docs/ESTADO-COTIZADOR.md
```

## Validación final

Antes de entregar el documento, verificar:
- [ ] Descripción clara al inicio
- [ ] Solo funcionalidades del PRD (nada inventado)
- [ ] Cada funcionalidad tiene referencia al PRD (sección/línea)
- [ ] Clasificación correcta (✅/⚠️/❌)
- [ ] Resumen cuantitativo calculado
- [ ] Roadmap de implementación incluido
- [ ] Documento nombrado correctamente: ESTADO-{MODULO}.md
