/**
 * ============================================================================
 * CONFIGURACIÓN - Script Principal
 * ============================================================================
 *
 * PRD: prd/configuracion.html
 * Módulo: Configuración General
 *
 * Tabs:
 * - Configuración: Vehículos (CRUD), Listas de Precio (CRUD), Stock (inline)
 * - Ciudades: CRUD
 *
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Configuración V2 Loaded');

    // Inicializar tabs
    setupTabs();

    // Cargar datos iniciales
    renderizarVehiculos();
    renderizarListas();
    renderizarCiudades();
    cargarConfigStock();

});

// ============================================================================
// TABS - Navegación entre secciones
// ============================================================================

/**
 * Configura la navegación por tabs
 */
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            // Activar tab clickeado
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById('tab-' + tabId).classList.add('active');
        });
    });
}

// ============================================================================
// VEHÍCULOS - CRUD
// PRD: prd/configuracion.html - Sección 3.2
// ============================================================================

/**
 * Renderiza la tabla de vehículos desde VEHICULOS (mock-data.js)
 *
 * LÓGICA:
 * - Muestra nombre, capacidad en kg, modelo (opcional), patente (opcional)
 * - Botones editar/eliminar por fila
 * - Si modelo o patente están vacíos, muestra "-"
 */
function renderizarVehiculos() {
    const tbody = document.getElementById('tabla-vehiculos');
    if (!tbody || typeof VEHICULOS === 'undefined') return;

    tbody.innerHTML = VEHICULOS.map(v => `
        <tr>
            <td><strong>${v.nombre}</strong></td>
            <td>${v.capacidadKg.toLocaleString('es-AR')} kg</td>
            <td>${v.modelo || '-'}</td>
            <td>${v.patente || '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon-sm btn-edit" title="Editar" onclick="editarVehiculo(${v.id})">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-icon-sm btn-delete" title="Eliminar" onclick="eliminarVehiculo(${v.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Abre modal para crear nuevo vehículo
 */
function abrirModalVehiculo() {
    document.getElementById('modal-vehiculo-titulo').innerHTML = '<i class="fas fa-truck"></i> Nuevo Vehículo';
    document.getElementById('vehiculo-id').value = '';
    document.getElementById('vehiculo-nombre').value = '';
    document.getElementById('vehiculo-capacidad').value = '';
    document.getElementById('vehiculo-modelo').value = '';
    document.getElementById('vehiculo-patente').value = '';
    document.getElementById('modal-vehiculo').classList.remove('hidden');
    document.getElementById('vehiculo-nombre').focus();
}

/**
 * Abre modal para editar vehículo existente
 */
function editarVehiculo(id) {
    const vehiculo = VEHICULOS.find(v => v.id === id);
    if (!vehiculo) return;

    document.getElementById('modal-vehiculo-titulo').innerHTML = '<i class="fas fa-truck"></i> Editar Vehículo';
    document.getElementById('vehiculo-id').value = id;
    document.getElementById('vehiculo-nombre').value = vehiculo.nombre;
    document.getElementById('vehiculo-capacidad').value = vehiculo.capacidadKg;
    document.getElementById('vehiculo-modelo').value = vehiculo.modelo || '';
    document.getElementById('vehiculo-patente').value = vehiculo.patente || '';
    document.getElementById('modal-vehiculo').classList.remove('hidden');
    document.getElementById('vehiculo-nombre').focus();
}

/**
 * Cierra modal de vehículo
 */
function cerrarModalVehiculo() {
    document.getElementById('modal-vehiculo').classList.add('hidden');
}

/**
 * Guarda vehículo (crear o actualizar)
 *
 * VALIDACIONES (PRD sección 4.1):
 * - Nombre: obligatorio, único
 * - Capacidad: obligatorio, mayor a 0
 * - Modelo: opcional
 * - Patente: opcional
 */
function guardarVehiculo() {
    const id = document.getElementById('vehiculo-id').value;
    const nombre = document.getElementById('vehiculo-nombre').value.trim();
    const capacidad = parseInt(document.getElementById('vehiculo-capacidad').value);
    const modelo = document.getElementById('vehiculo-modelo').value.trim();
    const patente = document.getElementById('vehiculo-patente').value.trim();

    // Validar nombre obligatorio
    if (!nombre) {
        alert('⚠️ El nombre es obligatorio');
        return;
    }

    // Validar nombre único (PRD 4.1)
    const nombreExiste = VEHICULOS.some(v => v.nombre.toLowerCase() === nombre.toLowerCase() && v.id != id);
    if (nombreExiste) {
        alert('⚠️ Ya existe un vehículo con este nombre');
        return;
    }

    // Validar capacidad > 0 (PRD 4.1)
    if (!capacidad || capacidad <= 0) {
        alert('⚠️ La capacidad debe ser mayor a 0');
        return;
    }

    if (id) {
        // Actualizar existente
        const idx = VEHICULOS.findIndex(v => v.id == id);
        if (idx !== -1) {
            VEHICULOS[idx].nombre = nombre;
            VEHICULOS[idx].capacidadKg = capacidad;
            VEHICULOS[idx].modelo = modelo || null;
            VEHICULOS[idx].patente = patente || null;
            console.log('✅ Vehículo actualizado:', VEHICULOS[idx]);
        }
    } else {
        // Crear nuevo
        const nuevoId = Math.max(...VEHICULOS.map(v => v.id)) + 1;
        VEHICULOS.push({
            id: nuevoId,
            nombre: nombre,
            capacidadKg: capacidad,
            modelo: modelo || null,
            patente: patente || null
        });
        console.log('✅ Vehículo creado:', nombre);
    }

    cerrarModalVehiculo();
    renderizarVehiculos();
    alert('✅ Vehículo guardado correctamente');
}

/**
 * Elimina un vehículo
 *
 * VALIDACIÓN (PRD 4.1):
 * - No puede tener pedidos asignados
 */
function eliminarVehiculo(id) {
    const vehiculo = VEHICULOS.find(v => v.id === id);
    if (!vehiculo) return;

    // Validar sin pedidos asignados (PRD 4.1)
    if (vehiculo.pedidosAsignados > 0) {
        alert(`⚠️ No se puede eliminar "${vehiculo.nombre}" porque tiene ${vehiculo.pedidosAsignados} pedidos asignados.\n\nReasigne los pedidos a otro vehículo antes de eliminar.`);
        return;
    }

    if (confirm(`¿Eliminar vehículo "${vehiculo.nombre}"?`)) {
        const idx = VEHICULOS.findIndex(v => v.id === id);
        VEHICULOS.splice(idx, 1);
        renderizarVehiculos();
        console.log('🗑️ Vehículo eliminado:', vehiculo.nombre);
        alert('✅ Vehículo eliminado');
    }
}

// ============================================================================
// CIUDADES - CRUD
// PRD: prd/configuracion.html - Sección 3.3
// ============================================================================

/**
 * Renderiza la tabla de ciudades desde CIUDADES (mock-data.js)
 *
 * LÓGICA:
 * - Muestra ciudad, provincia y cantidad de clientes asociados
 * - Botones editar/eliminar por fila
 */
function renderizarCiudades() {
    const tbody = document.getElementById('tabla-ciudades');
    if (!tbody || typeof CIUDADES === 'undefined') return;

    tbody.innerHTML = CIUDADES.map(c => `
        <tr>
            <td><strong>${c.nombre}</strong></td>
            <td>${c.provincia}</td>
            <td>${c.clientesAsociados} clientes</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon-sm btn-edit" title="Editar" onclick="editarCiudad(${c.id})">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-icon-sm btn-delete" title="Eliminar" onclick="eliminarCiudad(${c.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Abre modal para crear nueva ciudad
 */
function abrirModalCiudad() {
    document.getElementById('modal-ciudad-titulo').innerHTML = '<i class="fas fa-map-marker-alt"></i> Nueva Ciudad';
    document.getElementById('ciudad-id').value = '';
    document.getElementById('ciudad-nombre').value = '';
    document.getElementById('ciudad-provincia').value = '';
    document.getElementById('modal-ciudad').classList.remove('hidden');
    document.getElementById('ciudad-nombre').focus();
}

/**
 * Abre modal para editar ciudad existente
 */
function editarCiudad(id) {
    const ciudad = CIUDADES.find(c => c.id === id);
    if (!ciudad) return;

    document.getElementById('modal-ciudad-titulo').innerHTML = '<i class="fas fa-map-marker-alt"></i> Editar Ciudad';
    document.getElementById('ciudad-id').value = id;
    document.getElementById('ciudad-nombre').value = ciudad.nombre;
    document.getElementById('ciudad-provincia').value = ciudad.provincia || '';
    document.getElementById('modal-ciudad').classList.remove('hidden');
    document.getElementById('ciudad-nombre').focus();
}

/**
 * Cierra modal de ciudad
 */
function cerrarModalCiudad() {
    document.getElementById('modal-ciudad').classList.add('hidden');
}

/**
 * Guarda ciudad (crear o actualizar)
 *
 * VALIDACIONES (PRD sección 4.2):
 * - Ciudad: obligatorio, único
 * - Provincia: obligatorio
 */
function guardarCiudad() {
    const id = document.getElementById('ciudad-id').value;
    const nombre = document.getElementById('ciudad-nombre').value.trim();
    const provincia = document.getElementById('ciudad-provincia').value.trim();

    // Validar ciudad obligatoria
    if (!nombre) {
        alert('⚠️ La ciudad es obligatoria');
        return;
    }

    // Validar provincia obligatoria
    if (!provincia) {
        alert('⚠️ La provincia es obligatoria');
        return;
    }

    // Validar nombre único (PRD 4.2)
    const nombreExiste = CIUDADES.some(c => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id != id);
    if (nombreExiste) {
        alert('⚠️ Ya existe una ciudad con este nombre');
        return;
    }

    if (id) {
        // Actualizar existente
        const idx = CIUDADES.findIndex(c => c.id == id);
        if (idx !== -1) {
            CIUDADES[idx].nombre = nombre;
            CIUDADES[idx].provincia = provincia;
            console.log('✅ Ciudad actualizada:', CIUDADES[idx]);
        }
    } else {
        // Crear nueva
        const nuevoId = Math.max(...CIUDADES.map(c => c.id)) + 1;
        CIUDADES.push({
            id: nuevoId,
            nombre: nombre,
            provincia: provincia,
            clientesAsociados: 0
        });
        console.log('✅ Ciudad creada:', nombre);
    }

    cerrarModalCiudad();
    renderizarCiudades();
    alert('✅ Ciudad guardada correctamente');
}

/**
 * Elimina una ciudad
 *
 * VALIDACIÓN (PRD 4.2):
 * - No puede tener clientes asociados
 */
function eliminarCiudad(id) {
    const ciudad = CIUDADES.find(c => c.id === id);
    if (!ciudad) return;

    // Validar sin clientes asociados (PRD 4.2)
    if (ciudad.clientesAsociados > 0) {
        alert(`⚠️ No se puede eliminar "${ciudad.nombre}" porque tiene ${ciudad.clientesAsociados} clientes asociados.`);
        return;
    }

    if (confirm(`¿Eliminar ciudad "${ciudad.nombre}"?`)) {
        const idx = CIUDADES.findIndex(c => c.id === id);
        CIUDADES.splice(idx, 1);
        renderizarCiudades();
        console.log('🗑️ Ciudad eliminada:', ciudad.nombre);
        alert('✅ Ciudad eliminada');
    }
}

// ============================================================================
// LISTAS DE PRECIO - CRUD
// PRD: prd/configuracion.html - Sección 3.4
// ============================================================================

/**
 * Renderiza la tabla de listas de precio desde LISTAS_PRECIO (mock-data.js)
 *
 * LÓGICA:
 * - Muestra nombre, descuento % y umbral mínimo
 * - Botones editar/eliminar por fila
 */
function renderizarListas() {
    const tbody = document.getElementById('tabla-listas');
    if (!tbody || typeof LISTAS_PRECIO === 'undefined') return;

    tbody.innerHTML = LISTAS_PRECIO.map(l => `
        <tr>
            <td><strong>${l.nombre}</strong></td>
            <td>${l.descuento}%</td>
            <td>${l.umbral ? '$' + l.umbral.toLocaleString('es-AR') : '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon-sm btn-edit" title="Editar" onclick="editarLista(${l.id})">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-icon-sm btn-delete" title="Eliminar" onclick="eliminarLista(${l.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Abre modal para crear nueva lista
 */
function abrirModalLista() {
    document.getElementById('modal-lista-titulo').innerHTML = '<i class="fas fa-tags"></i> Nueva Lista';
    document.getElementById('lista-id').value = '';
    document.getElementById('lista-nombre').value = '';
    document.getElementById('lista-descuento').value = '';
    document.getElementById('lista-umbral').value = '';
    document.getElementById('modal-lista').classList.remove('hidden');
    document.getElementById('lista-nombre').focus();
}

/**
 * Abre modal para editar lista existente
 */
function editarLista(id) {
    const lista = LISTAS_PRECIO.find(l => l.id === id);
    if (!lista) return;

    document.getElementById('modal-lista-titulo').innerHTML = '<i class="fas fa-tags"></i> Editar Lista';
    document.getElementById('lista-id').value = id;
    document.getElementById('lista-nombre').value = lista.nombre;
    document.getElementById('lista-descuento').value = lista.descuento;
    document.getElementById('lista-umbral').value = lista.umbral || '';
    document.getElementById('modal-lista').classList.remove('hidden');
    document.getElementById('lista-nombre').focus();
}

/**
 * Cierra modal de lista
 */
function cerrarModalLista() {
    document.getElementById('modal-lista').classList.add('hidden');
}

/**
 * Guarda lista (crear o actualizar)
 *
 * VALIDACIONES:
 * - Nombre: obligatorio, único
 * - Descuento: obligatorio, entre 0 y 100
 * - Umbral: opcional
 */
function guardarLista() {
    const id = document.getElementById('lista-id').value;
    const nombre = document.getElementById('lista-nombre').value.trim();
    const descuento = parseFloat(document.getElementById('lista-descuento').value);
    const umbral = document.getElementById('lista-umbral').value ? parseInt(document.getElementById('lista-umbral').value) : null;

    // Validar nombre obligatorio
    if (!nombre) {
        alert('⚠️ El nombre es obligatorio');
        return;
    }

    // Validar nombre único
    const nombreExiste = LISTAS_PRECIO.some(l => l.nombre.toLowerCase() === nombre.toLowerCase() && l.id != id);
    if (nombreExiste) {
        alert('⚠️ Ya existe una lista con este nombre');
        return;
    }

    // Validar descuento
    if (isNaN(descuento) || descuento < 0 || descuento > 100) {
        alert('⚠️ El descuento debe estar entre 0 y 100');
        return;
    }

    // ========================================================================
    // REGLA DE NEGOCIO: Jerarquía de Listas (L3 > L2)
    // PRD: prd/configuracion.html - Sección 4.3
    // ========================================================================
    // L3 debe tener descuento y umbral MAYORES que L2
    // Esto asegura coherencia: más compra = más descuento

    const listaL2 = LISTAS_PRECIO.find(l => l.nombre === 'L2' && l.id != id);
    const listaL3 = LISTAS_PRECIO.find(l => l.nombre === 'L3' && l.id != id);

    // Validar si estamos guardando L3
    if (nombre === 'L3' && listaL2) {
        // L3 descuento debe ser > L2 descuento (PRD 4.3)
        if (descuento <= listaL2.descuento) {
            alert(`⚠️ El descuento de L3 (${descuento}%) debe ser mayor que L2 (${listaL2.descuento}%)`);
            return;
        }
        // L3 umbral debe ser > L2 umbral (PRD 4.3)
        if (umbral && listaL2.umbral && umbral <= listaL2.umbral) {
            alert(`⚠️ El umbral de L3 ($${umbral.toLocaleString('es-AR')}) debe ser mayor que L2 ($${listaL2.umbral.toLocaleString('es-AR')})`);
            return;
        }
    }

    // Validar si estamos guardando L2
    if (nombre === 'L2' && listaL3) {
        // L2 descuento debe ser < L3 descuento (PRD 4.3)
        if (descuento >= listaL3.descuento) {
            alert(`⚠️ El descuento de L2 (${descuento}%) debe ser menor que L3 (${listaL3.descuento}%)`);
            return;
        }
        // L2 umbral debe ser < L3 umbral (PRD 4.3)
        if (umbral && listaL3.umbral && umbral >= listaL3.umbral) {
            alert(`⚠️ El umbral de L2 ($${umbral.toLocaleString('es-AR')}) debe ser menor que L3 ($${listaL3.umbral.toLocaleString('es-AR')})`);
            return;
        }
    }

    if (id) {
        // Actualizar existente
        const idx = LISTAS_PRECIO.findIndex(l => l.id == id);
        if (idx !== -1) {
            LISTAS_PRECIO[idx].nombre = nombre;
            LISTAS_PRECIO[idx].descuento = descuento;
            LISTAS_PRECIO[idx].umbral = umbral;
            console.log('✅ Lista actualizada:', LISTAS_PRECIO[idx]);
        }
    } else {
        // Crear nueva
        const nuevoId = Math.max(...LISTAS_PRECIO.map(l => l.id)) + 1;
        LISTAS_PRECIO.push({
            id: nuevoId,
            nombre: nombre,
            descuento: descuento,
            umbral: umbral
        });
        console.log('✅ Lista creada:', nombre);
    }

    cerrarModalLista();
    renderizarListas();
    alert('✅ Lista guardada correctamente');
}

/**
 * Elimina una lista de precio
 */
function eliminarLista(id) {
    const lista = LISTAS_PRECIO.find(l => l.id === id);
    if (!lista) return;

    if (confirm(`¿Eliminar lista "${lista.nombre}"?`)) {
        const idx = LISTAS_PRECIO.findIndex(l => l.id === id);
        LISTAS_PRECIO.splice(idx, 1);
        renderizarListas();
        console.log('🗑️ Lista eliminada:', lista.nombre);
        alert('✅ Lista eliminada');
    }
}

// ============================================================================
// COMPORTAMIENTO STOCK - Configuración Inline
// PRD: prd/configuracion.html - Sección 3.5
// ============================================================================

/**
 * Carga configuración actual de stock y configura auto-guardado
 */
function cargarConfigStock() {
    if (typeof CONFIG_STOCK === 'undefined') return;

    const radios = document.querySelectorAll('input[name="stock-comportamiento"]');
    radios.forEach(radio => {
        radio.checked = (radio.value === CONFIG_STOCK.comportamiento);
        // Auto-guardar al cambiar
        radio.addEventListener('change', function() {
            CONFIG_STOCK.comportamiento = this.value;
            console.log('✅ Stock:', this.value);
        });
    });
}

// ============================================================================
// EVENT LISTENERS - Cerrar modales
// ============================================================================

// Cerrar con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModalVehiculo();
        cerrarModalCiudad();
        cerrarModalLista();
    }
});

// Cerrar al hacer clic fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        cerrarModalVehiculo();
        cerrarModalCiudad();
        cerrarModalLista();
    }
});

console.log('✅ Configuración V2 - Script cargado correctamente');
