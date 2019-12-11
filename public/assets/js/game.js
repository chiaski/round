/* LOAD MAP */
function _initialize() {
    var fenway = {
        lat: 41.309327,
        lng: -72.929250
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: fenway,
        zoom: 14
    });

    var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('map'), {
            position: fenway,
            pov: {
                heading: 34,
                pitch: 10,

            },
            linksControl: false,
            panControl: true
        });
    map.setStreetView(panorama);
}



// user prompts
var prompts = [
    "Tell me about where you felt you could die.",
    "Where's the closest place to home you have now?",
    "Somewhere you want to be.",
    "Where were you yesterday?",
    "Where do you want to be tomorrow?",
    "Where you think they could be?",
    "Where you would be fine with losing everything"
];


var letters = (function () {


    // official instances
    var map;
    var panorama;
    var sv;

    var curr_location;
    var curr_location_name = $("#loc_name").val();


    /* LOAD MAP */
    function initialize() {
        var fenway = {
            lat: 41.309327,
            lng: -72.929250
        };
        letters.map = new google.maps.Map(document.getElementById('map'), {
            center: fenway,
            zoom: 14
        });

        letters.panorama = new google.maps.StreetViewPanorama(
            document.getElementById('map'), {
                position: fenway,
                pov: {
                    heading: 34,
                    pitch: 10,

                },
                linksControl: false,
                panControl: true
            });


        letters.sv = new google.maps.StreetViewService();
        letters.panorama.addListener('position_changed', function () {
            console.log(letters.panorama.getPosition());

            letters.curr_location = {
                lat: letters.panorama.getPosition().lat(),
                lng: letters.panorama.getPosition().lng()

            };

            $("#loc_lat").text(letters.curr_location.lat);
            $("#loc_lng").text(letters.curr_location.lng);

            $("#loc_lat").text(function () {
                return $(this).text().substring(0, 7);
            });
            $("#loc_lng").text(function () {
                return $(this).text().substring(0, 8);
            });

        });
        
        $(".time").fadeIn("slow");

        letters.map.setStreetView(letters.panorama);
    }


    /* MAIN */

    function setLoc(location, view) {

        console.log(location);
        console.log(view);

        letters.curr_location = {
            lat: location.lat,
            lng: location.lng
        };
        console.log(letters.curr_location);


        // letters.map.setCenter(new google.maps.LatLng(location.lat, location.lng));

        /* letters.map.setCenter({
            lat: location.lat,
            lng: location.lng
        });
        
        letters.panorama.setPosition({
            lat: location.lat,
            lng: location.lng
        });*/


        $("#loc_name").text(location.name);
        delete location.name;

        letters.sv.getPanorama({
            location: location,
            radius: 300
        }, processSV);

        function processSV(data, status) {
            if (status === 'OK') {
                console.log("nice");
            }


            console.log(data);
            letters.panorama.setPosition(data.location.latLng);
            letters.panorama.setPano(data.location.Pano);
            letters.panorama.setPov({
                heading: view.heading,
                pitch: view.pitch
            });

            $("#loc_lat").text(letters.curr_location.lat);
            $("#loc_lng").text(letters.curr_location.lng);

            $("#loc_lat").text(function () {
                return $(this).text().substring(0, 7);
            });
            $("#loc_lng").text(function () {
                return $(this).text().substring(0, 8);
            });

            letters.panorama.setVisible(true);
        }


        //letters.map.setStreetView(letters.panorama);
    }


    /* ACTS */

    function _saveImage() {

        /* Append image to a div */
        domtoimage.toPng(document.getElementById('paint')).then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            $("#photo").append(img);
        }).catch(function (error) {
            console.error('oops, something went wrong!', error);
        });

        sendLetter();

    }


    function _findPlace() {

        var geocoder = new google.maps.Geocoder();

        var address = document.getElementById("field_loc").value;

        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                const place = results[0];
                const place_loc = place.geometry.viewport;

                console.log(place);

                // change name so that it focuses on neighbourhood, city, or route //ignore street number   

                var place_center = {
                    lat: place_loc.pa.h,
                    lng: place_loc.ka.h
                };

                letters.curr_location = {
                    lat: place_loc.pa.h,
                    lng: place_loc.ka.h
                };

                console.log(place_center);

                $("#loc_name").text(place.address_components[0].short_name);
                $("#loc_lat").text(place_center.lat);
                $("#loc_lng").text(place_center.lng);

                /* Search Street View */

                letters.map.setCenter(place_center);

                var panoRequest = {
                    location: place_center,
                    preference: google.maps.StreetViewPreference.NEAREST,
                    radius: 200,
                    source: google.maps.StreetViewSource.OUTDOOR
                }

                var findPanorama = function (radius) {
                    panoRequest.radius = radius;

                    letters.sv.getPanorama(panoRequest, function (panoData, status) {
                            if (status === google.maps.StreetViewStatus.OK) {

                                letters.panorama = new google.maps.StreetViewPanorama(
                                    document.getElementById('map'), {
                                        pano: panoData.location.pano
                                    });


                            } else {
                                findPanorama(radius + 50);
                            }
                        }

                    )
                };

                findPanorama(200);




                /*
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('map'), {
                      position: place_center,
                      pov: {
                        heading: 34,
                        pitch: 10
                      }
                    });

                map.setStreetView(panorama); */

            }
        });

    }


    function sendLetter() {

        let map_heading = letters.panorama.getPov().heading;
        let map_pitch = letters.panorama.getPov().pitch;
        let time = Math.floor(Date.now() / 1000);

        // update letter count in database
        database.ref('letters-overview/count').transaction(function (counts) {

            let new_count = counts + 1;
            console.log("new:" + new_count);

            console.log(new_count);

            database.ref('letters/' + new_count + "").set({
                id: new_count,
                time: time,
                text: $("#my_words").val(),
                location: {
                    lat: letters.curr_location.lat,
                    lng: letters.curr_location.lng,
                    name: $("#loc_name").text()
                },
                view: {
                    heading: map_heading,
                    pitch: map_pitch
                }

            });

            return new_count;

        });



        console.log("\nsent!");
    }




    /* FIND LETTER */

    // find letter brings you to a space somewhere in the world. this is a core concept borrowed from space email.

    function findLetter() {
        let letter_count;
        let rand;

        database.ref('letters-overview/count').once('value').then(function (snapshot) {
            letter_count = snapshot.val();

            rand = Math.floor(Math.random() * letter_count) + 1;

            console.log(letter_count + " " + rand);

            database.ref('letters/').child(rand).once('value').then(function (snapshot) {

                // set view
                letters.setLoc(snapshot.child("location").val(), snapshot.child("view").val());
            });

        });

    }




    return {
        initialize: initialize,
        _saveImage: _saveImage,
        _findPlace: _findPlace,
        sendLetter: sendLetter,
        findLetter: findLetter,
        setLoc: setLoc
    }


})();
