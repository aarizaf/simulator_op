/**
 * SistemaOperativo.js
 * 
 * Clase principal que simula el funcionamiento de un sistema operativo básico,
 * orquestando la interacción entre procesos, gestor de memoria y planificador.
 * Proporciona una interfaz para la creación, ejecución y terminación de procesos,
 * así como comandos para interactuar con el sistema.
 * 
 * @author aarizaf-camilodelarosa
 * @version 1.0
 */

import Proceso from './Proceso';
import GestorMemoria from './GestorMemoria';
import Planificador from './Planificador';

/**
 * Clase SistemaOperativo
 * 
 * Implementa la lógica central del sistema operativo, coordinando
 * el planificador de procesos, el gestor de memoria y los procesos.
 * Mantiene un registro de actividades (logs) y responde a comandos.
 * 
 * @class
 */
class SistemaOperativo {
  /**
   * Crea una nueva instancia del sistema operativo
   * 
   * @param {number} [memoriaTotal=200] - Cantidad total de memoria en MB
   */
  constructor(memoriaTotal = 200) {
    this.gestorMemoria = new GestorMemoria(memoriaTotal); // Subsistema de gestión de memoria
    this.planificador = new Planificador();               // Subsistema de planificación
    this.procesos = [];                                   // Lista de todos los procesos creados
    this.logs = [];                                       // Registro de actividades del sistema
    
    // Inicializar con mensajes informativos
    this.log('Simulador OS v1.0 iniciado', 'info');
    this.log(`Memoria total: ${memoriaTotal} MB disponibles`, 'info');
    this.log('Planificador Round-Robin activo', 'info');
    this.log('Listo para recibir comandos...', 'info');
  }

  /**
   * Crea un nuevo proceso en el sistema
   * 
   * Intenta asignar memoria para el proceso y, si es exitoso,
   * lo agrega a la lista de procesos y a la cola del planificador.
   * 
   * @param {string} nombre - Nombre del proceso
   * @param {number|null} [memoria=null] - Memoria requerida en MB (aleatorio 10-50 si es null)
   * @param {number|null} [tiempoCPU=null] - Ciclos de CPU requeridos (aleatorio si es null)
   * @returns {Object|null} El proceso creado o null si no hay memoria suficiente
   * 
   * @example
   * // Crear proceso con valores aleatorios
   * const proceso = sistemaOperativo.crearProceso('chrome.exe');
   * 
   * // Crear proceso con memoria específica
   * const proceso = sistemaOperativo.crearProceso('firefox.exe', 30);
   */
  crearProceso(nombre, memoria = null, tiempoCPU = null) {
    // Generar valor aleatorio de memoria si no se especifica
    if (!memoria) {
      memoria = Math.floor(Math.random() * 41) + 10; // 10-50 MB
    }

    // Crear instancia del proceso
    const proceso = new Proceso(nombre, memoria, tiempoCPU);
    
    // Intentar asignar memoria al proceso
    if (this.gestorMemoria.asignar(proceso)) {
      // Si hay memoria suficiente, agregar a la lista y al planificador
      this.procesos.push(proceso);
      const mensaje = this.planificador.agregarProceso(proceso);
      
      // Registrar en los logs
      this.log(`Proceso creado: PID=${proceso.pid}, Memoria=${memoria}MB`, 'success');
      this.log(mensaje, 'info');
      
      return proceso;
    } else {
      // Si no hay memoria suficiente, registrar error
      this.log(`No se pudo crear el proceso ${nombre} - Memoria insuficiente`, 'error');
      return null;
    }
  }

  /**
   * Termina un proceso específico por su PID
   * 
   * Marca el proceso como terminado, libera su memoria y lo elimina
   * de la cola del planificador si está presente.
   * 
   * @param {number} pid - Identificador del proceso a terminar
   * @returns {boolean} true si el proceso fue terminado, false si no se encontró
   */
  matarProceso(pid) {
    // Buscar el proceso activo con el PID especificado
    const proceso = this.procesos.find(p => p.pid === pid && p.estado !== 'terminado');
    
    if (proceso) {
      // Marcar el proceso como terminado
      proceso.estado = 'terminado';
      
      // Liberar la memoria asignada al proceso
      this.gestorMemoria.liberar(proceso);
      
      // Remover de la cola del planificador si está ahí
      const index = this.planificador.colaProcesos.findIndex(p => p.pid === pid);
      if (index !== -1) {
        this.planificador.colaProcesos.splice(index, 1);
      }
      
      // Registrar en los logs
      this.log(`Proceso PID=${pid} terminado`, 'warning');
      return true;
    }
    
    // Si no se encontró el proceso, registrar advertencia
    this.log(`Proceso PID=${pid} no encontrado`, 'warning');
    return false;
  }

  /**
   * Procesa un comando ingresado por el usuario en la shell
   * 
   * Analiza el comando y ejecuta la acción correspondiente en el sistema.
   * Soporta comandos para listar procesos, crear/terminar procesos,
   * administrar memoria, ejecutar ciclos del planificador, etc.
   * 
   * @param {string} comando - Comando a ejecutar
   */
  ejecutarComando(comando) {
    // Dividir el comando en partes (comando y argumentos)
    const partes = comando.split(' ');
    const cmd = partes[0].toLowerCase();
    
    // Procesar según el tipo de comando
    switch(cmd) {
      case 'ps':
        // Listar procesos activos
        const activos = this.procesos.filter(p => p.estado !== 'terminado').length;
        this.log(`Procesos activos: ${activos}`, 'info');
        this.procesos.forEach(p => {
          if (p.estado !== 'terminado') {
            this.log(`PID=${p.pid}, ${p.nombre}, Estado=${p.estado}, Mem=${p.memoria}MB, CPU=${p.tiempoRestante}/${p.tiempoCPU}`, 'info');
          }
        });
        break;
        
      case 'run':
        // Crear un nuevo proceso
        const nombre = partes[1] || `Proceso_${Math.floor(Math.random() * 100)}`;
        this.crearProceso(nombre);
        break;
        
      case 'kill':
        // Terminar un proceso por su PID
        const pid = parseInt(partes[1]);
        if (pid) this.matarProceso(pid);
        else this.log('Especifique un PID válido', 'error');
        break;
        
      case 'mem':
        // Mostrar estado de la memoria
        this.log(`Memoria: ${this.gestorMemoria.memoriaDisponible}/${this.gestorMemoria.memoriaTotal} MB disponibles`, 'info');
        break;
        
      case 'compactar':
        // Compactar la memoria
        this.gestorMemoria.compactar();
        this.log('Memoria compactada', 'success');
        break;
        
      case 'exit':
        // Finalizar sesión del simulador
        this.log('¡Gracias por usar nuestro simulador de Sistema Operativo!', 'info');
        this.log('Sesión finalizada. Para reiniciar, recarga la página.', 'warning');
        break;  
        
      case 'schedule':
      case 'ciclo':
        // Ejecutar un ciclo del planificador
        this.ejecutarCicloPlanificador();
        break;
        
      case 'help':
        // Mostrar comandos disponibles
        this.log('Comandos disponibles:', 'info');
        this.log('ps - Lista procesos activos', 'info');
        this.log('run [nombre] - Crea un nuevo proceso', 'info');
        this.log('kill [pid] - Termina un proceso', 'info');
        this.log('mem - Muestra estado de memoria', 'info');
        this.log('compactar - Compacta la memoria', 'info');
        this.log('ciclo - Ejecuta un ciclo del planificador', 'info');
        this.log('clear - Limpia la consola', 'info');
        this.log('exit - Finaliza la sesión', 'info');
        break;
        
      case 'clear':
        // Limpiar historial de logs
        this.logs = [];
        break;
        
      default:
        // Comando no reconocido
        this.log(`Comando no reconocido: ${cmd}`, 'error');
    }
  }

  /**
   * Ejecuta un ciclo del planificador y registra los resultados
   * 
   * Solicita al planificador que ejecute un ciclo y procesa el resultado,
   * registrando cada paso en los logs del sistema. Si un proceso termina
   * durante el ciclo, libera su memoria.
   * 
   * @returns {boolean} true si se ejecutó el ciclo correctamente, false en caso contrario
   */
  ejecutarCicloPlanificador() {
    // Solicitar al planificador que ejecute un ciclo
    const resultado = this.planificador.ejecutarCiclo();
    
    // Si no se pudo ejecutar (planificador pausado o cola vacía)
    if (!resultado.ejecutado) {
      this.log(resultado.mensaje, 'warning');
      return false;
    }
    
    // Registrar los pasos detallados del ciclo
    const lineas = resultado.mensaje.split('\n');
    lineas.forEach(linea => {
      this.log(linea, 'info');
    });
    
    // Si un proceso terminó durante el ciclo, liberar su memoria
    if (resultado.procesoTerminado) {
      this.matarProceso(resultado.procesoTerminado.pid);
    }
    
    return true;
  }

  /**
   * Agrega un nuevo mensaje al registro de logs del sistema
   * 
   * @param {string} mensaje - Texto del mensaje a registrar
   * @param {string} [tipo='info'] - Tipo de mensaje ('info', 'success', 'warning', 'error')
   */
  log(mensaje, tipo = 'info') {
    // Crear y agregar entrada de log
    this.logs.push({
      id: Date.now() + Math.random(),  // ID único para la entrada
      mensaje,                         // Contenido del mensaje
      tipo,                            // Tipo de mensaje (para estilo visual)
      timestamp: new Date().toLocaleTimeString() // Marca de tiempo
    });
    
    // Limitar a los últimos 100 logs para evitar consumo excesivo de memoria
    if (this.logs.length > 100) {
      this.logs.shift(); // Eliminar el log más antiguo
    }
  }
}

export default SistemaOperativo;