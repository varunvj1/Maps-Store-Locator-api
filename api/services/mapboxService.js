const axios = require('axios');

class Mapbox {
    async getCoordinates(zipCode) {
        const mapboxURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json`;

        let zipCoordinates = [];

        await axios.get(mapboxURL, {
            params: {
                access_token: 'pk.eyJ1IjoidmFydW52ajEiLCJhIjoiY2txczl0cng5MTU5ODJ1bzFsaGhra3Z6biJ9.W8R-7w5Tj56V9XFXKG6S5Q'
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
