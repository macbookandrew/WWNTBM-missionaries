// initialize map
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 1
    });
}

// get all missionaries and add markers
(function($){
    $(document).ready(function() {
        // get data from table
        var locations = [],
            markers = [];

        $(wwntbm.missionaries).each(function(key, val){
            var missionary = {
                'name'          : val.name,
                'link'          : val.link,
                'image'         : val.image,
                'status'        : val.status,
                'typeString'    : val.type_string,
                'statusString'  : val.status_string,
                'latitude'      : val.lat,
                'longitude'     : val.lng
            };

            if ( val.lat && val.lng ) {
                locations.push(missionary);
            }
        });

        // Iterate over array and add markers to map.
        var infoWindow = new google.maps.InfoWindow({});
        for (var i = 0; i < locations.length; i++) {
            var thisLocation = locations[i];

            // Add pins.
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(thisLocation.latitude, thisLocation.longitude),
                title: thisLocation.name,
                map: map
            });

            // Add to markers array.
            markers.push(marker);

            // Add click listener.
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    var thisLocation = locations[i];

                    // set infoWindow content
                    var infoWindowContent = '<h1><a href="' + thisLocation.link + '">' + thisLocation.name + '</a></h1>';
                    if (thisLocation.image) {
                        infoWindowContent += '<p><a href="' + thisLocation.link + '">' + thisLocation.image + '</a></p>';
                    }
                    if (thisLocation.typeString || thisLocation.statusString) {
                        infoWindowContent += '<p>';
                        if (thisLocation.typeString) {
                            infoWindowContent += '<span class="field-of-service">' + thisLocation.typeString + '</span>';
                        }
                        if (thisLocation.statusString && thisLocation.status[0].name !== "Field") {
                            infoWindowContent += '<span class="field-of-service">' + thisLocation.statusString + '</span>';
                        }
                        infoWindowContent += '</p>';
                    }
                    infoWindowContent += '<p><a href="' + thisLocation.link + '">More information&hellip;</a></p>';

                    // display infoWindow
                    infoWindow.setContent(infoWindowContent);
                    infoWindow.open(map, marker);
                }
            })(marker, i));
        }

        // Add marker clustering.
        var markerCluster = new MarkerClusterer(map, markers, {
            imagePath: wwntbm.markerUrl
        });
    });
}(jQuery));