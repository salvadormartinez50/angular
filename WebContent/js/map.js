var map,map2
var marker;
var markerLatLng;

function initMap() {

  var mapProp = {
      zoom: 15
  };

  map2 = new google.maps.Map(document.getElementById("map2"), mapProp);
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 21.3905191, lng: -100.1085054},
    scrollwheel: false,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    mapTypeControl: false,
    fullscreenControl: false
  });
}
