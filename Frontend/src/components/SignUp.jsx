import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom' 
import { useSelector, useDispatch } from 'react-redux'
import {  checkPassword, checkUser, checkPassword2, checkUser2, setSignUpStatus,setFirstNameStatus,setLastNameStatus,setMobileNumStatus,setPasswordStatus,setSelectedCountry} from "../app/slices/signUpSlice"
import { useUserRegisterMutation } from '../app/apis/userAccess'
import Select from "react-select";
import countryList from "react-select-country-list";
import { getCountryCallingCode } from "libphonenumber-js";


  const SignUp = () => {
    
  // const [selectedCountry, setSelectedCountry] = useState(null);

  const signUpReducer = useSelector((state) => state.signUpReducer)

  const password = useSelector((state) => state.signUpReducer.password)
  const user = useSelector((state) => state.signUpReducer.user)
  const dispatch = useDispatch()

  const navigate = useNavigate();
 
  const [userRegister] = useUserRegisterMutation()


  useEffect(()=>{

  },[signUpReducer.signUpStatus,signUpReducer.firstNameStatus, signUpReducer.lastNameStatus, signUpReducer.passwordStatus,signUpReducer.selectedCountry,signUpReducer.mobileNumStatus])

  const countries = useMemo(() => {
    const countryData = countryList().getData(); 
    
    return countryData.map((country) => {
        try {
          const dialingCode = getCountryCallingCode(country.value); 
          return {
            value: `+${dialingCode}`, 
            label: `${country.label} (${dialingCode})`, 
          };
        } catch (error) {
          return null;
        }
      })
      .filter((option) => option !== null); 
  }, []);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  
  async function handleForm(data){
      
    const validationStatus = {
      firstNameStatus: false,
      lastNameStatus: false,
      passwordStatus: false,
      mobileNumStatus: false,
    };



    if(data.password !== data.r_password)
    {
      dispatch(checkPassword())
    }else{
      
      dispatch(checkPassword2())
      
      
      if( data?.first_name.length <= 2)
      {
        validationStatus.firstNameStatus = true;
        dispatch(setFirstNameStatus(true))
      } else{
        validationStatus.firstNameStatus = false;
        dispatch(setFirstNameStatus(false))
      }

      if( data?.last_name.length <= 2)
        {
          validationStatus.lastNameStatus = true;
          dispatch(setLastNameStatus(true))
        } else{
          validationStatus.lastNameStatus = false;
          dispatch(setLastNameStatus(false))
        }

      if( data?.password.length <= 4)
        {
          validationStatus.passwordStatus = true;
          dispatch(setPasswordStatus(true))
        } else{
          validationStatus.passwordStatus = false;
          dispatch(setPasswordStatus(false))
        }
        
      if(data?.phone_num)
      {
        if( data?.phone_num.length != 10)
          {
            validationStatus.mobileNumStatus = true;
            dispatch(setMobileNumStatus(true))
          } else{
            validationStatus.mobileNumStatus = false;
            dispatch(setMobileNumStatus(false))
          }
      }
      if(!validationStatus.firstNameStatus &&
        !validationStatus.lastNameStatus &&
        !validationStatus.passwordStatus &&
        !validationStatus.mobileNumStatus){
       
      let complete_num = null   
      if(signUpReducer?.selectedCountry?.value)
      {

        const country_code = String(signUpReducer.selectedCountry.value)
        const phone_num = String(data?.phone_num)
        complete_num =  Number(country_code.concat(phone_num))
      }
        
      const formData = new FormData();

      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('file', (data.file[0])?data.file[0]:null);  
      formData.append('password', data.password);
      formData.append('phone_num', (complete_num)? complete_num: 0);
           
      const userRegisterResponse = await userRegister(formData)
      
      dispatch(setSignUpStatus(userRegisterResponse))
      
      if(userRegisterResponse?.data.status === 201)
        {
          navigate("/login")
          dispatch(checkUser2())          
        } else{
          dispatch(checkUser())
        }
      }
    }

  }
  
  const handleChange = (selectedOption) => {
    dispatch(setSelectedCountry(selectedOption));
  };

  
  const handleSignInHere = ()=>{
    navigate("/login")
  }

  return (
    <>
    <div className='container px-4 py-2 md:py-4 md:px-12  min-h-[calc(100vh-4.5rem)] w-[100%] bg-slate-600'>
    <h1 className='text-center text-2xl font-bold text-white'>SignUp Page</h1>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit(handleForm)} method='POST' encType="multipart/form-data">

        {user && <h2 className='text-red-900 text-center mt-4 font-bold'>***This user is already registerd***</h2>}

      <div className='flex gap-12 mt-4'>

        <div className="mb-5">
          <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
          <input type="first_name" id="first_name"{...register("first_name")} name='first_name' className="shadow-sm  border-spacing-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light " required/>
          {(signUpReducer.firstNameStatus) && <p className='text-red-900'>**First name length sould be greater than 2**</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
          <input type="last_name" id="last_name" name='last_name' {...register("last_name")}className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required/>
          {(signUpReducer.lastNameStatus) && <p className='text-red-900'>**last name length sould be greater than 2**</p>}
        </div>
        </div>
  

        <div className="mb-5">
          <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Image</label>
          <input type="file" id="file"name='file' {...register("file")}  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
          <input type="email" id="email" name='email' {...register("email")} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required/>
          {(signUpReducer.signUpStatus?.error) && <p className='text-red-900'>**User with this email already existed**</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="phone_num" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your Mobile Number</label>
          <div className='phone-num-container flex gap-2 items-center'>          
            <div className='select-country-container grow'>
              <Select options={countries} onChange={handleChange} />
            </div>

            <input type="number" id="phone_num" name='phone_num' {...register("phone_num")}className="no-spinner shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 w-[60%] dark:focus:border-blue-500 dark:shadow-sm-light" />

          </div>
          {(signUpReducer.mobileNumStatus) && <p className='text-red-900'>**Phone_num length must be 10**</p>}
        </div>

        <div className='md:flex gap-12'>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <input type="password" autoComplete='on' id="password" name='password' {...register("password")} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
          {password && <span className='text-red-900'>*Password not matching*</span>}
          {signUpReducer.passwordStatus && <span className='text-red-900'>*Password length must be greater than 4*</span>}
          
        </div>

        <div className="mb-5">
          <label htmlFor="r_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat password</label>
          <input type="password" autoComplete='on' id="r_password" name='r_password' {...register("r_password")}className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
          {password && <span className='text-red-900'>*Password not matching*</span>}
        </div>
          {signUpReducer.passwordStatus && <p className='text-red-900'>*Password length must be greater than 4*</p>}

        </div>
        
        <div className='flex justify-center'>
            <button type="submit" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register new account</button>
        </div>

      </form>
      <div className='max-w-sm my-4 h-[2px] bg-white rounded-lg mx-auto opacity-50'></div>
        <div className='max-w-sm mx-auto flex justify-between my-4'>
          <button className="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"><a  href="http://localhost:3000/loginwithgoogle">Sign up with Google</a></button>

          <button type="submit" onClick={handleSignInHere} className="text-white focus:outline-none   hover:underline hover:underline-offset-4  font-medium rounded-lg text-xl w-full sm:w-auto   dark:bg-blue-600   dark:hover:bg-blue-700dark:focus:ring-blue-800">Login <span className='text-orange-500 '>Here</span></button>
        </div>
    </div>
  </>
  )
}

export default SignUp
