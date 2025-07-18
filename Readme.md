# 3D Tetris (WebGL)

A 3D Tetris game implemented in **JavaScript** with **WebGL**.  
Rotate, translate, and drop TetraCubes in a 3D grid space with real-time lighting and perspective/orthographic camera views.

---

## 🚀 Features

- **3D TetraCubes**: Includes I, O, L, T, N, Tripod, Tower shapes.
- **WebGL Rendering**: Uses shaders for lighting and color.
- **Keyboard Controls** for movement, rotation, and camera.
- **Perspective and Orthographic Views** with smooth switching.
- Dynamic lighting with vertex and fragment shaders.
- OBJ parser for loading 3D models.

---

## 🎮 Controls

| Key              | Action                         |
|------------------|---------------------------------|
| `W / S`          | Move TetraCube forward/back    |
| `A / D`          | Move TetraCube left/right      |
| `Arrow keys`     | Same as W/A/S/D                |
| `Space`          | Speed up falling               |
| `P`              | Pause/Unpause game             |
| `G`              | Toggle grid complexity         |
| `X / x`          | Rotate around X axis           |
| `Y / y`          | Rotate around Y axis           |
| `Z / z`          | Rotate around Z axis           |
| `+ / -`          | Zoom in/out                    |
| `V`              | Change view (perspective/ortho)|
| `Shift+V`        | Reset camera view              |
| `I/J/K/L/U/O`    | Rotate camera in 3D space       |
| Mouse Scroll     | Zoom in/out                    |

---

## ⚙️ How to Start

### Windows
1. Open `index.html` in **Google Chrome** (double-click or right-click → Open with Chrome).  

### macOS
1. Install the **Live Server** extension in VS Code:
   - Open VS Code → Extensions → Search `Live Server` → Install
2. Right-click `index.html` → **Open with Live Server**
3. Browser will open automatically at `http://localhost:5500`

---

## 🖤 Technologies Used
- **WebGL** – 3D rendering
- **GLSL** – Custom vertex and fragment shaders
- **glMatrix** – Vector and matrix math
- Vanilla JavaScript – No frameworks

---

## ✨ Credits
This project was developed as part of a learning exercise in **3D graphics programming** and WebGL.
