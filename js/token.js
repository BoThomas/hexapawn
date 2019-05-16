class Token {
	constructor(x, y, own) {
        this.x = x;
        this.y = y;
        this.own = own;
        this.number = x;
    }

    setX(x) {
    	this.x = x;
    }

    setY(y) {
    	this.y = y;
    }

    getX() {
    	return this.x;
    }

    getY() {
    	return this.y;
    }

    isOwn() {
    	return this.own;
    }

    getNumber() {
    	return this.number;
    }

    equals(token) {
    	return (
    		this.x == token.x &&
    		this.y == token.y &&
    		this.own == token.own &&
    		this.number == token.number
    	); 
    }
}