$(document).ready(function () {
    $(".cart-quantity").change(function () {
        var productId = $(this).attr('id-product');
        var qty = $(this).attr('qty-value')
        var old_totalPrice = $("#cart-totalPrice").text();
        var item_price = $("tr#"+productId).find("span#"+productId);
        var old_cart_price = $("tr#"+productId).find("span."+productId);
        if($(this).val() <= 0){
            alert('Product quantity must be > 0');
            $(this).val(qty);
            return;
        }else{
            var num = $(this).val();
            $.ajax({
                url: '/update/'+productId+'/'+num,
                type: 'GET',
                success: function (data) {
                    if(data === 'ok'){
                        $(this).val(num);
                        var price = parseInt(item_price.text()) * num;
                        $("#cart-totalPrice").text(parseInt(old_totalPrice) + (price - parseInt(old_cart_price.text())));
                        $("tr#"+productId).find("span."+productId).text(price);
                    }
                }
            });
        }
    });
});
