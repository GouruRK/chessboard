'use strict';

class Knight extends Piece {
    constructor(color, pos, step, type, src) {
        super(color, pos, step, type, src);
    }

    getLegalMoves() {
        let p = this.pos;
        let pos = removePosOutOfGrid([p-21, p-19, p-12, p-8, p+8, p+12, p+19, p+21]);
        return removePosWhereAlly(pos, this.color)
    }
}