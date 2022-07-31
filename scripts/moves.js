'use strict';

function move(from, to, player = undefined, pieces = undefined, visual = true) {
    if (player == undefined) {
        player = currentPlayer;
    }
    if (pieces == undefined) {
        pieces = piecesArray;
    }
    let piece = findColoredPieceByPos(pieces[player], from);
    let opponentPiece = findColoredPieceByPos(pieces[reverseColor[player]], to);
    // if there is already a piece where the player places it's own one : its a capture
    if (opponentPiece != false) {
        let newOpponentPieces = removePieceFromPos(pieces[reverseColor[currentPlayer]], to);
        pieces[reverseColor[player]] = newOpponentPieces;
    }
    // check if the move is 'en passant'
    enPassant(from, to, player, pieces, visual);
    if (visual) {
        // check if the move is castling
        castle(from, to);
    }
    // update the piece's propreties
    piece.setPos(to);
    piece.addMove([from, to]);
    if (visual) {
        // change the player
        currentPlayer = reverseColor[currentPlayer];
        // remove en passant
        removeEnPassant(currentPlayer, pieces);
    }
    
}

function enPassant(from, to, player = undefined, pieces = undefined, visual = true) {
    if (player == undefined) {
        player = currentPlayer;
    }
    if (pieces == undefined) {
        pieces = piecesArray;
    }
    let piece = findColoredPieceByPos(pieces[player], from);
    let opponentPiece = findColoredPieceByPos(pieces[reverseColor[player]], to);
    // determine if its an 'en passant' move
    if ((delta(from, to) == 11 || delta(from, to) == 9)
        && piece.getType() == 'pawn'
        && opponentPiece == false) {

        // find the real position of the ennemy piece
        opponentPiece = findColoredPieceByPos(pieces[reverseColor[player]], piece.getPos()-1);
        if (opponentPiece == false || opponentPiece.getEnPassant() == false) {
            opponentPiece = findColoredPieceByPos(pieces[reverseColor[player]], piece.getPos()+1);
        }
        // If the piece can't be found, its not an 'en passant' move : just a capture
        if (opponentPiece == false || opponentPiece.getEnPassant() == false) {
            return;
        }
        // remove the piece
        let newOpponentPieces = removePieceFromPos(pieces[reverseColor[player]], opponentPiece.getPos());
        pieces[reverseColor[player]] = newOpponentPieces;
        // remove the piece from the visual board
        if (visual) {
            removeImageFromPos(opponentPiece.getPos());
        }
    }
}

function removeEnPassant(color) {
    let pieces = findPiecesByType(piecesArray[color], 'pawn');
    pieces.forEach(p => p.setEnPassant(false));
}

function castle(from, to) {
    let piece = findColoredPieceByPos(piecesArray[currentPlayer], from);
    if (piece != false && piece.getType() == 'king' && delta(from, to) == 2) {
        let rook;
        let oldRookPos;
        let newRookPos;
        if (from - to < 0) {
            // short castle
            oldRookPos = from + 3;
            rook = findColoredPieceByPos(piecesArray[currentPlayer], oldRookPos);
            newRookPos = to - 1;
        } else {
            // long castle
            oldRookPos = from - 4;
            rook = findColoredPieceByPos(piecesArray[currentPlayer], oldRookPos);
            newRookPos = to + 1;
        }
        // create the new rook element
        let newRookImage = document.createElement("img");
        newRookImage.src = rook.getSrc();
        newRookImage.alt = rook.getSrc();
        newRookImage.draggable = false;
        newRookImage.ondragstart = function() {
            drag(event);
        };
        newRookImage.ondragend = function() {
            onDragEnd(event);
        };
        newRookImage.classList.add('img');
        // add the new rook element to the visual board
        document.getElementById('p-'+String(newRookPos)).appendChild(newRookImage);
        // remove the old rook element from the visual board
        removeImageFromPos(oldRookPos);
        // set the new propreties to the rook
        rook.setPos(newRookPos);
        rook.addMove([oldRookPos, newRookPos]);
    }
}

// if current player is white and his king is under attack
//  -> remove all possibles moves if after it, the king is still under attack
function removeMovesIfCheck(from, moves, color) {
    let newMoves = [];
    for (let to of moves) {
        let pieces = simulate(from, to, color);
        if (isCheck(color, pieces) == false) {
            newMoves.push(to);
        }
    }
    return newMoves;
}

function simulate(from, to, color) {
    let pieces = {
        'white': copyPiecesArray(piecesArray['white']),
        'black': copyPiecesArray(piecesArray['black'])
    }
    move(from, to, color, pieces, false);
    return pieces;
}