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
// LISTAS DE PRECIO (Módulo Configuración)
// PRD: prd/configuracion.html - Sección 3.4
// Campos: id, nombre, descuento (%), umbral (null = sin umbral)
// ============================================================================

const LISTAS_PRECIO = [
  { id: 1, nombre: 'L2', descuento: 6.25, umbral: 50000 },
  { id: 2, nombre: 'L3', descuento: 10, umbral: 100000 },
];

// ============================================================================
// CONFIGURACIÓN DE STOCK (Módulo Configuración)
// PRD: prd/configuracion.html - Sección 3.5
// ============================================================================

const CONFIG_STOCK = {
  comportamiento: 'ADVERTIR', // 'ADVERTIR' | 'BLOQUEAR'
};

// ============================================================================
// CIUDADES (Módulo Configuración)
// PRD: prd/configuracion.html - Sección 3.3
// ============================================================================

const CIUDADES = [
  { id: 1, nombre: 'Neuquén', provincia: 'Neuquén', clientesAsociados: 5 },
  { id: 2, nombre: 'Cipolletti', provincia: 'Río Negro', clientesAsociados: 2 },
  { id: 3, nombre: 'Plottier', provincia: 'Neuquén', clientesAsociados: 2 },
  { id: 4, nombre: 'Centenario', provincia: 'Neuquén', clientesAsociados: 1 },
  { id: 5, nombre: 'Allen', provincia: 'Río Negro', clientesAsociados: 2 },
];

// ============================================================================
// PROVEEDORES
// Estructura según PRD productos.html
// ============================================================================

const PROVEEDORES = [
  { id: 1, nombre: 'Química del Sur' },
  { id: 2, nombre: 'Distribuidora Norte' },
  { id: 3, nombre: 'Limpieza Total S.A.' },
  { id: 4, nombre: 'Fabricación Propia' },
];

// ============================================================================
// PRODUCTOS
// Estructura completa según PRD prd/productos.html
// Campos: id, nombre, proveedor_id, proveedor_nombre, precio_l1, precio_l2, precio_l3,
//         stock_actual, stock_minimo, peso_kg, orden, disponible, en_promocion,
//         precio_promocional, created_at, updated_at
// ============================================================================

const PRODUCTOS = [
  {
    id: 1,
    nombre: 'Detergente Industrial 5L',
    proveedor_id: 1,
    proveedor_nombre: 'Química del Sur',
    precio_l1: 15000,
    precio_l2: 14062.50,  // L1 * 0.9375 (6.25% desc)
    precio_l3: 13500,     // L1 * 0.90 (10% desc)
    stock_actual: 150,
    stock_minimo: 30,
    peso_kg: 5.0,
    orden: 1,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-06-15',
    updated_at: '2025-12-20'
  },
  {
    id: 2,
    nombre: 'Lavandina Concentrada 2L',
    proveedor_id: 4,
    proveedor_nombre: 'Fabricación Propia',
    precio_l1: 3500,
    precio_l2: 3281.25,
    precio_l3: 3150,
    stock_actual: 300,
    stock_minimo: 50,
    peso_kg: 2.0,
    orden: 2,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-01-10',
    updated_at: '2025-12-18'
  },
  {
    id: 3,
    nombre: 'Desinfectante Multiuso 1L',
    proveedor_id: 1,
    proveedor_nombre: 'Química del Sur',
    precio_l1: 2200,
    precio_l2: 2062.50,
    precio_l3: 1980,
    stock_actual: 200,
    stock_minimo: 40,
    peso_kg: 1.0,
    orden: 3,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-03-20',
    updated_at: '2025-12-15'
  },
  {
    id: 4,
    nombre: 'Limpiador Pisos 5L',
    proveedor_id: 2,
    proveedor_nombre: 'Distribuidora Norte',
    precio_l1: 8500,
    precio_l2: 7968.75,
    precio_l3: 7650,
    stock_actual: 120,
    stock_minimo: 25,
    peso_kg: 5.0,
    orden: 4,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-02-05',
    updated_at: '2025-12-22'
  },
  {
    id: 5,
    nombre: 'Jabón Líquido Manos 500ml',
    proveedor_id: 3,
    proveedor_nombre: 'Limpieza Total S.A.',
    precio_l1: 1800,
    precio_l2: 1687.50,
    precio_l3: 1620,
    stock_actual: 250,
    stock_minimo: 60,
    peso_kg: 0.5,
    orden: 5,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-04-12',
    updated_at: '2025-12-10'
  },
  {
    id: 6,
    nombre: 'Alcohol en Gel 1L',
    proveedor_id: 1,
    proveedor_nombre: 'Química del Sur',
    precio_l1: 4500,
    precio_l2: 4218.75,
    precio_l3: 4050,
    stock_actual: 18,  // ⚠️ Stock bajo (< stock_minimo)
    stock_minimo: 40,
    peso_kg: 1.0,
    orden: 6,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-05-08',
    updated_at: '2025-12-28'
  },
  {
    id: 7,
    nombre: 'Desengrasante Cocina 750ml',
    proveedor_id: 2,
    proveedor_nombre: 'Distribuidora Norte',
    precio_l1: 3200,
    precio_l2: 3000,
    precio_l3: 2880,
    stock_actual: 160,
    stock_minimo: 35,
    peso_kg: 0.75,
    orden: 7,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-07-22',
    updated_at: '2025-12-05'
  },
  {
    id: 8,
    nombre: 'Limpia Vidrios 500ml',
    proveedor_id: 3,
    proveedor_nombre: 'Limpieza Total S.A.',
    precio_l1: 1500,
    precio_l2: 1406.25,
    precio_l3: 1350,
    stock_actual: 220,
    stock_minimo: 50,
    peso_kg: 0.5,
    orden: 8,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-08-14',
    updated_at: '2025-12-12'
  },
  {
    id: 9,
    nombre: 'Pack Limpieza Hogar Completo',
    proveedor_id: null,
    proveedor_nombre: '-',
    precio_l1: 18000,
    precio_l2: 18000,  // Ignorado si en_promocion
    precio_l3: 18000,
    stock_actual: 25,
    stock_minimo: 10,
    peso_kg: 8.0,
    orden: 9,
    disponible: true,
    en_promocion: true,  // 🏷 PROMOCIÓN
    precio_promocional: 15000,
    created_at: '2025-11-01',
    updated_at: '2025-12-26'
  },
  {
    id: 10,
    nombre: 'Cloro Concentrado 5L',
    proveedor_id: 4,
    proveedor_nombre: 'Fabricación Propia',
    precio_l1: 4200,
    precio_l2: 3937.50,
    precio_l3: 3780,
    stock_actual: 8,  // ⚠️ Stock MUY bajo
    stock_minimo: 30,
    peso_kg: 5.0,
    orden: 10,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-09-03',
    updated_at: '2025-12-29'
  },
  {
    id: 11,
    nombre: 'Suavizante Ropa 3L',
    proveedor_id: 2,
    proveedor_nombre: 'Distribuidora Norte',
    precio_l1: 5800,
    precio_l2: 5437.50,
    precio_l3: 5220,
    stock_actual: 95,
    stock_minimo: 20,
    peso_kg: 3.0,
    orden: 11,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2024-10-18',
    updated_at: '2025-12-14'
  },
  {
    id: 12,
    nombre: 'Producto Descontinuado Viejo',
    proveedor_id: 1,
    proveedor_nombre: 'Química del Sur',
    precio_l1: 2500,
    precio_l2: 2343.75,
    precio_l3: 2250,
    stock_actual: 5,
    stock_minimo: 10,
    peso_kg: 1.5,
    orden: 12,
    disponible: false,  // ❌ NO DISPONIBLE
    en_promocion: false,
    precio_promocional: null,
    created_at: '2023-05-10',
    updated_at: '2025-06-01'
  },
  {
    id: 13,
    nombre: 'Pack Oficina Premium',
    proveedor_id: null,
    proveedor_nombre: '-',
    precio_l1: 12000,
    precio_l2: 12000,
    precio_l3: 12000,
    stock_actual: 15,
    stock_minimo: 5,
    peso_kg: 6.0,
    orden: 13,
    disponible: true,
    en_promocion: true,  // 🏷 PROMOCIÓN
    precio_promocional: 9500,
    created_at: '2025-10-15',
    updated_at: '2025-12-20'
  },
  {
    id: 14,
    nombre: 'Limpiador Multiusos Concentrado 1L',
    proveedor_id: 1,
    proveedor_nombre: 'Química del Sur',
    precio_l1: 2800,
    precio_l2: 2625,
    precio_l3: 2520,
    stock_actual: 180,
    stock_minimo: 40,
    peso_kg: 1.0,
    orden: 14,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2025-01-20',
    updated_at: '2025-12-18'
  },
  {
    id: 15,
    nombre: 'Cera Pisos Autobrillante 5L',
    proveedor_id: 3,
    proveedor_nombre: 'Limpieza Total S.A.',
    precio_l1: 9500,
    precio_l2: 8906.25,
    precio_l3: 8550,
    stock_actual: 45,
    stock_minimo: 15,
    peso_kg: 5.2,
    orden: 15,
    disponible: true,
    en_promocion: false,
    precio_promocional: null,
    created_at: '2025-02-28',
    updated_at: '2025-12-22'
  }
];

// ============================================================================
// MOVIMIENTOS DE STOCK (historial)
// Estructura según PRD productos.html sección 4.7
// ============================================================================

const MOVIMIENTOS_STOCK = [
  { id: 1, producto_id: 6, tipo: 'EGRESO', cantidad: 50, motivo: 'Pedido #00521', pedido_id: 521, stock_resultante: 18, usuario_id: 1, created_at: '2025-12-28 14:30:00' },
  { id: 2, producto_id: 10, tipo: 'EGRESO', cantidad: 30, motivo: 'Pedido #00519', pedido_id: 519, stock_resultante: 8, usuario_id: 1, created_at: '2025-12-29 09:15:00' },
  { id: 3, producto_id: 1, tipo: 'INGRESO', cantidad: 100, motivo: 'Producción lote #245', pedido_id: null, stock_resultante: 150, usuario_id: 1, created_at: '2025-12-20 11:00:00' },
  { id: 4, producto_id: 2, tipo: 'INGRESO', cantidad: 200, motivo: 'Producción lote #246', pedido_id: null, stock_resultante: 300, usuario_id: 1, created_at: '2025-12-18 10:30:00' },
  { id: 5, producto_id: 9, tipo: 'AJUSTE', cantidad: -5, motivo: 'Rotura en almacén', pedido_id: null, stock_resultante: 25, usuario_id: 1, created_at: '2025-12-26 16:45:00' },
];

// ============================================================================
// CLIENTES
// Estructura completa para módulo clientes.html
// Campos: id, direccion, telefono, ciudad, saldo, estado, lista_precio, email, nota
// ============================================================================

const CLIENTES = [
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

// ============================================================================
// VEHÍCULOS (Módulo Configuración)
// PRD: prd/configuracion.html - Sección 3.2
// Campos: id, nombre, capacidadKg, pedidosAsignados
// ============================================================================

const VEHICULOS = [
  { id: 1, nombre: 'Reparto 1', capacidadKg: 2500, modelo: 'Fiat Fiorino', patente: 'AB 123 CD' },
  { id: 2, nombre: 'Reparto 2', capacidadKg: 1500, modelo: 'Renault Kangoo', patente: null },
  { id: 3, nombre: 'Reparto 3', capacidadKg: 2250, modelo: null, patente: null },
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
// BACKUPS (Módulo Backup y Logs)
// PRD: prd/backup.html - Sección 3.2
// ============================================================================

const BACKUPS = [
  { id: 1, fecha: '2026-01-06 14:30:00', tamanoBytes: 2621440, tipo: 'MANUAL' },
  { id: 2, fecha: '2026-01-05 23:00:00', tamanoBytes: 2516582, tipo: 'AUTOMATICO' },
  { id: 3, fecha: '2026-01-04 23:00:00', tamanoBytes: 2498764, tipo: 'AUTOMATICO' },
  { id: 4, fecha: '2026-01-03 23:00:00', tamanoBytes: 2450123, tipo: 'AUTOMATICO' },
  { id: 5, fecha: '2026-01-02 10:15:00', tamanoBytes: 2389456, tipo: 'MANUAL' },
];

// ============================================================================
// LOGS DEL SISTEMA (Módulo Backup y Logs)
// PRD: prd/backup.html - Sección 3.3
// Tipos: ACCESO | STOCK | CONFIGURACION
// ============================================================================

const LOGS_SISTEMA = [
  { id: 1, fecha: '2026-01-06 14:35:00', usuario: 'admin@bambu.com', tipo: 'STOCK', descripcion: 'Ajuste manual: Detergente 5L (+100 un)', ip: '192.168.1.100' },
  { id: 2, fecha: '2026-01-06 14:20:00', usuario: 'admin@bambu.com', tipo: 'ACCESO', descripcion: 'Login exitoso', ip: '192.168.1.100' },
  { id: 3, fecha: '2026-01-06 10:15:00', usuario: 'vendedor@bambu.com', tipo: 'ACCESO', descripcion: 'Login exitoso', ip: '192.168.1.105' },
  { id: 4, fecha: '2026-01-05 18:30:00', usuario: 'admin@bambu.com', tipo: 'CONFIGURACION', descripcion: 'Modificó lista L2: 6.25% → 7%', ip: '192.168.1.100' },
  { id: 5, fecha: '2026-01-05 17:45:00', usuario: 'admin@bambu.com', tipo: 'ACCESO', descripcion: 'Logout', ip: '192.168.1.100' },
  { id: 6, fecha: '2026-01-05 09:00:00', usuario: 'admin@bambu.com', tipo: 'ACCESO', descripcion: 'Login exitoso', ip: '192.168.1.100' },
  { id: 7, fecha: '2026-01-04 16:20:00', usuario: 'admin@bambu.com', tipo: 'STOCK', descripcion: 'Ajuste manual: Lavandina 1L (-50 un) - Rotura', ip: '192.168.1.100' },
  { id: 8, fecha: '2026-01-04 11:30:00', usuario: 'vendedor@bambu.com', tipo: 'ACCESO', descripcion: 'Login fallido - Contraseña incorrecta', ip: '192.168.1.105' },
  { id: 9, fecha: '2026-01-03 15:00:00', usuario: 'admin@bambu.com', tipo: 'CONFIGURACION', descripcion: 'Creó vehículo: Reparto 3', ip: '192.168.1.100' },
  { id: 10, fecha: '2026-01-03 14:00:00', usuario: 'admin@bambu.com', tipo: 'CONFIGURACION', descripcion: 'Agregó ciudad: San Martín de los Andes', ip: '192.168.1.100' },
];

// ============================================================================
// PEDIDOS_PRODUCTOS (Detalle de productos por pedido)
// Para módulo Estadísticas - PRD: prd/estadisticas.html
// Estructura: pedido_id, producto_id, cantidad, precio_unitario
// ============================================================================

const PEDIDOS_PRODUCTOS = generatePedidosProductos();

function generatePedidosProductos() {
  const items = [];
  let itemId = 1;

  // Solo pedidos NO borrador (para estadísticas)
  const pedidosValidos = PEDIDOS.filter(p => p.estado !== 'borrador');

  pedidosValidos.forEach(pedido => {
    // Generar entre 2 y 6 productos por pedido
    const numProductos = Math.floor(Math.random() * 5) + 2;
    const productosUsados = new Set();
    let totalPedido = 0;

    for (let i = 0; i < numProductos; i++) {
      // Elegir producto aleatorio no repetido
      let productoId;
      do {
        productoId = Math.floor(Math.random() * 15) + 1;
      } while (productosUsados.has(productoId));
      productosUsados.add(productoId);

      const producto = PRODUCTOS.find(p => p.id === productoId);
      if (!producto) continue;

      // Cantidad entre 1 y 20 unidades
      const cantidad = Math.floor(Math.random() * 20) + 1;

      // Precio según lista del cliente (simulado L1/L2/L3)
      const listas = ['precio_l1', 'precio_l2', 'precio_l3'];
      const listaRandom = listas[Math.floor(Math.random() * listas.length)];
      const precioUnitario = producto.en_promocion
        ? producto.precio_promocional
        : producto[listaRandom];

      items.push({
        id: itemId++,
        pedido_id: pedido.id,
        producto_id: productoId,
        producto_nombre: producto.nombre,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal: cantidad * precioUnitario
      });

      totalPedido += cantidad * precioUnitario;
    }

    // Actualizar total del pedido para consistencia
    pedido.total = totalPedido;
  });

  return items;
}

// ============================================================================
// EXPORTS (para usar en prototipos HTML)
// ============================================================================

// <script src="shared/mock-data.js"></script>
// Luego acceder con: PRODUCTOS, CLIENTES, PEDIDOS, VEHICULOS, PEDIDOS_PRODUCTOS, etc.
