const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const router = express.Router();
const jwt = require('jsonwebtoken');
const dbAPI = require('./dbAPI');
const { decodeToken, countRemainingWords, validateEmail } = require('./utils');
const { JustifyText } = require('./textJustification')
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const maxWords = 80000
const maxWidth = 80


// error not in db 401 (justification with wrong token)

// request token giving specific email
router.post('/token',async (request,response) => {
    if(!validateEmail(request.body.email)) return response.status(400).send({ message: 'Invalid email' });

    const token = jwt.sign(request.body, 'shhhhh');
    // check if user in DB
    const user = await dbAPI.findUser(request.body.email)
    // user not in db
    if (!user){
        const newUser = {
            email: request.body.email,
            // solde / wordBalance
            lastUsedDate: new Date(),
            rate: maxWords
        }
        await dbAPI.addUser(newUser);
    }
    response.end(token);
    return
});

// request token giving specific email
router.post('/justify', bodyParser.text(), async (request,response) => {
    try{
        const decodedToken = decodeToken(request.headers.authorization)
        if(!decodedToken) return response.status(400).send({ message: 'Token is empty' });
        if(!decodedToken.email) return response.status(400).send({ message: 'Wrong token format' });

        const user = await dbAPI.findUser(decodedToken.email)
        if(user==null) return response.status(401).send({ message: 'Authentification error' });
        
        // token is valid
        const remainingWords = countRemainingWords(user, maxWords)
        const { justifiedText, numberOfWords} = JustifyText(request.body, maxWidth, remainingWords)
        if(!justifiedText) return response.status(401).send({ message: 'Payment required' });
        
        await dbAPI.updateRate(user, remainingWords - numberOfWords)
        response.end(justifiedText);
    }catch(error){
        response.end(error.message)
    }
});

// add router in the Express app.
app.use("/api", router);

app.listen(port, () => {
    console.log("Server listening")
})