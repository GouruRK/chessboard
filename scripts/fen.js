'use strict';

/*
Some usefull fens :

Init : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w'
Castle : 'r3k2r/8/8/8/8/8/8/R3K2R w'
*/

function loadFen(fen) {
    let whitePieces = [];
    let blackPieces = [];
    let player = 'white';
    fen = fen.split(' ');
    let position = fen[0].split('/');
    for (let y in position) {
        let x = 0;
        for (let abscissa in position[y]) {
            let pos = Number(y+x)
            switch (position[y][abscissa]) {
                case 'r':
                    blackPieces.push(new Rook('black', pos, [-10, -1, 1, 10], 'rook', './assets/br.png'));
                    x ++;
                    break;
                case 'R':
                    whitePieces.push(new Rook('white', pos, [-10, -1, 1, 10], 'rook', './assets/wr.png'));
                    x ++;
                    break;
                case 'n':
                    blackPieces.push(new Knight('black', pos, undefined, 'knight', './assets/bn.png'));
                    x ++;
                    break;
                case 'N':
                    whitePieces.push(new Knight('white', pos, undefined, 'knight', './assets/wn.png'));
                    x ++;
                    break;
                case 'b':
                    blackPieces.push(new Bishop('black', pos, [-11, -9, 9, 11], 'bishop', './assets/bb.png'));
                    x ++;
                    break;
                case 'B':
                    whitePieces.push(new Bishop('white', pos, [-11, -9, 9, 11], 'bishop', './assets/wb.png'));
                    x ++;
                    break;
                case 'q':
                    blackPieces.push(new Queen('black', pos, [-11, -10, -9, -1, 1, 9, 10, 11], 'queen', './assets/bq.png'));
                    x ++;
                    break;
                case 'Q':
                    whitePieces.push(new Queen('white', pos, [-11, -10, -9, -1, 1, 9, 10, 11], 'queen', './assets/wq.png'));
                    x ++;
                    break;
                case 'k':
                    blackPieces.push(new King('black', pos, undefined, 'king', './assets/bk.png'));
                    x ++;
                    break;
                case 'K':
                    whitePieces.push(new King('white', pos, undefined, 'king', './assets/wk.png'));
                    x ++;
                    break;
                case 'p':
                    blackPieces.push(new Pawn('black', pos, undefined, 'pawn', './assets/bp.png'));
                    x ++;
                    break;
                case 'P':
                    whitePieces.push(new Pawn('white', pos, undefined, 'pawn', './assets/wp.png'));
                    x ++;
                    break;
                default:
                    x = x + parseInt(position[y][abscissa]);
                    break;
            }
        }
    }
    if (fen.length != 1) {
        if (fen[1] == 'b' || fen[1] == 'B') {
            player = 'black';
        }
    }
    return [whitePieces, blackPieces, player];
}

function createFen() {
    let fen = '';
    let pieces = {
        'rook': 'r',
        'knight': 'n',
        'bishop': 'b',
        'queen': 'q',
        'king': 'k',
        'pawn': 'p'
    };
    for (let y = 0; y < 8; y++) {
        let gap = 0;
        for (let x = 0; x < 8; x++) {
            let pos = fromCoordinatesToPos(x, y);
            let piece = findPieceByPos(pos);
            if (piece == false) {
                gap ++;
            } else {
                if (gap != 0) {
                    fen += String(gap);
                    gap = 0;
                }
                let type = piece.getType();
                let color = piece.getColor();
                let symbol = pieces[type];
                fen += `${color == 'white' ? symbol.toUpperCase() : symbol}`;
            }
        }
        if (gap != 0) {
            fen += String(gap);
        }
        if (y != 7) {
            fen += '/';
        }
    }
    return fen + ` ${currentPlayer == 'white' ? 'w': 'b'}`;
}