'use strict';

function move(from, to, player = undefined, visual = true) {
    if (player == undefined) {
        player = currentPlayer;
    }
    let piece = findColoredPieceByPos(piecesArray[player], from);
    let opponentPiece = findColoredPieceByPos(piecesArray[reverseColor[player]], to);
    // if there is already a piece where the player places it's own one : its a capture
    if (opponentPiece != false) {
        let newOpponentPieces = removePieceFromPos(piecesArray[reverseColor[currentPlayer]], to);
        piecesArray[reverseColor[player]] = newOpponentPieces;
    }
    // check if the move is 'en passant'
    enPassant(from, to, player, visual);
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
        removeEnPassant(currentPlayer);
    }
    
}

function enPassant(from, to, player = undefined, visual = true) {
    if (player == undefined) {
        player = currentPlayer;
    }
    let piece = findColoredPieceByPos(piecesArray[player], from);
    let opponentPiece = findColoredPieceByPos(piecesArray[reverseColor[player]], to);
    // determine if its an 'en passant' move
    if ((delta(from, to) == 11 || delta(from, to) == 9)
        && piece.getType() == 'pawn'
        && opponentPiece == false) {

        // find the real position of the ennemy piece
        opponentPiece = findColoredPieceByPos(piecesArray[reverseColor[player]], piece.getPos()-1);
        if (opponentPiece == false || opponentPiece.getEnPassant() == false) {
            opponentPiece = findColoredPieceByPos(piecesArray[reverseColor[player]], piece.getPos()+1);
        }
        // If the piece can't be found, its not an 'en passant' move : just a capture
        if (opponentPiece == false || opponentPiece.getEnPassant() == false) {
            return;
        }
        // remove the piece
        let newOpponentPieces = removePieceFromPos(piecesArray[reverseColor[player]], opponentPiece.getPos());
        piecesArray[reverseColor[player]] = newOpponentPieces;
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
    let keep = {
        'white': copyPiecesArray(piecesArray['white']),
        'black': copyPiecesArray(piecesArray['black'])
    }
    let newMoves = [];
    for (let to of moves) {
        piecesArray['white'] = keep['white'];
        piecesArray['black'] = keep['black'];
        simulate(from, to, color);
        if (isCheck(color) == false) {
            newMoves.push(to);
        }
    }
    piecesArray['white'] = keep['white'];
    piecesArray['black'] = keep['black'];
    return newMoves;
}

function simulate(from, to, color) {
    piecesArray['white'] = copyPiecesArray(piecesArray['white']);
    piecesArray['black'] = copyPiecesArray(piecesArray['black']);
    move(from, to, color, false);
}