import React, { useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom' 
import {OtpVerification,signin,setIsEmailPasswordWrong,setEmail,setPassword, setCheckGooleAuth,setGoogleLoginToken,setCheckGooleAuthLogin} from '../app/slices/LoginSlice'


const Login = () => {

  const isEmailPasswordWrong = useSelector((state)=> state.loginReducer.isEmailPasswordWrong)
  const checkGooleAuth = useSelector((state)=> state.loginReducer.checkGooleAuth)
  const tokenValidateResponse = useSelector((state)=> state.userValidateReducer.tokenValidateResponse)
  const OtpVerificationResponse = useSelector((state)=> state.loginReducer.OtpVerificationResponse)
  const userLoginResponse = useSelector((state)=> state.loginReducer.userLoginResponse)
  const email = useSelector((state)=> state.loginReducer.email)
  const password = useSelector((state)=> state.loginReducer.password)
  const token = useSelector((state)=> (state.loginReducer.token ))
 
  const dispatch = useDispatch();
 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      /**
       * setGoogleLoginToken👇 -> setting token value and localStorageValue
       */
      dispatch(setGoogleLoginToken(tokenFromUrl))
      if(token)
      { 
        if(tokenValidateResponse?.data?.google_auth == false)
        {
          navigate("/")
          
        } else if(tokenValidateResponse?.data?.google_auth == true)
        {
          dispatch(setCheckGooleAuth(true))
          dispatch(setCheckGooleAuthLogin(false))
          
          navigate("/login")
        }
      }
    }
  }, [token,userLoginResponse,OtpVerificationResponse,tokenValidateResponse,checkGooleAuth]);


  useEffect(()=>{
 
    if(userLoginResponse.auth_token && !checkGooleAuth)
    {
        navigate("/")
    }
  
  },[token,userLoginResponse,OtpVerificationResponse])
 

  const handleForm = async(event)=>{

      event.preventDefault()

      const data = {
        email,
        password
      }
     
      try {
        const response = await dispatch(signin(data)).unwrap();
        dispatch(setIsEmailPasswordWrong(false))
        
      } catch (error) {
        dispatch(setIsEmailPasswordWrong(true))
      }
      
  }

  const handleCode =async(data)=>{
     
      const fromData = {
        // token : userLoginResponse.auth_token,  
        token : token,  
        data : {
            code: data.code
          }
      }
      try {
          const response = await dispatch(OtpVerification(fromData)).unwrap();
          if (response.status === 200) {
            dispatch(setCheckGooleAuth(false));
            navigate("/");
          }
          dispatch(setIsEmailPasswordWrong(true)) 
        
      } catch (error) {
        dispatch(setIsEmailPasswordWrong(true))
      }         
  }

  const handleLoginWithGoodle = ()=>{
    window.open("http://localhost:3000/auth/google/callback", "_self")
    // dispatch(setShowEdit(false))
  }
  const handleSignUpHere = ()=>{
    navigate("/signup")
  }
  
  return (
    <>
    <div className='container px-4 py-4 md:py-12 md:px-12  min-h-[100vh] w-[100%] bg-slate-600'>
    <h1 className='text-center text-2xl font-bold text-white'>Login Page</h1>
    
    <form className="max-w-sm mx-auto" onSubmit={handleSubmit(handleCode)}> 
    {(checkGooleAuth===true) && 
      <>
      <div className="mb-5">
          <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter code to login</label>
          <input type="number" id="code" name='code' {...register("code")} className="no-spinner bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required />
         {isEmailPasswordWrong && <p className='text-red-900 font-medium my-2'>***Worng OTP Please Enter Again***</p>} 
      </div>
      
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Proceed to login</button>
      </>
    }
    </form>
      {(checkGooleAuth === false) &&  <>
      <form className="max-w-sm mx-auto" onSubmit={(event)=>handleForm(event)}>
      
      {isEmailPasswordWrong && <h2 className='text-red-900 text-center mt-4 font-bold'>***Email or Password worng***</h2>}
     
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
          <input type="email" id="email" name='email' value={email} onChange={(e)=>dispatch(setEmail(e.target.value))}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <input type="password" id="password" autoComplete="on" name='password' value={password} onChange={(e)=>dispatch(setPassword(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
          
          <div  className="flex justify-center">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none   focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600  dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
          </div>
       
      </form>
      <div className='max-w-sm my-4 h-[2px] bg-white rounded-lg mx-auto opacity-50'></div>
      <div className='max-w-sm mx-auto flex justify-between my-4'>  
          <button onClick={handleLoginWithGoodle} className="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" >
            Login with Google
          </button>
          <button type="submit" onClick={handleSignUpHere} className="text-white focus:outline-none   hover:underline hover:underline-offset-4  font-medium rounded-lg text-xl w-full sm:w-auto   dark:bg-blue-600   dark:hover:bg-blue-700dark:focus:ring-blue-800">Register <span className='text-orange-500 '>Here</span></button>
       </div>
           
      </>
      }
    </div>
  </>
  )
}

export default Login
