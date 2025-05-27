/**
 * Clase GestorMemoria
 * 
 * Implementa un sistema de gestión de memoria que asigna, libera y compacta
 * la memoria disponible para los procesos. Utiliza un enfoque de bloques
 * para representar la memoria física del sistema.
 * 
 * @class
 */
class GestorMemoria {
  /**
   * Crea una nueva instancia del gestor de memoria
   * 
   * @param {number} memoriaTotal - Cantidad total de memoria disponible en MB
   */
  constructor(memoriaTotal) {
    this.memoriaTotal = memoriaTotal;        // Memoria total del sistema en MB
    this.memoriaDisponible = memoriaTotal;   // Memoria libre actualmente en MB
    this.bloques = new Array(10).fill(false); // 10 bloques de memoria (false = libre, true = ocupado)
    this.asignaciones = new Map();           // Mapa que relaciona PID con los bloques asignados
  }

  /**
   * Asigna memoria a un proceso
   * 
   * Calcula cuántos bloques necesita el proceso según su requerimiento de memoria,
   * busca bloques libres y los asigna si hay suficientes disponibles.
   * 
   * @param {Object} proceso - Proceso al que se asignará memoria
   * @returns {boolean} true si la asignación fue exitosa, false si no hay suficiente memoria
   */
  asignar(proceso) {
    // Calcula cuántos bloques de 20MB necesita el proceso (redondeando hacia arriba)
    const bloquesNecesarios = Math.ceil(proceso.memoria / 20);
    const bloquesLibres = this.encontrarBloquesLibres(bloquesNecesarios);
    
    // Verifica si hay suficientes bloques libres contiguos
    if (bloquesLibres.length < bloquesNecesarios) {
      return false; // No hay suficiente memoria disponible
    }

    // Asigna los bloques al proceso
    const bloquesAsignados = bloquesLibres.slice(0, bloquesNecesarios);
    bloquesAsignados.forEach(bloque => {
      this.bloques[bloque] = true; // Marca el bloque como ocupado
    });
    
    // Registra la asignación y actualiza la memoria disponible
    this.asignaciones.set(proceso.pid, bloquesAsignados);
    this.memoriaDisponible -= proceso.memoria;
    
    return true; // Asignación exitosa
  }

  /**
   * Libera la memoria asignada a un proceso
   * 
   * Marca como libres los bloques que estaban asignados al proceso
   * y actualiza la cantidad de memoria disponible.
   * 
   * @param {Object} proceso - Proceso cuya memoria será liberada
   */
  liberar(proceso) {
    const bloquesAsignados = this.asignaciones.get(proceso.pid);
    if (bloquesAsignados) {
      // Marca cada bloque asignado como libre
      bloquesAsignados.forEach(bloque => {
        this.bloques[bloque] = false;
      });
      
      // Elimina el registro de asignación y actualiza la memoria disponible
      this.asignaciones.delete(proceso.pid);
      this.memoriaDisponible += proceso.memoria;
    }
  }

  /**
   * Encuentra bloques libres en la memoria
   * 
   * Busca en el array de bloques y devuelve los índices de los bloques que están libres,
   * hasta alcanzar la cantidad solicitada.
   * 
   * @param {number} cantidad - Número de bloques libres necesarios
   * @returns {number[]} Array con los índices de los bloques libres encontrados
   */
  encontrarBloquesLibres(cantidad) {
    const libres = [];
    for (let i = 0; i < this.bloques.length && libres.length < cantidad; i++) {
      if (!this.bloques[i]) {
        libres.push(i);
      }
    }
    return libres;
  }

  /**
   * Compacta la memoria
   * 
   * Reorganiza los bloques de memoria asignados para eliminar la fragmentación externa,
   * moviendo todos los bloques ocupados al inicio de la memoria y dejando los bloques
   * libres al final. Esto optimiza el uso de la memoria y facilita la asignación de
   * bloques contiguos para nuevos procesos.
   */
  compactar() {
    // Obtiene todos los PIDs de procesos que tienen memoria asignada
    const procesosEnMemoria = Array.from(this.asignaciones.keys());
    
    // Reinicia el estado de los bloques (todos libres)
    this.bloques.fill(false);
    
    let bloqueActual = 0;
    const nuevasAsignaciones = new Map();
    
    // Reasigna los bloques de manera contigua, proceso por proceso
    procesosEnMemoria.forEach(pid => {
      const bloquesAsignados = this.asignaciones.get(pid);
      const nuevosBloquesAsignados = [];
      
      // Para cada bloque original, asigna uno nuevo de manera contigua
      for (let i = 0; i < bloquesAsignados.length; i++) {
        this.bloques[bloqueActual] = true; // Marca el bloque como ocupado
        nuevosBloquesAsignados.push(bloqueActual);
        bloqueActual++;
      }
      
      // Actualiza el mapeo para este proceso
      nuevasAsignaciones.set(pid, nuevosBloquesAsignados);
    });
    
    // Reemplaza el mapa de asignaciones con el nuevo (compactado)
    this.asignaciones = nuevasAsignaciones;
  }
}

export default GestorMemoria;