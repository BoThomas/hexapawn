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

    moveToken(token, x, y) {
    	this.field[token.getX()][token.getY()] = null;
    	token.setX(x);
    	token.setY(y);

        if (this.field[x][y] != null) { //delete former Token
            let oldToken = this.field[x][y];
            if (oldToken.isOwn()) {
                this.ownTokens.splice(this.ownTokens.indexOf(oldToken), 1);
            }
            else {
                this.enemyTokens.splice(this.enemyTokens.indexOf(oldToken), 1);
            }   
        }

    	this.field[x][y] = token;
    	return true;
    }   

    getTokenAt(x, y) {
        return this.field[x][y];
    }

    isOwnTokens() {
    	return this.ownTokens;
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
    				tableData = '<td x="' + x + '" y="' + y + '"><div class="token ' + (token.isOwn() ? "own" : "enemy") + '">⬤</div><div class="caption">' + token.getNumber() + '</div></td>'; //◯
                }    
                row += tableData;			
    		}
    		row += "</tr>";
    		$(row).appendTo(table);
    	}
	}

    cloneToJsonObject() {
        return {
            "field": $.extend(true, [], this.field), //array deep copy
            "ownTokens": this.ownTokens.map(a => Object.assign(new Token(), a)), //object-array deep copy
            "enemyTokens": this.enemyTokens.map(a => Object.assign(new Token(), a))
        }
    }

    equals(board) { //board or board-snapshot

        let to_own = board.ownTokens;
        let to_ene = board.enemyTokens;

        //compare length of enemy and own tokens
        if (this.ownTokens.length != to_own.length) return false;
        if (this.enemyTokens.length != to_ene.length) return false;

        //campare tokens (faster then comparing field)
        for (let i = 0; i < this.ownTokens.length; i++) {
            if (!this.ownTokens[i].equals(to_own[i])) return false;
        }
        for (let i = 0; i < this.enemyTokens.length; i++) {
            if (!this.enemyTokens[i].equals(to_ene[i])) return false;
        }
        return true;
    }
}