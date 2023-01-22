import TetrisView from '../views/tetris-view.js';
import TetrisGame from "../models/tetris-game.js";
import TetrisPiece from "../models/tetris-piece.js";

export let pieces;
export let blockSize;
export let cols;
export let rows;

/// Gère le contrôleur du jeu
///
/// Paramétres :
/// aucun
class TetrisController {
    constructor() {
        // Booléen pour savoir si le jeu est commencé ou non
        this._gameStarted = false;

        // Intancie les objets visuels et logiques du jeu
        this._model = new TetrisGame(20, 10);
        this._view = new TetrisView();
        this._piece = new TetrisPiece(-1, 0,0,0,0,0);

        // Définit les variables globales
        pieces = this._piece.pieces;
        blockSize = this._view.blockSize;
        cols = this._model.gridCols;
        rows = this._model.gridRows;

        // Définit les variables de déplacement automatique
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

        // Définit les bindings des fonctions
        this.bindRefreshBoard = this.bindRefreshBoard.bind(this);
        this._model.bindRefreshBoard(this.bindRefreshBoard);
        this._piece.bindRefreshBoard(this.bindRefreshBoard);

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

        this.bindRestart = this.bindRestart.bind(this);
        this._model.bindRestart(this.bindRestart);

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
            // Si la touche est espace ou entrée
            if (event.key === ' ' || event.key === 'Enter') {
                // Vérifie que le jeu n'est pas déjà commencé
                if (!this._gameStarted){
                    this._gameStarted = true;
                    this.start();
                }
            }
        });
    }

    // Bindings
    bindRefreshBoard (grid, mode, score, lines, level) {
        this._view.refreshBoard(grid, mode, score, lines, level);
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

    bindRestart () {
        this.restart();
    }

    bindSetScore (score) {
        this.setScore(score);
    }

    // Getters & Setters
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

    /// Gère les événements clavier
    ///
    /// Paramétres :
    /// mode : mode de bind (full ou partial)
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

            // Écoute les événements clavier
            document.addEventListener('keydown', (event) => {
                // Récupère l'action associée à la touche
                const action = this.keyBindings[event.key];

                // Vérifie que la touche est valide
                if (!action) return;

                // Récupère la pièce courante
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

    /// Désactive les événements clavier
    ///
    /// Paramétres :
    /// aucun
    unbindEvents() {
        // Supprime l'écoute des événements clavier
        clearInterval(this.autoMove);
    }

    /// Affiche un compte à rebours avant de lancer la partie
    ///
    /// Paramétres :
    /// seconds : nombre de secondes du compte à rebours
    countdown_chrono(seconds) {
        // Efface le canvas
        this._view.ctx.clearRect(0, 0, this._view.canvas.width, this._view.canvas.height);

        // Récupère l'élement countdown et les boutons
        let wrap = document.getElementById('countdown');
        let nextPieceCanvas = document.getElementById('next');
        let buttons = document.getElementById('buttons');

        // Si le compte à rebours n'est pas terminé, affiche le nombre de secondes restantes
        // Sinon, cacher la div et lancer la partie
        if (seconds < 0) {
            // Cache le compte à rebours
            wrap.classList.add('hidden');

            // Affiche le canvas de la prochaine pièce et les boutons
            nextPieceCanvas.classList.remove('hidden');
            buttons.classList.remove('hidden');

            // Lance la partie
            this.model.startNewGame();
        } else {
            // Affiche le nombre de secondes restantes
            wrap.classList.add('wrap-' + seconds);

            // Lance le compte à rebours
            setTimeout(() => {
                // Réinitialise la classe de l'élement
                wrap.removeAttribute('class');

                // Lance le compte à rebours
                this.countdown_chrono(--seconds);
            }, 1000);
        }
    }

    /// Gère le démarrage du jeu
    /// Réinstancie les objects visuels et logiques du jeu
    ///
    /// Paramétres :
    /// Aucun
    start() {
        // Récupère les valeurs de la taille de la grid entrées par l'utilisateur
        const rows = document.querySelector('#rows').value;
        const cols = document.querySelector('#cols').value;

        // Accéde aux valeurs maximales et minimales de la grid
        const max_cols = document.getElementById("cols").max;
        const max_rows = document.getElementById("rows").max;
        const min_cols = document.getElementById("cols").min;
        const min_rows = document.getElementById("rows").min;

        // Vérifie que la taille de la grid est valide
        if (rows > max_rows || cols > max_cols || rows < min_rows || cols < min_cols) {
            // Affiche un message d'erreur
            const gridSizeError = 'La taille de la grille est invalide. Veuillez choisir une taille entre '
                + min_rows + ' et ' + max_rows + ' pour les lignes et entre ' + min_cols +
                ' et ' + max_cols + ' pour les colonnes.'
            console.log(gridSizeError);
            alert(gridSizeError);

            // Réinitialise le jeu
            this._gameStarted = false;
            return;
        }

        // Réinstancie les objets visuels et logiques du jeu
        new TetrisGame(rows, cols);

        // Cache la page de fin de jeu
        document.querySelector('#gameOver').classList.add('hidden');

        // Cache le menu de début de jeu
        document.querySelector('#menu').classList.add('hidden');

        // Affiche le compte à rebours
        this.countdown_chrono(3);
        setTimeout(() => {
            // Lance la partie
            this.bindEvents('full');
        }, 3000);
    }

    /// Redémarre le jeu
    ///
    /// Paramétres :
    /// aucun
    restart() {
        // Réinitialise le jeu
        this.unbindEvents();
        this._gameStarted = true;

        // Récupère les valeurs de la taille de la grid
        const rows = document.querySelector('#rows').value;
        const cols = document.querySelector('#cols').value;

        // Réinstancie les objets visuels et logiques du jeu
        new TetrisGame(rows, cols);

        // Cache la page de fin de jeu
        document.querySelector('#gameOver').classList.add('hidden');

        // Cache le menu de début de jeu
        document.querySelector('#menu').classList.add('hidden');
        document.querySelector('#next').classList.add('hidden');
        document.querySelector('#buttons').classList.add('hidden');

        // Récupère la hauteur et la largeur de la grille
        let gridHeight = this._model.grid.length;
        let gridWidth = this._model.grid[0].length;

        // Pour chaque ligne de la grille
        for (let row = 0; row < gridHeight; row++) {
            // Pour chaque colonne de la grille
            for (let col = 0; col < gridWidth; col++) {
                // Si l'identifiant de la pièce est égal à l'identifiant de la pièce actuelle
                // Supprime l'identifiant de la pièce de la grille
                this._model.grid[row][col] = 0
            }
        }

        // Affiche le compte à rebours
        this.countdown_chrono(4);

        // Lance la partie après 4 secondes
        setTimeout(() => {
            this.bindEvents('partial');
        }, 4000);
    }
}

export default TetrisController;
