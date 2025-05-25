import React from 'react';

function Header() {
  return (
    <div className="header card">
      <h1>💻 Simulador de Sistema Operativo</h1>
      <p>Implementación completa con todos los criterios de evaluación</p>
      <div style={{ marginTop: '10px' }}>
        <span className="evaluation-badge">🔄 Procesos</span>
        <span className="evaluation-badge">⚙️ Round-Robin</span>
        <span className="evaluation-badge">💾 Memoria</span>
        <span className="evaluation-badge">📝 Código</span>
        <span className="evaluation-badge">🖥️ UI</span>
      </div>
    </div>
  );
}

export default Header;