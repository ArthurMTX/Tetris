/// Classe qui gère les pièces
///
/// Paramétres :
/// id : identifiant de la pièce
/// shape : forme de la pièce (I, J, L, O, S, T, Z)
/// color : couleur de la pièce
/// col : colonne de la pièce
/// row : ligne de la pièce
class TetrisPiece {
    constructor(id, shape, color, col, row) {
        // Identifiant, forme, couleur, colonne et ligne de la pièce
        this.id = id;
        this.shape = shape;
        this.color = color;
        this.col = col;
        this.row = row;

        // Liste des blocs et des pièces
        this.blocks = [];
        this.pieces = [];

        // Paterne de la pièce en fonction de sa forme
        this.pattern = this.getPattern(this.shape);

        // Dimension de la pièce en fonction de son paterne
        this.cols = this.pattern[0].length;
        this.rows = this.pattern.length;

        // Coordonnées de la pièce 
        this.coords = { row: row, col : col};

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

    bindRefreshBoard(callback){
        this.refreshBoard = callback;
    }

    bindGetScore(bindGetScore) {
        this.getScore = bindGetScore;
    }

    bindGetLevel(bindGetLevel) {
        this.getLevel = bindGetLevel;
    }

    bindGetLines(bindGetLines) {
        this.getLines = bindGetLines;
    }

    bindSetScore(bindSetScore) {
        this.setScore = bindSetScore;
    }

    /// Retourne le paterne de la pièce en fonction de sa forme
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

    /// Retourne la pièce dans le sens horaire
    ///
    /// Paramétres :
    /// id : identifiant de la pièce
    /// grid : grille de jeu
    rotateClockwise(id,grid) {
        // Récupère la pièce actuelle
        let currentPiece = this.pieces[id];

        // Liste des points de la pièce et des nouveaux points
        let points = [];
        let newPoints = [];

        // Booléen qui indique si le mouvement est impossible
        let impossibleMouvement = false;

        // Taille de la grille
        let gridHeight = grid.length;
        let gridWidth = grid[0].length;

        // Pour chaque ligne de la grille
        for (let row = 0; row < gridHeight; row++) {
            // Pour chaque colonne de la grille
            for (let col = 0; col < gridWidth; col++) {
                // Si l'identifiant de la pièce est égal à l'identifiant de la pièce actuelle
                if (grid[row][col] === id) {
                    // Ajoute les coordonnées de la case à la liste des points de la pièce
                    points.push({
                        row: row,
                        col: col
                    });
                }
            }
        }

        // Prends le premier point de la pièce
        let firstPoint = points[2];

        // Pour chaque points de la pièce
        for (let i = 0; i < points.length; i++) {
            // Calcule les coordonnées du point en fonction de la rotation
            let newPoint = {
                row: firstPoint.row + (points[i].col - firstPoint.col),
                col: firstPoint.col - (points[i].row - firstPoint.row)
            };

            // Si le nouveau point est plus haute que la position de la pièce
            if (newPoint.row < currentPiece.row) {
                // Décale la pièce vers le bas
                currentPiece.row -= newPoint.row - currentPiece.row + 1;
            }

            // Si le point est en dehors de la grille
            if (newPoint.row < 0 || newPoint.row >= gridHeight || newPoint.col < 0 || newPoint.col >= gridWidth) {
                // Impossible de tourner la pièce
                console.log("Impossible de tourner la pièce, le point est en dehors de la grille");
                impossibleMouvement = true;
            }
            // Si le point est déjà occupé par une autre pièce
            else if (grid[newPoint.row][newPoint.col] !== 0 && grid[newPoint.row][newPoint.col] !== id) {
                // Impossible de tourner la pièce
                console.log("Impossible de tourner la pièce, le point est déjà occupé par une autre pièce");
                impossibleMouvement = true;
            }

            // Ajoute le point à la liste des nouveaux points
            newPoints.push(newPoint);
        }

        // Si le mouvement est possible
        if (!impossibleMouvement) {
            // Pour chaque point de la pièce
            for (let i = 0; i < points.length; i++) {
                // Vide la case de la grille
                grid[points[i].row][points[i].col] = 0;
            }

            // Pour chaque nouvelle coordonnée de la pièce
            for (let i = 0; i < newPoints.length; i++) {
                // Remplit la case de la grille
                grid[newPoints[i].row][newPoints[i].col] = id;
            }
        }

        // Met à jour la grille
        this.refreshBoard(grid, 'full', this.getScore(), this.getLevel(), this.getLines());
    }

    /// Fait descendre la pièce jusqu'en bas ou une autre pièce
    ///
    /// Paramétres :
    /// id : identifiant de la pièce
    /// grid : grille de jeu
    dropDown(id, grid) {
        // Booléen qui indique si le mouvement est impossible
        let impossibleMouvement = false;

        // Taille de la grille
        let gridHeight = grid.length;
        let gridWidth = grid[0].length;

        // Fait descendre la pièce jusqu'à ce qu'elle touche le sol ou une autre pièce
        while (!impossibleMouvement) {
            // Liste des points de la pièce et des nouveaux points
            let points = [];
            let newPoints = [];

            // Récupère les coordonnées de la pièce via blocks
            for (let row = 0; row < gridHeight; row++) {
                // Pour chaque colonne
                for (let col = 0; col < gridWidth; col++) {
                    // Si l'identifiant de la pièce est égal à l'identifiant de la pièce actuelle
                    if (grid[row][col] === id) {
                        // Ajoute les coordonnées de la case à la liste des points de la pièce
                        points.push({
                            row: row,
                            col: col
                        });
                    }
                }
            }

            // Pour chaque point de la pièce
            for (let i = 0; i < points.length; i++) {
                // Calcule les coordonnées du point en fonction de la rotation
                let newPoint = {
                    row: points[i].row + 1,
                    col: points[i].col
                };

                // Si le point est en dehors de la grille
                if (newPoint.row < 0 || newPoint.row >= gridHeight || newPoint.col < 0 || newPoint.col >= gridWidth) {
                    // Impossible de faire descendre la pièce
                    console.log("Impossible de faire descendre la pièce, le point est en dehors de la grille");
                    impossibleMouvement = true;
                }
                // Si le point est déjà occupé par une autre pièce
                else if (grid[newPoint.row][newPoint.col] !== 0 && grid[newPoint.row][newPoint.col] !== id) {
                    // Impossible de faire descendre la pièce
                    console.log("Impossible de faire descendre la pièce, le point est déjà occupé par une autre pièce");
                    impossibleMouvement = true;
                }

                // Ajoute le point à la liste des nouveaux points
                newPoints.push(newPoint);
            }

            // Si la pièce existe
            if (points.length !== 0 || newPoints.length !== 0) {
                // Si le mouvement est possible
                if (!impossibleMouvement) {
                    // Pour chaque point de la pièce
                    for (let i = 0; i < points.length; i++) {
                        // Vide la case de la grille
                        grid[points[i].row][points[i].col] = 0;
                    }

                    // Pour chaque nouvelle coordonnée de la pièce
                    for (let i = 0; i < newPoints.length; i++) {
                        // Remplit la case de la grille
                        grid[newPoints[i].row][newPoints[i].col] = id;
                    }

                    // Actualise le score en fonction du nombre de lignes qu'a parcouru la pièce en tombant
                    this.score = this.getScore() + points.length;
                    this.setScore(this.score);
                }
            } else {
                // Impossible de faire descendre la pièce
                impossibleMouvement = true;
            }
        }

        // Met à jour la grille
        this.refreshBoard(grid, 'full', this.getScore(), this.getLevel(), this.getLines());
    }
}


export default TetrisPiece;