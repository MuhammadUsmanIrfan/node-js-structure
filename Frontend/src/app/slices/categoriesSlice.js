import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const base_URL = import.meta.env.VITE_API_URL

export const getAllCategoriesApi = createAsyncThunk("getAllCategories", async(data)=>{
  const resp = await fetch(`${base_URL}category/getcategories?page=${data.pageCount}&limit=3`, {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${data.token}`, 
     },
   })
   return await resp.json()
 })

export const getCategoriesFullListApi = createAsyncThunk("getCategoriesFullListApi", async(data)=>{
  const resp = await fetch(`${base_URL}category/getallcategories`, {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${data.token}`, 
     },
   })
   return await resp.json()
 })

export const addCategoryApi = createAsyncThunk("addCategoryApi", async(fromdata)=>{
  const resp = await fetch(`${base_URL}category/addcategory`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${fromdata.token}`, 
     },
     body:JSON.stringify(fromdata.data)
   })
   return await resp.json()
 })

 export const deleteCategoryApi = createAsyncThunk("deleteCategoryApi", async(fromdata)=>{
  const resp = await fetch(`${base_URL}category/deletecategory`, {
     method: 'DELETE',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${fromdata.token}`, 
     },
     body:JSON.stringify({category_name: fromdata.data.category_name})
   })
   return await resp.json()
 })

export const editCategoryApi = createAsyncThunk("editCategoryApi", async(fromdata)=>{
  const resp = await fetch(`${base_URL}category/editcategory`, {
     method: 'PATCH',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${fromdata.token}`, 
     },
     body:JSON.stringify({category_name: fromdata.data.category_name, new_name:fromdata.data.new_name })
   })
   return await resp.json()
 })

const initialState = {
  getCategories: { },
  error : false,
  addCategory: {},
  deleteCategory: {},
  editCategory: {},
  editCategoryBtn: false,
  PrevCategory: "",
  category_name: "",
  checkCategoryIsExist: false,
  getCategoriesFullList : []
}

export const categoriesSlice = createSlice({
  name: 'login',
  initialState,
  extraReducers:(builder)=>{
    builder.addCase(getAllCategoriesApi.fulfilled, (state, action)=>{
      state.getCategories = action.payload 
    });
    builder.addCase(getCategoriesFullListApi.fulfilled, (state, action)=>{
      if(action.payload.status == 200)
      {
        state.getCategoriesFullList = action.payload 
      }
    });

    builder.addCase(addCategoryApi.fulfilled, (state, action)=>{
      state.addCategory =action.payload
      if(action.payload?.success ==  false)
      {
        state.checkCategoryIsExist = true
      } else{
        state.checkCategoryIsExist = false
      }
    });

    builder.addCase(editCategoryApi.fulfilled, (state, action)=>{
      
      state.editCategory = action.payload
    });
    builder.addCase(editCategoryApi.rejected, (state, action)=>{
      
      state.editCategory = action.payload
    });
    builder.addCase(editCategoryApi.pending, (state, action)=>{
      
      state.editCategory = action.payload
    });

    builder.addCase(deleteCategoryApi.fulfilled, (state, action)=>{
      state.editCategory = action.payload
    });
},
  reducers: {
    delteCategoriesResponse: (state , action) => {
      state.deleteCategory = action.payload
    },
    setEditCategoryBtn: (state , action) => {   
      state.editCategoryBtn = action.payload
    },
    setPrevCategory: (state , action) => {   
      state.PrevCategory = action.payload
    },
    setcategory_name: (state , action) => {   
      state.category_name = action.payload
    },
    
  },
})

export const { delteCategoriesResponse, setEditCategoryBtn, setPrevCategory,setcategory_name,} = categoriesSlice.actions

export default categoriesSlice.reducer