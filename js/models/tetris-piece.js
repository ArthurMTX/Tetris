function findBottom() {
    return undefined;
}

export let pieces = [];

// Classe qui représente une pièce Tetris
class TetrisPiece {
    constructor(id, shape, color, col, row) {
        this.id = id;

        this.shape = shape;
        this.color = color;
        this.currentRotation = 0;
        this.row = row - 1;
        this.col = col - 1;

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
                    this.blocks.push({ row: j, col : i});
                }
            }
        }
    }

    // Méthode qui déplace la pièce tout en bas
    moveBottom(){
        this.row = findBottom();
    }

    // Méthode qui déplace la pièce vers le bas
    moveDown() {
        this.row--;
    }

    // Méthode qui fait tourner la pièce dans le sens horaire
    rotateClockwise() {
        this.currentRotation = (this.currentRotation + 1) % this.pattern.length;
        this.pattern = this.getPattern(this.shape);
    }

    // Méthode qui fait tourner la pièce dans le sens antihoraire
    rotateCounterClockwise() {
        this.currentRotation = (this.currentRotation - 1) % this.pattern.length;
        this.pattern = this.getPattern(this.shape);
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
}

export default TetrisPiece;