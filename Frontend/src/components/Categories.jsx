import React, { useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom' 
import { useSelector, useDispatch } from 'react-redux'
import {  jwtTokenValidation } from '../app/slices/userValidateSlice'
// import { resetToken, jwtTokenValidation } from '../app/slices/userValidateSlice'
import { resetToken } from '../app/slices/LoginSlice';
import { setEditCategoryBtn,setPrevCategory,setcategory_name, getAllCategoriesApi , addCategoryApi, editCategoryApi, deleteCategoryApi} from '../app/slices/categoriesSlice'

const Categories = () => {
  
  const token = useSelector((state)=> (state.loginReducer.token ))
  const tokenValidateResponse = useSelector((state)=> state.userValidateReducer.tokenValidateResponse)
  const getCategories = useSelector((state)=> state.categoriesReducer.getCategories)
  const addCategory = useSelector((state)=> state.categoriesReducer.addCategory)
  const deleteCategory = useSelector((state)=> state.categoriesReducer.deleteCategory)
  const editCategory = useSelector((state)=> state.categoriesReducer.editCategory)
  const editCategoryBtn = useSelector((state)=> state.categoriesReducer.editCategoryBtn)
  const PrevCategory = useSelector((state)=> state.categoriesReducer.PrevCategory)
  const category_name = useSelector((state)=> state.categoriesReducer.category_name)
  const checkCategoryIsExist = useSelector((state)=> state.categoriesReducer.checkCategoryIsExist)

  const [pageCount, setPageCount] = useState(1)
 

  const dispatch = useDispatch()
 
  const navigate = useNavigate()
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()


  useEffect(()=>{
    
    if(token)
      {
        dispatch(jwtTokenValidation(token))
      }else{
        navigate("/login")
      }
  },[ token])

  useEffect(() => {
    
      if(tokenValidateResponse?.error?.status == 400 || tokenValidateResponse.success === false)
      {
        dispatch(resetToken())
        navigate("/login")
      }else{ 
        dispatch(getAllCategoriesApi({token, pageCount}))
      }

  }, [tokenValidateResponse, deleteCategory, addCategory, editCategory,pageCount,checkCategoryIsExist]);
  
  const handleForm = async()=>{
   
    if (token) {     
        const formData = {
          token, data:{category_name}
          }
       
        dispatch(addCategoryApi(formData))
        dispatch(setcategory_name(""))
          }else{
            navigate("/login")
          }       
  }

  const handleDelete=async (category_name)=>{
       
      if(token)
      {
        const formData = {
          token,
          data: {category_name}
        }
        dispatch(deleteCategoryApi(formData))
      }else{
            navigate("/login")
          }   
  }

  const handleEditCategoryBtn =(category_name)=>{
   dispatch(setEditCategoryBtn(true))
   dispatch(setcategory_name(category_name))
   dispatch(setPrevCategory(category_name))
  }

  const handleUpdateBtn =async ()=>{
    dispatch(setEditCategoryBtn(false))
     
    if(token)
    {
     
      const fromdata = {
        token,
        data :{
          category_name:PrevCategory,
          new_name:category_name,
        }
      }
     
      dispatch(editCategoryApi(fromdata))
      dispatch(setcategory_name(""))
    }else{
          navigate("/login")
        } 

  }

  const handlePrev = ()=>{
    if(pageCount <= 1)
    {
      setPageCount(1)
    }else
    {

      setPageCount(pageCount -1)
    }
  }

  const handleNext = ()=>{

     if(pageCount >= getCategories?.data?.nbPages)
    {
      setPageCount(1)
    }else
    {
      if(getCategories?.data?.nbPages)
      {
        setPageCount(pageCount + 1)
      }
    }
  }

  return (
    <>
      <div className='container px-4 py-4 md:py-12 md:px-12  h-[calc(100vh-4.5rem)]  bg-slate-600'>
      <h1 className='text-center text-4xl font-bold text-white'>Categories</h1>
            <h2 className='text-center text-xl font-bold text-white mt-10'>Add Category</h2>
            <form method="post" onSubmit={handleSubmit(handleForm)}>
          <div className='flex items-center justify-center gap-4 mt-8'>

            <div className="w-72">
                <input type="text" value={category_name} onChange={(event)=>dispatch(setcategory_name(event.target.value))} name='category_name' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder='Category name' required/>
            </div>

            <div>
            <button type="submit" className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add</button>
            </div>
            {
              editCategoryBtn && <div>
              <button onClick={handleUpdateBtn} className="block text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">Update</button>
          </div>
            }
          </div>
          {checkCategoryIsExist &&  <p className='text-red-900 font-medium my-2 text-center text-xl'>**This Category is already exsited**</p>}
         
          </form>

          <div className='categories mt-10'>
             <ul className='flex flex-wrap gap-4 justify-center'>
              

                { getCategories?.data?.getCategory?.map(element => (
                    (element.is_deleted != true) ?  
                    <div className='w-fit flex items-center space-x-3 border border-gray-400 rounded-md p-2 hover:bg-slate-700' key={element._id}>
                      <li className='list-none block text-xl text-white bg-slate-950 w-[100%] p-2 rounded-md'>
                          {element.category_name}
                      </li> 
                      <button 
                          className='bg-red-600 px-3 rounded-md text-white font-medium text-xl hover:bg-red-800 py-2' 
                          onClick={() => handleDelete(element.category_name)}
                      >
                          Delete
                      </button>
                      <button 
                          className='bg-yellow-600 min-w-fit px-3 rounded-md text-white font-medium text-xl hover:bg-yellow-800 py-2'
                          onClick={()=>handleEditCategoryBtn(element.category_name)} 
                      >
                          Edit Category
                      </button>
                  </div> :null

                ))
                }
              
             </ul>
            </div>
                 <div className='flex justify-center items-center gap-3 mt-12'>
                    <button className='bg-slate-800 min-w-fit px-3 rounded-md text-white font-medium text-xl hover:bg-slate-900 py-2' onClick={handlePrev}>Prev</button>
                    <p className='text-white text-xl font-medium'>{pageCount} of {(getCategories?.data?.nbPages)? getCategories?.data?.nbPages : 1}</p>
                    <button className='bg-slate-800 min-w-fit px-3 rounded-md text-white font-medium text-xl hover:bg-slate-900 py-2' onClick={handleNext}>Next</button>
                </div>
      </div>
    </>
  )
}

export default Categories
