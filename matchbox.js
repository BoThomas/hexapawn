class Matchbox {

    constructor(board) {
        if(Matchbox.count == undefined){
            Matchbox.count = 1;
        }
      	else{
        	Matchbox.count ++;
      	}
      	this.id = Matchbox.count;
        this.boardSnapshot = board.cloneToJsonObject();
        this.validTurns = [];
        this.calcValidTurns();        
    }

    calcValidTurns() {
    	let field = this.boardSnapshot.field;
    	let ownTokens = this.boardSnapshot.ownTokens;

        for (let i = 0; i < ownTokens.length; i++) {

            let token = ownTokens[i];
            let x = token.getX();
            let y = token.getY();
            
            //diagonallinks runter
            if (x > 0 && (field[x-1][y+1] != null && !field[x-1][y+1].getOwn())) {
                this.validTurns.push(new Turn(token.getNumber(), x, y, x-1, y+1, "↙"));
            }

            //runter
            if (field[x][y+1] == null) {
                this.validTurns.push(new Turn(token.getNumber(), x, y, x, y+1, "↓"));
            }

            //diaginalrechts runter
            if (x < field.length-1 && (field[x+1][y+1] != null && !field[x+1][y+1].getOwn())) {
                this.validTurns.push(new Turn(token.getNumber(), x, y, token.x+1, y+1, "↘"));
            }
        }
    }

    /*getTurn() {
        Math.floor(Math.random() * field.length)
    }*/

    getValidTurns() {
        return this.validTurns;
    }

    drawTurnsTo(matchbox, board) {

        let div = '<div class="box">';	//start box
        div += '<div class="headline">Matchbox' + this.id + '</div>'; //start/end headline
        div += '<table class="mbt'+ this.id +'"></table>' //start/end field-table
        div += '<div class="turns">' //start turns
        for (let i = 0; i < this.validTurns.length; i++) {
            let vt = this.validTurns[i];

            div += '<div class="turn"><div class="token own">⬤</div><div class="caption">' + vt.getTokenNumber() + '</div><div class="symbol ' + (vt.isForbidden() ? "forbidden" : "") + '">' + vt.getSymbol() + '</div></div>';
        }
        div += "</div>"; //end turns
        div += "</div>"; //end box
        $(div).appendTo(matchbox);

        Board.drawTo($("table.mbt"+this.id), this.boardSnapshot.field);
    }

    getOwnTokens() {
    	return this.boardSnapshot.ownTokens;
    }

    getEnemyTokens() {
    	return this.boardSnapshot.enemyTokens;
    }

}


class Turn {

    constructor(tokenNumber, cX, cY, nX, nY, symbol) {
        this.currentPos = {
            x: cX,
            y: cY
        };
        this.newPos = {
            x: nX,
            y: nY
        };
        this.tokenNumber = tokenNumber;
        this.symbol = symbol;
        this.forbidden = false;
    }

    forbid() {
        this.forbidden = true;
    }

    isForbidden() {
        return this.forbidden;
    }

    getTokenNumber() {
        return this.tokenNumber;
    }

    getSymbol() {
        return this.symbol;
    }
}

//zufällig eine Aktion auswählen

//zuletzt gewählte Aktion entfernen (falls es nicht die einzig verfügbare war)


//alle zustände durchgehen
    //ist passend zu aktuellem zustand?
//wenn keine passt -> neue matchbox