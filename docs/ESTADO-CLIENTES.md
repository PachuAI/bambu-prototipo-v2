# ESTADO-CLIENTES.md - Auditoría Módulo Clientes

**Fecha**: 07 Enero 2026
**Prototipos**: `prototipos/clientes.html` + `prototipos/cliente-detalle.html`
**PRDs**: `prd/clientes.html` + `prd/cuenta-corriente.html`

---

## Resumen Cuantitativo

| Estado | Cantidad | % |
|--------|----------|---|
| ✅ Implementadas (HTML + JS) | 25 | 81% |
| ⚠️ Visuales sin lógica | 2 | 6% |
| ❌ Faltantes | 4 | 13% |

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

### Sprint 1 - Implementadas (07/01/2026)
27. ✅ Filtros de clientes (búsqueda, estado, ciudad, saldo combinados)
28. ✅ Restricción eliminación con pedidos asociados
29. ✅ Guardar cambios Tab Información (con BambuState.update)

### Sprint 2 - Implementadas (07/01/2026)
30. ✅ Ordenamiento por columnas (click header asc/desc)
31. ✅ Exportar Excel clientes (CSV UTF-8 compatible Excel)
32. ✅ Validación formato email
33. ✅ Nueva Cotización con cliente precargado

---

## VISUALES SIN LÓGICA (2 funcionalidades)

### 1. Enviar Estado de Cuenta
- **HTML**: ✅ Existe botón
- **JS Falta**: Generar PDF/enviar email
- **Complejidad**: Alta

### 2. Exportar Excel Cuenta Corriente
- **HTML**: ✅ Existe botón
- **JS Falta**: Generar Excel movimientos
- **Complejidad**: Media

---

## FALTANTES (4 funcionalidades)

### 1. Persistencia de datos
- Guardar en backend/localStorage
- **Complejidad**: Alta

### 2. Sincronización CC ↔ Ventas
- Pagos en Ventas aparecen en CC y viceversa
- **Complejidad**: Alta

### 3. Exportar Excel Cuenta Corriente
- Generar CSV/Excel de movimientos CC
- **Complejidad**: Media

### 4. Enviar Estado de Cuenta
- Generar PDF y/o enviar por email
- **Complejidad**: Alta

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

### Sprint 1 - Críticos ✅ COMPLETADO (07/01/2026)
1. ✅ Filtros de clientes (búsqueda, estado, ciudad, saldo)
2. ~~Validación dirección única~~ (descartado - direcciones pueden repetirse)
3. ✅ Restricción eliminación con pedidos
4. ✅ Guardar cambios Tab Info

### Sprint 2 - Importantes ✅ COMPLETADO (07/01/2026)
5. ✅ Ordenamiento columnas (click header asc/desc)
6. ✅ Exportar Excel clientes (CSV UTF-8)
7. ✅ Validación email
8. ✅ Nueva Cotización con cliente (redirige a cotizador)

### Sprint 3 - Avanzados (PENDIENTE)
9. Sincronización CC ↔ Ventas
10. Exportar Excel CC
11. Enviar Estado Cuenta
12. Persistencia datos

---

**Estado general: MUY BUENO (81% implementado)**
**PRD necesita actualización significativa**
