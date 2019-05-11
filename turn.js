class Turn {

    constructor(token, x, y, symbol) {
        this.currentPos = {
            x: token.getX(),
            y: token.getY()
        };
        this.newPos = {
            x: x,
            y: y
        };
        this.tokenNumber = token.getNumber();
        this.symbol = symbol;
        this.forbidden = false;
    }

    getCurrentX() {
        return this.currentPos.x;
    }

    getCurrentY() {
        return this.currentPos.y;
    }

    getNewX() {
        return this.newPos.x;
    }

    getNewY() {
        return this.newPos.y;
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