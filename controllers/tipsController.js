const axios = require('axios');
const DOMAIN = process.env.DOMAIN;

module.exports = {
  findUser: (req, res) => {
    axios.get(`https://${DOMAIN}/userinfo`, {headers: {Authorization: `Bearer ${req.params.id}`}})
      .then(user => {
        console.log(user.data);
        console.log(user.data.sub); // this is the value we will want to save with the users we create in our DB.
        res.json(user.data)
      })
      .catch(err => console.log(err))
  }
};