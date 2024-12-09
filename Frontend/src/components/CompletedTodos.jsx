import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetToken } from '../app/slices/LoginSlice';
import { jwtTokenValidation,} from "../app/slices/userValidateSlice.js";
import { getCategoriesFullListApi } from "../app/slices/categoriesSlice.js";
import {
  getAllTodosApi,
  deleteTodoApi,
  setTodocompletedApi,
  setSelectedOption,
  searchTodosApi,
} from "../app/slices/TodoSlice.js";

const CompletedTodos = () => {
  const token = useSelector((state)=> (state.loginReducer.token ))
  const tokenValidateResponse = useSelector(
    (state) => state.userValidateReducer.tokenValidateResponse
  );
  const getTodos = useSelector((state) => state.todoReducer.getTodos);
 
  const todoResponse = useSelector((state) => state.todoReducer.todoResponse);
  const completeTodo = useSelector((state) => state.todoReducer.completeTodo);
  const deleteTodo = useSelector((state) => state.todoReducer.deleteTodo);
  const getCategories = useSelector(
    (state) => state.categoriesReducer.getCategoriesFullList
  );
  // const getCategories = useSelector(
  //   (state) => state.categoriesReducer.getCategories
  // );
  const selectedOption = useSelector(
    (state) => state.todoReducer.selectedOption
  );

  const [pageCount, setPageCount] = useState(1)
  const [todoPageCount, setTodoPageCount] = useState(1)
  const [searchTodo, setSearchTodo] = useState("")

  const navigate = useNavigate();
  const selectedOptionRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if(token)
      {
        dispatch(jwtTokenValidation(token))
      }else{
        navigate("/login")
      }
  }, [token]);

  useEffect(() => {
    if (
      tokenValidateResponse?.error?.status == 400 ||
      tokenValidateResponse.success === false
    ) {
      dispatch(resetToken());
      navigate("/login");
    } else {
      dispatch(getCategoriesFullListApi({token}));
      // dispatch(getAllCategoriesApi({token, pageCount}));
      dispatch(getAllTodosApi({token, todoPageCount}));
    }
  }, [todoResponse, completeTodo, deleteTodo,selectedOption,pageCount,selectedOption,searchTodo,todoPageCount]);

  const handleComplete = (e, id) => {
    if (token) {
      const formData = {
        token,
        data: {
          editTodoID: id,
          value: String(e.target.checked),
        },
      };
      dispatch(setTodocompletedApi(formData));
    } else {
      navigate("/login");
    }
  };

  const handleDeleteTodo = (item) => {
    if (token) {
      const formData = {
        token,
        data: {
          todoID: item._id,
        },
      };

      dispatch(deleteTodoApi(formData));
    } else {
      navigate("/login");
    }
  };

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
      setPageCount(pageCount + 1)
    }
  }
  const handleTodoPrev = ()=>{
    if(todoPageCount <= 1)
    {
      setTodoPageCount(1)
    }else
    {
      setTodoPageCount(todoPageCount -1)
      
    }
  }

  const handleTodoNext = ()=>{

     if(todoPageCount >= getTodos?.data?.nbPages)
    {
      setTodoPageCount(1)
    }else
    {
      setTodoPageCount(todoPageCount + 1)
    }
  }

  // const handleSelect = (event) => {
  //   dispatch(setSelectedOption(event.target.value));
  // };

  // const handleSearch = (event) => {
  //   setSearchTodo(event.target.value);

  //   dispatch(searchTodosApi({token, data: searchTodo}))
  // };

  return (
    <>
      <div className="container px-4 py-4 md:py-12 md:px-12 min-h-[calc(100vh-4.5rem)] w-[100%] bg-slate-600">
        <h1 className="text-center text-2xl font-bold text-white">
          Completed Todos Page
        </h1>
        <h2 className="text-center text-xl font-medium text-white">
          Select categorie
        </h2>
        <div className="px-[45%] my-4">
          <select
            name="language"
            id="language"
            onChange={(event)=>dispatch(setSelectedOption(event.target.value))}
            value={selectedOption}
            ref={selectedOptionRef}
            required
          >
            {getCategories?.data?.totalCategories?.map((item) =>
              item.is_deleted != true ? (
                <option value={item?.category_name} key={item._id}>
                  {item?.category_name}
                </option>
              ) : null
            )}
          </select>
        </div>
        {/* <div className='flex justify-center items-center gap-3 my-4'>
                    <button className='bg-slate-800 min-w-fit px-3 rounded-md text-white font-medium text-xl hover:bg-slate-900 py-2' onClick={handlePrev}>Prev</button>
                    <p className='text-white text-xl font-medium'>{pageCount} of {getCategories?.data?.nbPages}</p>
                    <button className='bg-slate-800 min-w-fit px-3 rounded-md text-white font-medium text-xl hover:bg-slate-900 py-2' onClick={handleNext}>Next</button>
        </div> */}
        <hr />
        <div className='flex justify-center items-center gap-3 my-12'>
                    <button className='bg-slate-800 min-w-fit px-3 rounded-md text-white font-medium text-xl hover:bg-slate-900 py-2' onClick={handleTodoPrev}>Prev</button>
                    <p className='text-white text-xl font-medium'>{todoPageCount} of {getTodos?.data?.nbPages}</p>
                    <button className='bg-slate-800 min-w-fit px-3 rounded-md text-white font-medium text-xl hover:bg-slate-900 py-2' onClick={handleTodoNext}>Next</button>
                </div>
       
        <div className="categories mt-8">
          <ul className="flex flex-wrap gap-4 ">
            {getTodos?.data?.getTodos?.map((item) =>
              (item.is_completed == true && item?.category[0]?.category_name == selectedOption) ? (
                <div
                  key={item._id}
                  className="w-fit flex items-center justify-center gap-3 border border-gray-400 rounded-md p-2 hover:bg-slate-700"
                >
                  <p className="bg-gray-800 opacity-50 text-white p-2 rounded-md w-fit">
                    {item?.category[0]?.category_name}
                  </p>
                  <li className="list-none block text-xl text-white bg-slate-950  p-2 rounded-md w-fit">
                    {item.todo}
                  </li>{" "}
                  <button
                    className="bg-red-600 px-3 rounded-md text-white font-medium text-xl hover:bg-red-800 py-2"
                    onClick={() => handleDeleteTodo(item)}
                  >
                    Delete
                  </button>{" "}
                  <input
                    type="checkbox"
                    name="is_completed"
                    checked
                    onChange={(event) => handleComplete(event, item._id)}
                  />
                </div>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CompletedTodos;
