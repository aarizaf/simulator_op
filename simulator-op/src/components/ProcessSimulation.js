import React, { useState } from 'react';

function ProcessSimulation({ sistemaOperativo, actualizarUI }) {
  const [nombre, setNombre] = useState('');
  const [memoria, setMemoria] = useState('');
  const [prioridad, setPrioridad] = useState('normal');
  const [tiempoCPU, setTiempoCPU] = useState('');

  const crearProceso = () => {
    console.log("Crear proceso llamado");
    const procesoNombre = nombre || `Proceso_${Math.floor(Math.random() * 100)}`;
    const procesoMemoria = memoria ? parseInt(memoria) : null;
    const procesoTiempoCPU = tiempoCPU ? parseInt(tiempoCPU) : null;
    
    sistemaOperativo.crearProceso(procesoNombre, procesoMemoria, procesoTiempoCPU);
    
    // Limpiar campos
    setNombre('');
    setMemoria('');
    setTiempoCPU('');
    
    // Actualizar interfaz
    actualizarUI();
  };

  const matarProcesoRandom = () => {
    console.log("Matar proceso random llamado");
    const procesosActivos = sistemaOperativo.procesos.filter(p => p.estado !== 'terminado');
    if (procesosActivos.length > 0) {
      const proceso = procesosActivos[Math.floor(Math.random() * procesosActivos.length)];
      sistemaOperativo.matarProceso(proceso.pid);
      actualizarUI();
    }
  };

  const crearTresProcesos = () => {
    console.log("Crear 3 procesos llamado");
    const nombres = ['Chrome', 'Firefox', 'VSCode'];
    nombres.forEach(nombre => {
      sistemaOperativo.crearProceso(nombre);
    });
    actualizarUI();
  };

  return (
    <div className="card proceso-simulation">
      <h2>🔄 Simulación de Procesos</h2>
      
      <div className="proceso-controls">
        <div className="input-group">
          <label>Nombre del Proceso:</label>
          <input 
            type="text" 
            placeholder="ej: chrome.exe" 
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Memoria (MB):</label>
          <input 
            type="number" 
            placeholder="Auto: 10-50" 
            min="1" 
            max="200"
            value={memoria}
            onChange={e => setMemoria(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Prioridad:</label>
          <select 
            value={prioridad}
            onChange={e => setPrioridad(e.target.value)}
            style={{width: '100%', padding: '10px', borderRadius: '8px'}}
          >
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div className="input-group">
          <label>Tiempo CPU (ciclos):</label>
          <input 
            type="number" 
            placeholder="Auto: 3-8" 
            min="1" 
            max="20"
            value={tiempoCPU}
            onChange={e => setTiempoCPU(e.target.value)}
          />
        </div>
      </div>
      
      <button className="btn btn-success" onClick={crearProceso}>
        Crear Proceso
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
        <button className="btn btn-danger" onClick={matarProcesoRandom}>
          Matar Proceso Random
        </button>
        <button className="btn" onClick={crearTresProcesos}>
          Crear 3 Procesos
        </button>
      </div>
    </div>
  );
}

export default ProcessSimulation;