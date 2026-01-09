import CryptoJS from "crypto-js";
let getResetToken = () => {
  let RawToken = CryptoJS.lib.WordArray.random(12).toString(CryptoJS.enc.Hex);
  let hashToken = CryptoJS.SHA256(RawToken).toString(CryptoJS.enc.Hex);
    return { RawToken, hashToken };

};

export default getResetToken;