import { prepareBackground } from './ui/Background.js';
import { setupWelcomeScreen } from './ui/WelcomeScreen.js';
import { setupGameScreen, updateScore } from './ui/GameScreen.js';

// Фон со звездами всегда виден
prepareBackground();
setupWelcomeScreen();
setupGameScreen();
