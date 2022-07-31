'use strict';

function drag(event) {
    // hide the default piece
    event.target.classList.add('hide');
    // Remove allowDrop from previous placement
    removeAllowDrop();
    hideAllowDrop();
    // Search of the piece position
    let parentId = extractPosFromElement(event.target.parentNode);
    let piece = findPieceByPos(parentId);
    // Check if the piece belongs to the current player. If not break
    if (piece.getColor() != currentPlayer) {
        return;
    }
    // Look at all the squares the piece can go
    let legalMoves = piece.getLegalMoves();
    legalMoves = removeMovesIfCheck(parentId, legalMoves, currentPlayer);
    // If there is, add special moves
    if (piece.getType() == 'king') {
        let caslteDir = piece.canCastle();
        if (caslteDir != false) {
            for (let c of caslteDir) {
                legalMoves.push(c == 'short' ? piece.getPos()+2 : piece.getPos()-2);
            }
        }
    }
    // Allow the user to drop the piece on the legal moves squares
    addAllowDrop(legalMoves);
    // Show the user the legal moves squares
    showAllowDrop(legalMoves);
    event.dataTransfer.setData('piece', parentId);
}

function drop(event) {
    event.preventDefault();
    let pos = event.dataTransfer.getData('piece');
    pos = parseInt(pos);
    let newPos;
    let square;
    // If the square wasn't empty
    if (event.target.localName == 'img') {
        square = event.target.parentNode;
        newPos = extractPosFromElement(square);
        removeImageFromPos(newPos);
    }
    else {
        square = event.target;
        newPos = extractPosFromElement(square);
    }
    // Add the piece to its new place 
    square.appendChild(document.getElementById('p-' + String(pos)).children[0]);
    // Remove the allow drop authorization
    removeAllowDrop();
    // Hide the legal moves squares
    hideAllowDrop();
    // Move the piece on the internal board
    move(pos, newPos);
    // Remove the possibilities to move the same player's pieces
    changeDraggableValue(currentPlayer, false);
    // Authorize the new player to move his pieces
    changeDraggableValue(currentPlayer, true);
}

function onDragEnd(event) {
    event.target.classList.remove('hide');
}

function allowDrop(event) {
    event.preventDefault();
}

function changeDraggableValue(color, value) {
    let pieces = findImagesByColor(color);
    for (let piece of pieces) {
        piece.draggable = value;
    }
}

function addAllowDrop(pos) {
    // Allow drop of positions
    let square;
    pos.forEach(p => {
        square = document.getElementById(p);
        square.ondragover = function() {
            allowDrop(event);
        };
    });
}

function removeAllowDrop(pos = undefined) {
    if (pos == undefined) {
        // Remove allow drop for all grid
        let grid = document.getElementById('grid');
        for (let ligne of grid.childNodes) {
            for (let square of ligne.childNodes) {
                square.ondragover = '';
            }
        }
    } else {
        pos.forEach((p) => {
            document.getElementById(p).ondragover = '';
        });
    }
    
}

function showAllowDrop(pos) {
    pos.forEach((p) => {
        document.getElementById(p).classList.add('subcolor');
    });
}

function hideAllowDrop(pos = undefined) {
    if (pos == undefined) {
        let grid = document.getElementById('grid');
        for (let ligne of grid.childNodes) {
            for (let square of ligne.childNodes) {
                square.classList.remove('subcolor');
            }
        }
    } else {
        pos.forEach((p) => {
            document.getElementById(p).classList.remove('subcolor');
        });
    }
} 