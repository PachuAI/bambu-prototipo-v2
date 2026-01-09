# TAREA: Convertir PRDs de HTML a Markdown

## CONTEXTO DEL PROYECTO

Estamos en: `C:\laragon\www\bambu_v2\bambu_v2_prototipo\`

Estructura relevante:
```
bambu_v2_prototipo/
├── prd/                    ← HTML ORIGINAL (fuente, NO modificar)
│   ├── index.html
│   ├── dashboard.html
│   ├── cotizador-especificacion.html
│   ├── clientes.html
│   ├── cuenta-corriente.html
│   ├── productos.html
│   ├── ventas.html
│   ├── repartos-dia.html
│   ├── estadisticas.html
│   ├── configuracion.html
│   └── backup.html
│
└── docs/
    └── prd/                ← MARKDOWN NUEVO (a crear)
        ├── README.md       ← Explicación + checklist de progreso
        ├── index.md
        ├── dashboard.md
        └── ... etc
```

**IMPORTANTE**:
- La carpeta `prd/` (raíz) contiene los HTML ORIGINALES validados con el cliente. NO SE MODIFICAN.
- La carpeta `docs/prd/` contendrá las versiones MARKDOWN para consumo de IA/Claude.
- NO son duplicados, son FORMATOS DIFERENTES para PROPÓSITOS DIFERENTES.

---

## PASO 0: CREAR ESTRUCTURA Y README

Antes de convertir cualquier archivo, crear:

### 0.1 Crear carpeta
```bash
mkdir -p docs/prd
```

### 0.2 Crear README.md con el siguiente contenido EXACTO:

```markdown
# PRD - Versión Markdown

## ¿Por qué existe esta carpeta?

Esta carpeta contiene la **versión Markdown** de los PRDs del sistema Bambu CRM v2.

### Dos versiones, dos propósitos:

| Ubicación | Formato | Propósito |
|-----------|---------|-----------|
| `/prd/` | HTML | Visualización para clientes. Bonito, navegable, con estilos. |
| `/docs/prd/` | Markdown | Consumo por IA/Claude. Limpio, sin ruido, eficiente en tokens. |

### Fuente de verdad

Los **HTML son la fuente de verdad**. Los Markdown son una conversión 1:1 sin modificaciones de contenido.

Si hay discrepancia entre HTML y Markdown, el HTML tiene razón.

## Progreso de Conversión

| Archivo HTML | Archivo MD | Estado |
|--------------|------------|--------|
| `index.html` | `index.md` | ⬜ Pendiente |
| `dashboard.html` | `dashboard.md` | ⬜ Pendiente |
| `cotizador-especificacion.html` | `cotizador.md` | ⬜ Pendiente |
| `clientes.html` | `clientes.md` | ⬜ Pendiente |
| `cuenta-corriente.html` | `cuenta-corriente.md` | ⬜ Pendiente |
| `productos.html` | `productos.md` | ⬜ Pendiente |
| `ventas.html` | `ventas.md` | ⬜ Pendiente |
| `repartos-dia.html` | `repartos-dia.md` | ⬜ Pendiente |
| `estadisticas.html` | `estadisticas.md` | ⬜ Pendiente |
| `configuracion.html` | `configuracion.md` | ⬜ Pendiente |
| `backup.html` | `backup.md` | ⬜ Pendiente |

**Leyenda:** ⬜ Pendiente | 🔄 En proceso | ✅ Completado

## Cómo continuar el trabajo

Si retomás esta tarea después de un clear de contexto:

1. Leer este README para entender el estado
2. Ver la tabla de progreso arriba
3. Continuar con el siguiente archivo "⬜ Pendiente"
4. Al completar cada archivo, actualizar la tabla (⬜ → ✅)

## Reglas de conversión

- NO inventar contenido
- NO omitir contenido
- NO interpretar ni "mejorar" el texto
- Mantener texto EXACTO, solo cambiar formato HTML → Markdown
- Ignorar: estilos CSS, scripts JS, navegación sidebar
```

### 0.3 Confirmar creación
Después de crear el README, reportar:
```
✓ Carpeta docs/prd/ creada
✓ README.md creado con checklist de progreso
```

---

## REGLAS ABSOLUTAS DE CONVERSIÓN (NO NEGOCIABLES)

1. **NO INVENTAR**: Si algo no está en el HTML, NO lo agregues al Markdown
2. **NO OMITIR**: Si algo está en el HTML, DEBE estar en el Markdown
3. **NO INTERPRETAR**: No "mejores" ni "resumas" el texto. Copia tal cual
4. **NO CAMBIAR PALABRAS**: Mantené el texto exacto, solo cambia el formato
5. **IGNORAR**: Estilos CSS, clases, scripts, navegación del sidebar, headers/footers repetitivos

---

## ARCHIVOS A PROCESAR (en este orden)

```
FUENTE (en /prd/)                    → DESTINO (en /docs/prd/)
─────────────────────────────────────────────────────────────
index.html                           → index.md
dashboard.html                       → dashboard.md
cotizador-especificacion.html        → cotizador.md
clientes.html                        → clientes.md
cuenta-corriente.html                → cuenta-corriente.md
productos.html                       → productos.md
ventas.html                          → ventas.md
repartos-dia.html                    → repartos-dia.md
estadisticas.html                    → estadisticas.md
configuracion.html                   → configuracion.md
backup.html                          → backup.md
```

---

## PROCESO PARA CADA ARCHIVO

### Paso 1: Leer el HTML completo
```
Usar herramienta Read para leer: prd/[nombre].html
```

### Paso 2: Identificar contenido útil
Buscar el contenido dentro de `<main>` o `<section>` o `<article>`.

**IGNORAR:**
- `<nav>` (navegación lateral)
- `<style>` (estilos)
- `<script>` (código JS)
- Clases CSS y atributos style=""
- Headers/footers repetitivos

### Paso 3: Convertir a Markdown

| HTML | Markdown |
|------|----------|
| `<h1>` | `#` |
| `<h2>` | `##` |
| `<h3>` | `###` |
| `<h4>` | `####` |
| `<p>` | texto normal con línea vacía |
| `<ul><li>` | `- item` |
| `<ol><li>` | `1. item` |
| `<strong>` o `<b>` | `**texto**` |
| `<em>` o `<i>` | `*texto*` |
| `<code>` | `` `código` `` |
| `<table>` | tabla markdown |
| `<a href="archivo.html">` | `[texto](archivo.md)` (cambiar .html por .md) |
| `<blockquote>` | `> texto` |

### Paso 4: Escribir el archivo Markdown
```
Usar herramienta Write para crear: docs/prd/[nombre].md
```

Cada archivo debe comenzar con:
```markdown
# [Título de la sección]

> **Fuente**: `prd/[nombre-archivo].html`
> **Tipo**: Conversión automática - No editar manualmente

---

[contenido convertido]
```

### Paso 5: Actualizar README
Después de completar cada archivo, editar `docs/prd/README.md`:
- Cambiar ⬜ por ✅ en la fila correspondiente

### Paso 6: Reportar
```
✓ [nombre].md convertido
✓ README.md actualizado
```

---

## EJEMPLO DE CONVERSIÓN

### HTML Original:
```html
<section id="dashboard">
    <h2>3.1 Dashboard</h2>
    <p><strong>Descripción:</strong> Pantalla principal al ingresar al sistema.</p>
    <ul>
        <li>✅ Buscador global rápido</li>
        <li>✅ Carrusel de calendario</li>
    </ul>
</section>
```

### Markdown Resultante:
```markdown
## 3.1 Dashboard

**Descripción:** Pantalla principal al ingresar al sistema.

- ✅ Buscador global rápido
- ✅ Carrusel de calendario
```

---

## PROHIBICIONES EXPLÍCITAS

❌ NO agregar comentarios propios
❌ NO agregar secciones que no existan en el HTML
❌ NO cambiar el orden de las secciones
❌ NO resumir contenido
❌ NO expandir contenido
❌ NO corregir "errores" que veas en el texto original
❌ NO agregar emojis que no estén en el original
❌ NO quitar emojis que estén en el original
❌ NO modificar los archivos HTML originales

---

## ORDEN DE EJECUCIÓN

1. ✅ Crear carpeta `docs/prd/`
2. ✅ Crear `README.md` con checklist
3. Procesar archivos en orden (index.html primero, luego alfabético por módulo)
4. Después de CADA archivo: actualizar checklist en README.md
5. Al finalizar TODO: reportar resumen completo

---

## SI SE INTERRUMPE LA TAREA

Si necesitás continuar en otra sesión:
1. Leer `docs/prd/README.md`
2. Ver qué archivos tienen ⬜ (pendientes)
3. Continuar desde el primero pendiente
4. Seguir las mismas reglas

---

## COMENZAR

1. Crear la carpeta `docs/prd/`
2. Crear el `README.md` con el contenido especificado arriba
3. Comenzar con `index.html` → `index.md`
4. Reportar progreso después de cada archivo
