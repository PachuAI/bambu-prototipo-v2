/**
 * STATE MANAGER - Bambu CRM V2 Prototipo
 *
 * Sistema centralizado de estado con persistencia localStorage.
 * Fuente única de verdad para todos los módulos.
 *
 * USO:
 *   <script src="shared/state-manager.js"></script>
 *   BambuState.init();
 *   const pedidos = BambuState.get('pedidos');
 *
 * PLAN: docs/PLAN-STATE-MANAGER.md
 */

const BambuState = {
    // ========================================================================
    // CONFIGURACIÓN
    // ========================================================================

    VERSION: '1.2.0',  // Actualizado: Edición Post-Entrega + Ajustes CC (PRD 7.2, 10.1)
    FECHA_SISTEMA: '2026-01-08',  // Miércoles 8 enero 2026 (HOY simulado)
    STORAGE_KEY: 'bambu_crm_state',

    // ========================================================================
    // ESTADO INTERNO
    // ========================================================================

    _state: null,
    _initialized: false,

    // ========================================================================
    // INICIALIZACIÓN
    // ========================================================================

    /**
     * Inicializa el estado.
     * - Si hay datos en localStorage y versión compatible: los carga
     * - Si no: genera datos frescos
     *
     * Llamar al inicio de cada página:
     *   document.addEventListener('DOMContentLoaded', () => BambuState.init());
     */
    init() {
        if (this._initialized) {
            console.log('[BambuState] Ya inicializado');
            return;
        }

        const saved = localStorage.getItem(this.STORAGE_KEY);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                if (parsed.version === this.VERSION) {
                    this._state = parsed.data;
                    this._initialized = true;
                    console.log('[BambuState] Estado cargado desde localStorage');
                    console.log(`[BambuState] ${this._state.pedidos?.length || 0} pedidos, ${this._state.clientes?.length || 0} clientes`);
                    this._validarEstado();
                    return;
                } else {
                    console.warn(`[BambuState] Versión incompatible (${parsed.version} vs ${this.VERSION}), regenerando...`);
                }
            } catch (e) {
                console.warn('[BambuState] Error parseando estado guardado:', e);
            }
        }

        // Generar datos frescos
        this._state = this._generarDatosIniciales();
        this._initialized = true;
        this.save();
        console.log('[BambuState] Datos frescos generados');
        console.log(`[BambuState] ${this._state.pedidos?.length || 0} pedidos, ${this._state.clientes?.length || 0} clientes`);
    },

    // ========================================================================
    // GETTERS BÁSICOS
    // ========================================================================

    /**
     * Obtiene todos los registros de una entidad
     * @param {string} entidad - 'pedidos', 'clientes', 'productos', 'vehiculos', etc.
     * @returns {Array}
     */
    get(entidad) {
        this._checkInit();
        return this._state[entidad] || [];
    },

    /**
     * Obtiene un registro por ID
     * @param {string} entidad
     * @param {number} id
     * @returns {Object|null}
     */
    getById(entidad, id) {
        this._checkInit();
        const items = this._state[entidad] || [];
        return items.find(item => item.id === id) || null;
    },

    /**
     * Obtiene la fecha del sistema (HOY simulado)
     * @returns {string} Formato 'YYYY-MM-DD'
     */
    getFechaSistema() {
        return this.FECHA_SISTEMA;
    },

    /**
     * Obtiene la semana actual (lunes a viernes)
     * @returns {Array<string>} ['2026-01-06', '2026-01-07', ...]
     */
    getSemanaActual() {
        // HOY = Miércoles 8 enero 2026
        // Semana: Lunes 6 - Viernes 10
        return [
            '2026-01-06', // Lunes
            '2026-01-07', // Martes
            '2026-01-08', // Miércoles (HOY)
            '2026-01-09', // Jueves
            '2026-01-10'  // Viernes
        ];
    },

    // ========================================================================
    // GETTERS ESPECÍFICOS - PEDIDOS
    // ========================================================================

    /**
     * Obtiene pedidos filtrados
     * @param {Object} filtros - { estado: 'entregado' | ['pendiente', 'asignado'], fecha: '2026-01-08', cliente_id: 1 }
     * @returns {Array}
     */
    getPedidos(filtros = {}) {
        this._checkInit();
        let pedidos = [...this._state.pedidos];

        if (filtros.estado) {
            const estados = Array.isArray(filtros.estado) ? filtros.estado : [filtros.estado];
            pedidos = pedidos.filter(p => estados.includes(p.estado));
        }

        if (filtros.fecha) {
            pedidos = pedidos.filter(p => p.fecha === filtros.fecha);
        }

        if (filtros.cliente_id) {
            pedidos = pedidos.filter(p => p.cliente_id === filtros.cliente_id);
        }

        if (filtros.vehiculo_id) {
            pedidos = pedidos.filter(p => p.vehiculo_id === filtros.vehiculo_id);
        }

        if (filtros.tipo) {
            pedidos = pedidos.filter(p => p.tipo === filtros.tipo);
        }

        return pedidos;
    },

    /**
     * Obtiene pedidos de una fecha específica
     * @param {string} fecha - 'YYYY-MM-DD'
     * @returns {Array}
     */
    getPedidosByFecha(fecha) {
        return this.getPedidos({ fecha });
    },

    /**
     * Obtiene pedidos de un cliente específico
     * @param {number} clienteId
     * @returns {Array}
     */
    getPedidosByCliente(clienteId) {
        return this.getPedidos({ cliente_id: clienteId });
    },

    /**
     * Obtiene items de un pedido
     * @param {number} pedidoId
     * @returns {Array}
     */
    getItemsPedido(pedidoId) {
        this._checkInit();
        return this._state.pedido_items.filter(i => i.pedido_id === pedidoId);
    },

    // ========================================================================
    // CÁLCULOS DERIVADOS
    // ========================================================================

    /**
     * Calcula el peso total de un pedido
     * @param {number} pedidoId
     * @returns {number} Peso en kg
     */
    calcularPesoPedido(pedidoId) {
        const items = this.getItemsPedido(pedidoId);
        return items.reduce((sum, item) => {
            const producto = this.getById('productos', item.producto_id);
            if (!producto) return sum;
            return sum + (producto.peso_kg * item.cantidad);
        }, 0);
    },

    /**
     * Calcula el total de un pedido
     * @param {number} pedidoId
     * @returns {number} Total en pesos
     */
    calcularTotalPedido(pedidoId) {
        const items = this.getItemsPedido(pedidoId);
        return items.reduce((sum, item) => {
            return sum + (item.precio_unitario * item.cantidad);
        }, 0);
    },

    /**
     * Cuenta items de un pedido
     * @param {number} pedidoId
     * @returns {number}
     */
    contarItemsPedido(pedidoId) {
        return this.getItemsPedido(pedidoId).length;
    },

    /**
     * Calcula la carga actual de un vehículo en una fecha
     * @param {number} vehiculoId
     * @param {string} fecha - 'YYYY-MM-DD'
     * @returns {Object} { pesoKg, pedidos, porcentaje }
     */
    calcularCargaVehiculo(vehiculoId, fecha) {
        const vehiculo = this.getById('vehiculos', vehiculoId);
        if (!vehiculo) return { pesoKg: 0, pedidos: 0, porcentaje: 0 };

        const pedidos = this.getPedidos({ vehiculo_id: vehiculoId, fecha });
        const pesoKg = pedidos.reduce((sum, p) => sum + this.calcularPesoPedido(p.id), 0);
        const porcentaje = Math.round((pesoKg / vehiculo.capacidadKg) * 100);

        return {
            pesoKg: Math.round(pesoKg * 10) / 10,
            pedidos: pedidos.length,
            porcentaje: Math.min(porcentaje, 100)
        };
    },

    // ========================================================================
    // GETTERS ESPECÍFICOS - CLIENTES
    // ========================================================================

    /**
     * Obtiene clientes filtrados
     * @param {Object} filtros - { estado: 'activo', ciudad: 'Neuquén' }
     * @returns {Array}
     */
    getClientes(filtros = {}) {
        this._checkInit();
        let clientes = [...this._state.clientes];

        if (filtros.estado) {
            clientes = clientes.filter(c => c.estado === filtros.estado);
        }

        if (filtros.ciudad) {
            clientes = clientes.filter(c => c.ciudad === filtros.ciudad);
        }

        return clientes;
    },

    /**
     * Busca cliente por dirección (útil para migración de datos legacy)
     * @param {string} direccion
     * @returns {Object|null}
     */
    getClienteByDireccion(direccion) {
        this._checkInit();
        return this._state.clientes.find(c =>
            c.direccion.toLowerCase() === direccion.toLowerCase()
        ) || null;
    },

    // ========================================================================
    // GETTERS ESPECÍFICOS - PRODUCTOS
    // ========================================================================

    /**
     * Obtiene productos filtrados
     * @param {Object} filtros - { disponible: true, en_promocion: true }
     * @returns {Array}
     */
    getProductos(filtros = {}) {
        this._checkInit();
        let productos = [...this._state.productos];

        if (typeof filtros.disponible === 'boolean') {
            productos = productos.filter(p => p.disponible === filtros.disponible);
        }

        if (typeof filtros.en_promocion === 'boolean') {
            productos = productos.filter(p => p.en_promocion === filtros.en_promocion);
        }

        return productos;
    },

    // ========================================================================
    // GETTERS ESPECÍFICOS - VEHÍCULOS
    // ========================================================================

    /**
     * Obtiene todos los vehículos
     * @returns {Array}
     */
    getVehiculos() {
        return this.get('vehiculos');
    },

    // ========================================================================
    // PERSISTENCIA
    // ========================================================================

    /**
     * Guarda el estado actual en localStorage
     */
    save() {
        const payload = {
            version: this.VERSION,
            savedAt: new Date().toISOString(),
            data: this._state
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
            console.log('[BambuState] Estado guardado');
        } catch (e) {
            console.error('[BambuState] Error guardando estado:', e);
            if (e.name === 'QuotaExceededError') {
                console.warn('[BambuState] localStorage lleno, limpiando datos antiguos...');
            }
        }
    },

    /**
     * Resetea a datos frescos (borra localStorage y regenera)
     */
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        this._state = this._generarDatosIniciales();
        this.save();
        console.log('[BambuState] Estado reseteado a datos frescos');
    },

    /**
     * Exporta el estado como JSON (para backup)
     * @returns {string}
     */
    exportar() {
        return JSON.stringify({
            version: this.VERSION,
            exportedAt: new Date().toISOString(),
            data: this._state
        }, null, 2);
    },

    /**
     * Importa estado desde JSON
     * @param {string} jsonStr
     * @returns {boolean} true si éxito
     */
    importar(jsonStr) {
        try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.version !== this.VERSION) {
                console.error('[BambuState] Versión incompatible');
                return false;
            }
            this._state = parsed.data;
            this.save();
            console.log('[BambuState] Estado importado correctamente');
            return true;
        } catch (e) {
            console.error('[BambuState] Error importando:', e);
            return false;
        }
    },

    // ========================================================================
    // MÉTODOS INTERNOS
    // ========================================================================

    _checkInit() {
        if (!this._initialized) {
            console.warn('[BambuState] No inicializado, llamando init()...');
            this.init();
        }
    },

    /**
     * Genera datos iniciales consistentes
     * Fase 1-2 del plan: estructuras normalizadas + datos consistentes
     */
    _generarDatosIniciales() {
        console.log('[BambuState] Generando datos iniciales...');

        // ====================================================================
        // DATOS BASE (copiados de mock-data.js)
        // ====================================================================

        const clientes = [
            // Cliente especial para ventas casuales (PRD 6.5)
            { id: 0, direccion: 'SIN REGISTRO', telefono: '-', ciudad: '-', saldo: 0, estado: 'activo', lista_precio: 'L1', email: '', nota: 'Ventas casuales de mostrador', es_sin_registro: true },
            { id: 1, direccion: 'ARAUCARIAS 371', telefono: '299 456-7890', ciudad: 'Neuquén', saldo: -45000, estado: 'activo', lista_precio: 'L1', email: '', nota: '' },
            { id: 2, direccion: 'PELLEGRINI 615', telefono: '299 456-7891', ciudad: 'Cipolletti', saldo: 0, estado: 'activo', lista_precio: 'L3', email: 'pellegrini@email.com', nota: '' },
            { id: 3, direccion: 'SAN LUIS 372', telefono: '299 456-7892', ciudad: 'Allen', saldo: -25000, estado: 'activo', lista_precio: 'L1', email: '', nota: 'Cliente mayorista' },
            { id: 4, direccion: 'MITRE 4735', telefono: '299 456-7893', ciudad: 'Neuquén', saldo: 15000, estado: 'activo', lista_precio: 'L2', email: '', nota: '' },
            { id: 5, direccion: 'ECUADOR 2133', telefono: '299 456-7894', ciudad: 'Plottier', saldo: -150000, estado: 'activo', lista_precio: 'L1', email: 'ecuador2133@mail.com', nota: 'Atención: horario restringido' },
            { id: 6, direccion: 'AV. ARGENTINA 825', telefono: '299 456-7895', ciudad: 'Neuquén', saldo: 0, estado: 'inactivo', lista_precio: 'L3', email: '', nota: 'Cerrado temporalmente' },
            { id: 7, direccion: 'CUENCA 16 MZA 7', telefono: '294 464-3435', ciudad: 'Neuquén', saldo: 0, estado: 'activo', lista_precio: 'L1', email: '', nota: '' },
            { id: 8, direccion: 'ALMAFUERTE 1245', telefono: '299 456-7897', ciudad: 'Centenario', saldo: -80000, estado: 'activo', lista_precio: 'L2', email: '', nota: '' },
            { id: 9, direccion: '9 DE JULIO 902', telefono: '299 507-3355', ciudad: 'Cipolletti', saldo: -150000, estado: 'activo', lista_precio: 'L1', email: '', nota: '' },
            { id: 10, direccion: 'GENERAL PAZ 1461', telefono: '299 412-8800', ciudad: 'Neuquén', saldo: 5000, estado: 'activo', lista_precio: 'L2', email: 'gralpazclient@mail.com', nota: '' },
            { id: 11, direccion: 'LAS RETAMAS 1091', telefono: '299 523-4455', ciudad: 'Plottier', saldo: -12000, estado: 'activo', lista_precio: 'L1', email: '', nota: '' },
            { id: 12, direccion: 'CATAMARCA 662', telefono: '299 487-9633', ciudad: 'Allen', saldo: 0, estado: 'inactivo', lista_precio: 'L1', email: '', nota: 'Sin actividad hace 6 meses' },
        ];

        const productos = [
            { id: 1, nombre: 'Detergente Industrial 5L', proveedor_id: 1, precio_l1: 15000, precio_l2: 14062.50, precio_l3: 13500, stock_actual: 150, stock_minimo: 30, peso_kg: 5.0, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 2, nombre: 'Lavandina Concentrada 2L', proveedor_id: 4, precio_l1: 3500, precio_l2: 3281.25, precio_l3: 3150, stock_actual: 300, stock_minimo: 50, peso_kg: 2.0, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 3, nombre: 'Desinfectante Multiuso 1L', proveedor_id: 1, precio_l1: 2200, precio_l2: 2062.50, precio_l3: 1980, stock_actual: 200, stock_minimo: 40, peso_kg: 1.0, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 4, nombre: 'Limpiador Pisos 5L', proveedor_id: 2, precio_l1: 8500, precio_l2: 7968.75, precio_l3: 7650, stock_actual: 120, stock_minimo: 25, peso_kg: 5.0, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 5, nombre: 'Jabón Líquido Manos 500ml', proveedor_id: 3, precio_l1: 1800, precio_l2: 1687.50, precio_l3: 1620, stock_actual: 250, stock_minimo: 60, peso_kg: 0.5, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 6, nombre: 'Alcohol en Gel 1L', proveedor_id: 1, precio_l1: 4500, precio_l2: 4218.75, precio_l3: 4050, stock_actual: 18, stock_minimo: 40, peso_kg: 1.0, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 7, nombre: 'Desengrasante Cocina 750ml', proveedor_id: 2, precio_l1: 3200, precio_l2: 3000, precio_l3: 2880, stock_actual: 160, stock_minimo: 35, peso_kg: 0.75, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 8, nombre: 'Limpia Vidrios 500ml', proveedor_id: 3, precio_l1: 1500, precio_l2: 1406.25, precio_l3: 1350, stock_actual: 220, stock_minimo: 50, peso_kg: 0.5, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 9, nombre: 'Pack Limpieza Hogar', proveedor_id: null, precio_l1: 18000, precio_l2: 18000, precio_l3: 18000, stock_actual: 25, stock_minimo: 10, peso_kg: 8.0, disponible: true, en_promocion: true, precio_promocional: 15000 },
            { id: 10, nombre: 'Cloro Concentrado 5L', proveedor_id: 4, precio_l1: 4200, precio_l2: 3937.50, precio_l3: 3780, stock_actual: 8, stock_minimo: 30, peso_kg: 5.0, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 11, nombre: 'Suavizante Ropa 3L', proveedor_id: 2, precio_l1: 5800, precio_l2: 5437.50, precio_l3: 5220, stock_actual: 95, stock_minimo: 20, peso_kg: 3.0, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 12, nombre: 'Producto Descontinuado', proveedor_id: 1, precio_l1: 2500, precio_l2: 2343.75, precio_l3: 2250, stock_actual: 5, stock_minimo: 10, peso_kg: 1.5, disponible: false, en_promocion: false, precio_promocional: null },
            { id: 13, nombre: 'Pack Oficina Premium', proveedor_id: null, precio_l1: 12000, precio_l2: 12000, precio_l3: 12000, stock_actual: 15, stock_minimo: 5, peso_kg: 6.0, disponible: true, en_promocion: true, precio_promocional: 9500 },
            { id: 14, nombre: 'Limpiador Multiusos 1L', proveedor_id: 1, precio_l1: 2800, precio_l2: 2625, precio_l3: 2520, stock_actual: 180, stock_minimo: 40, peso_kg: 1.0, disponible: true, en_promocion: false, precio_promocional: null },
            { id: 15, nombre: 'Cera Pisos Autobrillante 5L', proveedor_id: 3, precio_l1: 9500, precio_l2: 8906.25, precio_l3: 8550, stock_actual: 45, stock_minimo: 15, peso_kg: 5.2, disponible: true, en_promocion: false, precio_promocional: null },
        ];

        const vehiculos = [
            { id: 1, nombre: 'Reparto 1', capacidadKg: 2500, modelo: 'Fiat Fiorino', patente: 'AB 123 CD' },
            { id: 2, nombre: 'Reparto 2', capacidadKg: 1500, modelo: 'Renault Kangoo', patente: null },
            { id: 3, nombre: 'Reparto 3', capacidadKg: 2250, modelo: null, patente: null },
        ];

        const ciudades = [
            { id: 1, nombre: 'Neuquén', provincia: 'Neuquén' },
            { id: 2, nombre: 'Cipolletti', provincia: 'Río Negro' },
            { id: 3, nombre: 'Plottier', provincia: 'Neuquén' },
            { id: 4, nombre: 'Centenario', provincia: 'Neuquén' },
            { id: 5, nombre: 'Allen', provincia: 'Río Negro' },
        ];

        const listas_precio = [
            { id: 1, nombre: 'L1', descuento: 0, umbral: null },
            { id: 2, nombre: 'L2', descuento: 6.25, umbral: 50000 },
            { id: 3, nombre: 'L3', descuento: 10, umbral: 100000 },
        ];

        // ====================================================================
        // GENERAR PEDIDOS CONSISTENTES (~80 pedidos)
        // ====================================================================

        const pedidos = [];
        const pedido_items = [];
        let pedidoId = 500;
        let itemId = 1;

        // Helper: obtener precio según lista del cliente
        const getPrecio = (producto, listaPrecio) => {
            if (producto.en_promocion && producto.precio_promocional) {
                return producto.precio_promocional;
            }
            switch (listaPrecio) {
                case 'L2': return producto.precio_l2;
                case 'L3': return producto.precio_l3;
                default: return producto.precio_l1;
            }
        };

        // Helper: crear pedido con items
        const crearPedido = (fecha, tipo, estado, vehiculoId, clientesFiltro) => {
            // Seleccionar cliente aleatorio de los activos
            const clientesActivos = clientes.filter(c => c.estado === 'activo' && (!clientesFiltro || clientesFiltro.includes(c.id)));
            const cliente = clientesActivos[Math.floor(Math.random() * clientesActivos.length)];

            const pedido = {
                id: pedidoId++,
                numero: `#00${pedidoId}`,
                fecha,
                cliente_id: cliente.id,
                direccion: tipo === 'fabrica' ? 'VENTA FÁBRICA' : cliente.direccion,
                ciudad: cliente.ciudad,
                tipo,
                estado,
                vehiculo_id: tipo === 'fabrica' ? null : vehiculoId,
                vehiculo: vehiculoId ? vehiculos.find(v => v.id === vehiculoId)?.nombre : null,
                metodoPago: null,
                montoEfectivo: null,
                montoDigital: null,
                fechaEntrega: null,
                nota: ''
            };

            // Generar 2-5 items por pedido
            const numItems = Math.floor(Math.random() * 4) + 2;
            const productosDisponibles = productos.filter(p => p.disponible);
            const productosUsados = new Set();

            for (let i = 0; i < numItems; i++) {
                let productoId;
                do {
                    productoId = productosDisponibles[Math.floor(Math.random() * productosDisponibles.length)].id;
                } while (productosUsados.has(productoId) && productosUsados.size < productosDisponibles.length);
                productosUsados.add(productoId);

                const producto = productos.find(p => p.id === productoId);
                const cantidad = Math.floor(Math.random() * 10) + 1; // 1-10 unidades
                const precioUnitario = getPrecio(producto, cliente.lista_precio);

                pedido_items.push({
                    id: itemId++,
                    pedido_id: pedido.id,
                    producto_id: productoId,
                    cantidad,
                    precio_unitario: precioUnitario
                });
            }

            // Si está entregado, asignar método de pago
            if (estado === 'entregado') {
                const metodos = ['efectivo', 'digital', 'mixto'];
                const metodo = metodos[Math.floor(Math.random() * metodos.length)];
                pedido.metodoPago = metodo;

                // Calcular total desde items
                const itemsPedido = pedido_items.filter(i => i.pedido_id === pedido.id);
                const total = itemsPedido.reduce((sum, i) => sum + (i.precio_unitario * i.cantidad), 0);

                if (metodo === 'efectivo') {
                    pedido.montoEfectivo = total;
                } else if (metodo === 'digital') {
                    pedido.montoDigital = total;
                } else {
                    const efectivo = Math.floor(total * 0.6);
                    pedido.montoEfectivo = efectivo;
                    pedido.montoDigital = total - efectivo;
                }

                const horas = String(Math.floor(Math.random() * 10) + 9).padStart(2, '0');
                const mins = String(Math.floor(Math.random() * 60)).padStart(2, '0');
                pedido.fechaEntrega = `${fecha}T${horas}:${mins}:00`;
            }

            pedidos.push(pedido);
            return pedido;
        };

        // ====================================================================
        // DISTRIBUCIÓN DE PEDIDOS POR DÍA
        // HOY = Miércoles 08/01/2026
        // ====================================================================

        // LUNES 06/01 - CONTROLADO (18 pedidos, todos entregados)
        for (let i = 0; i < 14; i++) {
            const vehId = (i % 3) + 1;
            crearPedido('2026-01-06', 'reparto', 'entregado', vehId);
        }
        for (let i = 0; i < 4; i++) {
            crearPedido('2026-01-06', 'fabrica', 'entregado', null);
        }

        // MARTES 07/01 - A CONTROLAR (16 pedidos, 80% entregados)
        for (let i = 0; i < 10; i++) {
            const vehId = (i % 3) + 1;
            crearPedido('2026-01-07', 'reparto', 'entregado', vehId);
        }
        for (let i = 0; i < 3; i++) {
            const vehId = (i % 3) + 1;
            crearPedido('2026-01-07', 'reparto', 'en transito', vehId);
        }
        for (let i = 0; i < 3; i++) {
            crearPedido('2026-01-07', 'fabrica', 'entregado', null);
        }

        // MIÉRCOLES 08/01 - HOY (16 pedidos, en tránsito/asignado)
        for (let i = 0; i < 9; i++) {
            const vehId = (i % 3) + 1;
            crearPedido('2026-01-08', 'reparto', 'en transito', vehId);
        }
        for (let i = 0; i < 5; i++) {
            const vehId = (i % 3) + 1;
            crearPedido('2026-01-08', 'reparto', 'asignado', vehId);
        }
        for (let i = 0; i < 2; i++) {
            crearPedido('2026-01-08', 'fabrica', 'entregado', null);
        }

        // JUEVES 09/01 - MAÑANA (16 pedidos, pendiente/asignado)
        for (let i = 0; i < 5; i++) {
            crearPedido('2026-01-09', 'reparto', 'pendiente', null);
        }
        for (let i = 0; i < 9; i++) {
            const vehId = (i % 3) + 1;
            crearPedido('2026-01-09', 'reparto', 'asignado', vehId);
        }
        for (let i = 0; i < 2; i++) {
            crearPedido('2026-01-09', 'fabrica', 'pendiente', null);
        }

        // VIERNES 10/01 - PLANIFICANDO (12 pedidos, mayormente pendiente)
        for (let i = 0; i < 8; i++) {
            crearPedido('2026-01-10', 'reparto', 'pendiente', null);
        }
        for (let i = 0; i < 2; i++) {
            const vehId = (i % 3) + 1;
            crearPedido('2026-01-10', 'reparto', 'asignado', vehId);
        }
        for (let i = 0; i < 2; i++) {
            crearPedido('2026-01-10', 'fabrica', 'pendiente', null);
        }

        // BORRADORES (3 pedidos sin fecha)
        for (let i = 0; i < 3; i++) {
            const clientesActivos = clientes.filter(c => c.estado === 'activo');
            const cliente = clientesActivos[Math.floor(Math.random() * clientesActivos.length)];

            pedidos.push({
                id: pedidoId++,
                numero: `#00${pedidoId}`,
                fecha: null,
                cliente_id: cliente.id,
                direccion: cliente.direccion,
                ciudad: cliente.ciudad,
                tipo: 'reparto',
                estado: 'borrador',
                vehiculo_id: null,
                vehiculo: null,
                metodoPago: null,
                montoEfectivo: null,
                montoDigital: null,
                fechaEntrega: null,
                nota: 'Pendiente confirmar fecha'
            });

            // Agregar 1-3 items al borrador
            const numItems = Math.floor(Math.random() * 3) + 1;
            const productosDisponibles = productos.filter(p => p.disponible);
            const productosUsados = new Set();

            for (let j = 0; j < numItems; j++) {
                let productoId;
                do {
                    productoId = productosDisponibles[Math.floor(Math.random() * productosDisponibles.length)].id;
                } while (productosUsados.has(productoId));
                productosUsados.add(productoId);

                const producto = productos.find(p => p.id === productoId);
                const cantidad = Math.floor(Math.random() * 5) + 1;
                const precioUnitario = getPrecio(producto, cliente.lista_precio);

                pedido_items.push({
                    id: itemId++,
                    pedido_id: pedidos[pedidos.length - 1].id,
                    producto_id: productoId,
                    cantidad,
                    precio_unitario: precioUnitario
                });
            }
        }

        // ====================================================================
        // PEDIDO ESPECIAL #998 - Para testing pagos parciales (PRD 6.2, 6.3)
        // ====================================================================

        const pedido998 = {
            id: 998,
            numero: '#00998',
            fecha: '2026-01-06',
            cliente_id: 5, // ECUADOR 2133 - Cliente con saldo alto
            direccion: 'ECUADOR 2133',
            ciudad: 'Plottier',
            tipo: 'reparto',
            estado: 'entregado',
            vehiculo_id: 2,
            vehiculo: 'Reparto 2',
            metodoPago: 'efectivo',
            montoEfectivo: 50000,
            montoDigital: 0,
            monto_pagado: 50000, // Pagó $50.000 de $80.100 total
            fechaEntrega: '2026-01-06T14:30:00',
            nota: 'Pedido de testing - pago parcial pendiente',
            pagos: [
                { id: 1, fecha: '2026-01-06T14:30:00', monto: 30000, metodo: 'efectivo', tipo: 'asociado', registrado_por: 'admin@bambu.com' },
                { id: 2, fecha: '2026-01-06T17:00:00', monto: 20000, metodo: 'efectivo', tipo: 'asociado', registrado_por: 'vendedor@bambu.com' }
            ]
        };
        pedidos.push(pedido998);

        // Items para pedido 998 (total = $80.100)
        pedido_items.push(
            { id: itemId++, pedido_id: 998, producto_id: 1, cantidad: 3, precio_unitario: 15000 }, // $45.000
            { id: itemId++, pedido_id: 998, producto_id: 4, cantidad: 3, precio_unitario: 8500 },  // $25.500
            { id: itemId++, pedido_id: 998, producto_id: 8, cantidad: 6, precio_unitario: 1600 }   // $9.600
        );

        // ====================================================================
        // PEDIDO ESPECIAL #999 - Para testing auditoría (PRD 10.1)
        // ====================================================================

        const pedido999 = {
            id: 999,
            numero: '#00999',
            fecha: '2026-01-07',
            cliente_id: 1,
            direccion: 'ARAUCARIAS 371',
            ciudad: 'Neuquén',
            tipo: 'reparto',
            estado: 'entregado',
            vehiculo_id: 1,
            vehiculo: 'Reparto 1',
            metodoPago: 'mixto',
            montoEfectivo: 30000,
            montoDigital: 19500,
            fechaEntrega: '2026-01-07T16:45:00',
            nota: 'Pedido de testing - auditoría completa',
            historial_cambios: [
                { id: 1, fecha: '2026-01-07T11:00:00', usuario_id: 1, usuario_nombre: 'admin@bambu.com', accion: 'CREACION', campo_modificado: null, valor_anterior: null, valor_nuevo: null, razon: 'Pedido creado desde cotizador', ip: '192.168.1.100' },
                { id: 2, fecha: '2026-01-07T12:30:00', usuario_id: 1, usuario_nombre: 'admin@bambu.com', accion: 'EDICION', campo_modificado: 'descuento_porcentaje', valor_anterior: 0, valor_nuevo: 10, razon: 'Cliente solicitó descuento acordado', ip: '192.168.1.100' },
                { id: 3, fecha: '2026-01-07T15:00:00', usuario_id: 2, usuario_nombre: 'vendedor@bambu.com', accion: 'ESTADO', campo_modificado: 'estado', valor_anterior: 'en transito', valor_nuevo: 'entregado', razon: 'Entrega confirmada', ip: '192.168.1.105' },
                { id: 4, fecha: '2026-01-07T17:00:00', usuario_id: 1, usuario_nombre: 'admin@bambu.com', accion: 'EDICION', campo_modificado: 'total', valor_anterior: 52000, valor_nuevo: 49500, razon: 'Ajuste post-entrega - 1 producto devuelto', ip: '192.168.1.100' }
            ]
        };
        pedidos.push(pedido999);

        // Items para pedido 999
        pedido_items.push(
            { id: itemId++, pedido_id: 999, producto_id: 1, cantidad: 2, precio_unitario: 15000 },
            { id: itemId++, pedido_id: 999, producto_id: 3, cantidad: 3, precio_unitario: 2200 },
            { id: itemId++, pedido_id: 999, producto_id: 5, cantidad: 5, precio_unitario: 1800 },
            { id: itemId++, pedido_id: 999, producto_id: 7, cantidad: 2, precio_unitario: 3200 }
        );

        console.log(`[BambuState] Generados: ${pedidos.length} pedidos, ${pedido_items.length} items`);

        // ====================================================================
        // MOVIMIENTOS CUENTA CORRIENTE
        // Sincronizados entre cliente-detalle y ventas
        // ====================================================================

        const movimientos_cc = [];
        let movimientoId = 1;

        // Generar movimientos para pedidos entregados
        pedidos.filter(p => p.estado === 'entregado').forEach(pedido => {
            const itemsPedido = pedido_items.filter(i => i.pedido_id === pedido.id);
            const total = itemsPedido.reduce((sum, i) => sum + (i.precio_unitario * i.cantidad), 0);

            // Cargo por pedido
            movimientos_cc.push({
                id: movimientoId++,
                cliente_id: pedido.cliente_id,
                pedido_id: pedido.id,
                tipo: 'cargo',
                descripcion: `Pedido ${pedido.numero}`,
                monto: total,
                metodo_pago: null,
                fecha: pedido.fecha,
                usuario: 'Sistema',
                nota: ''
            });

            // Pago si tiene método de pago registrado
            if (pedido.metodoPago) {
                movimientos_cc.push({
                    id: movimientoId++,
                    cliente_id: pedido.cliente_id,
                    pedido_id: pedido.id,
                    tipo: 'pago',
                    descripcion: pedido.metodoPago === 'efectivo' ? 'Pago Efectivo' :
                                 pedido.metodoPago === 'digital' ? 'Pago Transferencia' : 'Pago Mixto',
                    monto: total,
                    metodo_pago: pedido.metodoPago,
                    monto_efectivo: pedido.montoEfectivo,
                    monto_digital: pedido.montoDigital,
                    fecha: pedido.fecha,
                    usuario: 'Sistema',
                    nota: ''
                });
            }
        });

        console.log(`[BambuState] Generados: ${movimientos_cc.length} movimientos CC`);

        return {
            clientes,
            productos,
            vehiculos,
            ciudades,
            listas_precio,
            pedidos,
            pedido_items,
            movimientos_cc,
            config: {
                fechaSistema: this.FECHA_SISTEMA,
                nombreEmpresa: 'Química Bambu S.R.L.',
                ubicacion: 'Neuquén, Argentina'
            }
        };
    },

    /**
     * Valida consistencia del estado
     */
    _validarEstado() {
        const errores = [];

        // Validar pedidos tienen cliente_id válido
        this._state.pedidos?.forEach(p => {
            if (p.cliente_id && !this.getById('clientes', p.cliente_id)) {
                errores.push(`Pedido ${p.numero || p.id}: cliente_id ${p.cliente_id} no existe`);
            }
        });

        // Validar pedido_items tienen producto_id válido
        this._state.pedido_items?.forEach(i => {
            if (!this.getById('productos', i.producto_id)) {
                errores.push(`Item ${i.id}: producto_id ${i.producto_id} no existe`);
            }
        });

        // Validar pedidos tienen vehículo válido (si asignado)
        this._state.pedidos?.forEach(p => {
            if (p.vehiculo_id && !this.getById('vehiculos', p.vehiculo_id)) {
                errores.push(`Pedido ${p.numero || p.id}: vehiculo_id ${p.vehiculo_id} no existe`);
            }
        });

        if (errores.length > 0) {
            console.warn('[BambuState] Errores de consistencia detectados:');
            errores.forEach(e => console.warn('  -', e));
        } else {
            console.log('[BambuState] Validación OK - datos consistentes');
        }

        return errores;
    },

    // ========================================================================
    // MÉTODOS CUENTA CORRIENTE
    // PRD: prd/cuenta-corriente.html - Sincronización bidireccional
    // ========================================================================

    /**
     * Obtiene movimientos CC de un cliente
     * @param {number} clienteId
     * @returns {Array} Movimientos ordenados por fecha desc
     */
    getMovimientosCC(clienteId) {
        this._checkInit();
        const movs = (this._state.movimientos_cc || [])
            .filter(m => m.cliente_id === clienteId);

        // Ordenar por fecha desc, luego por id desc
        return movs.sort((a, b) => {
            if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
            return b.id - a.id;
        });
    },

    /**
     * Calcula el saldo actual de un cliente
     * @param {number} clienteId
     * @returns {number} Saldo (negativo = deuda, positivo = a favor)
     */
    calcularSaldoCC(clienteId) {
        const movimientos = this.getMovimientosCC(clienteId);
        return movimientos.reduce((saldo, m) => {
            if (m.tipo === 'cargo') return saldo - m.monto;
            if (m.tipo === 'pago') return saldo + m.monto;
            return saldo;
        }, 0);
    },

    /**
     * Registra un cargo en cuenta corriente (al entregar pedido)
     * @param {Object} datos - { cliente_id, pedido_id, monto, descripcion }
     * @returns {Object} El movimiento creado
     */
    registrarCargoCC(datos) {
        this._checkInit();
        if (!this._state.movimientos_cc) this._state.movimientos_cc = [];

        const maxId = this._state.movimientos_cc.reduce((max, m) => Math.max(max, m.id), 0);

        const movimiento = {
            id: maxId + 1,
            cliente_id: datos.cliente_id,
            pedido_id: datos.pedido_id || null,
            tipo: 'cargo',
            descripcion: datos.descripcion || 'Cargo',
            monto: datos.monto,
            metodo_pago: null,
            fecha: datos.fecha || this.FECHA_SISTEMA,
            usuario: datos.usuario || 'Usuario',
            nota: datos.nota || ''
        };

        this._state.movimientos_cc.push(movimiento);
        this.save();

        console.log(`[BambuState] Cargo CC registrado: $${movimiento.monto} para cliente ${datos.cliente_id}`);
        return movimiento;
    },

    /**
     * Registra un pago en cuenta corriente
     * @param {Object} datos - { cliente_id, pedido_id?, monto, metodo_pago, monto_efectivo?, monto_digital? }
     * @returns {Object} El movimiento creado
     */
    registrarPagoCC(datos) {
        this._checkInit();
        if (!this._state.movimientos_cc) this._state.movimientos_cc = [];

        const maxId = this._state.movimientos_cc.reduce((max, m) => Math.max(max, m.id), 0);

        const descripcion = datos.pedido_id
            ? `Pago Pedido ${this.getById('pedidos', datos.pedido_id)?.numero || ''}`
            : 'Pago Genérico';

        const movimiento = {
            id: maxId + 1,
            cliente_id: datos.cliente_id,
            pedido_id: datos.pedido_id || null,
            tipo: 'pago',
            descripcion: datos.descripcion || descripcion,
            monto: datos.monto,
            metodo_pago: datos.metodo_pago,
            monto_efectivo: datos.monto_efectivo || null,
            monto_digital: datos.monto_digital || null,
            fecha: datos.fecha || this.FECHA_SISTEMA,
            usuario: datos.usuario || 'Usuario',
            nota: datos.nota || ''
        };

        this._state.movimientos_cc.push(movimiento);
        this.save();

        console.log(`[BambuState] Pago CC registrado: $${movimiento.monto} para cliente ${datos.cliente_id}`);
        return movimiento;
    },

    /**
     * Registra un AJUSTE en cuenta corriente (por edición post-entrega)
     * PRD: prd/ventas.html - Sección 7.2
     *
     * LÓGICA DE NEGOCIO:
     * - Si diferencia > 0: el pedido aumentó → cargo adicional al cliente
     * - Si diferencia < 0: el pedido disminuyó → abono a favor del cliente
     * - El cargo original NUNCA se modifica (trazabilidad)
     *
     * @param {Object} datos - { cliente_id, pedido_id, monto_anterior, monto_nuevo, razon? }
     * @returns {Object|null} El movimiento creado o null si no hay diferencia
     */
    registrarAjusteCC(datos) {
        this._checkInit();
        if (!this._state.movimientos_cc) this._state.movimientos_cc = [];

        const diferencia = datos.monto_nuevo - datos.monto_anterior;

        // Si no hay diferencia, no crear ajuste
        if (diferencia === 0) {
            console.log('[BambuState] Sin diferencia de monto, no se crea ajuste CC');
            return null;
        }

        const maxId = this._state.movimientos_cc.reduce((max, m) => Math.max(max, m.id), 0);
        const pedido = this.getById('pedidos', datos.pedido_id);

        // Determinar tipo: diferencia positiva = cargo adicional, negativa = abono
        const tipoAjuste = diferencia > 0 ? 'cargo' : 'pago';
        const descripcionBase = diferencia > 0
            ? `Ajuste Pedido ${pedido?.numero || ''} (+)`
            : `Ajuste Pedido ${pedido?.numero || ''} (-)`;

        const movimiento = {
            id: maxId + 1,
            cliente_id: datos.cliente_id,
            pedido_id: datos.pedido_id,
            tipo: tipoAjuste,
            subtipo: 'ajuste_edicion', // Para identificar ajustes vs cargos/pagos normales
            descripcion: datos.descripcion || descripcionBase,
            monto: Math.abs(diferencia),
            monto_anterior: datos.monto_anterior,
            monto_nuevo: datos.monto_nuevo,
            metodo_pago: null,
            fecha: this.FECHA_SISTEMA,
            usuario: datos.usuario || 'Usuario',
            nota: datos.razon || 'Edición post-entrega'
        };

        this._state.movimientos_cc.push(movimiento);
        this.save();

        console.log(`[BambuState] Ajuste CC registrado: ${tipoAjuste} $${Math.abs(diferencia)} para cliente ${datos.cliente_id} (Pedido ${datos.pedido_id})`);
        return movimiento;
    },

    /**
     * Registra un cambio en el historial de un pedido (auditoría)
     * PRD: prd/ventas.html - Sección 10.1
     *
     * @param {number} pedidoId
     * @param {Object} datos - { accion, campo_modificado?, valor_anterior?, valor_nuevo?, razon? }
     * @returns {Object} El registro de cambio creado
     */
    registrarCambioPedido(pedidoId, datos) {
        this._checkInit();

        const pedido = this._state.pedidos.find(p => p.id === pedidoId);
        if (!pedido) {
            console.error(`[BambuState] Pedido ${pedidoId} no encontrado`);
            return null;
        }

        // Inicializar historial si no existe
        if (!pedido.historial_cambios) {
            pedido.historial_cambios = [];
        }

        const maxId = pedido.historial_cambios.reduce((max, c) => Math.max(max, c.id || 0), 0);

        const cambio = {
            id: maxId + 1,
            fecha: new Date().toISOString(),
            usuario_id: datos.usuario_id || 1,
            usuario_nombre: datos.usuario_nombre || 'admin@bambu.com',
            accion: datos.accion, // 'CREACION', 'EDICION', 'ESTADO'
            campo_modificado: datos.campo_modificado || null,
            valor_anterior: datos.valor_anterior !== undefined ? datos.valor_anterior : null,
            valor_nuevo: datos.valor_nuevo !== undefined ? datos.valor_nuevo : null,
            razon: datos.razon || null,
            ip: datos.ip || '192.168.1.100'
        };

        pedido.historial_cambios.push(cambio);
        this.save();

        console.log(`[BambuState] Cambio registrado en pedido ${pedidoId}: ${datos.accion}`);
        return cambio;
    },

    // ========================================================================
    // MÉTODOS DE CREACIÓN - Para uso desde Cotizador y otros módulos
    // ========================================================================

    /**
     * Crea un nuevo pedido
     * @param {Object} datos - { cliente_id, tipo, estado, fecha, direccion, ciudad, notas, vehiculo_id }
     * @returns {Object} El pedido creado con id y numero asignados
     */
    crearPedido(datos) {
        if (!this._state.pedidos) this._state.pedidos = [];

        // Generar nuevo ID (max + 1)
        const maxId = this._state.pedidos.reduce((max, p) => Math.max(max, p.id), 0);
        const nuevoId = maxId + 1;

        // Generar número de pedido
        const numero = `#${String(nuevoId).padStart(3, '0')}`;

        const nuevoPedido = {
            id: nuevoId,
            numero,
            cliente_id: datos.cliente_id || null,
            tipo: datos.tipo || 'reparto',
            estado: datos.estado || 'pendiente',
            fecha: datos.fecha || this.FECHA_SISTEMA,
            direccion: datos.direccion || '',
            ciudad: datos.ciudad || 'Neuquén',
            notas: datos.notas || null,
            vehiculo_id: datos.vehiculo_id || null,
            metodo_pago: datos.metodo_pago || null,
            monto_efectivo: datos.monto_efectivo || null,
            monto_digital: datos.monto_digital || null
        };

        this._state.pedidos.push(nuevoPedido);
        console.log(`[BambuState] Pedido ${numero} creado`);

        return nuevoPedido;
    },

    /**
     * Agrega un item a un pedido
     * @param {number} pedidoId
     * @param {Object} datos - { producto_id, cantidad, precio_unitario }
     * @returns {Object} El item creado
     */
    agregarItemPedido(pedidoId, datos) {
        if (!this._state.pedido_items) this._state.pedido_items = [];

        // Generar nuevo ID
        const maxId = this._state.pedido_items.reduce((max, i) => Math.max(max, i.id), 0);
        const nuevoId = maxId + 1;

        const nuevoItem = {
            id: nuevoId,
            pedido_id: pedidoId,
            producto_id: datos.producto_id,
            cantidad: datos.cantidad || 1,
            precio_unitario: datos.precio_unitario || 0
        };

        this._state.pedido_items.push(nuevoItem);
        return nuevoItem;
    },

    /**
     * Crea un pedido borrador
     * @param {Object} datos - Mismos datos que crearPedido pero estado='borrador'
     * @returns {Object} El borrador creado
     */
    crearBorrador(datos) {
        return this.crearPedido({
            ...datos,
            estado: 'borrador'
        });
    },

    // ========================================================================
    // MÉTODOS DE ACTUALIZACIÓN
    // ========================================================================

    /**
     * Actualiza un registro existente
     * @param {string} entidad - 'clientes', 'productos', 'pedidos', etc.
     * @param {number} id - ID del registro a actualizar
     * @param {Object} datos - Campos a actualizar (merge con existentes)
     * @returns {Object|null} El registro actualizado o null si no existe
     */
    update(entidad, id, datos) {
        this._checkInit();

        const items = this._state[entidad];
        if (!items) {
            console.error(`[BambuState] Entidad '${entidad}' no existe`);
            return null;
        }

        const idx = items.findIndex(item => item.id === id);
        if (idx === -1) {
            console.error(`[BambuState] Registro con id=${id} no encontrado en '${entidad}'`);
            return null;
        }

        // Merge datos existentes con nuevos
        items[idx] = { ...items[idx], ...datos };
        this.save();

        console.log(`[BambuState] ${entidad}[${id}] actualizado`);
        return items[idx];
    },

    /**
     * Elimina un registro
     * @param {string} entidad
     * @param {number} id
     * @returns {boolean} true si se eliminó correctamente
     */
    delete(entidad, id) {
        this._checkInit();

        const items = this._state[entidad];
        if (!items) return false;

        const idx = items.findIndex(item => item.id === id);
        if (idx === -1) return false;

        items.splice(idx, 1);
        this.save();

        console.log(`[BambuState] ${entidad}[${id}] eliminado`);
        return true;
    },

    // ========================================================================
    // MÉTODOS DE STOCK
    // PRD: prd/ventas.html - Sección 7.2 (Impacto automático)
    // ========================================================================

    /**
     * Obtiene el stock actual de un producto
     * @param {number} productoId
     * @returns {number} Stock actual o 0 si no existe
     */
    getStock(productoId) {
        const producto = this.getById('productos', productoId);
        return producto?.stock_actual || 0;
    },

    /**
     * Verifica si hay stock suficiente para una cantidad
     * @param {number} productoId
     * @param {number} cantidad - Cantidad requerida
     * @returns {Object} { disponible: boolean, stockActual: number, faltante: number }
     */
    verificarStock(productoId, cantidad) {
        const stockActual = this.getStock(productoId);
        const disponible = stockActual >= cantidad;
        return {
            disponible,
            stockActual,
            faltante: disponible ? 0 : cantidad - stockActual
        };
    },

    /**
     * Actualiza el stock de un producto
     * @param {number} productoId
     * @param {number} delta - Cantidad a sumar (positivo) o restar (negativo)
     * @param {string} motivo - 'edicion_pedido', 'entrega', 'devolucion', etc.
     * @param {number} pedidoId - ID del pedido relacionado (opcional)
     * @returns {Object} { exito: boolean, stockNuevo: number, error?: string }
     *
     * LÓGICA DE NEGOCIO:
     * - delta > 0 → Reintegrar stock (producto devuelto/quitado de pedido)
     * - delta < 0 → Descontar stock (producto agregado a pedido)
     * - No permite stock negativo
     */
    actualizarStock(productoId, delta, motivo = 'ajuste', pedidoId = null) {
        this._checkInit();

        const producto = this.getById('productos', productoId);
        if (!producto) {
            return { exito: false, stockNuevo: 0, error: 'Producto no encontrado' };
        }

        const stockActual = producto.stock_actual || 0;
        const stockNuevo = stockActual + delta;

        // Validar que no quede negativo
        if (stockNuevo < 0) {
            return {
                exito: false,
                stockNuevo: stockActual,
                error: `Stock insuficiente. Actual: ${stockActual}, Requerido: ${Math.abs(delta)}`
            };
        }

        // Actualizar producto
        producto.stock_actual = stockNuevo;

        // Registrar movimiento en historial
        this._registrarMovimientoStock({
            producto_id: productoId,
            producto_nombre: producto.nombre,
            stock_anterior: stockActual,
            stock_nuevo: stockNuevo,
            delta,
            motivo,
            pedido_id: pedidoId,
            fecha: new Date().toISOString()
        });

        this.save();

        console.log(`[BambuState] Stock ${producto.nombre}: ${stockActual} → ${stockNuevo} (${delta > 0 ? '+' : ''}${delta}) [${motivo}]`);

        return { exito: true, stockNuevo };
    },

    /**
     * Ajusta stock por diferencias entre items originales y nuevos
     * @param {Array} itemsOriginales - [{ producto_id, cantidad }, ...]
     * @param {Array} itemsNuevos - [{ producto_id, cantidad }, ...]
     * @param {number} pedidoId - ID del pedido
     * @returns {Object} { exito: boolean, ajustes: [], errores: [] }
     *
     * LÓGICA DE NEGOCIO:
     * - Calcula delta por producto: nuevo - original
     * - Si delta > 0 (agregó): valida stock y descuenta
     * - Si delta < 0 (quitó): reintegra stock
     * - Retorna errores si hay stock insuficiente
     */
    ajustarStockPorEdicion(itemsOriginales, itemsNuevos, pedidoId) {
        const ajustes = [];
        const errores = [];

        // Crear mapa de cantidades originales
        const mapOriginal = new Map();
        itemsOriginales.forEach(item => {
            mapOriginal.set(item.producto_id, (mapOriginal.get(item.producto_id) || 0) + item.cantidad);
        });

        // Crear mapa de cantidades nuevas
        const mapNuevo = new Map();
        itemsNuevos.forEach(item => {
            mapNuevo.set(item.producto_id, (mapNuevo.get(item.producto_id) || 0) + item.cantidad);
        });

        // Obtener todos los producto_id involucrados
        const todosProductos = new Set([...mapOriginal.keys(), ...mapNuevo.keys()]);

        // Calcular deltas y validar
        for (const productoId of todosProductos) {
            const cantidadOriginal = mapOriginal.get(productoId) || 0;
            const cantidadNueva = mapNuevo.get(productoId) || 0;
            const delta = cantidadOriginal - cantidadNueva; // Positivo = reintegrar, Negativo = descontar

            if (delta === 0) continue;

            const producto = this.getById('productos', productoId);
            const nombreProducto = producto?.nombre || `Producto #${productoId}`;

            // Si delta negativo (agregar más), validar stock disponible
            if (delta < 0) {
                const verificacion = this.verificarStock(productoId, Math.abs(delta));
                if (!verificacion.disponible) {
                    errores.push({
                        producto_id: productoId,
                        nombre: nombreProducto,
                        requerido: Math.abs(delta),
                        disponible: verificacion.stockActual,
                        faltante: verificacion.faltante
                    });
                    continue;
                }
            }

            ajustes.push({
                producto_id: productoId,
                nombre: nombreProducto,
                cantidadOriginal,
                cantidadNueva,
                delta
            });
        }

        // Si hay errores, no aplicar ningún ajuste
        if (errores.length > 0) {
            return { exito: false, ajustes: [], errores };
        }

        // Aplicar ajustes
        for (const ajuste of ajustes) {
            this.actualizarStock(ajuste.producto_id, ajuste.delta, 'edicion_pedido', pedidoId);
        }

        return { exito: true, ajustes, errores: [] };
    },

    /**
     * Registra movimiento en historial de stock
     * @private
     */
    _registrarMovimientoStock(movimiento) {
        if (!this._state.movimientos_stock) {
            this._state.movimientos_stock = [];
        }

        const maxId = this._state.movimientos_stock.reduce((max, m) => Math.max(max, m.id || 0), 0);
        movimiento.id = maxId + 1;

        this._state.movimientos_stock.push(movimiento);
    },

    /**
     * Obtiene historial de movimientos de stock
     * @param {Object} filtros - { producto_id, pedido_id, limite }
     * @returns {Array} Movimientos ordenados por fecha desc
     */
    getMovimientosStock(filtros = {}) {
        this._checkInit();
        let movimientos = this._state.movimientos_stock || [];

        if (filtros.producto_id) {
            movimientos = movimientos.filter(m => m.producto_id === filtros.producto_id);
        }

        if (filtros.pedido_id) {
            movimientos = movimientos.filter(m => m.pedido_id === filtros.pedido_id);
        }

        // Ordenar por fecha desc
        movimientos = movimientos.sort((a, b) => b.fecha.localeCompare(a.fecha));

        if (filtros.limite) {
            movimientos = movimientos.slice(0, filtros.limite);
        }

        return movimientos;
    }
};

// ============================================================================
// AUTO-INICIALIZACIÓN (opcional)
// ============================================================================

// Descomentar para auto-init cuando se carga el script
// document.addEventListener('DOMContentLoaded', () => BambuState.init());
