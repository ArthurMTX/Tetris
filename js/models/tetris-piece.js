import {grid} from "./tetris-game.js";
import {refreshBoard} from "../views/tetris-view.js";

export let pieces = [];

/// Classe qui gère les pièces
///
/// Paramétres :
/// id : identifiant de la pièce
/// shape : forme de la pièce (I, J, L, O, S, T, Z)
/// color : couleur de la pièce
/// col : colonne de la pièce
/// row : ligne de la pièce
/// rotation : rotation de la pièce
class TetrisPiece {
    constructor(id, shape, color, col, row, rotation) {
        this.id = id;
        this.shape = shape;
        this.color = color;
        this.col = col;
        this.row = row;
        this.currentRotation = rotation;

        this.blocks = [];

        // Paterne de la pièce en fonction de sa forme
        this.pattern = this.getPattern(shape);

        // Dimension de la pièce en fonction de son paterne
        this.cols = this.pattern[0].length;
        this.rows = this.pattern.length;

        // Coordonnées de la pièce 
        this.coords = { row: row, col : col}

        // Pour chaque case de la pièce
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                // Si la case est pleine (différente de 0)
                if (this.pattern[i][j] !== 0) {
                    // Ajoute les coordonnées de la case à la liste des blocs de la pièce
                    this.blocks.push({col: this.coords.col + j, row: this.coords.row + i});
                }
            }
        }
    }

    /// Méthode qui retourne le paterne de la pièce en fonction de sa forme
    ///
    /// Paramétres :
    /// shape : forme de la pièce (I, J, L, O, S, T, Z)
    getPattern(shape) {
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
            default:
                throw new Error('Forme de pièce invalide');
        }
    }

    /// Méthode qui retourne les coordonnées de la pièce
    ///
    /// Paramétres :
    /// piece : pièce 
    static getCoords(piece) {
        let coords = [];

        // Pour chaque case de la pièce (différente de 0), 
        // ajoute les coordonnées de la case à la liste des coordonnées de la pièce
        for (let row = 0; row < piece.rows; row++) {
            for (let col = 0; col < piece.cols; col++) {
                if (piece.pattern[row][col] === 1) {
                    coords.push([piece.row + row, piece.col + col]);
                }
            }
        }

        return coords;
    }

    /// Méthode qui déplace la pièce dans un sens horaire
    ///
    /// Paramétres :
    /// id : identifiant de la pièce
    static rotateClockwise(id) {
        let currentPiece = pieces[--id];
        let points = []
        let newPoints = []
        let impossibleMouvement = false;
        let gridHeight = grid.length;
        let gridWidth = grid[0].length;

        for (let row = 0; row < gridHeight; row++) {
            // Pour chaque colonne
            for (let col = 0; col < gridWidth; col++) {
                // Si l'identifiant de la pièce est égal à l'identifiant de la pièce actuelle
                if (grid[row][col] === currentPiece.id) {
                    // Ajoute le point à la liste des points
                    points.push({
                        row: row,
                        col: col
                    })
                    // Supprime l'identifiant de la pièce de la grille
                    grid[row][col] = 0
                }
            }
        }

        function getCaseValue(row, col) {
            // Si la ligne ou la colonne est en dehors de la grille, retourne 0
            if (row < 0 || row >= gridHeight || col < 0 || col >= gridWidth) {
                return 0;
            }
        }


        points.forEach(point => {
            if (point.col < grid[0].length - 1) {
                newPoints.push({
                    row: (currentPiece.pattern.length - 1 - point.col),
                    col: point.row
                })
            }
        }) 
        console.log(points)
        console.log(newPoints);
        console.log(currentPiece.pattern)
        // Rotation du patern de la pièce à 90°
        let length = currentPiece.pattern.length
        for(let rows = 0; rows < length; rows+=1){
                let = matrix[rows] = []
            for (let cols = 0; cols < length; cols+=1){
                    matrix[rows][col] = currentPiece.pattern[length - 1 - cols][rows];
            }
        }
        console.log(currentPiece.pattern);
        /*
        let newRotation = (currentPiece.currentRotation + 1) % currentPiece.pattern.length;
        console.log(newRotation);
        let newPattern = currentPiece.getPattern(currentPiece.shape, newRotation);
        let newCols = newPattern[0].length;
        let newRows = newPattern.length;
        console.log(newCols,newRows);
        // Si la pièce est dans la grid
        if (currentPiece.col + newCols <= grid.cols && currentPiece.row + newRows <= grid.rows) {
            currentPiece.pattern = newPattern;
            currentPiece.currentRotation = newRotation;
            currentPiece.cols = newCols;
            currentPiece.rows = newRows;
        }
        */
        // Pour chaque bloc de la pièce, ajoute l'id de la pièce à la grill
        refreshBoard(grid);
    
    }

    /// Méthode qui déplace la pièce dans un sens anti-horaire
    ///
    /// Paramétres :
    /// id : identifiant de la pièce
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