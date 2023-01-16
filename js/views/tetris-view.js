import {pieces} from "../controllers/tetris-controllers.js";

/// Classe qui gère l'affichage du jeu
///
/// Paramétres :
/// game : instance de la classe TetrisGame
/// element : élément HTML qui contient le canvas
class TetrisView {
    constructor() {
        this.canvas = document.querySelector('#tetris');
        this.ctx = this.canvas.getContext('2d');
        this.blockSize = 40;

        this.nextPieceCanvas = document.querySelector('#nextPiece');
        this.nextPieceCtx = this.nextPieceCanvas.getContext('2d');
    }

    /// Fonction qui dessine la pièce suivante
    ///
    /// Paramétres :
    /// gridWidth : largeur de la grille
    /// gridHeight : hauteur de la grille
    /// nextPiece : pièce suivante
    drawNextPieceGrid(gridWidth, gridHeight, nextPiece) {
        this.nextPieceCtx.clearRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);
        this.nextPieceCtx.strokeStyle = 'black';
        this.nextPieceCtx.lineWidth = 1;
        this.nextPieceCtx.strokeRect(0, 0, gridWidth * this.blockSize, gridHeight * this.blockSize);

        for (let row = 0; row < gridHeight; row++) {
            for (let col = 0; col < gridWidth; col++) {
                if (nextPiece[row][col] !== 0) {
                    this.nextPieceCtx.fillStyle = pieces[nextPiece[row][col]].color;
                    this.nextPieceCtx.fillRect(col * this.blockSize, row * this.blockSize, this.blockSize, this.blockSize);
                }
            }
        }
    }

    /// Fonction qui dessine les traits de la grille
    ///
    /// Paramétres :
    /// gridWidth : largeur de la grille
    /// gridHeight : hauteur de la grille
    drawGrid(gridWidth, gridHeight){
        // Définit les propriétés du contexte (couleur, épaisseur, etc.)
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 0.5;
        this.ctx.background = '#000';

        // Remplit le canvas avec la couleur de fond
        this.ctx.fillStyle = this.ctx.background;

        // Dessine les lignes verticales de la grille
        for (let x = 0; x < gridWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, gridHeight * this.blockSize);
            this.ctx.stroke();
        }

        // Dessine les lignes horizontales de la grille
        for (let y = 0; y < gridHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(gridWidth * this.blockSize, y * this.blockSize);
            this.ctx.stroke();
        }

        // Affiche les coordonnées de chaque cellule
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                this.ctx.fillStyle = '#fff';
                this.ctx.textAlign = 'center';
                this.ctx.font = 'bold 15px sans-serif';
                this.ctx.fillText(y + ',' + x, x * this.blockSize + this.blockSize / 2, y * this.blockSize + this.blockSize / 2);
            }
        }
    }

    /// Fonction qui actualise la grille de jeu
    ///
    /// Paramétres :
    /// grid : grille de jeu
    refreshBoard(grid) {
        // Obtiens la pièce suivante
        //let nextPiece = this.getNextPiece();

         // Pour chaque valeur de grid, dessine un bloc de la couleur correspondante via l'id de la pièce
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                // Si la valeur est 0, dessine un bloc noir
                if (grid[row][col] === 0) {
                    this.ctx.fillStyle = '#000';
                    this.ctx.fillRect(col * this.blockSize, row * this.blockSize, this.blockSize, this.blockSize);
                } else {
                    // Sinon, dessine un bloc de la couleur de la pièce
                    const pieceId = grid[row][col];

                    // Cherche la bonne pièce via l'ID dans le tableau des pièces via le constroller
                    const piece = pieces.find(piece => piece.id === pieceId);

                    // Dessine le bloc de la couleur de la pièce correspondante
                    this.ctx.fillStyle = piece.color;
                    this.ctx.fillRect(col * this.blockSize, row * this.blockSize, this.blockSize, this.blockSize);
                }
            }
        }

        // Dessine les traits de la grille
        const gridWidth = grid[0].length;
        const gridHeight = grid.length;
        this.drawGrid(gridWidth, gridHeight);
        //this.drawNextPieceGrid(4, 4, nextPiece);
    }
}

export default TetrisView;