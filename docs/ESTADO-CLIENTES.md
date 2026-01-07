# ESTADO-CLIENTES.md - Auditoría Módulo Clientes

**Fecha**: 06 Enero 2026
**Prototipos**: `prototipos/clientes.html` + `prototipos/cliente-detalle.html`
**PRDs**: `prd/clientes.html` + `prd/cuenta-corriente.html`

---

## Resumen Cuantitativo

| Estado | Cantidad | % |
|--------|----------|---|
| ✅ Implementadas (HTML + JS) | 18 | 58% |
| ⚠️ Visuales sin lógica | 5 | 16% |
| ❌ Faltantes | 8 | 26% |

**Total funcionalidades**: 31

---

## DISCREPANCIAS PRD vs PROTOTIPO (PRD debe actualizarse)

| Aspecto | PRD dice | Prototipo tiene |
|---------|----------|-----------------|
| Columna Email en tabla | Visible | NO visible (solo en detalle/modal) |
| Columna Descuento en tabla | Visible con badge | NO visible (solo en header detalle) |
| Tab Historial Pedidos | Dentro de tab Info | Tab SEPARADO independiente |
| Campo Nota en modal | No mencionado | Campo textarea presente |
| Checkbox Activo en modal | No mencionado | Checkbox en header modal |
| Orden de tabs | Info + CC | CC + Historial + Info |
| Tab por defecto | Info | Cuenta Corriente |

---

## IMPLEMENTADAS (18 funcionalidades)

### Listado de Clientes (clientes.html)
1. ✅ Tabla con columnas: Dirección, Teléfono, Ciudad, Saldo (CC), Estado, Acciones
2. ✅ Renderizado dinámico desde mock-data
3. ✅ Formateo saldo con color (rojo negativo, verde positivo)
4. ✅ Badge estado ACTIVO/INACTIVO
5. ✅ Botones acciones: Editar, Ver, Eliminar
6. ✅ Click fila navega a detalle
7. ✅ Modal Nuevo Cliente completo
8. ✅ Toggle descuento (Sin desc. / L2 / L3)
9. ✅ Validación campos obligatorios
10. ✅ Modal Editar Cliente con precarga
11. ✅ Confirmación eliminación
12. ✅ Cerrar modales con Escape

### Cliente Detalle (cliente-detalle.html)
13. ✅ Sistema de 3 tabs funcional
14. ✅ Tab CC - Tabla movimientos
15. ✅ Detalle expandible movimientos
16. ✅ Productos en cargo expandido
17. ✅ Badge método pago
18. ✅ Botón "Ver" pedido

### Cuenta Corriente - Pagos
19. ✅ Modal Registrar Pago completo
20. ✅ Discriminación efectivo/digital
21. ✅ Modo mixto con split
22. ✅ Validación suma split
23. ✅ Radio pago genérico vs específico
24. ✅ Dropdown pedidos con pendiente
25. ✅ Validación monto excede pendiente
26. ✅ Cálculo saldo resultante

---

## VISUALES SIN LÓGICA (5 funcionalidades)

### 1. Filtros del header (clientes.html)
- **HTML**: ✅ Existe (buscador, estado, ciudad, saldo)
- **JS Falta**: Event listeners para filtrar tabla
- **Complejidad**: Media

### 2. Exportar Excel clientes
- **HTML**: No hay botón
- **JS Falta**: Función generar Excel
- **Complejidad**: Media

### 3. Botón "Nueva Cotización"
- **HTML**: ✅ Existe
- **JS actual**: `alert()` stub
- **JS Falta**: Redirigir a cotizador con cliente precargado
- **Complejidad**: Baja

### 4. Enviar Estado de Cuenta
- **HTML**: ✅ Existe botón
- **JS Falta**: Generar PDF/enviar email
- **Complejidad**: Alta

### 5. Exportar Excel Cuenta Corriente
- **HTML**: ✅ Existe botón
- **JS Falta**: Generar Excel movimientos
- **Complejidad**: Media

---

## FALTANTES (8 funcionalidades)

### 1. Validación dirección única
- No puede haber 2 clientes con misma dirección
- **Complejidad**: Baja

### 2. Validación formato email
- Si email se completa, validar formato
- **Complejidad**: Baja

### 3. Restricción eliminación con pedidos
- No eliminar si tiene pedidos asociados
- Mostrar mensaje explicativo
- **Complejidad**: Media

### 4. Ordenamiento por columnas
- Click en header ordena asc/desc
- **Complejidad**: Media

### 5. Integración Cotizador - seleccionar cliente
- Al seleccionar cliente, aplicar descuento automáticamente
- **Complejidad**: Baja

### 6. Persistencia de datos
- Guardar en backend/localStorage
- **Complejidad**: Alta

### 7. Sincronización CC ↔ Ventas
- Pagos en Ventas aparecen en CC y viceversa
- **Complejidad**: Alta

### 8. Guardar cambios Tab Información
- Botón existe pero sin función
- **Complejidad**: Baja

---

## Verificación Screenshots

### Screenshot 1 - Listado clientes
✅ Tabla con 12 clientes
✅ Columnas correctas
✅ Saldos con color
✅ Filtros en header
✅ Botón + Nuevo Cliente

### Screenshot 2 - Modal Nuevo Cliente
✅ Checkbox Activo
✅ Campos obligatorios marcados
✅ Toggle descuento 3 opciones
✅ Campo Nota presente

### Screenshot 3 - Tab Cuenta Corriente
✅ Header: dirección + ACTIVO + 10%
✅ 3 tabs visibles
✅ Tabla movimientos
✅ Panel SALDO ACTUAL -$130.000
✅ Acciones Financieras

### Screenshot 4 - Tab Historial Pedidos
✅ Tabla pedidos
✅ Estado ENTREGADO verde
✅ Botón ver detalle

### Screenshot 5 - Tab Información
✅ 2 columnas: Datos + Config Comercial
✅ Toggle descuento
✅ Botón Guardar Cambios

---

## Roadmap Sugerido

### Sprint 1 - Críticos
1. Filtros de clientes
2. Validación dirección única
3. Restricción eliminación con pedidos
4. Guardar cambios Tab Info

### Sprint 2 - Importantes
5. Ordenamiento columnas
6. Exportar Excel clientes
7. Validación email
8. Nueva Cotización con cliente

### Sprint 3 - Avanzados
9. Sincronización CC ↔ Ventas
10. Exportar Excel CC
11. Enviar Estado Cuenta
12. Persistencia datos

---

**Estado general: BUENO (58% implementado)**
**PRD necesita actualización significativa**
