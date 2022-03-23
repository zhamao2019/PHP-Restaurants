
$(document).ready(function () {
    $.getScript("js/Config.js");
    $('#restaurant-info').css('display', 'none');
    $('#lblConfirmation').css('display', 'none');

    $('#drpRestaurant').on("focus", function () {
        showNameDropdownlist();
    });

    $('#drpRestaurant').on("change", function () {
        console.log("on change dropdown: " + this.value);

        if (this.value !== "-1") {
            $('#restaurant-info').css('display', 'block');
            $('#lblConfirmation').css('display', 'none');
            var selectedId = this.value;
            $.ajax({
                type: "GET",
                url: getDetailsUrl + selectedId,
                dataType: "json",
                success: function (restaurant)
                {
                    populateRestaurantData(restaurant);
                    for (var i = 0; i < $('#drpRestaurant option').length; i++) {
                        if (i == selectedId) {
                            $("#drpRestaurant option[value='" + i + "']").attr('selected', 'selected');

                        }
                    }
                },
                error: function (event, request, settings)
                {
                    window.alert('AjaxError' + ' : ' + settings);
                }
            });
        } else {
            $('#restaurant-info').css('display', 'none');
        }

    });

    $('#btnSave').on("click", function () {
        var restaurant = getRestaurantObjectFromPage();

        $.ajax({
            type: "POST",
            url: saveUrl,
            data: {
                index: $('#drpRestaurant').val(),
                restaurant: JSON.stringify(restaurant)
            },
            dataType: "json",
            success: function (restaurant)
            {
                populateRestaurantData(restaurant);
                $('#lblConfirmation').css('display', 'block');
                $('#lblConfirmation').text("restaurant has been succefully updated");

            },
            error: function (data, response, request, settings)
            {
                console.log("click save dropdown: " + $('#drpRestaurant').val());
                console.log("res" + response);
                console.log("data" + data);
                console.log("setting" + settings);
                console.log("reqest" + request);
            }
        });
    });


    function showNameDropdownlist() {
        $.ajax({
            type: "GET",
            url: restaurantUrl,
            dataType: "json",
            success: function (drpRestaurants) {
                //$('#drpRestaurant').empty();
                $('#drpRestaurant option:gt(0)').remove(); //remove all the options except the first option            
                $(drpRestaurants).each(function (index, value) {
                    $('#drpRestaurant').append("<option value=" + index + ">" + value + "</option>");
                });

            },
            error: function (response, data) {
                console.log("res" + response);
                console.log("data" + data);
            }
        });
    }
    ;

    function showRatingDropdownlist() {
        $.ajax({
            type: "GET",
            url: ratingsUrl,
            dataType: "json",
            success: function (drpRating) {
                $('#drpRating').empty();
                //$('#drpRating option:gt(0)').remove(); //remove all the options except the first option            
                $.each(drpRating, function (index, value) {
                    $('#drpRating').append("<option value=" + value + ">" + value + "</option>");
                });

            },
            error: function (data, status, response) {
                console.log(data, status);
                console.log("res" + response);
            }
        });
    }
    ;



    function populateRestaurantData(restaurant) {
        $('#txtStreetAddress').val(restaurant.address.street);
        $('#txtCity').val(restaurant.address.city);
        $('#txtProvinceState').val(restaurant.address.province);
        $('#txtPostalZipCode').val(restaurant.address.postalcode);
        $('#txtSummary').val(restaurant.summary);
        $('#drpRating').empty();
        $('#drpRating').append("<option value=" + parseInt(restaurant.rating) + ">" + parseInt(restaurant.rating) + "</option>");


        $('#drpRating').on("focus", function () {

            var rating = this.value;
            $('#drpRating').empty();

            var min = restaurant.ratingRange.min;
            var max = restaurant.ratingRange.max;
            for (var i = min; i <= max; i++) {
                $('#drpRating').append("<option value=" + i + ">" + i + "</option>");
            }
            ;
            // keep the original value selected
            $("#drpRating option[value='" + rating + "']").attr('selected', 'selected');
        });

    }
    ;


    function getRestaurantObjectFromPage()
    {
        var restaurant = new Object();
        var address = new Object();

        address.street = $('#txtStreetAddress').val();
        address.city = $('#txtCity').val();
        address.province = $('#txtProvinceState').val();
        address.postalcode = $('#txtPostalZipCode').val();
        restaurant.summary = $('#txtSummary').val();
        restaurant.rating = $('#drpRating').val();

        restaurant.address = address;

        return restaurant;
    }



});