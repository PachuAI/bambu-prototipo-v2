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

    // Cargar movimientos cuenta corriente (sincronizado con BambuState)
    renderizarMovimientosCC(clienteId);
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

// ========================================
// RENDERIZADO CUENTA CORRIENTE
// PRD: prd/cuenta-corriente.html - Sincronización con Ventas
// ========================================

/**
 * Renderiza los movimientos de cuenta corriente desde BambuState
 *
 * SINCRONIZACIÓN CC ↔ VENTAS:
 * - Los movimientos se cargan desde BambuState.movimientos_cc
 * - Incluye cargos generados automáticamente desde Ventas
 * - Incluye pagos registrados desde este módulo
 *
 * @param {number} clienteId - ID del cliente
 */
function renderizarMovimientosCC(clienteId) {
    const tbody = document.getElementById('movimientos-cc-tbody');
    if (!tbody) return;

    const movimientos = BambuState.getMovimientosCC(clienteId);

    if (movimientos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">
                    <i class="fas fa-file-invoice-dollar" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    No hay movimientos en cuenta corriente
                </td>
            </tr>
        `;
        return;
    }

    // Calcular saldos acumulados (de más antiguo a más reciente, luego invertir)
    const movsOrdenados = [...movimientos].reverse();
    let saldoAcumulado = 0;
    const movsConSaldo = movsOrdenados.map(m => {
        if (m.tipo === 'cargo') saldoAcumulado -= m.monto;
        if (m.tipo === 'pago') saldoAcumulado += m.monto;
        return { ...m, saldoAcumulado };
    }).reverse();

    tbody.innerHTML = movsConSaldo.map(m => {
        const fechaDisplay = formatearFecha(m.fecha);
        const esCargo = m.tipo === 'cargo';
        const esPago = m.tipo === 'pago';

        // Método de pago badge
        let metodoBadge = '-';
        if (m.metodo_pago) {
            if (m.metodo_pago === 'efectivo') {
                metodoBadge = '<span class="method-badge"><i class="fas fa-money-bill"></i> Efectivo</span>';
            } else if (m.metodo_pago === 'digital') {
                metodoBadge = '<span class="method-badge"><i class="fas fa-university"></i> Transferencia</span>';
            } else if (m.metodo_pago === 'mixto') {
                metodoBadge = '<span class="method-badge partial"><i class="fas fa-coins"></i> Mixto</span>';
            }
        }

        // Formato montos
        const cargoDisplay = esCargo ? `$${m.monto.toLocaleString('es-AR')}` : '-';
        const pagoDisplay = esPago ? `$${m.monto.toLocaleString('es-AR')}` : '-';
        const saldoDisplay = `${m.saldoAcumulado < 0 ? '-' : ''}$${Math.abs(m.saldoAcumulado).toLocaleString('es-AR')}`;
        const saldoClass = m.saldoAcumulado < 0 ? 'amount-negative' : 'amount-positive';

        // Botón ver pedido (solo para cargos con pedido_id)
        const btnVerPedido = m.pedido_id
            ? `<button class="btn-link-small" onclick="event.stopPropagation(); window.location.href='ventas.html'">
                 <i class="fas fa-external-link-alt"></i> Ver
               </button>`
            : '';

        return `
            <tr class="movimiento-row clickeable" data-movimiento-id="${m.id}" data-tipo="${m.tipo}"
                onclick="toggleDetalleMovimiento(${m.id})">
                <td>${fechaDisplay}</td>
                <td class="${esCargo ? 'text-bold' : ''}">
                    <i class="fas fa-chevron-right expand-icon"></i>
                    ${m.descripcion}
                </td>
                <td>${metodoBadge}</td>
                <td class="text-center ${esCargo ? 'amount-negative' : 'text-subtle'}">${cargoDisplay}</td>
                <td class="text-center ${esPago ? 'amount-positive' : 'text-subtle'}">${pagoDisplay}</td>
                <td class="text-center ${saldoClass}">${saldoDisplay}</td>
                <td>${btnVerPedido}</td>
            </tr>
            <tr class="detalle-expandido hidden" id="detalle-${m.id}">
                <td colspan="7">
                    <div class="detalle-content">
                        <div class="detalle-info-grid">
                            <div class="detalle-info-item">
                                <span class="detalle-label">Registrado por:</span>
                                <span class="detalle-value">${m.usuario || 'Sistema'}</span>
                            </div>
                            <div class="detalle-info-item">
                                <span class="detalle-label">Fecha:</span>
                                <span class="detalle-value">${fechaDisplay}</span>
                            </div>
                            ${m.nota ? `
                            <div class="detalle-info-item">
                                <span class="detalle-label">Nota:</span>
                                <span class="detalle-value">${m.nota}</span>
                            </div>` : ''}
                            ${m.metodo_pago === 'mixto' ? `
                            <div class="detalle-info-item">
                                <span class="detalle-label">Efectivo:</span>
                                <span class="detalle-value">$${(m.monto_efectivo || 0).toLocaleString('es-AR')}</span>
                            </div>
                            <div class="detalle-info-item">
                                <span class="detalle-label">Digital:</span>
                                <span class="detalle-value">$${(m.monto_digital || 0).toLocaleString('es-AR')}</span>
                            </div>` : ''}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Actualizar saldo en sidebar
    const saldoActual = BambuState.calcularSaldoCC(clienteId);
    const saldoEl = document.querySelector('.sidebar-balance-amount');
    if (saldoEl) {
        saldoEl.textContent = `${saldoActual < 0 ? '-' : ''}$${Math.abs(saldoActual).toLocaleString('es-AR')}`;
        saldoEl.className = `sidebar-balance-amount ${saldoActual < 0 ? 'negative' : 'positive'}`;
    }

    console.log(`✅ Renderizados ${movimientos.length} movimientos CC`);
}

// ========================================
// ENVIAR ESTADO DE CUENTA
// PRD: prd/cuenta-corriente.html - Sección Estado de Cuenta
// ========================================

/**
 * Genera y muestra estado de cuenta para enviar/imprimir
 *
 * LÓGICA:
 * - Genera HTML con formato de estado de cuenta
 * - Abre ventana nueva para imprimir/guardar como PDF
 * - En producción: enviaría por email
 */
function enviarEstadoCuenta() {
    // Obtener cliente actual
    const params = new URLSearchParams(window.location.search);
    const clienteId = parseInt(params.get('id')) || 9;
    const cliente = BambuState.getById('clientes', clienteId);

    if (!cliente) {
        alert('Error: Cliente no encontrado');
        return;
    }

    // Obtener movimientos
    const movimientos = BambuState.getMovimientosCC(clienteId);
    const saldoActual = BambuState.calcularSaldoCC(clienteId);

    // Generar tabla de movimientos
    let tablaMovimientos = '';
    if (movimientos.length > 0) {
        // Calcular saldos acumulados
        const movsOrdenados = [...movimientos].reverse();
        let saldoAcum = 0;
        const movsConSaldo = movsOrdenados.map(m => {
            if (m.tipo === 'cargo') saldoAcum -= m.monto;
            if (m.tipo === 'pago') saldoAcum += m.monto;
            return { ...m, saldoAcumulado: saldoAcum };
        }).reverse();

        tablaMovimientos = movsConSaldo.map(m => {
            const cargo = m.tipo === 'cargo' ? `$${m.monto.toLocaleString('es-AR')}` : '-';
            const pago = m.tipo === 'pago' ? `$${m.monto.toLocaleString('es-AR')}` : '-';
            const saldo = `${m.saldoAcumulado < 0 ? '-' : ''}$${Math.abs(m.saldoAcumulado).toLocaleString('es-AR')}`;
            return `
                <tr>
                    <td>${formatearFecha(m.fecha)}</td>
                    <td>${m.descripcion}</td>
                    <td style="text-align:right">${cargo}</td>
                    <td style="text-align:right">${pago}</td>
                    <td style="text-align:right">${saldo}</td>
                </tr>
            `;
        }).join('');
    }

    // HTML del estado de cuenta
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Estado de Cuenta - ${cliente.direccion}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .empresa { font-size: 24px; font-weight: bold; }
        .titulo { font-size: 18px; color: #666; margin-top: 5px; }
        .info-cliente { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
        .info-row { display: flex; margin-bottom: 5px; }
        .info-label { width: 120px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #333; color: white; }
        .saldo-final { font-size: 20px; text-align: right; padding: 20px; background: ${saldoActual < 0 ? '#fee' : '#efe'}; }
        .saldo-negativo { color: #c00; }
        .saldo-positivo { color: #080; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="empresa">Química Bambu S.R.L.</div>
        <div class="titulo">Estado de Cuenta Corriente</div>
    </div>

    <div class="info-cliente">
        <div class="info-row"><span class="info-label">Cliente:</span> ${cliente.direccion}</div>
        <div class="info-row"><span class="info-label">Teléfono:</span> ${cliente.telefono}</div>
        <div class="info-row"><span class="info-label">Ciudad:</span> ${cliente.ciudad}</div>
        <div class="info-row"><span class="info-label">Fecha:</span> ${new Date().toLocaleDateString('es-AR')}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th style="text-align:right">Cargo</th>
                <th style="text-align:right">Pago</th>
                <th style="text-align:right">Saldo</th>
            </tr>
        </thead>
        <tbody>
            ${tablaMovimientos || '<tr><td colspan="5" style="text-align:center">Sin movimientos</td></tr>'}
        </tbody>
    </table>

    <div class="saldo-final">
        <strong>SALDO ACTUAL: </strong>
        <span class="${saldoActual < 0 ? 'saldo-negativo' : 'saldo-positivo'}">
            ${saldoActual < 0 ? '-' : ''}$${Math.abs(saldoActual).toLocaleString('es-AR')}
        </span>
    </div>

    <div class="footer">
        Documento generado el ${new Date().toLocaleString('es-AR')}<br>
        Este estado de cuenta es informativo. Ante cualquier duda contactar al vendedor.
    </div>
</body>
</html>
    `;

    // Abrir ventana para imprimir
    const ventana = window.open('', '_blank');
    ventana.document.write(html);
    ventana.document.close();

    // Auto-abrir diálogo de impresión
    setTimeout(() => {
        ventana.print();
    }, 500);

    console.log(`✅ Estado de cuenta generado para ${cliente.direccion}`);
}

// ========================================
// EXPORTAR EXCEL CUENTA CORRIENTE
// PRD: prd/cuenta-corriente.html - Sección Exportación
// ========================================

/**
 * Exporta los movimientos de cuenta corriente a CSV (compatible Excel)
 *
 * LÓGICA:
 * - Lee movimientos de la tabla en DOM (tab-cc)
 * - Extrae: Fecha, Descripción, Método, Cargo, Pago, Saldo
 * - Genera CSV con separador punto y coma (Excel ES)
 * - Nombre archivo: CC_{direccion}_{fecha}.csv
 */
function exportarExcelCC() {
    // Obtener cliente actual
    const params = new URLSearchParams(window.location.search);
    const clienteId = parseInt(params.get('id')) || 9;
    const cliente = BambuState.getById('clientes', clienteId);
    const direccionCliente = cliente ? cliente.direccion : 'CLIENTE';

    // Obtener filas de movimientos de la tabla CC
    const filas = document.querySelectorAll('#tab-cc .table-v2 tbody tr.movimiento-row');

    if (filas.length === 0) {
        alert('No hay movimientos para exportar');
        return;
    }

    // Headers del CSV
    const headers = ['Fecha', 'Descripción', 'Método Pago', 'Cargo', 'Pago', 'Saldo'];

    // Extraer datos de cada fila
    const datos = [];
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 6) {
            const fecha = celdas[0].textContent.trim();
            const descripcion = celdas[1].textContent.trim().replace(/[\n\r\t]+/g, ' ').replace(/\s+/g, ' ');
            const metodo = celdas[2].textContent.trim().replace(/[\n\r\t]+/g, ' ').replace(/\s+/g, ' ') || '-';
            const cargo = celdas[3].textContent.trim() || '-';
            const pago = celdas[4].textContent.trim() || '-';
            const saldo = celdas[5].textContent.trim();

            datos.push([fecha, descripcion, metodo, cargo, pago, saldo]);
        }
    });

    // Construir CSV
    let csv = '\uFEFF'; // BOM para UTF-8 en Excel
    csv += `Cuenta Corriente - ${direccionCliente}\n`;
    csv += `Exportado: ${new Date().toLocaleDateString('es-AR')}\n\n`;
    csv += headers.join(';') + '\n';
    datos.forEach(fila => {
        csv += fila.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';') + '\n';
    });

    // Agregar saldo actual al final
    const saldoActual = document.querySelector('.sidebar-balance-amount');
    if (saldoActual) {
        csv += `\n"Saldo Actual";"${saldoActual.textContent.trim()}"`;
    }

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const nombreArchivo = direccionCliente.replace(/\s+/g, '_').substring(0, 20);
    link.download = `CC_${nombreArchivo}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    console.log(`✅ Exportados ${datos.length} movimientos de CC a CSV`);
}
