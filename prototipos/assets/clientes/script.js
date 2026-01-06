/* BAmbu CRM - Clientes V2 Script */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Clientes V2 Loaded');

    // 1. Sidebar Auto-Collapse Behavior
    setupSidebarAutoCollapse();

    // 2. Tabs Logic (Detail View)
    const tabs = document.querySelectorAll('.tab-link');
    /* 
       For now, we only have the 'Cuenta Corriente' tab implemented in HTML. 
       Future tasks will implement switching content visibility.
       This is a placeholder for the logic.
    */
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add to clicked tab
            this.classList.add('active');

            // Hide all content panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });

            // Show target pane
            const targetId = this.getAttribute('data-tab');
            const targetPane = document.getElementById('tab-' + targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }

            console.log('Switched to tab:', targetId);
        });
    });

    // 3. Navigation Simulation
    // In a real app this is handled by routing using <a href>,
    // but we add some listeners if we need to intercept clicks/tap.

});

// ===== MODAL REGISTRAR PAGO =====

function abrirModalPago() {
    document.getElementById('modal-registrar-pago').classList.remove('hidden');
    // Setear fecha actual
    document.getElementById('fecha-pago').valueAsDate = new Date();
    // Reset form
    resetFormPago();
}

function cerrarModalPago() {
    document.getElementById('modal-registrar-pago').classList.add('hidden');
    resetFormPago();
}

function resetFormPago() {
    document.getElementById('input-monto-pago').value = '';
    document.getElementById('pago-modal-efectivo').checked = false;
    document.getElementById('pago-modal-digital').checked = false;
    document.getElementById('split-pago-container').classList.add('hidden');
    document.getElementById('radio-generico').checked = true;
    document.getElementById('dropdown-pedidos-container').classList.add('hidden');
    document.getElementById('error-monto-excede').classList.add('hidden');
    document.getElementById('nota-pago').value = '';
}

function toggleSplitPago() {
    const efectivo = document.getElementById('pago-modal-efectivo').checked;
    const digital = document.getElementById('pago-modal-digital').checked;
    const splitContainer = document.getElementById('split-pago-container');
    const montoInput = document.getElementById('input-monto-pago');

    if (efectivo && digital) {
        splitContainer.classList.remove('hidden');
        montoInput.disabled = true;
        montoInput.value = '';
    } else {
        splitContainer.classList.add('hidden');
        montoInput.disabled = false;
        // Autocomplete monto si solo uno marcado
        if (efectivo || digital) {
            // Puede autocompletar aquí si quiere
        }
    }
}

function validarSumaPago() {
    const efectivo = parseInt(document.getElementById('split-efectivo-pago').value) || 0;
    const digital = parseInt(document.getElementById('split-digital-pago').value) || 0;
    const suma = efectivo + digital;

    document.getElementById('suma-pago-valor').textContent = '$' + suma.toLocaleString();

    const sumaOk = document.getElementById('suma-ok');
    const sumaError = document.getElementById('suma-error');

    if (suma > 0) {
        sumaOk.classList.remove('hidden');
        sumaError.classList.add('hidden');
    } else {
        sumaOk.classList.add('hidden');
        sumaError.classList.remove('hidden');
    }

    calcularSaldoResultante();
}

function toggleDropdownPedidos() {
    const esEspecifico = document.getElementById('radio-especifico').checked;
    const dropdown = document.getElementById('dropdown-pedidos-container');

    if (esEspecifico) {
        dropdown.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
        document.getElementById('error-monto-excede').classList.add('hidden');
    }
}

function validarMontoPedido() {
    const select = document.getElementById('select-pedido-pago');
    const option = select.options[select.selectedIndex];
    const pendiente = parseInt(option.getAttribute('data-pendiente')) || 0;
    const montoInput = document.getElementById('input-monto-pago');
    const monto = parseInt(montoInput.value) || 0;

    const errorDiv = document.getElementById('error-monto-excede');
    const montoTxt = document.getElementById('monto-ingresado-txt');
    const pendienteTxt = document.getElementById('monto-pendiente-txt');

    if (monto > pendiente && select.value !== '') {
        errorDiv.classList.remove('hidden');
        montoTxt.textContent = monto.toLocaleString();
        pendienteTxt.textContent = pendiente.toLocaleString();
    } else {
        errorDiv.classList.add('hidden');
    }
}

function calcularSaldoResultante() {
    const saldoActual = -130000; // Mock, en real se obtiene del DOM
    let montoPago = 0;

    const efectivoCheck = document.getElementById('pago-modal-efectivo').checked;
    const digitalCheck = document.getElementById('pago-modal-digital').checked;

    if (efectivoCheck && digitalCheck) {
        // Modo split
        const efectivo = parseInt(document.getElementById('split-efectivo-pago').value) || 0;
        const digital = parseInt(document.getElementById('split-digital-pago').value) || 0;
        montoPago = efectivo + digital;
    } else {
        montoPago = parseInt(document.getElementById('input-monto-pago').value) || 0;
    }

    const saldoNuevo = saldoActual + montoPago;
    const saldoSpan = document.getElementById('saldo-resultante-valor');

    saldoSpan.textContent = (saldoNuevo >= 0 ? '+' : '') + '$' + Math.abs(saldoNuevo).toLocaleString();

    if (saldoNuevo < 0) {
        saldoSpan.className = 'value saldo-negativo';
    } else if (saldoNuevo > 0) {
        saldoSpan.className = 'value saldo-positivo';
    } else {
        saldoSpan.className = 'value';
    }
}

function guardarPago() {
    const monto = parseInt(document.getElementById('input-monto-pago').value) || 0;
    const tipoGenerico = document.getElementById('radio-generico').checked;
    const efectivo = document.getElementById('pago-modal-efectivo').checked;
    const digital = document.getElementById('pago-modal-digital').checked;

    if (monto === 0 && (!efectivo || !digital)) {
        alert('Debe ingresar un monto y seleccionar método de pago');
        return;
    }

    if (!efectivo && !digital) {
        alert('Debe seleccionar al menos un método de pago');
        return;
    }

    // Validaciones OK, simular guardado
    console.log('Guardando pago:', {
        monto: monto,
        tipo: tipoGenerico ? 'generico' : 'especifico',
        efectivo: efectivo,
        digital: digital
    });

    alert('✅ Pago registrado exitosamente\n(Mock - en producción se guardará en BD)');
    cerrarModalPago();
}

// Trigger abrir modal desde botón (línea 182 HTML)
// Ya tiene onclick="abrirModalPago()" en el HTML, pero por si acaso:
document.addEventListener('DOMContentLoaded', function() {
    const btnRegistrarPago = document.querySelector('[onclick*="abrirModalPago"]');
    // El evento ya está en el HTML, esto es redundante pero seguro
});

// Event listeners para recalcular saldo al cambiar monto
document.addEventListener('DOMContentLoaded', function() {
    const montoInput = document.getElementById('input-monto-pago');
    if (montoInput) {
        montoInput.addEventListener('input', function() {
            calcularSaldoResultante();
            if (document.getElementById('radio-especifico').checked) {
                validarMontoPedido();
            }
        });
    }
});

// ========================================
// DETALLE EXPANDIBLE - CUENTA CORRIENTE
// ========================================

let filaExpandidaActual = null;

function toggleDetalleMovimiento(movimientoId) {
    const filaMovimiento = document.querySelector(`tr[data-movimiento-id="${movimientoId}"]`);
    const filaDetalle = document.getElementById(`detalle-${movimientoId}`);

    if (!filaMovimiento || !filaDetalle) {
        console.error('Fila no encontrada:', movimientoId);
        return;
    }

    // Si hay otra fila expandida, cerrarla primero
    if (filaExpandidaActual && filaExpandidaActual !== movimientoId) {
        const filaAnterior = document.querySelector(`tr[data-movimiento-id="${filaExpandidaActual}"]`);
        const detalleAnterior = document.getElementById(`detalle-${filaExpandidaActual}`);

        if (filaAnterior) {
            filaAnterior.classList.remove('expanded');
        }
        if (detalleAnterior) {
            detalleAnterior.classList.add('hidden');
        }
    }

    // Toggle la fila actual
    const estaExpandida = !filaDetalle.classList.contains('hidden');

    if (estaExpandida) {
        // Cerrar
        filaMovimiento.classList.remove('expanded');
        filaDetalle.classList.add('hidden');
        filaExpandidaActual = null;
    } else {
        // Abrir
        filaMovimiento.classList.add('expanded');
        filaDetalle.classList.remove('hidden');
        filaExpandidaActual = movimientoId;
    }
}

/* SIDEBAR AUTO-COLLAPSE BEHAVIOR */
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

// ========================================
// DESCUENTO CLIENTE - TOGGLE BUTTONS
// ========================================

function selectDescuento(btn) {
    // Remover active de todos los botones del grupo
    const grupo = btn.closest('.btn-group-toggle');
    grupo.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));

    // Agregar active al botón clickeado
    btn.classList.add('active');

    // Actualizar el badge en el header
    const value = btn.getAttribute('data-value');
    const badgeDescuento = document.querySelector('.badge-discount');

    if (badgeDescuento) {
        switch (value) {
            case 'none':
                badgeDescuento.innerHTML = '<i class="fas fa-tag"></i> Sin desc.';
                break;
            case 'l2':
                badgeDescuento.innerHTML = '<i class="fas fa-tag"></i> 6.25%';
                break;
            case 'l3':
                badgeDescuento.innerHTML = '<i class="fas fa-tag"></i> 10%';
                break;
        }
    }

    console.log('Descuento seleccionado:', value);
}

// ========================================
// MODAL NUEVO CLIENTE
// ========================================

function abrirModalNuevoCliente() {
    document.getElementById('modal-nuevo-cliente').classList.remove('hidden');
    // Reset form
    resetFormNuevoCliente();
    // Focus en primer campo
    setTimeout(() => {
        document.getElementById('nc-direccion').focus();
    }, 100);
}

function cerrarModalNuevoCliente() {
    document.getElementById('modal-nuevo-cliente').classList.add('hidden');
    resetFormNuevoCliente();
}

function resetFormNuevoCliente() {
    document.getElementById('nc-direccion').value = '';
    document.getElementById('nc-telefono').value = '';
    document.getElementById('nc-ciudad').value = '';
    document.getElementById('nc-nombre').value = '';
    document.getElementById('nc-email').value = '';
    document.getElementById('nc-nota').value = '';
    document.getElementById('nc-activo').checked = true;

    // Reset descuento a "Sin desc."
    const btnGroup = document.querySelector('#modal-nuevo-cliente .btn-group-toggle');
    if (btnGroup) {
        btnGroup.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
        btnGroup.querySelector('[data-value="none"]').classList.add('active');
    }
}

function selectDescuentoNuevo(btn) {
    const grupo = btn.closest('.btn-group-toggle');
    grupo.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function crearNuevoCliente() {
    // Obtener valores
    const direccion = document.getElementById('nc-direccion').value.trim();
    const telefono = document.getElementById('nc-telefono').value.trim();
    const ciudad = document.getElementById('nc-ciudad').value;
    const nombre = document.getElementById('nc-nombre').value.trim();
    const email = document.getElementById('nc-email').value.trim();
    const nota = document.getElementById('nc-nota').value.trim();
    const activo = document.getElementById('nc-activo').checked;

    // Obtener descuento seleccionado
    const btnActivo = document.querySelector('#modal-nuevo-cliente .btn-toggle.active');
    const descuento = btnActivo ? btnActivo.getAttribute('data-value') : 'none';

    // Validar campos requeridos
    if (!direccion) {
        alert('⚠️ La dirección es obligatoria');
        document.getElementById('nc-direccion').focus();
        return;
    }

    if (!telefono) {
        alert('⚠️ El teléfono es obligatorio');
        document.getElementById('nc-telefono').focus();
        return;
    }

    if (!ciudad) {
        alert('⚠️ Debe seleccionar una ciudad');
        document.getElementById('nc-ciudad').focus();
        return;
    }

    // Crear objeto cliente (mock)
    const nuevoCliente = {
        id: Date.now(),
        direccion: direccion.toUpperCase(),
        telefono,
        ciudad,
        nombre,
        email,
        nota,
        activo,
        descuento,
        saldo: 0,
        fechaCreacion: new Date().toISOString()
    };

    console.log('✅ Nuevo cliente creado:', nuevoCliente);

    // Simular guardado
    alert(`✅ Cliente creado exitosamente\n\nDirección: ${nuevoCliente.direccion}\nCiudad: ${ciudad}\nDescuento: ${descuento === 'none' ? 'Sin descuento' : descuento.toUpperCase()}`);

    cerrarModalNuevoCliente();

    // En producción: recargar tabla o agregar fila
}

// Cerrar modal con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modalNuevoCliente = document.getElementById('modal-nuevo-cliente');
        if (modalNuevoCliente && !modalNuevoCliente.classList.contains('hidden')) {
            cerrarModalNuevoCliente();
        }
    }
});

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    const modalNuevoCliente = document.getElementById('modal-nuevo-cliente');
    if (e.target === modalNuevoCliente) {
        cerrarModalNuevoCliente();
    }
});

console.log('✅ Clientes V2 - Script cargado correctamente');
