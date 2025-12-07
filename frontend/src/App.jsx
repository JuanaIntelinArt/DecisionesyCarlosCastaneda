// frontend/src/App.jsx (SIMPLIFICADO - Lógica del Árbol)
import React, { useState } from 'react';
import './App.css'; 

// URL base de tu backend de FastAPI
const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

function App() {
  const [problem, setProblem] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('castaneda');
  const [currentIteration, setCurrentIteration] = useState({
    id: null,
    solution: '',
    concern: '',
    showConcernInput: false,
  });

  // 1. Maneja el envío del problema inicial al backend
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

    const postData = { problem, theme: selectedTheme };

    try {
      const response = await fetch(`${API_BASE_URL}/generate-solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      
      // Inicializa el árbol con las 3 soluciones principales
      setTreeData(data.map(item => ({ ...item, children: [] })));
      // Limpia el formulario de preocupación
      setCurrentIteration({ id: null, solution: '', concern: '', showConcernInput: false });
    } catch (error) {
      console.error("Error al obtener soluciones iniciales:", error);
    }
  };

  // 2. Maneja la selección de una hoja (solución)
  const handleSelectSolution = (id, idea) => {
    // Muestra el input de preocupación debajo de la solución seleccionada
    setCurrentIteration({ id: id, solution: idea, concern: '', showConcernInput: true });
  };

  // 3. Maneja el envío de la preocupación (para ramificar el árbol)
  const handleConcernSubmit = async (e) => {
    e.preventDefault();
    if (!currentIteration.concern.trim()) return;

    // Datos que se envían al endpoint /deepen-tree
    const postData = {
        problem: problem, // Se envía el problema raíz original
        selected_solution: currentIteration.solution,
        concern: currentIteration.concern,
        parent_id: currentIteration.id, // ID de la solución seleccionada
        theme: selectedTheme
    };

    try {
        const response = await fetch(`${API_BASE_URL}/deepen-tree`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });
        const newIdeas = await response.json();

        // Actualiza el estado del árbol (treeData)
        setTreeData(prevData => {
            // Función recursiva para encontrar el nodo padre y añadir los nuevos hijos
            const updateNode = (nodes) => nodes.map(node => {
                if (node.id === currentIteration.id) {
                    return {
                        ...node,
                        // Añade las nuevas ideas como hijos de esta solución
                        children: newIdeas.map(item => ({ ...item, children: [] }))
                    };
                }
                // Si no es el nodo, busca en sus hijos
                if (node.children && node.children.length) {
                    return { ...node, children: updateNode(node.children) };
                }
                return node;
            });
            return updateNode(prevData);
        });

        // Oculta el formulario de preocupación después de enviarlo
        setCurrentIteration({ id: null, solution: '', concern: '', showConcernInput: false });
    } catch (error) {
        console.error("Error al obtener ramificaciones:", error);
    }
  };

  // 4. Función Recursiva para Renderizar el Árbol (JSX)
  const renderTree = (nodes, level = 0) => (
    <ul className={`tree-level-${level}`}>
      {nodes.map(node => (
        <li key={node.id} className="tree-node">
          {/* Botón/Hoja de Solución */}
          <div className="leaf-button" onClick={() => handleSelectSolution(node.id, node.idea)}>
            {node.idea}
          </div>
          
          {/* Renderiza los hijos si existen */}
          {node.children.length > 0 && renderTree(node.children, level + 1)}
          
          {/* Muestra el formulario de preocupación debajo del nodo activo */}
          {currentIteration.showConcernInput && currentIteration.id === node.id && (
            <form onSubmit={handleConcernSubmit} className="concern-form">
              <textarea
                placeholder={`¿Qué te preocupa de la solución: ${node.idea}?`}
                value={currentIteration.concern}
                onChange={(e) => setCurrentIteration({...currentIteration, concern: e.target.value})}
              />
              <button type="submit">Generar Ramificaciones de Acción</button>
            </form>
          )}
        </li>
      ))}
    </ul>
  );

  // 5. Estructura Principal del Componente
  return (
    <div className="app-container">
      <h1>🌳 ArboldeDecisiones</h1>

      {/* EL TRONCO: Input Inicial */}
      <form onSubmit={handleInitialSubmit} className="trunk-form">
        <textarea
          placeholder="Escribe aquí tu problema, idea o decisión a tomar (el Tronco)..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
        
        {/* SELECT DE TEMAS */}
        <div className="theme-selector">
          <label htmlFor="theme-select">Aplicar el enfoque de:</label>
          <select 
            id="theme-select"
            value={selectedTheme} 
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            <option value="castaneda">Carlos Castaneda</option>
            <option value="filosofia">Filosofía (Estoicismo)</option>
            <option value="cognitiva">Psicología Cognitiva</option>
          </select>
        </div>
        
        <button type="submit" disabled={!problem.trim()}>Generar Hojas Iniciales</button>
      </form> {/* CIERRE CORRECTO DEL FORMULARIO INICIAL */}

      {/* EL ÁRBOL: Visualización de las Ideas */}
      <div className="tree-container">
        {treeData.length > 0 ? (
          renderTree(treeData)
        ) : (
          <p className="placeholder-text">Escribe tu problema para empezar.</p>
        )}
      </div>
    </div>
  );
}

export default App;