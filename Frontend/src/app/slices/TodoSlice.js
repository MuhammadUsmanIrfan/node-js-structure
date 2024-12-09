import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const base_URL = import.meta.env.VITE_API_URL

export const getAllTodosApi = createAsyncThunk("getAllTodosApi", async(data)=>{
  const resp = await  fetch(`${base_URL}todoroutes/gettodos?page=${data.todoPageCount}&limit=3`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        })
   return await resp.json()
 })

export const searchTodosApi = createAsyncThunk("searchTodosApi", async(formData)=>{
  console.log(JSON.stringify({search_todo:formData.search_todo}))
  const resp = await  fetch(`${base_URL}todoroutes/searchtodo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${formData.token}`,
          },
          body: JSON.stringify({search_todo:formData.search_todo}),
        })
   return await resp.json()
 })

export const addTodoApi = createAsyncThunk("addTodoApi", async(formData)=>{
  const resp = await  fetch(`${base_URL}todoroutes/addtodo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${formData.token}`,
          },
          body: JSON.stringify(formData.data),
        })
   return await resp.json()
 })

export const deleteTodoApi = createAsyncThunk("deleteTodoApi", async(formData)=>{
  const resp = await  fetch(`${base_URL}todoroutes/deletetodo`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${formData.token}`
          },
          body: JSON.stringify(formData.data),
        })
   return await resp.json()
 })

 export const setTodocompletedApi = createAsyncThunk("setTodocompletedApi", async(formData)=>{
  const resp = await  fetch(`${base_URL}todoroutes/setcompleted`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${formData.token}`
          },
          body: JSON.stringify(formData.data),
        })
   return await resp.json()
 })

export const editTodoApi = createAsyncThunk("editTodoApi", async(formData)=>{
  const resp = await  fetch(`${base_URL}todoroutes/edittodo`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${formData.token}`
          },
          body: JSON.stringify(formData.data),
        })
   return await resp.json()
 })


const initialState ={
    todoResponse : {},
    getTodos : {},
    deleteTodo : {},
    completeTodo : {},
    selectedOption : "",
    todoInput : "",
    updateTodoStatus : false,
    updateTodoId:"",
    searchTodoResponse: {}
}

export const categoriesSlice = createSlice({
    
    name:"todo",
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(getAllTodosApi.fulfilled, (state, action)=>{
            state.getTodos = action.payload 
          });

        builder.addCase(searchTodosApi.fulfilled, (state, action)=>{
            state.searchTodoResponse = action.payload 
          });

        builder.addCase(addTodoApi.fulfilled, (state, action)=>{
            state.todoResponse = action.payload 
          });

        builder.addCase(deleteTodoApi.fulfilled, (state, action)=>{
            state.deleteTodo = action.payload 
          });

        builder.addCase(setTodocompletedApi.fulfilled, (state, action)=>{
            state.completeTodo = action.payload 
          });

        builder.addCase(editTodoApi.fulfilled, (state, action)=>{
            state.todoResponse = action.payload 
          });

    },
    reducers:{
      setSelectedOption :(state, action)=>
      {
        state.selectedOption = action.payload
      },
      setClearSearchTodo :(state, action)=>
      {
        state.searchTodoResponse = action.payload
      },
      setTodoInput :(state, action)=>
      {
        state.todoInput = action.payload
      },
      setUpdateTodoStatus :(state, action)=>
      {
        state.updateTodoStatus = action.payload
      },
      setUpdateTodoId :(state, action)=>
      {
        state.updateTodoId = action.payload
      },
    }

})

export const {setSelectedOption,setTodoInput,setUpdateTodoStatus,setUpdateTodoId,setClearSearchTodo } = categoriesSlice.actions

export default categoriesSlice.reducer