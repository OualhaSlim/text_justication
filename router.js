const express = require('express')
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const dbAPI = require('./dbAPI');
const { decodeToken, countRemainingWords, validateEmail } = require('./utils');
const { JustifyText } = require('./textJustification')
const maxWords = 80000
const maxWidth = 80

router.post('/token', bodyParser.json(),async (request,response) => {
    if(!validateEmail(request.body.email)) return response.status(400).send({ message: 'Invalid email' });

    const token = jwt.sign(request.body, 'shhhhh');
    // check if user in DB
    const user = await dbAPI.findUser(request.body.email)
    // user not in db
    if (!user){
        const newUser = {
            email: request.body.email,
            lastUsedDate: new Date(),
            wordBalance: maxWords
        }
        await dbAPI.addUser(newUser);
    }
    response.status(200).send({token: token});
    return
});

// request token giving specific email
router.post('/justify', bodyParser.text({ limit: '50mb' }), async (request,response) => {
    try{
        const decodedToken = decodeToken(request.headers.authorization)
        if(!decodedToken) return response.status(400).send({ message: 'Token is empty' });
        if(!decodedToken.email) return response.status(400).send({ message: 'Wrong token format' });

        const user = await dbAPI.findUser(decodedToken.email)
        if(user==null) return response.status(401).send({ message: 'Authentification error' });
        console.log(typeof request.body)
        console.log(request.body)
        // token is valid
        const remainingWords = countRemainingWords(user, maxWords)
        const { justifiedText, numberOfWords } = JustifyText(request.body, maxWidth, remainingWords)
        if(!justifiedText) return response.status(402).send({ message: 'Payment required' });
        
        await dbAPI.updateWordBalance(user, remainingWords - numberOfWords)
        response.type('text/plain');
        response.status(200).end(justifiedText);
    }catch(error){
        console.log(error)
        response.end("Please enter body in text format")
    }
});

module.exports = router 