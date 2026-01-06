/**
 * BAMBU CRM V2 - VENTAS MODULE
 * Mock Data + Full Interactive Logic
 */

// ========================================
// DATOS MOCK (60 PEDIDOS VARIADOS - 12 POR PÁGINA)
// ========================================

const PEDIDOS_MOCK = generateMockPedidos();

function generateMockPedidos() {
    const direcciones = [
        'ARAUCACÍAS 371', 'PELLEGRINI 615', 'SAN LUIS 372', 'MITRE 4735', 'ECUADOR 2133',
        'AV. ARGENTINA 825', 'CUENCA 16 MZA 7', 'ALMAFUERTE 1245', 'CHIGGINIS 665 LOTE 18',
        '9 DE JULIO 902', 'SAN LORENZO M2A 44', 'GENERAL PAZ 1461', 'LAS RETAMAS 1091',
        'CATAMARCA 662', 'URUGUAY 482', 'SARMIENTO 1820', 'ROCA 445', 'BELGRANO 892',
        'INDEPENDENCIA 301', 'LAS HERAS 1650', 'COLÓN 289', 'SAN MARTÍN 1402', 'YRIGOYEN 551',
        'FOTHERINGHAM 248', 'SANTA FE 677', 'ESPAÑA 1035', 'RIVADAVIA 1244', 'MORENO 804',
        'TOSCHI 391', 'ANASAGASTI 156', 'ISLAS MALVINAS 2045', 'LELOIR 630', 'CASTRO BARROS 888',
        'PERITO MORENO 1540', 'GÜEMES 772', 'ALEM 402', 'PALACIOS 965', 'VILLEGAS 223'
    ];

    const ciudades = ['Neuquén', 'Cipolletti', 'Plottier', 'Allen', 'Centenario'];
    const vehiculos = ['Reparto 1', 'Reparto 2', 'Reparto 3'];

    const pedidos = [];
    let id = 500;

    // Función helper para generar pedido
    function crearPedido(fecha, tipo, estado, vehiculo = null) {
        const esFabrica = tipo === 'fabrica';
        const dir = esFabrica ? 'VENTA FÁBRICA' : direcciones[Math.floor(Math.random() * direcciones.length)];
        const ciudad = esFabrica ? 'Neuquén' : ciudades[Math.floor(Math.random() * ciudades.length)];

        const items = Math.floor(Math.random() * 12) + 2;
        const peso = parseFloat((Math.random() * 50 + 5).toFixed(1));
        const total = Math.floor(Math.random() * 200000) + 20000;

        const pedido = {
            id: id++,
            numero: `#00${id}`,
            fecha,
            fechaDisplay: fecha.split('-').reverse().map(p => p.slice(-2)).join('/'),
            cliente: dir,
            direccion: esFabrica ? 'Belgrano 663' : dir,
            ciudad,
            telefono: `299-${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`,
            tipo,
            estado,
            vehiculo: esFabrica ? null : vehiculo,
            total,
            items,
            peso,
            metodoPago: null,
            montoEfectivo: null,
            montoDigital: null,
            fechaEntrega: null,
            nota: null
        };

        // Si está entregado, asignar método de pago
        if (estado === 'entregado') {
            const metodos = ['efectivo', 'digital', 'mixto'];
            const metodo = metodos[Math.floor(Math.random() * metodos.length)];
            pedido.metodoPago = metodo;

            if (metodo === 'efectivo') {
                pedido.montoEfectivo = total;
            } else if (metodo === 'digital') {
                pedido.montoDigital = total;
            } else {
                const efectivo = Math.floor(total * 0.6);
                pedido.montoEfectivo = efectivo;
                pedido.montoDigital = total - efectivo;
            }

            const horas = String(Math.floor(Math.random() * 12) + 9).padStart(2, '0');
            const mins = String(Math.floor(Math.random() * 60)).padStart(2, '0');
            pedido.fechaEntrega = `${fecha}T${horas}:${mins}:00`;
        }

        return pedido;
    }

    // LUNES 23/12 - 11 pedidos (7 entregados, 4 en tránsito)
    for (let i = 0; i < 7; i++) {
        const veh = vehiculos[i % 3];
        pedidos.push(crearPedido('2025-12-23', 'reparto', 'entregado', veh));
    }
    for (let i = 0; i < 3; i++) {
        const veh = vehiculos[i % 3];
        pedidos.push(crearPedido('2025-12-23', 'reparto', 'transito', veh));
    }
    pedidos.push(crearPedido('2025-12-23', 'fabrica', 'entregado'));

    // MARTES 24/12 - 11 pedidos (5 entregados, 6 en tránsito)
    for (let i = 0; i < 5; i++) {
        const veh = vehiculos[i % 3];
        pedidos.push(crearPedido('2025-12-24', 'reparto', 'entregado', veh));
    }
    for (let i = 0; i < 5; i++) {
        const veh = vehiculos[i % 3];
        pedidos.push(crearPedido('2025-12-24', 'reparto', 'transito', veh));
    }
    pedidos.push(crearPedido('2025-12-24', 'fabrica', 'entregado'));

    // MIÉRCOLES 25/12 - 14 pedidos (4 entregados, 10 en tránsito)
    for (let i = 0; i < 4; i++) {
        const veh = vehiculos[i % 3];
        pedidos.push(crearPedido('2025-12-25', 'reparto', 'entregado', veh));
    }
    for (let i = 0; i < 8; i++) {
        const veh = vehiculos[i % 3];
        pedidos.push(crearPedido('2025-12-25', 'reparto', 'transito', veh));
    }
    for (let i = 0; i < 2; i++) {
        pedidos.push(crearPedido('2025-12-25', 'fabrica', 'transito'));
    }

    // JUEVES 26/12 - 12 pedidos (todos en tránsito)
    for (let i = 0; i < 10; i++) {
        const veh = vehiculos[i % 3];
        pedidos.push(crearPedido('2025-12-26', 'reparto', 'transito', veh));
    }
    for (let i = 0; i < 2; i++) {
        pedidos.push(crearPedido('2025-12-26', 'fabrica', 'transito'));
    }

    // VIERNES 27/12 - 12 pedidos (todos en tránsito)
    for (let i = 0; i < 9; i++) {
        const veh = vehiculos[i % 3];
        pedidos.push(crearPedido('2025-12-27', 'reparto', 'transito', veh));
    }
    for (let i = 0; i < 3; i++) {
        pedidos.push(crearPedido('2025-12-27', 'fabrica', 'transito'));
    }

    return pedidos;
}

// ========================================
// DATOS MOCK BORRADORES (5-6 borradores)
// ========================================

const BORRADORES_MOCK = [
    {
        id: 'BRR-001',
        numero: '#BRR-001',
        fechaCreacion: '2025-12-27T10:30:00',
        fechaCreacionDisplay: '27/12/25 10:30',
        cliente: 'SARMIENTO 1245',
        direccion: 'SARMIENTO 1245',
        ciudad: 'Neuquén',
        tipo: 'reparto',
        total: 145800,
        items: 8,
        peso: 24.5
    },
    {
        id: 'BRR-002',
        numero: '#BRR-002',
        fechaCreacion: '2025-12-26T16:45:00',
        fechaCreacionDisplay: '26/12/25 16:45',
        cliente: 'VENTA FÁBRICA',
        direccion: 'Belgrano 663',
        ciudad: 'Neuquén',
        tipo: 'fabrica',
        total: 203500,
        items: 6,
        peso: 67
    },
    {
        id: 'BRR-003',
        numero: '#BRR-003',
        fechaCreacion: '2025-12-25T14:20:00',
        fechaCreacionDisplay: '25/12/25 14:20',
        cliente: 'ROCA 882 DPTO 4',
        direccion: 'ROCA 882 DPTO 4',
        ciudad: 'Cipolletti',
        tipo: 'reparto',
        total: 89300,
        items: 5,
        peso: 18
    },
    {
        id: 'BRR-004',
        numero: '#BRR-004',
        fechaCreacion: '2025-12-24T11:10:00',
        fechaCreacionDisplay: '24/12/25 11:10',
        cliente: 'INDEPENDENCIA 420',
        direccion: 'INDEPENDENCIA 420',
        ciudad: 'Neuquén',
        tipo: 'reparto',
        total: 67200,
        items: 4,
        peso: 14.5
    },
    {
        id: 'BRR-005',
        numero: '#BRR-005',
        fechaCreacion: '2025-12-23T09:00:00',
        fechaCreacionDisplay: '23/12/25 09:00',
        cliente: 'LAS HERAS 1632',
        direccion: 'LAS HERAS 1632',
        ciudad: 'Plottier',
        tipo: 'reparto',
        total: 112400,
        items: 7,
        peso: 28
    }
];

// ========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ========================================

const appState = {
    pedidos: [],  // se inicializa con copia de PEDIDOS_MOCK
    pedidosFiltrados: [],
    paginaActual: 1,
    pedidosPorPagina: 12,
    filtros: {
        estado: 'todos',
        fechaDesde: '2025-12-01',
        fechaHasta: '2025-12-31',
        tipo: 'todos',
        vehiculo: 'todos',
        metodoPago: 'todos'
    },
    // Estado para borradores
    borradores: [],
    borradoresPaginaActual: 1,
    borradoresPorPagina: 12
};

// ========================================
// FUNCIONES UTILIDAD
// ========================================

function formatearMonto(monto) {
    return '$' + monto.toLocaleString('es-AR');
}

function formatearFechaEntrega(isoString) {
    if (!isoString) return '';
    const fecha = new Date(isoString);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const min = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} ${hora}:${min}`;
}

function renderBadgeTipo(tipo) {
    if (tipo === 'reparto') {
        return '<span class="badge-tipo reparto"><i class="fas fa-truck"></i> Reparto</span>';
    }
    return '<span class="badge-tipo fabrica"><i class="fas fa-industry"></i> Fábrica</span>';
}

function renderBadgeEstado(pedido) {
    if (pedido.estado === 'transito') {
        return '<span class="badge-status transito">EN TRÁNSITO</span>';
    }
    return '<span class="badge-status entregado">ENTREGADO</span>';
}

function renderIconoPago(pedido) {
    if (pedido.estado === 'transito') {
        return '<span class="text-muted">-</span>';
    }

    if (!pedido.metodoPago) {
        return '<i class="fas fa-exclamation-triangle" style="color: var(--red-danger);" title="Sin registrar"></i>';
    }

    if (pedido.metodoPago === 'efectivo') {
        return '<i class="fas fa-money-bill-wave" style="color: var(--green-success);" title="Efectivo"></i>';
    }

    if (pedido.metodoPago === 'digital') {
        return '<i class="fas fa-credit-card" style="color: var(--accent);" title="Digital"></i>';
    }

    if (pedido.metodoPago === 'mixto') {
        return `
            <i class="fas fa-money-bill-wave" style="color: var(--green-success); margin-right: 2px;" title="Efectivo"></i>
            <i class="fas fa-credit-card" style="color: var(--accent);" title="Digital"></i>
        `;
    }
}

function renderAcciones(pedido) {
    if (pedido.estado === 'transito') {
        return `
            <div class="actions-cell">
                <button class="btn-action-sm success" title="Marcar Entregado" onclick="abrirModalEntregado(${pedido.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-action-sm" title="Ver Detalle" onclick="abrirModalDetalle(${pedido.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action-sm" title="Editar" onclick="abrirModalEditar(${pedido.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action-sm danger" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    return `
        <div class="actions-cell">
            <button class="btn-action-sm warning" title="Volver a En Tránsito">
                <i class="fas fa-undo"></i>
            </button>
            <button class="btn-action-sm" title="Ver Detalle" onclick="abrirModalDetalle(${pedido.id})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-action-sm" title="Editar" onclick="abrirModalEditar(${pedido.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action-sm danger" title="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// ========================================
// SISTEMA DE FILTRADO
// ========================================

function aplicarFiltros() {
    let resultado = appState.pedidos;

    // Filtro por estado
    if (appState.filtros.estado !== 'todos') {
        resultado = resultado.filter(p => p.estado === appState.filtros.estado);
    }

    // Filtro por período
    resultado = resultado.filter(p => {
        const fecha = new Date(p.fecha);
        const desde = new Date(appState.filtros.fechaDesde);
        const hasta = new Date(appState.filtros.fechaHasta);
        return fecha >= desde && fecha <= hasta;
    });

    // Filtro por tipo
    if (appState.filtros.tipo !== 'todos') {
        resultado = resultado.filter(p => p.tipo === appState.filtros.tipo);
    }

    // Filtro por vehículo
    if (appState.filtros.vehiculo !== 'todos') {
        if (appState.filtros.vehiculo === 'sin-asignar') {
            resultado = resultado.filter(p => !p.vehiculo);
        } else {
            // Mapeo de valores del filtro a nombres de vehículos
            const vehiculoMap = {
                'r1': 'Reparto 1',
                'r2': 'Reparto 2',
                'r3': 'Reparto 3'
            };
            const vehiculoNombre = vehiculoMap[appState.filtros.vehiculo] || appState.filtros.vehiculo.toUpperCase();
            resultado = resultado.filter(p => p.vehiculo === vehiculoNombre);
        }
    }

    // Filtro por método de pago
    if (appState.filtros.metodoPago !== 'todos') {
        if (appState.filtros.metodoPago === 'sin-registrar') {
            resultado = resultado.filter(p => p.estado === 'entregado' && !p.metodoPago);
        } else {
            resultado = resultado.filter(p => p.metodoPago === appState.filtros.metodoPago);
        }
    }

    appState.pedidosFiltrados = resultado;
    appState.paginaActual = 1; // Reset a página 1 al filtrar
}

// ========================================
// SISTEMA DE PAGINACIÓN
// ========================================

function obtenerPedidosPaginaActual() {
    const inicio = (appState.paginaActual - 1) * appState.pedidosPorPagina;
    const fin = inicio + appState.pedidosPorPagina;
    return appState.pedidosFiltrados.slice(inicio, fin);
}

function getTotalPaginas() {
    return Math.ceil(appState.pedidosFiltrados.length / appState.pedidosPorPagina);
}

function cambiarPagina(numeroPagina) {
    const totalPaginas = getTotalPaginas();
    if (numeroPagina < 1 || numeroPagina > totalPaginas) return;

    appState.paginaActual = numeroPagina;
    renderizarTabla();
    renderizarPaginacion();

    // Scroll to top
    document.querySelector('.view-container').scrollTop = 0;
}

// ========================================
// CÁLCULO DE ESTADÍSTICAS
// ========================================

function calcularEstadisticas() {
    const pedidos = appState.pedidosFiltrados;

    const stats = {
        totalPedidos: pedidos.length,
        montoTotal: pedidos.reduce((sum, p) => sum + p.total, 0),
        pesoTotal: pedidos.reduce((sum, p) => sum + p.peso, 0),
        fabrica: {
            cantidad: pedidos.filter(p => p.tipo === 'fabrica').length,
            monto: pedidos.filter(p => p.tipo === 'fabrica').reduce((sum, p) => sum + p.total, 0)
        },
        reparto: {
            cantidad: pedidos.filter(p => p.tipo === 'reparto').length,
            monto: pedidos.filter(p => p.tipo === 'reparto').reduce((sum, p) => sum + p.total, 0)
        }
    };

    return stats;
}

// ========================================
// RENDERIZADO - TABLA
// ========================================

function renderizarTabla() {
    const tbody = document.querySelector('.table-ventas tbody');
    const pedidosPagina = obtenerPedidosPaginaActual();

    if (pedidosPagina.length === 0) {
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; padding: 60px 20px; color: var(--text-light);">
                        <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; display: block; opacity: 0.3;"></i>
                        <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">No se encontraron pedidos</div>
                        <div style="font-size: 14px;">Intenta ajustar los filtros para ver más resultados</div>
                    </td>
                </tr>
            `;
        }

        // IMPORTANTE: Actualizar badge aunque no haya pedidos
        actualizarBadgeEstadoDia();
        return;
    }

    tbody.innerHTML = pedidosPagina.map(pedido => `
        <tr>
            <td><input type="checkbox" /></td>
            <td><strong>${pedido.numero}</strong></td>
            <td>${pedido.fechaDisplay}</td>
            <td>
                <div class="cliente-cell">
                    <a href="cliente-detalle.html" class="cliente-link" title="Ver perfil del cliente">
                        <strong>${pedido.cliente}</strong>
                    </a>
                </div>
            </td>
            <td>${pedido.telefono || '-'}</td>
            <td>${renderBadgeTipo(pedido.tipo)}</td>
            <td>${renderBadgeEstado(pedido)}</td>
            <td>${pedido.vehiculo ? `<span class="badge-vehiculo">${pedido.vehiculo}</span>` : '<span class="text-muted">-</span>'}</td>
            <td style="text-align: right;"><strong>${formatearMonto(pedido.total)}</strong></td>
            <td>${renderIconoPago(pedido)}</td>
            <td>${renderAcciones(pedido)}</td>
        </tr>
    `).join('');

    // Actualizar contador de resultados
    const totalResultados = appState.pedidosFiltrados.length;
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `${totalResultados} resultado${totalResultados !== 1 ? 's' : ''}`;
    }

    // Actualizar suma total de pedidos visibles
    const sumaTotal = pedidosPagina.reduce((sum, pedido) => sum + pedido.total, 0);
    const elementoTotal = document.getElementById('suma-total-pedidos');
    if (elementoTotal) {
        elementoTotal.textContent = formatearMonto(sumaTotal);
    }

    // Actualizar badge estado día (si está filtrado por un día específico)
    actualizarBadgeEstadoDia();

    // Re-setup check all functionality después de renderizar
    setupCheckAllFunctionality();
}

// ========================================
// ACTUALIZAR BADGE ESTADO DÍA EN LISTA
// ========================================

function actualizarBadgeEstadoDia() {
    const badgeElement = document.getElementById('badge-estado-dia-lista');
    if (!badgeElement) return;

    // Verificar si está filtrado por un día específico
    const fechaDesde = appState.filtros.fechaDesde;
    const fechaHasta = appState.filtros.fechaHasta;

    // Si no está filtrado por un día específico, ocultar badge
    if (fechaDesde !== fechaHasta) {
        badgeElement.innerHTML = '';
        badgeElement.className = '';
        return;
    }

    // Calcular estado del día
    const estado = calcularEstadoDia(fechaDesde);

    // Actualizar badge según estado
    let html = '';
    let clase = '';

    switch (estado) {
        case 'hoy':
            html = 'HOY';
            clase = 'badge-lista-hoy';
            break;
        case 'futuro':
            html = 'Planificado';
            clase = 'badge-lista-planificado';
            break;
        case 'sin-control':
            // BOTÓN clickeable para marcar como controlado
            html = `<button class="btn-marcar-controlado-lista" onclick="marcarDiaControladoDesdeLista('${fechaDesde}')">
                        MARCAR COMO CONTROLADO
                    </button>`;
            clase = '';
            break;
        case 'controlado':
            html = 'Controlado';
            clase = 'badge-lista-controlado';
            break;
    }

    badgeElement.innerHTML = html;
    badgeElement.className = clase;
}

// ========================================
// RENDERIZADO - PAGINACIÓN
// ========================================

function renderizarPaginacion() {
    const totalPaginas = getTotalPaginas();
    const paginacionContainer = document.querySelector('.pagination');

    if (totalPaginas <= 1) {
        paginacionContainer.innerHTML = '';
        return;
    }

    let html = `
        <button class="btn-page" onclick="cambiarPagina(${appState.paginaActual - 1})" ${appState.paginaActual === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <button class="btn-page ${i === appState.paginaActual ? 'active' : ''}" onclick="cambiarPagina(${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button class="btn-page" onclick="cambiarPagina(${appState.paginaActual + 1})" ${appState.paginaActual === totalPaginas ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginacionContainer.innerHTML = html;
}

// ========================================
// RENDERIZADO - ESTADÍSTICAS
// ========================================

function renderizarStats() {
    const stats = calcularEstadisticas();

    // Total pedidos
    const statPedidos = document.querySelector('.stat-card:nth-child(1) .stat-value');
    if (statPedidos) statPedidos.textContent = stats.totalPedidos;

    // Monto total
    const statMonto = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (statMonto) statMonto.textContent = formatearMonto(stats.montoTotal);

    // Peso total
    const pesoFormatted = stats.pesoTotal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    const statPeso = document.querySelector('.stat-card:nth-child(3) .stat-value');
    if (statPeso) statPeso.textContent = `${pesoFormatted} kg`;

    // Breakdown Fábrica
    const montoFabricaK = Math.round(stats.fabrica.monto / 1000);
    const breakdownFabrica = document.querySelector('.breakdown-item:nth-child(1) span');
    if (breakdownFabrica) breakdownFabrica.innerHTML =
        `<strong>Fábrica:</strong> ${stats.fabrica.cantidad} pedidos ($${montoFabricaK}k)`;

    // Breakdown Reparto
    const montoRepartoK = Math.round(stats.reparto.monto / 1000);
    const breakdownReparto = document.querySelector('.breakdown-item:nth-child(2) span');
    if (breakdownReparto) breakdownReparto.innerHTML =
        `<strong>Reparto:</strong> ${stats.reparto.cantidad} pedidos ($${montoRepartoK}k)`;
}

// ========================================
// RENDERIZADO COMPLETO
// ========================================

function render() {
    aplicarFiltros();
    renderizarTabla();
    renderizarPaginacion();
    renderizarStats();
}

// ========================================
// MARCAR COMO ENTREGADO
// ========================================

let pedidoSeleccionadoId = null;

function abrirModalEntregado(pedidoId) {
    pedidoSeleccionadoId = pedidoId;

    const pedido = appState.pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    if (pedido.estado !== 'transito') {
        alert('Solo se pueden marcar como entregados los pedidos EN TRÁNSITO');
        return;
    }

    const modal = document.getElementById('modal-entregado');

    // Actualizar datos del pedido en el modal
    document.getElementById('modal-pedido-num').textContent = pedido.numero;
    document.getElementById('modal-cliente-nombre').textContent = pedido.cliente;
    document.getElementById('modal-pedido-total').textContent = formatearMonto(pedido.total);

    modal.classList.remove('hidden');
}

function cerrarModal() {
    const modal = document.getElementById('modal-entregado');
    modal.classList.add('hidden');
    pedidoSeleccionadoId = null;
}

// Funciones calcularPago() y validarSuma() eliminadas
// Los pagos ahora se registran solo desde Cuenta Corriente

function confirmarEntregado() {
    const pedido = appState.pedidos.find(p => p.id === pedidoSeleccionadoId);
    if (!pedido) return;

    // Marcar como entregado (sin registro de pago)
    pedido.estado = 'entregado';
    pedido.fechaEntrega = new Date().toISOString();

    console.log('Pedido marcado como entregado:', pedido);
    console.log('⚠️ Recordatorio: Registrar pago desde Cuenta Corriente del cliente');

    // Re-renderizar
    render();
    cerrarModal();

    // Mostrar notificación
    mostrarNotificacion(`✅ Pedido ${pedido.numero} marcado como ENTREGADO. Recordá registrar el pago en Cuenta Corriente.`);
}

function irACuentaCorriente() {
    // Redirigir a cliente-detalle.html (en producción sería con el ID del cliente)
    alert('🔄 Redirigiendo a Cuenta Corriente del cliente...\n\nEn producción: /clientes/{id}/cuenta-corriente');

    // Por ahora, abrir en nueva pestaña
    window.open('cliente-detalle.html', '_blank');
}

function mostrarNotificacion(mensaje) {
    // Simple alert por ahora (se puede mejorar con toast notifications)
    console.log('Notificación:', mensaje);

    // Crear toast notification (opcional)
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = mensaje;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--primary);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.style.opacity = '1', 100);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// FILTROS - LIMPIAR
// ========================================

function limpiarFiltros() {
    appState.filtros = {
        estado: 'todos',
        fechaDesde: '2025-12-01',
        fechaHasta: '2025-12-31',
        tipo: 'todos',
        vehiculo: 'todos',
        metodoPago: 'todos'
    };

    // Actualizar inputs
    document.getElementById('filter-estado').value = 'todos';
    document.getElementById('filter-fecha-desde').value = '2025-12-01';
    document.getElementById('filter-fecha-hasta').value = '2025-12-31';
    document.getElementById('filter-tipo').value = 'todos';
    document.getElementById('filter-vehiculo').value = 'todos';
    document.getElementById('filter-pago').value = 'todos';

    render();

    console.log('Filtros limpiados');
}

// ========================================
// SIDEBAR AUTO-COLLAPSE BEHAVIOR
// ========================================

function setupSidebarAutoCollapse() {
    const sidebar = document.getElementById('main-sidebar');
    const btnToggle = document.getElementById('btn-toggle-sidebar');
    let collapseTimer = null;

    if (!sidebar || !btnToggle) return;

    // Function to start the auto-collapse timer
    function startCollapseTimer() {
        clearTimeout(collapseTimer);
        collapseTimer = setTimeout(() => {
            sidebar.classList.add('collapsed');
        }, 5000); // 5 seconds
    }

    // Function to expand sidebar
    function expandSidebar() {
        sidebar.classList.remove('collapsed');
        clearTimeout(collapseTimer);
    }

    // Function to collapse sidebar
    function collapseSidebar() {
        clearTimeout(collapseTimer);
        sidebar.classList.add('collapsed');
    }

    // Initial behavior: expanded, then auto-collapse after 5 seconds
    startCollapseTimer();

    // Hover behavior
    sidebar.addEventListener('mouseenter', expandSidebar);
    sidebar.addEventListener('mouseleave', collapseSidebar);

    // Navigation behavior: when clicking on nav items, start timer again
    const navItems = sidebar.querySelectorAll('.nav-menu li, .btn-cotizador-nav');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Expand and start timer for new page
            expandSidebar();
            startCollapseTimer();
        });
    });

    // Toggle button behavior (optional - keep manual toggle)
    btnToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('collapsed')) {
            expandSidebar();
            startCollapseTimer();
        } else {
            collapseSidebar();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupSidebarAutoCollapse();
});

// ========================================
// BORRADORES - PAGINACIÓN
// ========================================

function obtenerBorradoresPaginaActual() {
    const inicio = (appState.borradoresPaginaActual - 1) * appState.borradoresPorPagina;
    const fin = inicio + appState.borradoresPorPagina;
    return appState.borradores.slice(inicio, fin);
}

function getTotalPaginasBorradores() {
    return Math.ceil(appState.borradores.length / appState.borradoresPorPagina);
}

function cambiarPaginaBorradores(numeroPagina) {
    const totalPaginas = getTotalPaginasBorradores();
    if (numeroPagina < 1 || numeroPagina > totalPaginas) return;

    appState.borradoresPaginaActual = numeroPagina;
    renderizarBorradores();
    renderizarPaginacionBorradores();

    // Scroll to top
    document.querySelector('#view-borradores').scrollTop = 0;
}

// ========================================
// BORRADORES - RENDERIZADO
// ========================================

function renderizarBorradores() {
    const tbody = document.getElementById('tbody-borradores');
    const borradoresPagina = obtenerBorradoresPaginaActual();

    if (borradoresPagina.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 60px 20px; color: var(--text-light);">
                    <i class="fas fa-file-alt" style="font-size: 48px; margin-bottom: 16px; display: block; opacity: 0.3;"></i>
                    <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">No hay borradores guardados</div>
                    <div style="font-size: 14px;">Los borradores guardados desde el Cotizador aparecerán aquí</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = borradoresPagina.map(borrador => `
        <tr>
            <td><input type="checkbox" /></td>
            <td><strong>${borrador.numero}</strong></td>
            <td>${borrador.fechaCreacionDisplay}</td>
            <td>
                <div class="cliente-cell">
                    <strong>${borrador.cliente}</strong>
                </div>
            </td>
            <td>${renderBadgeTipo(borrador.tipo)}</td>
            <td>${borrador.items} items · ${borrador.peso}kg</td>
            <td style="text-align: right;"><strong>${formatearMonto(borrador.total)}</strong></td>
            <td>
                <div class="actions-cell">
                    <button class="btn-action-sm" title="Editar en Cotizador" onclick="editarBorrador('${borrador.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action-sm success" title="Confirmar Pedido" onclick="confirmarBorrador('${borrador.id}')">
                        <i class="fas fa-check-circle"></i>
                    </button>
                    <button class="btn-action-sm danger" title="Eliminar" onclick="eliminarBorrador('${borrador.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Actualizar contador de resultados
    const totalResultados = appState.borradores.length;
    document.querySelector('.results-count').textContent =
        `${totalResultados} borrador${totalResultados !== 1 ? 'es' : ''}`;
}

function renderizarPaginacionBorradores() {
    const totalPaginas = getTotalPaginasBorradores();
    const paginacionContainer = document.getElementById('pagination-borradores');

    if (totalPaginas <= 1) {
        paginacionContainer.innerHTML = '';
        return;
    }

    let html = `
        <button class="btn-page" onclick="cambiarPaginaBorradores(${appState.borradoresPaginaActual - 1})" ${appState.borradoresPaginaActual === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <button class="btn-page ${i === appState.borradoresPaginaActual ? 'active' : ''}" onclick="cambiarPaginaBorradores(${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button class="btn-page" onclick="cambiarPaginaBorradores(${appState.borradoresPaginaActual + 1})" ${appState.borradoresPaginaActual === totalPaginas ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginacionContainer.innerHTML = html;
}

// ========================================
// BORRADORES - ACCIONES
// ========================================

function editarBorrador(borradorId) {
    console.log('Editar borrador:', borradorId);
    alert(`Se abrirá el Cotizador con el borrador ${borradorId}\n\n(Funcionalidad pendiente de integración)`);
}

function confirmarBorrador(borradorId) {
    const borrador = appState.borradores.find(b => b.id === borradorId);
    if (!borrador) return;

    if (!confirm(`¿Confirmar pedido ${borrador.numero}?\n\nSe moverá a la sección Pedidos en estado EN TRÁNSITO`)) {
        return;
    }

    // Crear nuevo pedido a partir del borrador
    const nuevoPedido = {
        id: Date.now(), // ID temporal
        numero: '#' + String(Date.now()).slice(-5),
        fecha: new Date().toISOString().split('T')[0],
        fechaDisplay: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        cliente: borrador.cliente,
        direccion: borrador.direccion,
        ciudad: borrador.ciudad,
        tipo: borrador.tipo,
        estado: 'transito',
        vehiculo: borrador.tipo === 'fabrica' ? null : 'Reparto 1', // Asignar vehículo por defecto
        total: borrador.total,
        items: borrador.items,
        peso: borrador.peso,
        metodoPago: null,
        montoEfectivo: null,
        montoDigital: null,
        fechaEntrega: null,
        nota: `Confirmado desde borrador ${borrador.numero}`
    };

    // Agregar a pedidos
    appState.pedidos.unshift(nuevoPedido); // Agregar al principio

    // Remover de borradores
    appState.borradores = appState.borradores.filter(b => b.id !== borradorId);

    // Actualizar UI
    renderizarBorradores();
    renderizarPaginacionBorradores();

    // Mostrar notificación
    mostrarNotificacion(`✅ Pedido ${nuevoPedido.numero} confirmado y movido a Pedidos`);

    console.log('Pedido confirmado:', nuevoPedido);
}

function eliminarBorrador(borradorId) {
    const borrador = appState.borradores.find(b => b.id === borradorId);
    if (!borrador) return;

    if (!confirm(`¿Eliminar borrador ${borrador.numero}?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }

    // Remover de borradores
    appState.borradores = appState.borradores.filter(b => b.id !== borradorId);

    // Actualizar UI
    renderizarBorradores();
    renderizarPaginacionBorradores();

    // Mostrar notificación
    mostrarNotificacion(`🗑️ Borrador ${borrador.numero} eliminado`);

    console.log('Borrador eliminado:', borradorId);
}

// ========================================
// VIEW SWITCHER (Pedidos / Borradores / Calendario)
// ========================================

function switchView(viewName) {
    const views = document.querySelectorAll('.view-container');
    views.forEach(view => view.classList.add('hidden'));

    const selectedView = document.getElementById('view-' + viewName);
    if (selectedView) {
        selectedView.classList.remove('hidden');
    }

    const tabs = document.querySelectorAll('.view-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-view') === viewName) {
            tab.classList.add('active');
        }
    });

    // Renderizar vista específica si es necesario
    if (viewName === 'borradores') {
        renderizarBorradores();
        renderizarPaginacionBorradores();
    } else if (viewName === 'pedidos') {
        // Ya está renderizado, pero actualizar contador
        const totalResultados = appState.pedidosFiltrados.length;
        document.querySelector('.results-count').textContent =
            `${totalResultados} resultado${totalResultados !== 1 ? 's' : ''}`;
    }
}

// ========================================
// FUNCIÓN: VER VENTAS FÁBRICA (desde calendario)
// ========================================

function verVentasFabrica() {
    // 1. Cambiar a vista Lista Pedidos
    switchView('pedidos');

    // 2. Aplicar filtro Tipo: Fábrica
    const filterTipo = document.getElementById('filter-tipo');
    if (filterTipo) {
        filterTipo.value = 'fabrica';
    }

    // 3. Obtener fechas de la semana actual del calendario
    // Semana mostrada: 23-27 Diciembre 2025
    const filterFechaDesde = document.getElementById('filter-fecha-desde');
    const filterFechaHasta = document.getElementById('filter-fecha-hasta');

    if (filterFechaDesde && filterFechaHasta) {
        filterFechaDesde.value = '2025-12-23';
        filterFechaHasta.value = '2025-12-27';
    }

    // 4. Actualizar appState.filtros (CRÍTICO) - FIX: actualizar ANTES de render()
    appState.filtros.tipo = 'fabrica';
    appState.filtros.fechaDesde = '2025-12-23';
    appState.filtros.fechaHasta = '2025-12-27';

    // 5. Aplicar filtros y re-renderizar (esto llamará a actualizarBadgeEstadoDia())
    aplicarFiltros();
    renderizarTabla();
    renderizarPaginacion();
    renderizarStats();

    // 6. Scroll hacia arriba
    const viewContainer = document.getElementById('view-pedidos');
    if (viewContainer) {
        viewContainer.scrollTop = 0;
    }

    console.log('🏭 Filtros aplicados: Fábrica - Semana 23-27 Dic');
}

// ========================================
// CALENDARIO: SELECCIÓN DE DÍAS Y VEHÍCULOS
// ========================================

// Mock data de vehículos por día (capacidades reales)
const VEHICULOS_POR_DIA = {
    lunes: [
        { nombre: 'Reparto 1', pedidos: 3, peso: 95, pesoMax: 2250 },
        { nombre: 'Reparto 2', pedidos: 4, peso: 120, pesoMax: 2250 },
        { nombre: 'Reparto 3', pedidos: 3, peso: 70, pesoMax: 2500 }
    ],
    martes: [
        { nombre: 'Reparto 1', pedidos: 4, peso: 130, pesoMax: 2250 },
        { nombre: 'Reparto 2', pedidos: 3, peso: 95, pesoMax: 2250 },
        { nombre: 'Reparto 3', pedidos: 3, peso: 85, pesoMax: 2500 }
    ],
    miercoles: [
        { nombre: 'Reparto 1', pedidos: 4, peso: 125, pesoMax: 2250 },
        { nombre: 'Reparto 2', pedidos: 4, peso: 140, pesoMax: 2250 },
        { nombre: 'Reparto 3', pedidos: 4, peso: 115, pesoMax: 2500 }
    ],
    jueves: [
        { nombre: 'Reparto 1', pedidos: 3, peso: 90, pesoMax: 2250 },
        { nombre: 'Reparto 2', pedidos: 4, peso: 125, pesoMax: 2250 },
        { nombre: 'Reparto 3', pedidos: 3, peso: 80, pesoMax: 2500 }
    ],
    viernes: [
        { nombre: 'Reparto 1', pedidos: 3, peso: 85, pesoMax: 2250 },
        { nombre: 'Reparto 2', pedidos: 3, peso: 100, pesoMax: 2250 },
        { nombre: 'Reparto 3', pedidos: 3, peso: 85, pesoMax: 2500 }
    ]
};

// ========================================
// ESTADOS DE DÍAS - CONTROL DE REPARTO
// ========================================

// FECHA "HOY" PARA EL MOCK (cambiar en producción por fecha real del sistema)
const FECHA_HOY_MOCK = '2025-12-25'; // Miércoles 25

// Mock data de estado de control de días
const DIAS_CALENDARIO = {
    '2025-12-23': { // Lunes - CONTROLADO (más viejo)
        fecha: '2025-12-23',
        dia: 'lunes',
        numero: 23,
        controlado: true,
        fechaControl: '2025-12-23T18:30:00',
        notasControl: 'Control realizado - todo OK'
    },
    '2025-12-24': { // Martes - SIN CONTROL (más reciente)
        fecha: '2025-12-24',
        dia: 'martes',
        numero: 24,
        controlado: false,
        fechaControl: null,
        notasControl: ''
    },
    '2025-12-25': { // Miércoles (HOY) - SIN CONTROL
        fecha: '2025-12-25',
        dia: 'miercoles',
        numero: 25,
        controlado: false,
        fechaControl: null,
        notasControl: ''
    },
    '2025-12-26': { // Jueves - FUTURO
        fecha: '2025-12-26',
        dia: 'jueves',
        numero: 26,
        controlado: false,
        fechaControl: null,
        notasControl: ''
    },
    '2025-12-27': { // Viernes - FUTURO
        fecha: '2025-12-27',
        dia: 'viernes',
        numero: 27,
        controlado: false,
        fechaControl: null,
        notasControl: ''
    }
};

/**
 * Calcular el estado de un día según la fecha actual
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} 'futuro' | 'hoy' | 'sin-control' | 'controlado'
 */
function calcularEstadoDia(fecha) {
    // Usar fecha mock para prototipo (en producción: new Date().toISOString().split('T')[0])
    const hoy = FECHA_HOY_MOCK;
    const fechaDia = fecha;

    if (fechaDia > hoy) {
        return 'futuro';
    } else if (fechaDia === hoy) {
        return 'hoy';
    } else {
        // Día pasado: verificar si está controlado
        const diaData = DIAS_CALENDARIO[fecha];
        return diaData?.controlado ? 'controlado' : 'sin-control';
    }
}

/**
 * Calcular los montos de efectivo y digital de un día
 * Suma todos los pedidos ENTREGADOS del día
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {object} { efectivo: number, digital: number }
 */
function calcularPagosDia(fecha) {
    // Filtrar pedidos del día que estén entregados
    const pedidosDelDia = appState.pedidos.filter(p =>
        p.fecha === fecha && p.estado === 'entregado'
    );

    // Sumar efectivo (pedidos con metodoPago 'efectivo' o 'mixto')
    const efectivo = pedidosDelDia
        .filter(p => p.metodoPago === 'efectivo' || p.metodoPago === 'mixto')
        .reduce((sum, p) => sum + (p.montoEfectivo || 0), 0);

    // Sumar digital (pedidos con metodoPago 'digital' o 'mixto')
    const digital = pedidosDelDia
        .filter(p => p.metodoPago === 'digital' || p.metodoPago === 'mixto')
        .reduce((sum, p) => sum + (p.montoDigital || 0), 0);

    return { efectivo, digital };
}

/**
 * Marcar un día como controlado
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 */
function marcarDiaControlado(fecha) {
    const diaData = DIAS_CALENDARIO[fecha];
    if (!diaData) {
        console.error('Día no encontrado:', fecha);
        return;
    }

    // Confirmación
    const dia = diaData.dia.toUpperCase();
    const numero = diaData.numero;
    if (!confirm(`¿Marcar día ${dia} ${numero} como controlado?\n\nEsto indica que ya revisaste todos los pedidos del día.`)) {
        return;
    }

    // Marcar como controlado
    diaData.controlado = true;
    diaData.fechaControl = new Date().toISOString();

    console.log(`✅ Día ${dia} ${numero} marcado como controlado`);

    // Re-renderizar calendario para actualizar la UI
    // TODO: Agregar función renderCalendario() cuando se implemente
    mostrarNotificacion(`✅ Día ${dia} ${numero} marcado como controlado`);
}

/**
 * Marcar día como controlado desde la lista de pedidos
 * Valida pedidos en tránsito antes de marcar
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 */
function marcarDiaControladoDesdeLista(fecha) {
    const diaData = DIAS_CALENDARIO[fecha];
    if (!diaData) {
        console.error('Día no encontrado:', fecha);
        return;
    }

    // Contar pedidos del día en tránsito
    const pedidosDelDia = appState.pedidos.filter(p => p.fecha === fecha);
    const pedidosEnTransito = pedidosDelDia.filter(p => p.estado === 'transito');
    const cantidadTransito = pedidosEnTransito.length;

    // Preparar mensaje de confirmación
    const dia = diaData.dia.toUpperCase();
    const numero = diaData.numero;
    let mensaje = `¿Marcar día ${dia} ${numero} como controlado?\n\n`;

    if (cantidadTransito > 0) {
        mensaje += `⚠️ ADVERTENCIA: Hay ${cantidadTransito} pedido${cantidadTransito > 1 ? 's' : ''} aún EN TRÁNSITO.\n\n`;
        mensaje += `Pedidos en tránsito:\n`;
        pedidosEnTransito.slice(0, 5).forEach(p => {
            mensaje += `- ${p.numero}: ${p.cliente}\n`;
        });
        if (cantidadTransito > 5) {
            mensaje += `... y ${cantidadTransito - 5} más\n`;
        }
        mensaje += `\n¿Deseas marcar el día como controlado de todas formas?`;
    } else {
        mensaje += `Todos los pedidos del día están marcados como ENTREGADOS.\n\n`;
        mensaje += `¿Confirmas que ya revisaste todos los pedidos?`;
    }

    // Confirmación
    if (!confirm(mensaje)) {
        return;
    }

    // Marcar como controlado
    diaData.controlado = true;
    diaData.fechaControl = new Date().toISOString();

    console.log(`✅ Día ${dia} ${numero} marcado como controlado (desde lista)`);

    // Actualizar badge en lista
    actualizarBadgeEstadoDia();

    // TODO: Actualizar badge en calendario cuando se implemente renderización dinámica

    // Notificación
    if (cantidadTransito > 0) {
        mostrarNotificacion(`✅ Día ${dia} ${numero} marcado como controlado (con ${cantidadTransito} pedido${cantidadTransito > 1 ? 's' : ''} en tránsito)`);
    } else {
        mostrarNotificacion(`✅ Día ${dia} ${numero} marcado como controlado`);
    }
}

function seleccionarDia(element, dia) {
    // Prevenir que el click en el botón "Ver detalle" active esto
    if (event.target.closest('.btn-ver-detalle-dia')) {
        return;
    }

    // Remover active de todos los días
    document.querySelectorAll('.dia-card').forEach(card => {
        if (!card.classList.contains('fabrica-card')) {
            card.classList.remove('active');
        }
    });

    // Agregar active al día clickeado
    element.classList.add('active');

    // Renderizar vehículos del día seleccionado
    renderVehiculosCapacidades(dia);

    console.log('📅 Día seleccionado:', dia);
}

function renderVehiculosCapacidades(dia) {
    const container = document.getElementById('vehiculos-capacidades');
    const vehiculos = VEHICULOS_POR_DIA[dia] || [];

    if (vehiculos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">No hay vehículos asignados para este día</p>';
        return;
    }

    container.innerHTML = vehiculos.map(vehiculo => {
        const porcentajePeso = (vehiculo.peso / vehiculo.pesoMax) * 100;

        // Determinar color según ocupación de peso
        let colorClass = 'capacidad-baja';
        if (porcentajePeso >= 80) {
            colorClass = 'capacidad-alta';
        } else if (porcentajePeso >= 50) {
            colorClass = 'capacidad-media';
        }

        return `
            <div class="vehiculo-card ${colorClass}">
                <div class="vehiculo-info">
                    <div class="vehiculo-nombre">
                        <i class="fas fa-truck"></i>
                        <strong>${vehiculo.nombre}</strong>
                    </div>
                    <div class="vehiculo-pedidos">${vehiculo.pedidos} pedidos</div>
                </div>
                <div class="vehiculo-capacidad">
                    <div class="capacidad-peso"><strong>${vehiculo.peso}/${vehiculo.pesoMax} kg</strong></div>
                    <div class="capacidad-barra">
                        <div class="capacidad-fill" style="width: ${porcentajePeso}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function verDetalleDia(event, fecha) {
    // Prevenir que el click propague al día
    event.stopPropagation();

    // Redirigir a vista detalle del día de reparto
    window.location.href = `repartos-dia.html?fecha=${fecha}`;
}

function filtrarListaPorDia(event, fecha) {
    // Prevenir que el click propague al día
    event.stopPropagation();

    // 1. Cambiar a vista Lista Pedidos
    switchView('pedidos');

    // 2. Aplicar filtro de fecha específica
    const filterFechaDesde = document.getElementById('filter-fecha-desde');
    const filterFechaHasta = document.getElementById('filter-fecha-hasta');

    if (filterFechaDesde && filterFechaHasta) {
        filterFechaDesde.value = fecha;
        filterFechaHasta.value = fecha;
    }

    // 3. Actualizar appState.filtros (CRÍTICO)
    appState.filtros.fechaDesde = fecha;
    appState.filtros.fechaHasta = fecha;
    // Filtrar solo pedidos de REPARTO (fábrica se maneja por separado)
    appState.filtros.tipo = 'reparto';
    document.getElementById('filter-tipo').value = 'reparto';

    // 4. Re-renderizar completo
    render();

    // 5. Scroll hacia arriba
    const viewContainer = document.getElementById('view-pedidos');
    if (viewContainer) {
        viewContainer.scrollTop = 0;
    }
}

function verDetalleFabrica(event) {
    // Prevenir que el click propague a la tarjeta (que filtra lista)
    event.stopPropagation();

    // Por ahora, mostrar alert (en producción, abriría vista específica de fábrica)
    alert(`🏭 Abriendo vista detallada de FÁBRICA\n\nAquí se mostraría la vista completa con:\n- Pedidos de fábrica de la semana\n- Agrupación por productos\n- Estados y preparación`);
}

// Inicializar con Miércoles seleccionado (día actual)
document.addEventListener('DOMContentLoaded', function() {
    renderVehiculosCapacidades('miercoles');
});

// ========================================
// EVENT LISTENERS - FILTROS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const filtros = [
        { id: 'filter-estado', prop: 'estado' },
        { id: 'filter-fecha-desde', prop: 'fechaDesde' },
        { id: 'filter-fecha-hasta', prop: 'fechaHasta' },
        { id: 'filter-tipo', prop: 'tipo' },
        { id: 'filter-vehiculo', prop: 'vehiculo' },
        { id: 'filter-pago', prop: 'metodoPago' }
    ];

    filtros.forEach(({ id, prop }) => {
        const filtro = document.getElementById(id);
        if (filtro) {
            filtro.addEventListener('change', function() {
                appState.filtros[prop] = this.value;
                console.log(`Filtro ${prop} cambiado a:`, this.value);
                render();
            });
        }
    });
});

// ========================================
// MODAL - CLICK OUTSIDE TO CLOSE
// ========================================

document.addEventListener('click', function(e) {
    const modal = document.getElementById('modal-entregado');
    if (e.target === modal) {
        cerrarModal();
    }
});

// ESC key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModal();
    }
});

// ========================================
// INICIALIZACIÓN
// ========================================

function inicializarApp() {
    // Cargar datos mock (copia para no mutar original)
    appState.pedidos = PEDIDOS_MOCK.slice();
    appState.borradores = BORRADORES_MOCK.slice();

    console.log('✅ Ventas V2 - Aplicación inicializada');
    console.log('📦 Total pedidos mock:', appState.pedidos.length);
    console.log('📄 Total borradores mock:', appState.borradores.length);
    console.log('🔄 Estado:', appState.filtros);
}

// ========================================
// BULK ACTIONS - CHECKBOXES
// ========================================

function setupCheckAllFunctionality() {
    const checkboxHeader = document.querySelector('.table-ventas thead input[type="checkbox"]');

    if (checkboxHeader) {
        checkboxHeader.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.table-ventas tbody input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.checked = this.checked;
            });
            actualizarBarraBulkActions();
        });
    }
}

function actualizarBarraBulkActions() {
    const checkboxes = document.querySelectorAll('.table-ventas tbody input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

    const barraBulk = document.getElementById('barra-bulk-actions');
    const contadorBulk = document.getElementById('bulk-count');

    if (checkedCount > 0) {
        barraBulk.classList.remove('hidden');
        contadorBulk.textContent = `${checkedCount} pedido${checkedCount > 1 ? 's' : ''} seleccionado${checkedCount > 1 ? 's' : ''}`;
    } else {
        barraBulk.classList.add('hidden');
    }
}

function cancelarSeleccion() {
    const checkboxes = document.querySelectorAll('.table-ventas input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    actualizarBarraBulkActions();
}

function marcarSeleccionadosComoEntregado() {
    const checkboxes = Array.from(document.querySelectorAll('.table-ventas tbody input[type="checkbox"]'));
    const checkboxesSeleccionados = checkboxes.filter(cb => cb.checked);

    if (checkboxesSeleccionados.length === 0) {
        alert('No hay pedidos seleccionados');
        return;
    }

    // Obtener índices de las filas seleccionadas
    const pedidosSeleccionados = [];
    checkboxesSeleccionados.forEach(cb => {
        const row = cb.closest('tr');
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);
        const pedidoPagina = obtenerPedidosPaginaActual();
        const pedido = pedidoPagina[rowIndex];
        if (pedido && pedido.estado === 'transito') {
            pedidosSeleccionados.push(pedido);
        }
    });

    if (pedidosSeleccionados.length === 0) {
        alert('Los pedidos seleccionados ya están entregados o no pueden marcarse como entregados');
        return;
    }

    const mensaje = `¿Marcar ${pedidosSeleccionados.length} pedido${pedidosSeleccionados.length > 1 ? 's' : ''} como ENTREGADO?\n\n` +
        `⚠️ Los pagos deberán registrarse después desde Cuenta Corriente de cada cliente.`;

    if (!confirm(mensaje)) {
        return;
    }

    // Marcar todos como entregado
    pedidosSeleccionados.forEach(pedido => {
        const pedidoEnAppState = appState.pedidos.find(p => p.id === pedido.id);
        if (pedidoEnAppState) {
            pedidoEnAppState.estado = 'entregado';
            pedidoEnAppState.fechaEntrega = new Date().toISOString();
        }
    });

    // Re-renderizar
    render();
    cancelarSeleccion();

    mostrarNotificacion(`✅ ${pedidosSeleccionados.length} pedido${pedidosSeleccionados.length > 1 ? 's marcados' : ' marcado'} como ENTREGADO`);
}

document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
    render();
    setupCheckAllFunctionality();

    // Agregar event listeners a checkboxes individuales
    document.addEventListener('change', function(e) {
        if (e.target.matches('.table-ventas tbody input[type="checkbox"]')) {
            actualizarBarraBulkActions();
        }
    });
});

// ========================================
// MODAL EDITAR PEDIDO
// ========================================

// Catálogo de productos disponibles
const CATALOGO_PRODUCTOS = [
    { nombre: 'Granel detergente', sku: 'GRA-015', precio: 915, peso: 1 },
    { nombre: 'Lavandina x5L', sku: 'LAV-008', precio: 1200, peso: 5 },
    { nombre: 'Desengrasante Magistral x5L', sku: 'DES-042', precio: 2800, peso: 5 },
    { nombre: 'Detergente Industrial x20L', sku: 'DET-100', precio: 52000, peso: 20 },
    { nombre: 'Desinfectante pisos x5L', sku: 'DES-055', precio: 3200, peso: 5 },
    { nombre: 'Jabón líquido x5L', sku: 'JAB-020', precio: 2500, peso: 5 },
    { nombre: 'Lavavajillas concentrado x5L', sku: 'LAV-030', precio: 4800, peso: 5 },
    { nombre: 'Limpiador multiuso x5L', sku: 'LIM-012', precio: 2200, peso: 5 },
    { nombre: 'Suavizante ropa x5L', sku: 'SUA-018', precio: 3500, peso: 5 },
    { nombre: 'Quitamanchas x2L', sku: 'QUI-025', precio: 1800, peso: 2 },
    { nombre: 'Alcohol en gel x5L', sku: 'ALC-033', precio: 4200, peso: 5 },
    { nombre: 'Jabón en polvo x10kg', sku: 'JAB-045', precio: 8500, peso: 10 },
    { nombre: 'Cloro x5L', sku: 'CLO-050', precio: 1500, peso: 5 },
    { nombre: 'Limpia vidrios x5L', sku: 'VID-062', precio: 2900, peso: 5 },
    { nombre: 'Desodorante ambiental x500ml', sku: 'DES-070', precio: 850, peso: 0.5 }
];

// Mock data de productos por pedido - Generación dinámica
const PRODUCTOS_MOCK = generateProductosMock();

function generateProductosMock() {
    const productosPorPedido = {};
    let productoId = 1;

    // Generar productos para todos los pedidos (IDs 500-560 aproximadamente)
    for (let pedidoId = 500; pedidoId <= 560; pedidoId++) {
        const numProductos = Math.floor(Math.random() * 4) + 2; // 2-5 productos por pedido
        const productos = [];

        for (let i = 0; i < numProductos; i++) {
            const productoBase = CATALOGO_PRODUCTOS[Math.floor(Math.random() * CATALOGO_PRODUCTOS.length)];
            const cantidad = Math.floor(Math.random() * 8) + 1; // 1-8 unidades

            productos.push({
                id: productoId++,
                nombre: productoBase.nombre,
                sku: productoBase.sku,
                precio: productoBase.precio,
                cantidad: cantidad,
                peso: productoBase.peso
            });
        }

        productosPorPedido[pedidoId] = productos;
    }

    return productosPorPedido;
}

let pedidoEditandoId = null;
let productosEditando = [];
let totalAnterior = 0;

function abrirModalEditar(pedidoId) {
    console.log('🔍 Abriendo modal editar para pedido ID:', pedidoId);
    console.log('📦 Total pedidos en appState:', appState.pedidos.length);
    console.log('🆔 IDs disponibles:', appState.pedidos.map(p => p.id).slice(0, 10));

    const pedido = appState.pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        console.error('❌ Pedido no encontrado con ID:', pedidoId);
        alert('Pedido no encontrado - ID: ' + pedidoId);
        return;
    }

    pedidoEditandoId = pedidoId;
    totalAnterior = pedido.total;

    // Cargar productos mock (crear copia para no mutar original)
    productosEditando = PRODUCTOS_MOCK[pedidoId]
        ? JSON.parse(JSON.stringify(PRODUCTOS_MOCK[pedidoId]))
        : [
            { id: Date.now(), nombre: 'Producto ejemplo', sku: 'PRD-001', precio: 5000, cantidad: 2, peso: 5 }
        ];

    // Actualizar UI
    document.getElementById('edit-pedido-num').textContent = pedido.numero;
    document.getElementById('edit-total-anterior').textContent = formatearMonto(totalAnterior);
    document.getElementById('edit-cliente-nombre').textContent = pedido.cliente;
    document.getElementById('edit-cliente-dir').textContent = `${pedido.items} items · ${pedido.peso}kg`;

    renderizarProductosEdit();
    recalcularTotalesEdit();

    // Mostrar modal
    document.getElementById('modal-editar-pedido').classList.remove('hidden');
}

function cerrarModalEditar() {
    document.getElementById('modal-editar-pedido').classList.add('hidden');
    pedidoEditandoId = null;
    productosEditando = [];
    totalAnterior = 0;
}

function renderizarProductosEdit() {
    const tbody = document.getElementById('edit-productos-tbody');

    if (productosEditando.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-light);">
                    <i class="fas fa-box-open" style="font-size: 32px; margin-bottom: 12px; display: block; opacity: 0.3;"></i>
                    <div>No hay productos en este pedido</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = productosEditando.map(prod => {
        const subtotal = prod.precio * prod.cantidad;
        return `
            <tr>
                <td>
                    <strong class="producto-nombre-compact">${prod.nombre}</strong>
                </td>
                <td style="text-align: center;">
                    <span class="peso-badge">${prod.peso}kg</span>
                </td>
                <td style="text-align: right;">
                    ${formatearMonto(prod.precio)}
                </td>
                <td style="text-align: center;">
                    <input type="number"
                           class="input-cantidad-edit"
                           value="${prod.cantidad}"
                           min="0"
                           data-producto-id="${prod.id}"
                           onchange="actualizarCantidad(${prod.id}, this.value)">
                </td>
                <td style="text-align: right;">
                    <strong>${formatearMonto(subtotal)}</strong>
                </td>
                <td style="text-align: center;">
                    <button class="btn-icon-danger"
                            title="Eliminar"
                            onclick="eliminarProductoEdit(${prod.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function actualizarCantidad(productoId, nuevaCantidad) {
    const producto = productosEditando.find(p => p.id === productoId);
    if (!producto) return;

    const cantidad = parseInt(nuevaCantidad) || 0;

    if (cantidad === 0) {
        if (confirm('¿Eliminar producto con cantidad 0?')) {
            eliminarProductoEdit(productoId);
        } else {
            // Restaurar cantidad anterior
            renderizarProductosEdit();
        }
        return;
    }

    producto.cantidad = cantidad;
    recalcularTotalesEdit();
    renderizarProductosEdit();
}

function eliminarProductoEdit(productoId) {
    const producto = productosEditando.find(p => p.id === productoId);
    if (!producto) return;

    if (!confirm(`¿Eliminar "${producto.nombre}" del pedido?`)) {
        return;
    }

    productosEditando = productosEditando.filter(p => p.id !== productoId);
    renderizarProductosEdit();
    recalcularTotalesEdit();
}

function recalcularTotalesEdit() {
    // Calcular subtotal
    const subtotal = productosEditando.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    // Por simplicidad, sin descuentos en este prototipo
    const descuentos = 0;
    const descManual = 0;
    const ajustes = 0;

    const totalNuevo = subtotal - descuentos - descManual + ajustes;
    const diferencia = totalNuevo - totalAnterior;

    // Calcular peso total
    const pesoTotal = productosEditando.reduce((sum, p) => sum + (p.peso * p.cantidad), 0);

    // Actualizar UI
    document.getElementById('edit-subtotal').textContent = formatearMonto(subtotal);
    document.getElementById('edit-descuentos').textContent = descuentos > 0 ? '-' + formatearMonto(descuentos) : '$0';
    document.getElementById('edit-desc-manual').textContent = descManual > 0 ? '-' + formatearMonto(descManual) : '$0';
    document.getElementById('edit-ajustes').textContent = formatearMonto(ajustes);
    document.getElementById('edit-total-nuevo').textContent = formatearMonto(totalNuevo);
    document.getElementById('edit-peso-total').textContent = pesoTotal.toFixed(1) + 'kg';

    // Diferencia con color dinámico
    const elemDiferencia = document.getElementById('edit-diferencia');
    elemDiferencia.textContent = (diferencia >= 0 ? '+' : '') + formatearMonto(Math.abs(diferencia));

    if (diferencia < 0) {
        elemDiferencia.style.color = 'var(--red-danger)';
    } else if (diferencia > 0) {
        elemDiferencia.style.color = 'var(--green-success)';
    } else {
        elemDiferencia.style.color = 'var(--text-light)';
    }
}

function guardarEdicion() {
    if (productosEditando.length === 0) {
        alert('⚠️ No se puede guardar un pedido sin productos');
        return;
    }

    const pedido = appState.pedidos.find(p => p.id === pedidoEditandoId);
    if (!pedido) return;

    // Calcular nuevo total
    const subtotal = productosEditando.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    const totalNuevo = subtotal;
    const diferencia = totalNuevo - totalAnterior;

    // Calcular nuevo peso
    const pesoNuevo = productosEditando.reduce((sum, p) => sum + (p.peso * p.cantidad), 0);
    const itemsNuevos = productosEditando.length;

    // Actualizar pedido
    pedido.total = totalNuevo;
    pedido.peso = pesoNuevo;
    pedido.items = itemsNuevos;

    // Guardar productos (en mock)
    PRODUCTOS_MOCK[pedidoEditandoId] = JSON.parse(JSON.stringify(productosEditando));

    console.log('Pedido editado:', {
        id: pedidoEditandoId,
        totalAnterior,
        totalNuevo,
        diferencia,
        productos: productosEditando
    });

    // Re-renderizar tabla
    render();
    cerrarModalEditar();

    // Notificación
    const msgDiferencia = diferencia !== 0
        ? ` (${diferencia > 0 ? '+' : ''}${formatearMonto(Math.abs(diferencia))})`
        : '';
    mostrarNotificacion(`✅ Pedido ${pedido.numero} actualizado${msgDiferencia}`);
}

// Click outside modal to close
document.addEventListener('click', function(e) {
    const modalEdit = document.getElementById('modal-editar-pedido');
    if (e.target === modalEdit) {
        cerrarModalEditar();
    }
});

// ========================================
// AGREGAR PRODUCTO AL PEDIDO
// ========================================

function abrirModalAgregarProducto() {
    alert('🚧 Funcionalidad "Agregar Producto" pendiente de implementar.\n\nPor ahora solo se puede editar cantidades y eliminar productos.');
}

// ========================================
// MODAL: VER DETALLE PEDIDO
// ========================================

let pedidoViendoId = null;

function abrirModalDetalle(pedidoId) {
    console.log('👁️ Abriendo modal detalle para pedido ID:', pedidoId);

    const pedido = appState.pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        console.error('❌ Pedido no encontrado con ID:', pedidoId);
        alert('Pedido no encontrado');
        return;
    }

    pedidoViendoId = pedidoId;
    console.log('✅ pedidoViendoId guardado:', pedidoViendoId);

    // Header info
    document.getElementById('detalle-pedido-num').textContent = pedido.numero;
    document.getElementById('detalle-fecha').textContent = pedido.fechaDisplay;

    // Badge estado
    const estadoBadge = document.getElementById('detalle-estado-badge');
    estadoBadge.textContent = pedido.estado === 'transito' ? 'EN TRÁNSITO' : 'ENTREGADO';
    estadoBadge.style.background = pedido.estado === 'transito' ? '#dbeafe' : '#10b981';
    estadoBadge.style.color = pedido.estado === 'transito' ? '#1e40af' : '#ffffff';

    // Info cliente
    document.getElementById('detalle-cliente-nombre').textContent = pedido.cliente;
    document.getElementById('detalle-cliente-tel').textContent = '294-123456'; // Mock
    document.getElementById('detalle-cliente-dir').textContent = `${pedido.direccion}, ${pedido.ciudad}`;

    // Productos
    renderizarProductosDetalle(pedidoId);

    // Totales (mock, basado en el total del pedido)
    const descuento = Math.round(pedido.total * 0.05); // 5% desc mock
    const subtotal = pedido.total + descuento;
    document.getElementById('detalle-subtotal').textContent = formatearMonto(subtotal);
    document.getElementById('detalle-descuentos').textContent = '-' + formatearMonto(descuento);
    document.getElementById('detalle-desc-manual').textContent = '$0';
    document.getElementById('detalle-ajustes').textContent = '$0';
    document.getElementById('detalle-total').textContent = formatearMonto(pedido.total);

    // Método de pago
    const metodoPagoDiv = document.getElementById('detalle-metodo-pago');
    if (pedido.metodoPago === 'ambos') {
        metodoPagoDiv.innerHTML = `
            <div class="metodo-item">
                <i class="fas fa-money-bill-alt"></i>
                <span>Efectivo</span>
                <span class="metodo-monto">${formatearMonto(pedido.montoEfectivo)}</span>
            </div>
            <div class="metodo-item">
                <i class="fas fa-credit-card"></i>
                <span>Digital</span>
                <span class="metodo-monto">${formatearMonto(pedido.montoDigital)}</span>
            </div>
        `;
    } else if (pedido.metodoPago === 'efectivo') {
        metodoPagoDiv.innerHTML = `
            <div class="metodo-item">
                <i class="fas fa-money-bill-alt"></i>
                <span>Efectivo</span>
                <span class="metodo-monto">${formatearMonto(pedido.montoEfectivo)}</span>
            </div>
        `;
    } else if (pedido.metodoPago === 'digital') {
        metodoPagoDiv.innerHTML = `
            <div class="metodo-item">
                <i class="fas fa-credit-card"></i>
                <span>Digital</span>
                <span class="metodo-monto">${formatearMonto(pedido.montoDigital)}</span>
            </div>
        `;
    } else {
        metodoPagoDiv.innerHTML = `
            <div class="metodo-item">
                <i class="fas fa-clock"></i>
                <span style="color: #9ca3af;">Pago pendiente</span>
            </div>
        `;
    }

    // Estado de pago
    const montoPagado = (pedido.montoEfectivo || 0) + (pedido.montoDigital || 0);
    const pendiente = pedido.total - montoPagado;
    document.getElementById('detalle-pagado').textContent = formatearMonto(montoPagado);
    document.getElementById('detalle-pendiente').textContent = formatearMonto(pendiente);

    // Notas (si existe)
    if (pedido.nota) {
        document.getElementById('detalle-notas-section').style.display = 'block';
        document.getElementById('detalle-nota-texto').textContent = pedido.nota;
    } else {
        document.getElementById('detalle-notas-section').style.display = 'none';
    }

    // Entrega info (si está entregado)
    if (pedido.estado === 'entregado' && pedido.fechaEntrega) {
        document.getElementById('detalle-entrega-section').style.display = 'block';
        document.getElementById('detalle-fecha-entrega').textContent = pedido.fechaEntrega;
        document.getElementById('detalle-usuario-entrega').textContent = 'Juan Pérez'; // Mock
    } else {
        document.getElementById('detalle-entrega-section').style.display = 'none';
    }

    // Mostrar modal
    document.getElementById('modal-ver-detalle').classList.remove('hidden');
}

function renderizarProductosDetalle(pedidoId) {
    const tbody = document.getElementById('detalle-productos-tbody');
    const productos = PRODUCTOS_MOCK[pedidoId] || [];

    if (productos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #9ca3af;">
                    <i class="fas fa-box-open" style="font-size: 32px; margin-bottom: 12px; display: block; opacity: 0.3;"></i>
                    <div>No hay productos en este pedido</div>
                </td>
            </tr>
        `;
        document.getElementById('detalle-peso-total').textContent = '0kg';
        return;
    }

    let pesoTotal = 0;
    tbody.innerHTML = productos.map(prod => {
        const subtotal = prod.precio * prod.cantidad;
        pesoTotal += prod.peso * prod.cantidad;
        return `
            <tr>
                <td>
                    <strong>${prod.nombre}</strong>
                </td>
                <td style="text-align: center;">
                    <span class="peso-badge">${prod.peso}kg</span>
                </td>
                <td style="text-align: right;">
                    ${formatearMonto(prod.precio)}
                </td>
                <td style="text-align: center;">
                    <strong>${prod.cantidad}</strong>
                </td>
                <td style="text-align: right;">
                    <strong>${formatearMonto(subtotal)}</strong>
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById('detalle-peso-total').textContent = pesoTotal + 'kg';
}

function cerrarModalDetalle() {
    document.getElementById('modal-ver-detalle').classList.add('hidden');
    pedidoViendoId = null;
}

function abrirEditarDesdeDetalle() {
    console.log('🔄 Intentando abrir editar desde detalle. pedidoViendoId:', pedidoViendoId);

    if (pedidoViendoId) {
        // Guardar ID antes de cerrar modal (cerrarModalDetalle pone pedidoViendoId = null)
        const idParaEditar = pedidoViendoId;
        cerrarModalDetalle();
        setTimeout(() => {
            console.log('⏱️ Después de 100ms, abriendo modal editar con ID:', idParaEditar);
            abrirModalEditar(idParaEditar);
        }, 100);
    } else {
        console.error('❌ No hay pedidoViendoId definido');
    }
}

// Click outside modal to close
document.addEventListener('click', function(e) {
    const modalDetalle = document.getElementById('modal-ver-detalle');
    if (e.target === modalDetalle) {
        cerrarModalDetalle();
    }
});

console.log('✅ Ventas V2 - Script cargado correctamente');
