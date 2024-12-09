import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const base_URL = import.meta.env.VITE_API_URL

const initialState = {
    toggle: false,
    userDetails:{},
    showEdit: false,
    getUserDetailsStatus: ""
}

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


export const NavBarSlice = createSlice({
  name: 'login',
  initialState,
  extraReducers:(builder)=>{
   
    builder.addCase(jwtTokenValidation.fulfilled, (state, action)=>{
      
      if(action.payload?.status == 200)
      {
        state.userDetails = action.payload
        state.getUserDetailsStatus = true
      }else{
        state.userDetails = {}
        state.getUserDetailsStatus = false
      }
   });
},
  reducers: {
    setToggle: (state , action) => {
      state.toggle = action.payload
    },
    setUserDetails: (state , action) => {
      state.userDetails = action.payload
    },
    setShowEdit: (state , action) => {
      state.showEdit = !state.showEdit
      if(action.payload == false)
      {
        state.showEdit = false
      }
    },
  },
})

export const { setToggle,  setShowEdit, setUserDetails } = NavBarSlice.actions

export default NavBarSlice.reducer