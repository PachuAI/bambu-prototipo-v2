/**
 * BAMBU CRM V2 - COTIZADOR
 * Usa BambuState como fuente de datos
 * PRD: prd/cotizador-especificacion.html
 */

// ============================================================================
// HELPERS: Adaptar datos de BambuState al formato del cotizador
// ============================================================================

/**
 * Obtiene productos disponibles desde BambuState
 * @returns {Array} Productos adaptados al formato del cotizador
 */
function getProductosDisponibles() {
    const productos = BambuState.getProductos({ disponible: true });
    return productos.map(p => ({
        id: p.id,
        name: p.nombre,
        price: p.precio_l1,  // Precio base L1
        price_l1: p.precio_l1,
        price_l2: p.precio_l2,
        price_l3: p.precio_l3,
        stock: p.stock_actual,
        weight: p.peso_kg,
        en_promocion: p.en_promocion,
        precio_promocional: p.precio_promocional
    }));
}

/**
 * Obtiene clientes activos desde BambuState
 * @returns {Array} Clientes adaptados al formato del cotizador
 */
function getClientesActivos() {
    const clientes = BambuState.getClientes({ estado: 'activo' });
    return clientes.map(c => ({
        id: c.id,
        name: c.direccion,  // Dirección como identificador principal
        phone: c.telefono,
        address: c.direccion,
        saldo: c.saldo,
        lista_precio: c.lista_precio,
        // Descuento según lista de precio del cliente
        discount: c.lista_precio === 'L2' ? 6.25 : (c.lista_precio === 'L3' ? 10 : 0)
    }));
}

/* STATE */
let state = {
    cart: [],
    mode: 'REPARTO', // or 'FABRICA'
    selectedClient: null,
    discountManual: 0,
    discountLevel: 0, // 0 = L1, 6.25 = L2, 10 = L3
    levelAppliedManually: false, // Flag to know if level was forced by user
    adjustment: 0,
    notes: ""
};

/* DOM ELEMENTS */
const els = {
    inputProduct: document.getElementById('input-producto'),
    resultsProduct: document.getElementById('results-producto'),
    inputClientSearch: document.getElementById('input-cliente'),
    resultsCliente: document.getElementById('results-cliente'),
    tbody: document.getElementById('pedido-body'),

    // Financials
    txtSubtotal: document.getElementById('txt-subtotal'),
    txtTotal: document.getElementById('txt-total'),
    txtPeso: document.getElementById('txt-peso'),
    inputDiscManual: document.getElementById('input-disc-manual'),
    inputAdjustment: document.getElementById('input-adjustment'),
    chkL1: document.getElementById('chk-l1'),
    chkL2: document.getElementById('chk-l2'),
    chkL3: document.getElementById('chk-l3'),
    btnApplyL2: document.getElementById('btn-apply-l2'),
    btnApplyL3: document.getElementById('btn-apply-l3'),

    // Buttons
    btnConfirm: document.getElementById('btn-confirmar'),
    confirmSubtext: document.getElementById('confirm-subtext'),
    btnToggleSidebar: document.getElementById('btn-toggle-sidebar'),
    sidebar: document.getElementById('main-sidebar'),

    // Notes
    btnToggleNotes: document.getElementById('btn-toggle-notes'),
    inputNotes: document.getElementById('input-notes'),

    // Modals
    modalResumen: document.getElementById('modal-resumen'),
    btnResumen: document.getElementById('btn-resumen'),
    btnCloseResumen: document.getElementById('close-resumen'),
    btnCloseResumen2: document.getElementById('btn-close-resumen-2'),

    // Safety Modal
    modalConfirm: document.getElementById('modal-confirm-action'),
    closeConfirm: document.getElementById('close-confirm-action'),
    btnCancelConfirm: document.getElementById('btn-cancel-confirm'),
    btnDoConfirm: document.getElementById('btn-do-confirm'),

    // Delivery Date Inline
    rowDeliveryDate: document.getElementById('row-delivery-date'),
    inputDateInline: document.getElementById('input-date-inline'),

    // Payment Section (Fábrica only)
    paymentSection: document.getElementById('payment-section'),
    chkEfectivo: document.getElementById('chk-efectivo'),
    chkDigital: document.getElementById('chk-digital'),
    inputMontoRecibido: document.getElementById('input-monto-recibido'),
    inputMontoEfectivo: document.getElementById('input-monto-efectivo'),
    inputMontoDigital: document.getElementById('input-monto-digital'),
    singleAmountContainer: document.getElementById('single-amount-container'),
    splitAmountContainer: document.getElementById('split-amount-container'),
    paymentInfo: document.getElementById('payment-info'),
    txtTotalRecibido: document.getElementById('txt-total-recibido')
};

/* INIT */
function init() {
    // Inicializar BambuState
    BambuState.init();

    setupListeners();
    renderCart();
    updateModeUI();

    console.log('[Cotizador] Inicializado con BambuState');
    console.log('[Cotizador] Productos disponibles:', getProductosDisponibles().length);
    console.log('[Cotizador] Clientes activos:', getClientesActivos().length);
}

function setupListeners() {
    // Mode Switching
    document.querySelectorAll('input[name="mode"]').forEach(r => {
        r.addEventListener('change', (e) => {
            state.mode = e.target.value;
            updateModeUI();
        });
    });

    // Default Date to Today
    const today = new Date().toISOString().split('T')[0];
    els.inputDateInline.value = today;

    // Product Search
    els.inputProduct.addEventListener('input', (e) => searchProducts(e.target.value));
    els.inputProduct.addEventListener('focus', () => {
        if (els.inputProduct.value.length >= 2) els.resultsProduct.classList.remove('hidden');
    });

    // Client Search (similar to product search)
    els.inputClientSearch.addEventListener('input', (e) => searchClients(e.target.value));
    els.inputClientSearch.addEventListener('focus', () => {
        if (els.inputClientSearch.value.length >= 2) els.resultsCliente.classList.remove('hidden');
    });

    // Financial Inputs
    els.inputDiscManual.addEventListener('input', (e) => {
        state.discountManual = parseFloat(e.target.value) || 0;
        // Manual overrides Levels
        if (state.discountManual > 0) {
            applyLevel(null); // Reset levels visual
        }
        updateTotals();
    });

    els.inputAdjustment.addEventListener('input', (e) => {
        state.adjustment = parseFloat(e.target.value) || 0;
        updateTotals();
    });

    // Notes
    els.btnToggleNotes.addEventListener('click', () => {
        els.inputNotes.classList.toggle('hidden');
        if (!els.inputNotes.classList.contains('hidden')) els.inputNotes.focus();
    });

    // Actions
    els.btnConfirm.addEventListener('click', () => {
        // Open Safety Modal
        els.modalConfirm.classList.remove('hidden');
    });

    // Safety Modal Actions
    const closeSafety = () => els.modalConfirm.classList.add('hidden');
    els.closeConfirm.addEventListener('click', closeSafety);
    els.btnCancelConfirm.addEventListener('click', closeSafety);

    els.btnDoConfirm.addEventListener('click', confirmarPedido);

    // Borrador Button
    const btnBorrador = document.getElementById('btn-borrador');
    if (btnBorrador) {
        btnBorrador.addEventListener('click', guardarBorrador);
    }

    // Summary Modal
    els.btnResumen.addEventListener('click', openSummaryModal);
    els.btnCloseResumen.addEventListener('click', () => els.modalResumen.classList.add('hidden'));
    els.btnCloseResumen2.addEventListener('click', () => els.modalResumen.classList.add('hidden'));

    // Payment Method Checkboxes
    els.chkEfectivo.addEventListener('change', updatePaymentUI);
    els.chkDigital.addEventListener('change', updatePaymentUI);

    // Payment Amount Inputs
    els.inputMontoRecibido.addEventListener('input', validatePayment);
    els.inputMontoEfectivo.addEventListener('input', validatePaymentSplit);
    els.inputMontoDigital.addEventListener('input', validatePaymentSplit);

    // Price Level Buttons
    els.btnApplyL2.addEventListener('click', () => applyLevel('L2'));
    els.btnApplyL3.addEventListener('click', () => applyLevel('L3'));

    // Calendar Modal (Removed in V3 Refactor)
    /* 
    document.getElementById('close-calendar').addEventListener('click', ...);
    document.getElementById('btn-set-date').addEventListener('click', ...);
    */

    // Click outside to close dropdowns
    document.addEventListener('click', (e) => {
        // Close product results
        const productSearchBar = document.querySelector('.product-search-bar');
        if (productSearchBar && !productSearchBar.contains(e.target)) {
            els.resultsProduct.classList.add('hidden');
        }

        // Close client results
        const clientSearchContainer = document.querySelector('.client-search-container');
        if (clientSearchContainer && !clientSearchContainer.contains(e.target)) {
            els.resultsCliente.classList.add('hidden');
        }
    });
}

function updateModeUI() {
    // Both sections (Delivery Date & Payment Method) are now always visible
    // Only update button text based on mode
    if (state.mode === 'FABRICA') {
        els.btnConfirm.classList.remove('btn-reparto');
        els.confirmSubtext.textContent = "Entregar ahora";
    } else {
        els.btnConfirm.classList.add('btn-reparto');
        els.confirmSubtext.textContent = "Agendar entrega";
    }
}

/* LOGIC: PRODUCTS & CART */
function searchProducts(query) {
    if (query.length < 2) {
        els.resultsProduct.classList.add('hidden');
        return;
    }

    const productos = getProductosDisponibles();
    const matches = productos.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

    els.resultsProduct.innerHTML = matches.map(p => {
        // Badge de promoción si aplica
        const promoBadge = p.en_promocion ? '<span class="promo-badge">PROMO</span>' : '';
        const precioMostrar = p.en_promocion && p.precio_promocional ? p.precio_promocional : p.price;

        return `
            <div class="prod-row compact" onclick="addToCart(${p.id})">
                <div class="prod-info-line">
                    <span class="p-name">${p.name} ${promoBadge}</span>
                    <span class="p-meta">Stock: ${p.stock} | $${precioMostrar.toLocaleString()}</span>
                </div>
                <div class="prod-add"><i class="fas fa-plus-circle"></i></div>
            </div>
        `;
    }).join('');

    els.resultsProduct.classList.remove('hidden');
}

function addToCart(productId) {
    const productos = getProductosDisponibles();
    const product = productos.find(p => p.id === productId);
    if (!product) return;

    // Check if exists logic (Aggregation V3)
    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
        existing.qty++;
    } else {
        state.cart.push({ ...product, qty: 1 });
    }

    renderCart();
    updateTotals();
    els.resultsProduct.classList.add('hidden');
    els.inputProduct.value = "";
    els.inputProduct.focus();
}

function renderCart() {
    if (state.cart.length === 0) {
        els.tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-shopping-basket" style="font-size: 24px; margin-bottom: 10px;"></i><br>
                    Empieza agregando productos
                </td>
            </tr>`;
        return;
    }

    els.tbody.innerHTML = state.cart.map((item, index) => `
        <tr>
            <td>
                <strong>${item.name}</strong>
            </td>
            <td class="text-right">$${(item.price * item.qty).toLocaleString()}</td>
            <td class="text-right">$${item.price.toLocaleString()}</td>
            <td class="text-center">
                <div class="qty-control">
                    <button onclick="updateQty(${index}, -1)">-</button>
                    <input type="number" value="${item.qty}" min="0"
                           onchange="handleQtyDirectEdit(${index}, this.value)"
                           onkeydown="if(event.key==='Enter'){this.blur()}"
                           class="qty-input-editable">
                    <button onclick="updateQty(${index}, 1)">+</button>
                </div>
            </td>
            <td class="text-center">
                <button onclick="removeFromCart(${index})" style="border:none; background:none; color:#ff5630; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateQty(index, change) {
    state.cart[index].qty += change;
    if (state.cart[index].qty <= 0) {
        state.cart.splice(index, 1);
    }
    renderCart();
    updateTotals();
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    renderCart();
    updateTotals();
}

/* LOGIC: CLIENTS */
function searchClients(query) {
    if (query.length < 2) {
        els.resultsCliente.classList.add('hidden');
        // If input is empty, reset to "Cliente sin nombre"
        if (query.length === 0) {
            state.selectedClient = null;
            updateTotals();
        }
        return;
    }

    const clientes = getClientesActivos();
    const matches = clientes.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

    els.resultsCliente.innerHTML = matches.map(c => {
        // Mostrar saldo con color según estado
        const saldoColor = c.saldo < 0 ? 'color: #ef4444;' : (c.saldo > 0 ? 'color: #10b981;' : '');
        const saldoTexto = c.saldo !== 0 ? `<span style="${saldoColor}">$${c.saldo.toLocaleString()}</span>` : '';

        return `
            <div class="prod-row compact" onclick="selectClient(${c.id})">
                <div class="prod-info-line">
                    <span class="p-name">${c.name}</span>
                    <span class="p-meta">${c.phone} ${saldoTexto}</span>
                </div>
                <div class="prod-add"><i class="fas fa-check-circle"></i></div>
            </div>
        `;
    }).join('');

    els.resultsCliente.classList.remove('hidden');
}

function selectClient(id) {
    const clientes = getClientesActivos();
    const client = clientes.find(c => c.id === id);
    state.selectedClient = client;

    // Update input value with client name
    els.inputClientSearch.value = client.name;

    // Auto-update discount logic when client changes
    updateTotals();

    // Hide results
    els.resultsCliente.classList.add('hidden');
}

/* LOGIC: FINANCIALS WITH HYBRID AUTO/MANUAL LEVELS */
/**
 * REGLA DE NEGOCIO CRÍTICA (PRD Sección 6.3):
 * Los descuentos (manual, cliente, lista) se aplican sobre la BASE DESCUENTO,
 * que EXCLUYE productos en promoción.
 *
 * Fórmula:
 *   subtotal = suma de todos los productos
 *   baseDescuento = suma de productos donde en_promocion=false
 *   descuentoMonto = baseDescuento * (descuento% / 100)
 *   total = subtotal - descuentoMonto + ajuste
 */
function updateTotals() {
    // 1. Subtotal (todos los productos)
    const subtotal = state.cart.reduce((acc, item) => {
        // Usar precio promocional si está en promoción
        const precio = (item.en_promocion && item.precio_promocional)
            ? item.precio_promocional
            : item.price;
        return acc + (precio * item.qty);
    }, 0);

    // 2. Base de descuento (EXCLUYE productos en promoción)
    const baseDescuento = state.cart.reduce((acc, item) => {
        if (item.en_promocion) return acc; // Excluir promociones
        return acc + (item.price * item.qty);
    }, 0);

    // 3. Peso total
    const totalWeight = state.cart.reduce((acc, item) => acc + (item.weight * item.qty), 0);

    els.txtSubtotal.textContent = `$${subtotal.toLocaleString()}`;
    els.txtPeso.textContent = `${totalWeight.toFixed(2)}kg`;

    // 4. Check auto-levels ONLY if not manually applied (usa baseDescuento para threshold)
    if (!state.levelAppliedManually) {
        checkAutoLevels(baseDescuento);
    }

    // 5. Discounts (Hierarchy: Manual > Client > Level)
    // IMPORTANTE: Aplica sobre baseDescuento, NO sobre subtotal
    let discountAmount = 0;
    const rowClientDisc = document.getElementById('row-client-discount');
    const txtClientDisc = document.getElementById('txt-client-discount');

    if (state.discountManual > 0) {
        // Priority 1: Manual discount
        discountAmount = baseDescuento * (state.discountManual / 100);
        rowClientDisc.classList.add('hidden');
        // Reset levels visual
        els.chkL2.checked = false;
        els.chkL3.checked = false;
        els.btnApplyL2.classList.remove('active');
        els.btnApplyL3.classList.remove('active');
    } else if (state.selectedClient && state.selectedClient.discount > 0) {
        // Priority 2: Client fixed discount
        discountAmount = baseDescuento * (state.selectedClient.discount / 100);
        rowClientDisc.classList.remove('hidden');
        txtClientDisc.textContent = `-$${discountAmount.toLocaleString()} (${state.selectedClient.discount}%)`;
        // Reset levels visual
        els.chkL2.checked = false;
        els.chkL3.checked = false;
        els.btnApplyL2.classList.remove('active');
        els.btnApplyL3.classList.remove('active');
    } else {
        // Priority 3: Price level discount (auto or manual)
        rowClientDisc.classList.add('hidden');
        if (state.discountLevel > 0) {
            discountAmount = baseDescuento * (state.discountLevel / 100);
        }
    }

    // 6. Final Calculation
    const total = subtotal - discountAmount + state.adjustment;
    els.txtTotal.textContent = `$${total.toLocaleString()}`;

    // 7. Auto-fill payment amount if checked
    autoFillPaymentAmount(total);

    // Debug: mostrar base de descuento si hay promociones
    const productosPromo = state.cart.filter(i => i.en_promocion);
    if (productosPromo.length > 0) {
        console.log(`[Cotizador] Base descuento: $${baseDescuento.toLocaleString()} (excluye ${productosPromo.length} promo)`);
    }
}

/* AUTO-CHECK THRESHOLDS (Only if not manually applied) */
function checkAutoLevels(subtotal) {
    const L2_THRESHOLD = 400000;  // $400k para L2
    const L3_THRESHOLD = 1000000; // $1M para L3

    if (subtotal >= L3_THRESHOLD) {
        // Auto-apply L3
        state.discountLevel = 10.00;
        els.chkL1.checked = false;
        els.chkL2.checked = false;
        els.chkL3.checked = true;
        els.btnApplyL2.classList.remove('active');
        els.btnApplyL3.classList.add('active');
    } else if (subtotal >= L2_THRESHOLD) {
        // Auto-apply L2
        state.discountLevel = 6.25;
        els.chkL1.checked = false;
        els.chkL2.checked = true;
        els.chkL3.checked = false;
        els.btnApplyL2.classList.add('active');
        els.btnApplyL3.classList.remove('active');
    } else {
        // Back to L1
        state.discountLevel = 0;
        els.chkL1.checked = true;
        els.chkL2.checked = false;
        els.chkL3.checked = false;
        els.btnApplyL2.classList.remove('active');
        els.btnApplyL3.classList.remove('active');
    }
}

/* MANUAL OVERRIDE: Apply level regardless of threshold */
function applyLevel(levelName) {
    // Clear manual discount if trying to apply level
    state.discountManual = 0;
    els.inputDiscManual.value = "";

    if (levelName === 'L2') {
        state.discountLevel = 6.25;
        state.levelAppliedManually = true;
        els.chkL1.checked = false;
        els.chkL2.checked = true;
        els.chkL3.checked = false;
        els.btnApplyL2.classList.add('active');
        els.btnApplyL3.classList.remove('active');
    } else if (levelName === 'L3') {
        state.discountLevel = 10.00;
        state.levelAppliedManually = true;
        els.chkL1.checked = false;
        els.chkL2.checked = false;
        els.chkL3.checked = true;
        els.btnApplyL2.classList.remove('active');
        els.btnApplyL3.classList.add('active');
    } else {
        // Reset to auto mode
        state.discountLevel = 0;
        state.levelAppliedManually = false;
        els.chkL1.checked = true;
        els.chkL2.checked = false;
        els.chkL3.checked = false;
        els.btnApplyL2.classList.remove('active');
        els.btnApplyL3.classList.remove('active');
    }
    updateTotals();
}

/* LOGIC: PAYMENT METHOD (Fábrica only) */
function updatePaymentUI() {
    const efectivo = els.chkEfectivo.checked;
    const digital = els.chkDigital.checked;

    if (efectivo && digital) {
        // Both checked → Show split inputs
        els.singleAmountContainer.classList.add('hidden');
        els.splitAmountContainer.classList.remove('hidden');
        validatePaymentSplit();
    } else {
        // Single or none → Show single input
        els.singleAmountContainer.classList.remove('hidden');
        els.splitAmountContainer.classList.add('hidden');

        // Auto-fill with total if one is checked
        const total = parseFloat(els.txtTotal.textContent.replace(/[$,]/g, '')) || 0;
        if (efectivo || digital) {
            els.inputMontoRecibido.value = total;
        }
        validatePayment();
    }
}

function autoFillPaymentAmount(total) {
    const efectivo = els.chkEfectivo.checked;
    const digital = els.chkDigital.checked;

    if ((efectivo || digital) && !els.singleAmountContainer.classList.contains('hidden')) {
        els.inputMontoRecibido.value = total;
    }
}

function validatePayment() {
    const montoRecibido = parseFloat(els.inputMontoRecibido.value) || 0;
    const total = parseFloat(els.txtTotal.textContent.replace(/[$,]/g, '')) || 0;

    if (montoRecibido === 0) {
        els.paymentInfo.classList.add('hidden');
        return;
    }

    els.paymentInfo.classList.remove('hidden');

    if (montoRecibido < total) {
        // Partial payment
        const pendiente = total - montoRecibido;
        els.paymentInfo.style.background = '#fff4e6';
        els.paymentInfo.style.color = '#ff8b00';
        els.paymentInfo.innerHTML = `⚠️ Pago parcial detectado<br>Saldo pendiente: $${pendiente.toLocaleString()}`;
    } else if (montoRecibido > total) {
        // Overpayment
        const aFavor = montoRecibido - total;
        els.paymentInfo.style.background = '#e3fcef';
        els.paymentInfo.style.color = '#006644';
        els.paymentInfo.innerHTML = `ℹ️ Pago excede el total<br>A favor del cliente: +$${aFavor.toLocaleString()}`;
    } else {
        // Exact payment
        els.paymentInfo.style.background = '#e3fcef';
        els.paymentInfo.style.color = '#006644';
        els.paymentInfo.innerHTML = `✅ Pago completo`;
    }
}

function validatePaymentSplit() {
    const efectivo = parseFloat(els.inputMontoEfectivo.value) || 0;
    const digital = parseFloat(els.inputMontoDigital.value) || 0;
    const totalRecibido = efectivo + digital;
    const total = parseFloat(els.txtTotal.textContent.replace(/[$,]/g, '')) || 0;

    els.txtTotalRecibido.textContent = `$${totalRecibido.toLocaleString()}`;

    if (totalRecibido === 0) {
        els.paymentInfo.classList.add('hidden');
        return;
    }

    els.paymentInfo.classList.remove('hidden');

    if (totalRecibido < total) {
        const pendiente = total - totalRecibido;
        els.paymentInfo.style.background = '#fff4e6';
        els.paymentInfo.style.color = '#ff8b00';
        els.paymentInfo.innerHTML = `⚠️ Pago parcial<br>Pendiente: $${pendiente.toLocaleString()}`;
    } else if (totalRecibido > total) {
        const aFavor = totalRecibido - total;
        els.paymentInfo.style.background = '#e3fcef';
        els.paymentInfo.style.color = '#006644';
        els.paymentInfo.innerHTML = `ℹ️ Pago excede el total<br>A favor: +$${aFavor.toLocaleString()}`;
    } else {
        els.paymentInfo.style.background = '#e3fcef';
        els.paymentInfo.style.color = '#006644';
        els.paymentInfo.innerHTML = `✅ Pago completo (mixto)`;
    }
}

/* LOGIC: SUMMARY MODAL */
function openSummaryModal() {
    els.modalResumen.classList.remove('hidden');

    // Populate data
    const date = new Date().toLocaleDateString();
    document.getElementById('preview-date').textContent = date;
    document.getElementById('preview-client').textContent = state.selectedClient ? state.selectedClient.name : "Cliente sin nombre";
    document.getElementById('preview-subtotal').textContent = els.txtSubtotal.textContent;
    document.getElementById('preview-total-display').textContent = els.txtTotal.textContent;

    // Items list
    const itemsHtml = state.cart.map(item => `
        <div>• x${item.qty} - ${item.name} - $${(item.price * item.qty).toLocaleString()}</div>
    `).join('');
    document.getElementById('preview-items-list').innerHTML = itemsHtml || "<div>(Sin productos)</div>";
}

// ============================================================================
// GUARDAR BORRADOR - Persistencia en BambuState
// PRD: Sección 8.2 - Botones de acción
// ============================================================================

/**
 * Guarda el pedido actual como borrador
 * PRD: Guardar en localStorage, generar ID, mantener en lista borradores
 */
function guardarBorrador() {
    // Validar que hay productos
    if (state.cart.length === 0) {
        alert('Agregá al menos un producto para guardar el borrador');
        return;
    }

    // Crear borrador en BambuState
    const borrador = BambuState.crearBorrador({
        cliente_id: state.selectedClient?.id || null,
        tipo: state.mode.toLowerCase(),
        fecha: els.inputDateInline.value || BambuState.FECHA_SISTEMA,
        direccion: state.selectedClient?.address || 'Cliente sin nombre',
        ciudad: 'Neuquén',
        notas: state.notes || null
    });

    // Agregar items al borrador
    state.cart.forEach(item => {
        const precio = (item.en_promocion && item.precio_promocional)
            ? item.precio_promocional
            : item.price;

        BambuState.agregarItemPedido(borrador.id, {
            producto_id: item.id,
            cantidad: item.qty,
            precio_unitario: precio
        });
    });

    // Guardar en localStorage
    BambuState.save();

    // Mostrar notificación
    console.log(`📝 Borrador ${borrador.numero} guardado`);

    // Notificación visual
    const notif = document.createElement('div');
    notif.style.cssText = 'position:fixed;top:20px;right:20px;background:#3b82f6;color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-weight:500;';
    notif.textContent = `📝 Borrador ${borrador.numero} guardado`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);

    // Opcional: limpiar formulario después de guardar borrador
    // resetearFormulario();
}

// ============================================================================
// CONFIRMAR PEDIDO - Persistencia en BambuState
// PRD: Sección 8.2 - Botones de acción
// ============================================================================

/**
 * Confirma el pedido actual y lo persiste en BambuState
 * PRD: Al confirmar → Guardar → Limpiar → Focus en buscador (SIN reload)
 */
function confirmarPedido() {
    // Validar que hay productos
    if (state.cart.length === 0) {
        alert('Agregá al menos un producto para confirmar el pedido');
        return;
    }

    // Calcular total
    const total = parseFloat(els.txtTotal.textContent.replace(/[$,]/g, '')) || 0;

    // Determinar estado inicial según modo
    const esReparto = state.mode === 'REPARTO';
    const fecha = esReparto ? els.inputDateInline.value : BambuState.FECHA_SISTEMA;
    const estadoInicial = esReparto ? 'en transito' : 'entregado';

    // Crear pedido en BambuState
    const nuevoPedido = BambuState.crearPedido({
        cliente_id: state.selectedClient?.id || null,
        tipo: esReparto ? 'reparto' : 'fabrica',
        estado: estadoInicial,
        fecha: fecha,
        direccion: state.selectedClient?.address || 'Cliente sin nombre',
        ciudad: 'Neuquén',  // Default, en producción vendría del cliente
        notas: state.notes || null,
        vehiculo_id: null  // Se asigna después en repartos-dia
    });

    // Agregar items al pedido
    state.cart.forEach(item => {
        const precio = (item.en_promocion && item.precio_promocional)
            ? item.precio_promocional
            : item.price;

        BambuState.agregarItemPedido(nuevoPedido.id, {
            producto_id: item.id,
            cantidad: item.qty,
            precio_unitario: precio
        });
    });

    // Guardar en localStorage
    BambuState.save();

    // Cerrar modal de confirmación
    els.modalConfirm.classList.add('hidden');

    // Mostrar notificación
    const clienteNombre = state.selectedClient?.name || 'Sin cliente';
    const tipoTexto = esReparto ? `REPARTO (${fecha})` : 'FÁBRICA';
    console.log(`✅ Pedido ${nuevoPedido.numero} confirmado - ${tipoTexto}`);

    // Mostrar notificación visual si existe la función
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion(`✅ Pedido ${nuevoPedido.numero} confirmado`);
    } else {
        // Fallback: notificación simple
        const notif = document.createElement('div');
        notif.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-weight:500;';
        notif.textContent = `✅ Pedido ${nuevoPedido.numero} confirmado`;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }

    // Resetear formulario (SIN reload)
    resetearFormulario();

    // Focus en buscador de productos
    els.inputProduct.focus();
}

/**
 * Limpia todos los campos del cotizador para nuevo pedido
 * PRD: Sección 1.2 - "Flujo continuo: al confirmar, vuelve automáticamente a nueva cotización"
 */
function resetearFormulario() {
    // Limpiar carrito
    state.cart = [];
    state.selectedClient = null;
    state.discountManual = 0;
    state.discountLevel = 0;
    state.levelAppliedManually = false;
    state.adjustment = 0;
    state.notes = "";

    // Limpiar inputs
    els.inputProduct.value = '';
    els.inputClientSearch.value = '';
    els.inputDiscManual.value = '';
    els.inputAdjustment.value = '';
    els.inputNotes.value = '';
    els.inputNotes.classList.add('hidden');

    // Reset fecha a hoy
    const today = new Date().toISOString().split('T')[0];
    els.inputDateInline.value = today;

    // Reset payment inputs
    els.chkEfectivo.checked = false;
    els.chkDigital.checked = false;
    els.inputMontoRecibido.value = '';
    els.inputMontoEfectivo.value = '';
    els.inputMontoDigital.value = '';
    els.paymentInfo.classList.add('hidden');

    // Re-renderizar UI
    renderCart();
    updateTotals();

    console.log('[Cotizador] Formulario reseteado para nuevo pedido');
}

// ============================================================================
// SPRINT 2: ATAJOS DE TECLADO CONFIGURABLES
// PRD: Sección 8.4 - Atajos de teclado
// ============================================================================

/**
 * Configuración de atajos de teclado (PLACEHOLDERS)
 * Los atajos finales se definirán después de validar disponibilidad en Chrome
 *
 * Formato: { key, ctrl, shift, alt, action, description }
 */
const KEYBOARD_SHORTCUTS = [
    // TODO: Definir combinaciones finales que no colisionen con Chrome
    { key: 'Escape', ctrl: false, shift: false, alt: false, action: 'closeModals', description: 'Cerrar modales/dropdowns' },
    { key: 'Enter', ctrl: false, shift: false, alt: false, action: 'selectHighlighted', description: 'Seleccionar item resaltado' },
    { key: 'ArrowUp', ctrl: false, shift: false, alt: false, action: 'navigateUp', description: 'Navegar arriba en resultados' },
    { key: 'ArrowDown', ctrl: false, shift: false, alt: false, action: 'navigateDown', description: 'Navegar abajo en resultados' },
    // Placeholders para atajos principales (a definir)
    // { key: '4', ctrl: false, shift: true, alt: false, action: 'confirmOrder', description: 'Confirmar pedido' },
    // { key: 'F4', ctrl: false, shift: false, alt: false, action: 'openSummary', description: 'Abrir resumen' },
];

// Estado de navegación por teclado
let keyboardNavState = {
    activeDropdown: null, // 'products' | 'clients' | null
    highlightedIndex: -1
};

/**
 * Inicializa el sistema de atajos de teclado
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyboardShortcut);
    console.log('[Cotizador] Atajos de teclado inicializados');
}

/**
 * Maneja eventos de teclado globales
 */
function handleKeyboardShortcut(e) {
    // Encontrar atajo configurado
    const shortcut = KEYBOARD_SHORTCUTS.find(s =>
        s.key === e.key &&
        s.ctrl === e.ctrlKey &&
        s.shift === e.shiftKey &&
        s.alt === e.altKey
    );

    if (!shortcut) return;

    // Ejecutar acción
    switch (shortcut.action) {
        case 'closeModals':
            closeAllModalsAndDropdowns();
            e.preventDefault();
            break;
        case 'navigateUp':
            if (keyboardNavState.activeDropdown) {
                navigateResults(-1);
                e.preventDefault();
            }
            break;
        case 'navigateDown':
            if (keyboardNavState.activeDropdown) {
                navigateResults(1);
                e.preventDefault();
            }
            break;
        case 'selectHighlighted':
            if (keyboardNavState.activeDropdown && keyboardNavState.highlightedIndex >= 0) {
                selectHighlightedItem();
                e.preventDefault();
            }
            break;
        case 'confirmOrder':
            els.modalConfirm.classList.remove('hidden');
            e.preventDefault();
            break;
        case 'openSummary':
            openSummaryModal();
            e.preventDefault();
            break;
    }
}

/**
 * Cierra todos los modales y dropdowns abiertos
 */
function closeAllModalsAndDropdowns() {
    // Cerrar dropdowns
    els.resultsProduct.classList.add('hidden');
    els.resultsCliente.classList.add('hidden');
    keyboardNavState.activeDropdown = null;
    keyboardNavState.highlightedIndex = -1;

    // Cerrar modales
    els.modalResumen.classList.add('hidden');
    els.modalConfirm.classList.add('hidden');
}

// ============================================================================
// SPRINT 2: NAVEGACIÓN TECLADO EN BUSCADORES
// PRD: Sección 3.3 - "Flechas ↑↓ + Enter → navegar y seleccionar"
// ============================================================================

/**
 * Navega por los resultados de búsqueda con flechas
 * @param {number} direction - 1 para abajo, -1 para arriba
 */
function navigateResults(direction) {
    const dropdown = keyboardNavState.activeDropdown === 'products'
        ? els.resultsProduct
        : els.resultsCliente;

    const items = dropdown.querySelectorAll('.prod-row');
    if (items.length === 0) return;

    // Quitar highlight anterior
    if (keyboardNavState.highlightedIndex >= 0 && items[keyboardNavState.highlightedIndex]) {
        items[keyboardNavState.highlightedIndex].classList.remove('keyboard-highlight');
    }

    // Calcular nuevo índice
    keyboardNavState.highlightedIndex += direction;

    // Wrap around
    if (keyboardNavState.highlightedIndex < 0) {
        keyboardNavState.highlightedIndex = items.length - 1;
    } else if (keyboardNavState.highlightedIndex >= items.length) {
        keyboardNavState.highlightedIndex = 0;
    }

    // Aplicar highlight y scroll
    const currentItem = items[keyboardNavState.highlightedIndex];
    currentItem.classList.add('keyboard-highlight');
    currentItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/**
 * Selecciona el item actualmente resaltado
 */
function selectHighlightedItem() {
    const dropdown = keyboardNavState.activeDropdown === 'products'
        ? els.resultsProduct
        : els.resultsCliente;

    const items = dropdown.querySelectorAll('.prod-row');
    if (keyboardNavState.highlightedIndex >= 0 && items[keyboardNavState.highlightedIndex]) {
        items[keyboardNavState.highlightedIndex].click();
        keyboardNavState.highlightedIndex = -1;
        keyboardNavState.activeDropdown = null;
    }
}

/**
 * Configura navegación de teclado para un input de búsqueda
 */
function setupSearchKeyboardNav(inputEl, dropdownType) {
    inputEl.addEventListener('focus', () => {
        keyboardNavState.activeDropdown = dropdownType;
        keyboardNavState.highlightedIndex = -1;
    });

    inputEl.addEventListener('blur', () => {
        // Delay para permitir click en resultado
        setTimeout(() => {
            if (keyboardNavState.activeDropdown === dropdownType) {
                keyboardNavState.activeDropdown = null;
                keyboardNavState.highlightedIndex = -1;
            }
        }, 200);
    });

    inputEl.addEventListener('input', () => {
        keyboardNavState.highlightedIndex = -1;
    });
}

// ============================================================================
// SPRINT 2: VALIDACIÓN FECHA SOLO L-V
// PRD: Sección 10.1 - "Solo días laborables (Lunes a Viernes)"
// ============================================================================

/**
 * Valida que la fecha seleccionada sea día laborable (L-V)
 * @param {string} dateStr - Fecha en formato YYYY-MM-DD
 * @returns {boolean} true si es día laborable
 */
function esDiaLaborable(dateStr) {
    const date = new Date(dateStr + 'T12:00:00'); // Evitar issues de timezone
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // 1=Lunes, 5=Viernes
}

/**
 * Obtiene el próximo día laborable desde una fecha
 * @param {Date} date - Fecha de inicio
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
function getProximoDiaLaborable(date) {
    const nextDate = new Date(date);
    while (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
        nextDate.setDate(nextDate.getDate() + 1);
    }
    return nextDate.toISOString().split('T')[0];
}

/**
 * Inicializa validación de fecha de entrega
 */
function initValidacionFecha() {
    els.inputDateInline.addEventListener('change', (e) => {
        const fechaSeleccionada = e.target.value;

        if (!esDiaLaborable(fechaSeleccionada)) {
            const date = new Date(fechaSeleccionada + 'T12:00:00');
            const diaNombre = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()];
            const proximoLaborable = getProximoDiaLaborable(date);
            const proximoDate = new Date(proximoLaborable + 'T12:00:00');
            const proximoNombre = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][proximoDate.getDay()];

            // Mostrar advertencia y sugerir próximo día laborable
            const confirmar = confirm(
                `⚠️ ${diaNombre} no es día de reparto.\n\n` +
                `Los repartos solo se realizan de Lunes a Viernes.\n\n` +
                `¿Cambiar a ${proximoNombre} ${proximoLaborable}?`
            );

            if (confirmar) {
                els.inputDateInline.value = proximoLaborable;
            } else {
                // Restaurar a hoy o próximo laborable
                const hoy = new Date();
                els.inputDateInline.value = getProximoDiaLaborable(hoy);
            }
        }
    });

    // Asegurar que la fecha inicial sea laborable
    const today = new Date();
    els.inputDateInline.value = getProximoDiaLaborable(today);
}

// ============================================================================
// SPRINT 2: BOTÓN COPIAR EN MODAL RESUMEN
// PRD: Sección 8.3 - Formatos de resumen
// ============================================================================

/**
 * Copia el texto del resumen al portapapeles
 */
function copiarResumenAlPortapapeles() {
    // Construir texto para copiar (formato WhatsApp)
    const fecha = document.getElementById('preview-date').textContent;
    const cliente = document.getElementById('preview-client').textContent;
    const subtotal = document.getElementById('preview-subtotal').textContent;
    const total = document.getElementById('preview-total-display').textContent;

    // Construir lista de items
    const itemsTexto = state.cart.map(item =>
        `• x${item.qty} - ${item.name} - $${(item.price * item.qty).toLocaleString()}`
    ).join('\n');

    const textoCompleto = `🔥 COTIZACIÓN BAMBU 🔥

📅 Fecha: ${fecha}
👤 Cliente: ${cliente}

🛒 PRODUCTOS:
${itemsTexto}

💰 RESUMEN:
• Subtotal: ${subtotal}
• TOTAL: ${total}`;

    // Copiar al portapapeles
    navigator.clipboard.writeText(textoCompleto).then(() => {
        // Feedback visual
        const btnCopiar = document.getElementById('btn-copiar-resumen');
        const textoOriginal = btnCopiar.textContent;
        btnCopiar.textContent = '✓ Copiado!';
        btnCopiar.style.background = '#10b981';
        btnCopiar.style.color = 'white';

        setTimeout(() => {
            btnCopiar.textContent = textoOriginal;
            btnCopiar.style.background = '';
            btnCopiar.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('No se pudo copiar al portapapeles');
    });
}

/**
 * Inicializa el botón copiar
 */
function initBotonCopiar() {
    const btnCopiar = document.getElementById('btn-copiar-resumen');
    if (btnCopiar) {
        btnCopiar.addEventListener('click', copiarResumenAlPortapapeles);
    }
}

// ============================================================================
// SPRINT 2: INPUT CANTIDAD EDITABLE
// PRD: Sección 5.2 - "Input central: permite edición directa"
// ============================================================================

/**
 * Maneja la edición directa de cantidad en el carrito
 * @param {number} index - Índice del producto en el carrito
 * @param {string} newValue - Nuevo valor ingresado
 */
function handleQtyDirectEdit(index, newValue) {
    const qty = parseInt(newValue, 10);

    if (isNaN(qty) || qty <= 0) {
        // Si es inválido o 0, eliminar del carrito
        state.cart.splice(index, 1);
    } else {
        state.cart[index].qty = qty;
    }

    renderCart();
    updateTotals();
}

// ============================================================================
// INICIALIZACIÓN SPRINT 2
// ============================================================================

function initSprint2Features() {
    // Atajos de teclado
    initKeyboardShortcuts();

    // Navegación teclado en buscadores
    setupSearchKeyboardNav(els.inputProduct, 'products');
    setupSearchKeyboardNav(els.inputClientSearch, 'clients');

    // Validación fecha L-V
    initValidacionFecha();

    // Botón copiar
    initBotonCopiar();

    console.log('[Cotizador] Sprint 2 features inicializadas');
}

// Start
init();
initSprint2Features();
