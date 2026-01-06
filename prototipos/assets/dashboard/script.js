document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard V2 Loaded");

    // DATA SIMULATION FOR SEARCH
    const SEARCH_DB = {
        clientes: [
            { id: 1, name: "Araucarias 371", detail: "Cipolletti • 299-4567890", type: "client" },
            { id: 2, name: "9 de Julio 902", detail: "Cipolletti • 299-5123456", type: "client" },
            { id: 3, name: "San Luis 372", detail: "Neuquén • 299-6789012", type: "client" },
            { id: 4, name: "Supermercado La Anónima", detail: "Neuquén • 299-1112222", type: "client" }
        ],
        productos: [
            { id: 101, name: "Botella PET Cristal 1L", detail: "Stock: 0 - AGOTADO", type: "product" },
            { id: 102, name: "Bolsas Consorcio 50x70", detail: "Stock: 156 - Disponible", type: "product" },
            { id: 103, name: "Lavandina 5L", detail: "Stock: 40 - Bajo", type: "product" },
            { id: 104, name: "Pack Limpieza Full", detail: "Combo Oferta", type: "product" }
        ],
        pedidos: [
            { id: 1204, name: "Pedido #1204", detail: "Ingeniero Huergo - Listo", type: "order" },
            { id: 1205, name: "Pedido #1205", detail: "Choele Choel - Listo", type: "order" },
            { id: 1210, name: "Pedido #1210", detail: "Neuquén - En proceso", type: "order" }
        ]
    };

    // Global Search Interactions
    const globalSearch = document.getElementById('global-search');
    const resultsContainer = document.getElementById('global-search-results');

    // Shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            globalSearch.focus();
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!globalSearch.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.add('hidden');
        }
    });

    // Input Logic
    globalSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            resultsContainer.classList.add('hidden');
            return;
        }

        const stats = searchInDB(query);
        renderResults(stats);
    });

    globalSearch.addEventListener('focus', () => {
        if (globalSearch.value.length >= 2) {
            resultsContainer.classList.remove('hidden');
        }
    });

    function searchInDB(query) {
        const results = {
            clientes: SEARCH_DB.clientes.filter(c => c.name.toLowerCase().includes(query) || c.detail.toLowerCase().includes(query)),
            productos: SEARCH_DB.productos.filter(p => p.name.toLowerCase().includes(query) || p.detail.toLowerCase().includes(query)),
            pedidos: SEARCH_DB.pedidos.filter(o => o.name.toLowerCase().includes(query) || o.detail.toLowerCase().includes(query))
        };
        return results;
    }

    function renderResults(results) {
        resultsContainer.innerHTML = '';
        let hasResults = false;

        // Render Clients
        if (results.clientes.length > 0) {
            hasResults = true;
            appendCategoryHeader('Clientes');
            results.clientes.forEach(item => appendResultItem(item, 'fas fa-user', 'icon-client', 'clientes.html'));
        }

        // Render Products
        if (results.productos.length > 0) {
            hasResults = true;
            appendCategoryHeader('Productos');
            results.productos.forEach(item => appendResultItem(item, 'fas fa-box', 'icon-product', '#'));
        }

        // Render Orders
        if (results.pedidos.length > 0) {
            hasResults = true;
            appendCategoryHeader('Pedidos');
            results.pedidos.forEach(item => appendResultItem(item, 'fas fa-file-invoice', 'icon-order', '#'));
        }

        if (hasResults) {
            resultsContainer.classList.remove('hidden');
        } else {
            resultsContainer.innerHTML = '<div style="padding:16px; text-align:center; color:#6b778c;">No se encontraron resultados</div>';
            resultsContainer.classList.remove('hidden');
        }
    }

    function appendCategoryHeader(title) {
        const header = document.createElement('div');
        header.className = 'result-category-header';
        header.textContent = title;
        resultsContainer.appendChild(header);
    }

    function appendResultItem(item, iconClass, colorClass, link) {
        const el = document.createElement('div');
        el.className = 'search-result-item';
        el.onclick = () => window.location.href = link;

        el.innerHTML = `
            <div class="result-icon ${colorClass}">
                <i class="${iconClass}"></i>
            </div>
            <div class="result-info">
                <span class="result-title">${item.name}</span>
                <span class="result-subtitle">${item.detail}</span>
            </div>
        `;
        resultsContainer.appendChild(el);
    }

    // Day Card Interaction (Visual only)
    const dayCards = document.querySelectorAll('.day-card-v2');
    dayCards.forEach(card => {
        card.addEventListener('click', () => {
            dayCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // Sidebar Auto-Collapse Behavior
    setupSidebarAutoCollapse();
});

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
