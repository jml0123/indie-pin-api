const {createRevGeocoder} = require("@webkitty/geo-rev")



const _reverseGeocoder = async (lng, lat) => {
    const geocoder = await createRevGeocoder();
    const place = await geocoder.lookup({latitude: lat, longitude: lng});
    console.log(place)
    return place
}

//_reverseGeocoder(-125.22323, 89.0123)
module.exports = _reverseGeocoder

