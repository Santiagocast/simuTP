function procesarComprobantes(){
    t = t + tpe
    let trc = randomTiempoRecoleccionComprobantes();
    tpe = trc + t;

    ccr = randomCantidadComprobantesRecolectados();
    totalComprobantes = totalComprobantes + ccr;

    for (i = 0; i < ccr; i++) {
        pxc = randomPaginasPorComprobantes();
        let d= obtenerTiempoDeEscaneo(pxc);
        sumDemora += d;
        let minIndex = searchMinHilo(scannerThreads);
        if (scannerThreads[minIndex].tiempoComprometido > t+ minGoogleErr){ // estan caidos los 5 hilos
            let minTCDW = searchMinHilo(loteThreads);
            if (scannerThreads[minIndex].tiempoComprometido <= loteThreads[minTCDW].tiempoComprometido){
                asignarNuevoTiempoComprometido(scannerThreads[minIndex], d);
            }else{
                TPL[minTCDW] += d;
            }
        }else{
            asignarNuevoTiempoComprometido(scannerThreads[minIndex], d);
        }
        costo += costoCloudFunction
    }
}

function asignarNuevoTiempoComprometido(hilo, d){
    if (t< hilo.tiempoComprometido){
        hilo.tiempoComprometido += d;
    }else{
        hilo.tiempoComprometido = t + d;
    }

}

function obtenerTiempoDeEscaneo(paginas){
    let demora = obtenerDemora(fe1, r1, paginas);
    let googleErr = randomWithMinaAndMax(0, 1);
    if (googleErr < ProbabilityGoogleErr){ //error de google
        demora = demora + minGoogleErr;
    }

    if (huboError(fe1,r1)){ //error x (afip, fe y r no aptos, etc)
        let dem = obtenerDemora(fe2, r2, paginas);
        demora = demora + dem;
        googleErr = randomWithMinaAndMax(0, 1);
        if (googleErr < ProbabilityGoogleErr){ //error google
            demora = demora + minGoogleErr;
        }
        if (huboError(fe2, r2)){ //error x (afip, fe y r no aptos, etc)
            //resultados manuales
            cantErr++;
            costo += costoTarado
        }else{
            //se escanea con fe y r 2
            cant2Ok++;
        }
    }else{
        //no hubo error
        cant1Ok++;
    }
    return demora;
    
}

function obtenerDemora(factorDeEscala,resolucion, paginas){
    return ((8.27*resolucion)* (11,69*factorDeEscala)*(factorDeEscala*paginas))/vp
}

function randomTiempoRecoleccionComprobantes (){
    //tiempo de recoleccion de comprobantes devuelve un random entre 1 y 5 segundos
    randomWithMinaAndMax(5*60, 6*60)
}

function randomCantidadComprobantesRecolectados(){
    //cantidad de comprobantes recolectados devuelve un random entre 1 y 1000
    randomWithMinaAndMax(400, 800)
}

function randomPaginasPorComprobantes(){
    //cantidad de paginas por comprobante devuelve un random entre 1 y 10
    randomWithMinaAndMax(1, 3)
}

function huboError(factorDeEscala,resolucion){ //TODO devuelva booleano
    //factor de escala devuelve un random entre 0.5 y 1.5
    randomWithMinaAndMax(factorDeEscala, resolucion)

}

function randomWithMinaAndMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

