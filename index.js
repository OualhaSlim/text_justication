const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const router  = require('./router')

require('dotenv').config();
const port = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log("Server listening")
})

app.get("/",(request, response) =>{
    response.end("Text Justification API");
});

// redirection
app.get('*', (request, response) =>{
    response.redirect('/');
});

// add router in the Express app.
app.use("/api", router);
