import readline from 'readline-sync';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';

console.clear();
let board;
const winningCombinations = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8],
	[0, 3, 6], [1, 4, 7], [2, 5, 8],
	[0, 4, 8], [2, 4, 6]
];

function initializeBoard() {
	board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
}

function displayBoard() {
	console.clear();
	console.log(
		chalk.green(
		figlet.textSync('Tic Tac Toe', {
			horizontalLayout: 'default',
			verticalLayout: 'default'
		})
		)
	);
	console.log(`\n ${formatSymbol(board[0])} | ${formatSymbol(board[1])} | ${formatSymbol(board[2])}`);
	console.log('---+---+---');
	console.log(` ${formatSymbol(board[3])} | ${formatSymbol(board[4])} | ${formatSymbol(board[5])}`);
	console.log('---+---+---');
	console.log(` ${formatSymbol(board[6])} | ${formatSymbol(board[7])} | ${formatSymbol(board[8])}`);
	console.log('\n');
}

function formatSymbol(symbol) {
	if (symbol === 'X') {
		return chalk.yellow(symbol);
	} else if (symbol === 'O') {
		return chalk.red(symbol);
	}
	return symbol;
}

function checkWinner(player) {
	for (const [a, b, c] of winningCombinations) {
		if (board[a] === player && board[b] === player && board[c] === player) {
		return true;
		}
	}
	return false;
}

function isBoardFull() {
	return !board.some(cell => !isNaN(cell));
}

function makeMove(player, position) {
	if (board[position - 1] === 'X' || board[position - 1] === 'O') {
		console.log('Ungültige Eingabe. Das Feld ist bereits belegt.');
		return false;
	}
	board[position - 1] = player;
	return true;
}

function computerMove() {
	const emptyCells = board.filter(cell => !isNaN(cell));
	const randomIndex = Math.floor(Math.random() * emptyCells.length);
	return emptyCells[randomIndex];
}

function displayTimer(seconds) {
	if (seconds === 4) {
		console.log(`Der Computer ist am Zug..`);
	} else if (seconds >= 2 && seconds <= 3) {
		console.log(`Verbleibende Zeit für den Computer: ${seconds} Sekunden`);
	} else {
		console.log(`Verbleibende Zeit für den Computer: ${seconds} Sekunde`);
	}
}

async function getPlayerName() {
	return inquirer
		.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'Wie ist dein Name?',
			},
		])
		.then((answers) => answers.name);
}

async function startGame() {
	console.log(
		chalk.green(
		figlet.textSync('Tic Tac Toe', {
			horizontalLayout: 'default',
			verticalLayout: 'default'
		})
		)
	);
	const playerName = await getPlayerName();
	console.log(`Hallo, ${playerName}!`);
	initializeBoard();
	displayBoard();
	let currentPlayer = 'Spieler';
	function playGame() {
		const playerMove = parseInt(readline.question(`${currentPlayer}, wähle ein Feld (1-9): `));
		if (isNaN(playerMove) || playerMove < 1 || playerMove > 9) {
			console.log('Ungültige Eingabe. Bitte wähle eine Zahl zwischen 1 und 9.');
			playGame();
			return;
		}
		if (makeMove(currentPlayer === 'Spieler' ? 'X' : 'O', playerMove)) {
			displayBoard();
			if (checkWinner(currentPlayer === 'Spieler' ? 'X' : 'O')) {
				console.log(`${playerName} du hast gewonnen! Herzlichen Glückwunsch!`);
				playAgain();
				return;
			}
			if (isBoardFull()) {
				console.log('Unentschieden! Das Spiel endet unentschieden.');
				playAgain();
				return;
			}
			currentPlayer = currentPlayer === 'Spieler' ? 'Computer' : 'Spieler';
			if (currentPlayer === 'Computer') {
				let timer = 4;
				const timerInterval = setInterval(() => {
					displayTimer(timer);
					timer--;
					if (timer < 0) {
						clearInterval(timerInterval);
						const computerChoice = computerMove();
						makeMove('O', computerChoice);
						displayBoard();
						if (checkWinner('O')) {
							console.log('Computer hat gewonnen! Der Computer gewinnt!');
							playAgain();
						} else if (isBoardFull()) {
							console.log('Unentschieden! Das Spiel endet unentschieden.');
							playAgain();
						} else {
							currentPlayer = 'Spieler';
							playGame();
						}
					}
				}, 1000);
			}
		}
	}
	function playAgain() {
		inquirer
		.prompt([
			{
			type: 'list',
			name: 'playAgain',
			message: 'Möchtest du eine weitere Runde spielen?',
			choices: ['Ja', 'Nein'],
			},
		])
		.then((answers) => {
			if (answers.playAgain === 'Ja') {
			initializeBoard();
			displayBoard();
			playGame();
			} else {
			console.log('Vielen Dank fürs Spielen. Bis zum nächsten Mal!');
			}
		});
	}
	playGame();
}

startGame();