/**
 * ESTADÍSTICAS - Lógica JavaScript
 * Bambu CRM V2 Prototipo
 *
 * PRD: prd/estadisticas.html
 */

// ============================================================================
// VARIABLES GLOBALES
// ============================================================================

let estadisticasData = [];       // Datos calculados de estadísticas
let ordenActual = 'cantidad';    // Columna de ordenamiento actual
let ordenDireccion = 'desc';     // Dirección: 'asc' o 'desc'
let chartTop10 = null;           // Instancia del gráfico Chart.js
let metricaGrafico = 'cantidad'; // Métrica del gráfico: 'cantidad' o 'monto'

// ============================================================================
// INICIALIZACIÓN
// PRD: prd/estadisticas.html - Sección 2.1
// ============================================================================

/**
 * Inicializa el módulo de estadísticas al cargar la página.
 *
 * LÓGICA:
 * - Cargar proveedores en el filtro
 * - Aplicar filtros iniciales (mes actual)
 * - Renderizar tabla y gráfico
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar proveedores en el select
    cargarProveedores();

    // 2. Aplicar filtros iniciales
    aplicarFiltros();

});

// ============================================================================
// REGLA DE NEGOCIO: Cálculo de Estadísticas por Producto
// PRD: prd/estadisticas.html - Sección 4.2
// ============================================================================

/**
 * Calcula las estadísticas de ventas por producto en un período.
 *
 * LÓGICA DE NEGOCIO:
 * - Solo incluye pedidos con estado != 'borrador' (PRD sección 4.4)
 * - Agrupa por producto_id
 * - Suma cantidad y monto por producto
 * - Calcula % participación = (monto_producto / monto_total) * 100
 *
 * @param {string} fechaDesde - Fecha inicial (YYYY-MM-DD)
 * @param {string} fechaHasta - Fecha final (YYYY-MM-DD)
 * @param {number|null} proveedorId - ID del proveedor (null = todos)
 * @param {string} busqueda - Texto de búsqueda por nombre
 * @param {boolean} incluirSinVentas - Incluir productos con 0 ventas
 * @returns {Array} Array de estadísticas por producto
 */
function calcularEstadisticas(fechaDesde, fechaHasta, proveedorId, busqueda, incluirSinVentas) {
    // 1. Filtrar pedidos por fecha y estado (PRD sección 4.4)
    // Estados incluidos: pendiente, asignado, en transito, entregado
    // Estados NO incluidos: borrador
    const pedidosFiltrados = PEDIDOS.filter(p => {
        if (p.estado === 'borrador') return false;
        if (!p.fecha) return false;
        if (p.fecha < fechaDesde || p.fecha > fechaHasta) return false;
        return true;
    });

    const pedidosIds = new Set(pedidosFiltrados.map(p => p.id));

    // 2. Agrupar ventas por producto
    const ventasPorProducto = {};

    PEDIDOS_PRODUCTOS.forEach(item => {
        if (!pedidosIds.has(item.pedido_id)) return;

        const productoId = item.producto_id;
        if (!ventasPorProducto[productoId]) {
            ventasPorProducto[productoId] = {
                producto_id: productoId,
                producto_nombre: item.producto_nombre,
                cantidad_vendida: 0,
                monto_total: 0,
                ventas: [] // Detalle para el modal
            };
        }

        ventasPorProducto[productoId].cantidad_vendida += item.cantidad;
        ventasPorProducto[productoId].monto_total += item.subtotal;

        // Guardar detalle para modal "Ver detalle"
        const pedido = PEDIDOS.find(p => p.id === item.pedido_id);
        ventasPorProducto[productoId].ventas.push({
            pedido_id: item.pedido_id,
            pedido_numero: pedido ? pedido.numero : `#${item.pedido_id}`,
            fecha: pedido ? pedido.fecha : null,
            cliente: pedido ? pedido.cliente : '-',
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            subtotal: item.subtotal
        });
    });

    // 3. Convertir a array y enriquecer con datos del producto
    let resultados = Object.values(ventasPorProducto);

    // Añadir proveedor_id desde PRODUCTOS
    resultados = resultados.map(stat => {
        const producto = PRODUCTOS.find(p => p.id === stat.producto_id);
        return {
            ...stat,
            proveedor_id: producto ? producto.proveedor_id : null,
            proveedor_nombre: producto ? producto.proveedor_nombre : '-'
        };
    });

    // 4. Incluir productos sin ventas si está activado (PRD sección 4.3)
    if (incluirSinVentas) {
        PRODUCTOS.forEach(producto => {
            if (!ventasPorProducto[producto.id]) {
                resultados.push({
                    producto_id: producto.id,
                    producto_nombre: producto.nombre,
                    proveedor_id: producto.proveedor_id,
                    proveedor_nombre: producto.proveedor_nombre,
                    cantidad_vendida: 0,
                    monto_total: 0,
                    ventas: []
                });
            }
        });
    }

    // 5. Aplicar filtro de proveedor
    if (proveedorId && proveedorId !== 'todos') {
        resultados = resultados.filter(r => r.proveedor_id === parseInt(proveedorId));
    }

    // 6. Aplicar filtro de búsqueda
    if (busqueda && busqueda.trim()) {
        const termino = busqueda.toLowerCase().trim();
        resultados = resultados.filter(r =>
            r.producto_nombre.toLowerCase().includes(termino)
        );
    }

    // 7. Calcular % participación (PRD sección 4.2)
    const montoTotalGeneral = resultados.reduce((sum, r) => sum + r.monto_total, 0);
    resultados = resultados.map(r => ({
        ...r,
        participacion: montoTotalGeneral > 0
            ? ((r.monto_total / montoTotalGeneral) * 100).toFixed(1)
            : '0.0'
    }));

    return resultados;
}

// ============================================================================
// REGLA DE NEGOCIO: Aplicar Filtros
// PRD: prd/estadisticas.html - Sección 3.2
// ============================================================================

/**
 * Aplica los filtros seleccionados y recalcula estadísticas.
 *
 * VALIDACIONES (PRD sección 4.1):
 * - Fecha desde no puede ser mayor que fecha hasta
 * - Período máximo de 1 año (opcional, por performance)
 */
function aplicarFiltros() {
    // 1. Obtener valores de filtros
    const fechaDesde = document.getElementById('filter-fecha-desde').value;
    const fechaHasta = document.getElementById('filter-fecha-hasta').value;
    const proveedorId = document.getElementById('filter-proveedor').value;
    const busqueda = document.getElementById('filter-buscar').value;
    const incluirSinVentas = document.getElementById('filter-sin-ventas').checked;

    // 2. Validar fechas (PRD sección 4.1)
    if (fechaDesde > fechaHasta) {
        mostrarToast('La fecha inicial no puede ser posterior a la fecha final', 'error');
        return;
    }

    // 3. Calcular estadísticas
    estadisticasData = calcularEstadisticas(
        fechaDesde,
        fechaHasta,
        proveedorId,
        busqueda,
        incluirSinVentas
    );

    // 4. Ordenar por defecto: cantidad vendida descendente (PRD sección 3.3)
    ordenarData();

    // 5. Renderizar UI
    renderizarTabla();
    renderizarGrafico();
    actualizarResumen(fechaDesde, fechaHasta);
}

/**
 * Limpia todos los filtros y restablece valores por defecto.
 */
function limpiarFiltros() {
    document.getElementById('filter-fecha-desde').value = '2025-12-01';
    document.getElementById('filter-fecha-hasta').value = '2025-12-31';
    document.getElementById('filter-proveedor').value = 'todos';
    document.getElementById('filter-buscar').value = '';
    document.getElementById('filter-sin-ventas').checked = false;

    aplicarFiltros();
}

// ============================================================================
// RENDERIZADO: Tabla de Estadísticas
// PRD: prd/estadisticas.html - Sección 3.3
// ============================================================================

/**
 * Renderiza la tabla de estadísticas con los datos calculados.
 *
 * COLUMNAS (PRD sección 3.3):
 * - Producto: nombre del producto
 * - Cantidad vendida: total de unidades (clickeable para ordenar)
 * - Monto total: suma en pesos (clickeable para ordenar)
 * - % Participación: porcentaje del total
 * - Acciones: botón [Ver detalle]
 */
function renderizarTabla() {
    const tbody = document.getElementById('tbody-estadisticas');
    tbody.innerHTML = '';

    if (estadisticasData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 24px; display: block; margin-bottom: 8px;"></i>
                    No hay datos para el período seleccionado
                </td>
            </tr>
        `;
        return;
    }

    estadisticasData.forEach(stat => {
        const tr = document.createElement('tr');
        const sinVentas = stat.cantidad_vendida === 0;

        tr.innerHTML = `
            <td class="${sinVentas ? 'producto-sin-ventas' : ''}">
                ${stat.producto_nombre}
                ${sinVentas ? '<span style="font-size: 10px;"> (sin ventas)</span>' : ''}
            </td>
            <td class="text-right ${sinVentas ? 'producto-sin-ventas' : ''}">
                ${formatNumber(stat.cantidad_vendida)} un
            </td>
            <td class="text-right ${sinVentas ? 'producto-sin-ventas' : ''}">
                ${formatCurrency(stat.monto_total)}
            </td>
            <td class="text-right ${sinVentas ? 'producto-sin-ventas' : ''}">
                ${stat.participacion}%
            </td>
            <td class="text-center">
                ${sinVentas ? '-' : `
                    <button class="btn-ver-detalle" onclick="verDetalle(${stat.producto_id})">
                        <i class="fas fa-eye"></i> Ver detalle
                    </button>
                `}
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Actualizar totales en footer
    const totalCantidad = estadisticasData.reduce((sum, r) => sum + r.cantidad_vendida, 0);
    const totalMonto = estadisticasData.reduce((sum, r) => sum + r.monto_total, 0);

    document.getElementById('total-cantidad').textContent = formatNumber(totalCantidad) + ' un';
    document.getElementById('total-monto').textContent = formatCurrency(totalMonto);
}

// ============================================================================
// RENDERIZADO: Gráfico Top 10
// PRD: prd/estadisticas.html - Sección 3.4
// ============================================================================

/**
 * Renderiza el gráfico de barras con los top 10 productos.
 *
 * LÓGICA (PRD sección 3.4):
 * - Eje X: Productos (top 10 más vendidos)
 * - Eje Y: Cantidad vendida o Monto total (según toggle)
 */
function renderizarGrafico() {
    const ctx = document.getElementById('chart-top10').getContext('2d');

    // Destruir gráfico anterior si existe
    if (chartTop10) {
        chartTop10.destroy();
    }

    // Obtener top 10 por la métrica actual
    const top10 = [...estadisticasData]
        .filter(s => s.cantidad_vendida > 0)
        .sort((a, b) => {
            const valorA = metricaGrafico === 'cantidad' ? a.cantidad_vendida : a.monto_total;
            const valorB = metricaGrafico === 'cantidad' ? b.cantidad_vendida : b.monto_total;
            return valorB - valorA;
        })
        .slice(0, 10);

    const labels = top10.map(s => truncateText(s.producto_nombre, 20));
    const data = top10.map(s => metricaGrafico === 'cantidad' ? s.cantidad_vendida : s.monto_total);

    // Colores según dark mode
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? '#3d4556' : '#e2e8f0';
    const textColor = isDark ? '#9ca3af' : '#64748b';

    chartTop10 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: metricaGrafico === 'cantidad' ? 'Cantidad vendida' : 'Monto total',
                data: data,
                backgroundColor: 'rgba(66, 153, 225, 0.7)',
                borderColor: 'rgba(66, 153, 225, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (metricaGrafico === 'cantidad') {
                                return `${context.parsed.y} unidades`;
                            } else {
                                return formatCurrency(context.parsed.y);
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor,
                        font: { size: 10 }
                    }
                },
                y: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: { size: 10 },
                        callback: function(value) {
                            if (metricaGrafico === 'monto') {
                                return '$' + formatNumber(value);
                            }
                            return value;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Cambia la métrica del gráfico entre cantidad y monto.
 * @param {string} metrica - 'cantidad' o 'monto'
 */
function cambiarMetricaGrafico(metrica) {
    metricaGrafico = metrica;

    // Actualizar botones toggle
    document.querySelectorAll('.chart-toggle .btn-toggle').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.metric === metrica);
    });

    renderizarGrafico();
}

// ============================================================================
// RESUMEN (Cards superiores)
// ============================================================================

/**
 * Actualiza las cards de resumen con los totales calculados.
 */
function actualizarResumen(fechaDesde, fechaHasta) {
    // Productos con ventas
    const productosConVentas = estadisticasData.filter(s => s.cantidad_vendida > 0).length;
    document.getElementById('stat-productos').textContent = productosConVentas;

    // Cantidad total
    const cantidadTotal = estadisticasData.reduce((sum, r) => sum + r.cantidad_vendida, 0);
    document.getElementById('stat-cantidad').textContent = formatNumber(cantidadTotal);

    // Monto total
    const montoTotal = estadisticasData.reduce((sum, r) => sum + r.monto_total, 0);
    document.getElementById('stat-monto').textContent = formatCurrency(montoTotal);

    // Pedidos en período
    const pedidosEnPeriodo = PEDIDOS.filter(p => {
        if (p.estado === 'borrador') return false;
        if (!p.fecha) return false;
        return p.fecha >= fechaDesde && p.fecha <= fechaHasta;
    }).length;
    document.getElementById('stat-pedidos').textContent = pedidosEnPeriodo;
}

// ============================================================================
// ORDENAMIENTO
// PRD: prd/estadisticas.html - Sección 3.3
// ============================================================================

/**
 * Ordena los datos por una columna específica.
 *
 * LÓGICA (PRD sección 3.3):
 * - Default: Por cantidad vendida (descendente)
 * - Click en header alterna entre ascendente/descendente
 *
 * @param {string} columna - Columna a ordenar: 'producto', 'cantidad', 'monto'
 */
function ordenarPor(columna) {
    // Si es la misma columna, alternar dirección
    if (ordenActual === columna) {
        ordenDireccion = ordenDireccion === 'asc' ? 'desc' : 'asc';
    } else {
        ordenActual = columna;
        ordenDireccion = 'desc'; // Default descendente
    }

    ordenarData();
    renderizarTabla();
    actualizarIconosOrden();
}

/**
 * Ordena estadisticasData según ordenActual y ordenDireccion.
 */
function ordenarData() {
    estadisticasData.sort((a, b) => {
        let valorA, valorB;

        switch (ordenActual) {
            case 'producto':
                valorA = a.producto_nombre.toLowerCase();
                valorB = b.producto_nombre.toLowerCase();
                break;
            case 'cantidad':
                valorA = a.cantidad_vendida;
                valorB = b.cantidad_vendida;
                break;
            case 'monto':
                valorA = a.monto_total;
                valorB = b.monto_total;
                break;
            default:
                valorA = a.cantidad_vendida;
                valorB = b.cantidad_vendida;
        }

        if (ordenActual === 'producto') {
            return ordenDireccion === 'asc'
                ? valorA.localeCompare(valorB)
                : valorB.localeCompare(valorA);
        } else {
            return ordenDireccion === 'asc' ? valorA - valorB : valorB - valorA;
        }
    });
}

/**
 * Actualiza los iconos de ordenamiento en los headers de la tabla.
 */
function actualizarIconosOrden() {
    document.querySelectorAll('.table th.sortable').forEach(th => {
        const icono = th.querySelector('i');
        const columna = th.dataset.sort;

        if (columna === ordenActual) {
            th.classList.add('sorted');
            icono.className = ordenDireccion === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        } else {
            th.classList.remove('sorted');
            icono.className = 'fas fa-sort';
        }
    });
}

// ============================================================================
// MODAL: Ver Detalle de Producto
// PRD: prd/estadisticas.html - Sección 3.5
// ============================================================================

/**
 * Abre el modal con el detalle de ventas de un producto.
 *
 * CONTENIDO (PRD sección 3.5):
 * - Nombre del producto (header)
 * - Período seleccionado
 * - Tabla de pedidos individuales: Fecha, Pedido #, Cliente, Cantidad, Precio, Subtotal
 * - Click en Pedido # abre pedido en Ventas
 *
 * @param {number} productoId - ID del producto
 */
function verDetalle(productoId) {
    const stat = estadisticasData.find(s => s.producto_id === productoId);
    if (!stat) return;

    // Actualizar header del modal
    document.getElementById('modal-producto-nombre').textContent = stat.producto_nombre;

    // Actualizar período
    const fechaDesde = document.getElementById('filter-fecha-desde').value;
    const fechaHasta = document.getElementById('filter-fecha-hasta').value;
    document.getElementById('modal-periodo-texto').textContent =
        `Período: ${formatDateDisplay(fechaDesde)} - ${formatDateDisplay(fechaHasta)}`;

    // Renderizar tabla de ventas
    const tbody = document.getElementById('tbody-detalle');
    tbody.innerHTML = '';

    // Ordenar ventas por fecha descendente
    const ventasOrdenadas = [...stat.ventas].sort((a, b) => {
        if (!a.fecha) return 1;
        if (!b.fecha) return -1;
        return b.fecha.localeCompare(a.fecha);
    });

    ventasOrdenadas.forEach(venta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${venta.fecha ? formatDateDisplay(venta.fecha) : '-'}</td>
            <td>
                <a href="ventas.html?pedido=${venta.pedido_id}" class="link-pedido">
                    ${venta.pedido_numero}
                </a>
            </td>
            <td>${venta.cliente}</td>
            <td class="text-right">${venta.cantidad}</td>
            <td class="text-right">${formatCurrency(venta.precio_unitario)}</td>
            <td class="text-right">${formatCurrency(venta.subtotal)}</td>
        `;
        tbody.appendChild(tr);
    });

    // Actualizar totales del modal
    document.getElementById('detalle-total-cantidad').textContent = stat.cantidad_vendida;
    document.getElementById('detalle-total-monto').textContent = formatCurrency(stat.monto_total);

    // Mostrar modal
    abrirModal('detalle');
}

// ============================================================================
// EXPORTAR EXCEL
// PRD: prd/estadisticas.html - Sección 3.6
// ============================================================================

/**
 * Exporta las estadísticas a un archivo Excel.
 *
 * FORMATO (PRD sección 3.6):
 * - Nombre: estadisticas_ventas_YYYY-MM-DD.xlsx
 * - Columnas: Producto | Cantidad vendida | Monto total | % Participación
 * - Fila TOTAL al final
 *
 * NOTA: En producción usar librería SheetJS (xlsx)
 * Para el prototipo, simulamos la descarga con CSV
 */
function exportarExcel() {
    if (estadisticasData.length === 0) {
        mostrarToast('No hay datos para exportar', 'error');
        return;
    }

    // Generar contenido CSV (simulación de Excel)
    const fechaDesde = document.getElementById('filter-fecha-desde').value;
    const fechaHasta = document.getElementById('filter-fecha-hasta').value;

    let csv = 'Estadísticas de Ventas por Producto\n';
    csv += `Período: ${formatDateDisplay(fechaDesde)} - ${formatDateDisplay(fechaHasta)}\n\n`;
    csv += 'Producto,Cantidad Vendida,Monto Total,% Participación\n';

    estadisticasData.forEach(stat => {
        csv += `"${stat.producto_nombre}",${stat.cantidad_vendida},${stat.monto_total},${stat.participacion}%\n`;
    });

    // Fila total
    const totalCantidad = estadisticasData.reduce((sum, r) => sum + r.cantidad_vendida, 0);
    const totalMonto = estadisticasData.reduce((sum, r) => sum + r.monto_total, 0);
    csv += `TOTAL,${totalCantidad},${totalMonto},100%\n`;

    // Crear y descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fecha = new Date().toISOString().split('T')[0];
    link.href = URL.createObjectURL(blob);
    link.download = `estadisticas_ventas_${fecha}.csv`;
    link.click();

    mostrarToast('Reporte exportado correctamente');
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Carga los proveedores en el select de filtro.
 */
function cargarProveedores() {
    const select = document.getElementById('filter-proveedor');

    PROVEEDORES.forEach(prov => {
        const option = document.createElement('option');
        option.value = prov.id;
        option.textContent = prov.nombre;
        select.appendChild(option);
    });
}

/**
 * Formatea un número con separador de miles.
 */
function formatNumber(num) {
    return num.toLocaleString('es-AR');
}

/**
 * Formatea un número como moneda ARS.
 */
function formatCurrency(num) {
    return '$' + num.toLocaleString('es-AR');
}

/**
 * Formatea una fecha YYYY-MM-DD a DD/MM/YYYY.
 */
function formatDateDisplay(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

/**
 * Trunca un texto a una longitud máxima.
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

// ============================================================================
// MODALES
// ============================================================================

function abrirModal(nombre) {
    document.getElementById(`modal-${nombre}`).classList.remove('hidden');
}

function cerrarModal(nombre) {
    document.getElementById(`modal-${nombre}`).classList.add('hidden');
}

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
});

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.add('hidden');
    }
});

// ============================================================================
// TOAST NOTIFICATION
// ============================================================================

function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast-notification');
    const icon = toast.querySelector('i');
    const text = document.getElementById('toast-message');

    text.textContent = mensaje;

    if (tipo === 'error') {
        toast.style.background = 'var(--color-danger)';
        icon.className = 'fas fa-exclamation-circle';
    } else {
        toast.style.background = 'var(--color-success)';
        icon.className = 'fas fa-check-circle';
    }

    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

