var kt = false;
function confirmDelete() {
    if (confirm('Are u sure want to delete this item?')) {
        kt = true;
    }else{
        kt = false;
    }
}


$(document).ready(function () {
    $(".deleteCate").click(function () {
        confirmDelete();
        if(kt == true) {
            var id = $(this).attr('id-delete');
            var _csrf = $(this).attr('csrf');
            $.ajax({
                url: '/admin/categories/delete/' + id,
                type: 'DELETE',
                data: {_csrf: _csrf},
                success: function (data) {
                    if (data === 'ok') {
                        $('tr#' + id).remove();
                    }
                }
            });
        }
    });

    $(".deleteProduct").click(function () {
        confirmDelete();
        if(kt == true) {
            var id = $(this).attr('id-delete');
            var _csrf = $(this).attr('csrf');
            $.ajax({
                url: '/admin/products/delete/' + id,
                type: 'DELETE',
                data: {_csrf: _csrf},
                success: function (data) {
                    if (data === 'ok') {
                        $('tr#' + id).remove();
                    }
                }
            });
        }
    });

    $(".deleteUser").click(function () {
        confirmDelete();
        if(kt == true) {
            var id = $(this).attr('id-delete');
            var _csrf = $(this).attr('csrf');
            $.ajax({
                url: '/admin/users/delete/' + id,
                type: 'DELETE',
                data: {_csrf: _csrf},
                success: function (data) {
                    if (data === 'ok') {
                        $('tr#' + id).remove();
                    }
                }
            });
        }
    });
});
