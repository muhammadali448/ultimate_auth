import { hash } from "bcrypt";
const generateHashPassword = (password: String) => {
    if (password.length < 8) {
        throw new Error("Password should be greater than 8 characters");
    }
    return hash(password, 10);
};

export default generateHashPassword;