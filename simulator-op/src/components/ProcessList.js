import React, { useState, useEffect } from 'react';

function ProcessList({ sistemaOperativo, actualizarUI }) {
  const [procesos, setProcesos] = useState([]);

  // Actualizar la lista de procesos cuando cambie el sistema
  useEffect(() => {
    if (sistemaOperativo) {
      setProcesos(sistemaOperativo.procesos || []);
    }
  }, [sistemaOperativo, sistemaOperativo.procesos]);

  const matarProceso = (pid) => {
    console.log("Matar proceso llamado:", pid);
    sistemaOperativo.matarProceso(pid);
    actualizarUI();
  };

  return (
    <div className="card process-list">
      <h2>📋 Lista de Procesos</h2>
      
      <table className="process-table">
        <thead>
          <tr>
            <th>PID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Memoria</th>
            <th>CPU</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {procesos.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', opacity: 0.6 }}>No hay procesos</td>
            </tr>
          ) : (
            procesos.map(proceso => (
              <tr 
                key={proceso.pid}
                className={`process-row ${proceso.estado === 'terminado' ? 'terminated' : ''}`}
              >
                <td>{proceso.pid}</td>
                <td>{proceso.nombre}</td>
                <td>
                  <span className={`status-badge status-${proceso.estado === 'terminado' ? 'terminated' : 'active'}`}>
                    {proceso.estado}
                  </span>
                </td>
                <td>{proceso.memoria} MB</td>
                <td>{proceso.tiempoRestante}/{proceso.tiempoCPU}</td>
                <td>
                  {proceso.estado !== 'terminado' ? (
                    <button className="kill-btn" onClick={() => matarProceso(proceso.pid)}>
                      Kill
                    </button>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProcessList;