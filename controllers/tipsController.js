const axios = require('axios');
const DOMAIN = process.env.DOMAIN;
const db = require('../models');

module.exports = {
  findUser: (req, res) => {
    axios.get(`https://${DOMAIN}/userinfo`, {headers: {Authorization: `Bearer ${req.params.id}`}})
      .then(user => {

        console.log(user.data);

        // checkDatabase(user.data)
        db.User.findOneAndUpdate(
          {auth0: user.data.sub},
          {
            $set: {
              name: user.data.name,
              username: user.data.nickname,
              email: user.data.email,
            }
          },
          {
            new: true,
            upsert: true
          }
        )
          .then(dbUser => {
            console.log(dbUser);
            res.json(dbUser)
          })
          .catch(err => {
            console.log(err);
            res.status(422).json(err)
          })
        // res.json(user.data)
      })
      .catch(err => console.log(err))
  }
};
