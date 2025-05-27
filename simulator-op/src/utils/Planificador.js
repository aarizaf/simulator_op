/**
 * Clase Planificador
 * 
 * Implementa el algoritmo de planificación Round-Robin para gestionar
 * la ejecución de procesos en el sistema operativo. Mantiene una cola
 * de procesos listos y determina cuál se ejecuta en cada ciclo de CPU.
 * 
 * @class
 */
class Planificador {
  /**
   * Crea una nueva instancia del planificador Round-Robin
   */
  constructor() {
    this.colaProcesos = [];          // Cola de procesos listos para ejecutar
    this.procesoActual = null;       // Proceso que se está ejecutando actualmente
    this.ciclosTotales = 0;          // Contador de ciclos de CPU ejecutados
    this.procesosCompletados = 0;    // Contador de procesos que han terminado
    this.pausado = false;            // Indica si el planificador está pausado
    this.quantum = 1;                // Quantum para Round-Robin (ciclos por proceso)
  }

  /**
   * Agrega un nuevo proceso a la cola de planificación
   * 
   * @param {Object} proceso - Proceso a agregar a la cola
   * @returns {string} Mensaje informativo sobre la operación
   */
  agregarProceso(proceso) {
    proceso.estado = 'listo';        // Establece el estado del proceso como 'listo'
    this.colaProcesos.push(proceso); // Agrega el proceso al final de la cola
    return `Proceso PID=${proceso.pid} añadido a la cola de planificación`;
  }

  /**
   * Ejecuta un ciclo del planificador Round-Robin
   * 
   * Si hay procesos en la cola, selecciona el siguiente según el algoritmo
   * Round-Robin, lo ejecuta por un quantum y luego lo devuelve a la cola
   * si no ha terminado su ejecución.
   * 
   * @returns {Object} Resultado de la ejecución con información detallada
   * @property {boolean} ejecutado - Indica si se ejecutó un ciclo correctamente
   * @property {string} mensaje - Descripción detallada de lo ocurrido en el ciclo
   * @property {Object} [procesoTerminado] - Proceso que terminó su ejecución (si aplica)
   */
  ejecutarCiclo() {
    // No ejecutar si está pausado o no hay procesos
    if (this.pausado || this.colaProcesos.length === 0) {
      return { ejecutado: false, mensaje: "Planificador pausado o cola vacía" };
    }

    this.ciclosTotales++;
    let log = `Ciclo #${this.ciclosTotales}: `;
    
    // Tomar siguiente proceso de la cola si no hay uno en ejecución
    if (!this.procesoActual) {
      this.procesoActual = this.colaProcesos.shift();
      log += `Sacando PID=${this.procesoActual.pid} (${this.procesoActual.nombre}) de la cola`;
    }

    if (this.procesoActual) {
      log += `\nEjecutando PID=${this.procesoActual.pid} - Tiempo restante: ${this.procesoActual.tiempoRestante}`;
      
      // Ejecutar el proceso por un quantum
      const terminado = this.procesoActual.ejecutar();
      
      if (terminado) {
        // Si el proceso ha terminado su ejecución
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
        // Si el proceso debe volver a la cola (algoritmo Round-Robin)
        log += `\nPID=${this.procesoActual.pid} vuelve a la cola (Round-Robin)`;
        this.colaProcesos.push(this.procesoActual);
        this.procesoActual = null;
      }
    }

    // Actualizar tiempos de espera de todos los procesos en cola e incluir en el log
    if (this.colaProcesos.length > 0) {
      log += `\nEstado de la cola: `;
      this.colaProcesos.forEach((proceso, index) => {
        proceso.tiempoEspera++; // Incrementar tiempo de espera
        log += `${index === 0 ? '' : ', '}PID=${proceso.pid}`;
      });
    } else {
      log += `\nCola vacía`;
    }

    return { ejecutado: true, mensaje: log };
  }

  /**
   * Calcula y devuelve estadísticas del planificador
   * 
   * Genera métricas importantes como tiempo promedio de espera y 
   * throughput (procesos completados por ciclo) para evaluar el
   * rendimiento del planificador.
   * 
   * @returns {Object} Estadísticas del planificador
   * @property {number} ciclosTotales - Total de ciclos ejecutados
   * @property {string} tiempoEsperaPromedio - Tiempo promedio que los procesos esperan en cola
   * @property {string} throughput - Porcentaje de procesos completados por ciclo
   */
  obtenerEstadisticas() {
    // Calcular tiempo promedio de espera
    let tiempoEsperaPromedio = 0;
    if (this.colaProcesos.length > 0) {
      const sumaEsperas = this.colaProcesos.reduce((acc, p) => acc + p.tiempoEspera, 0);
      tiempoEsperaPromedio = sumaEsperas / this.colaProcesos.length;
    }
    
    // Calcular throughput (procesos completados por ciclo)
    const throughput = this.ciclosTotales > 0 ? 
      (this.procesosCompletados / this.ciclosTotales) * 100 : 0;
    
    return {
      ciclosTotales: this.ciclosTotales,
      tiempoEsperaPromedio: tiempoEsperaPromedio.toFixed(1),
      throughput: throughput.toFixed(1)
    };
  }

  /**
   * Alterna el estado de pausa del planificador
   * 
   * Cuando el planificador está pausado, no ejecutará ciclos aunque
   * se soliciten mediante ejecutarCiclo().
   * 
   * @returns {string} Mensaje indicando el nuevo estado del planificador
   */
  pausar() {
    this.pausado = !this.pausado;
    return this.pausado ? "Planificador pausado" : "Planificador reanudado";
  }

  /**
   * Reinicia el planificador a su estado inicial
   * 
   * Limpia la cola de procesos, reinicia contadores y desactiva
   * el estado de pausa.
   * 
   * @returns {string} Mensaje confirmando el reinicio
   */
  reiniciar() {
    this.colaProcesos = [];          // Vacía la cola de procesos
    this.procesoActual = null;       // Elimina el proceso actual
    this.ciclosTotales = 0;          // Reinicia contador de ciclos
    this.procesosCompletados = 0;    // Reinicia contador de procesos completados
    this.pausado = false;            // Desactiva el estado de pausa
    return "Planificador reiniciado";
  }
}

export default Planificador;