import React, { useEffect, useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { jwtTokenValidation} from '../app/slices/userValidateSlice';
import { resetToken, setCheckGooleAuthLogin,setEmail,setIsEmailPasswordWrong, setPassword} from '../app/slices/LoginSlice';
import { setCheckGooleAuth } from '../app/slices/LoginSlice';
import { setToggle, setShowEdit, setUserDetails } from '../app/slices/NavBarSlice';


const NavBar = () => {

  const token = useSelector((state)=> (state.loginReducer.token ))
  const tokenValidateResponse = useSelector((state)=> state.userValidateReducer.tokenValidateResponse)
  const userEditDetailsResponse = useSelector((state) => state.editUserReducer.userEditDetailsResponse);
  const checkGooleAuth = useSelector((state)=> state.loginReducer.checkGooleAuth)
  const checkGooleAuthLogin = useSelector((state)=> state.loginReducer.checkGooleAuthLogin)
  // const OtpVerificationResponse = useSelector((state)=> state.loginReducer.OtpVerificationResponse)
  const toggle = useSelector((state)=> state.NavBarReducer.toggle)
  const userDetails = useSelector((state)=> state.NavBarReducer.userDetails)
  // const getUserDetailsStatus = useSelector((state)=> state.NavBarReducer.getUserDetailsStatus)
  const showEdit = useSelector((state)=> state.NavBarReducer.showEdit)
  

  const userLoginResponse = useSelector((state)=> state.loginReducer.userLoginResponse)


  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  useEffect(()=>{
   
    dispatch(jwtTokenValidation(token))
  },[token,userLoginResponse,userEditDetailsResponse])
  // },[userLoginResponse, token,userEditDetailsResponse])
 
 

  useEffect(() => {
    
    if(tokenValidateResponse?.error?.status == 400 || tokenValidateResponse.success === false)
      {
        // navigate("/login")
        // dispatch(resetToken())
        // dispatch(setCheckGooleAuth(false))
      }
    
  }, [userEditDetailsResponse,userDetails,checkGooleAuth,token,tokenValidateResponse]);

  const handleLogout = () => {
    dispatch(resetToken())
    dispatch(setIsEmailPasswordWrong(false))
    dispatch(setEmail(""))
    dispatch(setPassword(""))
    dispatch(setShowEdit(false))
  };

  const mobileMenu = (
    <>
    {checkGooleAuthLogin &&
    <ul className="md:hidden absolute z-10 top-[100%] left-0 w-[50vw] h-[90vh] bg-slate-800 text-white transition-all py-12 px-[12%]"> 
      <NavLink to="/"><li className="text-xl py-4">Home</li></NavLink>
      <NavLink to="/categories"><li className="text-xl py-4">Categories</li></NavLink>
      <NavLink to="/createtodo"><li className="text-xl py-4">Create Todos</li></NavLink>
      <NavLink to="/completedtodos"><li className="text-xl py-4">Completed Todos</li></NavLink>
      
      </ul>
    }
    </>
  );

  return (
    <div className="container md:px-12 px-3 py-2 bg-slate-800 text-white relative z-50">
      <nav className="flex justify-between items-center">
        {checkGooleAuthLogin &&
        <ul className="md:flex gap-3 hidden">
          <NavLink to="/"><li className="text-xl font-medium hover:underline ">Home</li></NavLink>
          <NavLink to="/categories"><li className="text-xl font-medium hover:underline">Categories</li></NavLink>
          <NavLink to="/createtodo"><li className="text-xl font-medium hover:underline">Create Todos</li></NavLink>
          <NavLink to="/completedtodos"><li className="text-xl font-medium hover:underline">Completed Todos</li></NavLink>
        </ul>
        }
        <div className="md:hidden" onClick={() => setToggle(!toggle)}>
          <RxHamburgerMenu className="text-3xl" />
        </div>
        {toggle && mobileMenu}

        <ul className="flex gap-3 items-center">
          {(userDetails.data && checkGooleAuthLogin) ? (
            <>
              <li className="text-yellow-500 font-bold">
                {userDetails.data.first_name}  {userDetails.data.last_name}
              </li>
              <li onClick={handleLogout} className="text-yellow-500 font-bold hover:cursor-pointer">
                Logout
              </li>
            </>
          ) : (
            <>
              <NavLink to="/login"><li className="text-yellow-500 font-bold">Login</li></NavLink>
              <NavLink to="/signup"><li className="text-yellow-500 font-bold">Sign Up</li></NavLink>
            </>
          )}
           {(checkGooleAuthLogin && token) && 
          <div className="w-14 h-14 rounded-full bg-slate-400" onClick={()=>dispatch(setShowEdit())} >
          {(String(userDetails?.data?.profile_image).startsWith("https")) ? <img src={`${userDetails?.data?.profile_image}`} className="h-full w-full rounded-full" alt="User Avatar" /> : (userDetails?.data?.profile_image) ? <img src={`http://localhost:3000/${userDetails?.data?.profile_image}`} className="h-full w-full rounded-full" alt="User Avatar" /> :<img src="placeholder.jpg" className="h-full w-full rounded-full" alt="User Avatar" /> }
          </div>
          }
        </ul>
          {checkGooleAuthLogin &&
          showEdit && <div className='w-fit absolute top-16 right-7 bg-slate-800 rounded-lg py-2 px-2'>
          <NavLink to="/edit"><li className="text-white font-bold list-none text-center cursor-pointer hover:underline">Edit details</li></NavLink>
          </div>
          }
      </nav>
    </div>
  );
};

export default NavBar;
