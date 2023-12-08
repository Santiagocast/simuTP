function procesarLotes(minIndex){
    let demoraLote = 0;
    for (let i = 0; i < cantidadComprobantesPorLote; i++) { 
        let pxc = randomPaginasPorComprobantes()
        demoraLote += 2*pxc;
    }
    TPL[minIndex] += demoraLote;
    loteThreads[minIndex].tiempoComprometido = TPL[minIndex];
    lhp ++;
    sumDemoraLote += demoraLote;
    costo += costoCloudFunction
}