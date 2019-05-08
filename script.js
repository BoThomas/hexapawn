$(document).ready(function() {
	
	const SIZE = 3;

	let board = new Board(SIZE);
	let matchboxes = [];

	//create initial Tokens
	for (let i = 0; i < SIZE; i++) {
		board.createToken(0+i,0,true);
		board.createToken(0+i,SIZE-1,false);
	}

	//draw board
	Board.drawTo($(".field table"), board.getField());

	//check if Matchbox for the current board-situation exists
	let matchingBox = getMatchingBox();

	//create new Matchbox
	if (matchingBox == null) {
		matchboxes.push(new Matchbox(board));
	}

	//draw Matchboxes
	drawMatchboxes();

	//#########################
	
	$(".field").on("click", "td", function() {

		let x = parseInt($(this).attr("x"));
		let y = parseInt($(this).attr("y"));

    	if (board.moveToken(board.getField(), board.getEnemyTokens()[0] /*TODO: nicht hardcoden*/, x, y)) {
	    	Board.drawTo($(".field table"), board.getField());
	    	matchingBox = getMatchingBox();
	    	if (matchingBox == null) {
				matchboxes.push(new Matchbox(board));
			}
			drawMatchboxes();
		}
		else {
			console.log("Error moving Token. Target-Field not allowed!");
		}
   	});


	//#########################


	function getMatchingBox() {
		let matchingBox = null;

		let ownTokens = board.getOwnTokens();
		let enemyTokens = board.getEnemyTokens();

		for (let m = 0; m < matchboxes.length; m++) { //all matchboxes
			
			let difference = false;
			
			for (let t = 0; t < ownTokens.length; t++) { //all current own tokens
				let mt = matchboxes[m].getOwnTokens();
				if (ownTokens.length != mt.length || !ownTokens[t].equals(mt[t])) {
					difference = true;
					break;
				}
				/*for (let i = 0; i < mt.length; i++) {
					if (!mt[i].equals(ownTokens[t])) {
						difference = true;
						break;
					}
				}*/
			}

			for (let t = 0; t < enemyTokens.length; t++) { //all current enemy tokens
				let mt = matchboxes[m].getEnemyTokens();
				if (enemyTokens.length != mt.length || !enemyTokens[t].equals(mt[t])) {

					difference = true;
					break;
				}
				/*for (let i = 0; i < mt.length; i++) {
					if (!mt[i].equals(enemyTokens[t])) {
						difference = true;
						break;
					}
				}*/
			}
			
			if (!difference) {
				matchingBox = matchboxes[m];
				break;
			}
		}
		return matchingBox;
	}

	function drawMatchboxes() {
		let mb = $(".matchbox");
		mb.empty();
		for (let i = 0; i < matchboxes.length; i++) {
			matchboxes[i].drawTurnsTo(mb, board);
		}
	}

});