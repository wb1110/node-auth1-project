const Users = require("../users/users-model");
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  next()
}

async function checkUsernameFree(req, res, next) {
  try {
  const userExists = await Users.findBy({ username: req.body.username })
  if (userExists.length) {
    next({ status: 422, message: "Username taken" })
  } else {
    next()
  }
  } catch (err) {
  next(err)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const userExists = await Users.findBy({ username: req.body.username })
    if (!userExists.length) {
      next({ status: 401, message: "Invalid credentials" })
    } else {
      next()
    }
  } catch (err) {
      next(err)
  }
}

function checkPasswordLength(req, res, next) {
  !req.body.password || req.body.password.length < 4 ?
  res.status(422).json({ message: "Password must be longer than 3 chars"}) :
  next()
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}