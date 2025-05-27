import React, { useState, useEffect } from 'react';

/**
 * Componente Scheduler - Implementa la interfaz visual del planificador Round-Robin
 * 
 * Este componente muestra el estado actual del planificador, incluyendo:
 * - Cola de procesos en espera
 * - Controles para ejecutar ciclos del planificador
 * - Estadísticas de rendimiento (ciclos, tiempo de espera, throughput)
 * 
 * @param {Object} sistemaOperativo - Instancia del sistema operativo que contiene el planificador
 * @param {Function} actualizarUI - Función para actualizar el estado global de la aplicación
 * @returns {JSX.Element} Interfaz visual del planificador
 */
function Scheduler({ sistemaOperativo, actualizarUI }) {
  // Estado local para almacenar la cola de procesos actual
  const [colaProcesos, setColaProcesos] = useState([]);
  
  // Estado local para almacenar las estadísticas del planificador
  const [estadisticas, setEstadisticas] = useState({
    ciclosTotales: 0,       // Total de ciclos ejecutados
    tiempoEsperaPromedio: 0, // Tiempo promedio que los procesos esperan en cola (segundos)
    throughput: 0           // Porcentaje de procesos completados por ciclo
  });

  /**
   * Efecto para sincronizar el estado local con el estado del planificador
   * Se ejecuta cuando cambia el planificador en el sistema operativo
   */
  useEffect(() => {
    // Actualiza la cola de procesos desde el planificador
    setColaProcesos(sistemaOperativo.planificador.colaProcesos || []);
    
    // Obtiene y actualiza las estadísticas desde el planificador
    const stats = sistemaOperativo.planificador.obtenerEstadisticas ? 
                  sistemaOperativo.planificador.obtenerEstadisticas() : 
                  { ciclosTotales: 0, tiempoEsperaPromedio: 0, throughput: 0 };
    setEstadisticas(stats);
  }, [sistemaOperativo.planificador]); // Dependencia: se ejecuta cuando el planificador cambia

  /**
   * Ejecuta 5 ciclos del planificador de forma secuencial
   * Muestra información detallada de cada ciclo en la shell
   */
  const ejecutarCicloCompleto = () => {
    console.log("Ejecutar ciclo completo llamado");
    for (let i = 0; i < 5; i++) {
      sistemaOperativo.ejecutarCicloPlanificador();
    }
    actualizarUI(); // Notifica a la aplicación que se actualizó el estado
  };

  /**
   * Ejecuta un solo ciclo del planificador
   * Útil para observar paso a paso la ejecución del algoritmo Round-Robin
   */
  const ejecutarPasoAPaso = () => {
    console.log("Ejecutar paso a paso llamado");
    sistemaOperativo.ejecutarCicloPlanificador();
    actualizarUI();
  };

  /**
   * Alterna el estado del planificador entre pausado y activo
   * Cuando está pausado, no se ejecutan ciclos aunque se soliciten
   */
  const pausarPlanificador = () => {
    console.log("Pausar/reanudar planificador llamado");
    const mensaje = sistemaOperativo.planificador.pausar();
    sistemaOperativo.log(mensaje, 'info'); // Registra la acción en la shell
    actualizarUI();
  };

  /**
   * Reinicia el planificador a su estado inicial
   * - Limpia la cola de procesos
   * - Reinicia las estadísticas
   * - Establece el planificador como no pausado
   */
  const reiniciarPlanificador = () => {
    console.log("Reiniciar planificador llamado");
    const mensaje = sistemaOperativo.planificador.reiniciar();
    sistemaOperativo.log(mensaje, 'warning');
    actualizarUI();
  };

  // Estructura JSX del componente
  return (
    <div className="card scheduler-section">
      <h2>⚙️ Planificador Round-Robin</h2>
      
      {/* Panel de controles del planificador */}
      <div className="scheduler-controls">
        <button className="btn btn-warning" onClick={ejecutarCicloCompleto}>
          Ejecutar Ciclo
        </button>
        <button className="btn" onClick={ejecutarPasoAPaso}>
          Paso a Paso
        </button>
        <button className="btn" onClick={pausarPlanificador}>
          Pausar/Reanudar
        </button>
        <button className="btn" onClick={reiniciarPlanificador}>
          Reiniciar
        </button>
      </div>

      {/* Visualización de la cola de procesos */}
      <div className="queue-visualization">
        <div className="queue-title">Cola de Procesos Ready</div>
        <div className="queue-items">
          {colaProcesos.length === 0 ? (
            <span style={{ opacity: 0.6 }}>Cola vacía</span>
          ) : (
            colaProcesos.map(proceso => (
              <div 
                key={proceso.pid}
                className={`queue-item ${proceso === sistemaOperativo.planificador.procesoActual ? 'executing' : ''}`}
              >
                PID: {proceso.pid} - {proceso.nombre}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Panel de estadísticas del planificador */}
      <div className="scheduler-stats">
        <div className="stat-card">
          <div className="stat-value">{estadisticas.ciclosTotales}</div>
          <div className="stat-label">Ciclos Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{estadisticas.tiempoEsperaPromedio}s</div>
          <div className="stat-label">Tiempo Espera</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{estadisticas.throughput}%</div>
          <div className="stat-label">Throughput</div>
        </div>
      </div>
    </div>
  );
}

export default Scheduler;