import bcrypt from "bcrypt";
const saltRounds = 10;

export const passwordEncrypt = async (userPassword) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(userPassword, salt);
};

export const passwordVerification = async (userPassword, dbPassword) => {
  return await bcrypt.compare(userPassword, dbPassword);
};
