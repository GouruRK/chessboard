'use strict';

class King extends Piece {
    constructor(color, pos, step, lastMoves = undefined) {
        let src = color === 'white' ? 'wk': 'bk';
        let type = 'king';
        super(color, pos, step, type, src, lastMoves);
    }

    getLegalMoves() {
        let p = this.pos;
        let pos = [
            p - 11,
            p - 10,
            p - 9,
            p - 1,
            p + 1,
            p + 9,
            p + 10,
            p + 11,
        ];
        pos = removePosOutOfGrid(pos);
        pos = removePosWhereAlly(pos, this.color);
        return pos;
    }

    canCastle() {
        if (!this.hasMoved() && !isSquareAttacked(this.pos, reverseColor[this.color])) {
            let p = this.pos;
            let type = ['long', 'short'];
            let rooks = [p - 4, p + 3];
            let between = [
                [p - 3, p - 2, p - 1],
                [p + 1, p + 2]
            ];
            let castle = [];
            for (let r in rooks) {
                let rook = findPieceByPos(rooks[r]);
                let check = true;
                if (rook !== false && rook.getType() === 'rook' && !rook.hasMoved()) {
                    for (let square of between[r]) {
                        let sq = findPieceByPos(square);
                        if(sq !== false || isSquareAttacked(square, reverseColor[this.color])) {
                            check = false;
                        }
                    }
                    if (check) {
                        castle.push(type[r]);
                    }
                }
            }
            return castle;
        }
        return false;
    }
    
    copy() {
        return new King(this.color, this.pos, this.step, copyArray(this.lastMoves));
    }
}