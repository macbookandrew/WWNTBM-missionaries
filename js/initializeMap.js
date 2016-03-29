// initialize map
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 35.3192571,
            lng: -81.6586981
        },
        zoom: 6
    });
}

// get all missionaries and add markers
jQuery(document).ready(function() {
    // get data from table
    var locations = [];
    jQuery(wwntbmMissionaries).each(function(key, val){
        var missionary = {
            'name'        : val.name,
            'link'        : val.link,
            'image'       : val.image,
            'latitude'    : val.lat,
            'longitude'   : val.lng
        };

        if ( val.lat && val.lng ) {
            locations.push(missionary);
        }
    });

    // iterate over array and add markers to map
    var infoWindow = new google.maps.InfoWindow({}),
        LatLngList = new Array();
    for (var i = 0; i < locations.length; i++) {
        var thisLocation = locations[i];

        // add pins
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(thisLocation.latitude, thisLocation.longitude),
            title: thisLocation.name,
            map: map
        });

        // add to latLngList
        LatLngList.push(new google.maps.LatLng(thisLocation.latitude, thisLocation.longitude));

        // add click listener
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                var thisLocation = locations[i];

                // set infoWindow content
                var infoWindowContent = '<h1><a href="' + thisLocation.link + '">' + thisLocation.name + '</a></h1>';
                if (thisLocation.image) {
                    infoWindowContent += '<p><a href="' + thisLocation.link + '">' + thisLocation.image + '</a></p>';
                }
                infoWindowContent += '<p><a href="' + thisLocation.link + '">More information&hellip;</a></p>';

                // display infoWindow
                infoWindow.setContent(infoWindowContent);
                infoWindow.open(map, marker);
            }
        })(marker, i));
    }

    // fit to bounds
    var bounds = new google.maps.LatLngBounds();
    for (var j in LatLngList) {
        bounds.extend(LatLngList[j]);
    }
    map.fitBounds(bounds);
});
