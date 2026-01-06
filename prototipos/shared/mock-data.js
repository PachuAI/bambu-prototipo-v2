/**
 * MOCK DATA - Bambu CRM V2 Prototipo
 * Datos centralizados para todos los prototipos
 *
 * ESTRUCTURA BASADA EN PROTOTIPOS EXISTENTES - NO INVENTAR CAMPOS
 */

// ============================================================================
// CONFIGURACIÓN GENERAL
// ============================================================================

const CONFIG = {
  nombreEmpresa: 'Química Bambu S.R.L.',
  ubicacion: 'Neuquén, Argentina',
  listasPrecios: ['L1', 'L2', 'L3'],
  moneda: 'ARS',
};

// ============================================================================
// PRODUCTOS
// Estructura extraída de: prototipos/assets/cotizador/script.js
// Campos: id, name, price (L1), stock, weight
// ============================================================================

const PRODUCTOS = [
  { id: 1, name: 'Detergente Industrial 5L', price: 15000, stock: 150, weight: 5.0 },
  { id: 2, name: 'Lavandina Concentrada 2L', price: 3500, stock: 300, weight: 2.0 },
  { id: 3, name: 'Desinfectante Multiuso 1L', price: 2200, stock: 200, weight: 1.0 },
  { id: 4, name: 'Limpiador Pisos 5L', price: 8500, stock: 120, weight: 5.0 },
  { id: 5, name: 'Jabón Líquido Manos 500ml', price: 1800, stock: 250, weight: 0.5 },
  { id: 6, name: 'Alcohol en Gel 1L', price: 4500, stock: 180, weight: 1.0 },
  { id: 7, name: 'Desengrasante Cocina 750ml', price: 3200, stock: 160, weight: 0.75 },
  { id: 8, name: 'Limpia Vidrios 500ml', price: 1500, stock: 220, weight: 0.5 },
];

// ============================================================================
// CLIENTES
// Estructura extraída de: prototipos/assets/cotizador/script.js
// Campos: id, name (DIRECCIÓN), phone, address, discount
// NO usar: CUIT, razon_social, email (opcional si se agrega después)
// ============================================================================

const CLIENTES = [
  { id: 1, name: 'ARAUCARIAS 371', phone: '299-4567890', address: 'Araucarias 371', discount: 0 },
  { id: 2, name: 'PELLEGRINI 615', phone: '299-4567891', address: 'Pellegrini 615', discount: 10 },
  { id: 3, name: 'SAN LUIS 372', phone: '299-4567892', address: 'San Luis 372', discount: 0 },
  { id: 4, name: 'MITRE 4735', phone: '299-4567893', address: 'Mitre 4735', discount: 6.25 },
  { id: 5, name: 'ECUADOR 2133', phone: '299-4567894', address: 'Ecuador 2133', discount: 0 },
  { id: 6, name: 'AV. ARGENTINA 825', phone: '299-4567895', address: 'Av. Argentina 825', discount: 10 },
  { id: 7, name: 'CUENCA 16 MZA 7', phone: '299-4567896', address: 'Cuenca 16 Mza 7', discount: 0 },
  { id: 8, name: 'ALMAFUERTE 1245', phone: '299-4567897', address: 'Almafuerte 1245', discount: 6.25 },
];

// ============================================================================
// VEHÍCULOS
// Estructura extraída de: prototipos/assets/repartos/script.js
// Campos: id, nombre, patente, badge, capacidadKg
// ============================================================================

const VEHICULOS = [
  { id: 'r1', nombre: 'Mercedes-Benz Sprinter', patente: 'AB123CD', badge: 'REPARTO 1', capacidadKg: 2500 },
  { id: 'r2', nombre: 'Toyota Hiace', patente: 'EF456GH', badge: 'REPARTO 2', capacidadKg: 1500 },
  { id: 'r3', nombre: 'Renault Master', patente: 'IJ789KL', badge: 'REPARTO 3', capacidadKg: 2250 },
];

// ============================================================================
// PEDIDOS / VENTAS
// Estructura extraída de: prototipos/assets/ventas/script.js
// Campos: id, numero, fecha, fechaDisplay, cliente (dirección), direccion, ciudad,
//         tipo, estado, vehiculo, total, items (número), peso, metodoPago,
//         montoEfectivo, montoDigital, fechaEntrega, nota
// ============================================================================

/**
 * Genera ~83 pedidos distribuidos en la semana 23-27/12/2025
 *
 * HOY = 26/12/2025 (Jueves)
 *
 * Lógica de control a DÍA VENCIDO (repartidores vuelven tarde):
 * - 23/12 (Lunes): Hace 3 días → CONTROLADO ✅ (todos entregados)
 * - 24/12 (Martes): Hace 2 días → CONTROLADO ✅ (todos entregados)
 * - 25/12 (Miércoles - Navidad): AYER → A CONTROLAR 📋 (controlando HOY)
 * - 26/12 (Jueves): HOY → Repartos saliendo ahora (control mañana)
 * - 27/12 (Viernes): MAÑANA → Preparando repartos
 *
 * Estados: borrador, pendiente, asignado, en transito, entregado
 */
const PEDIDOS = generatePedidos();

function generatePedidos() {
  const pedidos = [];
  let id = 500;

  const direcciones = [
    'ARAUCARIAS 371', 'PELLEGRINI 615', 'SAN LUIS 372', 'MITRE 4735', 'ECUADOR 2133',
    'AV. ARGENTINA 825', 'CUENCA 16 MZA 7', 'ALMAFUERTE 1245', 'CHIGGINIS 665 LOTE 18',
    '9 DE JULIO 902', 'SAN LORENZO M2A 44', 'GENERAL PAZ 1461', 'LAS RETAMAS 1091',
    'CATAMARCA 662', 'URUGUAY 482', 'SARMIENTO 1820', 'ROCA 445', 'BELGRANO 892',
  ];

  const ciudades = ['Neuquén', 'Cipolletti', 'Plottier', 'Centenario'];
  const vehiculos = ['Reparto 1', 'Reparto 2', 'Reparto 3'];

  // Helper: Crea pedido
  function crearPedido(fecha, tipo, estado, vehiculo, obs = '') {
    const esFabrica = tipo === 'fabrica';
    const dir = esFabrica ? 'VENTA FÁBRICA' : direcciones[Math.floor(Math.random() * direcciones.length)];
    const ciudad = esFabrica ? 'Neuquén' : ciudades[Math.floor(Math.random() * ciudades.length)];
    const items = Math.floor(Math.random() * 8) + 2;
    const peso = parseFloat((Math.random() * 40 + 10).toFixed(1));
    const total = Math.floor(Math.random() * 180000) + 20000;

    const pedido = {
      id: id++,
      numero: `#00${id}`,
      fecha,
      fechaDisplay: fecha.split('-').reverse().map(p => p.slice(-2)).join('/'),
      cliente: dir,
      direccion: esFabrica ? 'Belgrano 663' : dir,
      ciudad,
      tipo,
      estado,
      vehiculo: esFabrica ? null : vehiculo,
      total,
      items,
      peso,
      metodoPago: null,
      montoEfectivo: null,
      montoDigital: null,
      fechaEntrega: null,
      nota: obs,
    };

    // Si está entregado, asignar método de pago
    if (estado === 'entregado') {
      const metodos = ['efectivo', 'digital', 'mixto'];
      const metodo = metodos[Math.floor(Math.random() * metodos.length)];
      pedido.metodoPago = metodo;

      if (metodo === 'efectivo') {
        pedido.montoEfectivo = total;
      } else if (metodo === 'digital') {
        pedido.montoDigital = total;
      } else {
        const efectivo = Math.floor(total * 0.6);
        pedido.montoEfectivo = efectivo;
        pedido.montoDigital = total - efectivo;
      }

      const horas = String(Math.floor(Math.random() * 12) + 9).padStart(2, '0');
      const mins = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      pedido.fechaEntrega = `${fecha}T${horas}:${mins}:00`;
    }

    return pedido;
  }

  // ========================================================================
  // LUNES 23/12/2025 - DÍA CONTROLADO (18 pedidos - TODOS ENTREGADOS)
  // ========================================================================

  // 14 repartos entregados
  for (let i = 0; i < 14; i++) {
    const veh = vehiculos[i % 3];
    pedidos.push(crearPedido('2025-12-23', 'reparto', 'entregado', veh, ''));
  }

  // 4 fábrica entregados
  for (let i = 0; i < 4; i++) {
    pedidos.push(crearPedido('2025-12-23', 'fabrica', 'entregado', null, 'Retiró en planta'));
  }

  // ========================================================================
  // MARTES 24/12/2025 - DÍA CONTROLADO (16 pedidos - TODOS ENTREGADOS)
  // ========================================================================

  // 12 repartos entregados
  for (let i = 0; i < 12; i++) {
    const veh = vehiculos[i % 3];
    pedidos.push(crearPedido('2025-12-24', 'reparto', 'entregado', veh, ''));
  }

  // 4 fábrica entregados
  for (let i = 0; i < 4; i++) {
    pedidos.push(crearPedido('2025-12-24', 'fabrica', 'entregado', null, 'Retiró en planta'));
  }

  // ========================================================================
  // MIÉRCOLES 25/12/2025 - NAVIDAD - AYER (14 pedidos - A CONTROLAR HOY)
  // ========================================================================

  // 8 repartos entregados (ya controlados hoy)
  for (let i = 0; i < 8; i++) {
    const veh = vehiculos[i % 3];
    pedidos.push(crearPedido('2025-12-25', 'reparto', 'entregado', veh, ''));
  }

  // 3 repartos en tránsito (aún controlando)
  for (let i = 0; i < 3; i++) {
    const veh = vehiculos[i % 3];
    pedidos.push(crearPedido('2025-12-25', 'reparto', 'en transito', veh, 'Pendiente confirmar entrega'));
  }

  // 3 fábrica entregados
  for (let i = 0; i < 3; i++) {
    pedidos.push(crearPedido('2025-12-25', 'fabrica', 'entregado', null, 'Retiró en planta'));
  }

  // ========================================================================
  // JUEVES 26/12/2025 - HOY (16 pedidos - REPARTOS SALIENDO AHORA)
  // ========================================================================

  // 9 repartos en tránsito (ya salieron)
  for (let i = 0; i < 9; i++) {
    const veh = vehiculos[i % 3];
    pedidos.push(crearPedido('2025-12-26', 'reparto', 'en transito', veh, 'En reparto'));
  }

  // 5 repartos asignados (listos para salir)
  for (let i = 0; i < 5; i++) {
    const veh = vehiculos[i % 3];
    pedidos.push(crearPedido('2025-12-26', 'reparto', 'asignado', veh, 'Listo para despachar'));
  }

  // 2 fábrica entregados (retiraron temprano)
  for (let i = 0; i < 2; i++) {
    pedidos.push(crearPedido('2025-12-26', 'fabrica', 'entregado', null, 'Retiró en planta'));
  }

  // ========================================================================
  // VIERNES 27/12/2025 - MAÑANA (16 pedidos - PREPARANDO REPARTOS)
  // ========================================================================

  // 9 repartos pendientes (sin vehículo)
  for (let i = 0; i < 9; i++) {
    pedidos.push(crearPedido('2025-12-27', 'reparto', 'pendiente', null, 'Pendiente asignar vehículo'));
  }

  // 5 repartos asignados (ya tienen vehículo)
  for (let i = 0; i < 5; i++) {
    const veh = vehiculos[i % 3];
    pedidos.push(crearPedido('2025-12-27', 'reparto', 'asignado', veh, 'Programado para mañana'));
  }

  // 2 fábrica pendientes (retirarán mañana)
  for (let i = 0; i < 2; i++) {
    pedidos.push(crearPedido('2025-12-27', 'fabrica', 'pendiente', null, 'Cliente retira mañana'));
  }

  // ========================================================================
  // BORRADORES (sin fecha definida)
  // ========================================================================

  for (let i = 0; i < 3; i++) {
    const dir = direcciones[Math.floor(Math.random() * direcciones.length)];
    const items = Math.floor(Math.random() * 6) + 1;
    const peso = parseFloat((Math.random() * 30 + 5).toFixed(1));
    const total = Math.floor(Math.random() * 100000) + 15000;

    pedidos.push({
      id: id++,
      numero: `#00${id}`,
      fecha: null,
      fechaDisplay: null,
      cliente: dir,
      direccion: dir,
      ciudad: ciudades[Math.floor(Math.random() * ciudades.length)],
      tipo: 'reparto',
      estado: 'borrador',
      vehiculo: null,
      total,
      items,
      peso,
      metodoPago: null,
      montoEfectivo: null,
      montoDigital: null,
      fechaEntrega: null,
      nota: 'Pendiente confirmar fecha',
    });
  }

  return pedidos;
}

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

function getClienteById(id) {
  return CLIENTES.find(c => c.id === id);
}

function getProductoById(id) {
  return PRODUCTOS.find(p => p.id === id);
}

function getVehiculoById(id) {
  return VEHICULOS.find(v => v.id === id);
}

function getPedidosByFecha(fecha) {
  return PEDIDOS.filter(p => p.fecha === fecha);
}

function getPedidosByEstado(estado) {
  return PEDIDOS.filter(p => p.estado === estado);
}

// ============================================================================
// EXPORTS (para usar en prototipos HTML)
// ============================================================================

// <script src="shared/mock-data.js"></script>
// Luego acceder con: PRODUCTOS, CLIENTES, PEDIDOS, VEHICULOS, etc.
