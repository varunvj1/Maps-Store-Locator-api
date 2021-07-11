const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Store = require('./api/models/store');
const axios = require('axios');
const MapboxService = require('./api/services/mapboxService');
require('dotenv').config();

const mapboxService = new MapboxService();

//Connect to mongoose
mongoose.connect('mongodb+srv://varunvj1:7ypxQScHqqv48z5v@cluster0.0r3st.mongodb.net/storeLocator?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

//Allow access to this API
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.json({ limit: '50mb' }));


app.post('/api/stores', (req, res) => {
    // const userData = req.body;

    // data.push(userData)
    // res.send(`Store number ${userData.storeNumber} was pushed in the database!`);
    let dbStores = [];
    let stores = req.body;

    stores.forEach(store => {
        dbStores.push({
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: store.address,
            openStatusText: store.openStatusText,
            addressLines: store.addressLines,
            location: {
                type: 'Point',
                coordinates: [
                    store.coordinates.longitude,
                    store.coordinates.latitude,
                ]
            }
        })
    });

    // <Schema>.create(array, (err, elements of array))
    Store.create(dbStores, (err, stores) => {
        if (err) {
            res.status(500).send("Error");
        }
        else {
            res.status(200).send("Saved to Database!");
        }
    })
    // console.log(dbStores);

    //Store in database
    // var store = new Store({
    //     storeName: "Test",
    //     phoneNumber: "9765345619",
    //     location: {
    //         type: 'Point',
    //         coordinates: [
    //             77.094190,  //Longitude
    //             28.670730   //Latitude
    //         ]
    //     }
    // })
    // store.save();

    // res.send(dbStores);
})

app.get('/api/stores/:zip_code', (req, res) => {

    //Get the requested zip code from the user
    const zipCode = req.params.zip_code;
    mapboxService.getCoordinates(zipCode)
        .then((zipCoordinates) => {
            // Search for nearby stores in MongoDB database
            Store.find({
                location: {
                    $near: {
                        $maxDistance: 3200,
                        $geometry: {
                            type: "Point",
                            coordinates: zipCoordinates
                        }
                    }
                }
            }, (err, stores) => {
                if (err) {
                    console.log(err);;
                }
                else {
                    res.send(stores);
                }
            })

        }).catch((error) => {
            console.log(error);
        })

})

app.delete('/api/stores', (req, res) => {
    Store.deleteMany({}, (err) => {
        res.status(200).send(err);
    })
})

app.listen(3000);