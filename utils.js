const jwt_decode = require('jwt-decode');
const email_re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(email_re);
};

const decodeToken = (token) =>{
  try{
    return jwt_decode(token);
  }catch(error){
    return null
  } 
}

const sameDay = (date1, date2) =>{
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
}

const countRemainingWords = (user, maxWords) =>{
  if(sameDay(new Date(), new Date(user.lastUsedDate))){
      return user.wordBalance
  }
  return maxWords
}


module.exports = { decodeToken, countRemainingWords, validateEmail };