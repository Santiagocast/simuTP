class Hilo {
    constructor() {
      this.tiempoComprometido = 0;
    }
  }
  
function searchMinHilo(arrHilo) {
if (arrHilo.length === 0) {
    console.log('flaco no pusiste hilos');
    return null;
}

let minIndex = 0;
let minValue = arrHilo[0].tiempoComprometido;
for (let i = 1; i < arrHilo.length; i++) {
    if (arrHilo[i].tiempoComprometido < minValue) {
        minIndex = i;
        minValue = arrHilo[i].tiempoComprometido;
    }
}
return arrHilo[minIndex];
}

