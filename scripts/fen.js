'use strict';

// Understand FEN notation : https://www.chess.com/terms/fen-chess

/*
Some usefull fens :

Init : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w'
Castle : 'r3k2r/8/8/8/8/8/8/R3K2R w'
Attack on the king : 'r6r/4k3/8/8/8/8/8/2K1R2R b'
Checkmate : '7R/8/7k/8/8/8/8/2K3R1 b'
Stalemate : '4k3/8/3K1Q2/8/8/8/8/8 b'
Dead position 1, king vs king : 'k7/8/8/8/8/8/8/7K'
Dead position 2, king and bishop vs king : 'k7/8/8/8/b7/8/8/7K'
Dead position 3, king and knight vs king : 'k7/8/8/8/8/8/8/6NK'

'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
*/

function loadFen(fen) {
    let whitePieces = [];
    let blackPieces = [];
    let player = 'white';
    let castleRight = {
        'K': false,
        'Q': false,
        'k': false,
        'q': false,
    };
    let halfmove = 0;
    let turn = 0;
    fen = fen.split(' ');
    fen.forEach((seq, index) => {
        // Parse position
        if (index === 0) {
            let position = seq.split('/');
            for (let y in position) {
                let x = 0;
                for (let abscissa in position[y]) {
                    let pos = Number(y + x);
                    switch (position[y][abscissa]) {
                        case 'r':
                            blackPieces.push(new Rook('black', pos, [-10, -1, 1, 10]));
                            x ++;
                            break;
                        case 'R':
                            whitePieces.push(new Rook('white', pos, [-10, -1, 1, 10]));
                            x ++;
                            break;
                        case 'n':
                            blackPieces.push(new Knight('black', pos, undefined));
                            x ++;
                            break;
                        case 'N':
                            whitePieces.push(new Knight('white', pos, undefined));
                            x ++;
                            break;
                        case 'b':
                            blackPieces.push(new Bishop('black', pos, [-11, -9, 9, 11]));
                            x ++;
                            break;
                        case 'B':
                            whitePieces.push(new Bishop('white', pos, [-11, -9, 9, 11]));
                            x ++;
                            break;
                        case 'q':
                            blackPieces.push(new Queen('black', pos, [-11, -10, -9, -1, 1, 9, 10, 11]));
                            x ++;
                            break;
                        case 'Q':
                            whitePieces.push(new Queen('white', pos, [-11, -10, -9, -1, 1, 9, 10, 11]));
                            x ++;
                            break;
                        case 'k':
                            blackPieces.push(new King('black', pos, undefined));
                            x ++;
                            break;
                        case 'K':
                            whitePieces.push(new King('white', pos, undefined));
                            x ++;
                            break;
                        case 'p':
                            blackPieces.push(new Pawn('black', pos, undefined));
                            x ++;
                            break;
                        case 'P':
                            whitePieces.push(new Pawn('white', pos, undefined));
                            x ++;
                            break;
                        default:
                            x = x + parseInt(position[y][abscissa]);
                            break;
                    }
                }
            }
        } 
        // Parse player
        else if (index === 1) {
            if (seq === 'b' || seq === 'B') {
                player = 'black';
            }    
        } 
        // Parse castle rights
        else if (index === 2) {
            if (seq !== '-') {
                for (let char of seq) {
                    castleRight[char] = true;
                }
            }
            for (let [key, value] of Object.entries(castleRight)) {
                if (!value) {
                    if (key === 'K') {
                        let king = findPiecesByType(whitePieces, 'king')[0];
                        king.setShortCastle(false);
                    } else if (key === 'Q') {
                        let king = findPiecesByType(whitePieces, 'king')[0];
                        king.setLongCastle(false);
                    } else if (key === 'k') {
                        let king = findPiecesByType(blackPieces, 'king')[0];
                        king.setShortCastle(false);
                    } else if (key === 'q') {
                        let king = findPiecesByType(blackPieces, 'king')[0];
                        king.setLongCastle(false);
                    } 
                }
            }
        } 
        // Parse en passant
        else if (index === 3) {
            if (seq !== '-') {
                let digits = '87654321';
                let letters = 'abcdefghi';
                let x = letters.indexOf(seq[0]);
                let y = digits.indexOf(seq[1]);
                let piece;
                if (player === 'white') {
                    y ++;
                    piece = findColoredPieceByPos(blackPieces, fromCoordinatesToPos(x, y));
                } else {
                    y --;
                    piece = findColoredPieceByPos(whitePieces, fromCoordinatesToPos(x, y));
                }
                piece.setEnPassant(true);
            }
        }
        // Parse halfmouve count
        else if (index === 4) {
            halfmove = parseInt(seq);
        }
        // Parse turn count
        else if (index === 5) {
            turn = parseInt(seq);
        }
    });
    if (fen.length !== 1) {
        if (fen[1] === 'b' || fen[1] === 'B') {
            player = 'black';
        }
    }
    return [whitePieces, blackPieces, player, halfmove, turn];
}

function createFen() {
    let fen = '';
    let pieceToBeTakenEnPassant;
    let pieces = {
        'rook': 'r',
        'knight': 'n',
        'bishop': 'b',
        'queen': 'q',
        'king': 'k',
        'pawn': 'p',
    };
    for (let y = 0; y < 8; y++) {
        let gap = 0;
        for (let x = 0; x < 8; x++) {
            let pos = fromCoordinatesToPos(x, y);
            let piece = findPieceByPos(pos);
            if (!piece) {
                gap ++;
            } else {
                if (gap !== 0) {
                    fen += String(gap);
                    gap = 0;
                }
                let type = piece.getType();
                let color = piece.getColor();
                let symbol = pieces[type];
                fen += `${color === 'white' ? symbol.toUpperCase() : symbol}`;
                if (type === 'pawn' && piece.getEnPassant()) {
                    let lastMove = piece.getLastMove()
                    pieceToBeTakenEnPassant = (lastMove[0] + lastMove[1]) / 2;
                }
            }
        }
        if (gap !== 0) {
            fen += String(gap);
        }
        if (y != 7) {
            fen += '/';
        }
    }
    // adding the player turn
    fen += ` ${currentPlayer == 'white' ? 'w': 'b'}`;
    // adding castle right
    let canCastle = false;
    fen += ' ';
    for (let color of ['white', 'black']) {
        let whiteKing = findPiecesByType(piecesArray[color], 'king')[0];
        let [short, long] = whiteKing.getCastleRights();
        if (short) {
            fen += color === 'white' ? 'K': 'k';
            canCastle = true;
        }
        if (long) {
            fen += color === 'white' ? 'Q': 'q';
            canCastle = true;
        }
    }
    if (!canCastle) {
        fen += '-';
    }
    // add if en passant is possible
    if (typeof(pieceToBeTakenEnPassant) === 'number') {
        fen += ` ${fromPosToSquare(pieceToBeTakenEnPassant)}`;
    } else {
        fen += ' -';
    }
    // add half move count
    fen += ` ${halfMoveCount}`;
    // add turn count
    fen += ` ${turnCount}`; 
    return fen;
}