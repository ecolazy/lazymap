
// initialize map
var map = L.map('map').fitWorld();

// add tile layer
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



// geolocate and zoom to location
map.locate({setView: true, maxZoom: 16});
