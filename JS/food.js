class Food {
    constructor(foodId, x = 0, y = 5) {
        this._foodId = foodId;
    }

    get foodId() {
        return this._foodId;
    }

    set foodId(foodId) {
        this._foodId = foodId;
    }

    toString() {
        return this.foodId.toString();
    }
}