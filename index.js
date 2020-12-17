// simple node.js application to receive data  from eventbus store the data in memory
//   and on get request print the data to console.log


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connection to mongodb
const mongoose = require('mongoose');
const MeasurementModel = require('./measurementModel.js').MeasurementModel;
const DB_URI = 'mongodb://localhost:27017/co2Ampel';

mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("connected to mongo db");
});

const measurements = {};

// get request received - print the measurement data to console log and return it to requester
app.get('/data',(req,res)=> {
    console.log(measurements);
    res.send(measurements);

    MeasurementModel.find()
      .then((measurements) => response.status(200).send(measurements))
      .catch((err) => response.status(400).send(err));
}); 

// post event is received from eventbus - so put the data into memory
app.post('/events',(req,res)=> {
  const { type, measurementdata } = req.body;

  console.log(type); 
  console.log(measurementdata);
  
  const { id, data } = measurementdata;
  
  // save data in memory
  measurements[id] = { id, data };

  // save data to database
  const measurementModel = new MeasurementModel({
    id,
    data
  });

  measurementModel.save((err, postm) => {
      if (err) {
          console.log(err);
          return response.status(500).send();
      }
  });

  res.send({});
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});
