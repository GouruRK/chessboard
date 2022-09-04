'use strict';

function hideStartPanel() {
    let startingMenu = document.getElementsByClassName('starting-menu');
    for (let element of startingMenu) {
        element.style.display = 'none';
    }
}

function insertNames() {
    let whiteName = document.getElementById('white-player-name').value;
    let blackName = document.getElementById('black-player-name').value;
    setName(document.getElementById('white-name'), whiteName)
    setName(document.getElementById('black-name'), blackName)
    document.getElementById('white-name').innerText = whiteName;
    document.getElementById('black-name').innerText = blackName;
    let nameAreas = document.getElementsByClassName('players-name-tab');
    for (let area of nameAreas) {
        area.style.display = 'flex';
    }
    playersName['white'] = whiteName;
    playersName['black'] = blackName;
}

function setName(element, name) {
    element.innerHTML = name;
}

function closePanel() {
    document.getElementById('game-result').style.display = 'none';
}

function showGameResult(text) {
    document.getElementById('result').innerText = text;
    document.getElementById('game-result').style.display = 'block';
}

function showCurrentGamePanel() {
    let gamePanel = document.getElementsByClassName('current-game');
    for (let element of gamePanel) {
        element.style.display = 'block';
    }
}

// Promotion

function showPromotion(color, pos) {
    let promotionContainer = document.getElementById(`${color}-promotion`);
    promotionContainer.style.display = 'flex';
    let chidren = promotionContainer.children;
    for (let child of chidren) {
        let pieceType = child.classList[1];
        child.addEventListener('click', function() {
            applyPromotion(color, pos, pieceType);
        });
    }
}

function applyPromotion(color, pos, pieceType) {
    piecesArray[color] = removePieceFromPos(piecesArray[color], pos);
    let piece;
    if (pieceType === 'queen') {
        piece = new Queen(color, pos, [-11, -10, -9, -1, 1, 9, 10, 11]);
    } else if (pieceType === 'rook') {
        piece = new Rook(color, pos, [-10, -1, 1, 10]);
    } else if (pieceType === 'bishop') {
        piece = new Bishop(color, pos, [-11, -9, 9, 11]);
    } else {
        piece = new Knight(color, pos, undefined);
    }
    piecesArray[color].push(piece);
    let promotionContainer = document.getElementById(`${color}-promotion`);
    promotionContainer.style.display = 'none';
    let chidren = promotionContainer.children;
    for (let child of chidren) {
        child.removeEventListener('click', null);
    }
    removeImagesFromColor(color);
    placeImages(piecesArray[color]);
}

function parseTime() {
    let container = document.getElementById('select-time-control');
    for (let children of container.children) {
        for (let liChildren of children.children) {
            if (liChildren.tagName === 'INPUT') {
                if (liChildren.checked) {
                    let id = liChildren.id;
                    if (id === 'inf') {
                        return ['inf', 'inf'];
                    } else if (id === 'custom') {
                        let minutes = document.getElementById('custom-minuts').value;
                        let additionalTime = document.getElementById('custom-additional-time').value;
                        [minutes, additionalTime] = [parseInt(minutes), parseInt(additionalTime)]
                        return [minutes * 60, additionalTime];
                    } else {
                        let time = id.split('|');
                        let [initialTime, additionalTime] = time.map((value) => Number(value));
                        return [initialTime * 60, additionalTime]
                    }
                }
            }
        }
    }
}

function updateFrame(player = undefined) {
    if (player === undefined) {
        player = currentPlayer;
    }
    let timer = playerTimer[player];
    let [minuts, seconds] = timer.format();
    let frame = document.getElementById(`${player}-name`);
    let time = ` - ${minuts}:${seconds}`;
    if (minuts === 'inf') {
        time = ' - &infin;'
    }
    setName(frame, playersName[player] + time);
}

function toggleTimeControl() {
    let elements = document.getElementsByClassName('custom-time');
    for (let elem of elements) {
        console.log(elem.style.display)
        if (elem.style.display === 'none' || elem.style.display === '') {
            elem.style.display = 'block';
        } else {
            elem.style.display = 'none';
        }
    }
}