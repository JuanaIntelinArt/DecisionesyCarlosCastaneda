# backend/main.py (SIMPLIFICADO - Sin DB)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# ⚠️ DEPENDENCIAS CLAVE: Instalar manualmente si es necesario
# pip install fastapi uvicorn pydantic python-multipart 

app = FastAPI(title="Arbol de Decisiones Simplificado")

# --- Configuración CORS ---
# Permite la comunicación entre el frontend (ej. localhost:5173) y este backend.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Modelos de Datos ---
class ProblemInput(BaseModel):
    problem: str
    theme: str 

class DeepenInput(BaseModel):
    problem: str
    selected_solution: str
    concern: str
    parent_id: Optional[int] = None
    theme: str 

class SolutionOutput(BaseModel):
    id: int
    idea: str
    parent_id: Optional[int] = None

# --- Mock Data ---
MOCK_SOLUTIONS: Dict[str, List[str]] = {
    "castaneda": ["La Impecabilidad (Acciones sin cabos sueltos).", "El Guerrero (Responsabilidad total).", "El Acecho (Auto-control y paciencia)."],
    "filosofia": ["Estoicismo (Controlar solo tus juicios).", "Existencialismo (Libertad radical de elección).", "Ética Aristotélica (Buscar la Eudaimonia)."],
    "cognitiva": ["Reestructuración Cognitiva (Desafiar pensamientos irracionales).", "Exposición Gradual (Enfrentar miedos paso a paso).", "Mindfulness (Observar sin juzgar)."],
}

MOCK_DEEPER_SOLUTIONS: Dict[str, List[str]] = {
    "castaneda": ["Implementa la técnica del No Hacer para romper patrones habituales.", "Practica Borrar la Historia Personal para liberar energía."],
    "filosofia": ["Escribe un Diario de Reflexión estoico para catalogar juicios.", "Aplica el Memento Mori para priorizar lo esencial."],
    "cognitiva": ["Desarrolla un registro ABC de tus reacciones.", "Crea un Experimento de Comportamiento para probar tus miedos."],
}

# Contador global para IDs (ya que no usamos DB)
solution_counter = 1000

# --- Endpoint 1: Generar Hojas Iniciales ---
@app.post("/api/generate-solutions", response_model=List[SolutionOutput])
def generate_solutions_mock(data: ProblemInput):
    global solution_counter
    theme_key = data.theme.lower()
    
    if theme_key not in MOCK_SOLUTIONS:
        raise HTTPException(status_code=400, detail=f"Tema '{data.theme}' no reconocido.")

    solutions = MOCK_SOLUTIONS[theme_key]
    response = []
    
    for idea in solutions:
        response.append(SolutionOutput(id=solution_counter, idea=f"[{data.theme.upper()}] {idea}", parent_id=None))
        solution_counter += 1
        
    return response

# --- Endpoint 2: Profundizar en la Solución ---
@app.post("/api/deepen-tree", response_model=List[SolutionOutput])
def deepen_tree_mock(data: DeepenInput):
    global solution_counter
    theme_key = data.theme.lower()
    
    mock_ideas = MOCK_DEEPER_SOLUTIONS.get(theme_key, MOCK_DEEPER_SOLUTIONS["cognitiva"])
    
    response = []
    for idea in mock_ideas:
        response.append(SolutionOutput(id=solution_counter, idea=f"[{data.theme.upper()} - Acción] {idea}", parent_id=data.parent_id))
        solution_counter += 1

    return response