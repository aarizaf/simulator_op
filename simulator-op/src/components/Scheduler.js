import React, { useState, useEffect } from 'react';

function Scheduler({ sistemaOperativo, actualizarUI }) {
  const [colaProcesos, setColaProcesos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    ciclosTotales: 0,
    tiempoEsperaPromedio: 0,
    throughput: 0
  });

  // Actualizar la cola y estadísticas cuando cambie el estado
  useEffect(() => {
    setColaProcesos(sistemaOperativo.planificador.colaProcesos || []);
    const stats = sistemaOperativo.planificador.obtenerEstadisticas ? 
                  sistemaOperativo.planificador.obtenerEstadisticas() : 
                  { ciclosTotales: 0, tiempoEsperaPromedio: 0, throughput: 0 };
    setEstadisticas(stats);
  }, [sistemaOperativo.planificador]); // Eliminar 'refresh' que no está definido

  const ejecutarCicloCompleto = () => {
    console.log("Ejecutar ciclo completo llamado");
    for (let i = 0; i < 5; i++) {
      sistemaOperativo.ejecutarCicloPlanificador();
    }
    actualizarUI();
  };

  const ejecutarPasoAPaso = () => {
    console.log("Ejecutar paso a paso llamado");
    sistemaOperativo.ejecutarCicloPlanificador();
    actualizarUI();
  };

  const pausarPlanificador = () => {
    console.log("Pausar/reanudar planificador llamado");
    const mensaje = sistemaOperativo.planificador.pausar();
    sistemaOperativo.log(mensaje, 'info');
    actualizarUI();
  };

  const reiniciarPlanificador = () => {
    console.log("Reiniciar planificador llamado");
    const mensaje = sistemaOperativo.planificador.reiniciar();
    sistemaOperativo.log(mensaje, 'warning');
    actualizarUI();
  };

  return (
    <div className="card scheduler-section">
      <h2>⚙️ Planificador Round-Robin</h2>
      
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