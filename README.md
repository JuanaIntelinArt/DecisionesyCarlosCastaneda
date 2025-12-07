# 🌳 ArboldeDecisiones: Diario Temático de Solución de Problemas

Una aplicación web minimalista y enfocada en la introspección para visualizar decisiones y problemas complejos mediante una estructura de árbol ramificado. Utiliza enfoques filosóficos y psicológicos para guiar al usuario a través de posibles soluciones y mitigar preocupaciones.

---

## 🌟 Filosofía del Proyecto y Futuro

**ENFOQUE ACTUAL: Respuesta Programada como Base de Ideas**

Este prototipo prioriza la **coherencia conceptual** y la **estabilidad** al utilizar un sistema de respuestas pre-programadas (*Mockup*) en el backend de Python. Esto garantiza que las soluciones siempre se centren en los temas elegidos: **Carlos Castaneda, Filosofía (Estoicismo), y Psicología Cognitiva**.

Este método nos permite establecer una **base de ideas** sólida y probar la lógica de ramificación del árbol antes de añadir complejidad.

### ➡️ Futuro: Integración de IA

La siguiente fase del desarrollo incluirá la integración de un **Modelo de Lenguaje Grande (LLM)** a través de una API (como OpenAI) para generar respuestas dinámicas y personalizadas en lugar de las respuestas Mockup.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React, Vite | Interfaz de Usuario (UI) y Lógica del Árbol. |
| **Backend** | Python, FastAPI | Servidor API para gestionar las respuestas y la lógica de ramificación. |
| **Estilos** | CSS Puro | Diseño minimalista con paleta de colores pasteles cálidos. |

---

## 🚀 Guía Rápida de Instalación y Ejecución

Para iniciar el proyecto, debes ejecutar el frontend y el backend en terminales separadas.

### 1. Instalación de Dependencias

Asegúrate de tener Python (con `pip`) y Node.js (con `npm`) instalados.

#### A. Backend (Python)

```bash
# Navega a la carpeta backend
cd backend

# Instala las librerías necesarias (FastAPI, uvicorn, pydantic)
pip install fastapi uvicorn pydantic
