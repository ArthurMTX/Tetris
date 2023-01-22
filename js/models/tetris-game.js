import {blockSize, pieces} from "../controllers/tetris-controllers.js";
import TetrisPiece from "./tetris-piece.js";

/// Classe qui gère le démarrage du jeu
///
/// Paramétres :
/// rows : nombre de lignes de la grille
/// cols : nombre de colonnes de la grille
class TetrisGame {
    constructor(rows, cols) {
        this.gridRows = rows;
        this.gridCols = cols;

        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.time = 0;
    }

    /// Fonction qui crée une grille vide
    ///
    /// Paramétres :
    /// Aucun
    createEmptyGrid() {
        // Modifie la taille du canvas en fonction de la taille de la grille
        this.canvas = document.querySelector('#tetris');
        this.canvas.width = this.gridCols * blockSize;
        this.canvas.height = this.gridRows * blockSize;

        const grid = [];

        // Crée une grille vide remplie de 0
        // Pour chaque ligne, crée une nouvelle ligne
        for (let row = 0; row < this.gridRows; row++) {
            grid[row] = [];
            // Pour chaque colonne, ajoute un 0
            for (let col = 0; col < this.gridCols; col++) {
                grid[row][col] = 0;
            }
        }
        return grid;
    }

    /// Fonction qui crée une nouvelle pièce
    ///
    /// Paramétres :
    /// Aucun
    createRandomPiece(mode) {
        // Crée un nouvel identifiant pour la pièce
        let id;

        if (mode === 'ignore') {
            id = -1;
        } else {
            id = (pieces.length + 1);
        }

        // Type de pièce aléatoire
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];

        // Couleur de pièce aléatoire
        const color = 'cyan,blue,orange,purple,green,yellow,red'.split(',')[index];

        // Crée une nouvelle pièce Tetris et l'ajoute au tableau des pièces
        let newPiece = new TetrisPiece(id, type, color, parseInt(this.gridCols / 3), -1, 0);
        pieces.push(newPiece);

        if (mode !== 'ignore') {
            // Pour chaque bloc de la pièce, ajoute l'id de la pièce à la grille
            newPiece.blocks.forEach(block => {
                this.grid[block.row][block.col] = newPiece.id;
            });
            console.log(newPiece.blocks);
            // Rafraichit la grille
            this.refreshBoard(this.grid, 'partial', this.score, this.level, this.lines);
        } else {
            // Rafraichit la grille
            this.refreshBoard(this.grid, 'full', this.score, this.level, this.lines);
        }

        return newPiece;
    }

    timer(){
        this.time = 0;
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        this.time = setInterval(() => {
            if (this.gameOver === false) {
                seconds++;
                if (seconds === 60) {
                    minutes++;
                    seconds = 0;
                }
                if (minutes === 60) {
                    hours++;
                    minutes = 0;
                }
                this.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                document.querySelector('#timer').innerHTML = this.time;
            } else {
                clearInterval(this.time);
            }
        }, 1000);
    }

    /// Méthode qui démarre une nouvelle partie
    ///
    /// Paramétres :
    /// Aucun
    startNewGame() {
        // Clear la grille
        this.grid = this.createEmptyGrid();

        // Clear tableau des pièces
        pieces.length = 0;

        // Crée une nouvelle pièce
        this.currentPiece = this.createRandomPiece();
        this.nextPiece = this.createRandomPiece('ignore');

        // Réinitialise le score
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;

        // clear le timer
        clearInterval(this.time);
        this.timer();
    }

    removeLine() {
        // Pour chaque ligne de la grille
        for (let row = 0; row < this.gridRows; row++) {
            // Si la ligne est pleine
            if (this.grid[row].every(col => col !== 0)) {
                // Décale toutes les lignes au dessus de la ligne supprimée
                for (let row2 = row; row2 > 0; row2--) {
                    for (let col = 0; col < this.gridCols; col++) {
                        if (row2 !== 0){
                            this.grid[row2][col] = this.grid[row2 - 1][col];
                        }
                    }
                }
                this.refreshBoard(this.grid, 'partial', this.score, this.level, this.lines);
                this.score += 100;
                this.lines += 1;
            }
        }
    }

    endGame(){
        console.log('Game Over');

        // Arrête le jeu
        this.gameOver = true;
        // Affiche le message de fin de partie
        document.querySelector('#gameOver').style.display = 'flex';
        document.querySelector('#gameOver').style.zIndex = '99999';
        this.unbindEvents();

        // Affiche le score
        document.querySelector('#gameOverScore').innerHTML = this.score;

        // Affiche le niveau
        document.querySelector('#gameOverLevel').innerHTML = this.level;

        // Affiche les lignes
        document.querySelector('#gameOverLines').innerHTML = this.lines;

        // Affiche le temps
        document.querySelector('#gameOverTime').innerHTML = this.time;
    }

    /// Fonction qui déplace la pièce
    ///
    /// Paramétres :
    /// direction : direction du déplacement
    movePiece(direction, mode) {
        // Tri le tableau des pièces par ordre croissant de leur ID
        pieces.sort((a, b) => a.id - b.id);

        // Récupère la dernière pièce du tableau
        this.currentPiece = pieces[pieces.length - 1];

        // Tableau qui contient les points de la pièce
        let points = []

        // Tableau qui contient les nouveaux points de la pièce
        let newPoints = []

        // Variable qui contient si le mouvement est impossible
        let impossibleMouvement = false;

        // Récupère la hauteur et la largeur de la grille
        let gridHeight = this.grid.length;
        let gridWidth = this.grid[0].length;

        // Parcourt la grille pour récupérer les points de la pièce actuelle
        // Pour chaque ligne
        for (let row = 0; row < gridHeight; row++) {
            // Pour chaque colonne
            for (let col = 0; col < gridWidth; col++) {
                // Si l'identifiant de la pièce est égal à l'identifiant de la pièce actuelle
                if (this.grid[row][col] === this.currentPiece.id) {
                    // Ajoute le point à la liste des points
                    points.push({
                        row: row,
                        col: col,
                    })

                    // Supprime l'identifiant de la pièce de la grille
                    this.grid[row][col] = 0
                }
            }
        }

        /// Fonction qui récupère la valeur d'une case
        ///
        /// Paramétres :
        /// row : ligne de la case
        /// col : colonne de la case
        /// grid : grille de jeu
        function getCaseValue(row, col, grid) {
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
                    if (getCaseValue(point.row, point.col - 1, this.grid) !== 0) {
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
                    if (getCaseValue(point.row, point.col + 1, this.grid) !== 0) {
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
                    if (getCaseValue(point.row + 1, point.col, this.grid) !== 0) {
                        impossibleMouvement = true;
                        console.log("Impossible de bouger vers le bas, il y a une pièce en dessous");
                        break;
                    }
                    break;
                default:
                    console.log("Direction inconnue");
                    break;
            }
        });

        // Si le mouvement n'est pas impossible
        if (!impossibleMouvement) {

            if (mode === 'detect'){
                // Réinitialiser le mouvement
                points.forEach(point => {
                    this.grid[point.row][point.col] = this.currentPiece.id;
                })
                return 1;
            }

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
                        this.grid[point.row][point.col] = this.currentPiece.id
                    })

                    break;

                case 'right':
                    points.forEach(point => {
                        if (point.col < this.grid[0].length - 1) {
                            newPoints.push({
                                row: point.row,
                                col: point.col + 1
                            })
                        }
                    })

                    // Ajouter ces points dans la grille
                    newPoints.forEach(point => {
                        this.grid[point.row][point.col] = this.currentPiece.id
                    })

                    break;

                case 'down':
                    points.forEach(point => {
                        if (point.row < this.grid.length - 1) {
                            newPoints.push({
                                row: point.row + 1,
                                col: point.col
                            })
                        }
                    })

                    // Ajouter ces points dans la grille
                    newPoints.forEach(point => {
                        this.grid[point.row][point.col] = this.currentPiece.id
                    })

                    this.score += 1;
                    break;
                default:
                    console.log("Direction non reconnue");
                    break;
            }

            // Actualiser l'affichage de la grille
            this.refreshBoard(this.grid, 'full', this.score, this.level, this.lines);
            return 1;

        } else {

            // Réinitialiser le mouvement
            points.forEach(point => {
                this.grid[point.row][point.col] = this.currentPiece.id;
            })
            return 0;
        }
    }

    bindRefreshBoard(callback){
        this.refreshBoard = callback;
    }

    bindUnbindEvents(callback){
        this.unbindEvents = callback;
    }

    play() {
        if (this.movePiece('down') === 0) {
            this.removeLine();

            // Si la pièce ne peut pas descendre, on en crée une nouvelle
            this.currentPiece = this.nextPiece;
            this.currentPiece.id = pieces.length;

            this.currentPiece.blocks.forEach(block => {
                this.grid[block.row][block.col] = this.currentPiece.id;
            });

            this.nextPiece = this.createRandomPiece('ignore');

            console.log(this.currentPiece)

            // Regarde si la pièce peut être placée a la position initiale
            if (this.movePiece('down', 'detect') === 0) {
                // Si la pièce ne peut pas être placée, c'est la fin de la partie
                this.unbindEvents();
                this.endGame();

                // Affiche le message de fin de partie
                console.log("Game Over");
            } else {

            }
        }
    }
}

export default TetrisGame;