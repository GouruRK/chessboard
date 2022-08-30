const findImageByPos = function(pos) {
    let square = document.getElementById(`p-${pos}`);
    return square.children[0];
};

const findImagesByColor = function(color) {
    let pieces = piecesArray[color];
    let images = [];
    for (let piece of pieces) {
        images.push(findImageByPos(piece.getPos()));
    }
    return images;
};

const removeImage = function(image) {
    let parent = image.parentNode;
    parent.removeChild(image);
}

const removeImageFromPos = function(pos) {
    removeImage(findImageByPos(pos));
}

const addImage = function(pos, image) {
    let square = document.getElementById(`p-${pos}`);
    square.appendChild(image);
} 

const extractPosFromElement = function(element) {
    let elementId = element.id;
    let pos;
    // If elementId format is `p-pos`
    if (elementId.includes('p')) {
        pos = elementId.split('-')[1];
    } else {
        pos = elementId;
    }
    return parseInt(pos);
}

const removeAllImages = function() {
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            let pos = fromCoordinatesToPos(x, y);
            let square = document.getElementById(`p-${pos}`);
            if (square.childElementCount === 1) {
                square.removeChild(square.lastChild);
            }
        }
    }
}