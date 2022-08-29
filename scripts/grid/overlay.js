function hideStartPanel() {
    let startingMenu = document.getElementsByClassName('starting-menu');
    for (let element of startingMenu) {
        element.style.display = 'none';
    }
}

function setNames() {
    let whiteName = document.getElementById('white-player-name').value;
    let blackName = document.getElementById('black-player-name').value;
    document.getElementById('white-name').innerText = whiteName;
    document.getElementById('black-name').innerText = blackName;
    let nameAreas = document.getElementsByClassName('players-name-tab');
    for (let area of nameAreas) {
        area.style.display = 'flex';
    }
    playersName['white'] = whiteName;
    playersName['black'] = blackName;
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