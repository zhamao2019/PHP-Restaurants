<?php
    $path = "../Data/restaurant_reviews.xml";
    $restaurantlist = simplexml_load_file($path);
    $drpRestaurants = [];
    $jsonStr = json_encode(null);

    if (isset($_GET["action"]) && $_GET["action"] == "dropdownlist" ){

        foreach($restaurantlist as $r)
        {
            $drpRestaurants[] = (string)$r->name;
        }
        $jsonStr = json_encode($drpRestaurants);
    }
    else if (isset($_GET["action"]) && $_GET["action"] == "getDetails" && isset($_GET["id"]) && $_GET["id"] !== "" )
    {
        $id = (int)$_GET["id"];
        $selectedRestaurant = $restaurantlist->restaurant[$id];

        $selectedRestaurant->ratingRange->max = strval($selectedRestaurant->rating['max'][0]);
        $selectedRestaurant->ratingRange->min = strval($selectedRestaurant->rating['min'][0]);        
       
        $jsonStr = json_encode($selectedRestaurant);
}
    else if(isset($_GET["action"]) && $_GET["action"] == "save" && isset($_POST["restaurant"]) && $_POST["restaurant"] !== ""){
        $updatedRestaurant = json_decode($_POST["restaurant"]);
        $index = (int)$_POST["index"];
        $restaurant = $restaurantlist->restaurant[$index];
        
    
        $restaurant->address->street = $updatedRestaurant->address->street;
        $restaurant->address->city = $updatedRestaurant->address->city;
        $restaurant->address->province = $updatedRestaurant->address->province;
        $restaurant->address->postalcode = $updatedRestaurant->address->postalcode;
        $restaurant->summary = $updatedRestaurant->summary;
        $restaurant->rating = $updatedRestaurant->rating;

        $restaurantlist->asXML($path);
        
        $restaurant->ratingRange->max = strval($restaurant->rating['max'][0]);
        $restaurant->ratingRange->min = strval($restaurant->rating['min'][0]);     
        $jsonStr = json_encode($restaurant);
    }


    echo $jsonStr;

