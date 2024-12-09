import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const base_URL = import.meta.env.VITE_API_URL


export const jwtTokenValidation = createAsyncThunk("jwtTokenValidation", async(token)=>{
 const resp = await fetch(`${base_URL}validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  })
return await resp.json()
})

const initialState = {
  // token: "",
  // token: localStorage.getItem("auth_token"),
  tokenValidateResponse : "",
}


export const userValidateSlice = createSlice({
  name: 'categories',
  initialState,
  extraReducers:(builder)=>{
    
      builder.addCase(jwtTokenValidation.fulfilled, (state, action)=>{
        
        state.tokenValidateResponse = action.payload
        
        // if(action.payload.success == false)
          // {
          // state.tokenValidateResponse = {}
          // localStorage.removeItem("auth_token")
          // }
      });
      builder.addCase(jwtTokenValidation.rejected, (state, action)=>{

        state.tokenValidateResponse = action.payload
        // state.token = localStorage.setItem("auth_token", "")
        // localStorage.setItem("auth_token", "")
      })      
  },
  reducers: {
    
  },
})

// export const { } = userValidateSlice.actions
export const { setToken, resetToken} = userValidateSlice.actions

export default userValidateSlice.reducer
