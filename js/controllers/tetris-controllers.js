import TetrisView from '../views/tetris-view.js';
import TetrisGame from "../models/tetris-game.js";
import TetrisPiece from "../models/tetris-piece.js";

export let pieces;
export let blockSize;
export let cols;
export let rows;
export let grid;
export let nextPiece;

/// Classe qui gère le contrôleur du jeu
///
/// Paramétres :
/// game : instance de la classe TetrisGame
/// view : instance de la classe TetrisView
class TetrisController {
    constructor(view, model) {
       // Élement principal pour le jeu
        const canvas = document.getElementById('tetris');

        // Booléen pour savoir si le jeu est commencé ou non
        this._gameStarted = false;

        // Intancie les objets visuels et logiques du jeu
        this._model = new TetrisGame(20, 10);

        this.grid = this._model.grid;
        grid = this.grid;
        this._view = new TetrisView(grid);

        this._piece = new TetrisPiece();

        pieces = this._piece.pieces;
        blockSize = this._view.blockSize;
        cols = this._model.gridCols;
        rows = this._model.gridRows;
        
        this.bindRefreshBoard = this.bindRefreshBoard.bind(this);
        this._model.bindRefreshBoard(this.bindRefreshBoard);

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
    
    bindRefreshBoard (grid) {
        this._view.refreshBoard(grid);
    }

    // Getters
    get model() {
        return this._model;
    }

    /// Fonction qui gère les événements clavier
    ///
    /// Paramétres :
    /// aucun
    bindEvents(grid) {
        // Définit les touches de contrôle
        const keyBindings = {
            ArrowRight: 'right',
            d: 'right',
            ArrowLeft: 'left',
            q: 'left',
            ArrowDown: 'down',
            ' ': 'down',
            z: 'rotate',
            ArrowUp: 'rotate'
        };

        // Écoute les événements clavier
        document.addEventListener('keydown', (event) => {
        const action = keyBindings[event.key];

        // Vérifie que la touche est valide
        if (!action) return;

        // Vérifie si la touche est une rotation ou un déplacement
        if (action === 'rotate') {
            // Tourne la pièce
            let currentPiece = pieces[pieces.length-1];
            console.log(this.model.grid)
            this._piece.rotateClockwise(currentPiece.id,this.model.grid);
        } else {
            // Déplace la pièce
            this.model.movePiece(action);
        }
        });

        // Chaque seconde, on déplace la pièce vers le bas
        setInterval(() => {
            if (this.model.movePiece('down') === 0) {
                // Si la pièce ne peut pas descendre, on en crée une nouvelle
                this.model.currentPiece = this.model.nextPiece;
                this.model.currentPiece.id = pieces.length;

                this.model.currentPiece.blocks.forEach(block => {
                    this.model.grid[block.row][block.col] = this.model.currentPiece.id;
                });

                this.model.nextPiece = this.model.createRandomPiece('ignore');
                console.log(this.model.nextPiece)
            }
        }, 1000);
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

        // Si le compte à rebours n'est pas terminé, affiche le nombre de secondes restantes
        // Sinon, cacher la div et lancer la partie
        if (seconds < 0) {
            wrap.classList.add('hidden');
            this.model.startNewGame();
            this.bindEvents();
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
    }
}

export default TetrisController;
