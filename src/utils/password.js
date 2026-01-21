
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};


const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash); 
};

module.exports = { hashPassword, comparePassword };
