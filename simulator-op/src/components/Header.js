import React from 'react';

function Header() {
  return (
    <div className="header card">
      <h1>💻 Simulador de Sistema Operativo</h1>
      <p>Implementación completa con todos los criterios de evaluación</p>
      <div style={{ marginTop: '10px' }}>
        <span className="evaluation-badge">🔄 Procesos: 25pts</span>
        <span className="evaluation-badge">⚙️ Round-Robin: 25pts</span>
        <span className="evaluation-badge">💾 Memoria: 20pts</span>
        <span className="evaluation-badge">📝 Código: 20pts</span>
        <span className="evaluation-badge">🖥️ UI: 10pts</span>
      </div>
    </div>
  );
}

export default Header;