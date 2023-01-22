import TetrisView from '../views/tetris-view.js';
import TetrisGame from "../models/tetris-game.js";
import TetrisPiece from "../models/tetris-piece.js";

export let pieces;
export let blockSize;
export let cols;
export let rows;

/// Classe qui gère le contrôleur du jeu
///
/// Paramétres :
/// game : instance de la classe TetrisGame
/// view : instance de la classe TetrisView
class TetrisController {
    constructor(view, model) {
        // Booléen pour savoir si le jeu est commencé ou non
        this._gameStarted = false;

        // Intancie les objets visuels et logiques du jeu
        this._model = new TetrisGame(20, 10);
        this._view = new TetrisView();
        this._piece = new TetrisPiece(-1, 0,0,0,0,0);

        pieces = this._piece.pieces;
        blockSize = this._view.blockSize;
        cols = this._model.gridCols;
        rows = this._model.gridRows;

        this.autoMove = null;

        // Définit les touches de contrôle
        this.keyBindings = {
            ArrowRight: 'right',
            d: 'right',
            ArrowLeft: 'left',
            q: 'left',
            ArrowDown: 'down',
            ' ': 'drop',
            z: 'rotate',
            ArrowUp: 'rotate',
            s: 'down',
        };

        this.bindRefreshBoard = this.bindRefreshBoard.bind(this);
        this._model.bindRefreshBoard(this.bindRefreshBoard);
        this._piece.bindRefreshBoard(this.bindRefreshBoard);

        this.bindRemoveLine = this.bindRemoveLine.bind(this);
        this._view.bindRemoveLine(this.bindRemoveLine);

        this.bindUnbindEvents = this.bindUnbindEvents.bind(this);
        this._model.bindUnbindEvents(this.bindUnbindEvents);

        this.bindGetScore = this.bindGetScore.bind(this);
        this._piece.bindGetScore(this.bindGetScore);

        this.bindGetLines = this.bindGetLines.bind(this);
        this._piece.bindGetLines(this.bindGetLines);

        this.bindGetLevel = this.bindGetLevel.bind(this);
        this._piece.bindGetLevel(this.bindGetLevel);

        this.bindSetScore = this.bindSetScore.bind(this);
        this._piece.bindSetScore(this.bindSetScore);

        // Intancie le contrôle afin de commencer la partie
        document.querySelector('#start').addEventListener('click', () => {
            // Vérifie que le jeu n'est pas déjà commencé
            if (!this._gameStarted){
                this._gameStarted = true
                this.start();
            }
        });

        // Intancie le contrôle afin de commencer la partie
        document.addEventListener('keydown', (event) => {
            if (event.key === ' ' || event.key === 'Enter') {
                // Vérifie que le jeu n'est pas déjà commencé
                if (!this._gameStarted){
                    this._gameStarted = true;
                    this.start();
                }
            }
        });
    }
    
    bindRefreshBoard (grid, mode, score, lines, level) {
        this._view.refreshBoard(grid, mode, score, lines, level);
    }

    bindRemoveLine () {
        this._model.removeLine();
    }

    bindUnbindEvents () {
        this.unbindEvents();
    }

    bindGetScore () {
        return this.getScore();
    }

    bindGetLines () {
        return this.getLines();
    }

    bindGetLevel () {
        return this.getLevel();
    }

    bindSetScore (score) {
        this.setScore(score);
    }

    // Getters
    get model() {
        return this._model;
    }

    getScore() {
        return this._model.score;
    }

    setScore(score) {
        this._model.score = score;
    }

    getLines() {
        return this._model.lines;
    }

    getLevel() {
        return this._model.level;
    }

    /// Fonction qui gère les événements clavier
    ///
    /// Paramétres :
    /// aucun
    bindEvents(mode) {
        // Détecte le mode
        if (mode === 'full'){
            // Écoute les événements clavier
            document.querySelector('#restart').addEventListener('click', () => {
                // Vérifie que le jeu n'est pas déjà commencé
                if (this._gameStarted){
                    this.restart();
                }
            });

            document.addEventListener('keydown', (event) => {
                const action = this.keyBindings[event.key];

                // Vérifie que la touche est valide
                if (!action) return;

                let currentPiece = pieces[pieces.length-1];

                // Vérifie si la touche est une rotation ou un déplacement
                switch (action) {
                    case 'rotate':
                        // Tourne la pièce
                        this._piece.rotateClockwise(currentPiece.id, this.model.grid);
                        break;
                    case 'drop':
                        // Fait tomber la pièce
                        this._piece.dropDown(currentPiece.id, this.model.grid);
                        break;
                    default:
                        // Déplace la pièce
                        this.model.movePiece(action);
                        break;
                }
            });
        }

        // Chaque seconde, on déplace la pièce vers le bas
        this.autoMove = setInterval(() => {
            this.model.play();
        }, 1000);
    }

    unbindEvents() {
        clearInterval(this.autoMove);
    }

    /// Méthode qui affiche un compte à rebours avant de lancer la partie
    ///
    /// Paramétres :
    /// seconds : nombre de secondes du compte à rebours
    countdown_chrono(seconds) {
        // Efface le canvas
        this._view.ctx.clearRect(0, 0, this._view.canvas.width, this._view.canvas.height);

        // Récupère l'élement countdown
        let wrap = document.getElementById('countdown');
        let nextPieceCanvas = document.getElementById('next');
        let buttons = document.getElementById('buttons');

        // Si le compte à rebours n'est pas terminé, affiche le nombre de secondes restantes
        // Sinon, cacher la div et lancer la partie
        if (seconds < 0) {
            wrap.classList.add('hidden');
            nextPieceCanvas.classList.remove('hidden');
            buttons.classList.remove('hidden');
            this.model.startNewGame();
        } else {
            wrap.classList.add('wrap-' + seconds);
            setTimeout(() => {
                wrap.removeAttribute('class');
                this.countdown_chrono(--seconds);
            }, 1000);
        }
    }

    /// Fonction qui gère le démarrage du jeu
    /// Réinstancie les objects visuels et logiques du jeu
    ///
    /// Paramétres :
    /// Aucun
    start() {
        // Récupère les valeurs de la taille de la grid
        const rows = document.querySelector('#rows').value;
        const cols = document.querySelector('#cols').value;

        // Accéde aux valeurs max de la taille de la grid
        const max_cols = document.getElementById("cols").max;
        const max_rows = document.getElementById("rows").max;
        const min_cols = document.getElementById("cols").min;
        const min_rows = document.getElementById("rows").min;

        // Vérifie que la taille de la grid est valide
        if (rows > max_rows ||
            cols > max_cols ||
            rows < min_rows ||
            cols < min_cols) {
            const gridSizeError = 'La taille de la grille est invalide. Veuillez choisir une taille entre '
                + min_rows + ' et ' + max_rows + ' pour les lignes et entre ' + min_cols +
                ' et ' + max_cols + ' pour les colonnes.'
            console.log(gridSizeError);
            alert(gridSizeError);
            this._gameStarted = false;
            return;
        }

        // Réinstancie les objets visuels et logiques du jeu
        const game = new TetrisGame(rows, cols);

        // Cache le menu de début de jeu
        document.querySelector('#menu').classList.add('hidden');

        // Affiche le compte à rebours
        this.countdown_chrono(3);
        setTimeout(() => {
            // Lance la partie
            this.bindEvents('full');
        }, 3000);
    }

    restart() {
        this.unbindEvents();
        this._gameStarted = true;

        // Récupère les valeurs de la taille de la grid
        const rows = document.querySelector('#rows').value;
        const cols = document.querySelector('#cols').value;

        // Réinstancie les objets visuels et logiques du jeu
        const game = new TetrisGame(rows, cols);

        // Cache le menu de début de jeu
        document.querySelector('#menu').classList.add('hidden');
        document.querySelector('#next').classList.add('hidden');
        document.querySelector('#buttons').classList.add('hidden');

        // Récupère la hauteur et la largeur de la grille
        let gridHeight = this._model.grid.length;
        let gridWidth = this._model.grid[0].length;
        // Pour chaque ligne
        for (let row = 0; row < gridHeight; row++) {
            // Pour chaque colonne
            for (let col = 0; col < gridWidth; col++) {
                // Si l'identifiant de la pièce est égal à l'identifiant de la pièce actuelle
                // Supprime l'identifiant de la pièce de la grille
                this._model.grid[row][col] = 0

            }
        }

        // Affiche le compte à rebours
        this.countdown_chrono(4);
        setTimeout(() => {
            this.bindEvents('partial');
        }, 4000);
    }
}

export default TetrisController;
