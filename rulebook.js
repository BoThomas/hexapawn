class Rulebook {
	static calcValidTurns(board, own, token) { //board or board-snapchot, token can be undefined

		let validTurns = [];

		let field = board.field;
        let tokens = [];
        let symbol;
        let delta = own ? 1 : -1;

        if (typeof token == "undefined") { //calc valid turns for all own/enemy tokens
    		
    		if (own) {
    			tokens = board.ownTokens;
    		}
    		else {
    			tokens = board.enemyTokens;
    		}
        }
        else { //calc valid turns for one specific token
            tokens.push(token);
        }

        for (let i = 0; i < tokens.length; i++) {

            let x = tokens[i].getX();
            let y = tokens[i].getY();
            
            //diagonallinks runter/hoch
            if (x > 0 && field[x-1][y+delta] != null && own != field[x-1][y+delta].isOwn()) {
                symbol = own ? "↙" : "↖";
                validTurns.push(new Turn(tokens[i], x-1, y+delta, symbol));
            }

            //gerade runter/hoch
            if (field[x][y+delta] == null) {
                symbol = own ? "↓" : "↑";
                validTurns.push(new Turn(tokens[i], x, y+delta, symbol));
            }

            //diaginalrechts runter/hoch
            if (x < field.length-1 && field[x+1][y+delta] != null && own != field[x+1][y+delta].isOwn()) {
                symbol = own ? "↘" : "↗";
                validTurns.push(new Turn(tokens[i], tokens[i].x+1, y+delta, symbol));
            }
        }
        return validTurns;
	}

    static checkGameWon(board, lastTurnOwn) {
        //tokens dead
        if (board.getOwnTokens().length == 0) return {"own": false, "reason": "Bot has no Tokens left."};
        if (board.getEnemyTokens().length == 0) return {"own": true, "reason": "Human has no Tokens left."};

        //player on endzone
        let field = board.getField();
        let yMax = field[0].length;
        for (let x = 0; x < field.length; x++) {
            if (field[x][0] != null && !field[x][0].isOwn()) {
                return {"own": false, "reason": "Human reached endzone."};
            }
            if (field[x][yMax] != null && field[x][0].isOwn()) {
                return {"own": true, "reason": "Bot reached endzone."};
            }
        }
        
        //player blocked
        if (!lastTurnOwn && Rulebook.calcValidTurns(board, true).length == 0) {
            return {"own": false, "reason": "Bot is blocked."};
        }
        if (lastTurnOwn && Rulebook.calcValidTurns(board, false).length == 0) {
            return {"own": true, "reason": "Human is blocked."};
        }

        return null;
    }

    /*static isMoveValid(field, token, x, y) {
        let xMovement = token.getX() - x;
        let yMovement = token.getY() - y;
        
        if (token.isOwn()) { //spielt runter
            if (yMovement != -1) return false; //Bewegung geht nicht genau ein Feld nach unten
        }
        else { //spielt hoch
            if (yMovement != 1) return false; //Bewegung geht nicht genau ein Feld hoch
        }

        if (xMovement < -1 || xMovement > 1) return false; //Bewegung ist größer 1 nach rechts oder links

        switch (xMovement) {
            case -1: //diagonal rechts runten/hoch
                if (token.getX() == field.length-1) return false; //linke Wand im Weg
                if (field[x][y] == null || (token.isOwn() == field[x][y].isOwn())) return false; //kein Gegner oder eigener Spieler im Weg
                break;
            case 0: //runter/hoch
                if (field[x][y] != null) return false; //Feld nicht frei
                break;
            case 1: //diagonal links runter/hoch
                if (token.getX() == 0) return false; //rechte Wand im Weg
                if (field[x][y] == null || (token.isOwn() == field[x][y].isOwn())) return false; //kein Gegner oder eigener Spieler im Weg
                break;
        }
        return true;
    }*/
}