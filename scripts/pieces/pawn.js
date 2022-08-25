'use strict';

class Pawn extends Piece {
    constructor(color, pos, step, type, lastMoves = undefined) {
        let src = color === 'white' ? 'wp': 'bp'; 
        super(color, pos, step, type, src, lastMoves);
        // this.enPassant = true -> the piece can be taken by 'en passant'
        this.enPassant = false;
    }

    getLegalMoves() {
        let moves;
        let p = this.pos;
        let capture;
        if (this.color === 'white') {
            capture = [p - 11, p - 9];
            // If the pawn didn't moves yet, it can go 2 square forward
            if (this.lastMoves.length === 0) {
                moves = [p - 20, p - 10];
            } else {
                moves = [p - 10];
            }
        } else {
            capture = [p + 9, p + 11];
            if (this.lastMoves.length === 0) {
                moves = [p + 10, p + 20];
            } else {
                moves = [p + 10];
            }
        }
        // can't go out of the grid
        let squares = removePosOutOfGrid(moves);
        // can be blocked by ally pieces, so remove illegals moves
        squares = removePosWhereAlly(squares, this.color);
        // can be blocked by enemy pieces, so remove them too
        squares = removePosWhereAlly(squares, reverseColor[this.color]);
        // can capture
        for (let pos of capture) {
            if (isInsideGrid(pos)) {
                if (findColoredPieceByPos(piecesArray[reverseColor[this.color]], pos) !== false) {
                    squares.push(pos);
                }
            }
        }
        // en passant
        let enPassant = [p - 1, p + 1];
        for (let pos in enPassant) {
            if (isInsideGrid(enPassant[pos])) {
                let opponentPiece = findColoredPieceByPos(piecesArray[reverseColor[this.color]], enPassant[pos]) ;
                if (opponentPiece !== false && opponentPiece.getType() == 'pawn' && opponentPiece.getEnPassant()) {
                    squares.push(capture[pos]);
                }
            }
        }
        return squares;
    }

    addMove(move) {
        let [from, to] = move;
        if (delta(from, to) === 20) {
            this.enPassant = true;
        } else {
            this.enPassant = false;
        }
        this.lastMoves.push(move);
    }

    getEnPassant() {
        return this.enPassant;
    }

    setEnPassant(value) {
        this.enPassant = value;
    }

    copy() {
        let p = new Pawn(this.color, this.pos, this.step, this.type, copyArray(this.lastMoves));
        return p
    }
}