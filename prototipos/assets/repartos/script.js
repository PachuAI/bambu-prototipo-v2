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

    // Renderizar tabla
    tbody.innerHTML = appData.pedidosSinAsignar.map(pedido => `
        <tr>
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
    document.getElementById('modal-pedido-cliente').textContent = `${pedido.cliente} - ${pedido.direccion}`;
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

function desasignarVehiculo(pedidoId) {
    // TODO: Implementar lógica de desasignación
    // 1. Buscar pedido en vehículo asignado
    // 2. Mover pedido a lista "sin asignar"
    // 3. Mantener fecha del pedido (no cambiar)
    // 4. Recalcular capacidad del vehículo
    // 5. Re-renderizar vistas

    console.log(`Desasignar pedido ${pedidoId} de vehículo`);
    alert('Funcionalidad "Desasignar" pendiente de implementación en desarrollo backend');
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
// EXPORTAR HOJA REPARTO (MOCK)
// ===========================

function exportarHojaReparto() {
    alert("Acción de exportar pedido");
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
