class GestorMemoria {
  constructor(memoriaTotal) {
    this.memoriaTotal = memoriaTotal;
    this.memoriaDisponible = memoriaTotal;
    this.bloques = new Array(10).fill(false); // 10 bloques de memoria
    this.asignaciones = new Map(); // PID -> [bloques asignados]
  }

  asignar(proceso) {
    const bloquesNecesarios = Math.ceil(proceso.memoria / 20);
    const bloquesLibres = this.encontrarBloquesLibres(bloquesNecesarios);
    
    if (bloquesLibres.length < bloquesNecesarios) {
      return false; // No hay suficiente memoria
    }

    // Asignar bloques
    const bloquesAsignados = bloquesLibres.slice(0, bloquesNecesarios);
    bloquesAsignados.forEach(bloque => {
      this.bloques[bloque] = true;
    });
    
    this.asignaciones.set(proceso.pid, bloquesAsignados);
    this.memoriaDisponible -= proceso.memoria;
    
    return true;
  }

  liberar(proceso) {
    const bloquesAsignados = this.asignaciones.get(proceso.pid);
    if (bloquesAsignados) {
      bloquesAsignados.forEach(bloque => {
        this.bloques[bloque] = false;
      });
      this.asignaciones.delete(proceso.pid);
      this.memoriaDisponible += proceso.memoria;
    }
  }

  encontrarBloquesLibres(cantidad) {
    const libres = [];
    for (let i = 0; i < this.bloques.length && libres.length < cantidad; i++) {
      if (!this.bloques[i]) {
        libres.push(i);
      }
    }
    return libres;
  }

  compactar() {
    // Implementación de compactación
    const procesosEnMemoria = Array.from(this.asignaciones.keys());
    this.bloques.fill(false);
    
    let bloqueActual = 0;
    const nuevasAsignaciones = new Map();
    
    procesosEnMemoria.forEach(pid => {
      const bloquesAsignados = this.asignaciones.get(pid);
      const nuevosBloquesAsignados = [];
      
      for (let i = 0; i < bloquesAsignados.length; i++) {
        this.bloques[bloqueActual] = true;
        nuevosBloquesAsignados.push(bloqueActual);
        bloqueActual++;
      }
      
      nuevasAsignaciones.set(pid, nuevosBloquesAsignados);
    });
    
    this.asignaciones = nuevasAsignaciones;
  }
}

export default GestorMemoria;