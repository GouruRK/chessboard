'use strict';

class Rook extends Piece {
    constructor(color, pos, step, lastMoves = undefined) {
        let src = color === 'white' ? 'wr': 'br';
        let type = 'rook';
        super(color, pos, step, type, src, lastMoves);
    }

    addMove(move) {
        if (this.lastMoves.length === 0) {
            let [x, _] = fromPosToCoordinates(move[0]);
            if (x === 0) {
                let king = findPiecesByType(piecesArray[this.color], 'king')[0];
                king.setLongCastle(false);
            } else {
                let king = findPiecesByType(piecesArray[this.color], 'king')[0];
                king.setShortCastle(false);
            }
        }
        this.lastMoves.push(move);
        return this.lastMoves;
    }

    canCastle() {
        return this.lastMoves.length === 0 ? true : false;
    }

    copy() {
        return new Rook(this.color, this.pos, this.step, copyArray(this.lastMoves));
    }
}