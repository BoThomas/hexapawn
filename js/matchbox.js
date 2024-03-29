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
        this.validTurns = Rulebook.calcValidTurns(this.boardSnapshot, true);
    }

    getTurn() {
        let allowedValidTurns = [];
        for (let i = 0; i < this.validTurns.length; i++) {
            if (!this.validTurns[i].isForbidden()) allowedValidTurns.push(this.validTurns[i]);
        }
        if (allowedValidTurns.length == 0) {
            return null;
        }
        else {
            return allowedValidTurns[Math.floor(Math.random() * allowedValidTurns.length)];
        }
    }

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
            div += '<div class="turn"><div class="token own">⬤</div><div class="caption">' + vt.getTokenNumber() + '</div><div class="symbol ' + (vt.isForbidden() ? "forbidden" : "") + '"><img src="img/' + vt.getSymbol() + '.svg"></div></div>';
        }
        div += "</div>"; //end turns
        div += "</div>"; //end box
        $(div).appendTo(matchbox);

        Board.drawTo($("table.mbt"+this.id), this.boardSnapshot.field);
    }

    getBoardSnapshot() {
        return this.boardSnapshot;
    }
}

//zufällig eine Aktion auswählen

//zuletzt gewählte Aktion entfernen (falls es nicht die einzig verfügbare war)