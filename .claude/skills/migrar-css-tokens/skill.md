---
name: migrar-css-tokens
description: Migra un prototipo HTML del sistema CSS antiguo (common.css) al nuevo sistema de tokens.css + components.css. Crea backup, actualiza imports, extrae estilos específicos, verifica pixel-perfect y documenta cambios. Usa cuando necesites migrar prototipos al sistema de diseño nuevo.
---

# Migrar Prototipo a Sistema tokens.css + components.css

## Objetivo
Migrar un prototipo HTML del sistema CSS antiguo (`shared/common.css` + `assets/{modulo}/styles.css`) al nuevo sistema de diseño (`shared/tokens.css` + `shared/components.css` + `assets/{modulo}/{modulo}-specific.css`).

**Resultado esperado:** Prototipo visualmente idéntico (pixel-perfect) usando el nuevo sistema CSS.

---

## Pre-requisitos

Antes de migrar, verificar:
- [ ] `shared/tokens.css` existe y está completo
- [ ] `shared/components.css` existe y está completo
- [ ] Prototipo actual funciona correctamente
- [ ] No hay cambios sin commitear en el prototipo

---

## ⚠️ REGLA CRÍTICA - NO ELIMINAR HASTA APROBACIÓN EXPLÍCITA

**NUNCA eliminar archivos CSS viejos hasta:**
1. ✅ Usuario confirma visualmente que TODO funciona pixel-perfect
2. ✅ Comparación lado a lado backup vs nuevo aprobada
3. ✅ Usuario da **OK EXPLÍCITO** para eliminar archivos viejos

**El backup DEBE funcionar en todo momento para comparación.**

---

## Proceso paso a paso

### 1. Crear backup del prototipo

**Archivo:** `prototipos/{modulo}-backup.html`

```bash
cp prototipos/{modulo}.html prototipos/{modulo}-backup.html
```

**Validación:**
- [ ] Archivo backup existe
- [ ] Tamaño idéntico al original
- [ ] **CRÍTICO:** Abrir backup en navegador y verificar que funciona PERFECTAMENTE

---

### 1.5. **VERIFICAR BACKUP FUNCIONAL ANTES DE CONTINUAR**

**⚠️ DETENER si el backup no funciona correctamente:**

```bash
# Abrir backup en navegador
# Verificar visualmente que se ve IDÉNTICO al original
```

- [ ] Backup se ve idéntico al original
- [ ] Todos los estilos cargan correctamente
- [ ] No hay errores en consola
- [ ] Sidebar, header, contenido visible

**SI EL BACKUP NO FUNCIONA → NO CONTINUAR con la migración.**

---

### 2. Analizar CSS específico vs genérico

**Leer archivo actual:** `prototipos/assets/{modulo}/styles.css`

**Clasificar reglas en dos categorías:**

#### A. GENÉRICAS (Ya están en components.css)
- Clases reutilizables (`.btn`, `.modal`, `.table`, `.form-group`, etc.)
- Layouts comunes (`.grid-2-col`, `.sidebar`, `.header`)
- Utilidades (`.hidden`, `.text-center`, `.mt-1`)

**Acción:** Eliminar (ya no necesarias)

#### B. ESPECÍFICAS (Únicas del módulo)
- Selectores con nombre del módulo (`.ventas-header`, `.cotizador-products-table`)
- Estilos únicos no reutilizables
- Overrides específicos del módulo

**Acción:** Mover a nuevo archivo `{modulo}-specific.css`

---

### 3. Actualizar imports CSS en HTML

**Ubicación:** `<head>` del archivo `prototipos/{modulo}.html`

**ANTES:**
```html
<link rel="stylesheet" href="shared/common.css">
<link rel="stylesheet" href="assets/{modulo}/styles.css">
```

**DESPUÉS:**
```html
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="shared/components.css">
<link rel="stylesheet" href="assets/{modulo}/{modulo}-specific.css">
```

**Validación:**
- [ ] 3 imports en orden correcto (tokens → components → specific)
- [ ] Rutas correctas (relativas desde prototipos/)
- [ ] No quedaron imports antiguos

---

### 4. Crear archivo {modulo}-specific.css

**Ubicación:** `prototipos/assets/{modulo}/{modulo}-specific.css`

**Contenido:**
```css
/* ============================================
   {MODULO} - Estilos Específicos
   ============================================
   Sistema: tokens.css + components.css + {modulo}-specific.css
   Migrado: {FECHA}
   ============================================ */

/* Variables específicas del módulo (si aplica) */
:root {
  --{modulo}-color-primary: var(--color-primary);
  /* Solo si el módulo necesita variables únicas */
}

/* Estilos únicos del módulo */
.{modulo}-clase-especifica {
  /* ... */
}

/* Overrides necesarios */
.{modulo} .btn-primary {
  /* Solo si necesita override específico */
}
```

**Reglas para este archivo:**
1. **Solo estilos únicos del módulo** (no reutilizables)
2. **Usar variables CSS** de tokens.css (nunca hardcodear colores)
3. **Namespace con nombre del módulo** (`.ventas-`, `.cotizador-`, etc.)
4. **Comentar overrides** explicando por qué son necesarios
5. **Mantener ordenado** (variables → layout → componentes → overrides)

---

### 5. Verificación visual (Pixel-Perfect) - DETALLADA

**Método:**
1. Abrir `{modulo}-backup.html` en navegador (lado izquierdo)
2. Abrir `{modulo}.html` en otra pestaña/ventana (lado derecho)
3. Comparar lado a lado, sección por sección

**Checklist de verificación POR SECCIONES:**

#### 🔍 Sidebar (si aplica)
- [ ] **Ancho:** Idéntico (expandido: 240px, colapsado: 64px)
- [ ] **Toggle button:** COMPLETO (no cortado a la mitad)
- [ ] **Íconos:** Mismo tamaño (16px) y peso
- [ ] **Texto:** Mismo tamaño (14px) y font-weight (500/600)
- [ ] **Espaciado:** Entre items idéntico (margins, paddings)
- [ ] **Botón COTIZADOR:** Mismo alto (40px), padding, color
- [ ] **Hover:** Mismo color de fondo al pasar mouse
- [ ] **Colapsado:** Texto desaparece, íconos centrados

#### 🔍 Header
- [ ] **Altura:** Misma altura total
- [ ] **Elementos:** Alineados correctamente (verticalmente)
- [ ] **Búsqueda:** Input mismo tamaño, padding
- [ ] **Widgets derecha:** Campanita, avatar, etc. alineados

#### 🔍 Contenido principal
- [ ] **Cards:** Mismo tamaño, padding, sombras, bordes
- [ ] **Tablas:** Espaciado entre celdas, altura de rows
- [ ] **Botones:** Tamaño, padding, colores idénticos
- [ ] **Forms:** Inputs mismo alto, padding, bordes
- [ ] **Badges:** Mismo tamaño, colores, texto

#### 🔍 Modales (abrir y verificar)
- [ ] **Posición:** Centrados correctamente
- [ ] **Tamaño:** Ancho/alto idéntico
- [ ] **Backdrop:** Mismo color y opacidad
- [ ] **Contenido:** Espaciado interno correcto

#### 🔍 Colores
- [ ] **Backgrounds:** Idénticos (comparar con cuentagotas)
- [ ] **Textos:** Mismo color (#172b4d, #6b778c, etc.)
- [ ] **Bordes:** Mismo grosor (1px) y color (#ebecf0)
- [ ] **Hover states:** Funcionan igual

#### 🔍 Espaciado
- [ ] **Margins:** Entre elementos iguales
- [ ] **Paddings:** Internos iguales
- [ ] **Gaps:** En grids/flex iguales

#### 🔍 Responsive
- [ ] **Mobile** (< 768px): Layout correcto
- [ ] **Tablet** (768px - 1024px): Layout correcto
- [ ] **Desktop** (> 1024px): Layout correcto

#### 🔍 Estados interactivos
- [ ] **Hover:** Todos los elementos con hover funcionan
- [ ] **Active:** Estados activos se ven igual
- [ ] **Focus:** Focus en inputs/buttons igual
- [ ] **Disabled:** Elementos disabled se ven igual

**Si hay CUALQUIER diferencia:**
1. Usar DevTools (F12) → Inspector
2. Comparar estilos aplicados backup vs nuevo
3. Identificar qué propiedad CSS es diferente
4. Corregir en `{modulo}-specific.css` o `components.css`
5. Re-verificar TODO nuevamente

**NO marcar como completo si hay diferencias visibles.**

---

### 6. Probar funcionalidad JavaScript

**Verificar que TODO sigue funcionando:**

- [ ] Filtros se aplican correctamente
- [ ] Modales se abren/cierran
- [ ] Formularios validan
- [ ] Tablas se actualizan
- [ ] Botones ejecutan acciones
- [ ] Navegación entre vistas funciona
- [ ] Mock data carga correctamente

**Nota:** La migración CSS NO debe afectar JavaScript, pero verificar que no se rompieron selectores.

---

### 7. ⚠️ ESTRATEGIA DE ELIMINACIÓN DE CSS VIEJO

**IMPORTANTE:** NO eliminar CSS durante las migraciones. Eliminar TODO al final.

#### ¿Cuándo eliminar CSS viejo?

**OPCIÓN A: Eliminar TODO al final** ⭐ **RECOMENDADO**

```markdown
1. Migrar TODOS los prototipos (dashboard, ventas, clientes, etc.)
2. Verificar que TODOS funcionan con nuevo sistema
3. Pedir OK del usuario
4. ENTONCES eliminar CSS viejos en una sola pasada:
   rm assets/dashboard/styles.css
   rm assets/cotizador/styles.css
   rm assets/ventas/styles.css
   rm assets/clientes/styles.css
   rm shared/common.css
```

**Ventajas:**
- ✅ Backups siguen funcionando durante TODO el proceso
- ✅ Puedes comparar cualquier prototipo en cualquier momento
- ✅ Más seguro
- ✅ No hay riesgo de romper dependencias

**OPCIÓN B: Eliminar por módulo** ⚠️ **SOLO SI NO HAY DEPENDENCIAS**

Verificar ANTES de eliminar:

```bash
# Verificar si otros módulos importan este CSS
grep -r "assets/{modulo}/styles.css" prototipos/

# Verificar si otros prototipos lo usan
grep -r "{modulo}/styles.css" prototipos/*.html
```

**SOLO eliminar si:**
- [ ] No lo importa ningún otro CSS
- [ ] No lo usa ningún otro prototipo
- [ ] Usuario dio OK explícito
- [ ] Backup del módulo sigue funcionando

#### Checklist pre-eliminación

**ANTES de eliminar CUALQUIER CSS:**

1. **Verificar dependencias:**
   ```bash
   # ¿Qué archivos importan este CSS?
   grep -r "@import.*{modulo}" prototipos/assets/

   # ¿Qué HTML lo usa?
   grep -r "{modulo}/styles.css" prototipos/*.html
   ```

2. **Si hay dependencias:**
   - ⚠️ **NO ELIMINAR**
   - Esperar a migrar TODOS los módulos
   - Eliminar en limpieza final

3. **Si NO hay dependencias:**
   - Pedir OK del usuario
   - Verificar backup funcional
   - Eliminar
   - Re-verificar backup

**Validación POST-eliminación:**
- [ ] Prototipo NUEVO sigue funcionando
- [ ] Backup SIGUE funcionando (crítico)
- [ ] Otros prototipos NO se rompieron
- [ ] No quedan referencias huérfanas

**SI algo se rompe al eliminar:**
→ **RESTAURAR inmediatamente el CSS eliminado**

---

### 7.5. Limpieza final (después de migrar TODOS los módulos)

**Cuando TODOS los prototipos estén migrados:**

```bash
# 1. Verificar que todos usan nuevo sistema
grep -L "tokens.css" prototipos/*.html
# (no debería devolver nada)

# 2. Eliminar CSS viejos
rm prototipos/assets/*/styles.css
rm prototipos/shared/common.css

# 3. Verificar que TODOS los prototipos siguen funcionando
# Abrir cada uno en navegador y verificar

# 4. Eliminar backups (opcional, solo después de verificación completa)
rm prototipos/*-backup.html
```

---

### 8. Documentar cambios

**Archivo:** `docs/PLAN-MIGRACION-TOKENS.md`

**Agregar entrada:**

```markdown
### ✅ {MODULO} - Migrado {FECHA}

**Archivos:**
- ❌ `assets/{modulo}/styles.css` (eliminado)
- ✅ `assets/{modulo}/{modulo}-specific.css` (creado)

**Clases específicas:** {N} clases
**Imports actualizados:** tokens.css + components.css + {modulo}-specific.css

**Verificación:**
- [x] Pixel-perfect ✓
- [x] JavaScript funcional ✓
- [x] Responsive OK ✓

**Notas:**
- {Cualquier issue encontrado o decisión tomada}
```

**Actualizar README.md:**

```markdown
## Prototipos Migrados

- [x] dashboard.html
- [x] {modulo}.html  ← NUEVO
- [ ] otro-modulo.html
```

---

## Reglas CRÍTICAS

### ❌ NUNCA hacer:

1. **NO migrar sin backup** - Siempre crear `-backup.html` primero
2. **NO continuar si backup no funciona** - Debe verse idéntico al original
3. **NO eliminar CSS durante migraciones** - ⚠️ **Esperar a migrar TODOS los módulos**
4. **NO eliminar CSS con dependencias** - Verificar con grep primero
5. **NO eliminar si backup se rompe** - Restaurar inmediatamente
6. **NO hardcodear colores** - Usar variables CSS de tokens.css
7. **NO duplicar estilos** - Si está en components.css, NO repetir en specific
8. **NO romper responsive** - Verificar en mobile, tablet, desktop
9. **NO mezclar sistemas** - Migración completa o nada (no half-way)
10. **NO marcar completo si hay diferencias visuales** - Pixel-perfect estricto

### ✅ SIEMPRE hacer:

1. **Crear backup** antes de cualquier cambio
2. **Verificar backup funcional** antes de continuar migración
3. **Comparar lado a lado** backup vs nuevo durante TODO el proceso
4. **Usar DevTools** para debugging cuando hay diferencias
5. **Usar variables CSS** de tokens.css (--color-primary, --spacing-md, etc.)
6. **Verificar pixel-perfect** antes de marcar como completo
7. **Probar JavaScript** después de migrar CSS
8. **Pedir OK explícito** antes de eliminar archivos viejos
9. **Documentar cambios** en PLAN-MIGRACION-TOKENS.md
10. **Namespace clases específicas** con nombre del módulo

### 🚨 REGLAS DE ORO:

1. **"El backup DEBE funcionar SIEMPRE para poder comparar."**

2. **"NO eliminar CSS viejo hasta migrar TODOS los módulos."**

3. **"Verificar dependencias ANTES de eliminar cualquier archivo CSS."**

4. **"Pixel-perfect ESTRICTO antes de marcar como completo."**

---

## Orden de migración recomendado

**De simple a complejo:**

1. **dashboard.html** (75 clases) - 30min
2. **clientes.html** (48 clases) - 30min
3. **repartos-dia.html** (81 clases) - 45min
4. **cliente-detalle.html** (119 clases) - 1h
5. **ventas.html** (170 clases) - 1.5h
6. **cotizador.html** (102 clases) - 1h

**Total estimado:** 5-6 horas

---

## 🔍 Troubleshooting Visual

### Cuando algo se ve diferente entre backup y nuevo

**Proceso de debugging:**

1. **Usar DevTools (F12):**
   - Abrir backup y nuevo lado a lado
   - Inspeccionar elemento problemático en ambos
   - Comparar tab "Computed" → ver valores finales
   - Buscar qué propiedad CSS es diferente

2. **Problemas comunes:**

   **Overflow cortando elementos:**
   - `body { overflow: hidden; }` puede cortar elementos que sobresalen
   - `sidebar { overflow: hidden; }` corta botones posicionados fuera
   - **Solución:** Verificar overflow en contenedores padres

   **Z-index incorrecto:**
   - Elemento queda detrás de otros
   - **Solución:** Aumentar z-index o verificar stacking context

   **Position absolute/relative/fixed:**
   - Elemento mal posicionado
   - **Solución:** Verificar que contenedor padre tenga `position: relative`

   **Variables CSS con valores diferentes:**
   - `var(--spacing-md)` puede ser diferente entre sistemas
   - **Solución:** Verificar valor en `tokens.css`, considerar hardcodear temporalmente

   **Orden de carga CSS (especificidad):**
   - CSS cargado después sobrescribe anterior
   - **Solución:** Usar `!important` temporalmente o reorganizar imports

3. **Si el problema persiste > 15 minutos:**
   - ⏸️ **PAUSAR migración**
   - 💬 Consultar segunda opinión (otra IA, colega)
   - ⚠️ **NO eliminar CSS viejo**
   - 📝 Documentar el problema encontrado

---

## ⚠️ Variables CSS vs Hardcode

**Problema:** Variables CSS pueden tener valores sutilmente diferentes

**Ejemplo:**
```css
/* Viejo (funciona) */
.elemento {
  padding: 12px;
  color: #6b778c;
}

/* Nuevo (puede ser diferente) */
.elemento {
  padding: var(--spacing-md);  /* ¿Es 12px o 16px? */
  color: var(--text-secondary); /* ¿Es #6b778c exacto? */
}
```

**Solución:**
1. Verificar valor computado en DevTools
2. Si es diferente, ajustar variable en `tokens.css`
3. O hardcodear temporalmente para debugging
4. Usar cuentagotas de color para comparar píxeles exactos

---

## 🔄 Rollback (si migración falla)

**Si la migración tiene problemas irresolubles:**

### 1. Revertir imports HTML

```bash
# Copiar head del backup al archivo nuevo
head -15 prototipos/{modulo}-backup.html > temp-head.html
# Reemplazar manualmente en {modulo}.html
```

### 2. Restaurar CSS viejo (si se eliminó)

```bash
# Opción A: Desde git
git checkout assets/{modulo}/styles.css

# Opción B: Recrear desde backup conocido
cp assets/{otro-modulo}/styles.css assets/{modulo}/styles.css
# Adaptar manualmente
```

### 3. Eliminar archivos nuevos

```bash
rm assets/{modulo}/{modulo}-specific.css
```

### 4. Verificar que volvió a funcionar

- [ ] Prototipo funciona como antes
- [ ] No hay errores en consola
- [ ] Estilos cargan correctamente

### 5. Analizar qué falló

- Documentar problema encontrado
- Consultar con equipo/comunidad
- Reintentar migración cuando se identifique solución

---

## Troubleshooting (problemas específicos)

### Problema: Estilos rotos después de migrar

**Causa:** Clase genérica no existe en components.css

**Solución:**
1. Identificar qué clase falta (inspector navegador)
2. Buscar en `components.css` si existe con otro nombre
3. Si no existe, agregarla a `components.css`
4. Si es única del módulo, agregarla a `{modulo}-specific.css`

---

### Problema: Colores diferentes

**Causa:** Hardcodeo de colores vs variables CSS

**Solución:**
1. Abrir inspector y ver color actual
2. Buscar variable CSS equivalente en `tokens.css`
3. Reemplazar `#1e3a5f` por `var(--color-primary)`
4. **Verificar valor computado para confirmar**

---

### Problema: JavaScript roto

**Causa:** Selector CSS cambió y JS no lo encuentra

**Solución:**
1. Buscar en `script.js` qué selector usa: `document.querySelector('.clase-vieja')`
2. Verificar que `.clase-vieja` existe en HTML o renombrarla en JS
3. Si cambiaste clases, actualizar selectores en JS

---

### Problema: Toggle button cortado/tapado

**Causa:** `.main-layout` o algún contenedor hermano está tapando el botón que sobresale del sidebar

**Diagnóstico:**
```javascript
// En DevTools, verificar z-index de ancestros
let el = document.getElementById('btn-toggle-sidebar');
while (el) {
    const styles = getComputedStyle(el);
    console.log(`${el.tagName}.${el.className}: z-index=${styles.zIndex}`);
    el = el.parentElement;
}
```

**Solución:**
```css
/* En components.css */
.main-layout {
    position: relative;
    z-index: 0;  /* Permite que sidebar (z-index: 1000) esté por encima */
}
```

**Nota:** El botón usa `position: absolute; right: -12px;` para sobresalir. Si `.main-layout` (contenedor hermano del sidebar) no tiene z-index bajo, puede tapar el área donde el botón sobresale.

---

## Ejemplo completo de migración

### Dashboard (ejemplo paso a paso)

#### 1. Backup
```bash
cp prototipos/dashboard.html prototipos/dashboard-backup.html
```

#### 2. Analizar styles.css

**Genéricas (eliminar):**
```css
.btn-primary { ... }      ← Ya está en components.css
.table { ... }             ← Ya está en components.css
.modal-overlay { ... }     ← Ya está en components.css
```

**Específicas (mover):**
```css
.dashboard-stats-grid { ... }     ← Único del dashboard
.dashboard-quick-actions { ... }  ← Único del dashboard
.dashboard .stats-card { ... }    ← Override específico
```

#### 3. Actualizar HTML

```html
<!-- ANTES -->
<link rel="stylesheet" href="shared/common.css">
<link rel="stylesheet" href="assets/dashboard/styles.css">

<!-- DESPUÉS -->
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="shared/components.css">
<link rel="stylesheet" href="assets/dashboard/dashboard-specific.css">
```

#### 4. Crear dashboard-specific.css

```css
/* ============================================
   DASHBOARD - Estilos Específicos
   ============================================
   Sistema: tokens.css + components.css + dashboard-specific.css
   Migrado: 04/01/2026
   ============================================ */

/* Layout específico del dashboard */
.dashboard-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

/* Acciones rápidas */
.dashboard-quick-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

/* Override para stats cards en dashboard */
.dashboard .stats-card {
  border-left: 4px solid var(--color-primary);
}
```

#### 5. Verificar

- [x] Abrir dashboard.html vs dashboard-backup.html
- [x] Comparar visualmente
- [x] Probar filtros, modales, botones
- [x] Responsive mobile/tablet/desktop
- [x] TODO idéntico ✓

#### 6. Eliminar viejo

```bash
rm prototipos/assets/dashboard/styles.css
```

#### 7. Documentar

Actualizar `docs/PLAN-MIGRACION-TOKENS.md` con entrada del dashboard.

---

## Validación final

Antes de marcar migración como completa:

- [ ] Backup creado y funcional
- [ ] Imports actualizados (3 archivos CSS)
- [ ] Archivo `-specific.css` creado
- [ ] Verificación pixel-perfect pasada
- [ ] JavaScript funcional
- [ ] Responsive OK (mobile/tablet/desktop)
- [ ] Archivo CSS viejo eliminado
- [ ] Cambios documentados en PLAN-MIGRACION-TOKENS.md
- [ ] README.md actualizado con checkbox
- [ ] Commit realizado

---

## Mensaje de commit

```
feat: Migrar {modulo} a sistema tokens.css + components.css

- Crear {modulo}-specific.css con estilos únicos
- Actualizar imports HTML (tokens → components → specific)
- Eliminar assets/{modulo}/styles.css
- Verificación pixel-perfect ✓
- JavaScript funcional ✓
```

---

**Última actualización:** 05 Enero 2026
**Versión:** 2.1 (estrategia eliminación + troubleshooting z-index)
