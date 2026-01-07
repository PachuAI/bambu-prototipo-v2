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
    // Cargar orden guardado desde localStorage (PRD 4.5)
    cargarOrdenGuardado();

    // Cargar filtros desde localStorage (persistencia)
    cargarFiltrosGuardados();

    // Inicializar UI
    cargarProveedoresEnSelectores();
    renderizarTabla();

    // Verificar alerta de stock negativo (PRD 4.1, 4.6)
    verificarStockNegativo();

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
// PANEL STOCK NEGATIVO
// PRD: prd/productos.html - Sección 4.1, 4.6
// ============================================================================

/**
 * Verifica si hay productos con stock negativo y muestra/oculta el panel de alerta.
 *
 * LÓGICA DE NEGOCIO (PRD 4.1, 4.6):
 * - Stock negativo indica un problema de inventario que requiere atención inmediata
 * - El panel se muestra prominentemente para alertar al usuario
 * - Permite filtrar rápidamente para ver solo productos afectados
 */
function verificarStockNegativo() {
    const productosNegativos = productosLocal.filter(p => p.stock_actual < 0);
    const panel = document.getElementById('alert-stock-negativo');
    const texto = document.getElementById('alert-stock-negativo-texto');

    if (productosNegativos.length > 0) {
        texto.textContent = productosNegativos.length === 1
            ? 'Hay 1 producto con stock negativo'
            : `Hay ${productosNegativos.length} productos con stock negativo`;
        panel.classList.remove('hidden');
    } else {
        panel.classList.add('hidden');
    }
}

/**
 * Filtra la tabla para mostrar solo productos con stock negativo.
 */
function filtrarStockNegativo() {
    // Limpiar filtros actuales
    filtrosActuales = {
        busqueda: '',
        proveedor: '',
        disponibilidad: '',
        promocion: false,
        stockBajo: true  // Activar filtro stock bajo que incluye negativos
    };

    // Actualizar UI de filtros
    document.getElementById('search-productos').value = '';
    document.getElementById('filter-proveedor').value = '';
    document.getElementById('filter-disponibilidad').value = '';
    document.getElementById('filter-promocion').checked = false;
    document.getElementById('filter-stock-bajo').checked = true;

    guardarFiltros();
    renderizarTabla();
    showToast('Mostrando productos con stock bajo/negativo', 'info');
}

// ============================================================================
// DRAG & DROP - REORDENAR PRODUCTOS
// PRD: prd/productos.html - Sección 3.4, 4.5
// ============================================================================

/**
 * Inicializa SortableJS para permitir reordenar productos arrastrando.
 *
 * LÓGICA DE NEGOCIO (PRD 3.4, 4.5):
 * - El orden de productos define cómo aparecen en el cotizador
 * - Solo se puede reordenar cuando NO hay filtros activos
 * - Al soltar, se recalcula el campo 'orden' de todos los productos
 * - El nuevo orden se persiste en localStorage (mock) y se refleja en UI
 */
let sortableInstance = null;

function inicializarDragDrop() {
    const tbody = document.getElementById('tbody-productos');

    // Destruir instancia anterior si existe
    if (sortableInstance) {
        sortableInstance.destroy();
        sortableInstance = null;
    }

    // Solo habilitar drag & drop si NO hay filtros activos
    const hayFiltrosActivos = filtrosActuales.busqueda ||
                              filtrosActuales.proveedor ||
                              filtrosActuales.disponibilidad ||
                              filtrosActuales.promocion ||
                              filtrosActuales.stockBajo;

    if (hayFiltrosActivos) {
        // Deshabilitar handles visualmente
        tbody.querySelectorAll('.drag-handle').forEach(handle => {
            handle.style.opacity = '0.3';
            handle.style.cursor = 'not-allowed';
            handle.title = 'Limpiar filtros para reordenar';
        });
        return;
    }

    // Habilitar handles
    tbody.querySelectorAll('.drag-handle').forEach(handle => {
        handle.style.opacity = '1';
        handle.style.cursor = 'grab';
        handle.title = 'Arrastrar para reordenar';
    });

    // Inicializar SortableJS
    sortableInstance = new Sortable(tbody, {
        handle: '.drag-handle',
        animation: 150,
        ghostClass: 'drag-ghost',
        chosenClass: 'drag-chosen',
        dragClass: 'drag-active',

        onEnd: function(evt) {
            // PRD 4.5: Recalcular orden de todos los productos
            actualizarOrdenProductos();
        }
    });
}

/**
 * Recalcula el campo 'orden' de todos los productos según posición en DOM.
 *
 * LÓGICA:
 * - Recorre las filas del tbody en orden actual
 * - Asigna orden secuencial (1, 2, 3...)
 * - Actualiza productosLocal y re-renderiza
 */
function actualizarOrdenProductos() {
    const tbody = document.getElementById('tbody-productos');
    const filas = tbody.querySelectorAll('tr[data-id]');

    filas.forEach((fila, index) => {
        const productoId = parseInt(fila.dataset.id);
        const producto = productosLocal.find(p => p.id === productoId);
        if (producto) {
            producto.orden = index + 1;
        }
    });

    // Persistir en localStorage (mock de persistencia)
    guardarOrdenProductos();

    // Re-renderizar para actualizar números de orden
    renderizarTabla();

    showToast('Orden actualizado', 'success');
}

/**
 * Guarda el orden actual de productos en localStorage.
 * En producción real, esto sería una llamada API.
 */
function guardarOrdenProductos() {
    const ordenMap = productosLocal.map(p => ({ id: p.id, orden: p.orden }));
    localStorage.setItem('productos_orden', JSON.stringify(ordenMap));
}

/**
 * Restaura el orden de productos desde localStorage al iniciar.
 */
function cargarOrdenGuardado() {
    const ordenGuardado = localStorage.getItem('productos_orden');
    if (ordenGuardado) {
        const ordenMap = JSON.parse(ordenGuardado);
        ordenMap.forEach(item => {
            const producto = productosLocal.find(p => p.id === item.id);
            if (producto) {
                producto.orden = item.orden;
            }
        });
    }
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
                        <span class="producto-nombre link-detalle" onclick="abrirModalDetalle(${producto.id})">${producto.nombre}</span>
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
                        <button class="btn-icon-sm btn-history" title="Historial Stock" onclick="abrirModalHistorial(${producto.id})">
                            <i class="fas fa-history"></i>
                        </button>
                        <button class="btn-icon-sm btn-delete" title="Eliminar" onclick="confirmarEliminarProducto(${producto.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Inicializar drag & drop después de renderizar (PRD 3.4)
    inicializarDragDrop();
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
        // Producto en promoción: validar precio_promocional > 0
        if (!precioPromo || precioPromo <= 0) {
            document.getElementById('error-precio-promo').classList.remove('hidden');
            showToast('El precio promocional debe ser mayor a 0', 'error');
            return;
        }

        // PRD 4.1: Validar que precio promocional < precio L1
        // En edición: comparar con precio_l1 del producto existente
        // En creación: comparar con precio_base ingresado
        const precioBaseReferencia = id
            ? productosLocal.find(p => p.id == id)?.precio_l1 || precioL1
            : precioL1;

        if (precioBaseReferencia > 0 && precioPromo >= precioBaseReferencia) {
            document.getElementById('error-precio-promo').textContent =
                `El precio promocional debe ser menor a $${precioBaseReferencia.toLocaleString('es-AR')}`;
            document.getElementById('error-precio-promo').classList.remove('hidden');
            showToast('El precio promocional debe ser menor al precio base', 'error');
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
// MODAL HISTORIAL DE STOCK
// PRD: prd/productos.html - Sección 4.7
// ============================================================================

/**
 * Abre el modal de historial de movimientos de stock para un producto.
 *
 * LÓGICA DE NEGOCIO (PRD 4.7):
 * - Muestra todos los movimientos de stock del producto
 * - Ordenados por fecha descendente (más recientes primero)
 * - Tipos: INGRESO (verde), EGRESO (rojo), AJUSTE (naranja)
 * - Incluye motivo y stock resultante de cada movimiento
 *
 * @param {number} productoId - ID del producto
 */
function abrirModalHistorial(productoId) {
    const producto = productosLocal.find(p => p.id === productoId);
    if (!producto) return;

    // Llenar info del producto
    document.getElementById('historial-producto-nombre').textContent = producto.nombre;
    document.getElementById('historial-stock-actual').textContent = producto.stock_actual + ' unidades';

    // Obtener movimientos del producto
    const movimientos = obtenerMovimientosProducto(productoId);

    const tbody = document.getElementById('tbody-historial');
    const estadoVacio = document.getElementById('historial-vacio');

    if (movimientos.length === 0) {
        tbody.innerHTML = '';
        estadoVacio.classList.remove('hidden');
    } else {
        estadoVacio.classList.add('hidden');
        tbody.innerHTML = movimientos.map(mov => {
            const tipoClass = mov.tipo.toLowerCase();
            const signo = mov.tipo === 'INGRESO' ? '+' : (mov.tipo === 'EGRESO' ? '-' : '');
            const cantidadDisplay = mov.tipo === 'AJUSTE'
                ? (mov.cantidad > 0 ? '+' + mov.cantidad : mov.cantidad)
                : signo + Math.abs(mov.cantidad);

            return `
                <tr>
                    <td>${formatFechaHistorial(mov.created_at)}</td>
                    <td><span class="badge-tipo ${tipoClass}">${mov.tipo}</span></td>
                    <td class="cantidad-cell ${tipoClass}">${cantidadDisplay}</td>
                    <td class="motivo-cell">${mov.motivo}</td>
                    <td class="stock-result-cell">${mov.stock_resultante}</td>
                </tr>
            `;
        }).join('');
    }

    document.getElementById('modal-historial-stock').classList.remove('hidden');
}

/**
 * Obtiene los movimientos de stock de un producto.
 *
 * @param {number} productoId - ID del producto
 * @returns {Array} - Movimientos ordenados por fecha descendente
 */
function obtenerMovimientosProducto(productoId) {
    if (typeof MOVIMIENTOS_STOCK === 'undefined') return [];

    return MOVIMIENTOS_STOCK
        .filter(m => m.producto_id == productoId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Formatea fecha para mostrar en historial.
 * Formato: "28/12/2025 14:30"
 */
function formatFechaHistorial(fechaStr) {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const min = fecha.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${min}`;
}

function cerrarModalHistorial() {
    document.getElementById('modal-historial-stock').classList.add('hidden');
}

// ============================================================================
// MODAL DETALLE PRODUCTO
// PRD: prd/productos.html - Sección 4.7
// ============================================================================

let detalleProductoIdActual = null;

/**
 * Abre el modal de detalle completo de un producto.
 *
 * LÓGICA DE NEGOCIO (PRD 4.7):
 * - Tab Info: datos generales, precios por lista, estado stock
 * - Tab Historial: movimientos de stock del producto
 * - Tab Estadísticas: pedidos, unidades vendidas, ingresos
 *
 * @param {number} productoId - ID del producto
 */
function abrirModalDetalle(productoId) {
    const producto = productosLocal.find(p => p.id === productoId);
    if (!producto) return;

    detalleProductoIdActual = productoId;

    // Header
    document.getElementById('detalle-titulo').textContent = producto.nombre;
    const badgeEstado = document.getElementById('detalle-badge-estado');
    badgeEstado.textContent = producto.disponible ? 'Disponible' : 'No disponible';
    badgeEstado.className = `badge-status ${producto.disponible ? 'disponible' : 'no-disponible'}`;

    // Tab Info - Datos generales
    document.getElementById('detalle-proveedor').textContent = producto.proveedor_nombre || '-';
    document.getElementById('detalle-peso').textContent = producto.peso_kg.toFixed(1) + ' kg';
    document.getElementById('detalle-orden').textContent = '#' + producto.orden;
    document.getElementById('detalle-promocion').innerHTML = producto.en_promocion
        ? '<span class="badge-promo">EN PROMOCIÓN</span> $' + producto.precio_promocional.toLocaleString('es-AR')
        : 'Sin promoción';

    // Precios
    document.getElementById('detalle-precio-l1').textContent = formatCurrency(producto.precio_l1);
    document.getElementById('detalle-precio-l2').textContent = formatCurrency(producto.precio_l2);
    document.getElementById('detalle-precio-l3').textContent = formatCurrency(producto.precio_l3);

    // Stock
    document.getElementById('detalle-stock-actual').textContent = producto.stock_actual;
    document.getElementById('detalle-stock-minimo').textContent = producto.stock_minimo || STOCK_BAJO_LIMITE;

    const alertaStock = producto.stock_minimo > 0 ? producto.stock_minimo : STOCK_BAJO_LIMITE;
    const stockEstado = document.getElementById('detalle-stock-estado');
    if (producto.stock_actual < 0) {
        stockEstado.textContent = 'Negativo';
        stockEstado.style.color = 'var(--color-danger)';
    } else if (producto.stock_actual < alertaStock) {
        stockEstado.textContent = 'Bajo';
        stockEstado.style.color = 'var(--color-warning)';
    } else {
        stockEstado.textContent = 'Normal';
        stockEstado.style.color = 'var(--color-success)';
    }

    // Tab Historial
    cargarHistorialDetalle(productoId);

    // Tab Estadísticas
    cargarEstadisticasDetalle(productoId);

    // Reset a primera tab
    cambiarTabDetalle('info');

    document.getElementById('modal-detalle-producto').classList.remove('hidden');
}

function cerrarModalDetalle() {
    document.getElementById('modal-detalle-producto').classList.add('hidden');
    detalleProductoIdActual = null;
}

function cambiarTabDetalle(tabId) {
    // Desactivar todos los botones y contenidos
    document.querySelectorAll('#modal-detalle-producto .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('#modal-detalle-producto .tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activar el seleccionado
    document.querySelector(`#modal-detalle-producto .tab-btn[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

function cargarHistorialDetalle(productoId) {
    const movimientos = obtenerMovimientosProducto(productoId);
    const tbody = document.getElementById('tbody-detalle-historial');
    const estadoVacio = document.getElementById('detalle-historial-vacio');

    if (movimientos.length === 0) {
        tbody.innerHTML = '';
        estadoVacio.classList.remove('hidden');
    } else {
        estadoVacio.classList.add('hidden');
        tbody.innerHTML = movimientos.map(mov => {
            const tipoClass = mov.tipo.toLowerCase();
            const signo = mov.tipo === 'INGRESO' ? '+' : (mov.tipo === 'EGRESO' ? '-' : '');
            const cantidadDisplay = mov.tipo === 'AJUSTE'
                ? (mov.cantidad > 0 ? '+' + mov.cantidad : mov.cantidad)
                : signo + Math.abs(mov.cantidad);

            return `
                <tr>
                    <td>${formatFechaHistorial(mov.created_at)}</td>
                    <td><span class="badge-tipo ${tipoClass}">${mov.tipo}</span></td>
                    <td class="cantidad-cell ${tipoClass}">${cantidadDisplay}</td>
                    <td class="motivo-cell">${mov.motivo}</td>
                    <td class="stock-result-cell">${mov.stock_resultante}</td>
                </tr>
            `;
        }).join('');
    }
}

function cargarEstadisticasDetalle(productoId) {
    // Obtener estadísticas desde PEDIDOS_PRODUCTOS
    if (typeof PEDIDOS_PRODUCTOS === 'undefined') {
        document.getElementById('detalle-total-pedidos').textContent = '0';
        document.getElementById('detalle-unidades-vendidas').textContent = '0';
        document.getElementById('detalle-ingresos').textContent = '$0';
        return;
    }

    const itemsProducto = PEDIDOS_PRODUCTOS.filter(pp => pp.producto_id == productoId);

    // Contar pedidos únicos
    const pedidosUnicos = new Set(itemsProducto.map(pp => pp.pedido_id));
    const totalPedidos = pedidosUnicos.size;

    // Sumar unidades vendidas
    const unidadesVendidas = itemsProducto.reduce((sum, pp) => sum + pp.cantidad, 0);

    // Sumar ingresos
    const ingresos = itemsProducto.reduce((sum, pp) => sum + (pp.cantidad * pp.precio_unitario), 0);

    document.getElementById('detalle-total-pedidos').textContent = totalPedidos;
    document.getElementById('detalle-unidades-vendidas').textContent = unidadesVendidas;
    document.getElementById('detalle-ingresos').textContent = formatCurrency(ingresos);
}

function editarProductoDesdeDetalle() {
    if (detalleProductoIdActual) {
        cerrarModalDetalle();
        editarProducto(detalleProductoIdActual);
    }
}

// ============================================================================
// MODAL EXPORTAR
// ============================================================================

// ============================================================================
// MODAL EXPORTAR - Selección múltiple de proveedores
// PRD: prd/productos.html - Sección 3.8
// ============================================================================

function abrirModalExportar() {
    // Generar checkboxes de proveedores
    const container = document.getElementById('export-proveedores-list');
    container.innerHTML = `
        <label class="export-checkbox">
            <input type="checkbox" value="todos" checked onchange="toggleTodosProveedores(this)">
            <span>Todos los proveedores</span>
        </label>
        ${PROVEEDORES.map(p => `
            <label class="export-checkbox">
                <input type="checkbox" value="${p.id}" checked onchange="actualizarVistaExport()">
                <span>${p.nombre}</span>
            </label>
        `).join('')}
        <label class="export-checkbox">
            <input type="checkbox" value="sin-proveedor" checked onchange="actualizarVistaExport()">
            <span>Sin proveedor (combos)</span>
        </label>
    `;

    actualizarVistaExport();
    document.getElementById('modal-exportar').classList.remove('hidden');
}

function cerrarModalExportar() {
    document.getElementById('modal-exportar').classList.add('hidden');
}

/**
 * Toggle para seleccionar/deseleccionar todos los proveedores
 */
function toggleTodosProveedores(checkbox) {
    const checkboxes = document.querySelectorAll('#export-proveedores-list input[type="checkbox"]:not([value="todos"])');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
    actualizarVistaExport();
}

/**
 * Actualiza la vista previa de exportación según proveedores seleccionados
 */
function actualizarVistaExport() {
    const checkboxes = document.querySelectorAll('#export-proveedores-list input[type="checkbox"]:not([value="todos"])');
    const seleccionados = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

    let productos = productosLocal;

    // Si no está "todos" marcado, filtrar por proveedores seleccionados
    if (seleccionados.length < checkboxes.length) {
        productos = productosLocal.filter(p => {
            if (p.proveedor_id === null || !p.proveedor_id) {
                return seleccionados.includes('sin-proveedor');
            }
            return seleccionados.includes(String(p.proveedor_id));
        });
    }

    document.getElementById('export-count').textContent = `${productos.length} productos seleccionados`;

    // Actualizar checkbox "todos" si todos están marcados
    const todosCheckbox = document.querySelector('#export-proveedores-list input[value="todos"]');
    if (todosCheckbox) {
        todosCheckbox.checked = seleccionados.length === checkboxes.length;
    }
}

// ============================================================================
// REGLA DE NEGOCIO: Exportar Inventario a Excel
// PRD: prd/productos.html - Sección 3.8
// ============================================================================

/**
 * Genera y descarga un archivo Excel con el inventario de productos.
 *
 * LÓGICA DE NEGOCIO (PRD 3.8):
 * - Exporta productos según filtro de proveedor seleccionado
 * - Columnas: Nombre, Proveedor, Stock Actual, Stock Mínimo, Precio L1
 * - Formato: .xlsx con SheetJS
 * - Nombre archivo: inventario_bambu_YYYY-MM-DD.xlsx
 */
function descargarExcel() {
    const checkboxes = document.querySelectorAll('#export-proveedores-list input[type="checkbox"]:not([value="todos"])');
    const seleccionados = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

    let productos = productosLocal;

    // Filtrar por proveedores seleccionados
    if (seleccionados.length < checkboxes.length) {
        productos = productosLocal.filter(p => {
            if (p.proveedor_id === null || !p.proveedor_id) {
                return seleccionados.includes('sin-proveedor');
            }
            return seleccionados.includes(String(p.proveedor_id));
        });
    }

    // Verificar que hay productos para exportar
    if (productos.length === 0) {
        showToast('No hay productos para exportar', 'warning');
        return;
    }

    // Preparar datos para Excel (PRD 3.8: columnas específicas)
    const datosExcel = productos.map(p => ({
        'Nombre': p.nombre,
        'Proveedor': p.proveedor_nombre || '-',
        'Stock Actual': p.stock_actual,
        'Stock Mínimo': p.stock_minimo || 0,
        'Precio L1': p.precio_l1,
        'Disponible': p.disponible ? 'Sí' : 'No',
        'En Promoción': p.en_promocion ? 'Sí' : 'No'
    }));

    // Crear workbook y worksheet con SheetJS
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);

    // Ajustar ancho de columnas
    ws['!cols'] = [
        { wch: 35 },  // Nombre
        { wch: 20 },  // Proveedor
        { wch: 12 },  // Stock Actual
        { wch: 12 },  // Stock Mínimo
        { wch: 12 },  // Precio L1
        { wch: 10 },  // Disponible
        { wch: 12 }   // En Promoción
    ];

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    // Generar nombre de archivo con fecha
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `inventario_bambu_${fecha}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(wb, nombreArchivo);

    showToast(`${productos.length} productos exportados a ${nombreArchivo}`, 'success');
    cerrarModalExportar();
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

// ============================================================================
// REGLA DE NEGOCIO: Restricción de Eliminación
// PRD: prd/productos.html - Sección 3.7
// ============================================================================

/**
 * Verifica si un producto tiene pedidos asociados.
 *
 * LÓGICA DE NEGOCIO (PRD 3.7):
 * - No se puede eliminar un producto que tiene pedidos históricos
 * - Esto preserva la integridad de datos para estadísticas y auditoría
 *
 * @param {number} productoId - ID del producto a verificar
 * @returns {number} - Cantidad de pedidos asociados (0 si no tiene)
 */
function contarPedidosProducto(productoId) {
    // PEDIDOS_PRODUCTOS contiene el detalle de productos por pedido
    if (typeof PEDIDOS_PRODUCTOS === 'undefined') return 0;
    return PEDIDOS_PRODUCTOS.filter(pp => pp.producto_id == productoId).length;
}

function confirmarEliminar() {
    const productoId = document.getElementById('eliminar-producto-id').value;
    const producto = productosLocal.find(p => p.id == productoId);

    if (!producto) {
        cerrarModalEliminar();
        return;
    }

    // PRD 3.7: Verificar si tiene pedidos asociados antes de eliminar
    const cantidadPedidos = contarPedidosProducto(productoId);

    if (cantidadPedidos > 0) {
        // No permitir eliminación - mostrar mensaje de error
        showToast(`No se puede eliminar "${producto.nombre}" porque tiene ${cantidadPedidos} pedido(s) asociado(s)`, 'error');
        cerrarModalEliminar();
        return;
    }

    // Sin pedidos asociados: proceder con eliminación
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

