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
| `index.html` | `index.md` | ✅ Completado |
| `dashboard.html` | `dashboard.md` | ✅ Completado |
| `cotizador-especificacion.html` | `cotizador.md` | ✅ Completado |
| `clientes.html` | `clientes.md` | ✅ Completado |
| `cuenta-corriente.html` | `cuenta-corriente.md` | ✅ Completado |
| `productos.html` | `productos.md` | ✅ Completado |
| `ventas.html` | `ventas.md` | ✅ Completado |
| `repartos-dia.html` | `repartos-dia.md` | ✅ Completado |
| `estadisticas.html` | `estadisticas.md` | ✅ Completado |
| `configuracion.html` | `configuracion.md` | ✅ Completado |
| `backup.html` | `backup.md` | ✅ Completado |

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
