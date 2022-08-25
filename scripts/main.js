'use strict';

document.getElementById('start-button').addEventListener('click', init);
document.getElementById('close').addEventListener('click', closePanel);

const reverseColor = {
    'white': 'black',
    'black': 'white',
};

const piecesArray = {
    'white': [],
    'black': [],
};

let currentPlayer;
let playersName = {
    'white': undefined,
    'black': undefined,
};


// check if the king of the `color` is in check
function isCheck(color) {
    // find the position of the king
    let king = findPiecesByType(piecesArray[color], 'king')[0];
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

function isGameEnded(player = currentPlayer) {
    if (isCheckmate(player)) {
        return [true, 'checkmate'];
    }
    if (isStalemate(player)) {
        return [true, 'stalemate'];
    }
    if (isDeadPosition()) {
        return [true, 'dead position'];
    }
    return [false, undefined];
}

function isCheckmate(color) {
    // Return true if the king of the 'color' can no longuer move and is in a check position
    if (!isCheck(color)) {
        return false;
    }
    return findIfLegalMoves(color);
}

function isStalemate(color) {
    // Return true if the king of the 'color' can no longuer move and is not in a check position
    if (isCheck(color)) {
        return false;
    }
    return findIfLegalMoves(color);
}

function isDeadPosition() {
    // Return true if the game cant be win by both players
    // This happens when there is only :
    // king vs. king
    // king and bishop vs. king
    // king and knight vs. king
    // king and bishop vs. king and bishop (with both bishop on the same color)
    // See in https://www.chess.com/terms/draw-chess#dead-position for more details
    let whitePieces = piecesArray['white'];
    let blackPieces = piecesArray['black'];
    let whitePiecesLength = whitePieces.length;
    let blackPiecesLength = blackPieces.length;
    // king vs. king
    if (whitePiecesLength === blackPiecesLength && blackPiecesLength === 1) {
        return true;
    }
    // king and bishop vs. king and bishop (with both bishop on the same color)
    if (whitePiecesLength === blackPiecesLength && blackPiecesLength === 2) {
        let whiteBishop = findPiecesByType(whitePieces, 'bishop');
        let blackBishop = findPiecesByType(blackPieces, 'bishop');
        if (whiteBishop.length === blackBishop.length && blackBishop.length === 1) {
            whiteBishop = whiteBishop[0];
            blackBishop = blackBishop[0];
            if (getSquareColor(whiteBishop.getPos()) === getSquareColor(blackBishop.getPos())) {
                return true;
            }
        }
    }
    let maxLength = Math.max(whitePiecesLength, blackPiecesLength);
    let minLength = Math.min(whitePiecesLength, blackPiecesLength);
    // king and bishop or knight vs. king
    if (maxLength === 2 && minLength === 1) {
        let maxLengthPieces = whitePiecesLength === maxLength ? whitePieces: blackPieces;
        let lastPiece = removePieceFromType(maxLengthPieces, 'king')[0];
        if (lastPiece.getType() === 'bishop' || lastPiece.getType() === 'knight') {
            return true;
        }
    }
    return false;
}

function findIfLegalMoves(color) {
    let pieces = piecesArray[color];
    for (let piece of pieces) {
        let legalMoves = piece.getLegalMoves();
        legalMoves = removeMovesIfCheck(piece.getPos(), legalMoves, color);
        if (legalMoves.length !== 0) {
            return false;
        }
    }
    return true;
}

function result(how) {
    if (how === 'checkmate') {
        showGameResult(`Player ${playersName[currentPlayer]} win by checkmate`);
    } else if (how === 'stalemate') {
        showGameResult(`The game is a draw`);
    } else if (how === 'dead position') {
        showGameResult(`The game is a draw`);
    }
}