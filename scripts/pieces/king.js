'use strict';

class King extends Piece {
    constructor(color, pos, step, lastMoves = undefined, shortCastle = undefined, longCastle = undefined) {
        let src = color === 'white' ? 'wk': 'bk';
        let type = 'king';
        super(color, pos, step, type, src, lastMoves);
        this.longCastle = shortCastle === undefined ? true: shortCastle;
        this.shortCastle = longCastle === undefined ? true: longCastle;
    }


    addMove(move) {
        this.lastMoves.push(move);
        this.longCastle = false;
        this.shortCastle = false;
        return this.lastMoves;
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
            let right = {
                'long': this.longCastle,
                'short': this.shortCastle,
            }
            console.log(right)
            let castle = [];
            for (let r in rooks) {
                let rook = findPieceByPos(rooks[r]);
                let check = true;
                if (rook !== false && rook.getType() === 'rook' && !rook.hasMoved() && right[type[r]]) {
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
    
    setLongCastle(value) {
        this.longCastle = value;
        return value;
    }

    setShortCastle(value) {
        this.shortCastle = value;
        return value;
    }

    getCastleRights() {
        return [this.shortCastle, this.longCastle];
    }

    copy() {
        return new King(this.color, this.pos, this.step, copyArray(this.lastMoves), this.shortCastle, this.longCastle);
    }
}