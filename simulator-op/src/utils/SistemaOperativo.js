import Proceso from './Proceso';
import GestorMemoria from './GestorMemoria';
import Planificador from './Planificador';

class SistemaOperativo {
  constructor(memoriaTotal = 200) {
    this.gestorMemoria = new GestorMemoria(memoriaTotal);
    this.planificador = new Planificador();
    this.procesos = [];
    this.logs = [];
    
    // Inicializar con algunos logs
    this.log('Simulador OS v1.0 iniciado', 'info');
    this.log(`Memoria total: ${memoriaTotal} MB disponibles`, 'info');
    this.log('Planificador Round-Robin activo', 'info');
    this.log('Listo para recibir comandos...', 'info');
  }

  crearProceso(nombre, memoria = null, tiempoCPU = null) {
    if (!memoria) {
      memoria = Math.floor(Math.random() * 41) + 10; // 10-50 MB
    }

    const proceso = new Proceso(nombre, memoria, tiempoCPU);
    
    if (this.gestorMemoria.asignar(proceso)) {
      this.procesos.push(proceso);
      const mensaje = this.planificador.agregarProceso(proceso);
      this.log(`Proceso creado: PID=${proceso.pid}, Memoria=${memoria}MB`, 'success');
      this.log(mensaje, 'info');
      return proceso;
    } else {
      this.log(`No se pudo crear el proceso ${nombre} - Memoria insuficiente`, 'error');
      return null;
    }
  }

  matarProceso(pid) {
    const proceso = this.procesos.find(p => p.pid === pid && p.estado !== 'terminado');
    if (proceso) {
      proceso.estado = 'terminado';
      this.gestorMemoria.liberar(proceso);
      
      // Remover de la cola si está ahí
      const index = this.planificador.colaProcesos.findIndex(p => p.pid === pid);
      if (index !== -1) {
        this.planificador.colaProcesos.splice(index, 1);
      }
      
      this.log(`Proceso PID=${pid} terminado`, 'warning');
      return true;
    }
    this.log(`Proceso PID=${pid} no encontrado`, 'warning');
    return false;
  }

  ejecutarComando(comando) {
    const partes = comando.split(' ');
    const cmd = partes[0].toLowerCase();
    
    switch(cmd) {
      case 'ps':
        const activos = this.procesos.filter(p => p.estado !== 'terminado').length;
        this.log(`Procesos activos: ${activos}`, 'info');
        this.procesos.forEach(p => {
          if (p.estado !== 'terminado') {
            this.log(`PID=${p.pid}, ${p.nombre}, Estado=${p.estado}, Mem=${p.memoria}MB, CPU=${p.tiempoRestante}/${p.tiempoCPU}`, 'info');
          }
        });
        break;
      case 'run':
        const nombre = partes[1] || `Proceso_${Math.floor(Math.random() * 100)}`;
        this.crearProceso(nombre);
        break;
      case 'kill':
        const pid = parseInt(partes[1]);
        if (pid) this.matarProceso(pid);
        else this.log('Especifique un PID válido', 'error');
        break;
      case 'mem':
        this.log(`Memoria: ${this.gestorMemoria.memoriaDisponible}/${this.gestorMemoria.memoriaTotal} MB disponibles`, 'info');
        break;
      case 'compactar':
        this.gestorMemoria.compactar();
        this.log('Memoria compactada', 'success');
        break;
      case 'exit':
         this.log('¡Gracias por usar nuestro simulador de Sistema Operativo!', 'info');
         this.log('Sesión finalizada. Para reiniciar, recarga la página.', 'warning');
        break;  
      case 'schedule':
      case 'ciclo':
        this.ejecutarCicloPlanificador();
        break;
      case 'help':
        this.log('Comandos disponibles:', 'info');
        this.log('ps - Lista procesos activos', 'info');
        this.log('run [nombre] - Crea un nuevo proceso', 'info');
        this.log('kill [pid] - Termina un proceso', 'info');
        this.log('mem - Muestra estado de memoria', 'info');
        this.log('compactar - Compacta la memoria', 'info');
        this.log('ciclo - Ejecuta un ciclo del planificador', 'info');
        this.log('clear - Limpia la consola', 'info');
        break;
      case 'clear':
        this.logs = [];
        break;
      default:
        this.log(`Comando no reconocido: ${cmd}`, 'error');
    }
  }

  ejecutarCicloPlanificador() {
    const resultado = this.planificador.ejecutarCiclo();
    
    if (!resultado.ejecutado) {
      this.log(resultado.mensaje, 'warning');
      return false;
    }
    
    // Registrar los pasos detallados
    const lineas = resultado.mensaje.split('\n');
    lineas.forEach(linea => {
      this.log(linea, 'info');
    });
    
    // Si un proceso terminó, liberar su memoria
    if (resultado.procesoTerminado) {
      this.matarProceso(resultado.procesoTerminado.pid);
    }
    
    return true;
  }

  log(mensaje, tipo = 'info') {
    this.logs.push({
      id: Date.now() + Math.random(),
      mensaje,
      tipo,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Limitar a los últimos 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }
}

export default SistemaOperativo;