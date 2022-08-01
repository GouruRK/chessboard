'use strict';

class Knight extends Piece {
    constructor(color, pos, step, type, lastMoves = undefined) {
        let piece = color === 'white' ? 'wn' : 'bn';
        let src = `./assets/${piece}.png`;
        super(color, pos, step, type, src, lastMoves);
    }

    getLegalMoves() {
        let p = this.pos;
        let pos = [
            p - 21,
            p - 19,
            p - 12,
            p - 8,
            p + 8,
            p + 12,
            p + 19,
            p + 21,
        ];
        pos = removePosOutOfGrid(pos);
        return removePosWhereAlly(pos, this.color);
    }

    copy() {
        return new Knight(this.color, this.pos, this.step, this.type, copyArray(this.lastMoves));
    }
}