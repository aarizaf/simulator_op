# Simulador de Sistema Operativo

Este proyecto es un simulador de sistema operativo básico que implementa los conceptos fundamentales de gestión de procesos, planificación Round-Robin y administración de memoria. Desarrollado con React, ofrece una interfaz gráfica intuitiva que permite visualizar en tiempo real la ejecución de procesos y la administración de recursos del sistema.

![Simulador OS Screenshot](https://via.placeholder.com/800x400?text=Simulador+OS+Screenshot)

## Características

- **Gestión de Procesos**: Creación, ejecución y eliminación de procesos con estados.
- **Planificador Round-Robin**: Implementación de algoritmo de planificación con quantum configurable.
- **Administración de Memoria**: Asignación y liberación de memoria con visualización gráfica.
- **Shell Interactiva**: Interfaz de línea de comandos para controlar el simulador.
- **Monitor de Procesos**: Vista tabular de todos los procesos y sus estados.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (v14.0.0 o superior)
- [npm](https://www.npmjs.com/) (v6.0.0 o superior)

## Instalación

1. Clona este repositorio:

-git clone https://github.com/aarizaf/simulator_op.git
-cd simulator-op


2. Instala las dependencias:

npm install



3. Inicia la aplicación:

npm start



4. La aplicación se abrirá automáticamente en tu navegador en [http://localhost:3000](http://localhost:3000)

## Guía de Uso

### Creación de Procesos

- **Creación Manual**: Completa el formulario de la sección "Simulación de Procesos" con nombre, memoria requerida y tiempo de CPU.
- **Creación Rápida**: Usa el botón "Crear 3 Procesos" para generar tres procesos automáticamente.
- **Eliminación**: Elimina procesos individuales con el botón "Kill" o selecciona "Matar Proceso Random" para eliminar uno aleatorio.

### Planificador Round-Robin

- **Ejecutar Ciclo**: Ejecuta 5 ciclos del planificador.
- **Paso a Paso**: Ejecuta un solo ciclo del planificador para observar detalladamente.
- **Pausar/Reanudar**: Detiene o reanuda la ejecución del planificador.
- **Reiniciar**: Limpia la cola de procesos y reinicia el planificador.

### Gestión de Memoria

- **Visualización**: Observa el uso de memoria mediante la barra y los bloques de memoria.
- **Compactar**: Reorganiza la memoria para eliminar la fragmentación.
- **Limpiar**: Elimina todos los procesos y libera toda la memoria.

### Shell del Sistema

La shell te permite interactuar con el simulador mediante comandos:

- `ps`: Lista todos los procesos activos
- `run [nombre]`: Crea un nuevo proceso (opcional: especificar nombre)
- `kill [pid]`: Termina un proceso por su PID
- `mem`: Muestra el estado actual de la memoria
- `compactar`: Ejecuta la compactación de memoria
- `ciclo`: Ejecuta un ciclo del planificador
- `clear`: Limpia la consola
- `help`: Muestra los comandos disponibles
- `exit`: Finaliza la sesión del simulador

## Componentes del Simulador

1. **Proceso**: Unidad básica de ejecución con PID, nombre, estado, y requisitos de memoria/CPU.
2. **Planificador**: Implementa el algoritmo Round-Robin para la ejecución de procesos.
3. **Gestor de Memoria**: Administra la asignación y liberación de memoria para procesos.
4. **Sistema Operativo**: Orquesta la interacción entre los componentes anteriores.

## Tecnologías Utilizadas

- React.js
- JavaScript (ES6+)
- CSS3 con animaciones

