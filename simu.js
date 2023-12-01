  const totalTime = 31536000; // un año en segs
  var t = 0;
  let loteThreads = new Array();
  const cantidadLotes = 5
  let scannerThreads = new Array();
  const cantidadScanners = 5
  var tpe;
  const fe1 = 0.5;
  const fe2 = 1.5;
  const r1 = 0.5;
  const r2 = 1.5;
  const minGoogleErr = 60*5;
  const ProbabilityGoogleErr = 0.005;
  const ProbabilityGenericErr = 0.3;
  const vp = 6250000; //velocidad de procesamiento de CF por pixel
  
  
  //declaro condiciones iniciales
  initializeAllVars();
  for (t; t < totalTime; t++) {
    minTPL = searchMinHilo(loteThreads);
    if (tpe <= minTPL.tiempoComprometido) {
      procesarComprobantes();
    } else {
      procesarLotes();
    }
  }
  console.log("fin de la simulacion")
  
  function initializeAllVars() {
    for (let i = 0; i < cantidadLotes; i++) {
      loteThreads.push(new Hilo());
    }
    for (let i = 0; i < cantidadScanners; i++) {
      scannerThreads.push(new Hilo());
    }
    tpe = 0;
  }
  
  