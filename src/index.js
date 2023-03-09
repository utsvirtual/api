const express = require('express');
const cors = require('cors');

const app = express();
const middleware = require('./middleware/index.js');

//settings
const whitelist = ['http://localhost:3000'];

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors(
    {
   // origin: whitelist
    }
));

try {
    app.use(middleware.decodeTokens)
}catch(e){
    console.log(e)
}

// routes
app.use(require('./routes/index.js'));

const PORT = 443//process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});






