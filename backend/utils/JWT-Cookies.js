import jwt from "jsonwebtoken";

let sendToken_Cookie = (data, statusCode, res, message) => {

    try {
    const token = jwt.sign(data, process.env.JWTSECERET, {
                     expiresIn: process.env.JWTEXPIRE || "1d",});
    const options = {
      httpOnly: true,
      secure: true, // Set to true in production (requires HTTPS)
      expires: new Date(
        Date.now() + (process.env.COOKIEEXPIRE || 4) * 24 * 60 * 60 * 1000
      ),
      sameSite: "none", // Adjust as needed (e.g., "lax" or "none" for cross-site)
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