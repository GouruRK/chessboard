'use strict';

function move(from, to, player = undefined, visual = true) {
    if (player === undefined) {
        player = currentPlayer;
    }
    let capture = false;
    let castleIndicator = false;
    let piece = findColoredPieceByPos(piecesArray[player], from);
    let opponentPiece = findColoredPieceByPos(piecesArray[reverseColor[player]], to);
    // if there is already a piece where the player places it's own one : its a capture
    if (opponentPiece != false) {
        let newOpponentPieces = removePieceFromPos(piecesArray[reverseColor[currentPlayer]], to);
        piecesArray[reverseColor[player]] = newOpponentPieces;
        capture = true;
    }
    // check if the move is 'en passant'
    let passant = enPassant(from, to, player, visual);
    if (passant) {
        capture = true;
    }
    if (visual) {
        // check if the move is castling
        let c = castle(from, to);
        if (c[0]) {
            castleIndicator = c[1];
        }
    }
    // update the piece's propreties
    piece.setPos(to);
    piece.addMove([from, to]);
    if (visual) {
        // change the player
        currentPlayer = reverseColor[currentPlayer];
        moveHistory.push(writeMove(piece, from, to, capture, isCheck(currentPlayer), isCheckmate(currentPlayer), castleIndicator))
        positionHistory.push(createFen())
        let res = isGameEnded(currentPlayer);
        if (res[0]) {
            currentPlayer = reverseColor[currentPlayer];
            result(res[1]);
            currentPlayer = undefined;
            return true;
        }
        // remove en passant
        removeEnPassant(currentPlayer);
    }
    
}

function enPassant(from, to, player = undefined, visual = true) {
    if (player === undefined) {
        player = currentPlayer;
    }
    let piece = findColoredPieceByPos(piecesArray[player], from);
    let opponentPiece = findColoredPieceByPos(piecesArray[reverseColor[player]], to);
    // determine if its an 'en passant' move
    if ((delta(from, to) === 11 || delta(from, to) === 9)
        && piece.getType() === 'pawn'
        && !opponentPiece) {

        // find the real position of the ennemy piece
        opponentPiece = findColoredPieceByPos(piecesArray[reverseColor[player]], piece.getPos() - 1);
        if (!opponentPiece || !opponentPiece.getEnPassant()) {
            opponentPiece = findColoredPieceByPos(piecesArray[reverseColor[player]], piece.getPos() + 1);
        }
        // If the piece can't be found, its not an 'en passant' move : just a capture
        if (!opponentPiece || !opponentPiece.getEnPassant()) {
            return;
        }
        // remove the piece
        let newOpponentPieces = removePieceFromPos(piecesArray[reverseColor[player]], opponentPiece.getPos());
        piecesArray[reverseColor[player]] = newOpponentPieces;
        // remove the piece from the visual board
        if (visual) {
            removeImageFromPos(opponentPiece.getPos());
        }
        return true;
    }
    return false;
}

function removeEnPassant(color) {
    let pieces = findPiecesByType(piecesArray[color], 'pawn');
    pieces.forEach((p) => p.setEnPassant(false));
}

function castle(from, to) {
    let piece = findColoredPieceByPos(piecesArray[currentPlayer], from);
    if (piece !== false && piece.getType() === 'king' && delta(from, to) === 2) {
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
        document.getElementById(`p-${newRookPos}`).appendChild(newRookImage);
        // remove the old rook element from the visual board
        removeImageFromPos(oldRookPos);
        // set the new propreties to the rook
        rook.setPos(newRookPos);
        rook.addMove([oldRookPos, newRookPos]);
        return [true, from - to < 0 ? 'short': 'long'];
    }
    return [false, undefined];
}

// if current player is white and his king is under attack
//  -> remove all possibles moves if after it, the king is still under attack
function removeMovesIfCheck(from, moves, color) {
    let keep = {
        'white': copyPiecesArray(piecesArray['white']),
        'black': copyPiecesArray(piecesArray['black']),
    };
    let newMoves = [];
    for (let to of moves) {
        piecesArray['white'] = keep['white'];
        piecesArray['black'] = keep['black'];
        simulate(from, to, color);
        if (!isCheck(color)) {
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

function writeMove(piece, from, to, capture, check, checkmate, castle) {
    if (castle !== false) {
        return castle === 'short' ? '0-0': '0-0-0';
    }
    let digits = '87654321';
    let letters = 'abcdefghi';
    let squares = {};
    for (let y = 0; y < 8; y ++) {
        for (let x = 0; x < 8; x ++) {
            squares[fromCoordinatesToPos(x, y)] = letters[x] + digits[y];
        }
    }
    let pieces = {
        'bishop': 'B',
        'king': 'K',
        'knight': 'N',
        'pawn': '',
        'queen': 'Q',
        'rook': 'R',
    };
    let [x, y] = fromPosToCoordinates(from);
    let move = pieces[piece.getType()];
    // look if two or more pieces of the same type can go at the same square
    let otherPieces = findPiecesByType(piecesArray[piece.getColor()], piece.getType());
    for (let p of otherPieces) {
        if (p.getPos() !== from) {
            let legalMoves = p.getLegalMoves();
            if (isInsideArray(legalMoves, to)) {
                let [xp, yp] = fromPosToCoordinates(p.getPos);
                if (xp === x) {
                    move = move + digits[y];
                } else if (yp === y) {
                    move = move + letters[x];
                }
            }
        }
    }
    // capture
    if (capture) {
        if (piece.getType() === 'pawn') {
            move = move + letters[x];
        }
        move = move + 'x'
    }
    // destination
    move = move + squares[to];
    // check and checkmate
    if (check) {
        if (checkmate) {
            move = move + '#';
        } else {
            move = move + '+';
        }
    }
    return move;
}