const request = require('supertest');
const jwt = require('jsonwebtoken');
    
require('dotenv').config();
const host = `http://${process.env.HOST}:${process.env.PORT}`

describe('POST /token', () => {
    it('generating token', async () =>{
        const response = await request(host)
            .post('/api/token')
            .send({email : "nameForTesting@emailForTesting.ourApp"})
        expect(response.statusCode).toBe(200)
    });

    it('should specify json content type header', async () =>{
        const response = await request(host)
            .post('/api/token')
            .send({email : "name@email.com"})
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    });

    it('invalid email input', async () =>{
        const response = await request(host)
            .post('/api/token')
            .send({email : "nameemail.com"})
        expect(response.statusCode).toBe(400)
    });

    it('empty body', async () =>{
        const response = await request(host)
            .post('/api/token')
            .send()
        expect(response.statusCode).toBe(400)
    });
});

describe('POST /justify', () => {
    it('no token in header', async () =>{
        const response = await request(host)
            .post('/api/justify')
            .send("text")
        expect(response.statusCode).toBe(400)
    });

    it('invalid token', async () =>{
        const token = jwt.sign({"invalideObject": "Value of invalid Object"}, 'shhhhh');
        const response = await request(host)
            .post('/api/justify')
            .set('Authorization', token)
            .send("text")
        expect(response.statusCode).toBe(400)
    });

    it('should specify text/plain content type header', async () =>{
        const tokenResponse = await request(host).post('/api/token').send({email : "nameForTesting@emailForTesting.ourApp"})
        const response = await request(host)
            .post('/api/justify')
            .set('Authorization', JSON.parse(tokenResponse.text)['token'])
            .set({'Content-Type': 'text/plain'})
            .send("random text")
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining("text/plain"))
    });
    
});