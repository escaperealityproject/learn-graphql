import jwt from "jsonwebtoken";

const getUserId = req => {
  const header = req.request.headers.authorization;
  if (!header) {
    throw new Error("Authentication required");
  }
  const token = header.replace("Bearer ", "");
  const decoded = jwt.verify(token, "thisisasecret");
  return decoded.userId;
};

export default getUserId;
