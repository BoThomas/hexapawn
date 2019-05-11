$(document).ready(function() {
	
	const SIZE = 3;

	let board;
	let matchboxes;
	let selection; //save selected token
	let matchingBox; //current matchbox

	initGame();
	drawBoard();
	updateMatchboxes();

	//#########################
	
	$(".field").on("click", "td", function() {

		let x = parseInt($(this).attr("x"));
		let y = parseInt($(this).attr("y"));

		//### select ###
		if (selection == null) {
			let s = board.getTokenAt(x, y);
			if (s != null && !s.isOwn()) {
				selection = s;
				$(this).addClass("selected");
				let validTurns = Rulebook.calcValidTurns(board, false, selection);
				for (let i = 0; i < validTurns.length; i++) {
					let tdX = validTurns[i].getNewX();
					let tdY = validTurns[i].getNewY();
					let td = $(".field td[x='"+ tdX +"'][y='"+ tdY +"']");
					td.addClass("valid");
				}
			}

		//### deselect ###
		} else if (selection.getX() == x && selection.getY() == y) {
			$(".field td").removeClass("selected").removeClass("valid");
			selection = null;

		//### move ###
		} else if ($(this).hasClass("valid")) {
			board.moveToken(selection, x, y);
			drawBoard();
			updateMatchboxes();
			if (!checkWinCon()) {
				selection = null;
				doBotMove();
			}
		}
   	});


	//#########################
	
	function initGame() {
		board = new Board(SIZE);
		matchboxes = [];
		selection = null;
		matchingBox = null;
		//create initial Tokens
		for (let i = 0; i < SIZE; i++) {
			board.createToken(0+i,0,true);
			board.createToken(0+i,SIZE-1,false);
		}
	}
	
	function drawBoard() {
		Board.drawTo($(".field table"), board.getField());
	}

	//check if Matchbox exists/create it/draw it
	function updateMatchboxes() {
		matchingBox = getMatchingBox();
		if (matchingBox == null) {
			matchingBox = new Matchbox(board);
			matchboxes.push(matchingBox);
		}
		drawMatchboxes();
	}

	function doBotMove() {
		let turn = matchingBox.getTurn();
		if (turn == null) return; //no turn available
		let token = board.getTokenAt(turn.getCurrentX(), turn.getCurrentY());
		board.moveToken(token, turn.getNewX(), turn.getNewY());
		drawBoard();
		updateMatchboxes();
		checkWinCon();
	}

	function checkWinCon() {
		let win = Rulebook.checkGameWon(board);
		if (win == null) return false;
		alert((win.own ? "Bot" : "Human") + " won the game! " + win.reason);
		return true;
	}

	function getMatchingBox() {
		for (let m = 0; m < matchboxes.length; m++) { //all matchboxes
			if (board.equals(matchboxes[m].getBoardSnapshot())) {
				return matchboxes[m];
			}
		}
		return null;
	}

	function drawMatchboxes() {
		let mb = $(".matchbox");
		mb.empty();
		for (let i = 0; i < matchboxes.length; i++) {
			matchboxes[i].drawTurnsTo(mb, board);
		}
	}

});