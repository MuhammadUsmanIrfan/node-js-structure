import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const base_URL = import.meta.env.VITE_API_URL

const initialState = {
    checkGooleAuthLogin: true,
    checkGooleAuth: false,
    OtpVerificationResponse: {},
    userLoginResponse : {},
    isEmailPasswordWrong: false,
    email : "",
    password: "",
    token: localStorage.getItem("auth_token"),
    // token: "",
}

export const OtpVerification = createAsyncThunk("OtpVerification", async(fromdata)=>{
  
  const resp = await fetch(`${base_URL}otpverification`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${fromdata.token}`, 
     },
     body:JSON.stringify({"user_otp": String(fromdata.data.code)})
   })
   return await resp.json()

 })

export const signin = createAsyncThunk("signin", async(fromdata)=>{
  
  const resp = await fetch(`${base_URL}signin`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body:JSON.stringify(fromdata)
   })
   return await resp.json()
 })


export const loginSlice = createSlice({
  name: 'login',
  initialState,  
  extraReducers:(builder)=>{
   
    builder.addCase(OtpVerification.fulfilled, (state, action)=>{
     state.OtpVerificationResponse = action.payload
     if(action.payload.status == 200)
     {
       state.checkGooleAuthLogin =  true
       state.isEmailPasswordWrong = false
       
      }else{
        state.checkGooleAuthLogin =  false       
        state.isEmailPasswordWrong = true
        
     }
   });

    builder.addCase(OtpVerification.rejected, (state, action)=>{
     state.OtpVerificationResponse = action.payload
      if(OtpVerificationResponse.success == false )
      {
        state.isEmailPasswordWrong = true
        

      } else {
        
        state.isEmailPasswordWrong = false
      }

    //  state.checkGooleAuthLogin = false

   });
   
    builder.addCase(signin.fulfilled, (state, action)=>{
     state.userLoginResponse = action.payload
     if(action.payload.status == 200 )
     {
       state.token = action.payload.auth_token
       localStorage.setItem("auth_token", action.payload.auth_token)
       state.isEmailPasswordWrong = false
         
      } else {
        state.token = ""
        localStorage.setItem("auth_token", "")
        state.isEmailPasswordWrong = true
     }
     if(action.payload.data.google_auth == true)
      {
        state.checkGooleAuth  = true
        state.checkGooleAuthLogin = false
      } else {        
        state.checkGooleAuth  = false
        state.checkGooleAuthLogin = true
     }
   
   });
    builder.addCase(signin.rejected, (state, action)=>{
     state.userLoginResponse = action.payload
   });
   
   
},
  reducers: {
    setCheckGooleAuthLogin: (state, action) => {
      state.checkGooleAuthLogin = action.payload
    },
    setIsEmailPasswordWrong: (state, action) => {
      state.isEmailPasswordWrong = action.payload
    },
    setEmail: (state, action) => {
      state.email = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    },  
    resetToken:  (state, action) => {
      state.token  = "",
      state.userLoginResponse = {};
      localStorage.removeItem("auth_token");
    },
    setGoogleLoginToken:  (state, action) => {
      state.token  = action.payload,
      localStorage.setItem("auth_token",action.payload);
    },
    setCheckGooleAuth:  (state, action) => {
      state.checkGooleAuth  = action.payload
    },
  },
})

export const { setCheckGooleAuthLogin,setCheckGooleAuth,setIsEmailPasswordWrong,setEmail,setPassword,resetToken,setGoogleLoginToken } = loginSlice.actions

export default loginSlice.reducer