/**
 * ============================================================================
 * CONFIGURACIÓN - Script Principal
 * ============================================================================
 *
 * PRD: prd/configuracion.html
 * Módulo: Configuración General
 *
 * Secciones:
 * - Vehículos (CRUD)
 * - Ciudades (CRUD)
 * - Listas de Precio
 * - Comportamiento Stock
 *
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Configuración V2 Loaded');

    // Inicializar tabs
    setupTabs();

    // Cargar datos iniciales
    renderizarVehiculos();
    renderizarCiudades();
    cargarConfigPrecios();
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
 * - Muestra nombre, capacidad en kg, pedidos asignados
 * - Botones editar/eliminar por fila
 */
function renderizarVehiculos() {
    const tbody = document.getElementById('tabla-vehiculos');
    if (!tbody || typeof VEHICULOS === 'undefined') return;

    tbody.innerHTML = VEHICULOS.map(v => `
        <tr>
            <td><strong>${v.nombre}</strong></td>
            <td>${v.capacidadKg.toLocaleString('es-AR')} kg</td>
            <td>${v.pedidosAsignados} pedidos</td>
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
 */
function guardarVehiculo() {
    const id = document.getElementById('vehiculo-id').value;
    const nombre = document.getElementById('vehiculo-nombre').value.trim();
    const capacidad = parseInt(document.getElementById('vehiculo-capacidad').value);

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
            console.log('✅ Vehículo actualizado:', VEHICULOS[idx]);
        }
    } else {
        // Crear nuevo
        const nuevoId = Math.max(...VEHICULOS.map(v => v.id)) + 1;
        VEHICULOS.push({
            id: nuevoId,
            nombre: nombre,
            capacidadKg: capacidad,
            pedidosAsignados: 0
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
 * - Muestra nombre y cantidad de clientes asociados
 * - Botones editar/eliminar por fila
 */
function renderizarCiudades() {
    const tbody = document.getElementById('tabla-ciudades');
    if (!tbody || typeof CIUDADES === 'undefined') return;

    tbody.innerHTML = CIUDADES.map(c => `
        <tr>
            <td><strong>${c.nombre}</strong></td>
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
 * - Nombre: obligatorio, único
 */
function guardarCiudad() {
    const id = document.getElementById('ciudad-id').value;
    const nombre = document.getElementById('ciudad-nombre').value.trim();

    // Validar nombre obligatorio
    if (!nombre) {
        alert('⚠️ El nombre es obligatorio');
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
            console.log('✅ Ciudad actualizada:', CIUDADES[idx]);
        }
    } else {
        // Crear nueva
        const nuevoId = Math.max(...CIUDADES.map(c => c.id)) + 1;
        CIUDADES.push({
            id: nuevoId,
            nombre: nombre,
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
// LISTAS DE PRECIO - Configuración
// PRD: prd/configuracion.html - Sección 3.4
// ============================================================================

/**
 * Carga configuración actual de precios en el formulario
 */
function cargarConfigPrecios() {
    if (typeof CONFIG_PRECIOS === 'undefined') return;

    document.getElementById('l2-descuento').value = CONFIG_PRECIOS.l2_descuento_porciento || '';
    document.getElementById('l3-descuento').value = CONFIG_PRECIOS.l3_descuento_porciento || '';
    document.getElementById('l2-umbral').value = CONFIG_PRECIOS.l2_umbral_minimo || '';
    document.getElementById('l3-umbral').value = CONFIG_PRECIOS.l3_umbral_minimo || '';
}

/**
 * Guarda configuración de listas de precio
 *
 * VALIDACIONES (PRD sección 4.3):
 * - Descuentos: entre 0% y 100%
 * - L3 debe ser mayor que L2
 * - Umbral L3 debe ser mayor que umbral L2 (si ambos están definidos)
 */
function guardarPrecios() {
    const l2Desc = parseFloat(document.getElementById('l2-descuento').value) || 0;
    const l3Desc = parseFloat(document.getElementById('l3-descuento').value) || 0;
    const l2Umbral = document.getElementById('l2-umbral').value ? parseInt(document.getElementById('l2-umbral').value) : null;
    const l3Umbral = document.getElementById('l3-umbral').value ? parseInt(document.getElementById('l3-umbral').value) : null;

    // Validar rango 0-100 (PRD 4.3)
    if (l2Desc < 0 || l2Desc > 100 || l3Desc < 0 || l3Desc > 100) {
        alert('⚠️ Los descuentos deben estar entre 0 y 100');
        return;
    }

    // Validar L3 > L2 (PRD 4.3)
    if (l3Desc <= l2Desc) {
        alert('⚠️ El descuento L3 debe ser mayor que L2');
        return;
    }

    // Validar umbrales (PRD 4.3)
    if (l2Umbral && l2Umbral <= 0) {
        alert('⚠️ El umbral L2 debe ser mayor a 0');
        return;
    }

    if (l3Umbral && l3Umbral <= 0) {
        alert('⚠️ El umbral L3 debe ser mayor a 0');
        return;
    }

    if (l2Umbral && l3Umbral && l3Umbral <= l2Umbral) {
        alert('⚠️ El umbral L3 debe ser mayor que el umbral L2');
        return;
    }

    // Guardar en mock
    CONFIG_PRECIOS.l2_descuento_porciento = l2Desc;
    CONFIG_PRECIOS.l3_descuento_porciento = l3Desc;
    CONFIG_PRECIOS.l2_umbral_minimo = l2Umbral;
    CONFIG_PRECIOS.l3_umbral_minimo = l3Umbral;

    console.log('✅ Configuración de precios actualizada:', CONFIG_PRECIOS);
    alert('✅ Listas de precio actualizadas\n\nLos cambios se aplicarán a todos los pedidos nuevos.');
}

// ============================================================================
// COMPORTAMIENTO STOCK - Configuración
// PRD: prd/configuracion.html - Sección 3.5
// ============================================================================

/**
 * Carga configuración actual de stock en el formulario
 */
function cargarConfigStock() {
    if (typeof CONFIG_STOCK === 'undefined') return;

    const radios = document.querySelectorAll('input[name="stock-comportamiento"]');
    radios.forEach(radio => {
        radio.checked = (radio.value === CONFIG_STOCK.comportamiento);
    });
}

/**
 * Guarda configuración de comportamiento de stock
 *
 * OPCIONES (PRD sección 3.5):
 * - BLOQUEAR: No permite confirmar pedido si no hay stock
 * - ADVERTIR: Muestra alerta pero permite confirmar
 *
 * EXCEPCIÓN: Productos BAMBU siempre permiten stock negativo
 */
function guardarStock() {
    const seleccionado = document.querySelector('input[name="stock-comportamiento"]:checked');
    if (!seleccionado) {
        alert('⚠️ Debe seleccionar una opción');
        return;
    }

    CONFIG_STOCK.comportamiento = seleccionado.value;

    console.log('✅ Comportamiento de stock actualizado:', CONFIG_STOCK.comportamiento);
    alert(`✅ Comportamiento de stock actualizado\n\nModo: ${seleccionado.value === 'BLOQUEAR' ? 'Bloquear venta' : 'Advertir pero permitir'}`);
}

// ============================================================================
// EVENT LISTENERS - Cerrar modales
// ============================================================================

// Cerrar con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModalVehiculo();
        cerrarModalCiudad();
    }
});

// Cerrar al hacer clic fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        cerrarModalVehiculo();
        cerrarModalCiudad();
    }
});

console.log('✅ Configuración V2 - Script cargado correctamente');
