import {grid} from "./tetris-game.js";
import {refreshBoard} from "../views/tetris-view.js";

export let pieces = [];

// Classe qui représente une pièce Tetris
class TetrisPiece {
    constructor(id, shape, color, col, row, rotation) {
        this.id = id;

        this.shape = shape;
        this.color = color;
        this.col = col;
        this.row = row;
        this.currentRotation = rotation;

        this.blocks = [];

        // Pattern de la pièce en fonction de sa forme
        this.pattern = this.getPattern(shape);

        // Dimension de la pièce en fonction de son paterne
        this.cols = this.pattern[0].length;
        this.rows = this.pattern.length;

        // Coordonnées de la pièce
        this.coords = { row: row, col : col}

        // Pour chaque case de la pièce
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                // Si la case est pleine
                if (this.pattern[i][j] !== 0) {
                    // On ajoute a un tableau block
                    this.blocks.push({col: this.coords.col + j, row: this.coords.row + i});
                }
            }
        }
    }

    getPattern(shape) {
        // retourne le pattern de la pièce en fonction de shape et de la rotation
        switch (shape) {
            case 'I':
                return [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
            case 'J':
                return [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2]
                ];
            case 'L':
                return [
                    [0, 0, 0],
                    [3, 3, 3],
                    [3, 0, 0]
                ];
            case 'O':
                return [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0]
                ];
            case 'S':
                return [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0]
                ];
            case 'T':
                return [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 6, 0]
                ];
            case 'Z':
                return [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7]
                ];
        }
    }

    // Méthode qui retourne les coordonnées de la pièce dans l'espace de jeu
    static getCoords(currentPiece) {
        let coords = [];
        for (let row = 0; row < currentPiece.rows; row++) {
            for (let col = 0; col < currentPiece.cols; col++) {
                if (currentPiece.pattern[row][col] === 1) {
                    coords.push([currentPiece.row + row, currentPiece.col + col]);
                }
            }
        }
        return coords;
    }

    static rotateClockwise(id) {
        let currentPiece = pieces[--id];
        let newRotation = (currentPiece.currentRotation + 1) % currentPiece.pattern.length;
        let newPattern = currentPiece.getPattern(currentPiece.shape, newRotation);
        let newCols = newPattern[0].length;
        let newRows = newPattern.length;

        // Si la pièce est dans la grid
        if (currentPiece.col + newCols <= grid.cols && currentPiece.row + newRows <= grid.rows) {
            currentPiece.pattern = newPattern;
            currentPiece.currentRotation = newRotation;
            currentPiece.cols = newCols;
            currentPiece.rows = newRows;
        }

        refreshBoard(grid);
    }

    static rotateCounterClockwise(id) {
        let currentPiece = pieces[id];
        let newRotation = (currentPiece.currentRotation - 1) % currentPiece.pattern.length;
        let newPattern = currentPiece.getPattern(currentPiece.shape, newRotation);
        let newCols = newPattern[0].length;
        let newRows = newPattern.length;

        // Si la pièce est dans la grid
        if (currentPiece.col + newCols <= grid.cols && currentPiece.row + newRows <= grid.rows) {
            currentPiece.pattern = newPattern;
            currentPiece.currentRotation = newRotation;
            currentPiece.cols = newCols;
            currentPiece.rows = newRows;
        }

        refreshBoard(grid);
    }
}

export default TetrisPiece;