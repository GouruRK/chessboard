'use strict';

const reverseColor = {
    'white': 'black',
    'black': 'white'
};

const piecesArray = {
    'white': [],
    'black': []
};

let currentPlayer;

// check if the king of the `color` is in check
function isCheck(color) {
    // find the position of the king
    let king = findPiecesByType(piecesArray[color], "king")[0];
    // find if the opponent pieces attack the king
    return isSquareAttacked(king.getPos(), reverseColor[color]);
}

// check if the `square` is attacked by the `color`
function isSquareAttacked(square, color) {
    let pieces = piecesArray[color];
    for (let piece of pieces) {
        let legalMoves = piece.getLegalMoves();
        if (isInsideArray(legalMoves, square)) {
            return true;
        }
    }
    return false;
}