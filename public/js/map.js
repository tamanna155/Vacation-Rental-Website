mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: markers, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9, // starting zoom
});


const marker1= new mapboxgl.Marker()
    .setLngLat(markers)
    .addTo(map);