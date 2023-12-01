class Hilo {
    constructor() {
      this.tProx = 0;
    }
  }
  
function searchMinHilo(arrHilo) {
if (arrHilo.length === 0) {
    console.log('flaco no pusiste hilos de lotes');
    return null;
}

let minIndex = 0;
let minValue = arrHilo[0].tProx;
for (let i = 1; i < arrHilo.length; i++) {
    if (arrHilo[i].tProx < minValue) {
        minIndex = i;
        minValue = arrHilo[i].tProx;
    }
}
return arrHilo[minIndex];
}

