import jwt from "jsonwebtoken";

let sendToken_Cookie = (data, statusCode, res, message) => {

    try {
    const token = jwt.sign(data, process.env.JWTSECERET, {
                     expiresIn: process.env.JWTEXPIRE || "1d",});
    const options = {
      httpOnly: true,
      secure: true,
      expires: new Date(
        Date.now() + process.env.COOKIEEXPIRE * 24 * 60 * 60 * 1000
      ),
      sameSite: "Strict",
    };
    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({
        success: true,
        message: message,
        token: token,
        data,
      });
    
    } catch (error) {
        throw error;
    }


}

export default  sendToken_Cookie ;