/**
 * CLIENTE DETALLE - Script para cargar datos dinámicos
 * Fase 5: Soporte para parámetro ?id= en URL
 *
 * USO: cliente-detalle.html?id=9 → carga cliente con id=9
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar BambuState
    BambuState.init();

    // Obtener ID del cliente desde URL
    const params = new URLSearchParams(window.location.search);
    const clienteId = parseInt(params.get('id'));

    if (!clienteId) {
        console.warn('[ClienteDetalle] No se especificó ?id= en URL, usando cliente por defecto');
        // Cargar cliente por defecto (id=9 = "9 DE JULIO 902")
        cargarCliente(9);
        return;
    }

    const cliente = BambuState.getById('clientes', clienteId);

    if (!cliente) {
        console.error(`[ClienteDetalle] Cliente con id=${clienteId} no encontrado`);
        document.getElementById('cliente-direccion').textContent = 'Cliente no encontrado';
        return;
    }

    cargarCliente(clienteId);
});

/**
 * Carga los datos del cliente en la página
 */
function cargarCliente(clienteId) {
    const cliente = BambuState.getById('clientes', clienteId);
    if (!cliente) return;

    console.log(`[ClienteDetalle] Cargando cliente: ${cliente.direccion} (id=${clienteId})`);

    // Header
    document.getElementById('cliente-direccion').textContent = cliente.direccion;

    // Estado badge
    const estadoEl = document.getElementById('cliente-estado');
    estadoEl.textContent = cliente.estado.toUpperCase();
    estadoEl.className = `badge-status ${cliente.estado}`;

    // Lista de precio
    const listaEl = document.getElementById('cliente-lista');
    const descuentos = { 'L1': '0%', 'L2': '6.25%', 'L3': '10%' };
    listaEl.innerHTML = `<i class="fas fa-tag"></i> ${cliente.lista_precio} (${descuentos[cliente.lista_precio] || '0%'})`;

    // Cargar pedidos del cliente
    cargarPedidosCliente(clienteId);

    // Cargar info del cliente (tab Información)
    cargarInfoCliente(cliente);

    // Actualizar saldo en cuenta corriente
    actualizarSaldoCC(cliente.saldo);
}

/**
 * Carga el historial de pedidos del cliente
 */
function cargarPedidosCliente(clienteId) {
    const pedidos = BambuState.getPedidosByCliente(clienteId);
    const tbody = document.getElementById('pedidos-historial-tbody');

    if (!tbody) {
        console.warn('[ClienteDetalle] No se encontró tabla de historial de pedidos');
        return;
    }

    if (pedidos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">
                    No hay pedidos registrados para este cliente
                </td>
            </tr>
        `;
        return;
    }

    // Ordenar por fecha descendente
    pedidos.sort((a, b) => {
        if (!a.fecha) return 1;
        if (!b.fecha) return -1;
        return new Date(b.fecha) - new Date(a.fecha);
    });

    tbody.innerHTML = pedidos.map(p => {
        const total = BambuState.calcularTotalPedido(p.id);
        const peso = BambuState.calcularPesoPedido(p.id);
        const items = BambuState.contarItemsPedido(p.id);
        const fechaDisplay = p.fecha ? formatearFecha(p.fecha) : '-';

        const estadoClass = {
            'entregado': 'success',
            'en transito': 'warning',
            'asignado': 'info',
            'pendiente': 'default',
            'borrador': 'muted'
        }[p.estado] || 'default';

        return `
            <tr>
                <td>${p.numero}</td>
                <td>${fechaDisplay}</td>
                <td>${items} items</td>
                <td>${Math.round(peso)} kg</td>
                <td>$${total.toLocaleString('es-AR')}</td>
                <td><span class="badge-sm ${estadoClass}">${p.estado.toUpperCase()}</span></td>
            </tr>
        `;
    }).join('');
}

/**
 * Carga la información del cliente en el tab Información
 *
 * LÓGICA:
 * - Precarga todos los campos editables con datos del cliente
 * - Selecciona ciudad y descuento correctos
 */
function cargarInfoCliente(cliente) {
    // Campos de datos
    const direccionEl = document.getElementById('info-direccion');
    const telefonoEl = document.getElementById('info-telefono');
    const ciudadEl = document.getElementById('info-ciudad');
    const emailEl = document.getElementById('info-email');
    const notaEl = document.getElementById('info-nota');

    if (direccionEl) direccionEl.value = cliente.direccion || '';
    if (telefonoEl) telefonoEl.value = cliente.telefono || '';
    if (emailEl) emailEl.value = cliente.email || '';
    if (notaEl) notaEl.value = cliente.nota || '';

    // Seleccionar ciudad
    if (ciudadEl) {
        const ciudadNorm = cliente.ciudad.toLowerCase();
        ciudadEl.value = ciudadNorm;
    }

    // Seleccionar descuento
    const btnGroup = document.querySelector('#tab-info .btn-group-toggle');
    if (btnGroup) {
        btnGroup.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));

        let valorDescuento = 'none';
        if (cliente.lista_precio === 'L2') valorDescuento = 'l2';
        if (cliente.lista_precio === 'L3') valorDescuento = 'l3';

        const btnDescuento = btnGroup.querySelector(`[data-value="${valorDescuento}"]`);
        if (btnDescuento) btnDescuento.classList.add('active');
    }
}

/**
 * Guarda los cambios del tab Información
 *
 * REGLA DE NEGOCIO:
 * - Dirección y teléfono son obligatorios
 * - Ciudad debe estar seleccionada
 * - Actualiza datos en BambuState y mock
 *
 * PRD: prd/clientes.html - Sección Edición
 */
function guardarInfoCliente() {
    // Obtener ID del cliente actual
    const params = new URLSearchParams(window.location.search);
    const clienteId = parseInt(params.get('id')) || 9;

    // Obtener valores de los campos
    const direccion = document.getElementById('info-direccion').value.trim();
    const telefono = document.getElementById('info-telefono').value.trim();
    const ciudad = document.getElementById('info-ciudad').value;
    const email = document.getElementById('info-email').value.trim();
    const nota = document.getElementById('info-nota').value.trim();

    // Obtener descuento seleccionado
    const btnActivo = document.querySelector('#tab-info .btn-toggle.active');
    const descuentoVal = btnActivo ? btnActivo.getAttribute('data-value') : 'none';

    // Validaciones
    if (!direccion) {
        alert('⚠️ La dirección es obligatoria');
        document.getElementById('info-direccion').focus();
        return;
    }
    if (!telefono) {
        alert('⚠️ El teléfono es obligatorio');
        document.getElementById('info-telefono').focus();
        return;
    }
    if (!ciudad) {
        alert('⚠️ Debe seleccionar una ciudad');
        document.getElementById('info-ciudad').focus();
        return;
    }

    // Mapear descuento a lista_precio
    let listaPrecio = 'L1';
    if (descuentoVal === 'l2') listaPrecio = 'L2';
    if (descuentoVal === 'l3') listaPrecio = 'L3';

    // Actualizar en BambuState
    const clienteActualizado = BambuState.update('clientes', clienteId, {
        direccion: direccion.toUpperCase(),
        telefono,
        ciudad: ciudad.charAt(0).toUpperCase() + ciudad.slice(1),
        email,
        nota,
        lista_precio: listaPrecio
    });

    if (clienteActualizado) {
        // Actualizar header
        document.getElementById('cliente-direccion').textContent = clienteActualizado.direccion;

        // Actualizar badge descuento
        const descuentos = { 'L1': '0%', 'L2': '6.25%', 'L3': '10%' };
        document.getElementById('cliente-lista').innerHTML =
            `<i class="fas fa-tag"></i> ${listaPrecio} (${descuentos[listaPrecio]})`;

        alert('✅ Cambios guardados correctamente');
        console.log('✅ Cliente actualizado:', clienteActualizado);
    } else {
        alert('❌ Error al guardar los cambios');
    }
}

/**
 * Actualiza el saldo en cuenta corriente
 */
function actualizarSaldoCC(saldo) {
    const saldoEl = document.getElementById('saldo-actual');
    if (!saldoEl) return;

    const esDeuda = saldo < 0;
    const saldoAbs = Math.abs(saldo);

    saldoEl.textContent = `${esDeuda ? '-' : ''}$${saldoAbs.toLocaleString('es-AR')}`;
    saldoEl.className = esDeuda ? 'saldo-negativo' : 'saldo-positivo';
}

/**
 * Helper: formatear fecha
 */
function formatearFecha(fechaISO) {
    if (!fechaISO) return '-';
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
}

// ========================================
// NUEVA COTIZACIÓN CON CLIENTE
// PRD: prd/clientes.html - Integración Cotizador
// ========================================

/**
 * Redirige al cotizador con el cliente actual precargado
 *
 * LÓGICA:
 * - Pasa cliente_id como parámetro URL
 * - El cotizador debe leer este parámetro y precargar datos
 */
function nuevaCotizacionCliente() {
    const params = new URLSearchParams(window.location.search);
    const clienteId = parseInt(params.get('id')) || 9;

    const cliente = BambuState.getById('clientes', clienteId);
    if (!cliente) {
        alert('Error: Cliente no encontrado');
        return;
    }

    // Redirigir al cotizador con cliente precargado
    window.location.href = `cotizador.html?cliente_id=${clienteId}`;
    console.log(`✅ Redirigiendo a cotizador con cliente ${cliente.direccion}`);
}
