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




var letters = (function () {


    // official instances
    var map;
    var panorama;
    var sv;
    
    var count_remembered;

    var curr_location;
    var curr_location_name = $("#loc_name").val();

    

    /* LOAD MAP */
    function initialize() {
        
        console.log("Let's go somewhere nice and far.");
        
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
                panControl: true,
                disableDefaultUI: true
            });


        letters.sv = new google.maps.StreetViewService();
        letters.panorama.addListener('position_changed', function () {
         
            // console.log(letters.panorama.getPosition());

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
    
        $(".the-guide").delay(10000).fadeIn(4000);
        $(".the-question").delay(15000).fadeIn(4000);
        $(".travel-place").delay(3000).fadeIn(3000);
        
        letters.count_remembered = 0;
        letters.intro();
        
        $("#my_words").fadeIn(3400);
        $(".time").fadeIn(5000);
        

        letters.map.setStreetView(letters.panorama);
    }
    
    
      // introduction sequence asks user for 3 prompts
        
        function intro(){
            
            // done
            if(letters.count_remembered >= 3){
                $(".explore").fadeIn(3000);
                $("#my_words").attr('placeholder', 'What can space here do for you?');
                //console.log("Done with introduction!");
                $(".the-question").fadeOut("slow");
                return;
            }
            
                // user prompts
                var prompts = [
                    "Tell me about where you felt you could die.",
                    "Where's the closest place to home you have now?",
                    "Somewhere you want to be.",
                    "Where were you yesterday?",
                    "Where do you want to be tomorrow?",
                    "Where you think they could be?",
                    "Where you would be fine with losing everything?",
                    "Are you afraid of someplace?",
                    "Do you not want to go there again?",
                    "Have you been dreaming of a place since you were a child?",
                    "Where do you want to go after everything?",
                    "Where should you have said it?",
                    "Some place you've never even thought about.",
                    "Where did you grow up?",
                    "Where did you really grow up?",
                    "Where would you like to die?",
                    "Despite everything, where would you go?",
                    "Where do you need to send a letter to?"
                ];
            
            
            function _select(arr){
                var copy = arr.slice(0);
                
                    if(copy.length < 1){ copy = arr.slice(0); }
                    
                    let i = Math.floor(Math.random() * copy.length);
                    var item = copy[i];
                    copy.splice(i, 1);
                    return item;
            }
            
            $(".the-question").hide().text(_select(prompts)).delay(7000).fadeIn(2000);
            $(".travel-place").fadeIn(3000);
            
            
    }


    /* MAIN */

    function setLoc(location, view) {

       // console.log(location);
        //  console.log(view);

        letters.curr_location = {
            lat: location.lat,
            lng: location.lng
        };
      //  console.log(letters.curr_location);


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


           // console.log(data);
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
        
        if(letters.count_remembered < 3){
            
            if(letters.count_remembered == 1){
                $(".the-guide").fadeOut(2000).remove();
            }
            // counter for initial 3
            $(".the-question").fadeOut(2000).delay(8000);
            $(".travel-place").fadeOut(4000);
            letters.count_remembered += 1;
            letters.intro();
            
            $(".travel-place").delay(2000).fadeIn(2500);
            
        } else{
            $(".explore").fadeIn(3000);
            $(".the-question").fadeOut(2500);
        }
        
        clear();
        
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
                const place_loc = place.geometry.location;

               //  console.log(place);
               
                // change name so that it focuses on neighbourhood, city, or route //ignore street number   

                var place_center = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };

                letters.curr_location = place_center;

               // console.log(place_center);

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

                document.getElementById("field_loc").value = "";


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
        
        $(".travel-place").fadeOut("slow");
        $("#my_words").fadeOut(2500).delay(2000);

        database.ref('letters-overview/count').once('value').then(function (snapshot) {
            letter_count = snapshot.val();

            rand = Math.floor(Math.random() * letter_count) + 1;

            console.log(letter_count + " " + rand);

            database.ref('letters/').child(rand).once('value').then(function (snapshot) {

                // set view≈
                letters.setLoc(snapshot.child("location").val(), snapshot.child("view").val());
                
                $("#my_words").text(snapshot.child("text").val());
                
            });
            

        });
        
         $("#my_words").fadeIn(3000);
        $(".travel-place").delay(8000).fadeIn(3000);

    }




    return {
        initialize: initialize,
        _saveImage: _saveImage,
        _findPlace: _findPlace,
        sendLetter: sendLetter,
        findLetter: findLetter,
        setLoc: setLoc,
        intro: intro
    }


})();
