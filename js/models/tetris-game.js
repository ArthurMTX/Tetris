import TetrisPiece, {pieces} from "./tetris-piece.js";
import {blockSize, refreshBoard} from "../views/tetris-view.js";

// Variable qui contient la pièce actuelle
export let currentPiece;

// Variable qui contient la prochaine pièce
export let nextPiece;

// Variable qui contient la grille de jeu
export let grid;

// Variable qui contient le nombre de colonnes de la grille
let gridCols;

// Variable qui contient le nombre de lignes de la grille
let gridRows;

/// Classe qui gère le démarrage du jeu
///
/// Paramétres :
/// rows : nombre de lignes de la grille
/// cols : nombre de colonnes de la grille
class TetrisGame {
    constructor(rows, cols) {
        gridRows = rows;
        gridCols = cols;
        grid = this.createEmptyGrid();
    }

    /// Fonction qui crée une grille vide
    ///
    /// Paramétres :
    /// Aucun
    createEmptyGrid() {
        // Modifie la taille du canvas en fonction de la taille de la grille
        this.canvas = document.querySelector('#tetris');
        this.canvas.width = gridCols * blockSize;
        this.canvas.height = gridRows * blockSize;

        const grid = [];

        // Crée une grille vide remplie de 0
        // Pour chaque ligne, crée une nouvelle ligne
        for (let row = 0; row < gridRows; row++) {
            grid[row] = [];
            // Pour chaque colonne, ajoute un 0
            for (let col = 0; col < gridCols; col++) {
                grid[row][col] = 0;
            }
        }
        return grid;
    }

    /// Fonction qui crée une nouvelle pièce
    ///
    /// Paramétres :
    /// Aucun
    static createRandomPiece() {
        // Crée un nouvel identifiant pour la pièce
        const id = (pieces.length + 1)

        // Type de pièce aléatoire
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];

        // Couleur de pièce aléatoire
        const color = 'cyan,blue,orange,purple,green,yellow,red'.split(',')[index];

        // Crée une nouvelle pièce Tetris et l'ajoute au tableau des pièces
        let newPiece = new TetrisPiece(id, type, color, parseInt(gridCols / 3), -1, 0)
        pieces.push(newPiece)

        // Pour chaque bloc de la pièce, ajoute l'id de la pièce à la grille
        newPiece.blocks.forEach(block => {
            grid[block.row][block.col] = newPiece.id;
        });

        // Rafraichit la grille
        refreshBoard(grid)

        return newPiece;
    }

    /// Méthode qui démarre une nouvelle partie
    ///
    /// Paramétres :
    /// Aucun
    startNewGame() {
        // Crée une nouvelle pièce 
        currentPiece = TetrisGame.createRandomPiece();

        // Réinitialise le score 
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
}

/// Fonction qui déplace la pièce
///
/// Paramétres :
/// direction : direction du déplacement 
export function movePiece(direction) {
    // Récupère la dernière pièce du tableau
    currentPiece = pieces[pieces.length - 1];

    // Tableau qui contient les points de la pièce
    let points = []

    // Tableau qui contient les nouveaux points de la pièce
    let newPoints = []
    
    // Variable qui contient si le mouvement est impossible
    let impossibleMouvement = false;

    // Récupère la hauteur et la largeur de la grille
    let gridHeight = grid.length;
    let gridWidth = grid[0].length;

    // Parcourt la grille pour récupérer les points de la pièce actuelle
    // Pour chaque ligne
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
    /// Fonction qui récupère la valeur d'une case
    ///
    /// Paramétres :
    /// row : ligne de la case
    /// col : colonne de la case
    function getCaseValue(row, col) {
        // Si la ligne ou la colonne est en dehors de la grille, retourne 0
        if (row < 0 || row >= gridHeight || col < 0 || col >= gridWidth) {
            return 0;
        }

        // Retourne la valeur de la case
        return grid[row][col];
    }

    // Parcourt les points de la pièce
    points.forEach(point => {
        switch (direction) {
            case "left":
                if (point.col === 0) {
                    console.log("Impossible de bouger vers la gauche");
                    impossibleMouvement = true;
                    break;
                }
                if (getCaseValue(point.row, point.col - 1) !== 0) {
                    console.log("Impossible de bouger vers la gauche, il y a une pièce à gauche");
                    impossibleMouvement = true;
                    break;
                }
                break;
            case "right":
                if (point.col === gridWidth - 1) {
                    console.log("Impossible de bouger vers la droite");
                    impossibleMouvement = true;
                    break;
                }
                if (getCaseValue(point.row, point.col + 1) !== 0) {
                    console.log("Impossible de bouger vers la droite, il y a une pièce à droite");
                    impossibleMouvement = true;
                    break;
                }
                break;
            case "down":
                if (point.row === gridHeight - 1) {
                    console.log("Impossible de bouger vers le bas");
                    impossibleMouvement = true;
                    break;
                }
                if (getCaseValue(point.row + 1, point.col) !== 0) {
                    impossibleMouvement = true;
                    console.log("Impossible de bouger vers le bas, il y a une pièce en dessous");
                    break;
                }
                break;
            default:
                break;
        }
    });
    

    // Si le mouvement n'est pas impossible
    if (!impossibleMouvement){

        // Déplacer la pièce dans la direction spécifiée en parcourant les points de la pièce
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

                break;

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

                break;

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

                break;
        }

        // Actualiser l'affichage de la grille
        refreshBoard(grid)
        return 1;

    } else {

        // Réinitialiser le mouvement
        points.forEach(point => {
            grid[point.row][point.col] = currentPiece.id
        })

        return 0;

    }
}

export default TetrisGame;