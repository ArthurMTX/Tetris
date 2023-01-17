import {pieces, rows} from "../controllers/tetris-controllers.js";

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
    drawNextPieceGrid(gridWidth, gridHeight) {
        let nextPiece = pieces.find(piece => piece.id === -1);

        // Réinitialisation du canvas
        this.nextPieceCtx.clearRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);

        // Dimensions du canvas
        this.nextPieceCanvas.width = gridWidth * this.blockSize;
        this.nextPieceCanvas.height = gridHeight * this.blockSize;

        // Bordure du canvas
        this.nextPieceCtx.strokeStyle = 'black';
        this.nextPieceCtx.lineWidth = 2;
        this.nextPieceCtx.strokeRect(0, 0, gridWidth * this.blockSize, gridHeight * this.blockSize);

        // Applique la texture de la pièce
        const blockTexture = new Image();
        blockTexture.src = './Assets/img/block.jpg';

        for (let i = 0; i < nextPiece.pattern.length; i++) {
            for (let j = 0; j < nextPiece.pattern[i].length; j++) {
                if (nextPiece.pattern[i][j] !== 0) {
                    this.nextPieceCtx.drawImage(blockTexture, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);

                    // Applique un overlay de couleur sur le bloc
                    this.nextPieceCtx.globalAlpha = 0.7;
                    this.nextPieceCtx.fillStyle = nextPiece.color;
                    this.nextPieceCtx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
                    this.nextPieceCtx.globalAlpha = 1;
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
        this.ctx.shadowBlur = 10;
        this.ctx.lineWidth = 0.5;
        this.ctx.background = '#000';
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

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

        /*
        // ############################################################## DEBUG ONLY ##############################################################
        // Affiche les coordonnées de chaque cellule
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                this.ctx.fillStyle = '#fff';
                this.ctx.textAlign = 'center';
                this.ctx.font = 'bold 15px sans-serif';
                this.ctx.fillText(y + ',' + x, x * this.blockSize + this.blockSize / 2, y * this.blockSize + this.blockSize / 2);
            }
        }
        // ############################################################## DEBUG ONLY ##############################################################
        */
    }

    /// Fonction qui actualise la grille de jeu
    ///
    /// Paramétres :
    /// grid : grille de jeu
    refreshBoard(grid, mode) {
        // Dessine les traits de la grille
        const gridWidth = grid[0].length;
        const gridHeight = grid.length;

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

                    // Cherche la bonne pièce via l'ID dans le tableau pieces
                    const piece = pieces.find(piece => piece.id === pieceId);

                    // Mets a jour les coordonnées de la pièce
                    piece.coords = {x: col, y: row};

                    // Mets a jour les blocs de la pièce
                    piece.blocks = [];
                    for (let i = 0; i < piece.pattern.length; i++) {
                        for (let j = 0; j < piece.pattern[i].length; j++) {
                            if (piece.pattern[i][j] !== 0) {
                                piece.blocks.push({x: j, y: i});
                            }
                        }
                    }

                    // Applique la texture de la pièce
                    const blockTexture = new Image();
                    blockTexture.src = './Assets/img/block.jpg';
                    this.ctx.drawImage(blockTexture, col * this.blockSize, row * this.blockSize, this.blockSize, this.blockSize);

                    // Applique un overlay de couleur sur le bloc
                    this.ctx.globalAlpha = 0.7;
                    this.ctx.fillStyle = piece.color;
                    this.ctx.fillRect(col * this.blockSize, row * this.blockSize, this.blockSize, this.blockSize);
                    this.ctx.globalAlpha = 1;
                }
            }
        }

        // Si une ligne est complète, la supprime
        this.removeLine();

        this.drawGrid(gridWidth, gridHeight);

        if (mode === 'full') {
            this.drawNextPieceGrid(4, 4);
        }
    }

    bindRemoveLine(bindRemoveLine) {
        this.removeLine = bindRemoveLine;
    }
}

export default TetrisView;