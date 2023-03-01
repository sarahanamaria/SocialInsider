const routing = require('./routing'); //import logic for routes

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


app.post('/brands', routing.brands);//get back brands;
app.post('/info', routing.info)



//start server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
