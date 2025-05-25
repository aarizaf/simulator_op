class Proceso {
  static contadorPID = 1;

  constructor(nombre, memoriaNecesaria, tiempoCPU = null) {
    this.pid = Proceso.contadorPID++;
    this.nombre = nombre;
    this.estado = 'nuevo'; // nuevo, listo, ejecutando, terminado
    this.memoria = memoriaNecesaria;
    this.tiempoCPU = tiempoCPU || Math.floor(Math.random() * 6) + 3; // 3-8 ciclos por defecto
    this.tiempoRestante = this.tiempoCPU;
    this.tiempoEspera = 0;
    this.creacion = Date.now();
  }

  ejecutar() {
    this.estado = 'ejecutando';
    this.tiempoRestante--;
    
    if (this.tiempoRestante <= 0) {
      this.estado = 'terminado';
      return true; // Proceso terminado
    }
    
    this.estado = 'listo';
    return false; // Proceso aún activo
  }
}

export default Proceso;