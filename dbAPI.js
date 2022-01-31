const axios = require('axios');
const jsonServerUrl = 'http://localhost:3001'


const getAllUsers = async () =>{
  const allUsers = await axios.get(`${jsonServerUrl}/users`)
    .then(resp => {
        return resp.data;
    })
    .catch(error => {
        console.log(error);
    });
    return allUsers
}
const findUser = async (email) =>{
    const result = await axios.get(`${jsonServerUrl}/users?q=${email}`)
        .then(resp => {
            return resp.data
        }).catch(error => {
            console.log(error);
        });
    if(result.length==0)return null
    return result[0]
}


const addUser = async (newUser) =>{
    await axios.post(`${jsonServerUrl}/users`, newUser)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            console.log(error);
        });
    
}

const updateRate = async (user, rate) =>{
    await axios.put(`${jsonServerUrl}/users/${user.id}`, {...user, rate, lastUsedDate: new Date()})
        .then(resp =>{
            return resp.data
        })
        .catch(error=>{
            console.log(error)
            return null
        })
}


module.exports = { getAllUsers, addUser, findUser, updateRate }

