// ===== Datos de entrada =====
const gastos = [
  { descripcion: 'Pago de alquiler del apartamento', monto: 320, categoria: 'vivienda' },
  { descripcion: 'Recibo de electricidad', monto: 62.75, categoria: 'servicios' },
  { descripcion: 'Compra de verduras y frutas', monto: 28.9, categoria: 'alimentacion' },
  { descripcion: 'Cena con amigos', monto: 54.2, categoria: 'alimentacion' },
  { descripcion: 'Tarjeta de bus recargable', monto: 15, categoria: 'transporte' },
  { descripcion: 'Plan de internet', monto: 35.5, categoria: 'servicios' },
  { descripcion: 'Reparacion de la bicicleta', monto: 110, categoria: 'transporte' },
  { descripcion: 'Entrada al cine', monto: 8.25, categoria: 'entretenimiento' }
];

// ===== Funcion flecha reutilizable =====
const esGastoAlto = (monto) => monto >= 100;

// Evita decimales como 634.5999999999999 en el informe
const redondearADosDecimales = (valor) => Math.round(valor * 100) / 100;

// ===== Funciones requeridas =====
function calcularTotal(gastos) {
  let total = 0;
  for (let i = 0; i < gastos.length; i++) {
    if (typeof gastos[i].monto !== 'number') {
      throw new Error('El monto del gasto "' + gastos[i].descripcion + '" no es un numero');
    }
    total = total + gastos[i].monto;
  }
  return total;
}

function calcularPromedio(gastos) {
  if (gastos.length === 0) {
    throw new Error('No se puede calcular el promedio de una lista de gastos vacia');
  }
  return calcularTotal(gastos) / gastos.length;
}

function filtrarPorCategoria(gastos, categoria) {
  const gastosFiltrados = [];
  for (let i = 0; i < gastos.length; i++) {
    if (gastos[i].categoria === categoria) {
      gastosFiltrados[gastosFiltrados.length] = gastos[i];
    }
  }
  return gastosFiltrados;
}

function obtenerMayorGasto(gastos) {
  if (gastos.length === 0) {
    return null;
  }
  let mayorGasto = gastos[0];
  for (let i = 1; i < gastos.length; i++) {
    if (gastos[i].monto > mayorGasto.monto) {
      mayorGasto = gastos[i];
    }
  }
  return mayorGasto;
}

function clasificarGasto(monto) {
  if (esGastoAlto(monto)) {
    return 'Alto';
  } else if (monto >= 50) {
    return 'Medio';
  } else {
    return 'Bajo';
  }
}

function describirCategoria(categoria) {
  switch (categoria) {
    case 'vivienda':
      return 'Gastos del hogar como alquiler y reparaciones';
    case 'servicios':
      return 'Servicios basicos como luz e internet';
    case 'alimentacion':
      return 'Comida preparada en casa o consumida fuera';
    case 'transporte':
      return 'Movilidad diaria y mantenimiento de transporte';
    case 'entretenimiento':
      return 'Ocio y tiempo libre';
    default:
      return 'Categoria sin descripcion registrada';
  }
}

function crearContadorDeAltos() {
  let cantidadAltos = 0;
  return function () {
    cantidadAltos = cantidadAltos + 1;
    return cantidadAltos;
  };
}

// ===== Flujo principal =====
try {
  const gastosClasificados = [];
  const contarAlto = crearContadorDeAltos();
  let cantidadAltos = 0;

  for (let i = 0; i < gastos.length; i++) {
    const nivel = clasificarGasto(gastos[i].monto);
    gastosClasificados[gastosClasificados.length] = {
      descripcion: gastos[i].descripcion,
      monto: gastos[i].monto,
      categoria: gastos[i].categoria,
      nivel: nivel,
      descripcionCategoria: describirCategoria(gastos[i].categoria)
    };
    if (nivel === 'Alto') {
      cantidadAltos = contarAlto();
    }
  }

  console.log('=== Tabla de gastos clasificados ===');
  console.table(gastosClasificados);

  const total = calcularTotal(gastos);
  const promedio = calcularPromedio(gastos);
  console.log('Total gastado: $' + total.toFixed(2));
  console.log('Promedio por gasto: $' + promedio.toFixed(2));

  const mayorGasto = obtenerMayorGasto(gastos);
  console.log(
    'Gasto mas alto: ' + mayorGasto.descripcion +
    ' | Monto: $' + mayorGasto.monto.toFixed(2) +
    ' | Categoria: ' + mayorGasto.categoria
  );

  console.log('Cantidad de gastos altos (monto >= 100): ' + cantidadAltos);

  const categoriaElegida = 'alimentacion';
  const gastosDeCategoria = filtrarPorCategoria(gastos, categoriaElegida);
  console.log('Gastos de la categoria "' + categoriaElegida + '":', gastosDeCategoria);

  const resumenPorCategoria = {};
  for (let i = 0; i < gastos.length; i++) {
    const categoria = gastos[i].categoria;
    if (resumenPorCategoria[categoria] === undefined) {
      resumenPorCategoria[categoria] = 0;
    }
    resumenPorCategoria[categoria] = resumenPorCategoria[categoria] + gastos[i].monto;
  }

  for (const categoria in resumenPorCategoria) {
    resumenPorCategoria[categoria] = redondearADosDecimales(resumenPorCategoria[categoria]);
  }

  const informe = {
    total: redondearADosDecimales(total),
    promedio: redondearADosDecimales(promedio),
    cantidadAltos: cantidadAltos,
    mayorGasto: mayorGasto,
    resumenPorCategoria: resumenPorCategoria
  };
  console.log('=== Informe final ===');
  console.log(JSON.stringify(informe, null, 2));
} catch (error) {
  console.error('Ocurrio un error al procesar los gastos: ' + error.message);
}

// ===== Prueba controlada de error =====
try {
  calcularPromedio([]);
} catch (error) {
  console.log('Prueba controlada - error capturado: ' + error.message);
}
