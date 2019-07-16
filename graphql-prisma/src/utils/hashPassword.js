import bcrypt from "bcryptjs";

const hashPassword = async pass => {
  if (pass.length < 8) {
    throw new Error("Password must be 8 characters or longer");
  }

  // second argument is salt
  const password = await bcrypt.hash(pass, 10);
  return password;
};

export default hashPassword;
