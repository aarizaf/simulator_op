class Planificador {
  constructor() {
    this.colaProcesos = [];
    this.procesoActual = null;
    this.ciclosTotales = 0;
    this.procesosCompletados = 0;
    this.pausado = false;
    this.quantum = 1; // Quantum para Round-Robin
  }

  agregarProceso(proceso) {
    proceso.estado = 'listo';
    this.colaProcesos.push(proceso);
    return `Proceso PID=${proceso.pid} añadido a la cola de planificación`;
  }

  ejecutarCiclo() {
    if (this.pausado || this.colaProcesos.length === 0) {
      return { ejecutado: false, mensaje: "Planificador pausado o cola vacía" };
    }

    this.ciclosTotales++;
    let log = `Ciclo #${this.ciclosTotales}: `;
    
    // Tomar siguiente proceso de la cola
    if (!this.procesoActual) {
      this.procesoActual = this.colaProcesos.shift();
      log += `Sacando PID=${this.procesoActual.pid} (${this.procesoActual.nombre}) de la cola`;
    }

    if (this.procesoActual) {
      log += `\nEjecutando PID=${this.procesoActual.pid} - Tiempo restante: ${this.procesoActual.tiempoRestante}`;
      
      const terminado = this.procesoActual.ejecutar();
      
      if (terminado) {
        log += `\nPID=${this.procesoActual.pid} ha terminado su ejecución`;
        this.procesosCompletados++;
        const procesoFinalizado = this.procesoActual;
        this.procesoActual = null;
        return { 
          ejecutado: true, 
          mensaje: log, 
          procesoTerminado: procesoFinalizado 
        };
      } else {
        log += `\nPID=${this.procesoActual.pid} vuelve a la cola (Round-Robin)`;
        // Devolver a la cola (Round-Robin)
        this.colaProcesos.push(this.procesoActual);
        this.procesoActual = null;
      }
    }

    // Actualizar tiempos de espera e incluir en el log
    if (this.colaProcesos.length > 0) {
      log += `\nEstado de la cola: `;
      this.colaProcesos.forEach((proceso, index) => {
        proceso.tiempoEspera++;
        log += `${index === 0 ? '' : ', '}PID=${proceso.pid}`;
      });
    } else {
      log += `\nCola vacía`;
    }

    return { ejecutado: true, mensaje: log };
  }

  obtenerEstadisticas() {
    let tiempoEsperaPromedio = 0;
    if (this.colaProcesos.length > 0) {
      const sumaEsperas = this.colaProcesos.reduce((acc, p) => acc + p.tiempoEspera, 0);
      tiempoEsperaPromedio = sumaEsperas / this.colaProcesos.length;
    }
    
    const throughput = this.ciclosTotales > 0 ? 
      (this.procesosCompletados / this.ciclosTotales) * 100 : 0;
    
    return {
      ciclosTotales: this.ciclosTotales,
      tiempoEsperaPromedio: tiempoEsperaPromedio.toFixed(1),
      throughput: throughput.toFixed(1)
    };
  }

  pausar() {
    this.pausado = !this.pausado;
    return this.pausado ? "Planificador pausado" : "Planificador reanudado";
  }

  reiniciar() {
    this.colaProcesos = [];
    this.procesoActual = null;
    this.ciclosTotales = 0;
    this.procesosCompletados = 0;
    this.pausado = false;
    return "Planificador reiniciado";
  }
}

export default Planificador;