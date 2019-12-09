import dotenv from 'dotenv';
dotenv.config()

var domtoimage = require('dom-to-image');

console.log(require('dotenv').config())


/*
function initialize() {
      var fenway = {lat: 42.345573, lng: -71.098326};
      var map = new google.maps.Map(document.getElementById('map'), {
        center: fenway,
        zoom: 14
      });
      var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), {
            position: fenway,
            pov: {
              heading: 34,
              pitch: 10
            }
          });
      map.setStreetView(panorama);
    }
    */


function _findPlace(){
    var geocoder = new google.maps.Geocoder();
var address = document.getElementById("address").value;
geocoder.geocode( { 'address': address}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK)
  {
      
    console.log(results[0].geometry.location.latitude + "," + results[0].geometry.location.longitude);
      // do something with the geocoded result
      //
      // results[0].geometry.location.latitude
      // results[0].geometry.location.longitude
  }
});
}


    function _saveImage() {
       

        /* Append image to a div */
        domtoimage.toPng(document.getElementById('container')).then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            $("#photo").append(img);
        }).catch(function (error) {
            console.error('oops, something went wrong!', error);
        });

    }
    