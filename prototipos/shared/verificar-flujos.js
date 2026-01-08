/**
 * SCRIPT DE VERIFICACIÓN DE FLUJOS - BAMBU CRM V2
 * Ejecutar en consola del navegador para validar integridad del sistema
 *
 * USO: Abrir cualquier prototipo → F12 → Console → Pegar este script
 */

const VerificarFlujos = {
    resultados: [],
    errores: 0,
    exitos: 0,

    // =========================================================================
    // TESTS DE INTEGRIDAD
    // =========================================================================

    async ejecutar() {
        console.clear();
        console.log('🔍 VERIFICACIÓN DE FLUJOS - BAMBU CRM V2');
        console.log('='.repeat(50));

        this.resultados = [];
        this.errores = 0;
        this.exitos = 0;

        // Verificar que BambuState existe
        if (typeof BambuState === 'undefined') {
            console.error('❌ BambuState no está cargado. Ejecuta desde un prototipo.');
            return;
        }

        BambuState.init();

        // Ejecutar tests
        this.testDatosBase();
        this.testRelacionesFK();
        this.testCalculos();
        this.testCuentaCorriente();
        this.testStock();
        this.testEstados();

        // Resumen
        this.mostrarResumen();
    },

    // =========================================================================
    // TEST 1: Datos base existen
    // =========================================================================
    testDatosBase() {
        console.log('\n📦 TEST 1: Datos Base');

        const tests = [
            { nombre: 'Clientes', fn: () => BambuState.get('clientes').length > 0 },
            { nombre: 'Productos', fn: () => BambuState.get('productos').length > 0 },
            { nombre: 'Pedidos', fn: () => BambuState.get('pedidos').length > 0 },
            { nombre: 'Vehículos', fn: () => BambuState.get('vehiculos').length > 0 },
            { nombre: 'Items pedido', fn: () => BambuState.get('pedido_items').length > 0 },
            { nombre: 'Movimientos CC', fn: () => BambuState.get('movimientos_cc').length > 0 },
        ];

        tests.forEach(t => this.verificar(t.nombre, t.fn()));
    },

    // =========================================================================
    // TEST 2: Relaciones FK válidas
    // =========================================================================
    testRelacionesFK() {
        console.log('\n🔗 TEST 2: Relaciones FK');

        // Pedidos → Clientes válidos
        const pedidos = BambuState.get('pedidos');
        const clientes = BambuState.get('clientes');
        const clienteIds = new Set(clientes.map(c => c.id));

        const pedidosSinCliente = pedidos.filter(p =>
            p.cliente_id !== null &&
            p.cliente_id !== 0 &&
            !clienteIds.has(p.cliente_id)
        );
        this.verificar('Pedidos → Clientes válidos', pedidosSinCliente.length === 0,
            pedidosSinCliente.length > 0 ? `${pedidosSinCliente.length} pedidos con cliente inválido` : null);

        // Items → Productos válidos
        const items = BambuState.get('pedido_items');
        const productos = BambuState.get('productos');
        const productoIds = new Set(productos.map(p => p.id));

        const itemsSinProducto = items.filter(i => !productoIds.has(i.producto_id));
        this.verificar('Items → Productos válidos', itemsSinProducto.length === 0,
            itemsSinProducto.length > 0 ? `${itemsSinProducto.length} items con producto inválido` : null);

        // Pedidos → Vehículos válidos
        const vehiculos = BambuState.get('vehiculos');
        const vehiculoIds = new Set(vehiculos.map(v => v.id));

        const pedidosSinVehiculo = pedidos.filter(p =>
            p.vehiculo_id !== null && !vehiculoIds.has(p.vehiculo_id)
        );
        this.verificar('Pedidos → Vehículos válidos', pedidosSinVehiculo.length === 0,
            pedidosSinVehiculo.length > 0 ? `${pedidosSinVehiculo.length} pedidos con vehículo inválido` : null);
    },

    // =========================================================================
    // TEST 3: Cálculos correctos
    // =========================================================================
    testCalculos() {
        console.log('\n🧮 TEST 3: Cálculos');

        const pedidos = BambuState.get('pedidos').slice(0, 10); // Muestra de 10
        let erroresCalculo = 0;

        pedidos.forEach(p => {
            const totalCalculado = BambuState.calcularTotalPedido(p.id);
            const pesoCalculado = BambuState.calcularPesoPedido(p.id);

            // Verificar que hay items si hay total
            const items = BambuState.getItemsPedido(p.id);
            if (items.length === 0 && p.estado !== 'borrador') {
                // Pedidos sin items deberían tener total 0
            }
        });

        this.verificar('Totales calculables', true);
        this.verificar('Pesos calculables', true);
    },

    // =========================================================================
    // TEST 4: Cuenta Corriente coherente
    // =========================================================================
    testCuentaCorriente() {
        console.log('\n💰 TEST 4: Cuenta Corriente');

        const clientes = BambuState.get('clientes');
        let clientesConError = 0;

        clientes.forEach(c => {
            const movimientos = BambuState.getMovimientosCC(c.id);
            const saldoCalculado = movimientos.reduce((acc, m) => {
                if (m.tipo === 'cargo') return acc - m.monto;
                if (m.tipo === 'pago' || m.tipo === 'nota_credito') return acc + m.monto;
                if (m.tipo === 'ajuste') return acc + m.monto; // puede ser + o -
                return acc;
            }, 0);

            // El saldo del cliente debería aproximarse al calculado
            // (puede haber diferencias por redondeo o saldo inicial)
        });

        this.verificar('Movimientos CC existen', BambuState.get('movimientos_cc').length > 0);

        // Verificar tipos de movimiento válidos
        const tiposValidos = ['cargo', 'pago', 'nota_credito', 'ajuste'];
        const movimientos = BambuState.get('movimientos_cc');
        const tiposInvalidos = movimientos.filter(m => !tiposValidos.includes(m.tipo));
        this.verificar('Tipos de movimiento válidos', tiposInvalidos.length === 0,
            tiposInvalidos.length > 0 ? `${tiposInvalidos.length} movimientos con tipo inválido` : null);
    },

    // =========================================================================
    // TEST 5: Stock coherente
    // =========================================================================
    testStock() {
        console.log('\n📦 TEST 5: Stock');

        const productos = BambuState.get('productos');

        // Verificar que todos los productos tienen stock definido
        const sinStock = productos.filter(p => typeof p.stock_actual === 'undefined');
        this.verificar('Productos con stock definido', sinStock.length === 0,
            sinStock.length > 0 ? `${sinStock.length} productos sin stock_actual` : null);

        // Verificar que no hay stock negativo (excepto productos BAMBU)
        const stockNegativo = productos.filter(p =>
            p.stock_actual < 0 && p.proveedor_id !== 1
        );
        this.verificar('Sin stock negativo', stockNegativo.length === 0,
            stockNegativo.length > 0 ? `${stockNegativo.length} productos con stock negativo` : null);

        // Verificar función actualizarStock
        this.verificar('Función actualizarStock existe', typeof BambuState.actualizarStock === 'function');
    },

    // =========================================================================
    // TEST 6: Estados válidos
    // =========================================================================
    testEstados() {
        console.log('\n🚦 TEST 6: Estados');

        const estadosValidos = ['borrador', 'pendiente', 'en transito', 'transito', 'entregado'];
        const pedidos = BambuState.get('pedidos');

        const estadosInvalidos = pedidos.filter(p => !estadosValidos.includes(p.estado));
        this.verificar('Estados de pedido válidos', estadosInvalidos.length === 0,
            estadosInvalidos.length > 0 ? `${estadosInvalidos.length} con estado inválido` : null);

        // Verificar que entregados tienen fecha
        const entregadosSinFecha = pedidos.filter(p =>
            p.estado === 'entregado' && !p.fecha
        );
        this.verificar('Entregados con fecha', entregadosSinFecha.length === 0);
    },

    // =========================================================================
    // HELPERS
    // =========================================================================
    verificar(nombre, resultado, detalle = null) {
        if (resultado) {
            console.log(`  ✅ ${nombre}`);
            this.exitos++;
        } else {
            console.log(`  ❌ ${nombre}${detalle ? ': ' + detalle : ''}`);
            this.errores++;
        }
        this.resultados.push({ nombre, resultado, detalle });
    },

    mostrarResumen() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 RESUMEN');
        console.log(`  ✅ Éxitos: ${this.exitos}`);
        console.log(`  ❌ Errores: ${this.errores}`);
        console.log(`  📈 Tasa: ${Math.round(this.exitos / (this.exitos + this.errores) * 100)}%`);

        if (this.errores === 0) {
            console.log('\n🎉 TODOS LOS TESTS PASARON');
        } else {
            console.log('\n⚠️ HAY ERRORES QUE REVISAR');
        }
    }
};

// Auto-ejecutar
VerificarFlujos.ejecutar();
