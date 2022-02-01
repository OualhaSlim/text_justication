const axios = require('axios');
require('dotenv').config();
const jsonServerUrl = `http://${process.env.HOST}:${process.env.DB_PORT}`


const findUser = async (email) =>{
    const usersWithEmail = await axios.get(`${jsonServerUrl}/users?q=${email}`)
        .then(resp => {
            return resp.data
        }).catch(error => {
            console.log(error);
        });
    if(usersWithEmail.length==0)return null
    return usersWithEmail[0]
}


const addUser = (newUser) =>{
    axios.post(`${jsonServerUrl}/users`, newUser)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            console.log(error);
        });
    
}

const updateWordBalance = (user, wordBalance) =>{
    axios.put(`${jsonServerUrl}/users/${user.id}`, {...user, wordBalance, lastUsedDate: new Date()})
        .then(resp =>{
            return resp.data
        })
        .catch(error=>{
            console.log(error)
            return null
        })
}


module.exports = { addUser, findUser, updateWordBalance}

