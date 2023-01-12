import TetrisView from '../views/tetris-view.js';
import TetrisGame, {currentPiece, movePiece} from "../models/tetris-game.js";
import TetrisPiece from "../models/tetris-piece.js";

// Classe qui représente le contrôleur du jeu Tetris
class TetrisController {
    constructor(game, view) {
        this.game = game;
        this.view = view;
    }

    // Méthode qui initialise la vue et le contrôleur
    start() {
        this.view = new TetrisView(this.game, 'tetris');
        this.view.drawGrid();
    }

    // Méthode qui met à jour l'interface utilisateur
    updateView() {
        this.view.drawGrid();
    }

    // Méthode qui gère les interactions utilisateur
    static bindEvents() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd' || event.key === 'ArrowRight') {
                // Déplacez la pièce vers la droite
                movePiece('right');
            }
            if (event.key === 'q' || event.key === 'ArrowLeft') {
                // Déplacez la pièce vers la gauche
                movePiece('left');
            }
            if (event.key === ' ' || event.key === 'ArrowDown') {
                // Déplacez la pièce vers le bas
                movePiece('down');
            }
            if (event.key === 'z') {
                // Faites pivoter la pièce
                TetrisPiece.rotateClockwise(currentPiece.id);
            }
            if (event.key === 's') {
                // Faites pivoter la pièce
                TetrisPiece.rotateClockwise(currentPiece.id);
            }
        });

        setInterval(() => {
            if (movePiece('down') === 0) {
                // Si la pièce ne peut pas descendre, on en crée une nouvelle
                TetrisGame.createRandomPiece();
            }
        }, 1000);
    }
}

export default TetrisController;
