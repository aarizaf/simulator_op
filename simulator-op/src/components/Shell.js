import React, { useState, useEffect, useRef } from 'react';

function Shell({ sistemaOperativo, actualizarUI }) {
  const [comando, setComando] = useState('');
  const [logs, setLogs] = useState([]);
  const shellOutputRef = useRef(null);

  // Actualizar logs cuando cambie el sistema
  useEffect(() => {
    if (sistemaOperativo) {
      setLogs(sistemaOperativo.logs || []);
      // Scroll al final
      if (shellOutputRef.current) {
        shellOutputRef.current.scrollTop = shellOutputRef.current.scrollHeight;
      }
    }
  }, [sistemaOperativo, sistemaOperativo.logs]);

  const ejecutarComando = () => {
    console.log("Ejecutar comando llamado:", comando);
    if (!comando.trim()) return;
    
    sistemaOperativo.ejecutarComando(comando);
    setComando('');
    actualizarUI();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      ejecutarComando();
    }
  };

  // Si no hay logs, mostrar logs por defecto
  const logsAMostrar = logs.length > 0 ? logs : [
    { id: 1, mensaje: 'Simulador OS v1.0 iniciado', tipo: 'info' },
    { id: 2, mensaje: 'Memoria total: 200 MB disponibles', tipo: 'info' },
    { id: 3, mensaje: 'Planificador Round-Robin activo', tipo: 'info' },
    { id: 4, mensaje: 'Listo para recibir comandos...', tipo: 'info' }
  ];

  return (
    <div className="card shell-section">
      <h2>🖥️ Shell del Sistema</h2>
      
      <div className="shell-output" ref={shellOutputRef}>
        {logsAMostrar.map((log) => (
          <div key={log.id} className={`shell-line ${log.tipo}`}>
            $ {log.mensaje}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input 
          type="text" 
          placeholder="Ingresa comando..." 
          value={comando}
          onChange={(e) => setComando(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}
        />
        <button className="btn" onClick={ejecutarComando}>
          Ejecutar
        </button>
      </div>
    </div>
  );
}

export default Shell;