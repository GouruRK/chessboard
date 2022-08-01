'use strict';

class Piece {

    constructor(color, pos, step, type, src, lastMoves = undefined) {
        if (lastMoves === undefined) {
            lastMoves = [];
        }
        this.color = color;
        this.pos = pos;
        this.step = step;
        this.type = type;
        this.src = src;
        this.lastMoves = lastMoves;
    }

    getPos() {
        return this.pos;
    }

    setPos(pos) {
        this.pos = pos;
        return pos;
    }

    getColor() {
        return this.color;
    }

    getMoves() {
        return this.lastMoves;
    }

    addMove(move) {
        this.lastMoves.push(move);
        return this.lastMoves;
    }

    getType() {
        return this.type;
    }

    getSrc() {
        return this.src;
    }

    hasMoved() {
        return this.lastMoves.length === 0 ? false : true;
    }

    getLegalMoves() {
        if (this.step == undefined) {
            return [];
        }
        let moves = [];
        for(let step of this.step) {
            for (let i = 1; i < 8; i++) {
                let pos = this.pos + step*i;
                // if the position is inside the grid and if there is no ally pieces
                if (isInsideGrid(pos) && findColoredPieceByPos(piecesArray[this.color], pos) == []) {
                    moves.push(pos);
                    // If there is an ennemy piece at the position, capture it and dont go further
                    if (findColoredPieceByPos(piecesArray[reverseColor[this.color]], pos) != []) {
                        break;
                    }                    
                } else {
                    break;
                }
                
            }
        }
        return moves;
    }
}