module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id) {
        var storedItem = this.items[id];
        if(!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.removeItem = function (id) {
        this.totalQty--;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.update = function (id, num) {
        if(num > this.items[id].qty){
            var x = num - this.items[id].qty;
            this.items[id].qty = num;
            this.items[id].price = this.items[id].item.price * num;
            this.totalPrice += (this.items[id].item.price * x);
        }else if(num < this.items[id].qty){
            var x = this.items[id].qty - num;
            this.items[id].qty = num;
            this.items[id].price = this.items[id].item.price * num;
            this.totalPrice -= (this.items[id].item.price * x);
        }
    };
    
    this.generateArray = function () {
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};