import TetrisPiece, {pieces} from "./tetris-piece.js";
import {blockSize, refreshBoard} from "../views/tetris-view.js";

export let currentPiece;
export let nextPiece;
export let grid;
let gridCols;
let gridRows;

// Classe qui représente le jeu Tetris
class TetrisGame {
    constructor(rows, cols) {
        gridRows = rows;
        gridCols = cols;
        grid = this.createEmptyGrid();
    }

    createEmptyGrid() {
        // Modifie la taille du canvas en fonction de la taille de la grille
        this.canvas = document.querySelector('#tetris');
        this.canvas.width = gridCols * blockSize;
        this.canvas.height = gridRows * blockSize;

        const grid = [];
        for (let row = 0; row < gridRows; row++) {
            grid[row] = [];
            for (let col = 0; col < gridCols; col++) {
                grid[row][col] = 0;
            }
        }
        return grid;
    }

    static createRandomPiece() {
        const id = (pieces.length + 1)

        // Choisissez aléatoirement une des 7 formes de pièce Tetris
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];

        // Couleur de la pièce aléatoire
        const color = 'cyan,blue,orange,purple,green,yellow,red'.split(',')[index];

        // Créez une nouvelle pièce Tetris en utilisant la forme choisie
        // et en la positionnant en haut de la grille de jeu
        let newPiece = new TetrisPiece(id, type, color, parseInt(gridCols / 3), -1, 0)
        pieces.push(newPiece)

        // Pour chaque bloc de la pièce, ajoutez la pièce à la grille
        newPiece.blocks.forEach(block => {
            grid[block.row][block.col] = newPiece.id;
        });

        refreshBoard(grid)

        return newPiece;
    }

    // Méthode qui initialise une nouvelle partie
    startNewGame() {
        // Générer une nouvelle pièce Tetris
        currentPiece = TetrisGame.createRandomPiece();

        // Réinitialiser le score du joueur
        this.score = 0;
        this.gameOver = false;
    }

    // Méthode qui met à jour l'état du jeu
    update() {
        // ...
    }

    // Méthode qui gère la fin de la partie
    endGame() {
        // ...
    }

    static getInstance() {
        return this;
    }
}

export function movePiece(direction) {
    currentPiece = pieces[pieces.length - 1];
    let points = []
    let newPoints = []
    let impossibleMouvement = false;

    let gridHeight = grid.length;
    let gridWidth = grid[0].length;

    // Parcourir grid pour trouver les lignes pleines de l'id de la pièce
    for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
            if (grid[row][col] === currentPiece.id) {
                // Stocker les points dans un tableau
                points.push({
                    row: row,
                    col: col
                })
                // Mettre a 0 ces points
                grid[row][col] = 0
            }
        }
    }
    // Retourne l'identifiant de la pièce, 0 si aucune
    function getCaseValue(row, col) {
        if (row < 0 || row >= gridHeight || col < 0 || col >= gridWidth) {
            return 0;
        }
        return grid[row][col];
    }

    points.forEach(point => {
        if (point.col === 0 && direction === 'left') {
            console.log('Impossible de bouger vers la gauche')
            impossibleMouvement = true
        }
        if (point.col === gridWidth - 1 && direction === 'right') {
            console.log('Impossible de bouger vers la droite')
            impossibleMouvement = true
        }
        if (point.row === gridHeight - 1 && direction === 'down') {
            console.log('Impossible de bouger vers le bas')
            impossibleMouvement = true
        }
        if (getCaseValue(point.row + 1, point.col) !== 0 && direction === 'down') {
            console.log('Impossible de bouger vers le bas, il y a une pièce en dessous')
            impossibleMouvement = true
        }
        if (getCaseValue(point.row, point.col + 1) !== 0 && direction === 'right') {
            console.log('Impossible de bouger vers la droite, il y a une pièce à droite')
            impossibleMouvement = true
        }
        if (getCaseValue(point.row, point.col - 1) !== 0 && direction === 'left') {
            console.log('Impossible de bouger vers la gauche, il y a une pièce à gauche')
            impossibleMouvement = true
        }
    })

    if (!impossibleMouvement){
        // Déplacer la pièce dans la direction spécifiée
        switch (direction) {
            case 'left':
                points.forEach(point => {
                    if (point.col > 0) {
                        newPoints.push({
                            row: point.row,
                            col: point.col - 1
                        })
                    }
                })

                // Ajouter ces points dans la grille
                newPoints.forEach(point => {
                    grid[point.row][point.col] = currentPiece.id
                })

                refreshBoard(grid)

                return 1;
            case 'right':
                points.forEach(point => {
                    if (point.col < grid[0].length - 1) {
                        newPoints.push({
                            row: point.row,
                            col: point.col + 1
                        })
                    }
                })

                // Ajouter ces points dans la grille
                newPoints.forEach(point => {
                    grid[point.row][point.col] = currentPiece.id
                })

                refreshBoard(grid)

                return 1;
            case 'down':
                points.forEach(point => {
                    if (point.row < grid.length - 1) {
                        newPoints.push({
                            row: point.row + 1,
                            col: point.col
                        })
                    }
                })

                // Ajouter ces points dans la grille
                newPoints.forEach(point => {
                    grid[point.row][point.col] = currentPiece.id
                })

                refreshBoard(grid)

                return 1;
        }
    } else {
        // Réinitialiser le mouvement
        points.forEach(point => {
            grid[point.row][point.col] = currentPiece.id
        })
        return 0;
    }
}

export default TetrisGame;