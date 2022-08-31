'use strict';

/**
 * Checj if an element is inside an array
 * @param {Array[*]} array 
 * @param {*} element 
 * @returns {bool} true if element is in array, else false
 */
const isInsideArray = function(array, element) {
    return array.reduce((prev, curr) => {
        if (prev) {
            return prev;
        } else if (curr == element) {
            return true;
        }
        return false;
    }, false);
};

/**
 * Convert board position to coordinates
 * @param {number} pos 
 * @returns {Array[number, number]}
 */
const fromPosToCoordinates = function(pos) {
    let x = pos % 10;
    let y = Math.floor(pos / 10);
    return [x, y];
};

/**
 * Convert coordinates to board position
 * @param {*} x 
 * @param {*} y 
 * @returns {number}
 */
const fromCoordinatesToPos = function(x, y) {
    return y * 10 + x;
};

/**
 * Check if a given position is inside the board
 * @param {number} pos 
 * @returns {bool} true if inside, else false
 */
const isInsideGrid = function(pos) {
    let [x, y] = fromPosToCoordinates(pos);
    if (0 <= x && x <= 7) {
        if (0 <= y && y <= 7) {
            return true;
        }
    }
    return false;
};

/**
 * Create a new array with only positions that are inside the board
 * @param {Array[number]} array
 * @returns {Array[number]}
 */
const removePosOutOfGrid = function(array) {
    return array.filter((pos) => isInsideGrid(pos));
};

/**
 * Create a new array with position with no player's pieces on it
 * @param {Array[number]} array 
 * @param {string} color 
 * @returns {Array[number]}
 */
const removePosWhereAlly = function(array, color) {
    // return array.filter((pos) => !findColoredPieceByPos(piecesArray[color], pos));
    return array.filter((pos) => findColoredPieceByPos(piecesArray[color], pos) == []);
};

/**
 * Find a piece from an array based on its position
 * @param {Array[number]} pieces 
 * @param {number} pos 
 * @returns {*} false if the position is empty, else the piece object 
 */
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

/**
 * Find a piece based on it's position
 * @param {number} pos 
 * @returns {*} fakse if the position is empty, else the piece object
 */
const findPieceByPos = function(pos) {
    let piece = findColoredPieceByPos(piecesArray[currentPlayer], pos);
    if (piece != false) {
        return piece;
    }
    return findColoredPieceByPos(piecesArray[reverseColor[currentPlayer]], pos);
};

/**
 * Create an array with only pieces of the given type
 * @param {Array[object]} pieces 
 * @param {string} type 
 * @returns {Array[object]}
 */
const findPiecesByType = function(pieces, type) {
    return pieces.filter((piece) => piece.getType() === type);
};

/**
 * Create a new array based on the 'pieces' array by removing the piece on the given position
 * @param {Array[object]} pieces 
 * @param {number} pos 
 * @returns {Array[object]}
 */
const removePieceFromPos = function(pieces, pos) {
    return pieces.filter((piece) => piece.getPos() !== pos);
};

/**
 * Create a new array based on the 'pieces' array by removing the pieces of a given type
 * @param {Array[object]} pieces 
 * @param {string} type 
 * @returns {Array[object]}
 */
const removePieceFromType = function(pieces, type) {
    return pieces.filter((piece) => piece.getType() !== type);
}

const getSquareColor = function(pos) {
    let [x, y] = fromPosToCoordinates(pos);
    return (x + y) % 2 === 0 ? 'white': 'black';
}

const delta = function(pos1, pos2) {
    return Math.abs(pos1 - pos2);
}

const copyArray = function(array) {
    return [...array];
}

const copyPiecesArray = function(array) {
    let newArray = [];
    array.forEach((p) => {
        newArray.push(p.copy());
    });
    return newArray;
}

const fromPosToSquare = function(pos) {
    let [x, y] = fromPosToCoordinates(pos);
    let digits = '87654321';
    let letters = 'abcdefghi';
    return letters[x] + digits[y];
}