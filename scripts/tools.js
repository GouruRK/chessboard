'use strict';

const isInsideArray = function(array, element) {
    return array.reduce((prev, curr) => {
        if (prev == true) {
            return prev;
        } else if (curr == element) {
            return true;
        }
        return false;
    }, false);
};

const fromPosToCoordinates = function(pos) {
    let x = pos % 10;
    let y = Math.floor(pos / 10);
    return [x, y];
};

const fromCoordinatesToPos = function(x, y) {
    return y * 10 + x
};

const isInsideGrid = function(pos) {
    let [x, y] = fromPosToCoordinates(pos);
    if (0 <= x && x <= 7) {
        if (0 <= y && y <= 7) {
            return true;
        }
    }
    return false;
};

const removePosOutOfGrid = function(pos) {
    return pos.filter(p => isInsideGrid(p));
};

const removePosWhereAlly = function(pos, color) {
    return pos.filter(p => findColoredPieceByPos(piecesArray[color], p) == []);
};

const findColoredPieceByPos = function(pieces, pos) {
    return pieces.reduce((prev, current) => {
        if (prev != false) {
            return prev;
        } else if (current.getPos() == pos) {
            return current;
        }
        return false;
    }, false)
};

const findPieceByPos = function(pos) {
    let piece = findColoredPieceByPos(piecesArray[currentPlayer], pos);
    if (piece != false) {
        return piece
    }
    return findColoredPieceByPos(piecesArray[reverseColor[currentPlayer]], pos);
};

const findPiecesByType = function(pieces, type) {
    return pieces.filter(piece => piece.getType() == type);
};

const removePieceFromPos = function(pieces, pos) {
    return pieces.filter(piece => piece.getPos() != pos);
};

const delta = function(pos1, pos2) {
    return Math.abs(pos1 - pos2);
}

const copyArray = function(array) {
    return array.filter(_ => true);
}

const copyPiecesArray = function(array) {
    let newArray = [];
    array.forEach(p => {
        newArray.push(p.copy());
    });
    return newArray;
}