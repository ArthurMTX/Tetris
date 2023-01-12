import TetrisGame from './models/tetris-game.js';
import TetrisView from './views/tetris-view.js';
import TetrisController from './controllers/tetris-controllers.js';

// Élement principal pour le jeu
const tetrisGameElement = document.getElementById('tetris');

// Booléen pour savoir si le jeu est commencé ou non
let gameStarted = false;

const max_cols = document.getElementById("cols").max;
const max_rows = document.getElementById("rows").max;

// Intancie les objets visuels et logiques du jeu
const game = new TetrisGame(20, 10);
const view = new TetrisView(game, tetrisGameElement);

// Intancie le contrôle afin de commencer la partie
document.querySelector('#start').addEventListener('click', () => {
    if (!gameStarted){
        gameStarted = true
        start();
    }
});

// Intancie le contrôle afin de commencer la partie
document.addEventListener('keydown', (event) => {
    console.log(cols,rows)
    if ( cols > max_cols && rows > max_rows){
        alert("TO MUCH ROW");
        return 0;
    }
    if (event.key === ' ' || event.key === 'Enter') {
        if (!gameStarted){
            gameStarted = true;
            start();
        } else {
            console.log("Game already running.")
        }
    }
});

/// Sommaire :
/// Fonction qui gère le démarrage du jeu
/// Réinstancie les objects visuels et logiques du jeu
///
/// Paramétres :
///
function start() {
    const rows = document.querySelector('#rows').value;
    const cols = document.querySelector('#cols').value;
    const game = new TetrisGame(rows, cols);
    const controller = new TetrisController(game, view);
    controller.start();

    // Cache le menu de début de jeu
    document.querySelector('#menu').classList.add('hidden');

    // Affiche le compte à rebours
    view.countdown(3);
}