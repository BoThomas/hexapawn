$(document).ready(function() {
	
	const SIZE = 3;

	let board;
	let matchboxes = [];
	let gameRunning;
	let currentTurnOwn;
	let lastBotTurn = null;
	let selection; //save selected token
	let matchingBox; //current matchbox

	initGame();
	updateMatchboxes();

	//#########################
	
	$(".field").on("click", "td", function() {

		if (!gameRunning) return;

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
			if (!checkWinCon()) {				
				selection = null;
				updateMatchboxes();	
				doBotMove();
			}
		}
   	});

   	$(".field .restart").on("click", function() {
   		initGame();
   	});


	//#########################
	
	function initGame() {
		$(".field .state").html("Game in progess!");
		$(".field .restart").hide();
		gameRunning = true;
		currentTurnOwn = false;
		board = new Board(SIZE);
		selection = null;
		matchingBox = null;
		//create initial Tokens
		for (let i = 0; i < SIZE; i++) {
			board.createToken(0+i,0,true);
			board.createToken(0+i,SIZE-1,false);
		}
		drawBoard();
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
		currentTurnOwn = true;
		let turn = matchingBox.getTurn();
		if (turn == null) { //no turn available
			console.log("Bot cant move. No valid and allowed turn left!")
			return; 
		}
		lastBotTurn = turn;
		let token = board.getTokenAt(turn.getCurrentX(), turn.getCurrentY());
		board.moveToken(token, turn.getNewX(), turn.getNewY());
		drawBoard();
		if (!checkWinCon()) {
			updateMatchboxes();
		}		
		currentTurnOwn = false;
	}

	function checkWinCon() {
		let win = Rulebook.checkGameWon(board, currentTurnOwn);
		if (win == null) return false;

		gameRunning = false;
		$(".field .state").html((win.own ? "Bot" : "Human") + " won the game! " + win.reason);
		let history = $(".field .history");
		if (history.html() == "") {
			history.append(win.own ? "B" : "H");
		}
		else {
			history.append(win.own ? ", B" : ", H");
		}
		$(".field .restart").css("display", "inline-block");

		if (!win.own) {
			lastBotTurn.forbid();
			drawMatchboxes();
		}
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