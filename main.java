import java.util.ArrayList;
import java.util.List;
import java.util.Random;

class Main {
    // Variables de configuración
    private  List<Hilo> loteThreads = new ArrayList<>();
    private  List<Hilo> scannerThreads = new ArrayList<>();
    private  List<Integer> TPL = new ArrayList<>();
    private  final int cantidadLotes = 5;
    private  final int cantidadScanners = 5;
    private  int tpe = 0;
    public  int t = 0;
    private  int demoraLote;
    private  final int cantidadComprobantesPorLote = 200;
    private  final double costoTarado = 0.104;

    // Variables de control
    private  final int fe1 = 2;
    private  final int fe2 = 3;
    private  final int r1 = 300;
    private  final int r2 = 400;

    // Tiempo de simulación
    private  final int totalTime = 31536000/6; // un año en segs

    // Datos de Google
    private  final double costoCloudFunction = 0.004;
    private  final int vp = 6250000; // velocidad de procesamiento de CF por pixel
    private  final int minGoogleErr = 60 * 5;
    private  final double ProbabilityGoogleErr = 0.005;
    private  final double ProbabilityGenericErr = 0.3;

    // Resultados
    private  int lhp = 0;
    private  int sumDemoraLote = 0;
    private  double costo = 0;
    private  int totalComprobantes = 0;
    private  int cant1Ok = 0;
    private  int cant2Ok = 0;
    private  int cantErr = 0;
    private  double sumDemora = 0;

    public static void main(String[] args) {
        Main myProgram = new Main();
        myProgram.run();
    }
    public void run() {
        // Declarar condiciones iniciales
        initializeAllVars();

        while (t < totalTime) {
            int minIndex = searchMinHilo(loteThreads);

            if (tpe <= loteThreads.get(minIndex).tiempoComprometido) {
                t = procesarComprobantes();
            } else {
                t = procesarLotes(minIndex);
            }
        }

        // Imprimir resultados interpolados
        System.out.println("Resultados de la simulación\n");
        System.out.println("Costo: " + costo + "\n");

        System.out.println("CANT1ok: " + cant1Ok + "\n");
        System.out.println("CANT2ok: " + cant2Ok + "\n");
        System.out.println("CANTERR: " + cantErr + "\n");
        System.out.println("TOTAL COMPR: " + totalComprobantes + "\n");

        System.out.println("Porcentaje de comprobantes exitosos con la primera configuración: " + ((double) cant1Ok / totalComprobantes)*100 + "\n");
        System.out.println("Porcentaje de comprobantes exitosos con la segunda configuración: " + ((double) cant2Ok / totalComprobantes)*100 + "\n");
        System.out.println("Porcentaje de comprobantes que no se pudo leer el QR: " + ((double) cantErr / totalComprobantes)*100 + "\n");

        System.out.println("Duración promedio de procesamiento de lectura de QR: " + (sumDemora / totalComprobantes) + " segundos\n");
        System.out.println("Duración promedio de carga de lote: " + ((double) sumDemoraLote / lhp) + " segundos\n");
        System.out.println("Cantidad de lotes procesados: " + lhp + "\n");
        System.out.println("Cantidad de comprobantes procesados: " + totalComprobantes + "\n");
        System.out.println("Fin de la simulación");
    }

    private void initializeAllVars() {
        for (int i = 0; i < cantidadLotes; i++) {
            loteThreads.add(new Hilo());
        }
        for (int i = 0; i < cantidadScanners; i++) {
            scannerThreads.add(new Hilo());
        }
        for (int i = 0; i < cantidadLotes; i++) {
            TPL.add(0);
        }
    }

    private int searchMinHilo(List<Hilo> arrHilo) {
        if (arrHilo.isEmpty()) {
            System.out.println("No se han proporcionado hilos.");
            return -1;
        }

        int minIndex = 0;
        int minValue = arrHilo.get(0).tiempoComprometido;

        for (int i = 1; i < arrHilo.size(); i++) {
            if (arrHilo.get(i).tiempoComprometido < minValue) {
                minIndex = i;
                minValue = arrHilo.get(i).tiempoComprometido;
            }
        }

        return minIndex;
    }

    private int procesarLotes(int minIndex) {
        int demoraLote = 0;
        t = TPL.get(minIndex);
        for (int i = 0; i < cantidadComprobantesPorLote; i++) {
            int pxc = randomPaginasPorComprobantes();
            demoraLote += 2 * pxc;
        }
        TPL.set(minIndex, TPL.get(minIndex) + demoraLote);
        loteThreads.get(minIndex).tiempoComprometido = TPL.get(minIndex);
        lhp++;
        sumDemoraLote += demoraLote;
        costo += costoCloudFunction;
        return t;
    }

    private int procesarComprobantes() {
        t = tpe;
        int trc = randomTiempoRecoleccionComprobantes();
        tpe = trc + t;

        int ccr = randomCantidadComprobantesRecolectados();
        totalComprobantes = totalComprobantes + ccr;

        for (int i = 0; i < ccr; i++) {
            int pxc = randomPaginasPorComprobantes();
            int d = obtenerTiempoDeEscaneo(pxc);
            sumDemora += d;
            int minIndex = searchMinHilo(scannerThreads);
            if (scannerThreads.get(minIndex).tiempoComprometido > t + minGoogleErr) {
                int minTCDW = searchMinHilo(loteThreads);
                if (scannerThreads.get(minIndex).tiempoComprometido <= loteThreads.get(minTCDW).tiempoComprometido) {
                    asignarNuevoTiempoComprometido(scannerThreads.get(minIndex), d, t);
                } else {
                    TPL.set(minTCDW, TPL.get(minTCDW) + d);
                }
            } else {
                asignarNuevoTiempoComprometido(scannerThreads.get(minIndex), d, t);
            }
            costo += costoCloudFunction;
        }
        return t;
    }

    private void asignarNuevoTiempoComprometido(Hilo hilo, int d, int t) {
        if (t < hilo.tiempoComprometido) {
            hilo.tiempoComprometido += d;
        } else {
            hilo.tiempoComprometido = t + d;
        }
    }

    private int obtenerTiempoDeEscaneo(int paginas) {
        int demora = obtenerDemora(fe1, r1, paginas);
        double googleErr = Math.random();
        if (googleErr < ProbabilityGoogleErr) {
            demora = demora + minGoogleErr;
        }

        if (huboError(fe1, r1)) {
            int dem = obtenerDemora(fe2, r2, paginas);
            demora = demora + dem;
            googleErr = Math.random();
            if (googleErr < ProbabilityGoogleErr) {
                demora = demora + minGoogleErr;
            }
            if (huboError(fe2, r2)) {
                cantErr++;
                costo += costoTarado;
            } else {
                cant2Ok++;
            }
        } else {
            cant1Ok++;
        }
        return demora;
    }

    private int obtenerDemora(int factorDeEscala, int resolucion, int paginas) {
        return (int) (((8.27 * resolucion) * (11.69 * factorDeEscala) * (factorDeEscala * paginas)) / vp);
    }

    private int randomTiempoRecoleccionComprobantes() {
        return randomWithMinAndMax(5 * 60, 6 * 60);
    }

    private int randomCantidadComprobantesRecolectados() {
        return randomWithMinAndMax(400, 800);
    }

    private int randomPaginasPorComprobantes() {
        return randomWithMinAndMax(1, 3);
    }

    private boolean huboError(int factorDeEscala, int resolucion) {
        double res = calcularFuncion(factorDeEscala* resolucion);
        int r = randomWithMinAndMax(1, 100);
        return r > res; // Devuelve booleano
    }

    public  double calcularFuncion(int x) {
        // Calcular la inversa de la tangente
        double arcTangent = Math.atan(x/100);

        // Realizar las demás operaciones indicadas
        double resultado = (arcTangent) * (160 / Math.PI);

        return resultado;
    }

    private int randomWithMinAndMax(int min, int max) {
        return new Random().nextInt((max - min) + 1) + min;
    }
}