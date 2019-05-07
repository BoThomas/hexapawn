class Board {
	constructor(size) {
        let field = new Array(size).fill(null);
        for (let i = 0; i < size; i++) {
  			field[i] = new Array(size).fill(null);
		}
		this.field = field;
		this.ownTokens = [];
		this.enemyTokens = [];
    }

    getField() {
    	return this.field;
    }

    createToken(x, y, own) {
    	let token = new Token(x, y, own);
    	if (own) {
    		this.ownTokens.push(token);
    	}
    	else{
    		this.enemyTokens.push(token);
    	}
    	this.field[x][y] = token;
    	return token;
    }

    moveToken(field, token, x, y) {
    	if (this.isMoveValid(field, token, x, y)) {
	    	this.field[token.getX()][token.getY()] = null;
	    	token.setX(x);
	    	token.setY(y);
	    	this.field[x][y] = token;
	    	return true;
	    }
	    else {
	    	return false;
	    }
    }

    removeToken(token) {
    	this.field[token.getX()][token.getY()] = null;

    	let own = token.getOwn();
    	if (own) {
			delete this.ownTokens[token];
    	}
    	else {
    		delete this.enemyTokens[token];
    	}    	
    }

    getOwnTokens() {
    	return this.ownTokens;
    }

    getEnemyTokens() {
    	return this.enemyTokens;
    }

    static drawTo(table, field) {

    	table.empty();

    	for (let y = 0; y < field[0].length; y++) {

    		let row = "<tr>";
    		let tableData = "";

    		for (let x = 0; x < field.length; x++) {

    			let token = field[x][y];
    			if (token == null) {
    				tableData = '<td x="' + x + '" y="' + y + '"></td>'
    			}
    			else {
    				tableData = '<td x="' + x + '" y="' + y + '"><div class="token ' + (token.getOwn() ? "own" : "enemy") + '">⬤</div><div class="caption">' + token.getNumber() + '</div></td>'; //◯
                }    
                row += tableData;			
    		}
    		row += "</tr>";
    		$(row).appendTo(table);
    	}
	}

	isMoveValid(field, token, x, y) {
	
		let xMovement = token.getX() - x;
		let yMovement = token.getY() - y;
		console.log(xMovement, yMovement);
		
		if (token.getOwn()) { //spielt runter
			if (yMovement != -1) return false; //Bewegung geht nicht genau ein Feld nach unten
		}
		else { //spielt hoch
			if (yMovement != 1) return false; //Bewegung geht nicht genau ein Feld hoch
		}

		if (xMovement < -1 || xMovement > 1) return false; //Bewegung ist größer 1 nach rechts oder links

		switch (xMovement) {
			case -1: //diagonal rechts runten/hoch
				if (token.getX() == field.length-1) return false; //linke Wand im Weg
				if (field[x][y] == null || (token.getOwn() == field[x][y].getOwn())) return false; //kein Gegner oder eigener Spieler im Weg
				break;
			case 0:	//runter/hoch
				if (field[x][y] != null) return false; //Feld nicht frei
				break;
			case 1:	//diagonal links runter/hoch
				if (token.getX() == 0) return false; //rechte Wand im Weg
				if (field[x][y] == null || (token.getOwn() == field[x][y].getOwn())) return false; //kein Gegner oder eigener Spieler im Weg
				break;
		}
		return true;
	}
}