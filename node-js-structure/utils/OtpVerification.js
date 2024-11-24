import speakEasy from "speakeasy"

const userOtpVerification = (otp , key)=>{

  return  speakEasy.totp.verify({
        secret: String(key),
        encoding: 'ascii',
        token : String(otp)
    })

}




export default userOtpVerification