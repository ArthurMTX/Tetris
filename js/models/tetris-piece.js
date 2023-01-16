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
        this.pieces = [];

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
                return [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ];
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

    rotateClockwise(id,grid) {
        let currentPiece = this.pieces[--id];
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
                    console.log(points)
                    // Supprime l'identifiant de la pièce de la grille
                    grid[row][col] = 0
                }
            }
        }
        console.log(points)
    }
}

export default TetrisPiece;