const conn = require("../../conn");

const User = conn.define("user", {
  name: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: conn.Sequelize.STRING,
  imgUrl: {
    type: conn.Sequelize.STRING,
    defaultValue: "default-photo.jpg"
  },
  email: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  isAdmin: {
    type: conn.Sequelize.STRING,
    defaultValue: false
  },
  shipAddress: {
    type: conn.Sequelize.STRING
  },
  shipCity: {
    type: conn.Sequelize.STRING
  },
  shipState: {
    type: conn.Sequelize.STRING
  },
  shipZip: {
    type: conn.Sequelize.STRING
  },
  phone: {
    type: conn.Sequelize.STRING
  }
});

const generateError = message => {
  const error = new Error(message);
  error.status = 401;
  error.json = true;
  return error;
};

User.findBySessionId = function(userId) {
  if (!userId) throw generateError("No user found");
  return this.findById(userId);
};

User.login = function(credentials) {
  if (!credentials.email || !credentials.password) {
    throw generateError("No credentials");
  }

  return this.findOne({ where: credentials }).then(user => {
    if (!user) throw generateError("Bad credentials");
    return user;
  });
};

module.exports = User;