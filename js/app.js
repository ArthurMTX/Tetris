import TetrisGame from './models/tetris-game.js';
import TetrisView from './views/tetris-view.js';
import TetrisController from './controllers/tetris-controllers.js';

const tetrisGameElement = document.getElementById('tetris');

let gameStarted = false;

const game = new TetrisGame(20, 10);
const view = new TetrisView(game, tetrisGameElement);

function start() {
    const rows = document.querySelector('#rows').value;
    const cols = document.querySelector('#cols').value;
    const game = new TetrisGame(rows, cols);
    const controller = new TetrisController(game, view);
    controller.start();
    document.querySelector('#menu').classList.add('hidden');

    view.countdown(3);
}


document.querySelector('#start').addEventListener('click', () => {
    if (!gameStarted){
        gameStarted = true
        start();
    } else {
        console.log("Game already running.")
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
        if (!gameStarted){
            gameStarted = true;
            start();
        } else {
            console.log("Game already running.")
        }
    }
});