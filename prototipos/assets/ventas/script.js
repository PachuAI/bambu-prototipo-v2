/**
 * BAMBU CRM V2 - VENTAS MODULE
 * Usa BambuState como fuente de datos centralizada
 *
 * PRD: prd/ventas.html
 */

// ========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ========================================

const appState = {
    pedidos: [],        // Se carga desde BambuState
    pedidosFiltrados: [],
    paginaActual: 1,
    pedidosPorPagina: 12,
    filtros: {
        estado: 'todos',
        fechaDesde: '2026-01-01',
        fechaHasta: '2026-01-31',
        tipo: 'todos',
        vehiculo: 'todos',
        metodoPago: 'todos',
        busqueda: ''
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
        // Mostrar montos en tooltip si existen
        const efectivo = pedido.montoEfectivo ? `$${pedido.montoEfectivo.toLocaleString()}` : '';
        const digital = pedido.montoDigital ? `$${pedido.montoDigital.toLocaleString()}` : '';
        const titleMixto = efectivo && digital ? `Mixto: ${efectivo} efectivo + ${digital} digital` : 'Pago Mixto';

        return `
            <span class="icono-pago-mixto" title="${titleMixto}">
                <i class="fas fa-money-bill-wave" style="color: var(--green-success);"></i>
                <i class="fas fa-credit-card" style="color: var(--accent);"></i>
            </span>
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
                <button class="btn-action-sm danger" title="Eliminar" onclick="eliminarPedido(${pedido.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    return `
        <div class="actions-cell">
            <button class="btn-action-sm warning" title="Volver a En Tránsito" onclick="volverAEnTransito(${pedido.id})">
                <i class="fas fa-undo"></i>
            </button>
            <button class="btn-action-sm" title="Ver Detalle" onclick="abrirModalDetalle(${pedido.id})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-action-sm" title="Editar" onclick="abrirModalEditar(${pedido.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action-sm danger" title="Eliminar" onclick="eliminarPedido(${pedido.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// ========================================
// BUSCADOR DE PEDIDOS
// PRD: Funcionalidad útil para localización rápida
// ========================================

/**
 * Busca pedidos por número de pedido, cliente o dirección
 *
 * LÓGICA:
 * - Búsqueda en tiempo real (oninput)
 * - Busca en: número pedido, cliente, dirección
 * - Case insensitive
 * - Se combina con otros filtros activos
 *
 * @param {string} termino - Texto a buscar
 */
function buscarPedido(termino) {
    appState.filtros.busqueda = termino.toLowerCase().trim();
    console.log('🔍 Buscando:', termino);
    render();
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

    // Filtro por búsqueda (texto libre)
    if (appState.filtros.busqueda) {
        const termino = appState.filtros.busqueda;
        resultado = resultado.filter(p =>
            (p.numero && p.numero.toLowerCase().includes(termino)) ||
            (p.cliente && p.cliente.toLowerCase().includes(termino)) ||
            (p.direccion && p.direccion.toLowerCase().includes(termino)) ||
            (p.ciudad && p.ciudad.toLowerCase().includes(termino))
        );
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

    // Resetear formulario de método de pago
    resetearFormularioMetodoPago();

    modal.classList.remove('hidden');
}

function cerrarModal() {
    const modal = document.getElementById('modal-entregado');
    modal.classList.add('hidden');
    pedidoSeleccionadoId = null;
}

// Funciones calcularPago() y validarSuma() eliminadas
// Los pagos ahora se registran solo desde Cuenta Corriente

/**
 * Confirma pedido como entregado y genera cargo en Cuenta Corriente
 *
 * SINCRONIZACIÓN CC ↔ VENTAS:
 * - Al marcar entregado se genera automáticamente un CARGO en CC
 * - El pago se registra posteriormente desde CC del cliente
 * - EXCEPCIÓN: Cliente "Sin registro" NO genera cargo en CC (PRD 6.5)
 *
 * PRD: prd/ventas.html - Sección 6.4 y 6.5
 */
function confirmarEntregado() {
    const pedido = appState.pedidos.find(p => p.id === pedidoSeleccionadoId);
    if (!pedido) return;

    // Calcular total del pedido
    const total = BambuState.calcularTotalPedido(pedido.id);

    // Verificar si es cliente "Sin registro" (PRD 6.5)
    const esSinRegistro = pedido.cliente_id === 0 || pedido.cliente === 'SIN REGISTRO';

    // Obtener método de pago seleccionado
    const metodoPagoData = obtenerMetodoPagoSeleccionado();

    // VALIDACIÓN PRD 6.5: Si es FÁBRICA + Sin registro → pago obligatorio
    if (esSinRegistro && pedido.tipo === 'fabrica' && !metodoPagoData) {
        mostrarNotificacion('⚠️ Ventas "Sin registro" requieren método de pago obligatorio', 'warning');
        return;
    }

    // Validar método de pago mixto - PRD 6.2 permite pagos parciales
    if (metodoPagoData && metodoPagoData.metodo === 'mixto') {
        const sumaValida = validarSumaMixto();
        if (!sumaValida) {
            mostrarNotificacion('⚠️ El monto no puede superar el total del pedido', 'warning');
            return;
        }
    }

    // Marcar como entregado
    pedido.estado = 'entregado';
    pedido.fechaEntrega = new Date().toISOString();

    // Calcular monto pagado (PRD 6.2 - Pagos parciales)
    let montoPagado = 0;
    if (metodoPagoData) {
        pedido.metodoPago = metodoPagoData.metodo;
        if (metodoPagoData.metodo === 'mixto') {
            pedido.montoEfectivo = metodoPagoData.montoEfectivo;
            pedido.montoDigital = metodoPagoData.montoDigital;
            montoPagado = metodoPagoData.montoEfectivo + metodoPagoData.montoDigital;
        } else if (metodoPagoData.metodo === 'efectivo') {
            pedido.montoEfectivo = total;
            montoPagado = total;
        } else if (metodoPagoData.metodo === 'digital') {
            pedido.montoDigital = total;
            montoPagado = total;
        }
    }

    // Guardar monto_pagado y crear registro de pago inicial
    pedido.monto_pagado = montoPagado;
    if (montoPagado > 0) {
        pedido.pagos = pedido.pagos || [];
        // Crear registro de pago inicial
        const pagoInicial = {
            id: 1,
            fecha: pedido.fechaEntrega,
            monto: montoPagado,
            metodo: metodoPagoData.metodo,
            tipo: 'asociado',
            registrado_por: 'admin@bambu.com'
        };
        // Si es mixto, crear dos registros separados
        if (metodoPagoData.metodo === 'mixto') {
            pedido.pagos = [];
            if (metodoPagoData.montoEfectivo > 0) {
                pedido.pagos.push({ id: 1, fecha: pedido.fechaEntrega, monto: metodoPagoData.montoEfectivo, metodo: 'efectivo', tipo: 'asociado', registrado_por: 'admin@bambu.com' });
            }
            if (metodoPagoData.montoDigital > 0) {
                pedido.pagos.push({ id: pedido.pagos.length + 1, fecha: pedido.fechaEntrega, monto: metodoPagoData.montoDigital, metodo: 'digital', tipo: 'asociado', registrado_por: 'admin@bambu.com' });
            }
        } else {
            pedido.pagos = [pagoInicial];
        }
    }

    // Actualizar en BambuState también
    BambuState.update('pedidos', pedido.id, {
        estado: 'entregado',
        fechaEntrega: pedido.fechaEntrega,
        metodoPago: pedido.metodoPago || null,
        montoEfectivo: pedido.montoEfectivo || 0,
        montoDigital: pedido.montoDigital || 0,
        monto_pagado: pedido.monto_pagado || 0,
        pagos: pedido.pagos || []
    });

    // SINCRONIZACIÓN: Generar cargo en Cuenta Corriente
    // PRD 6.5: "Sin registro" NO genera cargo en CC
    if (pedido.cliente_id && pedido.cliente_id !== 0 && total > 0 && !esSinRegistro) {
        BambuState.registrarCargoCC({
            cliente_id: pedido.cliente_id,
            pedido_id: pedido.id,
            monto: total,
            descripcion: `Pedido ${pedido.numero}`,
            fecha: pedido.fecha || BambuState.FECHA_SISTEMA
        });
        console.log(`✅ Cargo CC generado: $${total.toLocaleString()} para cliente ${pedido.cliente_id}`);
    } else if (esSinRegistro) {
        console.log(`ℹ️ Venta "Sin registro" - No se genera cargo en CC`);
    }

    // Mensaje según método de pago (PRD 6.2 - Pagos parciales)
    let mensajePago = '';
    let mensajeParcial = '';
    const saldoPendiente = total - montoPagado;

    if (metodoPagoData) {
        if (metodoPagoData.metodo === 'mixto') {
            mensajePago = ` Pago: $${metodoPagoData.montoEfectivo.toLocaleString()} efectivo + $${metodoPagoData.montoDigital.toLocaleString()} digital.`;
        } else {
            mensajePago = ` Método: ${metodoPagoData.metodo}.`;
        }

        // Mensaje de pago parcial si aplica
        if (saldoPendiente > 0) {
            mensajeParcial = ` Saldo pendiente: $${saldoPendiente.toLocaleString()} en CC.`;
        }
    }

    console.log('Pedido marcado como entregado:', pedido);

    // Re-renderizar
    render();
    cerrarModal();

    // Mostrar notificación (diferente si es Sin registro)
    if (esSinRegistro) {
        mostrarNotificacion(`✅ Pedido ${pedido.numero} ENTREGADO (Sin registro).${mensajePago} Sin cargo en CC.`);
    } else if (saldoPendiente > 0) {
        mostrarNotificacion(`✅ Pedido ${pedido.numero} ENTREGADO.${mensajePago}${mensajeParcial}`, 'warning');
    } else {
        mostrarNotificacion(`✅ Pedido ${pedido.numero} ENTREGADO.${mensajePago} Pago completo.`);
    }
}

function irACuentaCorriente() {
    // Redirigir a cliente-detalle.html (en producción sería con el ID del cliente)
    alert('🔄 Redirigiendo a Cuenta Corriente del cliente...\n\nEn producción: /clientes/{id}/cuenta-corriente');

    // Por ahora, abrir en nueva pestaña
    window.open('cliente-detalle.html', '_blank');
}

// ========================================
// MÉTODO DE PAGO - Funciones auxiliares
// PRD: prd/ventas.html - Sección 6.1
// ========================================

/**
 * Muestra/oculta campos de montos cuando se selecciona "Mixto"
 *
 * LÓGICA DE NEGOCIO:
 * - Efectivo/Digital: solo marcar el método
 * - Mixto: requiere desglose de montos
 */
function toggleCamposMixto() {
    const mixtoRadio = document.querySelector('input[name="metodoPago"][value="mixto"]');
    const camposMixto = document.getElementById('mixto-campos');
    const totalEsperado = document.getElementById('mixto-total-esperado');

    if (mixtoRadio && mixtoRadio.checked) {
        camposMixto.classList.remove('hidden');
        // Setear el total esperado
        const pedido = appState.pedidos.find(p => p.id === pedidoSeleccionadoId);
        if (pedido) {
            const total = BambuState.calcularTotalPedido(pedido.id);
            totalEsperado.textContent = '$' + total.toLocaleString();
        }
        // Limpiar campos
        document.getElementById('monto-efectivo').value = '';
        document.getElementById('monto-digital').value = '';
        validarSumaMixto();
    } else {
        camposMixto.classList.add('hidden');
    }
}

/**
 * Valida suma de efectivo + digital para pago mixto
 * PRD 6.2 - PAGOS PARCIALES PERMITIDOS
 *
 * VALIDACIONES:
 * - Suma puede ser <= total (pago parcial permitido)
 * - Suma > total: inválido (sobrepago)
 * - Suma > 0: válido (mínimo requerido)
 * - Feedback visual: verde si válido, naranja si parcial, rojo si sobrepago
 */
function validarSumaMixto() {
    const montoEfectivo = parseFloat(document.getElementById('monto-efectivo').value) || 0;
    const montoDigital = parseFloat(document.getElementById('monto-digital').value) || 0;
    const suma = montoEfectivo + montoDigital;

    const pedido = appState.pedidos.find(p => p.id === pedidoSeleccionadoId);
    const totalEsperado = pedido ? BambuState.calcularTotalPedido(pedido.id) : 0;

    const validacionDiv = document.getElementById('mixto-validacion');
    const sumaActualSpan = validacionDiv.querySelector('.suma-actual');

    // Remover clases previas
    validacionDiv.classList.remove('valido', 'invalido', 'parcial');

    if (suma > totalEsperado) {
        // Sobrepago - no permitido
        sumaActualSpan.textContent = `Suma: $${suma.toLocaleString()} (excede el total)`;
        validacionDiv.classList.add('invalido');
        return false;
    } else if (suma === totalEsperado && suma > 0) {
        // Pago completo
        sumaActualSpan.textContent = `Suma: $${suma.toLocaleString()} ✓ Pago completo`;
        validacionDiv.classList.add('valido');
        return true;
    } else if (suma > 0 && suma < totalEsperado) {
        // Pago parcial - PRD 6.2 permite esto
        const pendiente = totalEsperado - suma;
        sumaActualSpan.textContent = `Suma: $${suma.toLocaleString()} (parcial - quedará $${pendiente.toLocaleString()} en CC)`;
        validacionDiv.classList.add('parcial');
        return true; // Válido según PRD 6.2
    }

    sumaActualSpan.textContent = 'Suma: $0';
    return false;
}

/**
 * Obtiene el método de pago seleccionado y sus montos
 *
 * @returns {Object} { metodo, montoEfectivo, montoDigital } o null si no válido
 */
function obtenerMetodoPagoSeleccionado() {
    const metodoRadio = document.querySelector('input[name="metodoPago"]:checked');

    if (!metodoRadio) {
        return null; // No se seleccionó método
    }

    const metodo = metodoRadio.value;

    if (metodo === 'mixto') {
        const montoEfectivo = parseFloat(document.getElementById('monto-efectivo').value) || 0;
        const montoDigital = parseFloat(document.getElementById('monto-digital').value) || 0;

        return {
            metodo: 'mixto',
            montoEfectivo,
            montoDigital
        };
    }

    return { metodo, montoEfectivo: 0, montoDigital: 0 };
}

/**
 * Resetea el formulario de método de pago al abrir el modal
 */
function resetearFormularioMetodoPago() {
    // Deseleccionar todos los radios
    document.querySelectorAll('input[name="metodoPago"]').forEach(r => r.checked = false);
    // Ocultar campos mixto
    document.getElementById('mixto-campos').classList.add('hidden');
    // Limpiar inputs
    document.getElementById('monto-efectivo').value = '';
    document.getElementById('monto-digital').value = '';
}

// ========================================
// VOLVER A EN TRÁNSITO (Cambiar estado inverso)
// PRD: prd/ventas.html - Sección 5.3
// ========================================

/**
 * Cambia el estado de un pedido de ENTREGADO a EN TRÁNSITO
 *
 * LÓGICA DE NEGOCIO:
 * - Solo pedidos con estado 'entregado' pueden revertirse
 * - Se elimina la fecha de entrega
 * - El cargo en CC permanece (se ajusta manualmente si es necesario)
 *
 * @param {number} pedidoId - ID del pedido a revertir
 */
function volverAEnTransito(pedidoId) {
    const pedido = appState.pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        console.error('Pedido no encontrado:', pedidoId);
        return;
    }

    // Validar que esté entregado
    if (pedido.estado !== 'entregado') {
        alert('Solo se pueden revertir pedidos con estado ENTREGADO');
        return;
    }

    // Confirmar acción
    const mensaje = `¿Volver pedido ${pedido.numero} a EN TRÁNSITO?\n\n` +
        `⚠️ El cargo en Cuenta Corriente permanecerá.\n` +
        `Si el cliente ya pagó, deberás ajustarlo manualmente.`;

    if (!confirm(mensaje)) {
        return;
    }

    // Cambiar estado
    pedido.estado = 'transito';
    pedido.fechaEntrega = null;

    // Actualizar en BambuState
    BambuState.update('pedidos', pedido.id, {
        estado: 'en transito',
        fechaEntrega: null
    });

    console.log('⏪ Pedido revertido a EN TRÁNSITO:', pedido.numero);

    // Re-renderizar
    render();

    // Notificación
    mostrarNotificacion(`⏪ Pedido ${pedido.numero} vuelto a EN TRÁNSITO`);
}

// ========================================
// ELIMINAR PEDIDO CON REINTEGRO STOCK
// PRD: prd/ventas.html - Sección 5.5
// ========================================

/**
 * Elimina un pedido con reintegro de stock y ajuste en CC
 *
 * LÓGICA DE NEGOCIO:
 * - Confirmación obligatoria con advertencia
 * - Si pedido entregado: reintegrar productos al stock
 * - Si tiene cargo en CC: generar nota de crédito/ajuste
 * - Eliminar de la lista de pedidos
 *
 * @param {number} pedidoId - ID del pedido a eliminar
 */
function eliminarPedido(pedidoId) {
    const pedido = appState.pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        console.error('Pedido no encontrado:', pedidoId);
        return;
    }

    // Obtener productos del pedido para mostrar en confirmación
    const productos = getProductosPedido(pedidoId);
    const numProductos = productos.length;

    // Preparar mensaje de confirmación
    let mensaje = `⚠️ ¿ELIMINAR PEDIDO ${pedido.numero}?\n\n`;
    mensaje += `Cliente: ${pedido.cliente}\n`;
    mensaje += `Total: ${formatearMonto(pedido.total)}\n`;
    mensaje += `Productos: ${numProductos} items\n\n`;

    if (pedido.estado === 'entregado') {
        mensaje += `📦 REINTEGRO STOCK:\n`;
        mensaje += `Se reintegrarán ${numProductos} productos al inventario.\n\n`;

        // Verificar si tiene cargo en CC
        mensaje += `💰 CUENTA CORRIENTE:\n`;
        mensaje += `Se generará una nota de crédito por ${formatearMonto(pedido.total)}.\n\n`;
    }

    mensaje += `Esta acción NO se puede deshacer.`;

    if (!confirm(mensaje)) {
        return;
    }

    // =========================================================================
    // REGLA DE NEGOCIO: Reintegrar stock al eliminar pedido
    // PRD: prd/ventas.html - Sección 5.5
    // =========================================================================
    if (pedido.estado === 'entregado' || pedido.estado === 'transito' || pedido.estado === 'en transito') {
        console.log('📦 Reintegrando stock para productos:', productos);

        // Reintegrar stock de cada producto
        productos.forEach(prod => {
            const resultado = BambuState.actualizarStock(
                prod.producto_id,
                prod.cantidad,  // Positivo = reintegrar
                'pedido_eliminado',
                pedidoId
            );

            if (resultado.exito) {
                console.log(`  ✅ +${prod.cantidad}x ${prod.nombre} → Stock: ${resultado.stockNuevo}`);
            } else {
                console.warn(`  ⚠️ Error reintegrando ${prod.nombre}: ${resultado.error}`);
            }
        });

        // Generar nota de crédito en CC (solo si estaba ENTREGADO, porque tuvo cargo)
        if (pedido.estado === 'entregado' && pedido.cliente_id && pedido.total > 0) {
            BambuState.registrarPagoCC({
                cliente_id: pedido.cliente_id,
                pedido_id: pedido.id,
                monto: pedido.total,
                tipo: 'nota_credito',
                descripcion: `Anulación pedido ${pedido.numero}`,
                fecha: BambuState.FECHA_SISTEMA
            });
            console.log(`💳 Nota de crédito generada: ${formatearMonto(pedido.total)}`);
        }
    }

    // Eliminar pedido del estado local
    appState.pedidos = appState.pedidos.filter(p => p.id !== pedidoId);

    // Eliminar de BambuState
    BambuState.delete('pedidos', pedidoId);

    console.log('🗑️ Pedido eliminado:', pedido.numero);

    // Re-renderizar
    render();

    // Notificación
    const msgExtra = pedido.estado === 'entregado' ? ' (stock reintegrado)' : '';
    mostrarNotificacion(`🗑️ Pedido ${pedido.numero} eliminado${msgExtra}`);
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
        fechaDesde: '2026-01-01',
        fechaHasta: '2026-01-31',
        tipo: 'todos',
        vehiculo: 'todos',
        metodoPago: 'todos',
        busqueda: ''
    };

    // Actualizar inputs
    document.getElementById('filter-estado').value = 'todos';
    document.getElementById('filter-fecha-desde').value = '2026-01-01';
    document.getElementById('filter-fecha-hasta').value = '2026-01-31';
    document.getElementById('filter-tipo').value = 'todos';
    document.getElementById('filter-vehiculo').value = 'todos';
    document.getElementById('filter-pago').value = 'todos';
    document.getElementById('filter-busqueda').value = '';

    render();

    console.log('Filtros limpiados');
}

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

/**
 * Redirige al Cotizador para editar un borrador existente
 * PRD: Sección 12.1 - "Borradores se pueden recuperar y editar"
 *
 * FLUJO:
 * 1. Usuario hace click en "Editar" en la tabla de borradores
 * 2. Se redirige a cotizador.html?editar={borradorId}
 * 3. Cotizador detecta el parámetro y carga los datos del borrador
 */
function editarBorrador(borradorId) {
    console.log('📝 Redirigiendo a Cotizador para editar borrador:', borradorId);
    window.location.href = `cotizador.html?editar=${borradorId}`;
}

/**
 * Confirma un borrador convirtiéndolo en pedido activo
 *
 * REGLA DE NEGOCIO:
 * - Cambia estado de 'borrador' a 'en transito'
 * - Descuenta stock de todos los productos
 * - Persiste cambios en BambuState
 *
 * PRD: prd/ventas.html - Sección Borradores
 */
function confirmarBorrador(borradorId) {
    const borrador = appState.borradores.find(b => b.id === borradorId);
    if (!borrador) return;

    if (!confirm(`¿Confirmar pedido ${borrador.numero}?\n\nSe moverá a la sección Pedidos en estado EN TRÁNSITO`)) {
        return;
    }

    // Obtener el pedido real desde BambuState (los borradores son pedidos con estado='borrador')
    const pedidoBambu = BambuState.getById('pedidos', borradorId);

    // =========================================================================
    // REGLA DE NEGOCIO: Descontar stock al confirmar borrador
    // PRD: prd/productos.html - Sección Stock
    // =========================================================================
    if (pedidoBambu) {
        const items = BambuState.getItemsPedido(borradorId);
        items.forEach(item => {
            const producto = BambuState.getById('productos', item.producto_id);
            const resultado = BambuState.actualizarStock(
                item.producto_id,
                -item.cantidad,  // Negativo = descontar
                'borrador_confirmado',
                borradorId
            );

            if (resultado.exito) {
                console.log(`📦 Stock descontado: ${producto?.nombre || item.producto_id} -${item.cantidad} → ${resultado.stockNuevo}`);
            } else {
                console.warn(`⚠️ Error descontando stock: ${resultado.error}`);
            }
        });

        // Actualizar estado en BambuState
        BambuState.update('pedidos', borradorId, {
            estado: 'en transito',
            fecha: BambuState.FECHA_SISTEMA
        });
    }

    // Crear nuevo pedido a partir del borrador (para appState local)
    const nuevoPedido = {
        id: borradorId,
        numero: borrador.numero,
        fecha: BambuState.FECHA_SISTEMA,
        fechaDisplay: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        cliente: borrador.cliente,
        direccion: borrador.direccion,
        ciudad: borrador.ciudad,
        tipo: borrador.tipo,
        estado: 'transito',
        vehiculo: borrador.tipo === 'fabrica' ? null : 'Reparto 1',
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
    appState.pedidos.unshift(nuevoPedido);

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

    // 3. Obtener fechas de la semana actual desde BambuState
    const semana = BambuState.getSemanaActual();
    const filterFechaDesde = document.getElementById('filter-fecha-desde');
    const filterFechaHasta = document.getElementById('filter-fecha-hasta');

    if (filterFechaDesde && filterFechaHasta) {
        filterFechaDesde.value = semana[0];       // Lunes 06/01
        filterFechaHasta.value = semana[4];       // Viernes 10/01
    }

    // 4. Actualizar appState.filtros
    appState.filtros.tipo = 'fabrica';
    appState.filtros.fechaDesde = semana[0];
    appState.filtros.fechaHasta = semana[4];

    // 5. Aplicar filtros y re-renderizar
    aplicarFiltros();
    renderizarTabla();
    renderizarPaginacion();
    renderizarStats();

    // 6. Scroll hacia arriba
    const viewContainer = document.getElementById('view-pedidos');
    if (viewContainer) {
        viewContainer.scrollTop = 0;
    }

    console.log('🏭 Filtros aplicados: Fábrica - Semana', semana[0], 'a', semana[4]);
}

// ========================================
// CALENDARIO: NAVEGACIÓN DE SEMANAS
// PRD: prd/ventas.html - Sección 8.2
// ========================================

// Offset de semana (0 = semana actual del sistema)
let semanaOffset = 0;

/**
 * Navega entre semanas del calendario
 *
 * LÓGICA:
 * - direccion -1: semana anterior
 * - direccion 0: volver a semana actual (HOY)
 * - direccion +1: semana siguiente
 *
 * @param {number} direccion - -1, 0, o 1
 */
function navegarSemana(direccion) {
    if (direccion === 0) {
        semanaOffset = 0;
    } else {
        semanaOffset += direccion;
    }

    console.log('📅 Navegando a semana offset:', semanaOffset);
    renderizarCalendario();
}

/**
 * Obtiene las fechas de una semana dado un offset
 * @param {number} offset - Número de semanas desde la actual (0 = actual)
 * @returns {Array<string>} Array de 5 fechas YYYY-MM-DD (lunes a viernes)
 */
function getSemanaConOffset(offset) {
    // Semana base del sistema: 06-10 Enero 2026
    const fechaBase = new Date('2026-01-06T12:00:00'); // Lunes base

    // Agregar offset de semanas (7 días por semana)
    fechaBase.setDate(fechaBase.getDate() + (offset * 7));

    const semana = [];
    for (let i = 0; i < 5; i++) {
        const fecha = new Date(fechaBase);
        fecha.setDate(fechaBase.getDate() + i);
        semana.push(fecha.toISOString().split('T')[0]);
    }

    return semana;
}

// ========================================
// EXPORTAR HOJA DE REPARTO
// PRD: prd/ventas.html - Sección 9.2
// ========================================

let diaSeleccionadoExportar = null;

/**
 * Abre modal para exportar hoja de reparto
 */
function abrirModalExportarHoja() {
    // Obtener día seleccionado del calendario
    const diaCard = document.querySelector('.dia-card.selected');
    if (!diaCard) {
        mostrarNotificacion('⚠️ Selecciona un día del calendario primero', 'warning');
        return;
    }

    diaSeleccionadoExportar = diaCard.dataset.fecha;
    document.getElementById('modal-exportar-hoja').classList.remove('hidden');
}

function cerrarModalExportarHoja() {
    document.getElementById('modal-exportar-hoja').classList.add('hidden');
    diaSeleccionadoExportar = null;
}

/**
 * Exporta la hoja de reparto del día seleccionado
 *
 * @param {string} formato - 'con-precios' o 'sin-precios'
 *
 * LÓGICA:
 * - Obtiene pedidos del día seleccionado
 * - Agrupa por vehículo
 * - Genera documento (mock en prototipo)
 */
function exportarHojaReparto(formato) {
    if (!diaSeleccionadoExportar) {
        mostrarNotificacion('⚠️ No hay día seleccionado', 'warning');
        return;
    }

    // Obtener pedidos del día
    const pedidosDia = appState.pedidos.filter(p =>
        p.tipo === 'reparto' &&
        p.fecha === diaSeleccionadoExportar
    );

    if (pedidosDia.length === 0) {
        mostrarNotificacion('⚠️ No hay pedidos de reparto para este día', 'warning');
        cerrarModalExportarHoja();
        return;
    }

    // Agrupar por vehículo
    const porVehiculo = {};
    pedidosDia.forEach(p => {
        const vehiculo = p.vehiculo || 'Sin asignar';
        if (!porVehiculo[vehiculo]) porVehiculo[vehiculo] = [];
        porVehiculo[vehiculo].push(p);
    });

    // En producción: generar Excel/Word real
    // En prototipo: mostrar resumen
    const fecha = new Date(diaSeleccionadoExportar).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    let resumen = `📄 HOJA DE REPARTO - ${fecha.toUpperCase()}\n`;
    resumen += `Formato: ${formato === 'con-precios' ? 'CON PRECIOS' : 'SIN PRECIOS'}\n\n`;

    Object.keys(porVehiculo).forEach(vehiculo => {
        const pedidos = porVehiculo[vehiculo];
        resumen += `🚚 ${vehiculo} (${pedidos.length} pedidos)\n`;
        pedidos.forEach((p, i) => {
            resumen += `   ${i + 1}. ${p.cliente} - ${p.direccion}`;
            if (formato === 'con-precios') {
                resumen += ` - ${formatearMonto(p.total)}`;
            }
            resumen += '\n';
        });
        resumen += '\n';
    });

    console.log(resumen);
    cerrarModalExportarHoja();

    // Mock: simular descarga
    mostrarNotificacion(`✅ Hoja de reparto generada (${pedidosDia.length} pedidos)`);

    // En producción usar: window.open() o descargar blob
    alert(`📄 EXPORTACIÓN SIMULADA\n\n${resumen}\n\n(En producción se descargará como Excel/Word)`);
}

// ========================================
// EXPORTAR EXCEL CON SELECCIÓN DE COLUMNAS
// PRD: prd/ventas.html - Sección 9.1
// ========================================

/**
 * LÓGICA DE NEGOCIO:
 * - Columnas obligatorias: # Pedido, Fecha entrega (siempre incluidas)
 * - Columnas opcionales: 13 campos seleccionables por el usuario
 * - Sistema recuerda última selección del usuario (localStorage)
 * - Exporta pedidos según filtros aplicados actualmente
 */

const COLUMNAS_EXCEL = {
    obligatorias: ['numero', 'fecha'],
    opcionales: ['cliente', 'direccion', 'telefono', 'tipo', 'vehiculo', 'repartidor',
                 'productos', 'subtotal', 'descuentos', 'ajustes', 'total', 'metodo_pago', 'estado']
};

const STORAGE_KEY_COLUMNAS = 'bambu_excel_columnas';

/**
 * Abre modal para exportar Excel con selección de columnas
 * Carga preferencias guardadas del usuario
 */
function abrirModalExportarExcel() {
    // Cargar preferencias guardadas
    cargarPreferenciasColumnas();

    // Actualizar contador de pedidos
    const count = appState.pedidosFiltrados.length;
    document.getElementById('count-pedidos-export').textContent = count;

    // Mostrar modal
    document.getElementById('modal-exportar-excel').classList.remove('hidden');
}

/**
 * Cierra modal de exportar Excel
 */
function cerrarModalExportarExcel() {
    document.getElementById('modal-exportar-excel').classList.add('hidden');
}

/**
 * Carga preferencias de columnas desde localStorage
 * Si no hay preferencias, usa las marcadas por defecto en el HTML
 */
function cargarPreferenciasColumnas() {
    const guardadas = localStorage.getItem(STORAGE_KEY_COLUMNAS);

    if (guardadas) {
        try {
            const columnas = JSON.parse(guardadas);
            const checkboxes = document.querySelectorAll('#columnas-opcionales input[type="checkbox"]');

            checkboxes.forEach(cb => {
                cb.checked = columnas.includes(cb.value);
            });
        } catch (e) {
            console.warn('Error cargando preferencias de columnas:', e);
        }
    }
}

/**
 * Guarda preferencias de columnas en localStorage
 */
function guardarPreferenciasColumnas() {
    const checkboxes = document.querySelectorAll('#columnas-opcionales input[type="checkbox"]:checked');
    const columnas = Array.from(checkboxes).map(cb => cb.value);
    localStorage.setItem(STORAGE_KEY_COLUMNAS, JSON.stringify(columnas));
}

/**
 * Toggle seleccionar/deseleccionar todas las columnas opcionales
 */
function toggleTodasColumnas() {
    const checkboxes = document.querySelectorAll('#columnas-opcionales input[type="checkbox"]');
    const todasMarcadas = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(cb => {
        cb.checked = !todasMarcadas;
    });

    // Actualizar texto del botón
    const btn = document.querySelector('.columnas-titulo .btn-link-sm');
    btn.textContent = todasMarcadas ? 'Seleccionar todas' : 'Deseleccionar todas';
}

/**
 * Exporta pedidos filtrados a Excel (mock)
 *
 * LÓGICA DE NEGOCIO:
 * - Incluye siempre columnas obligatorias (# Pedido, Fecha)
 * - Incluye columnas opcionales seleccionadas por el usuario
 * - Guarda preferencias para próxima exportación
 * - Genera descarga de archivo (en producción: SheetJS/xlsx)
 */
function exportarExcel() {
    // Obtener columnas seleccionadas
    const columnasOpcionales = Array.from(
        document.querySelectorAll('#columnas-opcionales input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    // Guardar preferencias
    guardarPreferenciasColumnas();

    // Obtener pedidos a exportar
    const pedidos = appState.pedidosFiltrados;

    if (pedidos.length === 0) {
        mostrarNotificacion('⚠️ No hay pedidos para exportar con los filtros actuales', 'warning');
        return;
    }

    // Construir headers
    const headers = ['# Pedido', 'Fecha Entrega'];
    const mapeoColumnas = {
        cliente: 'Cliente',
        direccion: 'Dirección',
        telefono: 'Teléfono',
        tipo: 'Tipo',
        vehiculo: 'Vehículo',
        repartidor: 'Repartidor',
        productos: 'Productos',
        subtotal: 'Subtotal',
        descuentos: 'Descuentos',
        ajustes: 'Ajustes',
        total: 'Total',
        metodo_pago: 'Método Pago',
        estado: 'Estado'
    };

    columnasOpcionales.forEach(col => {
        if (mapeoColumnas[col]) {
            headers.push(mapeoColumnas[col]);
        }
    });

    // Construir filas de datos
    const filas = pedidos.map(p => {
        const fila = [p.numero, formatearFechaEntrega(p.fecha)];

        columnasOpcionales.forEach(col => {
            switch(col) {
                case 'cliente':
                    fila.push(p.cliente || '-');
                    break;
                case 'direccion':
                    fila.push(p.direccion || '-');
                    break;
                case 'telefono':
                    const cliente = BambuState.getById('clientes', p.cliente_id);
                    fila.push(cliente?.telefono || '-');
                    break;
                case 'tipo':
                    fila.push(p.tipo.toUpperCase());
                    break;
                case 'vehiculo':
                    fila.push(p.vehiculo || 'Sin asignar');
                    break;
                case 'repartidor':
                    fila.push(p.repartidor || '-');
                    break;
                case 'productos':
                    const items = BambuState.getItemsPedido(p.id);
                    const prods = items.map(i => {
                        const prod = BambuState.getById('productos', i.producto_id);
                        return `${prod?.nombre || 'Producto'} x${i.cantidad}`;
                    }).join(', ');
                    fila.push(prods || '-');
                    break;
                case 'subtotal':
                    fila.push(formatearMonto(p.subtotal || p.total));
                    break;
                case 'descuentos':
                    fila.push(formatearMonto(p.descuento || 0));
                    break;
                case 'ajustes':
                    fila.push(formatearMonto(p.ajuste || 0));
                    break;
                case 'total':
                    fila.push(formatearMonto(p.total));
                    break;
                case 'metodo_pago':
                    const metodos = { efectivo: 'Efectivo', digital: 'Digital', mixto: 'Mixto' };
                    fila.push(metodos[p.metodoPago] || 'Sin registrar');
                    break;
                case 'estado':
                    fila.push(p.estado === 'entregado' ? 'Entregado' : 'En tránsito');
                    break;
            }
        });

        return fila;
    });

    // Generar vista previa para mock
    const preview = [
        `📊 EXPORTACIÓN EXCEL - ${pedidos.length} pedidos`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `Columnas: ${headers.join(' | ')}`,
        ``,
        `Primeros 3 registros:`,
        ...filas.slice(0, 3).map((f, i) => `${i+1}. ${f.join(' | ')}`),
        filas.length > 3 ? `... y ${filas.length - 3} registros más` : '',
        ``,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `(En producción: descarga archivo .xlsx)`
    ].join('\n');

    console.log('📊 Exportando Excel:', { headers, filas });

    cerrarModalExportarExcel();
    mostrarNotificacion(`✅ Excel generado: ${pedidos.length} pedidos, ${headers.length} columnas`);

    // Mock: mostrar preview
    alert(preview);
}

/**
 * Renderiza el calendario con las tarjetas de días
 * Genera dinámicamente basado en semanaOffset
 */
function renderizarCalendario() {
    const semana = getSemanaConOffset(semanaOffset);
    const grid = document.getElementById('calendario-grid');
    const titulo = document.getElementById('calendario-titulo');

    // Actualizar título
    const fechaInicio = new Date(semana[0] + 'T12:00:00');
    const fechaFin = new Date(semana[4] + 'T12:00:00');
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const diaInicio = fechaInicio.getDate().toString().padStart(2, '0');
    const diaFin = fechaFin.getDate().toString().padStart(2, '0');
    const mes = meses[fechaInicio.getMonth()];
    const anio = fechaInicio.getFullYear();

    titulo.textContent = `Semana: ${diaInicio} - ${diaFin} ${mes} ${anio}`;

    // Generar HTML de tarjetas
    const diasNombres = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
    const diasKeys = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const hoy = BambuState.FECHA_SISTEMA;

    // Calcular datos de fábrica para la semana
    const pedidosFabrica = appState.pedidos.filter(p =>
        p.tipo === 'fabrica' &&
        semana.includes(p.fecha)
    );
    const fabricaStats = {
        pedidos: pedidosFabrica.length,
        peso: pedidosFabrica.reduce((sum, p) => sum + (p.peso || 0), 0)
    };

    let html = `
        <!-- Tarjeta Fábrica -->
        <div class="dia-card fabrica-card">
            <div class="dia-header">
                <span class="dia-label">FABRICA</span>
                <span class="dia-numero"><i class="fas fa-industry"></i></span>
                <span class="dia-tipo">Vendidos en fabrica</span>
                <span class="badge-estado-semanal">Semanal</span>
            </div>
            <div class="dia-stats">
                <div class="dia-stat"><i class="fas fa-box"></i><span><strong>${fabricaStats.pedidos} pedidos</strong></span></div>
                <div class="dia-stat"><i class="fas fa-weight"></i><span><strong>${fabricaStats.peso} kg</strong></span></div>
            </div>
            <div class="dia-pagos-line">
                <span class="pago-item"><i class="fas fa-money-bill-wave"></i> XXX</span>
                <span class="pago-item"><i class="fas fa-credit-card"></i> XXX</span>
            </div>
            <div class="dia-botones">
                <button class="btn-filtrar-lista-dia" onclick="verVentasFabrica()"><i class="fas fa-list"></i> Ver pedidos</button>
            </div>
        </div>
    `;

    // Generar tarjetas de días
    semana.forEach((fecha, index) => {
        const estado = calcularEstadoDia(fecha);
        const diaNombre = diasNombres[index];
        const diaKey = diasKeys[index];
        const diaNum = new Date(fecha + 'T12:00:00').getDate().toString().padStart(2, '0');

        // Contar pedidos del día (solo reparto)
        const pedidosDia = appState.pedidos.filter(p =>
            p.fecha === fecha && p.tipo === 'reparto'
        );
        const numPedidos = pedidosDia.length;
        const pesoTotal = pedidosDia.reduce((sum, p) => sum + (p.peso || 0), 0);

        // Clases según estado
        let claseEstado = '';
        let badgeHtml = '';
        let esHoy = estado === 'hoy';
        let esControlado = estado === 'controlado';
        let esSinControl = estado === 'sin-control';

        if (esHoy) {
            claseEstado = 'dia-hoy';
            badgeHtml = '<span class="badge-estado-hoy">HOY</span>';
        } else if (esControlado) {
            claseEstado = 'dia-controlado';
            badgeHtml = '<span class="badge-estado-controlado">Controlado</span>';
        } else if (esSinControl) {
            claseEstado = 'dia-sin-control';
            badgeHtml = `<button class="badge-estado-controlar" onclick="filtrarListaPorDia(event, '${fecha}'); event.stopPropagation();">Controlar</button>`;
        } else {
            // Futuro
            badgeHtml = '<span class="badge-estado-planificado">Planificado</span>';
        }

        // Active solo para el día actual si estamos en semana offset 0
        const activeClass = (semanaOffset === 0 && esHoy) ? 'active' : '';

        html += `
            <div class="dia-card ${claseEstado} ${activeClass}" data-dia="${diaKey}" data-fecha="${fecha}" onclick="seleccionarDia(this, '${diaKey}')">
                <div class="dia-header">
                    <span class="dia-label">${diaNombre}</span>
                    <span class="dia-numero">${diaNum}</span>
                    <span class="dia-tipo">Reparto</span>
                    ${badgeHtml}
                </div>
                <div class="dia-stats">
                    <div class="dia-stat"><i class="fas fa-box"></i><span><strong>${numPedidos} ped</strong></span></div>
                    <div class="dia-stat"><i class="fas fa-weight"></i><span><strong>${pesoTotal} kg</strong></span></div>
                </div>
                <div class="dia-pagos-line">
                    <span class="pago-item"><i class="fas fa-money-bill-wave"></i> ${esSinControl ? 'XXX' : calcularPagosDia(fecha).efectivo || '0'}</span>
                    <span class="pago-item"><i class="fas fa-credit-card"></i> ${esSinControl ? 'XXX' : calcularPagosDia(fecha).digital || '0'}</span>
                </div>
                <div class="dia-botones">
                    <button class="btn-ver-detalle-dia" onclick="verDetalleDia(event, '${fecha}')"><i class="fas fa-eye"></i> Ver detalle</button>
                    <button class="btn-filtrar-lista-dia" onclick="filtrarListaPorDia(event, '${fecha}')"><i class="fas fa-list"></i> Ver pedidos</button>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;

    // Renderizar vehículos del día seleccionado o miércoles por defecto
    const diaActivo = semanaOffset === 0 ? 'miercoles' : 'lunes';
    renderVehiculosCapacidades(diaActivo);
}

// ========================================
// CALENDARIO: SELECCIÓN DE DÍAS Y VEHÍCULOS
// ========================================

/**
 * Obtiene datos de vehículos para un día específico desde BambuState
 * @param {string} dia - 'lunes', 'martes', etc.
 * @returns {Array} Vehículos con su carga calculada
 */
function getVehiculosPorDia(dia) {
    const semana = BambuState.getSemanaActual();
    const diaIndex = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].indexOf(dia);
    const fecha = diaIndex >= 0 ? semana[diaIndex] : BambuState.FECHA_SISTEMA;

    const vehiculos = BambuState.getVehiculos();
    return vehiculos.map(v => {
        const carga = BambuState.calcularCargaVehiculo(v.id, fecha);
        return {
            nombre: v.nombre,
            pedidos: carga.pedidos,
            peso: carga.pesoKg,
            pesoMax: v.capacidadKg
        };
    });
}

// ========================================
// ESTADOS DE DÍAS - CONTROL DE REPARTO
// ========================================

// Estado de control de días (persiste en sesión, no en BambuState por ahora)
const DIAS_CONTROLADOS = {
    '2026-01-06': true  // Lunes ya controlado
};

/**
 * Obtiene información de un día del calendario
 * @param {string} fecha - 'YYYY-MM-DD'
 * @returns {Object}
 */
function getDiaData(fecha) {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const d = new Date(fecha + 'T12:00:00');
    return {
        fecha,
        dia: dias[d.getDay()],
        numero: d.getDate(),
        controlado: DIAS_CONTROLADOS[fecha] || false,
        fechaControl: DIAS_CONTROLADOS[fecha] ? new Date().toISOString() : null
    };
}

/**
 * Calcular el estado de un día según la fecha actual
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} 'futuro' | 'hoy' | 'sin-control' | 'controlado'
 */
function calcularEstadoDia(fecha) {
    const hoy = BambuState.FECHA_SISTEMA; // Miércoles 08/01/2026

    if (fecha > hoy) {
        return 'futuro';
    } else if (fecha === hoy) {
        return 'hoy';
    } else {
        // Día pasado: verificar si está controlado
        return DIAS_CONTROLADOS[fecha] ? 'controlado' : 'sin-control';
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
    const diaData = getDiaData(fecha);

    // Confirmación
    const dia = diaData.dia.toUpperCase();
    const numero = diaData.numero;
    if (!confirm(`¿Marcar día ${dia} ${numero} como controlado?\n\nEsto indica que ya revisaste todos los pedidos del día.`)) {
        return;
    }

    // Marcar como controlado
    DIAS_CONTROLADOS[fecha] = true;

    console.log(`✅ Día ${dia} ${numero} marcado como controlado`);
    mostrarNotificacion(`✅ Día ${dia} ${numero} marcado como controlado`);
}

/**
 * Marcar día como controlado desde la lista de pedidos
 * Valida pedidos en tránsito antes de marcar
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 */
function marcarDiaControladoDesdeLista(fecha) {
    const diaData = getDiaData(fecha);

    // Contar pedidos del día en tránsito
    const pedidosDelDia = appState.pedidos.filter(p => p.fecha === fecha);
    const pedidosEnTransito = pedidosDelDia.filter(p => p.estado === 'en transito');
    const cantidadTransito = pedidosEnTransito.length;

    // Preparar mensaje de confirmación
    const dia = diaData.dia.toUpperCase();
    const numero = diaData.numero;
    let mensaje = `¿Marcar día ${dia} ${numero} como controlado?\n\n`;

    if (cantidadTransito > 0) {
        mensaje += `⚠️ ADVERTENCIA: Hay ${cantidadTransito} pedido${cantidadTransito > 1 ? 's' : ''} aún EN TRÁNSITO.\n\n`;
        mensaje += `Pedidos en tránsito:\n`;
        pedidosEnTransito.slice(0, 5).forEach(p => {
            mensaje += `- ${p.numero}: ${p.direccion}\n`;
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
    DIAS_CONTROLADOS[fecha] = true;

    console.log(`✅ Día ${dia} ${numero} marcado como controlado (desde lista)`);

    // Actualizar badge en lista
    actualizarBadgeEstadoDia();

    // Actualizar calendario (para que la tarjeta muestre "Controlado")
    renderizarCalendario();

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
    const vehiculos = getVehiculosPorDia(dia);

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
    // Inicializar BambuState (carga desde localStorage o genera datos)
    BambuState.init();

    // Cargar pedidos desde BambuState (excluyendo borradores)
    const todosPedidos = BambuState.get('pedidos');

    // Adaptar pedidos al formato que espera la UI de ventas
    appState.pedidos = todosPedidos
        .filter(p => p.estado !== 'borrador')
        .map(p => {
            const cliente = BambuState.getById('clientes', p.cliente_id);
            return {
                ...p,
                cliente: p.direccion,
                telefono: cliente?.telefono || '',
                // Formato fecha para display
                fechaDisplay: p.fecha ? p.fecha.split('-').reverse().map(s => s.slice(-2)).join('/') : '',
                // Calcular totales desde items
                total: BambuState.calcularTotalPedido(p.id),
                peso: BambuState.calcularPesoPedido(p.id),
                items: BambuState.contarItemsPedido(p.id),
                // Estado compatible ('en transito' → 'transito' para la UI)
                estado: p.estado === 'en transito' ? 'transito' : p.estado
            };
        });

    // Cargar borradores
    appState.borradores = todosPedidos
        .filter(p => p.estado === 'borrador')
        .map(p => {
            const cliente = BambuState.getById('clientes', p.cliente_id);
            return {
                id: p.id,
                numero: p.numero,
                fechaCreacion: new Date().toISOString(),
                fechaCreacionDisplay: 'Borrador',
                cliente: p.direccion,
                direccion: p.direccion,
                ciudad: p.ciudad,
                tipo: p.tipo,
                total: BambuState.calcularTotalPedido(p.id),
                items: BambuState.contarItemsPedido(p.id),
                peso: BambuState.calcularPesoPedido(p.id)
            };
        });

    console.log('✅ Ventas V2 - Aplicación inicializada con BambuState');
    console.log('📦 Total pedidos:', appState.pedidos.length);
    console.log('📄 Total borradores:', appState.borradores.length);
    console.log('📅 Fecha sistema:', BambuState.FECHA_SISTEMA);
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

/**
 * Elimina múltiples pedidos seleccionados
 * PRD: Extensión de funcionalidad bulk
 */
function eliminarSeleccionados() {
    const checkboxes = Array.from(document.querySelectorAll('.table-ventas tbody input[type="checkbox"]'));
    const checkboxesSeleccionados = checkboxes.filter(cb => cb.checked);

    if (checkboxesSeleccionados.length === 0) {
        alert('No hay pedidos seleccionados');
        return;
    }

    // Obtener pedidos seleccionados
    const pedidosSeleccionados = [];
    checkboxesSeleccionados.forEach(cb => {
        const row = cb.closest('tr');
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);
        const pedidoPagina = obtenerPedidosPaginaActual();
        const pedido = pedidoPagina[rowIndex];
        if (pedido) {
            pedidosSeleccionados.push(pedido);
        }
    });

    if (pedidosSeleccionados.length === 0) {
        alert('No se encontraron pedidos para eliminar');
        return;
    }

    // Contar entregados para advertir sobre reintegro
    const entregados = pedidosSeleccionados.filter(p => p.estado === 'entregado').length;
    let mensaje = `⚠️ ¿ELIMINAR ${pedidosSeleccionados.length} PEDIDO${pedidosSeleccionados.length > 1 ? 'S' : ''}?\n\n`;

    if (entregados > 0) {
        mensaje += `📦 ${entregados} pedido${entregados > 1 ? 's' : ''} entregado${entregados > 1 ? 's' : ''}: se reintegrará stock y generará nota de crédito.\n\n`;
    }

    mensaje += `Esta acción NO se puede deshacer.`;

    if (!confirm(mensaje)) {
        return;
    }

    // Eliminar cada pedido
    let eliminados = 0;
    pedidosSeleccionados.forEach(pedido => {
        // Si está entregado, reintegrar stock (mock)
        if (pedido.estado === 'entregado') {
            console.log(`📦 Reintegrando stock para pedido ${pedido.numero}`);

            // Generar nota de crédito
            if (pedido.cliente_id && pedido.total > 0) {
                BambuState.registrarPagoCC({
                    cliente_id: pedido.cliente_id,
                    pedido_id: pedido.id,
                    monto: pedido.total,
                    tipo: 'nota_credito',
                    descripcion: `Anulación pedido ${pedido.numero}`,
                    fecha: BambuState.FECHA_SISTEMA
                });
            }
        }

        // Eliminar del estado
        appState.pedidos = appState.pedidos.filter(p => p.id !== pedido.id);
        BambuState.delete('pedidos', pedido.id);
        eliminados++;
    });

    console.log(`🗑️ ${eliminados} pedidos eliminados en bulk`);

    // Re-renderizar
    render();
    cancelarSeleccion();

    mostrarNotificacion(`🗑️ ${eliminados} pedido${eliminados > 1 ? 's eliminados' : ' eliminado'}`);
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

/**
 * Obtiene los productos de un pedido desde BambuState
 * @param {number} pedidoId
 * @returns {Array} Productos con formato para edición
 */
function getProductosPedido(pedidoId) {
    const items = BambuState.getItemsPedido(pedidoId);
    return items.map(item => {
        const producto = BambuState.getById('productos', item.producto_id);
        return {
            id: item.id,
            producto_id: item.producto_id,
            nombre: producto?.nombre || 'Producto desconocido',
            precio: item.precio_unitario,
            cantidad: item.cantidad,
            peso: producto?.peso_kg || 0
        };
    });
}

let pedidoEditandoId = null;
let productosEditando = [];
let productosOriginales = []; // PRD 7.2: Guardar originales para comparar delta de stock
let totalAnterior = 0;
let estadoPedidoEditando = null; // PRD 7.2: Guardar estado para control de stock

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
    estadoPedidoEditando = pedido.estado; // PRD 7.2: Guardar estado

    // Cargar productos desde BambuState (crear copia para no mutar original)
    productosEditando = JSON.parse(JSON.stringify(getProductosPedido(pedidoId)));

    // PRD 7.2: Guardar copia de originales para calcular delta de stock
    productosOriginales = JSON.parse(JSON.stringify(productosEditando));

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
    productosOriginales = []; // PRD 7.2: Limpiar originales
    totalAnterior = 0;
    estadoPedidoEditando = null; // PRD 7.2: Limpiar estado
}

// ========================================
// MODAL: AGREGAR PRODUCTO A PEDIDO
// PRD: prd/ventas.html - Sección 5.2
// ========================================

/**
 * Abre modal para agregar producto al pedido en edición
 *
 * LÓGICA:
 * - Lista todos los productos disponibles con stock
 * - Permite buscar por nombre
 * - Click en producto lo agrega con cantidad 1
 */
function abrirModalAgregarProducto() {
    if (!pedidoEditandoId) {
        console.error('No hay pedido en edición');
        return;
    }

    // Limpiar búsqueda
    document.getElementById('buscar-producto-input').value = '';

    // Renderizar lista de productos
    renderizarProductosDisponibles();

    // Mostrar modal
    document.getElementById('modal-agregar-producto').classList.remove('hidden');
}

function cerrarModalAgregarProducto() {
    document.getElementById('modal-agregar-producto').classList.add('hidden');
}

/**
 * Renderiza la lista de productos disponibles para agregar
 */
function renderizarProductosDisponibles(filtro = '') {
    const container = document.getElementById('productos-lista-modal');
    const productos = BambuState.getProductos();

    // Filtrar productos
    let productosFiltrados = productos.filter(p => p.disponible);

    if (filtro) {
        const filtroLower = filtro.toLowerCase();
        productosFiltrados = productosFiltrados.filter(p =>
            p.nombre.toLowerCase().includes(filtroLower)
        );
    }

    // Excluir productos ya en el pedido
    const idsEnPedido = productosEditando.map(p => p.id);
    productosFiltrados = productosFiltrados.filter(p => !idsEnPedido.includes(p.id));

    if (productosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="productos-lista-empty">
                <i class="fas fa-search" style="font-size: 24px; margin-bottom: 8px; opacity: 0.3;"></i>
                <div>${filtro ? 'No se encontraron productos' : 'Todos los productos ya están en el pedido'}</div>
            </div>
        `;
        return;
    }

    container.innerHTML = productosFiltrados.map(p => {
        const sinStock = p.stock_actual <= 0;
        return `
            <div class="producto-item ${sinStock ? 'no-stock' : ''}"
                 onclick="${sinStock ? '' : `agregarProductoAlPedido(${p.id})`}">
                <div class="producto-item-info">
                    <div class="producto-item-nombre">${p.nombre}</div>
                    <div class="producto-item-meta">
                        ${p.peso_kg}kg · Stock: ${p.stock_actual}
                        ${sinStock ? '<span style="color: var(--color-error);"> (Sin stock)</span>' : ''}
                    </div>
                </div>
                <div class="producto-item-precio">
                    ${formatearMonto(p.precio_l1)}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Filtra productos en el modal según búsqueda
 */
function filtrarProductosModal() {
    const filtro = document.getElementById('buscar-producto-input').value;
    renderizarProductosDisponibles(filtro);
}

/**
 * Agrega un producto al pedido en edición
 *
 * PRD 7.2: Si pedido ENTREGADO, validar stock disponible
 *
 * @param {number} productoId - ID del producto a agregar
 */
function agregarProductoAlPedido(productoId) {
    const producto = BambuState.getProductos().find(p => p.id === productoId);
    if (!producto) return;

    // Verificar si ya está en el pedido
    const existente = productosEditando.find(p => p.producto_id === productoId);
    if (existente) {
        mostrarNotificacion('⚠️ Este producto ya está en el pedido', 'warning');
        return;
    }

    // PRD 7.2: Si pedido entregado, validar stock disponible
    if (estadoPedidoEditando === 'entregado') {
        // Calcular cuánto ya se usó del original
        const originalProd = productosOriginales.find(p => p.producto_id === productoId);
        const cantidadOriginal = originalProd ? originalProd.cantidad : 0;

        // Si es producto nuevo (no estaba en original), necesita stock
        if (cantidadOriginal === 0) {
            const verificacion = BambuState.verificarStock(productoId, 1);
            if (!verificacion.disponible) {
                mostrarNotificacion(`⚠️ Sin stock disponible para ${producto.nombre}`, 'warning');
                return;
            }
        }
    }

    // Agregar con cantidad 1
    productosEditando.push({
        id: producto.id,
        producto_id: producto.id, // Asegurar consistencia
        nombre: producto.nombre,
        precio: producto.precio_l1, // TODO: usar lista de precio del cliente
        cantidad: 1,
        peso: producto.peso_kg
    });

    // Cerrar modal
    cerrarModalAgregarProducto();

    // Re-renderizar productos en edición
    renderizarProductosEdit();
    actualizarTotalesEdit();

    mostrarNotificacion(`✅ ${producto.nombre} agregado al pedido`);
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

/**
 * Actualiza cantidad de producto en edición
 *
 * PRD 7.2: Si pedido ENTREGADO y se aumenta cantidad,
 * validar stock disponible antes de permitir
 */
function actualizarCantidad(productoId, nuevaCantidad) {
    const producto = productosEditando.find(p => p.id === productoId || p.producto_id === productoId);
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

    // PRD 7.2: Si pedido entregado y se aumenta cantidad, validar stock
    if (estadoPedidoEditando === 'entregado' && cantidad > producto.cantidad) {
        const prodId = producto.producto_id || producto.id;

        // Calcular cuánto stock adicional se necesita
        const originalProd = productosOriginales.find(p => p.producto_id === prodId);
        const cantidadOriginal = originalProd ? originalProd.cantidad : 0;
        const incrementoNeto = cantidad - cantidadOriginal;

        if (incrementoNeto > 0) {
            const verificacion = BambuState.verificarStock(prodId, incrementoNeto);
            if (!verificacion.disponible) {
                mostrarNotificacion(`⚠️ Stock insuficiente. Disponible: ${verificacion.stockActual}`, 'warning');
                renderizarProductosEdit(); // Restaurar valor anterior
                return;
            }
        }
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

// ============================================================================
// REGLA DE NEGOCIO: Control de Stock en Edición
// PRD: prd/ventas.html - Sección 7.2
// ============================================================================

/**
 * Guarda los cambios de edición de un pedido
 *
 * LÓGICA DE NEGOCIO (PRD 7.2):
 * - Si pedido está ENTREGADO, ajustar stock automáticamente
 * - Calcular delta por producto (original - nuevo)
 * - Si se agregan productos → validar stock disponible, luego descontar
 * - Si se quitan productos → reintegrar stock
 * - Mostrar advertencia si stock insuficiente
 * - Registrar movimientos en historial de stock
 *
 * VALIDACIONES:
 * - No permite guardar pedido sin productos
 * - Valida stock disponible antes de permitir agregar
 */
function guardarEdicion() {
    if (productosEditando.length === 0) {
        alert('⚠️ No se puede guardar un pedido sin productos');
        return;
    }

    const pedido = appState.pedidos.find(p => p.id === pedidoEditandoId);
    if (!pedido) return;

    // ========================================================================
    // PRD 7.2: Control de Stock para pedidos ENTREGADOS
    // ========================================================================

    if (estadoPedidoEditando === 'entregado') {
        // Preparar items para comparación
        const itemsOriginales = productosOriginales.map(p => ({
            producto_id: p.producto_id,
            cantidad: p.cantidad
        }));

        const itemsNuevos = productosEditando.map(p => ({
            producto_id: p.producto_id,
            cantidad: p.cantidad
        }));

        // Validar y ajustar stock
        const resultado = BambuState.ajustarStockPorEdicion(itemsOriginales, itemsNuevos, pedidoEditandoId);

        if (!resultado.exito) {
            // Mostrar errores de stock insuficiente
            const mensajesError = resultado.errores.map(e =>
                `• ${e.nombre}: necesita ${e.requerido}, disponible ${e.disponible} (faltan ${e.faltante})`
            ).join('\n');

            alert(`⚠️ Stock insuficiente para guardar cambios:\n\n${mensajesError}\n\nAjuste las cantidades o elija otros productos.`);
            return;
        }

        // Log de ajustes realizados
        if (resultado.ajustes.length > 0) {
            console.log('[Ventas] PRD 7.2 - Ajustes de stock aplicados:', resultado.ajustes);
        }
    }

    // ========================================================================
    // Actualizar pedido
    // ========================================================================

    // Calcular nuevo total
    const subtotal = productosEditando.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    const totalNuevo = subtotal;
    const diferencia = totalNuevo - totalAnterior;

    // Calcular nuevo peso
    const pesoNuevo = productosEditando.reduce((sum, p) => sum + (p.peso * p.cantidad), 0);
    const itemsNuevos = productosEditando.length;

    // Actualizar pedido en appState
    pedido.total = totalNuevo;
    pedido.peso = pesoNuevo;
    pedido.items = itemsNuevos;

    // Persistir items en BambuState
    const pedidoBambu = BambuState.getById('pedidos', pedidoEditandoId);
    if (pedidoBambu) {
        // Eliminar items anteriores
        const itemsAnteriores = BambuState.getItemsPedido(pedidoEditandoId);
        itemsAnteriores.forEach(item => {
            BambuState.delete('pedido_items', item.id);
        });

        // Agregar nuevos items
        productosEditando.forEach(prod => {
            BambuState.agregarItemPedido(pedidoEditandoId, {
                producto_id: prod.producto_id,
                cantidad: prod.cantidad,
                precio_unitario: prod.precio
            });
        });

        BambuState.save();
        console.log('[Ventas] Items persistidos en BambuState');
    }

    // ========================================================================
    // PRD 7.2 + 10.1: Edición Post-Entrega con Auditoría
    // ========================================================================

    if (estadoPedidoEditando === 'entregado' && diferencia !== 0) {
        // PRD 7.2: Generar AJUSTE en Cuenta Corriente
        const ajusteCC = BambuState.registrarAjusteCC({
            cliente_id: pedido.cliente_id,
            pedido_id: pedidoEditandoId,
            monto_anterior: totalAnterior,
            monto_nuevo: totalNuevo,
            razon: 'Edición post-entrega'
        });

        if (ajusteCC) {
            console.log('[Ventas] PRD 7.2 - Ajuste CC generado:', ajusteCC);
        }

        // PRD 10.1: Registrar en historial de cambios
        BambuState.registrarCambioPedido(pedidoEditandoId, {
            accion: 'EDICION',
            campo_modificado: 'total',
            valor_anterior: totalAnterior,
            valor_nuevo: totalNuevo,
            razon: `Ajuste post-entrega (${diferencia > 0 ? '+' : ''}$${diferencia.toLocaleString('es-AR')})`
        });

        // Sincronizar historial con appState para que se muestre en modal detalle
        const pedidoActualizado = BambuState.getById('pedidos', pedidoEditandoId);
        if (pedidoActualizado && pedidoActualizado.historial_cambios) {
            pedido.historial_cambios = pedidoActualizado.historial_cambios;
        }
    }

    console.log('Pedido editado:', {
        id: pedidoEditandoId,
        totalAnterior,
        totalNuevo,
        diferencia,
        estadoPedido: estadoPedidoEditando,
        stockAjustado: estadoPedidoEditando === 'entregado',
        ajusteCC: diferencia !== 0 && estadoPedidoEditando === 'entregado',
        productos: productosEditando
    });

    // Re-renderizar tabla
    render();
    cerrarModalEditar();

    // Notificación
    const msgDiferencia = diferencia !== 0
        ? ` (${diferencia > 0 ? '+' : ''}${formatearMonto(Math.abs(diferencia))})`
        : '';
    const msgStock = estadoPedidoEditando === 'entregado' ? ' · Stock ajustado' : '';
    const msgCC = (diferencia !== 0 && estadoPedidoEditando === 'entregado') ? ' · CC ajustada' : '';
    mostrarNotificacion(`✅ Pedido ${pedido.numero} actualizado${msgDiferencia}${msgStock}${msgCC}`);
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

    // Badge tipo
    const tipoBadge = document.getElementById('detalle-tipo-badge');
    tipoBadge.textContent = pedido.tipo === 'fabrica' ? 'FÁBRICA' : 'REPARTO';
    tipoBadge.className = `badge-tipo ${pedido.tipo}`;

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

    // Estado de pago (PRD 6.2, 6.3 - Pagos parciales)
    const montoPagado = pedido.monto_pagado || (pedido.montoEfectivo || 0) + (pedido.montoDigital || 0);
    const totalPedido = BambuState.calcularTotalPedido ? BambuState.calcularTotalPedido(pedido.id) : pedido.total;
    const pendiente = totalPedido - montoPagado;
    document.getElementById('detalle-pagado').textContent = formatearMonto(montoPagado);
    document.getElementById('detalle-pendiente').textContent = formatearMonto(Math.max(0, pendiente));

    // Colorear pendiente según estado
    const pendienteEl = document.getElementById('detalle-pendiente');
    if (pendiente > 0) {
        pendienteEl.style.color = 'var(--color-danger)';
    } else {
        pendienteEl.style.color = 'var(--color-success)';
    }

    // Lista de pagos registrados (PRD 6.2, 6.3)
    renderizarListaPagos(pedido);

    // Botón registrar pago si hay saldo pendiente y pedido está entregado
    const btnRegistrarPago = document.getElementById('btn-registrar-pago');
    if (pendiente > 0 && pedido.estado === 'entregado') {
        btnRegistrarPago.style.display = 'flex';
    } else {
        btnRegistrarPago.style.display = 'none';
    }

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

    // PRD 10.1 - Historial de cambios (auditoría)
    renderizarHistorialCambios(pedidoId);

    // Mostrar modal
    document.getElementById('modal-ver-detalle').classList.remove('hidden');
}

// ========================================
// CAMBIAR TIPO PEDIDO (REPARTO ↔ FÁBRICA)
// PRD: prd/ventas.html - Sección 5.4
// ========================================

/**
 * Cambia el tipo de un pedido entre REPARTO y FÁBRICA
 *
 * LÓGICA DE NEGOCIO:
 * - REPARTO → FÁBRICA: Se desasigna vehículo
 * - FÁBRICA → REPARTO: Requiere asignar vehículo después
 * - Solo pedidos en estado 'transito' pueden cambiar tipo
 */
function cambiarTipoPedido() {
    if (!pedidoViendoId) {
        console.error('No hay pedido seleccionado');
        return;
    }

    const pedido = appState.pedidos.find(p => p.id === pedidoViendoId);
    if (!pedido) {
        console.error('Pedido no encontrado');
        return;
    }

    // Validar que esté en tránsito
    if (pedido.estado === 'entregado') {
        mostrarNotificacion('⚠️ No se puede cambiar el tipo de un pedido entregado', 'warning');
        return;
    }

    const tipoActual = pedido.tipo === 'fabrica' ? 'FÁBRICA' : 'REPARTO';
    const tipoNuevo = pedido.tipo === 'fabrica' ? 'REPARTO' : 'FÁBRICA';
    const tipoNuevoVal = pedido.tipo === 'fabrica' ? 'reparto' : 'fabrica';

    // Mensaje de confirmación según el cambio
    let mensaje = `¿Cambiar pedido ${pedido.numero} de ${tipoActual} a ${tipoNuevo}?`;
    if (pedido.tipo === 'reparto') {
        mensaje += '\n\nAl cambiar a FÁBRICA se desasignará el vehículo.';
    } else {
        mensaje += '\n\nAl cambiar a REPARTO deberás asignar un vehículo.';
    }

    if (!confirm(mensaje)) return;

    // Guardar tipo anterior
    const tipoAnterior = pedido.tipo;

    // Cambiar tipo
    pedido.tipo = tipoNuevoVal;

    // Si cambia a FÁBRICA, desasignar vehículo
    if (tipoNuevoVal === 'fabrica') {
        pedido.vehiculo = null;
        pedido.vehiculo_id = null;
    }

    // Actualizar en BambuState
    BambuState.update('pedidos', pedido.id, {
        tipo: pedido.tipo,
        vehiculo: pedido.vehiculo,
        vehiculo_id: pedido.vehiculo_id
    });

    console.log(`🔄 Pedido ${pedido.numero} cambiado de ${tipoAnterior} a ${pedido.tipo}`);

    // Actualizar badge en modal
    const tipoBadge = document.getElementById('detalle-tipo-badge');
    tipoBadge.textContent = pedido.tipo === 'fabrica' ? 'FÁBRICA' : 'REPARTO';
    tipoBadge.className = `badge-tipo ${pedido.tipo}`;

    // Re-renderizar lista
    render();

    // Notificación
    mostrarNotificacion(`✅ Pedido ${pedido.numero} cambiado a ${tipoNuevo}`);
}

function renderizarProductosDetalle(pedidoId) {
    const tbody = document.getElementById('detalle-productos-tbody');
    const productos = getProductosPedido(pedidoId);

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

// ============================================================================
// HISTORIAL DE CAMBIOS - Sistema de Auditoría
// PRD: prd/ventas.html - Sección 10.1
// ============================================================================

/**
 * Renderiza el timeline de historial de cambios del pedido
 *
 * LÓGICA DE NEGOCIO:
 * - Muestra cambios en orden cronológico (más reciente primero)
 * - Tipos de acción: CREACION, EDICION, ESTADO
 * - Cada cambio muestra: fecha, usuario, campo modificado, valor anterior → nuevo, razón
 *
 * VALIDACIONES:
 * - Si no hay historial, oculta la sección
 * - Formatea valores según el tipo de campo (montos, porcentajes, estados)
 */
function renderizarHistorialCambios(pedidoId) {
    const pedido = appState.pedidos.find(p => p.id === pedidoId);
    const section = document.getElementById('detalle-historial-section');
    const timeline = document.getElementById('detalle-historial-timeline');

    if (!pedido || !pedido.historial_cambios || pedido.historial_cambios.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    // Ordenar por fecha descendente (más reciente primero)
    const cambiosOrdenados = [...pedido.historial_cambios].sort((a, b) =>
        new Date(b.fecha) - new Date(a.fecha)
    );

    timeline.innerHTML = cambiosOrdenados.map(cambio => {
        const fechaObj = new Date(cambio.fecha);
        const fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const horaFormateada = fechaObj.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Icono según tipo de acción
        const iconos = {
            'CREACION': 'fa-plus-circle',
            'EDICION': 'fa-edit',
            'ESTADO': 'fa-exchange-alt'
        };
        const icono = iconos[cambio.accion] || 'fa-circle';

        // Formatear valores según el campo
        const formatearValor = (campo, valor) => {
            if (valor === null || valor === undefined) return '-';
            if (campo === 'total' || campo === 'subtotal' || campo === 'descuento_monto') {
                return formatearMonto(valor);
            }
            if (campo === 'descuento_porcentaje') {
                return valor + '%';
            }
            if (campo === 'estado') {
                const estados = {
                    'borrador': 'Borrador',
                    'pendiente': 'Pendiente',
                    'asignado': 'Asignado',
                    'en transito': 'En Tránsito',
                    'entregado': 'Entregado'
                };
                return estados[valor] || valor;
            }
            return valor;
        };

        // HTML del cambio de valor (si aplica)
        let cambioHtml = '';
        if (cambio.campo_modificado && cambio.accion !== 'CREACION') {
            const campoLabel = {
                'total': 'Total',
                'subtotal': 'Subtotal',
                'descuento_porcentaje': 'Descuento %',
                'descuento_monto': 'Descuento $',
                'vehiculo': 'Vehículo',
                'estado': 'Estado',
                'fecha': 'Fecha entrega'
            }[cambio.campo_modificado] || cambio.campo_modificado;

            cambioHtml = `
                <div class="historial-cambio">
                    <span class="campo">${campoLabel}:</span>
                    <span class="valor-anterior">${formatearValor(cambio.campo_modificado, cambio.valor_anterior)}</span>
                    <span class="flecha"><i class="fas fa-arrow-right"></i></span>
                    <span class="valor-nuevo">${formatearValor(cambio.campo_modificado, cambio.valor_nuevo)}</span>
                </div>
            `;
        }

        // HTML de la razón (si existe)
        const razonHtml = cambio.razon ? `<div class="historial-razon">"${cambio.razon}"</div>` : '';

        return `
            <div class="historial-item accion-${cambio.accion}">
                <div class="historial-header">
                    <span class="historial-accion accion-${cambio.accion}">
                        <i class="fas ${icono}"></i> ${cambio.accion}
                    </span>
                    <span class="historial-fecha">${fechaFormateada} ${horaFormateada}</span>
                </div>
                ${cambioHtml}
                ${razonHtml}
                <div class="historial-meta">
                    <span><i class="fas fa-user"></i> ${cambio.usuario_nombre}</span>
                    <span><i class="fas fa-globe"></i> ${cambio.ip || '-'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function cerrarModalDetalle() {
    document.getElementById('modal-ver-detalle').classList.add('hidden');
    pedidoViendoId = null;
}

// ============================================================================
// PAGOS PARCIALES - Sistema de Pagos (PRD 6.2, 6.3)
// ============================================================================

/**
 * Renderiza la lista de pagos registrados en el modal de detalle
 *
 * LÓGICA DE NEGOCIO:
 * - Muestra todos los pagos asociados al pedido
 * - Cada pago tiene: fecha, monto, método, quién lo registró
 * - Si no hay pagos, muestra mensaje
 */
function renderizarListaPagos(pedido) {
    const container = document.getElementById('detalle-pagos-lista');

    if (!pedido.pagos || pedido.pagos.length === 0) {
        container.innerHTML = '';
        return;
    }

    const iconoMetodo = (metodo) => {
        if (metodo === 'efectivo') return '<i class="fas fa-money-bill-wave"></i> Efectivo';
        if (metodo === 'digital') return '<i class="fas fa-credit-card"></i> Digital';
        return '<i class="fas fa-wallet"></i> ' + metodo;
    };

    const formatFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        }) + ' ' + fecha.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    container.innerHTML = `
        <div class="pagos-lista-titulo">Pagos registrados (${pedido.pagos.length})</div>
        ${pedido.pagos.map(pago => `
            <div class="pago-item-registro">
                <div class="pago-info">
                    <span class="pago-fecha">${formatFecha(pago.fecha)}</span>
                    <span class="pago-metodo">${iconoMetodo(pago.metodo)}</span>
                </div>
                <span class="pago-monto">+${formatearMonto(pago.monto)}</span>
            </div>
        `).join('')}
    `;
}

/**
 * Abre el modal para registrar un pago adicional
 * PRD 6.2 - Pagos parciales: permite múltiples pagos
 */
function abrirModalRegistrarPago() {
    if (!pedidoViendoId) return;

    const pedido = appState.pedidos.find(p => p.id === pedidoViendoId);
    if (!pedido) return;

    const totalPedido = BambuState.calcularTotalPedido ? BambuState.calcularTotalPedido(pedido.id) : pedido.total;
    const montoPagado = pedido.monto_pagado || 0;
    const saldoPendiente = totalPedido - montoPagado;

    document.getElementById('pago-pedido-num').textContent = pedido.numero;
    document.getElementById('pago-total-pedido').textContent = formatearMonto(totalPedido);
    document.getElementById('pago-ya-pagado').textContent = formatearMonto(montoPagado);
    document.getElementById('pago-saldo-pendiente').textContent = formatearMonto(saldoPendiente);

    // Reset form
    document.getElementById('pago-monto').value = '';
    document.getElementById('pago-validacion').className = 'pago-validacion';
    document.getElementById('pago-validacion').textContent = '';
    document.getElementById('btn-confirmar-pago').disabled = true;

    // Reset método de pago
    document.querySelector('input[name="pagoParcialMetodo"][value="efectivo"]').checked = true;

    document.getElementById('modal-registrar-pago').classList.remove('hidden');
}

function cerrarModalRegistrarPago() {
    document.getElementById('modal-registrar-pago').classList.add('hidden');
}

/**
 * Pone el total pendiente en el campo de monto
 */
function setMontoPagoTotal() {
    if (!pedidoViendoId) return;

    const pedido = appState.pedidos.find(p => p.id === pedidoViendoId);
    if (!pedido) return;

    const totalPedido = BambuState.calcularTotalPedido ? BambuState.calcularTotalPedido(pedido.id) : pedido.total;
    const montoPagado = pedido.monto_pagado || 0;
    const saldoPendiente = totalPedido - montoPagado;

    document.getElementById('pago-monto').value = saldoPendiente;
    validarMontoPago();
}

/**
 * Valida el monto ingresado para el pago
 */
function validarMontoPago() {
    const montoInput = document.getElementById('pago-monto');
    const validacion = document.getElementById('pago-validacion');
    const btnConfirmar = document.getElementById('btn-confirmar-pago');
    const monto = parseFloat(montoInput.value) || 0;

    if (!pedidoViendoId) return;

    const pedido = appState.pedidos.find(p => p.id === pedidoViendoId);
    if (!pedido) return;

    const totalPedido = BambuState.calcularTotalPedido ? BambuState.calcularTotalPedido(pedido.id) : pedido.total;
    const montoPagado = pedido.monto_pagado || 0;
    const saldoPendiente = totalPedido - montoPagado;

    if (monto <= 0) {
        validacion.className = 'pago-validacion error';
        validacion.textContent = 'Ingrese un monto mayor a $0';
        btnConfirmar.disabled = true;
        return;
    }

    if (monto > saldoPendiente) {
        validacion.className = 'pago-validacion error';
        validacion.textContent = `El monto supera el saldo pendiente (${formatearMonto(saldoPendiente)})`;
        btnConfirmar.disabled = true;
        return;
    }

    // Monto válido
    validacion.className = 'pago-validacion success';
    if (monto === saldoPendiente) {
        validacion.textContent = 'Pago completo - Saldará la deuda';
    } else {
        const nuevoSaldo = saldoPendiente - monto;
        validacion.textContent = `Pago parcial - Quedará pendiente ${formatearMonto(nuevoSaldo)}`;
    }
    btnConfirmar.disabled = false;
}

/**
 * Confirma y registra el pago adicional
 * PRD 6.3 - Pagos asociados actualizan campo monto_pagado
 */
function confirmarPagoAdicional() {
    if (!pedidoViendoId) return;

    const pedido = appState.pedidos.find(p => p.id === pedidoViendoId);
    if (!pedido) return;

    const monto = parseFloat(document.getElementById('pago-monto').value) || 0;
    const metodo = document.querySelector('input[name="pagoParcialMetodo"]:checked').value;

    if (monto <= 0) return;

    // Crear registro de pago
    const nuevoPago = {
        id: (pedido.pagos?.length || 0) + 1,
        fecha: new Date().toISOString(),
        monto: monto,
        metodo: metodo,
        tipo: 'asociado',
        registrado_por: 'admin@bambu.com'
    };

    // Inicializar pagos si no existe
    if (!pedido.pagos) {
        pedido.pagos = [];
    }
    pedido.pagos.push(nuevoPago);

    // Actualizar monto_pagado
    pedido.monto_pagado = (pedido.monto_pagado || 0) + monto;

    // Actualizar montoEfectivo/montoDigital según método
    if (metodo === 'efectivo') {
        pedido.montoEfectivo = (pedido.montoEfectivo || 0) + monto;
    } else {
        pedido.montoDigital = (pedido.montoDigital || 0) + monto;
    }

    // Actualizar metodoPago del pedido
    if (pedido.montoEfectivo > 0 && pedido.montoDigital > 0) {
        pedido.metodoPago = 'mixto';
    } else if (pedido.montoEfectivo > 0) {
        pedido.metodoPago = 'efectivo';
    } else {
        pedido.metodoPago = 'digital';
    }

    // Guardar en BambuState si existe
    if (typeof BambuState !== 'undefined' && BambuState.update) {
        BambuState.update('pedidos', pedido.id, pedido);
    }

    // Registrar movimiento en cuenta corriente (si no es cliente sin registro)
    if (pedido.cliente_id !== 0 && typeof BambuState !== 'undefined' && BambuState.agregarMovimientoCC) {
        BambuState.agregarMovimientoCC({
            cliente_id: pedido.cliente_id,
            pedido_id: pedido.id,
            tipo: 'PAGO',
            monto: monto,
            metodo: metodo,
            descripcion: `Pago asociado a pedido ${pedido.numero}`
        });
    }

    // Cerrar modal de pago
    cerrarModalRegistrarPago();

    // Actualizar modal de detalle
    abrirModalDetalle(pedidoViendoId);

    // Mostrar notificación
    mostrarNotificacion(`Pago de ${formatearMonto(monto)} registrado correctamente`, 'success');

    // Re-renderizar tabla si está visible
    render();
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
