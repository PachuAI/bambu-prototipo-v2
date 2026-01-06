/**
 * ============================================================================
 * PRODUCTOS - SCRIPT
 * ============================================================================
 *
 * Lógica mock para el módulo Productos y Stock
 * PRD de referencia: prd/productos.html
 *
 * Fecha: 06 Enero 2026
 *
 * REGLAS DE NEGOCIO IMPLEMENTADAS:
 * - PRD 4.2: CRUD productos con validación nombre único
 * - PRD 4.3: Control de disponibilidad (toggle)
 * - PRD 4.5: Promociones con precio fijo (switch mutuamente excluyente)
 * - PRD 4.6: Stock con alertas configurables (default 20)
 * - PRD 4.8: Persistencia de filtros en localStorage
 *
 * ============================================================================
 */

// ============================================================================
// ESTADO LOCAL
// ============================================================================

let productosLocal = [...PRODUCTOS];
let filtrosActuales = {
    busqueda: '',
    proveedor: '',
    disponibilidad: '',
    promocion: false,
    stockBajo: false
};

/**
 * REGLA DE NEGOCIO: Límite de stock bajo
 * PRD: prd/productos.html - Sección 4.6
 *
 * Si el producto NO tiene stock_minimo configurado (0 o vacío),
 * se usa este valor por defecto para el filtro de stock bajo.
 */
const STOCK_BAJO_LIMITE = 20;

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar filtros desde localStorage (persistencia)
    cargarFiltrosGuardados();

    // Inicializar UI
    cargarProveedoresEnSelectores();
    renderizarTabla();

    // Event listeners
    initEventListeners();

    // Verificar tema guardado
    verificarTemaGuardado();
});

function initEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('search-productos');
    searchInput.addEventListener('input', debounce((e) => {
        filtrosActuales.busqueda = e.target.value.toLowerCase();
        guardarFiltros();
        renderizarTabla();
    }, 300));

    // Filtro proveedor
    document.getElementById('filter-proveedor').addEventListener('change', (e) => {
        filtrosActuales.proveedor = e.target.value;
        guardarFiltros();
        renderizarTabla();
    });

    // Filtro disponibilidad
    document.getElementById('filter-disponibilidad').addEventListener('change', (e) => {
        filtrosActuales.disponibilidad = e.target.value;
        guardarFiltros();
        renderizarTabla();
    });

    // Filtro promoción
    document.getElementById('filter-promocion').addEventListener('change', (e) => {
        filtrosActuales.promocion = e.target.checked;
        guardarFiltros();
        renderizarTabla();
    });

    // Filtro stock bajo
    document.getElementById('filter-stock-bajo').addEventListener('change', (e) => {
        filtrosActuales.stockBajo = e.target.checked;
        guardarFiltros();
        renderizarTabla();
    });

    // Cerrar modales con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarTodosLosModales();
        }
    });

    // Cerrar modales clickeando overlay
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarTodosLosModales();
            }
        });
    });
}

// ============================================================================
// RENDERIZADO TABLA
// ============================================================================

function renderizarTabla() {
    const tbody = document.getElementById('tbody-productos');
    const productosFiltrados = aplicarFiltros();

    if (productosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-box-open" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    No se encontraron productos
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = productosFiltrados.map(producto => {
        const alertaStock = producto.stock_minimo > 0 ? producto.stock_minimo : STOCK_BAJO_LIMITE;
        const stockBajo = producto.stock_actual < alertaStock;
        const precioMostrar = producto.en_promocion ? producto.precio_promocional : producto.precio_l1;

        return `
            <tr data-id="${producto.id}">
                <td class="col-orden">
                    <div class="orden-cell">
                        <span class="drag-handle" title="Arrastrar para reordenar"><i class="fas fa-grip-vertical"></i></span>
                        <span>${producto.orden}</span>
                    </div>
                </td>
                <td class="col-nombre">
                    <div class="producto-nombre-cell">
                        <span class="producto-nombre">${producto.nombre}</span>
                        ${producto.en_promocion ? '<span class="badge-promo">PROMO</span>' : ''}
                    </div>
                </td>
                <td class="col-proveedor">${producto.proveedor_nombre}</td>
                <td class="col-precio text-right">
                    <span class="precio-cell ${producto.en_promocion ? 'precio-promo' : ''}">
                        ${formatCurrency(precioMostrar)}
                    </span>
                </td>
                <td class="col-stock">
                    <div class="stock-cell ${stockBajo ? 'stock-bajo' : ''}">
                        ${producto.stock_actual}
                        ${stockBajo ? '<i class="fas fa-exclamation-triangle stock-bajo-icon" title="Stock bajo"></i>' : ''}
                    </div>
                </td>
                <td class="col-peso text-center">${producto.peso_kg.toFixed(1)}</td>
                <td class="col-estado text-center">
                    <span class="badge-status ${producto.disponible ? 'disponible' : 'no-disponible'}">
                        ${producto.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                </td>
                <td class="col-acciones">
                    <div class="actions-cell">
                        <button class="btn-icon-sm btn-edit" title="Editar" onclick="editarProducto(${producto.id})">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn-icon-sm btn-stock" title="Ajustar Stock" onclick="abrirModalAjustarStock(${producto.id})">
                            <i class="fas fa-boxes"></i>
                        </button>
                        <button class="btn-icon-sm btn-delete" title="Eliminar" onclick="confirmarEliminarProducto(${producto.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function aplicarFiltros() {
    return productosLocal
        .filter(p => {
            // Búsqueda por nombre
            if (filtrosActuales.busqueda && !p.nombre.toLowerCase().includes(filtrosActuales.busqueda)) {
                return false;
            }

            // Filtro proveedor
            if (filtrosActuales.proveedor && p.proveedor_id != filtrosActuales.proveedor) {
                return false;
            }

            // Filtro disponibilidad
            if (filtrosActuales.disponibilidad === 'disponible' && !p.disponible) {
                return false;
            }
            if (filtrosActuales.disponibilidad === 'no-disponible' && p.disponible) {
                return false;
            }

            // Filtro promoción
            if (filtrosActuales.promocion && !p.en_promocion) {
                return false;
            }

            // Filtro stock bajo
            if (filtrosActuales.stockBajo) {
                const alertaStock = p.stock_minimo > 0 ? p.stock_minimo : STOCK_BAJO_LIMITE;
                if (p.stock_actual >= alertaStock) {
                    return false;
                }
            }

            return true;
        })
        .sort((a, b) => a.orden - b.orden);
}

// ============================================================================
// FILTROS
// ============================================================================

function cargarProveedoresEnSelectores() {
    const opciones = PROVEEDORES.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');

    // Filtro header
    const filterProveedor = document.getElementById('filter-proveedor');
    filterProveedor.innerHTML = '<option value="">Proveedor: Todos</option>' + opciones;

    // Modal producto
    const prodProveedor = document.getElementById('prod-proveedor');
    prodProveedor.innerHTML = '<option value="">Sin proveedor (combo)</option>' + opciones;

    // Modal exportar
    const exportProveedor = document.getElementById('export-proveedor');
    exportProveedor.innerHTML = '<option value="">Todos los proveedores</option>' + opciones;
}

function limpiarFiltros() {
    filtrosActuales = {
        busqueda: '',
        proveedor: '',
        disponibilidad: '',
        promocion: false,
        stockBajo: false
    };

    document.getElementById('search-productos').value = '';
    document.getElementById('filter-proveedor').value = '';
    document.getElementById('filter-disponibilidad').value = '';
    document.getElementById('filter-promocion').checked = false;
    document.getElementById('filter-stock-bajo').checked = false;

    guardarFiltros();
    renderizarTabla();
    showToast('Filtros limpiados', 'success');
}

function guardarFiltros() {
    localStorage.setItem('productos_filtros', JSON.stringify(filtrosActuales));
}

function cargarFiltrosGuardados() {
    const guardados = localStorage.getItem('productos_filtros');
    if (guardados) {
        filtrosActuales = JSON.parse(guardados);

        // Restaurar valores en inputs
        document.getElementById('search-productos').value = filtrosActuales.busqueda || '';
        document.getElementById('filter-proveedor').value = filtrosActuales.proveedor || '';
        document.getElementById('filter-disponibilidad').value = filtrosActuales.disponibilidad || '';
        document.getElementById('filter-promocion').checked = filtrosActuales.promocion || false;
        document.getElementById('filter-stock-bajo').checked = filtrosActuales.stockBajo || false;
    }
}

// ============================================================================
// MODAL CREAR/EDITAR PRODUCTO
// ============================================================================

function abrirModalProducto(productoId = null) {
    const modal = document.getElementById('modal-producto');
    const titulo = document.getElementById('modal-producto-titulo');
    const btnTexto = document.getElementById('btn-guardar-texto');

    // Resetear formulario
    document.getElementById('prod-id').value = '';
    document.getElementById('prod-nombre').value = '';
    document.getElementById('prod-proveedor').value = '';
    document.getElementById('prod-precio').value = '';
    document.getElementById('prod-precio').disabled = false;
    document.getElementById('prod-stock').value = '';
    document.getElementById('prod-stock-min').value = '';
    document.getElementById('prod-peso').value = '';
    document.getElementById('prod-disponible').checked = true;
    document.getElementById('prod-en-promocion').checked = false;
    document.getElementById('prod-precio-promo').value = '';
    document.getElementById('prod-precio-promo').disabled = true;

    // Ocultar errores
    document.getElementById('error-nombre').classList.add('hidden');
    document.getElementById('error-precio-promo').classList.add('hidden');

    if (productoId) {
        // Modo edición
        const producto = productosLocal.find(p => p.id === productoId);
        if (!producto) return;

        titulo.innerHTML = '<i class="fas fa-pen"></i> Editar Producto';
        btnTexto.textContent = 'Guardar Cambios';

        document.getElementById('prod-id').value = producto.id;
        document.getElementById('prod-nombre').value = producto.nombre;
        document.getElementById('prod-proveedor').value = producto.proveedor_id || '';
        document.getElementById('prod-stock').value = producto.stock_actual;
        document.getElementById('prod-stock-min').value = producto.stock_minimo || '';
        document.getElementById('prod-peso').value = producto.peso_kg;
        document.getElementById('prod-disponible').checked = producto.disponible;
        document.getElementById('prod-en-promocion').checked = producto.en_promocion;

        if (producto.en_promocion) {
            // Producto en promoción: precio base disabled, promo activo
            document.getElementById('prod-precio').value = producto.precio_l1;
            document.getElementById('prod-precio').disabled = true;
            document.getElementById('prod-precio-promo').value = producto.precio_promocional;
            document.getElementById('prod-precio-promo').disabled = false;
        } else {
            // Producto normal: precio base activo
            document.getElementById('prod-precio').value = producto.precio_l1;
            document.getElementById('prod-precio').disabled = false;
        }
    } else {
        // Modo creación
        titulo.innerHTML = '<i class="fas fa-box"></i> Nuevo Producto';
        btnTexto.textContent = 'Crear Producto';
    }

    modal.classList.remove('hidden');
}

function cerrarModalProducto() {
    document.getElementById('modal-producto').classList.add('hidden');
}

function editarProducto(id) {
    abrirModalProducto(id);
}

// ============================================================================
// REGLA DE NEGOCIO: Switch de Precios Mutuamente Excluyentes
// PRD: prd/productos.html - Sección 4.5 (Promociones)
// ============================================================================

/**
 * Controla el estado de los inputs de precio según el switch de promoción.
 *
 * LÓGICA DE NEGOCIO (PRD 4.5):
 * - Switch OFF (sin promoción): precio_base ACTIVO, precio_promocional DISABLED
 * - Switch ON (en promoción): precio_base DISABLED, precio_promocional ACTIVO
 *
 * Esto asegura que solo un campo de precio esté activo a la vez,
 * evitando confusión sobre cuál precio aplicar al producto.
 */
function togglePrecioPromocional() {
    const checked = document.getElementById('prod-en-promocion').checked;
    const inputPrecioBase = document.getElementById('prod-precio');
    const inputPrecioPromo = document.getElementById('prod-precio-promo');

    // PRD 4.5: Solo un precio activo según estado del switch
    inputPrecioBase.disabled = checked;      // Disabled si está en promoción
    inputPrecioPromo.disabled = !checked;    // Activo si está en promoción

    // Limpiar precio promo al desactivar promoción
    if (!checked) {
        inputPrecioPromo.value = '';
    }
}

// ============================================================================
// REGLA DE NEGOCIO: Crear/Editar Producto
// PRD: prd/productos.html - Sección 4.2
// ============================================================================

/**
 * Guarda un producto nuevo o actualiza uno existente.
 *
 * LÓGICA DE NEGOCIO (PRD 4.2, 4.5, 4.6):
 * - Nombre: obligatorio y único en el sistema
 * - Precio: según modo (PRD 4.5)
 *   - Sin promoción → validar precio_base > 0
 *   - Con promoción → validar precio_promocional > 0
 * - Stock mínimo: opcional (PRD 4.6)
 *   - Si vacío/0 → usará STOCK_BAJO_LIMITE (20) para filtro
 * - Precios L2/L3: calculados automáticamente desde L1
 *   - L2 = L1 * 0.9375 (descuento 6.25%)
 *   - L3 = L1 * 0.90 (descuento 10%)
 *
 * VALIDACIONES:
 * - Nombre: obligatorio, único (case insensitive)
 * - Precio activo: > 0
 * - Stock actual: obligatorio (puede ser 0 o negativo)
 * - Peso: obligatorio, > 0
 */
function guardarProducto() {
    // ========================================================================
    // PASO 1: Obtener valores del formulario
    // ========================================================================
    const id = document.getElementById('prod-id').value;
    const nombre = document.getElementById('prod-nombre').value.trim();
    const proveedorId = document.getElementById('prod-proveedor').value;
    const precioL1 = parseFloat(document.getElementById('prod-precio').value) || 0;
    const stockActual = parseInt(document.getElementById('prod-stock').value);
    const stockMinimoInput = document.getElementById('prod-stock-min').value;
    // PRD 4.6: Stock mínimo opcional, default 0 (filtro usará STOCK_BAJO_LIMITE)
    const stockMinimo = stockMinimoInput ? parseInt(stockMinimoInput) : 0;
    const peso = parseFloat(document.getElementById('prod-peso').value);
    const disponible = document.getElementById('prod-disponible').checked;
    const enPromocion = document.getElementById('prod-en-promocion').checked;
    const precioPromo = parseFloat(document.getElementById('prod-precio-promo').value) || 0;

    // ========================================================================
    // PASO 2: Validaciones según PRD
    // ========================================================================

    // PRD 4.2.1: Nombre obligatorio
    if (!nombre) {
        showToast('El nombre es obligatorio', 'error');
        return;
    }

    // PRD 4.2.2: Nombre único (case insensitive, excluyendo producto actual en edición)
    const nombreExiste = productosLocal.some(p =>
        p.nombre.toLowerCase() === nombre.toLowerCase() && p.id != id
    );
    if (nombreExiste) {
        document.getElementById('error-nombre').classList.remove('hidden');
        showToast('Ya existe un producto con este nombre', 'error');
        return;
    }

    // PRD 4.5: Validar precio según modo promoción
    if (enPromocion) {
        // Producto en promoción: solo validar precio_promocional
        if (!precioPromo || precioPromo <= 0) {
            document.getElementById('error-precio-promo').classList.remove('hidden');
            showToast('El precio promocional debe ser mayor a 0', 'error');
            return;
        }
    } else {
        // Producto normal: solo validar precio_base
        if (!precioL1 || precioL1 <= 0) {
            showToast('El precio base debe ser mayor a 0', 'error');
            return;
        }
    }

    // PRD 4.2.3: Stock actual obligatorio (puede ser 0 o negativo)
    if (isNaN(stockActual)) {
        showToast('Stock actual es obligatorio', 'error');
        return;
    }

    // PRD 4.2.4: Peso obligatorio y > 0
    if (!peso || peso <= 0) {
        showToast('El peso debe ser mayor a 0', 'error');
        return;
    }

    // ========================================================================
    // PASO 3: Preparar datos para guardar
    // ========================================================================

    // Obtener nombre proveedor (null si es combo/sin proveedor)
    const proveedor = PROVEEDORES.find(p => p.id == proveedorId);
    const proveedorNombre = proveedor ? proveedor.nombre : '-';

    // ========================================================================
    // PASO 4: Guardar producto (crear o actualizar)
    // PRD 4.2: Estructura de datos según especificación
    // ========================================================================

    if (id) {
        // MODO EDICIÓN: Actualizar producto existente
        const index = productosLocal.findIndex(p => p.id == id);
        if (index !== -1) {
            const productoExistente = productosLocal[index];

            /**
             * PRD 4.5: Al editar producto en promoción, mantener precio_l1 original
             * para poder restaurarlo cuando se quite la promoción.
             * Los precios L2/L3 se calculan siempre desde L1.
             */
            const precioBase = enPromocion ? productoExistente.precio_l1 : precioL1;

            productosLocal[index] = {
                ...productoExistente,
                nombre,
                proveedor_id: proveedorId ? parseInt(proveedorId) : null,
                proveedor_nombre: proveedorNombre,
                precio_l1: precioBase,
                precio_l2: precioBase * 0.9375,  // PRD: L2 = L1 - 6.25%
                precio_l3: precioBase * 0.90,    // PRD: L3 = L1 - 10%
                stock_actual: stockActual,
                stock_minimo: stockMinimo,
                peso_kg: peso,
                disponible,
                en_promocion: enPromocion,
                precio_promocional: enPromocion ? precioPromo : null,
                updated_at: new Date().toISOString().split('T')[0]
            };
            showToast('Producto actualizado correctamente', 'success');
        }
    } else {
        // MODO CREACIÓN: Nuevo producto
        const nuevoId = Math.max(...productosLocal.map(p => p.id)) + 1;
        const nuevoOrden = Math.max(...productosLocal.map(p => p.orden)) + 1;

        /**
         * PRD 4.5: Para productos nuevos en promoción,
         * usar precio_promocional como precio_l1 base.
         */
        const precioBase = enPromocion ? precioPromo : precioL1;

        productosLocal.push({
            id: nuevoId,
            nombre,
            proveedor_id: proveedorId ? parseInt(proveedorId) : null,
            proveedor_nombre: proveedorNombre,
            precio_l1: precioBase,
            precio_l2: precioBase * 0.9375,  // PRD: L2 = L1 - 6.25%
            precio_l3: precioBase * 0.90,    // PRD: L3 = L1 - 10%
            stock_actual: stockActual,
            stock_minimo: stockMinimo,
            peso_kg: peso,
            orden: nuevoOrden,
            disponible,
            en_promocion: enPromocion,
            precio_promocional: enPromocion ? precioPromo : null,
            created_at: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString().split('T')[0]
        });
        showToast('Producto creado correctamente', 'success');
    }

    // PASO 5: Cerrar modal y actualizar tabla
    cerrarModalProducto();
    renderizarTabla();
}

// ============================================================================
// MODAL AJUSTAR STOCK
// ============================================================================

function abrirModalAjustarStock(productoId) {
    const producto = productosLocal.find(p => p.id === productoId);
    if (!producto) return;

    document.getElementById('ajuste-producto-id').value = productoId;
    document.getElementById('ajuste-producto-nombre').textContent = producto.nombre;
    document.getElementById('ajuste-stock-actual').textContent = producto.stock_actual + ' unidades';
    document.getElementById('ajuste-cantidad').value = '';
    document.getElementById('ajuste-motivo').value = '';
    document.getElementById('ajuste-stock-resultante').textContent = producto.stock_actual;

    // Reset radio
    document.querySelector('input[name="tipo-movimiento"][value="INGRESO"]').checked = true;

    document.getElementById('modal-ajustar-stock').classList.remove('hidden');
}

function cerrarModalAjustarStock() {
    document.getElementById('modal-ajustar-stock').classList.add('hidden');
}

function actualizarVistaPrevia() {
    const productoId = document.getElementById('ajuste-producto-id').value;
    const producto = productosLocal.find(p => p.id == productoId);
    if (!producto) return;

    const tipo = document.querySelector('input[name="tipo-movimiento"]:checked').value;
    const cantidad = parseInt(document.getElementById('ajuste-cantidad').value) || 0;

    let stockResultante = producto.stock_actual;
    if (tipo === 'INGRESO') {
        stockResultante += cantidad;
    } else {
        stockResultante -= cantidad;
    }

    const resultadoEl = document.getElementById('ajuste-stock-resultante');
    resultadoEl.textContent = stockResultante + ' unidades';

    // Cambiar color si es negativo
    if (stockResultante < 0) {
        resultadoEl.style.color = 'var(--color-danger)';
    } else if (stockResultante < producto.stock_minimo) {
        resultadoEl.style.color = 'var(--color-warning)';
    } else {
        resultadoEl.style.color = 'var(--color-info)';
    }
}

function confirmarAjusteStock() {
    const productoId = document.getElementById('ajuste-producto-id').value;
    const tipo = document.querySelector('input[name="tipo-movimiento"]:checked').value;
    const cantidad = parseInt(document.getElementById('ajuste-cantidad').value);
    const motivo = document.getElementById('ajuste-motivo').value.trim();

    // Validaciones
    if (!cantidad || cantidad <= 0) {
        showToast('La cantidad debe ser mayor a 0', 'error');
        return;
    }

    if (!motivo) {
        showToast('El motivo es obligatorio', 'error');
        return;
    }

    // Actualizar stock
    const index = productosLocal.findIndex(p => p.id == productoId);
    if (index !== -1) {
        if (tipo === 'INGRESO') {
            productosLocal[index].stock_actual += cantidad;
        } else {
            productosLocal[index].stock_actual -= cantidad;
        }
        productosLocal[index].updated_at = new Date().toISOString().split('T')[0];

        showToast('Stock actualizado correctamente', 'success');
    }

    cerrarModalAjustarStock();
    renderizarTabla();
}

// ============================================================================
// MODAL EXPORTAR
// ============================================================================

function abrirModalExportar() {
    document.getElementById('export-proveedor').value = '';
    actualizarVistaExport();
    document.getElementById('modal-exportar').classList.remove('hidden');
}

function cerrarModalExportar() {
    document.getElementById('modal-exportar').classList.add('hidden');
}

function actualizarVistaExport() {
    const proveedorId = document.getElementById('export-proveedor').value;
    let productos = productosLocal;

    if (proveedorId) {
        productos = productos.filter(p => p.proveedor_id == proveedorId);
    }

    document.getElementById('export-count').textContent = `${productos.length} productos seleccionados`;
}

function descargarExcel() {
    const proveedorId = document.getElementById('export-proveedor').value;
    let productos = productosLocal;

    if (proveedorId) {
        productos = productos.filter(p => p.proveedor_id == proveedorId);
    }

    // Simular descarga
    const fecha = new Date().toISOString().split('T')[0];
    showToast(`Descargando inventario_bambu_${fecha}.xlsx (${productos.length} productos)`, 'success');

    cerrarModalExportar();

    // En producción real, aquí se generaría el Excel con SheetJS
    console.log('Exportando productos:', productos);
}

// ============================================================================
// MODAL ELIMINAR
// ============================================================================

function confirmarEliminarProducto(productoId) {
    const producto = productosLocal.find(p => p.id === productoId);
    if (!producto) return;

    document.getElementById('eliminar-producto-id').value = productoId;
    document.getElementById('eliminar-nombre').textContent = producto.nombre;
    document.getElementById('modal-confirmar-eliminar').classList.remove('hidden');
}

function cerrarModalEliminar() {
    document.getElementById('modal-confirmar-eliminar').classList.add('hidden');
}

function confirmarEliminar() {
    const productoId = document.getElementById('eliminar-producto-id').value;

    // En producción, verificar si tiene pedidos asociados
    // Por ahora, simular eliminación

    const index = productosLocal.findIndex(p => p.id == productoId);
    if (index !== -1) {
        const nombreEliminado = productosLocal[index].nombre;
        productosLocal.splice(index, 1);
        showToast(`"${nombreEliminado}" eliminado`, 'success');
    }

    cerrarModalEliminar();
    renderizarTabla();
}

// ============================================================================
// UTILIDADES
// ============================================================================

function cerrarTodosLosModales() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.add('hidden');
    });
}

function formatCurrency(value) {
    return '$' + value.toLocaleString('es-AR', { minimumFractionDigits: 0 });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-circle';
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================================
// TEMA (Dark Mode)
// ============================================================================

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Actualizar icono
    const icon = document.getElementById('theme-icon');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function verificarTemaGuardado() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = document.getElementById('theme-icon');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

