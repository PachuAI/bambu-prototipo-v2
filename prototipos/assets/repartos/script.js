/* ========================================
   BAMBU CRM V2 - REPARTOS DÍA - JAVASCRIPT
   Usa BambuState como fuente de datos
   PRD: prd/ventas.html (sección Repartos)
   ======================================== */

// ===========================
// DATOS DINÁMICOS DESDE BAMBUSTATE
// ===========================

// Estado local (se carga desde BambuState en init)
const appData = {
    fecha: null,
    vehiculos: [],
    pedidosSinAsignar: []
};

/**
 * Carga datos del día desde BambuState
 * @param {string} fecha - Formato 'YYYY-MM-DD'
 */
function cargarDatosDia(fecha) {
    appData.fecha = fecha;

    // Obtener vehículos desde BambuState
    const vehiculosBambu = BambuState.getVehiculos();

    // Obtener pedidos del día (solo reparto, no fábrica)
    const pedidosDia = BambuState.getPedidos({ fecha, tipo: 'reparto' });

    // Construir estructura de vehículos con sus pedidos
    appData.vehiculos = vehiculosBambu.map(v => {
        // Pedidos asignados a este vehículo
        const pedidosVehiculo = pedidosDia
            .filter(p => p.vehiculo_id === v.id && p.estado !== 'pendiente')
            .map(p => adaptarPedido(p));

        // Calcular carga
        const pesoActual = pedidosVehiculo.reduce((sum, p) => sum + p.peso, 0);
        const porcentaje = Math.round((pesoActual / v.capacidadKg) * 100);

        return {
            id: `r${v.id}`,
            vehiculoId: v.id,
            nombre: v.modelo || 'Vehículo',
            patente: v.patente || '',
            badge: v.nombre.toUpperCase(),
            capacidadKg: v.capacidadKg,
            pesoActual,
            porcentaje,
            estadoCapacidad: getEstadoCapacidad(porcentaje),
            pedidos: pedidosVehiculo
        };
    });

    // Pedidos sin asignar (estado 'pendiente' sin vehículo)
    appData.pedidosSinAsignar = pedidosDia
        .filter(p => p.estado === 'pendiente' || !p.vehiculo_id)
        .map(p => adaptarPedido(p));

    console.log(`[Repartos] Cargados ${pedidosDia.length} pedidos para ${fecha}`);
    console.log(`[Repartos] ${appData.pedidosSinAsignar.length} sin asignar`);
}

/**
 * Adapta pedido de BambuState al formato de la UI
 */
function adaptarPedido(p) {
    const cliente = BambuState.getById('clientes', p.cliente_id);
    const peso = BambuState.calcularPesoPedido(p.id);
    const monto = BambuState.calcularTotalPedido(p.id);

    // Formatear fecha para display
    const fechaParts = p.fecha ? p.fecha.split('-') : [];
    const fechaDisplay = fechaParts.length === 3
        ? `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`
        : '';

    return {
        id: p.id,
        numero: p.numero,
        direccion: p.direccion,
        ciudad: p.ciudad,
        telefono: cliente?.telefono || '',
        peso: Math.round(peso * 10) / 10,
        monto: Math.round(monto),
        fechaEntrega: fechaDisplay
    };
}

function getEstadoCapacidad(porcentaje) {
    if (porcentaje >= 85) return 'casi-lleno';
    if (porcentaje >= 70) return 'alta';
    return 'optima';
}

// Variables globales
let pedidoSeleccionadoId = null;
let vehiculoSeleccionadoId = null;

// ===========================
// UTILIDADES URL Y FECHA
// ===========================

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function formatearFechaCompleta(fechaISO) {
    const diasSemanaCorto = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const mesesCorto = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const fecha = new Date(fechaISO + 'T12:00:00');
    const diaSemana = diasSemanaCorto[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = mesesCorto[fecha.getMonth()];
    const anio = fecha.getFullYear();

    return `${diaSemana}, ${dia} ${mes} ${anio}`;
}

// ===========================
// INICIALIZACIÓN
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar BambuState
    BambuState.init();

    // Leer parámetro fecha de URL o usar fecha sistema
    const fechaParam = getUrlParameter('fecha') || BambuState.FECHA_SISTEMA;

    // Cargar datos del día desde BambuState
    cargarDatosDia(fechaParam);

    // Actualizar título del header
    const tituloFecha = formatearFechaCompleta(fechaParam);
    document.getElementById('dia-fecha-titulo').textContent = tituloFecha;

    console.log(`[Repartos] Inicializado para fecha: ${fechaParam}`);

    // Renderizar vista inicial
    renderizarVehiculos();
    renderizarCiudades();
    renderizarPedidosSinAsignar();
    actualizarStats();
});

// ===========================
// SWITCH TABS
// ===========================

function switchTab(tabName) {
    // Actualizar botones (soporta ambas clases por compatibilidad)
    document.querySelectorAll('.tab-btn, .tab-btn-compact').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Actualizar vistas
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.add('hidden');
    });

    document.getElementById('view-' + tabName).classList.remove('hidden');
}

// ===========================
// TOGGLE GRUPO (Expandir/Colapsar tabla)
// ===========================

function toggleGroup(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.fa-chevron-down, .fa-chevron-up');

    content.classList.toggle('open');

    if (content.classList.contains('open')) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// ===========================
// RENDERIZAR VEHÍCULOS
// ===========================

function renderizarVehiculos() {
    const container = document.getElementById('vehiculos-container');
    container.innerHTML = '';

    appData.vehiculos.forEach(vehiculo => {
        const vehiculoHTML = `
            <div class="vehicle-group" data-vehiculo-id="${vehiculo.id}">
                <div class="vehicle-header-compact">
                    <div class="vehicle-info">
                        <i class="fas fa-truck"></i>
                        <span class="vehicle-name">${vehiculo.badge}</span>
                        <span class="badge-modelo">${vehiculo.nombre}</span>
                    </div>

                    <div class="capacity-inline">
                        <div class="capacity-bar-inline">
                            <div class="capacity-bar-fill" style="width: ${vehiculo.porcentaje}%;"></div>
                        </div>
                        <div class="capacity-info">
                            <strong>${vehiculo.pesoActual}kg</strong>
                            <span>/ ${vehiculo.capacidadKg}kg</span>
                        </div>
                        <span class="capacity-pct ${getCapacityClass(vehiculo.porcentaje)}">${vehiculo.porcentaje}%</span>
                    </div>

                    <div class="vehicle-meta">
                        <span class="badge-estado-sm badge-${vehiculo.estadoCapacidad}">${getEstadoLabel(vehiculo.estadoCapacidad)}</span>
                        <span class="vehicle-stats-mini"><strong>${vehiculo.pedidos.length}</strong> ped | <strong>${vehiculo.pesoActual}</strong> kg</span>
                    </div>
                </div>

                ${vehiculo.pedidos.length > 0 ? `
                    <div class="collapsible-header" onclick="toggleGroup(this)">
                        <span><i class="far fa-eye"></i> Ver ${vehiculo.pedidos.length} pedidos</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="collapsible-content">
                        <table class="pedidos-table">
                            <thead>
                                <tr>
                                    <th style="width: 7%;">#</th>
                                    <th style="width: 28%;">Dirección</th>
                                    <th style="width: 14%;">Ciudad</th>
                                    <th style="width: 14%;">Teléfono</th>
                                    <th style="width: 9%; text-align: right;">Peso</th>
                                    <th style="width: 12%; text-align: right;">Monto</th>
                                    <th style="width: 16%; text-align: center;">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${vehiculo.pedidos.map(pedido => `
                                    <tr>
                                        <td><strong>${pedido.numero}</strong></td>
                                        <td>${pedido.direccion}</td>
                                        <td>${pedido.ciudad}</td>
                                        <td>${pedido.telefono}</td>
                                        <td style="text-align: right;"><strong>${pedido.peso}kg</strong></td>
                                        <td style="text-align: right;">$${formatMonto(pedido.monto)}</td>
                                        <td style="text-align: center;">
                                            <button class="btn-cambiar" onclick="cambiarVehiculo(${pedido.id}, '${vehiculo.id}')">
                                                <i class="fas fa-exchange-alt"></i> Cambiar
                                            </button>
                                            <button class="btn-desasignar" onclick="desasignarVehiculo(${pedido.id})" title="Desasignar">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : ''}
            </div>
        `;

        container.innerHTML += vehiculoHTML;
    });

    // Inicializar zonas de drop para drag & drop
    initDragDropZones();
}

// ===========================
// RENDERIZAR PEDIDOS SIN ASIGNAR
// ===========================

function renderizarPedidosSinAsignar() {
    const container = document.getElementById('sin-asignar-container');
    const tbody = document.getElementById('tabla-sin-asignar');

    if (appData.pedidosSinAsignar.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    // Actualizar contadores
    const totalPeso = appData.pedidosSinAsignar.reduce((sum, p) => sum + p.peso, 0);
    document.getElementById('sin-asignar-count').textContent = appData.pedidosSinAsignar.length;
    document.getElementById('sin-asignar-peso').textContent = totalPeso;
    document.getElementById('sin-asignar-count-label').textContent = appData.pedidosSinAsignar.length;

    // Renderizar tabla con filas arrastrables
    tbody.innerHTML = appData.pedidosSinAsignar.map(pedido => `
        <tr class="pedido-draggable"
            draggable="true"
            data-pedido-id="${pedido.id}"
            ondragstart="handleDragStart(event, ${pedido.id})"
            ondragend="handleDragEnd(event)">
            <td><strong>${pedido.numero}</strong></td>
            <td>${pedido.direccion}</td>
            <td>${pedido.ciudad}</td>
            <td>${pedido.telefono}</td>
            <td style="text-align: right;"><strong>${pedido.peso}kg</strong></td>
            <td style="text-align: right;">$${formatMonto(pedido.monto)}</td>
            <td style="text-align: center;">
                <button class="btn-asignar-vehiculo" onclick="abrirModalAsignarVehiculo(${pedido.id})">
                    <i class="fas fa-truck"></i> Asignar
                </button>
                <span class="drag-hint" title="Arrastra a un vehículo"><i class="fas fa-grip-vertical"></i></span>
            </td>
        </tr>
    `).join('');
}

// ===========================
// RENDERIZAR CIUDADES
// ===========================

function renderizarCiudades() {
    const container = document.getElementById('ciudades-container');
    container.innerHTML = '';

    // Reorganizar pedidos por ciudad
    const pedidosPorCiudad = {};

    appData.vehiculos.forEach(vehiculo => {
        vehiculo.pedidos.forEach(pedido => {
            if (!pedidosPorCiudad[pedido.ciudad]) {
                pedidosPorCiudad[pedido.ciudad] = [];
            }
            pedidosPorCiudad[pedido.ciudad].push({
                ...pedido,
                vehiculo: vehiculo.nombre,
                reparto: vehiculo.badge
            });
        });
    });

    // Renderizar cada ciudad
    Object.keys(pedidosPorCiudad).forEach(ciudad => {
        const pedidos = pedidosPorCiudad[ciudad];
        const totalPeso = pedidos.reduce((sum, p) => sum + p.peso, 0);

        const ciudadHTML = `
            <div class="city-group">
                <div class="city-header" onclick="toggleGroup(this)">
                    <div class="city-title">
                        <i class="fas fa-map-marker-alt" style="color: #0f766e;"></i>
                        <span>${ciudad}</span>
                        <span class="city-count">${pedidos.length} pedidos | ${totalPeso}kg</span>
                    </div>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="collapsible-content">
                    <table class="pedidos-table">
                        <thead>
                            <tr>
                                <th style="width: 8%;">#Pedido</th>
                                <th style="width: 25%;">Dirección</th>
                                <th style="width: 13%;">Teléfono</th>
                                <th style="width: 15%;">Vehículo</th>
                                <th style="width: 10%; text-align: right;">Peso</th>
                                <th style="width: 12%; text-align: right;">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pedidos.map(pedido => `
                                <tr>
                                    <td><strong>${pedido.numero}</strong></td>
                                    <td>${pedido.direccion}</td>
                                    <td>${pedido.telefono}</td>
                                    <td><span class="badge-reparto-ciudad">${pedido.reparto}</span></td>
                                    <td style="text-align: right;"><strong>${pedido.peso}kg</strong></td>
                                    <td style="text-align: right;">$${formatMonto(pedido.monto)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML += ciudadHTML;
    });

    // Si no hay pedidos asignados, mostrar mensaje
    if (Object.keys(pedidosPorCiudad).length === 0) {
        container.innerHTML = `
            <div style="padding: 48px; text-align: center; color: var(--text-secondary);">
                <i class="fas fa-map-marker-alt" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i>
                <p style="font-size: 16px; font-weight: 500;">No hay pedidos asignados aún</p>
                <p style="font-size: 14px; margin-top: 8px;">Asigna pedidos a vehículos en la vista "Por Vehículo"</p>
            </div>
        `;
    }
}

// ===========================
// ABRIR MODAL ASIGNAR VEHÍCULO
// ===========================

function abrirModalAsignarVehiculo(pedidoId) {
    pedidoSeleccionadoId = pedidoId;
    vehiculoSeleccionadoId = null;

    // Buscar pedido
    const pedido = appData.pedidosSinAsignar.find(p => p.id === pedidoId);
    if (!pedido) return;

    // Actualizar info del pedido en el modal
    document.getElementById('modal-pedido-numero').textContent = pedido.numero;
    document.getElementById('modal-pedido-cliente').textContent = `${pedido.direccion} - ${pedido.ciudad}`;
    document.getElementById('modal-pedido-fecha').textContent = pedido.fechaEntrega;
    document.getElementById('modal-pedido-peso').textContent = `${pedido.peso}KG`;
    document.getElementById('modal-info-fecha').textContent = pedido.fechaEntrega;

    // Renderizar opciones de vehículos
    renderizarOpcionesVehiculos(pedido);

    // Mostrar modal
    document.getElementById('modal-asignar-vehiculo').classList.remove('hidden');

    // Deshabilitar botón confirmar
    document.getElementById('btn-confirmar-asignacion').disabled = true;
}

// ===========================
// RENDERIZAR OPCIONES DE VEHÍCULOS
// ===========================

function renderizarOpcionesVehiculos(pedido) {
    const container = document.getElementById('modal-vehiculos-list');
    container.innerHTML = '';

    appData.vehiculos.forEach(vehiculo => {
        // Calcular preview capacidad
        const preview = calcularPreviewCapacidad(vehiculo.id, pedido.peso);

        const opcionHTML = `
            <div class="vehiculo-option" data-vehiculo-id="${vehiculo.id}" onclick="seleccionarVehiculo('${vehiculo.id}')">
                <div class="vehiculo-option-header">
                    <i class="fas fa-truck" style="color: var(--text-secondary);"></i>
                    <strong style="flex: 1;">${vehiculo.badge}</strong>
                    <span class="badge-modelo">${vehiculo.nombre}</span>
                </div>
                <div class="vehiculo-capacity-text">
                    Capacidad: ${vehiculo.pesoActual}kg / ${vehiculo.capacidadKg}kg
                </div>
                <div class="capacity-preview ${preview.colorClass}">
                    Con este pedido: ${preview.pesoTotal}kg / ${vehiculo.capacidadKg}kg (${preview.porcentaje}%)
                </div>
                <div class="capacity-bar-mini">
                    <div class="capacity-bar-fill-mini ${preview.colorClass}" style="width: ${preview.porcentaje}%; background: ${preview.color};"></div>
                </div>
            </div>
        `;

        container.innerHTML += opcionHTML;
    });
}

// ===========================
// SELECCIONAR VEHÍCULO
// ===========================

function seleccionarVehiculo(vehiculoId) {
    vehiculoSeleccionadoId = vehiculoId;

    // Remover selección anterior
    document.querySelectorAll('.vehiculo-option').forEach(opcion => {
        opcion.classList.remove('selected');
    });

    // Marcar como seleccionado
    document.querySelector(`.vehiculo-option[data-vehiculo-id="${vehiculoId}"]`).classList.add('selected');

    // Habilitar botón confirmar
    document.getElementById('btn-confirmar-asignacion').disabled = false;
}

// ===========================
// CONFIRMAR ASIGNACIÓN
// ===========================

function confirmarAsignacion() {
    if (!pedidoSeleccionadoId || !vehiculoSeleccionadoId) return;

    // Buscar pedido y vehículo
    const pedidoIndex = appData.pedidosSinAsignar.findIndex(p => p.id === pedidoSeleccionadoId);
    const vehiculo = appData.vehiculos.find(v => v.id === vehiculoSeleccionadoId);

    if (pedidoIndex === -1 || !vehiculo) return;

    // Mover pedido
    const pedido = appData.pedidosSinAsignar.splice(pedidoIndex, 1)[0];
    vehiculo.pedidos.push(pedido);

    // Recalcular capacidad del vehículo
    recalcularCapacidadVehiculo(vehiculoSeleccionadoId);

    // Re-renderizar vistas
    renderizarVehiculos();
    renderizarPedidosSinAsignar();
    renderizarCiudades();
    actualizarStats();

    // Cerrar modal
    cerrarModalAsignar();
}

// ===========================
// CAMBIAR VEHÍCULO (Reasignar)
// ===========================

function cambiarVehiculo(pedidoId, vehiculoActualId) {
    // Buscar pedido en vehículo actual
    const vehiculoActual = appData.vehiculos.find(v => v.id === vehiculoActualId);
    const pedidoIndex = vehiculoActual.pedidos.findIndex(p => p.id === pedidoId);

    if (pedidoIndex === -1) return;

    // Mover pedido de vuelta a sin asignar temporalmente
    const pedido = vehiculoActual.pedidos.splice(pedidoIndex, 1)[0];
    appData.pedidosSinAsignar.push(pedido);

    // Recalcular capacidad del vehículo anterior
    recalcularCapacidadVehiculo(vehiculoActualId);

    // Abrir modal para reasignar
    abrirModalAsignarVehiculo(pedidoId);
}

// ===========================
// DESASIGNAR VEHÍCULO
// ===========================

/**
 * Desasigna un pedido de su vehículo actual
 * PRD: prd/ventas.html - Sección 8 (Repartos)
 *
 * LÓGICA:
 * - Busca el pedido en todos los vehículos asignados
 * - Lo mueve a la lista "Sin Asignar"
 * - Recalcula capacidad del vehículo anterior
 * - Re-renderiza todas las vistas
 */
function desasignarVehiculo(pedidoId) {
    // Buscar pedido en vehículos asignados
    let vehiculoOrigen = null;
    let pedidoIndex = -1;

    for (const vehiculo of appData.vehiculos) {
        pedidoIndex = vehiculo.pedidos.findIndex(p => p.id === pedidoId);
        if (pedidoIndex !== -1) {
            vehiculoOrigen = vehiculo;
            break;
        }
    }

    if (!vehiculoOrigen || pedidoIndex === -1) {
        console.warn(`[Repartos] Pedido ${pedidoId} no encontrado en ningún vehículo`);
        return;
    }

    // Mover pedido a "sin asignar"
    const pedido = vehiculoOrigen.pedidos.splice(pedidoIndex, 1)[0];
    appData.pedidosSinAsignar.push(pedido);

    // Recalcular capacidad del vehículo origen
    recalcularCapacidadVehiculo(vehiculoOrigen.id);

    // Re-renderizar vistas
    renderizarVehiculos();
    renderizarPedidosSinAsignar();
    renderizarCiudades();
    actualizarStats();

    console.log(`[Repartos] Pedido ${pedido.numero} desasignado de ${vehiculoOrigen.badge}`);
}

// ===========================
// CALCULAR PREVIEW CAPACIDAD
// ===========================

function calcularPreviewCapacidad(vehiculoId, pesoPedido) {
    const vehiculo = appData.vehiculos.find(v => v.id === vehiculoId);
    const pesoTotal = vehiculo.pesoActual + pesoPedido;
    const porcentaje = Math.round((pesoTotal / vehiculo.capacidadKg) * 100);

    let colorClass = 'low';
    let color = '#10b981';

    if (porcentaje >= 85) {
        colorClass = 'high';
        color = '#ef4444';
    } else if (porcentaje >= 70) {
        colorClass = 'medium';
        color = '#f59e0b';
    }

    return {
        pesoTotal,
        porcentaje,
        colorClass,
        color
    };
}

// ===========================
// RECALCULAR CAPACIDAD VEHÍCULO
// ===========================

function recalcularCapacidadVehiculo(vehiculoId) {
    const vehiculo = appData.vehiculos.find(v => v.id === vehiculoId);

    // Calcular peso total
    vehiculo.pesoActual = vehiculo.pedidos.reduce((sum, p) => sum + p.peso, 0);
    vehiculo.porcentaje = Math.round((vehiculo.pesoActual / vehiculo.capacidadKg) * 100);

    // Determinar estado capacidad
    if (vehiculo.porcentaje >= 85) {
        vehiculo.estadoCapacidad = "casi-lleno";
    } else if (vehiculo.porcentaje >= 70) {
        vehiculo.estadoCapacidad = "alta";
    } else {
        vehiculo.estadoCapacidad = "optima";
    }
}

// ===========================
// ACTUALIZAR STATS GLOBALES
// ===========================

function actualizarStats() {
    // Calcular totales
    let totalPedidos = appData.pedidosSinAsignar.length;
    let totalKg = appData.pedidosSinAsignar.reduce((sum, p) => sum + p.peso, 0);
    let totalMonto = appData.pedidosSinAsignar.reduce((sum, p) => sum + p.monto, 0);

    appData.vehiculos.forEach(vehiculo => {
        totalPedidos += vehiculo.pedidos.length;
        totalKg += vehiculo.pesoActual;
        totalMonto += vehiculo.pedidos.reduce((sum, p) => sum + p.monto, 0);
    });

    // Formatear monto compacto (ej: $4.1M)
    const montoCompacto = totalMonto >= 1000000
        ? `$${(totalMonto / 1000000).toFixed(1)}M`
        : `$${formatMonto(totalMonto)}`;

    // Actualizar en el DOM (header compacto)
    document.getElementById('stats-mini-pedidos').textContent = `${totalPedidos} pedidos`;
    document.getElementById('stats-mini-monto').textContent = montoCompacto;
    document.getElementById('stats-mini-peso').textContent = `${formatMonto(totalKg)} kg`;
}

// ===========================
// CERRAR MODAL
// ===========================

function cerrarModalAsignar() {
    document.getElementById('modal-asignar-vehiculo').classList.add('hidden');
    pedidoSeleccionadoId = null;
    vehiculoSeleccionadoId = null;
}

// ===========================
// EXPORTAR HOJA REPARTO
// PRD: prd/ventas.html - Sección 8
// ===========================

/**
 * Genera hoja de reparto imprimible/PDF
 *
 * LÓGICA:
 * - Abre ventana nueva con formato imprimible
 * - Muestra cada vehículo con sus pedidos
 * - Incluye estadísticas y fecha
 * - Usuario puede imprimir o guardar como PDF
 */
function exportarHojaReparto() {
    const fecha = formatearFechaCompleta(appData.fecha);

    // Calcular totales
    let totalPedidos = 0;
    let totalKg = 0;
    let totalMonto = 0;

    appData.vehiculos.forEach(v => {
        totalPedidos += v.pedidos.length;
        totalKg += v.pesoActual;
        totalMonto += v.pedidos.reduce((sum, p) => sum + p.monto, 0);
    });

    // Generar HTML de vehículos
    let vehiculosHTML = '';
    appData.vehiculos.forEach(vehiculo => {
        if (vehiculo.pedidos.length === 0) return;

        vehiculosHTML += `
            <div class="vehiculo-section">
                <h3>${vehiculo.badge} - ${vehiculo.nombre}</h3>
                <p class="vehiculo-stats">${vehiculo.pedidos.length} pedidos | ${vehiculo.pesoActual} kg | Capacidad: ${vehiculo.porcentaje}%</p>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Dirección</th>
                            <th>Ciudad</th>
                            <th>Teléfono</th>
                            <th>Peso</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vehiculo.pedidos.map((p, idx) => `
                            <tr>
                                <td>${idx + 1}</td>
                                <td>${p.direccion}</td>
                                <td>${p.ciudad}</td>
                                <td>${p.telefono}</td>
                                <td>${p.peso} kg</td>
                                <td>$${formatMonto(p.monto)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });

    // HTML completo para impresión
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Hoja de Reparto - ${fecha}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { font-size: 18px; margin-bottom: 5px; }
        .header p { color: #666; }
        .stats { display: flex; justify-content: center; gap: 30px; margin: 15px 0; }
        .stat { text-align: center; }
        .stat-value { font-size: 16px; font-weight: bold; }
        .stat-label { font-size: 10px; color: #666; }
        .vehiculo-section { margin-bottom: 25px; page-break-inside: avoid; }
        .vehiculo-section h3 { background: #f0f0f0; padding: 8px; margin-bottom: 5px; }
        .vehiculo-stats { color: #666; margin-bottom: 10px; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background: #f5f5f5; font-weight: 600; }
        tr:nth-child(even) { background: #fafafa; }
        .footer { margin-top: 30px; text-align: center; color: #999; font-size: 10px; }
        @media print {
            body { padding: 10px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>QUÍMICA BAMBU S.R.L. - Hoja de Reparto</h1>
        <p>${fecha}</p>
    </div>

    <div class="stats">
        <div class="stat">
            <div class="stat-value">${totalPedidos}</div>
            <div class="stat-label">Pedidos</div>
        </div>
        <div class="stat">
            <div class="stat-value">${formatMonto(totalKg)} kg</div>
            <div class="stat-label">Peso Total</div>
        </div>
        <div class="stat">
            <div class="stat-value">$${formatMonto(totalMonto)}</div>
            <div class="stat-label">Monto Total</div>
        </div>
    </div>

    ${vehiculosHTML}

    <div class="footer">
        Generado el ${new Date().toLocaleString('es-AR')} - Bambú CRM V2
    </div>

    <script>window.print();</script>
</body>
</html>
    `;

    // Abrir ventana de impresión
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
}

// ===========================
// CAMBIAR DÍA (Navegación)
// ===========================

function cambiarDia(direccion) {
    // Obtener semana actual desde BambuState
    const semana = BambuState.getSemanaActual();
    const fechaActual = appData.fecha;

    // Encontrar índice actual en la semana
    const indexActual = semana.indexOf(fechaActual);

    // Calcular nuevo índice
    let nuevoIndex = indexActual + direccion;

    // Limitar a la semana (lun-vie)
    if (nuevoIndex < 0) {
        console.log('[Repartos] Ya estás en el primer día de la semana');
        return;
    }
    if (nuevoIndex >= semana.length) {
        console.log('[Repartos] Ya estás en el último día de la semana');
        return;
    }

    const nuevaFecha = semana[nuevoIndex];

    // Recargar datos del nuevo día
    cargarDatosDia(nuevaFecha);

    // Actualizar título
    document.getElementById('dia-fecha-titulo').textContent = formatearFechaCompleta(nuevaFecha);

    // Re-renderizar vistas
    renderizarVehiculos();
    renderizarCiudades();
    renderizarPedidosSinAsignar();
    actualizarStats();

    console.log(`[Repartos] Navegando a ${nuevaFecha}`);
}

// ===========================
// UTILIDADES
// ===========================

function formatMonto(monto) {
    return monto.toLocaleString('es-AR');
}

function getEstadoLabel(estado) {
    const labels = {
        'optima': 'ÓPTIMA',
        'alta': 'ALTA',
        'casi-lleno': 'CASI LLENO'
    };
    return labels[estado] || 'ÓPTIMA';
}

function getCapacityClass(porcentaje) {
    if (porcentaje >= 85) return 'high';
    if (porcentaje >= 70) return 'medium';
    return 'low';
}

// ===========================
// DRAG & DROP
// PRD: prd/repartos-dia.html - Sección 10.1
// ===========================

/**
 * Sistema de Drag & Drop para asignar pedidos a vehículos
 *
 * LÓGICA:
 * - Filas de pedidos sin asignar son arrastrables
 * - Cards de vehículos son zonas de drop
 * - Al soltar, asigna pedido al vehículo
 * - Feedback visual durante el arrastre
 */

let draggedPedidoId = null;

/**
 * Inicia el arrastre de un pedido
 */
function handleDragStart(e, pedidoId) {
    draggedPedidoId = pedidoId;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', pedidoId);

    // Resaltar zonas de drop
    document.querySelectorAll('.vehicle-group[data-vehiculo-id]').forEach(zone => {
        zone.classList.add('drop-zone-active');
    });
}

/**
 * Finaliza el arrastre
 */
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedPedidoId = null;

    // Quitar resaltado de zonas
    document.querySelectorAll('.vehicle-group').forEach(zone => {
        zone.classList.remove('drop-zone-active', 'drop-zone-hover');
    });
}

/**
 * Pedido entra en zona de drop
 */
function handleDragEnter(e) {
    e.preventDefault();
    const zone = e.target.closest('.vehicle-group[data-vehiculo-id]');
    if (zone && draggedPedidoId) {
        zone.classList.add('drop-zone-hover');
    }
}

/**
 * Pedido sale de zona de drop
 */
function handleDragLeave(e) {
    const zone = e.target.closest('.vehicle-group[data-vehiculo-id]');
    if (zone) {
        // Solo quitar si realmente salió del contenedor
        const rect = zone.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom) {
            zone.classList.remove('drop-zone-hover');
        }
    }
}

/**
 * Permite el drop
 */
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

/**
 * Procesa el drop - asigna pedido al vehículo
 */
function handleDrop(e) {
    e.preventDefault();

    const zone = e.target.closest('.vehicle-group[data-vehiculo-id]');
    if (!zone || !draggedPedidoId) return;

    const vehiculoId = zone.dataset.vehiculoId;
    const pedidoId = parseInt(draggedPedidoId);

    // Buscar pedido en sin asignar
    const pedidoIndex = appData.pedidosSinAsignar.findIndex(p => p.id === pedidoId);
    if (pedidoIndex === -1) return;

    // Buscar vehículo destino
    const vehiculo = appData.vehiculos.find(v => v.id === vehiculoId);
    if (!vehiculo) return;

    // Mover pedido
    const pedido = appData.pedidosSinAsignar.splice(pedidoIndex, 1)[0];
    vehiculo.pedidos.push(pedido);

    // Recalcular capacidad
    recalcularCapacidadVehiculo(vehiculoId);

    // Re-renderizar
    renderizarVehiculos();
    renderizarPedidosSinAsignar();
    renderizarCiudades();
    actualizarStats();

    // Feedback
    console.log(`[D&D] Pedido ${pedido.numero} asignado a ${vehiculo.badge}`);

    // Limpiar estado
    zone.classList.remove('drop-zone-hover', 'drop-zone-active');
}

/**
 * Inicializa eventos de drag & drop en zonas de vehículos
 */
function initDragDropZones() {
    document.querySelectorAll('.vehicle-group[data-vehiculo-id]').forEach(zone => {
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
    });
}

// ===========================
// OPTIMIZACIÓN AUTOMÁTICA
// PRD: prd/repartos-dia.html - Sección 10.2
// ===========================

/**
 * Sistema de sugerencias de asignación óptima
 *
 * LÓGICA:
 * - Agrupa pedidos sin asignar por ciudad
 * - Busca vehículo con más capacidad disponible
 * - Sugiere asignar grupo completo de ciudad a un vehículo
 * - Considera peso total vs capacidad disponible
 */

let sugerenciasActuales = [];

/**
 * Genera y muestra sugerencias de optimización
 */
function mostrarSugerenciasOptimizacion() {
    if (appData.pedidosSinAsignar.length === 0) {
        alert('No hay pedidos sin asignar');
        return;
    }

    // Agrupar pedidos por ciudad
    const pedidosPorCiudad = {};
    appData.pedidosSinAsignar.forEach(p => {
        if (!pedidosPorCiudad[p.ciudad]) {
            pedidosPorCiudad[p.ciudad] = [];
        }
        pedidosPorCiudad[p.ciudad].push(p);
    });

    // Generar sugerencias
    sugerenciasActuales = [];

    Object.keys(pedidosPorCiudad).forEach(ciudad => {
        const pedidos = pedidosPorCiudad[ciudad];
        const pesoTotal = pedidos.reduce((sum, p) => sum + p.peso, 0);

        // Buscar mejor vehículo (más capacidad disponible)
        const mejorVehiculo = encontrarMejorVehiculo(pesoTotal);

        if (mejorVehiculo) {
            sugerenciasActuales.push({
                ciudad,
                pedidos,
                pesoTotal,
                vehiculo: mejorVehiculo,
                capacidadResultante: Math.round(((mejorVehiculo.pesoActual + pesoTotal) / mejorVehiculo.capacidadKg) * 100)
            });
        }
    });

    // Renderizar sugerencias
    renderizarSugerencias();

    // Mostrar panel
    document.getElementById('sugerencias-panel').style.display = 'block';
}

/**
 * Encuentra el vehículo con más capacidad disponible para un peso dado
 */
function encontrarMejorVehiculo(pesoRequerido) {
    let mejorVehiculo = null;
    let mayorCapacidadDisponible = 0;

    appData.vehiculos.forEach(v => {
        const capacidadDisponible = v.capacidadKg - v.pesoActual;

        // Solo considerar si cabe el peso
        if (capacidadDisponible >= pesoRequerido && capacidadDisponible > mayorCapacidadDisponible) {
            mayorCapacidadDisponible = capacidadDisponible;
            mejorVehiculo = v;
        }
    });

    // Si ninguno tiene capacidad suficiente, sugerir el que más espacio tiene
    if (!mejorVehiculo) {
        appData.vehiculos.forEach(v => {
            const capacidadDisponible = v.capacidadKg - v.pesoActual;
            if (capacidadDisponible > mayorCapacidadDisponible) {
                mayorCapacidadDisponible = capacidadDisponible;
                mejorVehiculo = v;
            }
        });
    }

    return mejorVehiculo;
}

/**
 * Renderiza las sugerencias en el panel
 */
function renderizarSugerencias() {
    const container = document.getElementById('sugerencias-content');

    if (sugerenciasActuales.length === 0) {
        container.innerHTML = '<p style="padding: 16px; color: var(--text-secondary);">No se pueden generar sugerencias</p>';
        return;
    }

    container.innerHTML = sugerenciasActuales.map((s, idx) => `
        <div class="sugerencia-item">
            <div class="sugerencia-ciudad">
                <i class="fas fa-map-marker-alt"></i>
                <strong>${s.ciudad}</strong>
                <span class="sugerencia-stats">${s.pedidos.length} pedidos · ${s.pesoTotal} kg</span>
            </div>
            <div class="sugerencia-vehiculo">
                <i class="fas fa-arrow-right"></i>
                <span class="badge-vehiculo">${s.vehiculo.badge}</span>
                <span class="sugerencia-capacidad ${s.capacidadResultante >= 85 ? 'high' : s.capacidadResultante >= 70 ? 'medium' : 'low'}">
                    → ${s.capacidadResultante}%
                </span>
            </div>
            <button class="btn-aplicar-sugerencia" onclick="aplicarSugerencia(${idx})">
                <i class="fas fa-check"></i>
            </button>
        </div>
    `).join('');
}

/**
 * Aplica una sugerencia individual
 */
function aplicarSugerencia(index) {
    const sugerencia = sugerenciasActuales[index];
    if (!sugerencia) return;

    // Mover todos los pedidos de la ciudad al vehículo
    sugerencia.pedidos.forEach(pedido => {
        const idx = appData.pedidosSinAsignar.findIndex(p => p.id === pedido.id);
        if (idx !== -1) {
            const p = appData.pedidosSinAsignar.splice(idx, 1)[0];
            sugerencia.vehiculo.pedidos.push(p);
        }
    });

    // Recalcular capacidad
    recalcularCapacidadVehiculo(sugerencia.vehiculo.id);

    // Quitar sugerencia aplicada
    sugerenciasActuales.splice(index, 1);

    // Re-renderizar
    renderizarVehiculos();
    renderizarPedidosSinAsignar();
    renderizarCiudades();
    actualizarStats();
    renderizarSugerencias();

    // Si no quedan sugerencias, cerrar panel
    if (sugerenciasActuales.length === 0) {
        cerrarSugerencias();
    }

    console.log(`[Optimización] ${sugerencia.pedidos.length} pedidos de ${sugerencia.ciudad} asignados a ${sugerencia.vehiculo.badge}`);
}

/**
 * Aplica todas las sugerencias
 */
function aplicarTodasSugerencias() {
    // Aplicar en orden inverso para no afectar índices
    while (sugerenciasActuales.length > 0) {
        aplicarSugerencia(0);
    }
}

/**
 * Cierra el panel de sugerencias
 */
function cerrarSugerencias() {
    document.getElementById('sugerencias-panel').style.display = 'none';
    sugerenciasActuales = [];
}
