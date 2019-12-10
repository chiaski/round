

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


    function _findPlace(){
        var geocoder = new google.maps.Geocoder();
        var address = document.getElementById("field_loc").value;
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK)
          {

              const place = results[0];
              const place_loc = place.geometry.viewport;

              console.log(place);
              console.log(place.address_components[0].short_name);
              curr_location_name = place.address_components[0].short_name;
              $("#loc_name").text(place.address_components[0].short_name);
            
              
              var place_center = {lat: place_loc.pa.h, lng: place_loc.ka.h};

            
            letters.curr_location = {lat: place_loc.pa.h, lng: place_loc.ka.h};

            console.log(place_center);

             var map = new google.maps.Map(document.getElementById('map'), {
                center: place_center,
                zoom: 19
              });



          var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('map'), {
                position: place_center,
                pov: {
                  heading: 34,
                  pitch: 10
                }
              });

          map.setStreetView(panorama); 

      }});
        
    }
    
    
    function sendLetter() {
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
        
        console.log("\nsent!");
    }
    
    
    /* SEARCHING LETTERS */
    
    // find letter brings you to a space somewhere in the world. this is a core concept borrowed from space email.
    
    function findLetter(){
        
    }
    
    return{
        _saveImage: _saveImage,
        _findPlace: _findPlace,
        sendLetter: sendLetter
    }
    

    
})();
      

   