var mapbox = {
    apiURL: "https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    outdoors: "mapbox.outdoors"};

var URL =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


var myMap = L.map("map", {
    center: [40, -110],
    zoom: 5});

var outdoorMap = L.tileLayer(mapbox.apiURL, {
    attribution: mapbox.attribution,
    id: mapbox.outdoors,
    accessToken: API_KEY
}).addTo(myMap);


function legendColor(mag) {
    switch (Math.floor(mag)) {
        case 0: return "green"; break;
        case 1: return "lawnGreen"; break;
        case 2: return "yellow"; break;
        case 3: return "orange"; break;
        case 4: return "darkOrange"; break;
        default: return "red"}}

var info = L.control({
    position: "bottomright"});

info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend"),
        categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    categories.map((d, i) => {
        div.innerHTML += '<i style="background:' + legendColor(i) + '"></i>' + d + '<br>'})
    return div;
};info.addTo(myMap);


d3.json(URL).then(data => {
    data.features.map(d => {
        L.geoJSON(d, {
            pointToLayer: (geoJsonPoint, latlng) => {
                return L.circle(latlng, {
                    fillOpacity: 0.75,
                    weight: 0,
                    fillColor: legendColor(geoJsonPoint.properties.mag),
                    radius: geoJsonPoint.properties.mag * 10000
                });
            },
            onEachFeature: (feature, layer) => {
                layer.bindPopup("<h4>" + feature.properties.place + "</h3>" +
                                "<hr>" +
                                "<p>" + new Date(feature.properties.time) + "</p>");}
                        }).addTo(myMap)})})