import React, { useState, useEffect } from 'react';

function MemoryManager({ sistemaOperativo, actualizarUI }) {
  const [memoriaStats, setMemoriaStats] = useState({
    total: 200,
    disponible: 200,
    porcentaje: 0,
    bloques: new Array(10).fill(false)
  });

  // Actualizar estadísticas de memoria cuando cambie el sistema
  useEffect(() => {
    if (sistemaOperativo && sistemaOperativo.gestorMemoria) {
      const { memoriaTotal, memoriaDisponible, bloques } = sistemaOperativo.gestorMemoria;
      const porcentaje = ((memoriaTotal - memoriaDisponible) / memoriaTotal) * 100;
      
      setMemoriaStats({
        total: memoriaTotal,
        disponible: memoriaDisponible,
        usado: memoriaTotal - memoriaDisponible,
        porcentaje: porcentaje,
        bloques: bloques || new Array(10).fill(false)
      });
    }
  }, [sistemaOperativo,sistemaOperativo.gestorMemoria, actualizarUI]);

  const compactarMemoria = () => {
    console.log("Compactar memoria llamado");
    sistemaOperativo.gestorMemoria.compactar();
    actualizarUI();
  };

  const limpiarMemoria = () => {
    console.log("Limpiar memoria llamado");
    // Terminar todos los procesos
    sistemaOperativo.procesos.forEach(proceso => {
      if (proceso.estado !== 'terminado') {
        sistemaOperativo.matarProceso(proceso.pid);
      }
    });
    actualizarUI();
  };

  return (
    <div className="card memory-section">
      <h2>💾 Gestión de Memoria</h2>
      
      <div className="memory-visualization">
        <div className="memory-bar">
          <div className="memory-used" style={{ width: `${memoriaStats.porcentaje}%` }}></div>
          <div className="memory-percentage">{Math.round(memoriaStats.porcentaje)}%</div>
        </div>
        
        <div className="memory-details">
          <div className="memory-detail">
            <strong>{memoriaStats.usado || 0} MB</strong><br />
            <span style={{ opacity: 0.8 }}>Usado</span>
          </div>
          <div className="memory-detail">
            <strong>{memoriaStats.disponible} MB</strong><br />
            <span style={{ opacity: 0.8 }}>Libre</span>
          </div>
        </div>
        
        <div className="memory-blocks">
          {memoriaStats.bloques.map((usado, index) => (
            <div 
              key={index}
              className={`memory-block ${usado ? 'used' : ''}`}
            ></div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button className="btn" onClick={compactarMemoria}>
          Compactar
        </button>
        <button className="btn" onClick={limpiarMemoria}>
          Limpiar
        </button>
      </div>
    </div>
  );
}

export default MemoryManager;