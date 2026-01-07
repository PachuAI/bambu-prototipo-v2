// ============================================================================
// DASHBOARD V2 - Script Principal
// PRD: Dashboard con calendario semanal, repartos mañana y stock crítico
// Migrado a BambuState (Fase 4)
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar state manager
    BambuState.init();
    console.log("Dashboard V2 Loaded (usando BambuState)");

    // ========================================================================
    // CONFIGURACIÓN: Fecha desde BambuState
    // ========================================================================
    const HOY = new Date(BambuState.FECHA_SISTEMA);
    const VEHICULOS = BambuState.getVehiculos();
    const PRODUCTOS = BambuState.get('productos');
    const CLIENTES = BambuState.get('clientes');
    const PEDIDOS = BambuState.get('pedidos');
    const CAPACIDAD_TOTAL_FLOTA = VEHICULOS.reduce((sum, v) => sum + v.capacidadKg, 0);

    // Helper: obtener peso de un pedido (calculado desde items)
    const getPesoPedido = (pedido) => BambuState.calcularPesoPedido(pedido.id);

    // ========================================================================
    // 1. CALENDARIO SEMANAL
    // PRD: Click en día → navega a repartos-dia.html
    // Muestra: pedidos, kilos, porcentaje de carga
    // Highlight: día actual (HOY)
    // ========================================================================

    function initCalendario() {
        const daysRow = document.getElementById('days-row');
        const mesLabel = document.getElementById('calendario-mes');

        // Obtener lunes de la semana actual
        const lunes = getLunesDeSemana(HOY);

        // Actualizar label del mes
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        mesLabel.textContent = `${meses[lunes.getMonth()]} ${lunes.getFullYear()}`;

        // Generar 5 días (lunes a viernes)
        daysRow.innerHTML = '';
        const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];

        for (let i = 0; i < 5; i++) {
            const fecha = new Date(lunes);
            fecha.setDate(lunes.getDate() + i);

            const fechaStr = formatFechaISO(fecha);
            const pedidosDia = BambuState.getPedidosByFecha(fechaStr);

            // Calcular métricas del día
            const totalPedidos = pedidosDia.filter(p => p.tipo === 'reparto').length;
            const totalKg = pedidosDia.reduce((sum, p) => sum + getPesoPedido(p), 0);
            const pctCarga = Math.round((totalKg / CAPACIDAD_TOTAL_FLOTA) * 100);

            // Determinar si es HOY
            const esHoy = fecha.toDateString() === HOY.toDateString();

            const card = document.createElement('div');
            card.className = `day-card-v2${esHoy ? ' today' : ''}`;
            card.dataset.fecha = fechaStr;
            card.innerHTML = `
                <span class="day-label">${diasSemana[i]}</span>
                <span class="day-number-big">${fecha.getDate()}</span>
                <span class="metric-pill">${totalPedidos} PEDIDOS</span>
                <span class="metric-pill">${Math.round(totalKg)}kg • ${pctCarga}%</span>
            `;

            // Click → navegar a repartos-dia.html
            card.addEventListener('click', () => {
                window.location.href = `repartos-dia.html?fecha=${fechaStr}`;
            });

            daysRow.appendChild(card);
        }
    }

    // ========================================================================
    // 2. REPARTOS PROGRAMADOS PARA MAÑANA
    // PRD: 4 columnas - Ciudades + 3 vehículos
    // ========================================================================

    function initRepartosManana() {
        const manana = new Date(HOY);
        manana.setDate(HOY.getDate() + 1);
        const fechaMananaStr = formatFechaISO(manana);

        // Actualizar header
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        document.getElementById('fecha-manana').textContent =
            `${diasSemana[manana.getDay()]} ${manana.getDate()} ${meses[manana.getMonth()]}`;

        // Obtener pedidos de mañana (solo repartos)
        const pedidosManana = BambuState.getPedidosByFecha(fechaMananaStr).filter(p => p.tipo === 'reparto');

        // Calcular totales
        const totalKg = pedidosManana.reduce((sum, p) => sum + getPesoPedido(p), 0);
        const pct = Math.round((totalKg / CAPACIDAD_TOTAL_FLOTA) * 100);

        document.getElementById('capacidad-total').textContent = `${Math.round(totalKg)}kg / ${CAPACIDAD_TOTAL_FLOTA}kg`;
        document.getElementById('capacidad-pct').textContent = `${pct}%`;
        document.getElementById('pedidos-total').textContent = `${pedidosManana.length} pedidos`;

        // Agrupar por ciudad
        const ciudadesMap = {};
        pedidosManana.forEach(p => {
            if (!ciudadesMap[p.ciudad]) {
                ciudadesMap[p.ciudad] = { pedidos: 0, kg: 0 };
            }
            ciudadesMap[p.ciudad].pedidos++;
            ciudadesMap[p.ciudad].kg += getPesoPedido(p);
        });

        // Agrupar por vehículo
        const vehiculosMap = {};
        VEHICULOS.forEach(v => {
            vehiculosMap[v.nombre] = {
                pedidos: [],
                kg: 0,
                capacidad: v.capacidadKg,
                modelo: v.modelo || ''
            };
        });

        pedidosManana.forEach(p => {
            if (p.vehiculo && vehiculosMap[p.vehiculo]) {
                vehiculosMap[p.vehiculo].pedidos.push(p);
                vehiculosMap[p.vehiculo].kg += getPesoPedido(p);
            }
        });

        // Renderizar grid
        const grid = document.getElementById('repartos-grid');
        grid.innerHTML = '';

        // Columna 1: Pedidos sin asignar (mañana)
        const sinAsignarCol = document.createElement('div');
        sinAsignarCol.className = 'reparto-col col-sin-asignar';

        const pedidosSinAsignar = pedidosManana.filter(p => !p.vehiculo);
        const totalSinAsignar = pedidosSinAsignar.length;
        const kgSinAsignar = pedidosSinAsignar.reduce((sum, p) => sum + getPesoPedido(p), 0);

        sinAsignarCol.innerHTML = `
            <div class="reparto-col-header">
                <span class="reparto-col-title">Sin asignar</span>
                <span class="reparto-col-pct">${totalSinAsignar}</span>
            </div>
            <div class="reparto-col-subtitle">${Math.round(kgSinAsignar)}kg pendientes</div>
            ${totalSinAsignar > 0 ? `
                <div class="sin-asignar-col-list">
                    ${pedidosSinAsignar.slice(0, 4).map(p => `
                        <div class="ciudad-item">
                            <span class="ciudad-nombre">${p.direccion.substring(0, 18)}${p.direccion.length > 18 ? '...' : ''}</span>
                            <span class="ciudad-meta">${Math.round(getPesoPedido(p))}kg</span>
                        </div>
                    `).join('')}
                </div>
                ${totalSinAsignar > 4 ? `<div class="ciudades-resumen">+${totalSinAsignar - 4} más</div>` : ''}
            ` : `
                <div class="widget-empty" style="padding: 8px 0;">
                    <i class="fas fa-check-circle" style="font-size: 16px;"></i>
                    Todos asignados
                </div>
            `}
        `;
        grid.appendChild(sinAsignarCol);

        // Columnas 2-4: Vehículos
        VEHICULOS.forEach(vehiculo => {
            const data = vehiculosMap[vehiculo.nombre];
            const pctVeh = Math.round((data.kg / data.capacidad) * 100);
            const progressClass = pctVeh > 85 ? 'high' : pctVeh > 50 ? 'medium' : 'low';

            // Ciudades de este vehículo
            const ciudadesVeh = {};
            data.pedidos.forEach(p => {
                if (!ciudadesVeh[p.ciudad]) ciudadesVeh[p.ciudad] = { pedidos: 0, kg: 0 };
                ciudadesVeh[p.ciudad].pedidos++;
                ciudadesVeh[p.ciudad].kg += getPesoPedido(p);
            });

            const col = document.createElement('div');
            col.className = 'reparto-col';
            col.innerHTML = `
                <div class="reparto-col-header">
                    <span class="reparto-col-title">${vehiculo.nombre}</span>
                    <span class="reparto-col-pct">${pctVeh}%</span>
                </div>
                <div class="reparto-col-subtitle">${Math.round(data.kg)}kg / ${data.capacidad}kg</div>
                <div class="vehiculo-progress">
                    <div class="vehiculo-progress-fill ${progressClass}" style="width: ${pctVeh}%"></div>
                </div>
                <span class="reparto-pedidos-badge">${data.pedidos.length} PEDIDOS</span>
                <div class="ciudades-list">
                    ${Object.entries(ciudadesVeh).slice(0, 3).map(([ciudad, cdata]) => `
                        <div class="ciudad-item">
                            <span class="ciudad-nombre"><i class="fas fa-map-marker-alt"></i> ${ciudad}</span>
                            <span class="ciudad-meta">${cdata.pedidos}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            grid.appendChild(col);
        });
    }

    // ========================================================================
    // 3. STOCK CRÍTICO
    // Lista compacta de productos con stock bajo
    // ========================================================================

    function initStockCritico() {
        const container = document.getElementById('stock-critico-list');

        // Filtrar productos con stock bajo (< stock_minimo)
        const productosCriticos = PRODUCTOS
            .filter(p => p.disponible && p.stock_actual < p.stock_minimo)
            .sort((a, b) => a.stock_actual - b.stock_actual);

        if (productosCriticos.length === 0) {
            container.innerHTML = `
                <div class="widget-empty">
                    <i class="fas fa-check-circle"></i>
                    Stock OK - No hay productos críticos
                </div>
            `;
            return;
        }

        container.innerHTML = productosCriticos.slice(0, 5).map(p => {
            const esAgotado = p.stock_actual === 0;
            const badgeClass = esAgotado ? 'agotado' : 'bajo';
            const badgeText = esAgotado ? 'AGOTADO' : 'BAJO';

            return `
                <div class="stock-row">
                    <span class="stock-row-name">${p.nombre}</span>
                    <span class="stock-row-qty">${p.stock_actual} / ${p.stock_minimo}</span>
                    <span class="stock-row-badge ${badgeClass}">${badgeText}</span>
                </div>
            `;
        }).join('');
    }

    // ========================================================================
    // 4. CIUDADES A VISITAR MAÑANA (widget inferior)
    // Lista de todas las ciudades con pedidos para mañana
    // ========================================================================

    function initCiudadesWidget() {
        const container = document.getElementById('ciudades-widget-list');

        // Obtener fecha de mañana
        const manana = new Date(HOY);
        manana.setDate(HOY.getDate() + 1);
        const fechaMananaStr = formatFechaISO(manana);

        // Obtener pedidos de mañana y agrupar por ciudad
        const pedidosManana = BambuState.getPedidosByFecha(fechaMananaStr).filter(p => p.tipo === 'reparto');

        const ciudadesMap = {};
        pedidosManana.forEach(p => {
            if (!ciudadesMap[p.ciudad]) {
                ciudadesMap[p.ciudad] = { pedidos: 0, kg: 0 };
            }
            ciudadesMap[p.ciudad].pedidos++;
            ciudadesMap[p.ciudad].kg += getPesoPedido(p);
        });

        const ciudadesArr = Object.entries(ciudadesMap).sort((a, b) => b[1].pedidos - a[1].pedidos);

        if (ciudadesArr.length === 0) {
            container.innerHTML = `
                <div class="widget-empty">
                    <i class="fas fa-calendar-times"></i>
                    No hay repartos programados para mañana
                </div>
            `;
            return;
        }

        container.innerHTML = ciudadesArr.map(([ciudad, data]) => `
            <div class="ciudad-widget-row">
                <span class="ciudad-widget-name"><i class="fas fa-map-marker-alt"></i> ${ciudad}</span>
                <span class="ciudad-widget-stats">${data.pedidos} pedidos • ${Math.round(data.kg)}kg</span>
            </div>
        `).join('');
    }

    // ========================================================================
    // 4. BÚSQUEDA GLOBAL (mantener funcionalidad existente)
    // ========================================================================

    function initBusquedaGlobal() {
        const globalSearch = document.getElementById('global-search');
        const resultsContainer = document.getElementById('global-search-results');

        if (!globalSearch || !resultsContainer) return;

        // Shortcut Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                globalSearch.focus();
            }
        });

        // Cerrar al hacer click afuera
        document.addEventListener('click', (e) => {
            if (!globalSearch.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.classList.add('hidden');
            }
        });

        // Input handler
        globalSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length < 2) {
                resultsContainer.classList.add('hidden');
                return;
            }

            const results = buscarEnMockData(query);
            renderizarResultados(results, resultsContainer);
        });

        globalSearch.addEventListener('focus', () => {
            if (globalSearch.value.length >= 2) {
                resultsContainer.classList.remove('hidden');
            }
        });
    }

    function buscarEnMockData(query) {
        return {
            clientes: CLIENTES.filter(c =>
                c.direccion.toLowerCase().includes(query) ||
                c.ciudad.toLowerCase().includes(query)
            ).slice(0, 4),
            productos: PRODUCTOS.filter(p =>
                p.nombre.toLowerCase().includes(query)
            ).slice(0, 4),
            pedidos: PEDIDOS.filter(p =>
                p.numero.toLowerCase().includes(query) ||
                p.direccion.toLowerCase().includes(query)
            ).slice(0, 4)
        };
    }

    function renderizarResultados(results, container) {
        container.innerHTML = '';
        let hasResults = false;

        // Clientes
        if (results.clientes.length > 0) {
            hasResults = true;
            container.innerHTML += '<div class="result-category-header">Clientes</div>';
            results.clientes.forEach(c => {
                container.innerHTML += `
                    <div class="search-result-item" onclick="location.href='cliente-detalle.html?id=${c.id}'">
                        <div class="result-icon icon-client"><i class="fas fa-user"></i></div>
                        <div class="result-info">
                            <span class="result-title">${c.direccion}</span>
                            <span class="result-subtitle">${c.ciudad} • ${c.telefono}</span>
                        </div>
                    </div>
                `;
            });
        }

        // Productos
        if (results.productos.length > 0) {
            hasResults = true;
            container.innerHTML += '<div class="result-category-header">Productos</div>';
            results.productos.forEach(p => {
                const stockStatus = p.stock_actual === 0 ? 'AGOTADO' :
                                   p.stock_actual < p.stock_minimo ? 'Stock bajo' : 'Disponible';
                container.innerHTML += `
                    <div class="search-result-item" onclick="location.href='productos.html'">
                        <div class="result-icon icon-product"><i class="fas fa-box"></i></div>
                        <div class="result-info">
                            <span class="result-title">${p.nombre}</span>
                            <span class="result-subtitle">Stock: ${p.stock_actual} - ${stockStatus}</span>
                        </div>
                    </div>
                `;
            });
        }

        // Pedidos
        if (results.pedidos.length > 0) {
            hasResults = true;
            container.innerHTML += '<div class="result-category-header">Pedidos</div>';
            results.pedidos.forEach(p => {
                container.innerHTML += `
                    <div class="search-result-item" onclick="location.href='ventas.html'">
                        <div class="result-icon icon-order"><i class="fas fa-file-invoice"></i></div>
                        <div class="result-info">
                            <span class="result-title">Pedido ${p.numero}</span>
                            <span class="result-subtitle">${p.direccion} - ${p.estado}</span>
                        </div>
                    </div>
                `;
            });
        }

        if (hasResults) {
            container.classList.remove('hidden');
        } else {
            container.innerHTML = '<div style="padding:16px; text-align:center; color:#6b778c;">No se encontraron resultados</div>';
            container.classList.remove('hidden');
        }
    }

    // ========================================================================
    // HELPERS
    // ========================================================================

    function getLunesDeSemana(fecha) {
        const d = new Date(fecha);
        const dia = d.getDay();
        const diff = dia === 0 ? -6 : 1 - dia; // Si es domingo, ir al lunes anterior
        d.setDate(d.getDate() + diff);
        return d;
    }

    function formatFechaISO(fecha) {
        const y = fecha.getFullYear();
        const m = String(fecha.getMonth() + 1).padStart(2, '0');
        const d = String(fecha.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // ========================================================================
    // INIT
    // ========================================================================

    initCalendario();
    initRepartosManana();
    initStockCritico();
    initCiudadesWidget();
    initBusquedaGlobal();
});
