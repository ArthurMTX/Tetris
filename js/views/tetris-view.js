import {currentPiece, grid} from '../models/tetris-game.js';
import {pieces} from "../models/tetris-piece.js";
import TetrisControllers from "../controllers/tetris-controllers.js";

export let blockSize;
export let ctx;

// Classe qui représente la vue du jeu Tetris
class TetrisView {
    constructor(game, element) {
        this.game = game;
        this.element = element;
        this.canvas = document.querySelector('#tetris');
        ctx = this.canvas.getContext('2d');
        blockSize = 40;
    }

    // Méthode qui met à jour l'interface utilisateur en fonction de l'état du jeu
    update(game) {
        // Effacez la grille de jeu
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessinez la grille de jeu
        this.drawGrid(game.grid);

        // Si le jeu est terminé, affichez un message de game over
        if (game.gameOver) {
            ctx.fillStyle = '#000';
            ctx.font = 'bold 40px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('PERDU XD!', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    drawGrid() {
        // Définit la couleur et l'épaisseur des lignes de la grille
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.5;
        ctx.background = '#000';

        ctx.fillStyle = ctx.background;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessine les lignes verticales de la grille
        for (let x = 0; x < this.game.cols; x++) {
            ctx.beginPath();
            ctx.moveTo(x * blockSize, 0);
            ctx.lineTo(x * blockSize, this.game.rows * blockSize);
            ctx.stroke();
        }

        // Dessine les lignes horizontales de la grille
        for (let y = 0; y < this.game.rows; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * blockSize);
            ctx.lineTo(this.game.cols * blockSize, y * blockSize);
            ctx.stroke();
        }

        // Affiche les coordonnées de chaque cellule
        for (let y = 0; y < this.game.rows; y++) {
            for (let x = 0; x < this.game.cols; x++) {
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.font = 'bold 15px sans-serif';
                ctx.fillText(y + ',' + x, x * blockSize + blockSize / 2, y * blockSize + blockSize / 2);
            }
        }

        refreshBoard(grid);
    }

    drawPiece(piece) {
        // Définissez la couleur de remplissage de la pièce
        ctx.fillStyle = piece.color;

        // Parcourez chaque ligne de la pièce
        for (let y = 0; y < piece.pattern.length; y++) {
            // Parcourez chaque colonne de la pièce
            for (let x = 0; x < piece.pattern[y].length; x++) {
                // Vérifiez si le bloc en cours de traitement est un bloc de remplissage
                if (piece.pattern[y][x]) {
                    // Dessinez un rectangle rempli pour chaque bloc de la pièce
                    ctx.fillRect(
                        (piece.col + x) * blockSize,
                        (piece.row + y) * blockSize,
                        blockSize,
                        blockSize
                    );

                    grid[piece.row + y][piece.col + x] = piece.id;
                }
            }
        }
    }

    countdown(seconds) {
        // Effacez la grille de jeu
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Affichez le compte à rebours
        ctx.fillStyle = '#000';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(seconds, this.canvas.width / 2, this.canvas.height / 2);

        // Si le compte à rebours est terminé, lancez la partie
        if (seconds <= 0) {
            this.game.startNewGame();
            this.update(this.game);
            TetrisControllers.bindEvents(this.game);

            //const tetrisGameElement = document.getElementById('tetris');
            //tetrisGameElement.addEventListener('mousemove', movePiece);

        } else {
            // Sinon, décrémentez le compte à rebours et relancez la fonction
            setTimeout(() => this.countdown(seconds - 1), 1000);
        }
    }
}

export function drawOutlines(gridWidth, gridHeight){
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.5;
    ctx.background = '#000';

    ctx.fillStyle = ctx.background;

    // Dessine les lignes verticales de la grille
    for (let x = 0; x < gridWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * blockSize, 0);
        ctx.lineTo(x * blockSize, gridHeight * blockSize);
        ctx.stroke();
    }

    // Dessine les lignes horizontales de la grille
    for (let y = 0; y < gridHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * blockSize);
        ctx.lineTo(gridWidth * blockSize, y * blockSize);
        ctx.stroke();
    }

    // Affiche les coordonnées de chaque cellule
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = 'bold 15px sans-serif';
            ctx.fillText(y + ',' + x, x * blockSize + blockSize / 2, y * blockSize + blockSize / 2);
        }
    }
}

export function refreshBoard(grid) {
    // Pour chaque valeur de grid, dessinez un bloc de la couleur correspondante via l'id de la pièce
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 0) {
                ctx.fillStyle = '#000';
                ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            } else {
                const pieceId = grid[row][col];

                const piece = pieces.find(piece => piece.id === pieceId);

                ctx.fillStyle = piece.color;
                ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }

    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    drawOutlines(gridWidth, gridHeight);
}

export default TetrisView;