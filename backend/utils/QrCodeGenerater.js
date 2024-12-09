import speakEasy from "speakeasy"
import {toDataURL} from "qrcode"

const secretKey = speakEasy.generateSecret({
    name: process.env.SPEAk_EASY_KEY
  }) 

const QrCodeGenerator = async()=>{
   const qrcode = toDataURL(secretKey.otpauth_url)
   return (qrcode);
}
const qrcode = await QrCodeGenerator()

const QrAuthData = {
  key : secretKey,
  qrcodeData : qrcode,
 } 

export default QrAuthData;

  