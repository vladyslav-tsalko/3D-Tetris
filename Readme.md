# 3D Tetris in Space 🌌  

A complete **3D Tetris game** implemented in **JavaScript (WebGL)** with a full **Java Spring Boot backend** for user management, high scores, and authentication.  
This project evolved from a simple WebGL Tetris demo into a fully-featured web app with registration, login, and persistent player stats stored in a database.

---

## 🚀 Features  

### 🎮 Gameplay  
- **3D TetraCubes**: Classic and custom shapes (I, O, L, T, N, Tripod, Tower).  
- **WebGL Rendering**: Real-time lighting and perspective/orthographic camera views.  
- **Keyboard Controls** for movement, rotation, and camera (see below).  
- **Dynamic Scoring System**: Points for clearing horizontal and vertical slices.  
- **Pause/Restart & HUD**: Live score display and controls during gameplay.

### 🧑‍💻 User System  
- **Registration & Login** via Spring Boot backend.  
- **JWT Authentication** for secure communication between client and server.  
- **Persistent High Scores** stored in a relational database.  
- **Top-10 Players Leaderboard** shown directly in the UI.  

### 🌐 UI & UX  
- **Guest and Logged-In Modes** with different menus.  
- **Modals for Login, Registration, and Controls**.  
- **Dynamic Error Popups** for invalid credentials or registration issues.  
- **Responsive Table for Top Players** with nickname and max score.  
- **Modern Dark Theme** with white/black alternating rows in tables.  

---

## 🎮 Controls  

| Key              | Action                         |
|------------------|---------------------------------|
| `W / S`          | Move TetraCube forward/back    |
| `A / D`          | Move TetraCube left/right      |
| `Arrow keys`     | Same as W/A/S/D                |
| `Space`          | Speed up falling               |
| `P`              | Pause / Unpause game           |
| `G`              | Toggle grid complexity         |
| `X / x`          | Rotate around X axis           |
| `Y / y`          | Rotate around Y axis           |
| `Z / z`          | Rotate around Z axis           |
| `+ / -`          | Zoom in/out                    |
| `Shift+V`        | Reset camera view              |
| Mouse Scroll     | Zoom in/out                    |

---

## 🖥️ Architecture Overview  

### Frontend (WebGL + Vanilla JS)  
- Renders the 3D game using **WebGL** and **GLSL shaders**.  
- Manages UI (login/register modals, score HUD, leaderboard).  
- Communicates with backend using `fetch` + JWT tokens.  

### Backend (Spring Boot)  
- **Endpoints** for `/api/players` (registration, login) and `/api/stats` (high scores).  
- **Security** via Spring Security + JWT filters. 
- **Repositories & DTOs** to map database entities to API responses.  
- **Database** stores players and their max scores.  

---

## ⚙️ How to Run Locally  

### Frontend  
1. Clone the repository.  
2. Open `index.html` in Chrome **or** run via Live Server in VS Code.  
3. The game UI will load — you can play as a guest or log in/register to save scores.  

### Backend  
1. Open the Spring Boot project (folder `tetris-backend`) in your IDE.  
2. Set up your database credentials in `application.properties` (not committed to Git).  
3. Run the Spring Boot app. By default it runs on `http://localhost:8080`.  
4. The frontend automatically calls the backend endpoints for login, register, and stats.  

---

## 🖤 Technologies Used  
### Frontend  
- **WebGL** – 3D rendering  
- **GLSL** – Custom vertex and fragment shaders  
- **glMatrix** – Vector and matrix math  
- Vanilla JavaScript – UI logic and API calls  

### Backend  
- **Spring Boot** – REST API  
- **Spring Security + JWT** – Authentication  
- **JPA / Hibernate** – Database access  
- **H2 / PostgreSQL / MySQL** – Configurable database  

---

## 🏆 Highlights & Interesting Parts  
- **Real-time WebGL 3D gameplay** in browser with lighting and shaders.  
- **Authenticated high score system**: scores are stored on the server and tied to each user account.
- **JWT-based auth** ensures only logged-in players can update their scores.  
- **Top-10 leaderboard** dynamically rendered from the backend.  
- **Compact modals and error popups** for smooth UX.  

---

## ✨ Credits  
This project started as a learning exercise in **3D graphics programming** and evolved into a full **web + backend application** with authentication and persistent scoring.  
Developed by Vladyslav Tsalko as part of ongoing software engineering and WebGL studies.
