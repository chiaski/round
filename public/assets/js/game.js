

/* LOAD MAP */
function _initialize() {
      var fenway = {lat: 41.309327, lng: -72.929250};
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




var letters = (function(){
    
    
    
    var curr_location;
    var curr_location_name = $("#loc_name").val();
    
    
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
    
    function listen(){
        
    google.maps.addListener(map, 'moveend', function() {
      var center = map.getCenter();
      var zoom = map.getZoom();

      alert([center.lat(), center.lng(), zoom].join(','));
    });
        
    }


    function _findPlace(){
        
        var geocoder = new google.maps.Geocoder();
        
        var address = document.getElementById("field_loc").value;
        
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK)
          {

              const place = results[0];
              const place_loc = place.geometry.viewport;
              
              console.log(place);
             
             
              // change name so that it focuses on neighbourhood, city, or route //ignore street number   
              
              var place_center = {lat: place_loc.pa.h, lng: place_loc.ka.h};
              
              letters.curr_location = {lat: place_loc.pa.h, lng: place_loc.ka.h};

              console.log(place_center);
              
            $("#loc_name").text(place.address_components[0].short_name); 
              $("#loc_lat").text(place_center.lat);
              $("#loc_lng").text(place_center.lng);

             var map = new google.maps.Map(document.getElementById('map'), {
                center: place_center,
                zoom: 19
              });
              
              
              /* Search Street View */

              var sv = new google.maps.StreetViewService();
              
              var panoRequest = {
                  location: place_center,
                  preference: google.maps.StreetViewPreference.NEAREST,
                  radius: 50,
                  source: google.maps.StreetViewSource.OUTDOOR
              }
              
              var findPanorama = function(radius) {
                  panoRequest.radius = radius;
                  sv.getPanorama(panoRequest, function(panoData, status){
                      if(status === google.maps.StreetViewStatus.OK){
                          
                        var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('map'),
                          {
                              pano: panoData.location.pano
                          });
                          
                          panorama.addListener('position_changed', function() {
                              console.log(panorama.getPosition());
                              
                          $("#loc_lat").text(panorama.getPosition().lat());
                          $("#loc_lng").text(panorama.getPosition().lng());
                              
                            });
                          
                      } else{
                          findPanorama(radius + 5);
                      }
                      }
                        
                  )};
              
              findPanorama(50);
              
              
          
              
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

      }});
        
    }
    
    
    function sendLetter() {
        var heading = google.maps.geometry.spherical.computeHeading(ManLatLng, whereToLookLatLng);
        var pov = panorama.getPov();
        pov.heading = heading;
        
      database.ref('letters/' + Math.floor(Date.now() /1000)).set({
        id: Math.floor(Date.now() /1000),
        time: Math.floor(Date.now() /1000),
        text: $("#my_words").val(),
        location: {
            lat: letters.curr_location.lat,
            lng: letters.curr_location.lng,
            name: $("#loc_name").text()
        }
          
      });
        
        
    // update letter count in database
    database.ref('letters-overview/count').transaction(function(counts) {
        
    let new_count = (counts || 0) + 1;
    return new_count;
        
  });
        
        console.log("\nsent!");
    }
    
    
    
    
    /* FIND LETTER */
    
    // find letter brings you to a space somewhere in the world. this is a core concept borrowed from space email.
    
    function findLetter(){
        let letter_count;
        let rand;
        
        database.ref('letters-overview/count').once('value').then(function(snapshot) {
            letter_count = snapshot.val();
            
            rand = Math.floor(Math.random() * letter_count);
        
            console.log(letter_count + " " + rand);
            
            database.ref('letters/').limitToFirst(rand).limitToLast(1).once('value').then(function (snapshsot) {
                
            });
            
        });
        
    }
    
    
    
    
    
    return{
        _saveImage: _saveImage,
        _findPlace: _findPlace,
        sendLetter: sendLetter,
        findLetter: findLetter,
        listen: listen
    }
    

    
})();
      

   