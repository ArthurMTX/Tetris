import TetrisView from '../views/tetris-view.js';
import TetrisGame, {currentPiece, movePiece} from "../models/tetris-game.js";
import TetrisPiece from "../models/tetris-piece.js";

/// Classe qui gère le contrôleur du jeu
///
/// Paramétres :
/// game : instance de la classe TetrisGame
/// view : instance de la classe TetrisView
class TetrisController {
    constructor(game, view) {
        this.game = game;
        this.view = view;
    }

    /// Fonction qui démarre le jeu
    ///
    /// Paramétres :
    /// aucun
    start() {
        // Récupère l'intance de la classe TetrisView
        this.view = new TetrisView(this.game, 'tetris');

        // Dessine la grille
        this.view.drawGrid();
    }

    /// Fonction qui met à jour la vue
    ///
    /// Paramétres :
    /// aucun
    updateView() {
        this.view.drawGrid();
    }

    /// Fonction qui gère les événements clavier
    ///
    /// Paramétres :
    /// aucun
    static bindEvents() {
        // Définit les touches de contrôle
        const keyBindings = {
            ArrowRight: 'right',
            d: 'right',
            ArrowLeft: 'left',
            q: 'left',
            ArrowDown: 'down',
            ' ': 'down',
            z: 'rotateClockwise',
            s: 'rotateClockwise'
        };
        
        // Écoute les événements clavier
        document.addEventListener('keydown', (event) => {
        const action = keyBindings[event.key];

        // Vérifie que la touche est valide
        if (!action) return;
        
        // Vérifie si la touche est une rotation ou un déplacement
        if (action === 'rotateClockwise') {
            TetrisPiece.rotateClockwise(currentPiece.id);
        } else {
            movePiece(action);
        }
        });
        
        // Chaque seconde, on déplace la pièce vers le bas
        setInterval(() => {
            if (movePiece('down') === 0) {
                // Si la pièce ne peut pas descendre, on en crée une nouvelle
                TetrisGame.createRandomPiece();
            }
        }, 1000);
    }
}

export default TetrisController;
