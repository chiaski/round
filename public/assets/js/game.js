
    function _saveImage() {
       

        /* Append image to a div */
        domtoimage.toPng(document.getElementById('paint')).then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            $("#photo").append(img);
        }).catch(function (error) {
            console.error('oops, something went wrong!', error);
        });

    }
      
      
function _findPlace(){
    var geocoder = new google.maps.Geocoder();
var address = document.getElementById("field_loc").value;
geocoder.geocode( { 'address': address}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK)
  {
      
      const place = results[0];
      const place_loc = place.geometry.bounds.ka;
      
      console.log(place);
      console.log(place.address_components[0].short_name);
      $("#loc_name").text(place.address_components[0].short_name);
      console.log(place_loc.g + ", " + place_loc.h);
      
     var place_center = {lat: place_loc.g, lng: place_loc.h};
      
      console.log(place_center);
      
     var map = new google.maps.Map(document.getElementById('map'), {
        center: place_center,
        zoom: 14
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
      
      
      // do something with the geocoded result
      //
      // results[0].geometry.location.latitude
      // results[0].geometry.location.longitude
  }
});
}
    