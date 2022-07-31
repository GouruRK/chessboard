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
function isCheck(color, pieces=undefined) {
    if (pieces == undefined) {
        pieces = piecesArray;
    }
    // find the position of the king
    let king = findPiecesByType(pieces[color], 'king')[0];
    // find if the opponent pieces attack the king
    return isSquareAttacked(king.getPos(), reverseColor[color], pieces);
}

// check if the `square` is attacked by the `color`
function isSquareAttacked(square, color, pieces=undefined) {
    if (pieces == undefined) {
        pieces = piecesArray;
    }
    pieces = pieces[color];
    for (let piece of pieces) {
        let legalMoves = piece.getLegalMoves();
        if (isInsideArray(legalMoves, square)) {
            return true;
        }
    }
    return false;
}