function procesarComprobantes(){
    t = t + tpe
    trc = randomTiempoRecoleccionComprobantes();
    tpe = trc + t;

    ccr = randomCantidadComprobantesRecolectados();
    for (i = 0; i < ccr; i++) {
        pxc = randomPaginasPorComprobantes();
        d= obtenerTiempoDeEscaneo(pxc);
        minTCE = searchMinHilo(scannerThreads);
        if ( minTCE.tiempoComprometido > t+ minGoogleErr){ // estan caidos los 5 hilos
            //Buscar menor TCDW j  
            //TODO ver con los chicos
        }else{
            asignarNuevoTiempoComprometido(minTCE, d);
        }
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
    let genericErr = randomWithMinaAndMax(0, 1);
    if (genericErr < ProbabilityGenericErr){ //error x (afip, fe y r no aptos, etc)
        demora = demora + obtenerDemora(fe2, r2, paginas);
        googleErr = randomWithMinaAndMax(0, 1);
        if (googleErr < ProbabilityGoogleErr){ //error google
            demora = demora + minGoogleErr;
        }
        genericErr = randomWithMinaAndMax(0, 1);
        if (genericErr < ProbabilityGenericErr){ //error x (afip, fe y r no aptos, etc)
            //no se puede escanear resultados manuales
        }
    }
    
}

function obtenerDemora(factorDeEscala,resolucion, paginas){
    return ((8.27*resolucion)* (11,69*factorDeEscala)*(factorDeEscala*paginas))/vp
}

function randomTiempoRecoleccionComprobantes (){
    //tiempo de recoleccion de comprobantes devuelve un random entre 1 y 5 segundos
    randomWithMinaAndMax(1, 5)
}

function randomCantidadComprobantesRecolectados(){
    //cantidad de comprobantes recolectados devuelve un random entre 1 y 1000
    randomWithMinaAndMax(1, 1000)
}

function randomPaginasPorComprobantes(){
    //cantidad de paginas por comprobante devuelve un random entre 1 y 10
    randomWithMinaAndMax(1, 10)
}

function randomWithMinaAndMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

