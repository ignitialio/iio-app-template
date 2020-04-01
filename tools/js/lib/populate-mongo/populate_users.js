const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const axios = require('axios')

let salt = bcrypt.genSaltSync(10)
let hash = bcrypt.hashSync('toto13!', salt)

/*
{
  "_id": {"$oid":"5e5ad5e79fe5c01a5af6cd78"},
  "title": "mr",
  "firstname": "Eddy",
  "lastname":"Fruchard",
  "picture":"assets/eddy.jpg",
  "dob":"28/05/1987",
  "address":{
    "email":"citezen@outlook.fr",
    "street": "lieu-dit Montravel",
    "city":"Vausseroux",
    "state":"Deux-Sèvres",
    "postcode":"79420",
    "phone": "0671066808"
  },
  "login":{
    "username":"efruchard",
    "password": "$2a$10$8509mpjJClYu55MA49IuDed/uI7aFEtUzPiiLhlLIBzlHZDEp/tee"
  },
  "registered":"1941-03-29T04:47:46.198Z",
  "_lastModified": { "$date": { "$numberLong":"1583071458830" }},
  "cart":[]
}
*/
exports.populate = async db => {
  try {
    let users = db.collection('users')

    await users.deleteMany({}) // reset
    
    let response = await axios({
      url: 'https://randomuser.me/api?results=5',
      method: 'get',
      responseType: 'json'
    })

    let usersData = response.data.results

    console.log('users data length before rework', usersData.length)
    usersData = _.uniqBy(usersData, 'login.username')

    console.log('users data length', usersData.length)
    let userRoles = {}
    for (let i = 0; i < usersData.length; i++) {
      let user = {
        title: usersData[i].name.title,
        firstname: usersData[i].name.first,
        lastname: usersData[i].name.last,
        picture: usersData[i].picture.medium,
        dob: usersData[i].dob.date,
        address: {
          email: usersData[i].email,
          street: usersData[i].location.street.number + ' ' + usersData[i].location.street.name,
          city: usersData[i].location.city,
          state: usersData[i].location.state,
          postcode: usersData[i].location.postcode,
          phone: usersData[i].phone
        },
        login: {
          username: usersData[i].login.username,
          password: hash
        },
        registered: usersData[i].registered.date
      }

      if (i === 0) {
        user.login.username = 'admin'
        userRoles[user.login.username] = 'admin'
      } else {
        userRoles[user.login.username] = 'user'
      }

      usersData[i] = user
    }

    await users.insertMany(usersData)
    
    let docs = await users.find().toArray()

    console.log('users collection length ', docs.length)
    console.log('users done')

    fs.writeFileSync(path.join(__dirname, '../../../data/randomRoles.json'),
      JSON.stringify(userRoles, null, 2), 'utf8')
    return userRoles
  } catch (err) {
    console.log(err)
  }
}

exports.get = async db => {
  try {
    let users = db.collection('users')

    let all = await users.find({})
    return all
  } catch (err) {
    console.log(err)
  }
}
