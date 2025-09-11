import { prepareBackground } from './ui/Background.js';
import { welcomeScreenHandler } from './ui/WelcomeScreen.js';
import { setupGameScreen, updateScore } from './ui/GameScreen.js';

// Фон со звездами всегда виден
prepareBackground();
welcomeScreenHandler.setupWelcomeScreen();
setupGameScreen();
