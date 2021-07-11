const axios = require('axios');

class Mapbox {
    async getCoordinates(zipCode) {
        const mapboxURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json`;

        let zipCoordinates = [];

        await axios.get(mapboxURL, {
            params: {
                types: "postcode",
                access_token: process.env.MAPBOX_API_ACCESS_TOKEN
            }
        }).then((response) => {

            const data = response.data;
            zipCoordinates = [
                data.features[0].geometry.coordinates[0],
                data.features[0].geometry.coordinates[1]
            ];
        }).catch((error) => {
            throw new Error(error);
        });

        return zipCoordinates;
    }
}

module.exports = Mapbox;