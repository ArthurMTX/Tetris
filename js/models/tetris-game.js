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

    // Bindings
    bindRefreshBoard(callback){
        this.refreshBoard = callback;
    }

    bindUnbindEvents(callback){
        this.unbindEvents = callback;
    }

    bindRestart(callback){
        this.restart = callback;
    }

    /// Crée une grille vide
    ///
    /// Paramétres :
    /// Aucun
    createEmptyGrid() {
        // Modifie la taille du canvas en fonction de la taille de la grille
        this.canvas = document.querySelector('#tetris');
        this.canvas.width = this.gridCols * blockSize;
        this.canvas.height = this.gridRows * blockSize;

        // Crée un tableau 2D
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

    /// Crée une nouvelle pièce
    ///
    /// Paramétres :
    /// mode : mode de création ('ignore' ou 'full')
    createRandomPiece(mode) {
        // Crée un nouvel identifiant pour la pièce
        let id;

        // Si le mode est 'ignore', l'id est -1
        // sinon l'id est le nombre de pièces + 1
        if (mode === 'ignore') {
            id = -1;
        } else {
            id = (pieces.length + 1);
        }

        // Index aléatoire
        const index = Math.floor(Math.random() * 7);

        // Type de pièce aléatoire
        const type = 'IJLOSTZ'[index];

        // Couleur de pièce aléatoire
        const color = 'cyan,blue,orange,purple,green,yellow,red'.split(',')[index];

        // Crée une nouvelle pièce Tetris et l'ajoute au tableau des pièces
        let newPiece = new TetrisPiece(id, type, color, parseInt(this.gridCols / 3), -1, 0);
        pieces.push(newPiece);

        // Si le mode n'est pas 'ignore', ajoute l'id de la pièce à la grille et rafraichit la grille
        // sinon rafraichit la grille en mode 'full'
        if (mode !== 'ignore') {
            // Pour chaque bloc de la pièce, ajoute l'id de la pièce à la grille
            newPiece.blocks.forEach(block => {
                this.grid[block.row][block.col] = newPiece.id;
            });

            // Rafraichit la grille
            this.refreshBoard(this.grid, 'partial', this.score, this.level, this.lines);
        } else {
            // Rafraichit la grille
            this.refreshBoard(this.grid, 'full', this.score, this.level, this.lines);
        }

        return newPiece;
    }

    /// Démarre une nouvelle partie
    ///
    /// Paramétres :
    /// Aucun
    startNewGame() {
        // Réinitialise la grille
        this.grid = this.createEmptyGrid();

        // Réinitialise le tableau des pièces
        pieces.length = 0;

        // Crée une nouvelle pièce et une pièce suivante
        this.currentPiece = this.createRandomPiece();
        this.nextPiece = this.createRandomPiece('ignore');

        // Réinitialise les informations de la partie
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;

        // Réinitialise le timer et le redémarre
        clearInterval(this.time);
        this.timer();
    }

    /// Crée un timer
    ///
    /// Paramétres :
    /// aucun
    timer(){
        // Compte le temps de jeu
        let seconds = 0;
        let minutes = 0;
        let hours = 0;

        // Démarre le timer
        this.time = setInterval(() => {
            // Si la partie n'est pas terminée, incrémente le temps
            if (this.gameOver === false) {
                seconds++;

                // Si les secondes sont à 60, incrémente les minutes et réinitialise les secondes
                if (seconds === 60) {
                    minutes++;
                    seconds = 0;
                }

                // Si les minutes sont à 60, incrémente les heures et réinitialise les minutes
                if (minutes === 60) {
                    hours++;
                    minutes = 0;
                }

                // Convertit le temps en string, padStart permet d'ajouter des 0 devant le nombre afin d'avoir un format XX:XX:XX
                this.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                // Affiche le temps
                document.querySelector('#timer').innerHTML = this.time;
            } else {
                // Si la partie est terminée, arrête le timer
                clearInterval(this.time);
            }
        }, 1000);
    }

    /// Récupère la valeur d'une case
    ///
    /// Paramétres :
    /// row : ligne de la case
    /// col : colonne de la case
    /// grid : grille de jeu
    getCaseValue(row, col, grid) {
        // Récupère la hauteur et la largeur de la grille
        let gridHeight = this.grid.length;
        let gridWidth = this.grid[0].length;

        // Si la ligne ou la colonne est en dehors de la grille, retourne 0
        if (row < 0 || row >= gridHeight || col < 0 || col >= gridWidth) {
            return 0;
        }

        // Retourne la valeur de la case
        return grid[row][col];
    }

    /// Déplace la pièce
    ///
    /// Paramétres :
    /// direction : direction du déplacement
    /// mode : mode de déplacement
    movePiece(direction, mode) {
        // Tri le tableau des pièces par ordre croissant de leur ID
        pieces.sort((a, b) => a.id - b.id);

        // Récupère la dernière pièce du tableau (la pièce actuelle)
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

        // Parcourt les points de la pièce
        points.forEach(point => {
            switch (direction) {
                // Si le mouvement est vers la gauche
                case "left":
                    // Si la colonne sur laquelle est la pièce est égale à 0, le mouvement est impossible
                    if (point.col === 0) {
                        console.log("Impossible de bouger vers la gauche");
                        impossibleMouvement = true;
                        break;
                    }

                    // Si la case vers laquelle on veut bouger n'est pas vide, le mouvement est impossible
                    if (this.getCaseValue(point.row, point.col - 1, this.grid) !== 0) {
                        console.log("Impossible de bouger vers la gauche, il y a une pièce à gauche");
                        impossibleMouvement = true;
                        break;
                    }

                    break;
                // Si le mouvement est vers la droite
                case "right":
                    // Si la colonne sur laquelle est la pièce est égale à la largeur de la grille, le mouvement est impossible
                    if (point.col === gridWidth - 1) {
                        console.log("Impossible de bouger vers la droite");
                        impossibleMouvement = true;
                        break;
                    }

                    // Si la case vers laquelle on veut bouger n'est pas vide, le mouvement est impossible
                    if (this.getCaseValue(point.row, point.col + 1, this.grid) !== 0) {
                        console.log("Impossible de bouger vers la droite, il y a une pièce à droite");
                        impossibleMouvement = true;
                        break;
                    }

                    break;
                // Si le mouvement est vers le bas
                case "down":
                    // Si la ligne sur laquelle est la pièce est égale à la hauteur de la grille, le mouvement est impossible
                    if (point.row === gridHeight - 1) {
                        console.log("Impossible de bouger vers le bas");
                        impossibleMouvement = true;
                        break;
                    }

                    // Si la case vers laquelle on veut bouger n'est pas vide, le mouvement est impossible
                    if (this.getCaseValue(point.row + 1, point.col, this.grid) !== 0) {
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
            // Si le mode est "detect"
            if (mode === 'detect'){
                // Réinitialiser le mouvement
                points.forEach(point => {
                    this.grid[point.row][point.col] = this.currentPiece.id;
                })
                return 1;
            }

            // Déplacer la pièce dans la direction spécifiée en parcourant les points de la pièce
            switch (direction) {
                // Si le mouvement est vers la gauche
                case 'left':
                    // Parcourt les points de la pièce, ajoute les nouveaux points avec une colonne en moins dans le tableau newPoints
                    points.forEach(point => {
                        if (point.col > 0) {
                            newPoints.push({
                                row: point.row,
                                col: point.col - 1
                            })
                        }
                    })

                    // Ajouter ces nouveaux points dans la grille
                    newPoints.forEach(point => {
                        this.grid[point.row][point.col] = this.currentPiece.id
                    })

                    break;
                // Si le mouvement est vers la droite
                case 'right':
                    // Parcourt les points de la pièce, ajoute les nouveaux points avec une colonne en plus dans le tableau newPoints
                    points.forEach(point => {
                        if (point.col < this.grid[0].length - 1) {
                            newPoints.push({
                                row: point.row,
                                col: point.col + 1
                            })
                        }
                    })

                    // Ajouter ces nouveaux points dans la grille
                    newPoints.forEach(point => {
                        this.grid[point.row][point.col] = this.currentPiece.id
                    })

                    break;
                // Si le mouvement est vers le bas
                case 'down':
                    // Parcourt les points de la pièce, ajoute les nouveaux points avec une ligne en plus dans le tableau newPoints
                    points.forEach(point => {
                        if (point.row < this.grid.length - 1) {
                            newPoints.push({
                                row: point.row + 1,
                                col: point.col
                            })
                        }
                    })

                    // Ajouter ces nouveaux points dans la grille
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
            // Si le mouvement est impossible, on remet la pièce à sa place
            points.forEach(point => {
                this.grid[point.row][point.col] = this.currentPiece.id;
            })
            return 0;
        }
    }

    /// Supprime une ligne quand elle est pleine
    ///
    /// Paramétres :
    /// aucun
    removeLine() {
        // Pour chaque ligne de la grille
        for (let row = 0; row < this.gridRows; row++) {
            // Si la ligne est pleine
            if (this.grid[row].every(col => col !== 0)) {
                // Pour chaque ligne supérieure à la ligne pleine
                for (let row2 = row; row2 > 0; row2--) {
                    // Pour chaque colonne de la grille
                    for (let col = 0; col < this.gridCols; col++) {
                        // Déplace la ligne supérieure vers le bas si elle n'est pas la première ligne
                        if (row2 !== 0){
                            // Déplace la ligne supérieure vers le bas
                            this.grid[row2][col] = this.grid[row2 - 1][col];
                        }
                    }
                }

                // Rafraichit la grille
                this.refreshBoard(this.grid, 'partial', this.score, this.level, this.lines);

                // Incrémente le score et les lignes
                this.score += 100;
                this.lines += 1;
            }
        }
    }

    /// Gère la fin de partie
    ///
    /// Paramétres :
    /// aucun
    endGame(){
        console.log('Game Over');

        // Arrête le jeu
        this.gameOver = true;

        // Affiche le message de fin de partie
        document.querySelector('#gameOver').classList.remove('hidden');

        // Arrête le timer et les événements clavier
        this.unbindEvents();

        // Affiche le score
        document.querySelector('#gameOverScore').innerHTML = this.score;

        // Affiche le niveau
        document.querySelector('#gameOverLevel').innerHTML = this.level;

        // Affiche les lignes
        document.querySelector('#gameOverLines').innerHTML = this.lines;

        // Affiche le temps
        document.querySelector('#gameOverTime').innerHTML = this.time;

        // Ajoute un événement au bouton de redémarrage
        document.querySelector('#gameOverRestart').addEventListener('click', () => {
            this.restart();
        });
    }

    /// Gére le moteur du jeu
    ///
    /// Paramétres :
    /// aucun
    play() {
        // Fait descendre la pièce, si elle ne peut pas descendre, on en crée une nouvelle
        if (this.movePiece('down') === 0) {
            // Supprime les lignes pleines
            this.removeLine();

            // Si la pièce ne peut pas descendre, on en crée une nouvelle
            this.currentPiece = this.nextPiece;
            this.currentPiece.id = pieces.length;

            // Ajoute la pièce à la grille
            this.currentPiece.blocks.forEach(block => {
                this.grid[block.row][block.col] = this.currentPiece.id;
            });

            // Crée une nouvelle pièce suivante
            this.nextPiece = this.createRandomPiece('ignore');

            // Regarde si la pièce peut être placée au point d'apparition des pièces
            if (this.movePiece('down', 'detect') === 0) {
                // Si la pièce ne peut pas être placée, c'est la fin de la partie
                this.unbindEvents();
                this.endGame();
            }
        }
    }
}

export default TetrisGame;