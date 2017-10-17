const Clarifai = require('clarifai')

const app = new Clarifai.App({apiKey: "YOUR_API_KEY" })
let markers = [];

// Takes the marker information and applies it onto the map
const addMarker = (marker) => {
  new L.marker([marker.geoPoint.latitude, marker.geoPoint.longitude])
    .bindPopup("<img style='width:100%' src=" + marker.image_url + " />",{
      maxWidth: 500 })
    .addTo(map)
}

// Creates objects for us from the response to use for our markers
const createGeoPoints = (response) => {
  let geoPoints = response.hits.filter((hit) => { return !markers.includes(hit.input.id)})

  geoPoints = geoPoints.map((hit) => {
    let geoPoint = hit.input.data.geo.geo_point
    return {id: hit.input.id,  image_url: hit.input.data.image.url, geoPoint: geoPoint};
  })

  return geoPoints;
}

map.on('moveend', () => {
  let center = map.getCenter()
  app.inputs.search({
    input: {
      geo: {
        latitude: center.lat,
        longitude: center.lng,
        type: 'withinMiles',
        value: 10
      }
    }
  }).then((response) => {
    geoPoints = createGeoPoints(response);

    geoPoints.forEach((marker) => {
      if(markers.indexOf(marker.id) == -1 ){
        markers.push(marker.id)
        addMarker(marker);
      }
    })
  })
})
