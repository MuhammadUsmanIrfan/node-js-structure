import { configureStore } from '@reduxjs/toolkit'
import  signUpReducer from "./slices/signUpSlice"
import loginReducer from "./slices/LoginSlice"
import userValidateReducer from "./slices/userValidateSlice"
import  categoriesReducer  from './slices/categoriesSlice'
import  todoReducer  from './slices/TodoSlice'
import { setupListeners } from "@reduxjs/toolkit/query";
import { userAccessApi } from './apis/userAccess';
import { categoriesApi } from './apis/categoriesApi'
import NavBarReducer from "./slices/NavBarSlice"
import editUserReducer from "./slices/editUserSlice"

export const store = configureStore({
  
  reducer: {
    signUpReducer : signUpReducer,
    loginReducer :  loginReducer,
    userValidateReducer :  userValidateReducer,
    categoriesReducer :  categoriesReducer,
    todoReducer :  todoReducer,
    NavBarReducer :  NavBarReducer,
    editUserReducer :  editUserReducer,
    [userAccessApi.reducerPath] : userAccessApi.reducer
  },


  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(userAccessApi.middleware , categoriesApi.middleware),
})

setupListeners(store.dispatch)