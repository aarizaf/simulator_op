import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ProcessSimulation from './components/ProcessSimulation';
import Scheduler from './components/Scheduler';
import MemoryManager from './components/MemoryManager';
import ProcessList from './components/ProcessList';
import Shell from './components/Shell';
import SistemaOperativo from './utils/SistemaOperativo';

function App() {
  // Crear instancia de SistemaOperativo
  const [sistemaOperativo] = useState(new SistemaOperativo());
  
  // Estado para forzar la actualización de la interfaz
  const [refresh, setRefresh] = useState(0);
  
  const actualizarUI = () => {
    setRefresh(prevRefresh => prevRefresh + 1);
  };

  return (
    <div className="main-container" data-refresh={refresh}>
      <Header />
      <div className="left-panel">
        <ProcessSimulation 
          sistemaOperativo={sistemaOperativo} 
          actualizarUI={actualizarUI} 
        />
        <Scheduler 
          sistemaOperativo={sistemaOperativo} 
          actualizarUI={actualizarUI} 
        />
      </div>
      <div className="right-panel">
        <MemoryManager 
          sistemaOperativo={sistemaOperativo} 
          actualizarUI={actualizarUI} 
        />
        <ProcessList 
          sistemaOperativo={sistemaOperativo} 
          actualizarUI={actualizarUI} 
        />
        <Shell 
          sistemaOperativo={sistemaOperativo} 
          actualizarUI={actualizarUI} 
        />
      </div>
    </div>
  );
}

export default App;