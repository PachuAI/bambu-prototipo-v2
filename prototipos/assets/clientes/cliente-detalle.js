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
 */
function cargarInfoCliente(cliente) {
    // Buscar elementos del tab info
    const telefonoEl = document.querySelector('[data-field="telefono"]');
    const ciudadEl = document.querySelector('[data-field="ciudad"]');
    const emailEl = document.querySelector('[data-field="email"]');
    const notaEl = document.querySelector('[data-field="nota"]');

    if (telefonoEl) telefonoEl.textContent = cliente.telefono || '-';
    if (ciudadEl) ciudadEl.textContent = cliente.ciudad || '-';
    if (emailEl) emailEl.textContent = cliente.email || '-';
    if (notaEl) notaEl.textContent = cliente.nota || '-';
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
