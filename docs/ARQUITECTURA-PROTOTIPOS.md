# Arquitectura de Prototipos - Bambu CRM V2

**Fecha**: 03 Enero 2026
**Última actualización**: 03 Enero 2026

---

## 🎯 Propósito

Este documento aclara la **arquitectura real de los prototipos HTML**, diferenciando entre:
- **Módulos independientes** (tienen su propio archivo HTML)
- **Módulos integrados** (están dentro de otros módulos como pestañas/secciones)

**IMPORTANTE**: Los PRDs documentan módulos conceptuales, pero los prototipos implementan la UX real que puede combinar varios módulos en una sola pantalla.

---

## 📁 Prototipos Independientes

### 1. `prototipos/index.html`
- **Tipo**: Índice navegable
- **Función**: Links a todos los prototipos
- **No es un módulo**: Solo navegación

### 2. `prototipos/dashboard.html`
- **Módulo**: Dashboard
- **PRD**: `prd/dashboard.html`
- **Contenido**:
  - Buscador global
  - Calendario semanal
  - Pedidos del día
  - Alertas stock bajo
  - Accesos rápidos

### 3. `prototipos/cotizador.html`
- **Módulo**: Cotizador
- **PRD**: `prd/cotizador-especificacion.html`
- **Contenido**:
  - Crear cotizaciones/pedidos
  - Modos REPARTO/FÁBRICA
  - Listas de precios híbridas
  - Método de pago

### 4. `prototipos/ventas.html`
- **Módulo**: Ventas (fusiona Pedidos + Histórico + Calendario Repartos)
- **PRD**: `prd/ventas.html`
- **Contenido**:
  - 3 pestañas: Lista Pedidos | Borradores | Calendario Semana
  - Filtros combinables
  - Modal "Marcar Entregado"
  - Modal "Editar Pedido"
  - Modal "Ver Detalle"
  - Navegación a repartos-dia.html

### 5. `prototipos/repartos-dia.html`
- **Módulo**: Vista Detalle Día Reparto
- **PRD**: Integrado en `prd/ventas.html` sección 3.8.11
- **Contenido**:
  - Vista Por Vehículo / Por Ciudad
  - Asignación de pedidos a vehículos
  - Barras capacidad
  - Exportar hoja reparto

### 6. `prototipos/clientes.html`
- **Módulo**: Listado de Clientes
- **PRD**: `prd/clientes.html`
- **Contenido**:
  - Tabla clientes
  - Búsqueda/filtros
  - Navegación a cliente-detalle.html

---

## 🔗 Prototipos con Módulos Integrados

### 7. `prototipos/cliente-detalle.html` ⭐ IMPORTANTE

**Módulos que contiene**:
1. **Clientes** (vista detalle) - PRD: `prd/clientes.html`
2. **Cuenta Corriente** (pestaña integrada) ⭐ - PRD: `prd/cuenta-corriente.html`

**Arquitectura interna**:
```
cliente-detalle.html
├── Header (datos cliente)
├── Pestañas:
│   ├── [Tab 1] Cuenta Corriente ⭐
│   │   ├── Tabla movimientos (cargos/pagos)
│   │   ├── Detalle expandible
│   │   └── Modal "Registrar Pago"
│   ├── [Tab 2] Historial de Pedidos
│   │   └── Lista pedidos del cliente
│   └── [Tab 3] Información
│       └── Datos contacto/comerciales
```

**Por qué está integrado**:
- **Decisión UX**: Cuenta Corriente es información específica de cada cliente
- **Contexto**: Al ver un cliente, se necesita acceso inmediato a su CC
- **Navegación**: Evita saltos entre módulos para consultar saldo/pagos
- **Sincronización**: Pagos se reflejan instantáneamente en ambas vistas

---

## ❌ Módulos SIN Prototipo (Pendientes)

Estos módulos tienen PRD completo pero NO tienen prototipo HTML:

1. **Productos y Stock** - PRD: `prd/productos.html`
   - Falta crear: `prototipos/productos.html`
   - Contenido: CRUD productos, drag & drop orden, alertas stock

2. **Estadísticas** - PRD: `prd/estadisticas.html`
   - Falta crear: `prototipos/estadisticas.html`
   - Contenido: Ventas por producto, gráficos, exportar Excel

3. **Configuración** - PRD: `prd/configuracion.html`
   - Falta crear: `prototipos/configuracion.html`
   - Contenido: CRUD vehículos, ciudades, listas precio, comportamiento stock

4. **Backup y Logs** - PRD: `prd/backup.html`
   - Falta crear: `prototipos/backup.html`
   - Contenido: Respaldos DB, logs accesos, logs cambios stock

---

## 🔍 Diferencia PRD vs Prototipo

| Aspecto | PRD | Prototipo |
|---------|-----|-----------|
| **Enfoque** | Módulo conceptual independiente | UX real con integración de módulos |
| **Cuenta Corriente** | Módulo separado documentado | Integrado en cliente-detalle.html |
| **Repartos** | Módulo separado (v1) | Vista integrada en Ventas (v2) |
| **Calendario** | Subsección de Repartos | Tab dentro de ventas.html |

**Regla de oro**:
- El **PRD** documenta **QUÉ** hace cada módulo (funcionalidad)
- El **Prototipo** implementa **CÓMO** se presenta al usuario (UX)

---

## 📊 Resumen de Módulos

| Módulo PRD | Prototipo | Ubicación Real |
|------------|-----------|----------------|
| Dashboard | ✅ Independiente | `dashboard.html` |
| Cotizador | ✅ Independiente | `cotizador.html` |
| Ventas | ✅ Independiente | `ventas.html` (fusiona Pedidos+Histórico+Calendario) |
| Repartos (día) | ✅ Independiente | `repartos-dia.html` (vista desde ventas) |
| Clientes (listado) | ✅ Independiente | `clientes.html` |
| Clientes (detalle) | ✅ Independiente | `cliente-detalle.html` |
| **Cuenta Corriente** | ✅ **Integrado** | **`cliente-detalle.html` → Tab "Cuenta Corriente"** ⭐ |
| Productos | ❌ Pendiente | `productos.html` (falta crear) |
| Estadísticas | ❌ Pendiente | `estadisticas.html` (falta crear) |
| Configuración | ❌ Pendiente | `configuracion.html` (falta crear) |
| Backup | ❌ Pendiente | `backup.html` (falta crear) |

---

## ✅ Checklist de Verificación

Antes de decir que "falta implementar Cuenta Corriente", verificar:

- [ ] ¿Existe `cuenta-corriente.html` independiente? → **NO** ✅ Correcto
- [ ] ¿Está en `cliente-detalle.html`? → **SÍ** ✅ Implementado
- [ ] ¿Tiene modal "Registrar Pago"? → **SÍ** ✅ Completo
- [ ] ¿Tabla movimientos funcional? → **SÍ** ✅ Con expandibles
- [ ] ¿Sincroniza con Ventas? → **SÍ** ✅ Bidireccional

**Conclusión**: Cuenta Corriente está 100% implementado, solo que integrado en cliente-detalle.html.

---

**Última actualización**: 03 Enero 2026
**Mantenido por**: Giuliano (desarrollador)
**Para**: Carlos (cliente) + futuro desarrollo Laravel
