'use strict';

/*
00 01 02 03 04 05 06 07
10 11 12 13 14 15 16 17
20 21 22 23 24 25 26 27
30 31 32 33 34 35 36 37
40 41 42 43 44 45 46 47
50 51 52 53 54 55 56 57
60 61 62 63 64 65 66 67
70 71 72 73 74 75 76 77
*/

function init() {
    let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w';
    let [whitePieces, blackPieces, player] = loadFen(fen);
    createGrid();
    placeImages(whitePieces);
    placeImages(blackPieces);
    piecesArray['white'] = whitePieces;
    piecesArray['black'] = blackPieces;
    currentPlayer = player;
    changeDraggableValue(currentPlayer, true);
}

function createGrid() {
    let grid = document.getElementById('grid');
    for (let y = 0; y < 8; y ++) {
        grid.appendChild(createLine(y));
    }
}

// grid -> line -> subColor -> square | -> image |

function createLine(y) {
    let line = document.createElement('div');
    let subColor;
    line.className = 'line';
    for (let x = 0; x < 8; x ++) {
        subColor = document.createElement('div');
        subColor.id = fromCoordinatesToPos(x, y);
        subColor.className = `square ${(x + y) % 2 === 0 ? 'white': 'black'}`;
        subColor.innerHTML += `<div class='square' id='p-${fromCoordinatesToPos(x, y)}' draggable=false ondrop='drop(event)'>`;
        line.appendChild(subColor);
    }
    return line;
}

function placeImages(piecesArray) {
    let pos;
    let square;
    let image;
    piecesArray.forEach((piece) => {
        pos = piece.getPos();
        square = document.getElementById(`p-${pos}`);
        image = document.createElement('img');
        image.src = piece.getSrc();
        image.alt = piece.getSrc();
        image.draggable = false;
        image.ondragstart = function() {
            drag(event);
        };
        image.ondragend = function() {
            onDragEnd(event);
        };
        image.classList.add('img');
        square.appendChild(image);
    });
}