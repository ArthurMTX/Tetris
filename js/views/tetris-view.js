import  {grid} from '../models/tetris-game.js';
import {pieces} from "../models/tetris-piece.js";
import TetrisControllers from "../controllers/tetris-controllers.js";

// Variable qui contient la taille d'une cellule
export let blockSize;

// Variable qui contient le contexte du canvas
export let ctx;

/// Classe qui gère l'affichage du jeu
///
/// Paramétres :
/// game : instance de la classe TetrisGame
/// element : élément HTML qui contient le canvas
class TetrisView {
    constructor(game, element) {
        this.game = game;
        this.element = element;
        this.canvas = document.querySelector('#tetris');
        ctx = this.canvas.getContext('2d');
        blockSize = 40;
    }

    /// Méthode qui dessine la grille de jeu
    ///
    /// Paramétres :
    /// grid : instance de la classe TetrisGame
    update(game) {
        // Efface le canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessine la grille
        this.drawGrid(game.grid);

        // Si le jeu est terminé, affiche un message
        if (game.gameOver) {
            ctx.fillStyle = '#000';
            ctx.font = 'bold 40px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('PERDU XD!', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    /// Méthode qui dessine la grille de jeu
    ///
    /// Paramétres :
    /// aucun
    drawGrid() {
        // Définit les propriétés du contexte (couleur, épaisseur, etc.)
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.5;
        ctx.background = '#000';

        // Remplit le canvas avec la couleur de fond
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

        // Actualise la grille de jeu
        refreshBoard(grid);
    }

    /// Méthode qui affiche un compte à rebours avant de lancer la partie
    ///
    /// Paramétres :
    /// seconds : nombre de secondes du compte à rebours
    countdown(seconds) {
        // Efface le canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Affiche le compte à rebours
        ctx.fillStyle = '#000';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(seconds, this.canvas.width / 2, this.canvas.height / 2);

        // Si le compte à rebours est terminé, lance une nouvelle partie
        if (seconds <= 0) {
            this.game.startNewGame();
            this.update(this.game);
            TetrisControllers.bindEvents(this.game);
        } else {
            // Sinon, décrémente le compte à rebours et relance la méthode
            setTimeout(() => this.countdown(seconds - 1), 1000);
        }
    }
}

/// Fonction qui dessine les traits de la grille
///
/// Paramétres :
/// gridWidth : largeur de la grille
/// gridHeight : hauteur de la grille
export function drawOutlines(gridWidth, gridHeight){
    // Définit les propriétés du contexte (couleur, épaisseur, etc.)
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.5;
    ctx.background = '#000';

    // Remplit le canvas avec la couleur de fond
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

/// Fonction qui actualise la grille de jeu
///
/// Paramétres :
/// grid : grille de jeu
export function refreshBoard(grid) {
    // Pour chaque valeur de grid, dessine un bloc de la couleur correspondante via l'id de la pièce
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            // Si la valeur est 0, dessine un bloc noir
            if (grid[row][col] === 0) {
                ctx.fillStyle = '#000';
                ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            } else {
                // Sinon, dessine un bloc de la couleur de la pièce
                const pieceId = grid[row][col];

                const piece = pieces.find(piece => piece.id === pieceId);

                ctx.fillStyle = piece.color;
                ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }

    // Dessine les traits de la grille
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    drawOutlines(gridWidth, gridHeight);
}

export default TetrisView;