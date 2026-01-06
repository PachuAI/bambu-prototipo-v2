/* mock data */
const MOCK_PRODUCTS = [
    { id: 1, name: "Granel detergente", price: 915, stock: 999500, weight: 1.2 },
    { id: 2, name: "Detergente tipo magistral x1 lt", price: 1600, stock: 9100, weight: 1.0 },
    { id: 3, name: "Detergente tipo magistral x5 lts", price: 5800, stock: 8740, weight: 5.0 },
    { id: 4, name: "Esponja Dorada", price: 150, stock: 500, weight: 0.1 },
    { id: 5, name: "Lavandina x5 lts", price: 2500, stock: 120, weight: 5.0 }
];

const MOCK_CLIENTS = [
    { id: 151, name: "ARAUCARIAS 371", phone: "2994 22-3530", address: "Araucarias 371", discount: 0 },
    { id: 189, name: "AV. DEL TRABAJADOR", phone: "2995 15-0070", address: "Av. Del Trabajador 500", discount: 15 },
    { id: 417, name: "CARCARAÑÁ 222", phone: "2995 16-2569", address: "Carcarañá 222", discount: 0 },
    { id: 999, name: "Carlos ⭐", phone: "299 123-4567", address: "Calle Falsa 123", discount: 10 } // Requested Star Client
];

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
    setupListeners();
    renderCart();
    updateModeUI();
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

    // Sidebar Auto-Collapse Behavior
    setupSidebarAutoCollapse();

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

    els.btnDoConfirm.addEventListener('click', () => {
        // Actual Commit Logic
        if (state.mode === 'REPARTO') {
            const date = els.inputDateInline.value;
            const client = state.selectedClient ? state.selectedClient.name : "Cliente sin nombre";
            alert(`Pedido confirmado para REPARTO.\nFecha: ${date}\nCliente: ${client}\n(Resetting...)`);
        } else {
            alert("Pedido confirmado para FÁBRICA.\nSe entrega ahora.\n(Resetting...)");
        }
        // Reset
        window.location.reload();
    });

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

    const matches = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

    els.resultsProduct.innerHTML = matches.map(p => `
        <div class="prod-row compact" onclick="addToCart(${p.id})">
            <div class="prod-info-line">
                <span class="p-name">${p.name}</span>
                <span class="p-meta">Stock: ${p.stock} | $${p.price}</span>
            </div>
            <div class="prod-add"><i class="fas fa-plus-circle"></i></div>
        </div>
    `).join('');

    els.resultsProduct.classList.remove('hidden');
}

function addToCart(productId) {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
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
                    <input type="text" value="${item.qty}" readonly>
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
    console.log('searchClients called with:', query); // DEBUG

    if (query.length < 2) {
        els.resultsCliente.classList.add('hidden');
        // If input is empty, reset to "Cliente sin nombre"
        if (query.length === 0) {
            state.selectedClient = null;
            updateTotals();
        }
        return;
    }

    const matches = MOCK_CLIENTS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    console.log('Matches found:', matches); // DEBUG

    els.resultsCliente.innerHTML = matches.map(c => `
        <div class="prod-row compact" onclick="selectClient(${c.id})">
            <div class="prod-info-line">
                <span class="p-name">${c.name}</span>
                <span class="p-meta">${c.address}</span>
            </div>
            <div class="prod-add"><i class="fas fa-check-circle"></i></div>
        </div>
    `).join('');

    els.resultsCliente.classList.remove('hidden');
    console.log('Results should be visible now'); // DEBUG
}

function selectClient(id) {
    const client = MOCK_CLIENTS.find(c => c.id === id);
    state.selectedClient = client;

    // Update input value with client name
    els.inputClientSearch.value = client.name;

    // Auto-update discount logic when client changes
    updateTotals();

    // Hide results
    els.resultsCliente.classList.add('hidden');
}

/* LOGIC: FINANCIALS WITH HYBRID AUTO/MANUAL LEVELS */
function updateTotals() {
    // 1. Subtotal
    const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const totalWeight = state.cart.reduce((acc, item) => acc + (item.weight * item.qty), 0);

    els.txtSubtotal.textContent = `$${subtotal.toLocaleString()}`;
    els.txtPeso.textContent = `${totalWeight.toFixed(2)}kg`;

    // 2. Check auto-levels ONLY if not manually applied
    if (!state.levelAppliedManually) {
        checkAutoLevels(subtotal);
    }

    // 3. Discounts (Hierarchy: Manual > Client > Level)
    let discountAmount = 0;
    const rowClientDisc = document.getElementById('row-client-discount');
    const txtClientDisc = document.getElementById('txt-client-discount');

    if (state.discountManual > 0) {
        // Priority 1: Manual discount
        discountAmount = subtotal * (state.discountManual / 100);
        rowClientDisc.classList.add('hidden');
        // Reset levels visual
        els.chkL2.checked = false;
        els.chkL3.checked = false;
        els.btnApplyL2.classList.remove('active');
        els.btnApplyL3.classList.remove('active');
    } else if (state.selectedClient && state.selectedClient.discount > 0) {
        // Priority 2: Client fixed discount
        discountAmount = subtotal * (state.selectedClient.discount / 100);
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
            discountAmount = subtotal * (state.discountLevel / 100);
        }
    }

    // 4. Final Calculation
    const total = subtotal - discountAmount + state.adjustment;
    els.txtTotal.textContent = `$${total.toLocaleString()}`;

    // 5. Auto-fill payment amount if checked
    autoFillPaymentAmount(total);
}

/* AUTO-CHECK THRESHOLDS (Only if not manually applied) */
function checkAutoLevels(subtotal) {
    const L2_THRESHOLD = 250000;
    const L3_THRESHOLD = 1000000;

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

/* SIDEBAR AUTO-COLLAPSE BEHAVIOR */
function setupSidebarAutoCollapse() {
    let collapseTimer = null;

    // Function to start the auto-collapse timer
    function startCollapseTimer() {
        clearTimeout(collapseTimer);
        collapseTimer = setTimeout(() => {
            els.sidebar.classList.add('collapsed');
        }, 5000); // 5 seconds
    }

    // Function to expand sidebar
    function expandSidebar() {
        els.sidebar.classList.remove('collapsed');
        clearTimeout(collapseTimer);
    }

    // Function to collapse sidebar
    function collapseSidebar() {
        clearTimeout(collapseTimer);
        els.sidebar.classList.add('collapsed');
    }

    // Initial behavior: expanded, then auto-collapse after 5 seconds
    startCollapseTimer();

    // Hover behavior
    els.sidebar.addEventListener('mouseenter', expandSidebar);
    els.sidebar.addEventListener('mouseleave', collapseSidebar);

    // Navigation behavior: when clicking on nav items, start timer again
    const navItems = els.sidebar.querySelectorAll('.nav-menu li, .btn-cotizador-nav');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Expand and start timer for new page
            expandSidebar();
            startCollapseTimer();
        });
    });

    // Toggle button behavior (optional - keep manual toggle)
    els.btnToggleSidebar.addEventListener('click', () => {
        if (els.sidebar.classList.contains('collapsed')) {
            expandSidebar();
            startCollapseTimer();
        } else {
            collapseSidebar();
        }
    });
}

// Start
init();
