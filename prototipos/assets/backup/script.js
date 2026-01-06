/**
 * ============================================================================
 * BACKUP Y LOGS - Script Principal
 * ============================================================================
 *
 * PRD: prd/backup.html
 * Módulo: Backup y Logs
 *
 * Secciones:
 * - Backup (Crear, Descargar, Restaurar)
 * - Logs (Filtrar, Consultar)
 *
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Backup V2 Loaded');

    // Inicializar tabs
    setupTabs();

    // Cargar datos iniciales
    renderizarBackups();
    renderizarLogs();

    // Establecer fechas por defecto en filtros
    setDefaultDates();

});

// ============================================================================
// TABS - Navegación entre secciones
// ============================================================================

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById('tab-' + tabId).classList.add('active');
        });
    });
}

// ============================================================================
// BACKUPS - CRUD
// PRD: prd/backup.html - Sección 3.2
// ============================================================================

/**
 * Renderiza la tabla de backups desde BACKUPS (mock-data.js)
 *
 * LÓGICA:
 * - Muestra fecha formateada, tamaño en MB, tipo (badge)
 * - Botones descargar/eliminar por fila
 */
function renderizarBackups() {
    const tbody = document.getElementById('tabla-backups');
    const countEl = document.getElementById('backup-count');
    if (!tbody || typeof BACKUPS === 'undefined') return;

    tbody.innerHTML = BACKUPS.map(b => {
        // Formatear fecha
        const fecha = new Date(b.fecha);
        const fechaStr = fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ' ' + fecha.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Formatear tamaño (bytes a MB)
        const tamanoMB = (b.tamanoBytes / (1024 * 1024)).toFixed(2);

        // Badge tipo
        const tipoClass = b.tipo.toLowerCase();
        const tipoIcon = b.tipo === 'MANUAL' ? 'fa-hand-pointer' : 'fa-clock';

        return `
            <tr>
                <td><strong>${fechaStr}</strong></td>
                <td>${tamanoMB} MB</td>
                <td>
                    <span class="badge-tipo ${tipoClass}">
                        <i class="fas ${tipoIcon}"></i> ${b.tipo}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon-sm btn-download" title="Descargar" onclick="descargarBackup(${b.id})">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-icon-sm btn-delete" title="Eliminar" onclick="eliminarBackup(${b.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    countEl.textContent = `${BACKUPS.length} respaldos`;
}

/**
 * Crea un nuevo backup manual
 *
 * PRD sección 4.1:
 * - Genera dump de base de datos
 * - Archivo se descarga automáticamente
 * - Queda registrado en historial
 */
function crearBackup() {
    // Simular creación de backup
    const ahora = new Date();
    const fechaStr = ahora.toISOString().replace('T', ' ').substring(0, 19);

    const nuevoBackup = {
        id: Math.max(...BACKUPS.map(b => b.id)) + 1,
        fecha: fechaStr,
        tamanoBytes: Math.floor(Math.random() * 500000) + 2400000, // 2.4-2.9 MB
        tipo: 'MANUAL'
    };

    // Agregar al inicio del array
    BACKUPS.unshift(nuevoBackup);

    // Refrescar tabla
    renderizarBackups();

    // Simular descarga
    const nombreArchivo = `bambu_backup_${ahora.toISOString().substring(0,10)}_${ahora.toTimeString().substring(0,8).replace(/:/g, '-')}.sql`;

    console.log('✅ Backup creado:', nombreArchivo);
    alert(`✅ Backup creado correctamente\n\nArchivo: ${nombreArchivo}\n\n(En producción se descargaría automáticamente)`);
}

/**
 * Descarga un backup existente
 */
function descargarBackup(id) {
    const backup = BACKUPS.find(b => b.id === id);
    if (!backup) return;

    const fecha = new Date(backup.fecha);
    const nombreArchivo = `bambu_backup_${fecha.toISOString().substring(0,10)}.sql`;

    console.log('📥 Descargando backup:', nombreArchivo);
    alert(`📥 Descargando: ${nombreArchivo}\n\n(En producción se descargaría el archivo real)`);
}

/**
 * Elimina un backup del historial
 *
 * PRD sección 4.1:
 * - Confirmar antes de eliminar
 * - Eliminar archivo del servidor
 */
function eliminarBackup(id) {
    const backup = BACKUPS.find(b => b.id === id);
    if (!backup) return;

    const fecha = new Date(backup.fecha);
    const fechaStr = fecha.toLocaleDateString('es-AR');

    if (confirm(`¿Eliminar backup del ${fechaStr}?\n\nEsta acción no se puede deshacer.`)) {
        const idx = BACKUPS.findIndex(b => b.id === id);
        BACKUPS.splice(idx, 1);
        renderizarBackups();
        console.log('🗑️ Backup eliminado');
        alert('✅ Backup eliminado');
    }
}

// ============================================================================
// RESTAURAR BACKUP
// PRD: prd/backup.html - Sección 4.2
// ============================================================================

/**
 * Abre modal para restaurar backup
 */
function abrirModalRestaurar() {
    document.getElementById('modal-restaurar').classList.remove('hidden');
    document.getElementById('archivo-restaurar').value = '';
}

/**
 * Cierra modal de restaurar
 */
function cerrarModalRestaurar() {
    document.getElementById('modal-restaurar').classList.add('hidden');
}

/**
 * Confirma y ejecuta restauración
 *
 * PRD sección 4.2:
 * - Solo archivos .sql permitidos
 * - Crea backup de seguridad antes de restaurar
 * - Sobrescribe todos los datos actuales
 */
function confirmarRestaurar() {
    const archivoInput = document.getElementById('archivo-restaurar');

    if (!archivoInput.files.length) {
        alert('⚠️ Debe seleccionar un archivo');
        return;
    }

    const archivo = archivoInput.files[0];
    const extensionesValidas = ['.sql', '.sql.gz', '.zip'];
    const extension = archivo.name.substring(archivo.name.lastIndexOf('.')).toLowerCase();

    // Validar extensión
    if (!extensionesValidas.some(ext => archivo.name.toLowerCase().endsWith(ext))) {
        alert('⚠️ Formato de archivo no válido\n\nFormatos permitidos: .sql, .sql.gz, .zip');
        return;
    }

    // Validar tamaño (100 MB máx)
    const maxSize = 100 * 1024 * 1024;
    if (archivo.size > maxSize) {
        alert('⚠️ El archivo excede el tamaño máximo de 100 MB');
        return;
    }

    // Confirmación final
    if (confirm(`⚠️ ATENCIÓN\n\nVa a restaurar desde: ${archivo.name}\n\nEsto sobrescribirá TODOS los datos actuales.\n\n¿Está seguro de continuar?`)) {
        // Simular proceso de restauración
        console.log('🔄 Restaurando desde:', archivo.name);

        // Cerrar modal
        cerrarModalRestaurar();

        // Simular proceso
        alert(`✅ Restauración completada\n\nSe restauraron los datos desde:\n${archivo.name}\n\n(En producción se ejecutaría el SQL real)`);
    }
}

// ============================================================================
// LOGS - Consulta y Filtros
// PRD: prd/backup.html - Sección 3.3
// ============================================================================

// Variable para almacenar logs filtrados
let logsFiltrados = [];

/**
 * Establece fechas por defecto en filtros (última semana)
 */
function setDefaultDates() {
    const hoy = new Date();
    const hace7dias = new Date(hoy);
    hace7dias.setDate(hace7dias.getDate() - 7);

    document.getElementById('log-desde').value = hace7dias.toISOString().substring(0, 10);
    document.getElementById('log-hasta').value = hoy.toISOString().substring(0, 10);
}

/**
 * Renderiza la tabla de logs
 *
 * LÓGICA:
 * - Muestra fecha/hora, usuario, tipo (badge), descripción, IP
 * - Ordenado por fecha descendente
 */
function renderizarLogs(logs = null) {
    const tbody = document.getElementById('tabla-logs');
    const countEl = document.getElementById('logs-count');
    if (!tbody) return;

    // Usar logs filtrados o todos
    const data = logs || (typeof LOGS_SISTEMA !== 'undefined' ? LOGS_SISTEMA : []);

    tbody.innerHTML = data.map(log => {
        // Formatear fecha
        const fecha = new Date(log.fecha);
        const fechaStr = fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ' ' + fecha.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Badge tipo
        const tipoClass = log.tipo.toLowerCase();
        let tipoIcon = 'fa-info-circle';
        if (log.tipo === 'ACCESO') tipoIcon = 'fa-sign-in-alt';
        if (log.tipo === 'STOCK') tipoIcon = 'fa-boxes';
        if (log.tipo === 'CONFIGURACION') tipoIcon = 'fa-cog';

        return `
            <tr>
                <td>${fechaStr}</td>
                <td>${log.usuario}</td>
                <td>
                    <span class="badge-tipo ${tipoClass}">
                        <i class="fas ${tipoIcon}"></i> ${log.tipo}
                    </span>
                </td>
                <td>${log.descripcion}</td>
                <td class="text-muted">${log.ip}</td>
            </tr>
        `;
    }).join('');

    countEl.textContent = `${data.length} eventos`;
}

/**
 * Aplica filtros a los logs
 *
 * PRD sección 3.3:
 * - Filtrar por rango de fechas
 * - Filtrar por usuario
 * - Filtrar por tipo de evento
 */
function aplicarFiltrosLogs() {
    if (typeof LOGS_SISTEMA === 'undefined') return;

    const desde = document.getElementById('log-desde').value;
    const hasta = document.getElementById('log-hasta').value;
    const usuario = document.getElementById('log-usuario').value;
    const tipo = document.getElementById('log-tipo').value;

    logsFiltrados = LOGS_SISTEMA.filter(log => {
        const fechaLog = new Date(log.fecha);

        // Filtro fecha desde
        if (desde) {
            const fechaDesde = new Date(desde);
            fechaDesde.setHours(0, 0, 0, 0);
            if (fechaLog < fechaDesde) return false;
        }

        // Filtro fecha hasta
        if (hasta) {
            const fechaHasta = new Date(hasta);
            fechaHasta.setHours(23, 59, 59, 999);
            if (fechaLog > fechaHasta) return false;
        }

        // Filtro usuario
        if (usuario && log.usuario !== usuario) return false;

        // Filtro tipo
        if (tipo && log.tipo !== tipo) return false;

        return true;
    });

    renderizarLogs(logsFiltrados);
    console.log(`📋 Filtros aplicados: ${logsFiltrados.length} resultados`);
}

/**
 * Limpia todos los filtros
 */
function limpiarFiltrosLogs() {
    document.getElementById('log-usuario').value = '';
    document.getElementById('log-tipo').value = '';
    setDefaultDates();
    renderizarLogs();
    console.log('🔄 Filtros limpiados');
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Cerrar modal con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModalRestaurar();
    }
});

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        cerrarModalRestaurar();
    }
});

console.log('✅ Backup V2 - Script cargado correctamente');
