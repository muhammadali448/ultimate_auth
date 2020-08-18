import { sign } from "jsonwebtoken";
const generateToken = (userId: String) => {
    const token = sign(
        {
            userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
    return token;
};

export default generateToken;