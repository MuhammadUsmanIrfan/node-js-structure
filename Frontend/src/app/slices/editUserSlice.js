import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const base_URL = import.meta.env.VITE_API_URL

export const getQrCodeApi = createAsyncThunk("getQrCodeApi", async(fromdata)=>{
  const resp = await fetch(`${base_URL}getqrcode`, {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${fromdata.token}`, 
     },
    
   })
   return await resp.json()
 })

export const setUserAuth = createAsyncThunk("setUserAuth", async(fromdata)=>{
  const resp = await fetch(`${base_URL}setusergoogleauth`, {
     method: 'PATCH',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${fromdata.token}`, 
     },
     body:JSON.stringify({user_value: fromdata.data.user_value })
   })
   return await resp.json()
 })

export const editUserDetails = createAsyncThunk("editUserDetails", async(fromdata)=>{
  const resp = await fetch(`${base_URL}edituserdetails`, {
     method: 'PATCH',
     headers: {
      //  'Content-Type': 'application/json',
       'Authorization': `Bearer ${fromdata.token}`, 
     },
     body: fromdata.data,
    //  body:JSON.stringify({user_value: fromdata.data.user_value })
   })
   return await resp.json()
 })

export const changeUserPassowrd = createAsyncThunk("changeUserPassowrd", async(fromdata)=>{
  const resp = await fetch(`${base_URL}changeuserpassowrd`, {
     method: 'PATCH',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${fromdata.token}`, 
     },
     body: JSON.stringify(fromdata.data),
   
   })
   return await resp.json()
 })

const initialState = {
  qrCodeResponse: {},
  setUserAuthResponse : {},
  userEditDetailsResponse: {},
  toggleQrCode: false,
  disableQrcode: false,

  firstNameStatus: false,
  lastNameStatus:false,
  mobileNumStatus:false,
  passwordStatus:false,
  selectedCountry:{}

}
  
export const editUserSlice = createSlice({
  name: 'login',
  initialState,
  extraReducers:(builder)=>{
   
     builder.addCase(getQrCodeApi.fulfilled, (state, action)=>{
      
      state.qrCodeResponse = action.payload
    });
     builder.addCase(setUserAuth.fulfilled, (state, action)=>{
      if(action.payload.data.google_auth == false)
      {
        state.disableQrcode = true
        state.toggleQrCode = false
      } else{
        state.disableQrcode = false
        state.toggleQrCode = true
      }
      state.setUserAuthResponse = action.payload
    });
     builder.addCase(editUserDetails.fulfilled, (state, action)=>{
      
      state.userEditDetailsResponse = action.payload
    });
     builder.addCase(changeUserPassowrd.fulfilled, (state, action)=>{
      
      state.userEditDetailsResponse = action.payload
    });
    
},
  reducers: {
    
    // setcategory_name: (state , action) => {   
    //   state.category_name = action.payload
    // },
    setUserEditDetailsResponse: (state , action) => {   
      state.userEditDetailsResponse = action.payload
    },
    setFirstNameStatus: (state, action)=>{
      state.firstNameStatus = action.payload
    },
    setLastNameStatus: (state, action)=>{
      state.lastNameStatus = action.payload
    },
    setMobileNumStatus: (state, action)=>{
      state.mobileNumStatus = action.payload
    },
    setPasswordStatus: (state, action)=>{
      state.passwordStatus = action.payload
    },
    setSelectedCountry: (state, action)=>{
      state.selectedCountry = action.payload
    },
  },
})

export const {setUserEditDetailsResponse,setFirstNameStatus,setLastNameStatus,setMobileNumStatus,setPasswordStatus,setSelectedCountry } = editUserSlice.actions

export default editUserSlice.reducer