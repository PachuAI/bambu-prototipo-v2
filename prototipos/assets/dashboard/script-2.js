// ============================================================================
// DASHBOARD V2 - PROPUESTA 2: Sin carditis
// Script para diseño unificado tipo tabla
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard V2 - Propuesta 2 Loaded");

    // ========================================================================
    // CONFIGURACIÓN: Fecha simulada (miércoles 8 enero 2026)
    // ========================================================================
    const HOY = new Date(2026, 0, 8);
    const CAPACIDAD_TOTAL_FLOTA = VEHICULOS.reduce((sum, v) => sum + v.capacidadKg, 0);

    // ========================================================================
    // 1. CALENDARIO (fila de días)
    // ========================================================================

    function initCalendario() {
        const container = document.getElementById('calendario-row');
        const mesLabel = document.getElementById('calendario-mes');

        const lunes = getLunesDeSemana(HOY);

        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        mesLabel.textContent = `${meses[lunes.getMonth()]} ${lunes.getFullYear()}`;

        container.innerHTML = '';
        const diasSemana = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'];

        for (let i = 0; i < 5; i++) {
            const fecha = new Date(lunes);
            fecha.setDate(lunes.getDate() + i);

            const fechaStr = formatFechaISO(fecha);
            const pedidosDia = getPedidosByFecha(fechaStr);

            const totalPedidos = pedidosDia.filter(p => p.tipo === 'reparto').length;
            const totalKg = pedidosDia.reduce((sum, p) => sum + (p.peso || 0), 0);
            const pctCarga = Math.round((totalKg / CAPACIDAD_TOTAL_FLOTA) * 100);

            const esHoy = fecha.toDateString() === HOY.toDateString();

            const cell = document.createElement('div');
            cell.className = `dia-cell${esHoy ? ' today' : ''}`;
            cell.innerHTML = `
                <div class="dia-label">${diasSemana[i]}</div>
                <div class="dia-numero">${fecha.getDate()}</div>
                <div class="dia-stats">
                    <div class="dia-stat"><i class="fas fa-box"></i> ${totalPedidos} ped</div>
                    <div class="dia-stat"><i class="fas fa-weight-hanging"></i> ${Math.round(totalKg)}kg • ${pctCarga}%</div>
                </div>
            `;

            cell.addEventListener('click', () => {
                window.location.href = `repartos-dia.html?fecha=${fechaStr}`;
            });

            container.appendChild(cell);
        }
    }

    // ========================================================================
    // 2. REPARTOS MAÑANA (4 columnas)
    // ========================================================================

    function initRepartosManana() {
        const manana = new Date(HOY);
        manana.setDate(HOY.getDate() + 1);
        const fechaMananaStr = formatFechaISO(manana);

        // Header
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        document.getElementById('fecha-manana').textContent =
            `${diasSemana[manana.getDay()]} ${manana.getDate()} ${meses[manana.getMonth()]}`;

        const pedidosManana = getPedidosByFecha(fechaMananaStr).filter(p => p.tipo === 'reparto');

        // Stats
        const totalKg = pedidosManana.reduce((sum, p) => sum + (p.peso || 0), 0);
        const pct = Math.round((totalKg / CAPACIDAD_TOTAL_FLOTA) * 100);

        document.getElementById('capacidad-total').textContent = `${Math.round(totalKg)}kg / ${CAPACIDAD_TOTAL_FLOTA}kg`;
        document.getElementById('capacidad-pct').textContent = `${pct}%`;
        document.getElementById('pedidos-total').textContent = `${pedidosManana.length} pedidos`;

        // Agrupar por vehículo
        const vehiculosMap = {};
        VEHICULOS.forEach(v => {
            vehiculosMap[v.nombre] = { pedidos: [], kg: 0, capacidad: v.capacidadKg };
        });

        pedidosManana.forEach(p => {
            if (p.vehiculo && vehiculosMap[p.vehiculo]) {
                vehiculosMap[p.vehiculo].pedidos.push(p);
                vehiculosMap[p.vehiculo].kg += p.peso || 0;
            }
        });

        // Renderizar
        const container = document.getElementById('repartos-row');
        container.innerHTML = '';

        // Col 1: Sin asignar
        const sinAsignar = pedidosManana.filter(p => !p.vehiculo);
        const kgSinAsignar = sinAsignar.reduce((sum, p) => sum + (p.peso || 0), 0);

        const sinAsignarCell = document.createElement('div');
        sinAsignarCell.className = 'reparto-cell';
        sinAsignarCell.innerHTML = `
            <div class="reparto-cell-header">
                <span class="reparto-cell-title">Sin asignar</span>
                <span class="reparto-cell-pct">${sinAsignar.length}</span>
            </div>
            <div class="reparto-cell-subtitle">${Math.round(kgSinAsignar)}kg pendientes</div>
            ${sinAsignar.length > 0 ? `
                <div class="items-list">
                    ${sinAsignar.slice(0, 4).map(p => `
                        <div class="item-row">
                            <span class="item-name">${p.cliente.substring(0, 16)}${p.cliente.length > 16 ? '...' : ''}</span>
                            <span class="item-meta">${p.peso}kg</span>
                        </div>
                    `).join('')}
                </div>
                ${sinAsignar.length > 4 ? `<div class="items-more">+${sinAsignar.length - 4} más</div>` : ''}
            ` : `
                <div class="cell-empty">
                    <i class="fas fa-check-circle"></i>
                    Todos asignados
                </div>
            `}
        `;
        container.appendChild(sinAsignarCell);

        // Cols 2-4: Vehículos
        VEHICULOS.forEach(vehiculo => {
            const data = vehiculosMap[vehiculo.nombre];
            const pctVeh = Math.round((data.kg / data.capacidad) * 100);
            const progressClass = pctVeh > 85 ? 'high' : pctVeh > 50 ? 'medium' : 'low';

            // Ciudades de este vehículo
            const ciudadesVeh = {};
            data.pedidos.forEach(p => {
                if (!ciudadesVeh[p.ciudad]) ciudadesVeh[p.ciudad] = 0;
                ciudadesVeh[p.ciudad]++;
            });

            const cell = document.createElement('div');
            cell.className = 'reparto-cell';
            cell.innerHTML = `
                <div class="reparto-cell-header">
                    <span class="reparto-cell-title">${vehiculo.nombre}</span>
                    <span class="reparto-cell-pct">${pctVeh}%</span>
                </div>
                <div class="reparto-cell-subtitle">${Math.round(data.kg)}kg / ${data.capacidad}kg</div>
                <div class="progress-bar">
                    <div class="progress-fill ${progressClass}" style="width: ${pctVeh}%"></div>
                </div>
                <span class="pedidos-badge">${data.pedidos.length} PEDIDOS</span>
                <div class="items-list">
                    ${Object.entries(ciudadesVeh).slice(0, 3).map(([ciudad, count]) => `
                        <div class="item-row">
                            <span class="item-name"><i class="fas fa-map-marker-alt"></i> ${ciudad}</span>
                            <span class="item-meta">${count}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(cell);
        });
    }

    // ========================================================================
    // 3. STOCK CRÍTICO
    // ========================================================================

    function initStockCritico() {
        const container = document.getElementById('stock-critico-list');

        const productosCriticos = PRODUCTOS
            .filter(p => p.disponible && p.stock_actual < p.stock_minimo)
            .sort((a, b) => a.stock_actual - b.stock_actual);

        if (productosCriticos.length === 0) {
            container.innerHTML = `<div class="cell-empty"><i class="fas fa-check-circle"></i>Stock OK</div>`;
            return;
        }

        container.innerHTML = productosCriticos.slice(0, 6).map(p => {
            const esAgotado = p.stock_actual === 0;
            return `
                <div class="data-row">
                    <span class="data-name">${p.nombre}</span>
                    <span class="data-value">${p.stock_actual} / ${p.stock_minimo}</span>
                    <span class="data-badge ${esAgotado ? 'agotado' : 'bajo'}">${esAgotado ? 'AGOTADO' : 'BAJO'}</span>
                </div>
            `;
        }).join('');
    }

    // ========================================================================
    // 4. CIUDADES MAÑANA
    // ========================================================================

    function initCiudades() {
        const container = document.getElementById('ciudades-list');

        const manana = new Date(HOY);
        manana.setDate(HOY.getDate() + 1);
        const fechaMananaStr = formatFechaISO(manana);

        const pedidosManana = getPedidosByFecha(fechaMananaStr).filter(p => p.tipo === 'reparto');

        const ciudadesMap = {};
        pedidosManana.forEach(p => {
            if (!ciudadesMap[p.ciudad]) ciudadesMap[p.ciudad] = { pedidos: 0, kg: 0 };
            ciudadesMap[p.ciudad].pedidos++;
            ciudadesMap[p.ciudad].kg += p.peso || 0;
        });

        const ciudadesArr = Object.entries(ciudadesMap).sort((a, b) => b[1].pedidos - a[1].pedidos);

        if (ciudadesArr.length === 0) {
            container.innerHTML = `<div class="cell-empty"><i class="fas fa-calendar-times"></i>Sin repartos</div>`;
            return;
        }

        container.innerHTML = ciudadesArr.map(([ciudad, data]) => `
            <div class="data-row">
                <span class="data-name"><i class="fas fa-map-marker-alt"></i> ${ciudad}</span>
                <span class="data-value">${data.pedidos} ped • ${Math.round(data.kg)}kg</span>
            </div>
        `).join('');
    }

    // ========================================================================
    // HELPERS
    // ========================================================================

    function getLunesDeSemana(fecha) {
        const d = new Date(fecha);
        const dia = d.getDay();
        const diff = dia === 0 ? -6 : 1 - dia;
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
    initCiudades();
});
