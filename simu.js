  //Variables de configuracion 
  let loteThreads = new Array();
  let scannerThreads = new Array();
  var TPL = new Array();
  const cantidadLotes = 5
  const cantidadScanners = 5
  var tpe = 0;
  var demoraLote;
  const cantidadComprobantesPorLote = 200
  const costoTarado = 0.104;

  //variables de control
  const fe1 = 2;
  const fe2 = 3;
  const r1 = 300;
  const r2 = 400;

  //Tiempo de simulacion  
  const totalTime = 31536000; // un año en segs

  //Datos de google
  const costoCloudFunction = 0.004;
  const vp = 6250000; //velocidad de procesamiento de CF por pixel
  const minGoogleErr = 60*5;
  const ProbabilityGoogleErr = 0.005;
  const ProbabilityGenericErr = 0.3;
  //Resultados
  var lhp = 0;
  var sumDemoraLote = 0;
  var costo = 0;
  var totalComprobantes = 0;
  var cant1Ok = 0;
  var cant2Ok = 0;
  var cantErr = 0;
  var sumDemora = 0;
  
  //declaro condiciones iniciales
  initializeAllVars();
  while (t<totalTime){
    let minIndex = searchMinHilo(loteThreads);
    if (tpe <= loteThreads[minIndex].tiempoComprometido) {
      procesarComprobantes();
    } else {
      procesarLotes(minIndex);
    }
  }
  // imprimir resultados interpolados
  console.log("Resultados de la simulacion\n")
  console.log("Costo: "+ costo + "\n")
  console.log("Porcentajes de comprobantes exitosos con la primera configuración: "+ cant1Ok/totalComprobantes + "\n")
  console.log("Porcentajes de comprobantes exitosos con la segunda configuración: "+ cant2Ok/totalComprobantes + "\n")
  console.log("Porcentajes de comprobantes con error: "+ cantErr/totalComprobantes + "\n")
  console.log("Duración promedio de procesamiento de lectura de QR: "+ sumDemora/totalComprobantes + "\n")
  console.log("Duración promedio de carga de lote: "+ sumDemoraLote/lhp + "\n")
  console.log("Cantidad de lotes procesados: "+ lhp + "\n")
  console.log("Cantidad de comprobantes procesados: "+ totalComprobantes + "\n")
  console.log("fin de la simulacion PAJIN")
  
  function initializeAllVars() {
    var t = 0;
    for (let i = 0; i < cantidadLotes; i++) {
      loteThreads.push(new Hilo());
    }
    for (let i = 0; i < cantidadScanners; i++) {
      scannerThreads.push(new Hilo());
    }
    for (let i = 0; i < cantidadLotes; i++) {
      TPL.push(0);
    }
  }