import TetrisGame from './models/tetris-game.js';
import TetrisView from './views/tetris-view.js';
import TetrisController from './controllers/tetris-controllers.js';

// Élement principal pour le jeu
const tetrisGameElement = document.getElementById('tetris');

// Booléen pour savoir si le jeu est commencé ou non
let gameStarted = false;

// Intancie les objets visuels et logiques du jeu
const game = new TetrisGame(20, 10);
const view = new TetrisView(game, tetrisGameElement);

// Intancie le contrôle afin de commencer la partie
document.querySelector('#start').addEventListener('click', () => {
    // Vérifie que le jeu n'est pas déjà commencé
    if (!gameStarted){
        gameStarted = true
        start();
    }
});

// Intancie le contrôle afin de commencer la partie
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
        // Vérifie que le jeu n'est pas déjà commencé
        if (!gameStarted){
            gameStarted = true;
            start();
        }
    }
});

/// Fonction qui gère le démarrage du jeu
/// Réinstancie les objects visuels et logiques du jeu
///
/// Paramétres :
/// Aucun
function start() {
    // Récupère les valeurs de la taille de la grid
    const rows = document.querySelector('#rows').value;
    const cols = document.querySelector('#cols').value;

    // Accéde aux valeurs max de la taille de la grid
    const max_cols = document.getElementById("cols").max;
    const max_rows = document.getElementById("rows").max;
    const min_cols = document.getElementById("cols").min;
    const min_rows = document.getElementById("rows").min;

    // Vérifie que la taille de la grid est valide
    if (rows > max_rows || 
        cols > max_cols || 
        rows < min_rows || 
        cols < min_cols) {
        const gridSizeError = 'La taille de la grille est invalide. Veuillez choisir une taille entre ' 
        + min_rows + ' et ' + max_rows + ' pour les lignes et entre ' + min_cols + 
        ' et ' + max_cols + ' pour les colonnes.'
        console.log(gridSizeError);
        alert(gridSizeError);
        gameStarted = false;
        return;
    }

    // Réinstancie les objets visuels et logiques du jeu
    const game = new TetrisGame(rows, cols);
    const controller = new TetrisController(game, view);
    controller.start();

    // Cache le menu de début de jeu
    document.querySelector('#menu').classList.add('hidden');

    // Affiche le compte à rebours
    view.countdown(3);
}