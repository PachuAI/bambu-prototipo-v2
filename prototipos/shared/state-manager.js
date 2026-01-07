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

    VERSION: '1.0.0',
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
     * IMPLEMENTAR EN FASE 2
     */
    _generarDatosIniciales() {
        console.log('[BambuState] Generando datos iniciales...');

        // TODO: Fase 2 - Implementar generador completo
        // Por ahora retorna estructura vacía
        return {
            clientes: [],
            productos: [],
            vehiculos: [],
            ciudades: [],
            pedidos: [],
            pedido_items: [],
            listas_precio: [],
            config: {
                fechaSistema: this.FECHA_SISTEMA
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
    }
};

// ============================================================================
// AUTO-INICIALIZACIÓN (opcional)
// ============================================================================

// Descomentar para auto-init cuando se carga el script
// document.addEventListener('DOMContentLoaded', () => BambuState.init());
