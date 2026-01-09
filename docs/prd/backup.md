# PRD: Backup y Logs - Respaldos y auditoría del sistema

> **Fuente**: `prd/backup.html`
> **Tipo**: Conversión automática - No editar manualmente

---

**Química Bambu S.R.L.**

# PRD: Backup y Logs
**Respaldos y auditoría del sistema**

| | |
|---|---|
| **Versión** | 2.0 |
| **Fecha** | 31 Diciembre 2024 |
| **Estado** | ✅ Prototipado y validado (Enero 2026) |

**Nota:** Este PRD describe funcionalidades y reglas de negocio. Para referencia visual, ver el [prototipo HTML](../prototipos/backup.html).

## 1. Contexto y Objetivo

### 1.1 Propósito del módulo

El módulo **Backup y Logs** provee herramientas críticas para seguridad de datos y auditoría del sistema. Permite crear respaldos de la base de datos, restaurar desde respaldos existentes, y consultar logs de actividad del sistema.

### 1.2 Problema que resuelve

- Protección de datos mediante respaldos periódicos
- Recuperación ante fallas o pérdida de datos
- Auditoría de accesos y cambios críticos
- Trazabilidad de operaciones del sistema
- Cumplimiento de políticas de seguridad

### 1.3 Usuarios principales

- **Administrador:** Acceso completo (único usuario con acceso)
- **Vendedor:** SIN ACCESO (módulo exclusivo admin)

## 2. Funcionalidad Principal

### 2.1 Descripción general

El módulo se divide en 2 áreas principales:

- **Backup (Respaldos):** Crear y restaurar respaldos de la base de datos
- **Logs (Auditoría):** Consultar registros de accesos y cambios críticos

### 2.2 Características clave

- ✅ Crear respaldo manual de base de datos (dump SQL)
- ✅ Descargar archivo de respaldo (.sql o .zip)
- ✅ Restaurar desde respaldo (upload archivo)
- ✅ Historial de respaldos con fecha y tamaño
- ✅ Registro de accesos al sistema (login/logout)
- ✅ Registro de cambios críticos en stock
- ✅ Filtrado de logs por fecha, usuario, tipo de evento

## 3. Pestaña: Backup (Respaldos)

### 3.1 Sección superior

- Botón [Crear respaldo ahora]
- Botón [Restaurar desde archivo]

### 3.2 Historial de respaldos

**Columnas:**

| Fecha | Tamaño | Tipo | Acciones |
|-------|--------|------|----------|
| 31/12/2024 14:30 | 2.5 MB | MANUAL | [Descargar] [Eliminar] |
| 30/12/2024 23:00 | 2.4 MB | AUTOMATICO | [Descargar] [Eliminar] |

### 3.3 Crear respaldo

- Click en [Crear respaldo ahora]
- Sistema genera dump de base de datos (archivo .sql)
- Archivo se descarga automáticamente: `bambu_backup_YYYY-MM-DD_HH-MM-SS.sql`
- Backup queda registrado en historial

### 3.4 Restaurar desde archivo

- Click en [Restaurar desde archivo]
- Modal se abre con:
  - Input file (solo archivos .sql)
  - ⚠️ Advertencia: "Esta acción sobrescribirá todos los datos actuales. ¿Estás seguro?"
  - Botones: [Cancelar] [Restaurar]
- Usuario selecciona archivo .sql
- Click [Restaurar] → Sistema ejecuta SQL y restaura datos

**⚠️ Precaución:** Restaurar desde backup sobrescribe TODOS los datos actuales. Se recomienda crear un backup antes de restaurar.

## 4. Pestaña: Logs (Auditoría)

### 4.1 Filtros superiores

- Desde (fecha)
- Hasta (fecha)
- Usuario (dropdown)
- Tipo de evento (dropdown):
  - Todos
  - Accesos (login/logout)
  - Cambios en stock
  - Cambios en configuración
- Botones: [Aplicar filtros] [Limpiar filtros]

### 4.2 Tabla de logs

**Columnas:**

| Fecha/Hora | Usuario | Tipo | Descripción | IP |
|------------|---------|------|-------------|----|
| 31/12/2024 14:35 | admin@bambu.com | Stock | Ajuste manual: Detergente X (+100 un) | 192.168.1.100 |
| 31/12/2024 14:20 | admin@bambu.com | Acceso | Login exitoso | 192.168.1.100 |
| 30/12/2024 23:05 | admin@bambu.com | Configuración | Modificó lista L2: 6.25% → 7% | 192.168.1.100 |

**Ordenamiento:**

- Default: Por fecha descendente (más recientes primero)
- Clickeable en headers para ordenar por cualquier columna

### 4.3 Tipos de eventos registrados

**Accesos:**

- Login exitoso
- Login fallido (credenciales incorrectas)
- Logout

**Cambios en stock:**

- Ajuste manual de stock (ingreso/egreso)
- Stock negativo crítico (< -50 unidades, por ejemplo)

**Cambios en configuración:**

- Modificación de listas de precio
- Creación/edición/eliminación de vehículos
- Creación/edición/eliminación de ciudades
- Cambio de comportamiento de stock

**💡 Pendiente definir:** ¿Qué otros eventos se registrarán? (Eliminación de pedidos, cambios en cuenta corriente, etc.). Evaluar al prototipar.

## 5. Reglas de Negocio Específicas

### 5.1 Creación de backups

**Frecuencia recomendada:**

- Backup manual: A demanda del administrador
- Backup automático (opcional): Diario a las 23:00 (pendiente implementar)

**Contenido del backup:**

- Dump completo de la base de datos PostgreSQL
- Todas las tablas (pedidos, productos, clientes, configuración, logs, etc.)
- Formato: Archivo .sql con sentencias INSERT
- Compresión opcional: .sql.zip para reducir tamaño

**Almacenamiento:**

- Backups se guardan en servidor en carpeta `/backups`
- Administrador puede descargarlos localmente
- Retención: Mantener últimos 30 backups (eliminar automáticamente los más antiguos)

### 5.2 Restauración desde backup

**Validaciones:**

- Solo archivos .sql permitidos
- Tamaño máximo: 100 MB (ajustable según servidor)
- Advertencia obligatoria antes de confirmar

**Proceso:**

1. Sistema crea backup automático de seguridad antes de restaurar
2. Elimina todas las tablas existentes
3. Ejecuta sentencias SQL del archivo subido
4. Valida integridad de datos restaurados
5. Notifica éxito o error

**⚠️ Precaución:** Durante la restauración, el sistema debe estar en modo mantenimiento (bloquear accesos de otros usuarios).

### 5.3 Registro de logs

**Eventos que se registran:**

| Evento | Información registrada |
|--------|------------------------|
| **Login exitoso** | Usuario, IP, timestamp |
| **Login fallido** | Usuario intentado, IP, timestamp |
| **Logout** | Usuario, timestamp |
| **Ajuste stock manual** | Usuario, producto, cantidad anterior, cantidad nueva, motivo, timestamp |
| **Cambio configuración** | Usuario, parámetro modificado, valor anterior, valor nuevo, timestamp |

**Retención de logs:**

- Mantener logs de los últimos 365 días (1 año)
- Eliminar automáticamente logs más antiguos (opcional: archivar antes de eliminar)

## 6. Integración con Otros Módulos

### 6.1 Productos (Logs de stock)

**Relación:** Cambios en stock se registran en Logs

**Sincronización:**

- Al ajustar stock manualmente → Registro en tabla logs
- Al detectar stock negativo crítico → Registro en tabla logs

### 6.2 Configuración (Logs de cambios)

**Relación:** Cambios en configuración se registran en Logs

**Sincronización:**

- Al modificar listas de precio → Registro en tabla logs
- Al crear/editar/eliminar vehículo → Registro en tabla logs
- Al crear/editar/eliminar ciudad → Registro en tabla logs

### 6.3 Sistema de autenticación (Logs de accesos)

**Relación:** Accesos al sistema se registran en Logs

**Sincronización:**

- Al hacer login exitoso → Registro en tabla logs
- Al intentar login fallido → Registro en tabla logs
- Al hacer logout → Registro en tabla logs
