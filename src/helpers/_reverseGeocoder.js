const { createRevGeocoder } = require("@webkitty/geo-rev");

const _reverseGeocoder = async (lng, lat) => {
  const geocoder = await createRevGeocoder();
  const place = await geocoder.lookup({ latitude: lat, longitude: lng });
  return place;
};

module.exports = _reverseGeocoder;
