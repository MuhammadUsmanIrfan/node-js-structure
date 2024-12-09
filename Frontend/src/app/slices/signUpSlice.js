import { createSlice } from '@reduxjs/toolkit'
const base_URL = import.meta.env.VITE_API_URL


const initialState = {
  password: false,
  user: false,
  signUpStatus:"",
  firstNameStatus: false,
  lastNameStatus:false,
  mobileNumStatus:false,
  passwordStatus:false,
  selectedCountry:{}
}

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    checkPassword: (state) => {
      state.password = true
    },
    checkPassword2: (state) => {
      state.password = false
    },
    checkUser: (state) => {
      state.user = true
    },
    checkUser2: (state) => {
      state.user = false
    },
    setSignUpStatus: (state, action)=>{
      state.signUpStatus = action.payload
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


export const {checkPassword, checkUser,checkPassword2, checkUser2, setSignUpStatus,setFirstNameStatus,setLastNameStatus,setMobileNumStatus,setPasswordStatus,setSelectedCountry} = signUpSlice.actions

export default signUpSlice.reducer