import React, { useEffect, useState } from 'react'
import { ImCross } from 'react-icons/im'
import { TiTick } from 'react-icons/ti'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { jwtTokenValidation } from '../app/slices/userValidateSlice'
// import { resetToken } from '../app/slices/LoginSlice'



const Home = () => {
  
  const tokenValidateResponse = useSelector((state)=> state.userValidateReducer.tokenValidateResponse)
  const token = useSelector((state)=> (state.loginReducer.token ))
  const userDetails = useSelector((state)=> state.NavBarReducer.userDetails)

  
  const [sendEmailState, setSendEmailState] = useState(false)
  const [userSmsOtp, setUserSmsOtp] = useState("")
  const [sendSmsState, setSendSmsState] = useState(false)
  const [verfiySmsState, setVerfiySmsState] = useState(false)
  const [verfiySmsResponse, setVerfiySmsResponse] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(()=>{

    if(token)
    {
      dispatch(jwtTokenValidation(token))
    }
    else{
      navigate("/login")
    }
  },[token,verfiySmsState,verfiySmsResponse])
  
  useEffect(() => {
    
  
    
  }, [token,verfiySmsState,verfiySmsResponse]);


  const handleEmailVerfication = ()=>{
      
      const userEmail = userDetails?.data?.email;

      const formData = {
        userEmail
      }
      if(token)
        {
          const response = fetch("http://localhost:3000/emailverfication", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(formData),
        }).then((response)=> response.json()).then((data)=>{

          setSendEmailState(true)

          setTimeout(()=>{ setSendEmailState(false)},3000)

        }).catch((err)=>{
          console.error(err)
        });

        } else{
          navigate("/login")
        }
       

  }

  const handleGetSms = ()=>{
    const userMobileNum = userDetails?.data?.phone_num?.number
    
    if(userMobileNum)
    {
      if(token)
        {
          const formData ={
            number: userMobileNum
          }
          const response = fetch("http://localhost:3000/getsmsotp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(formData),
        }).then((response)=> response.json()).then((data)=>{

          setSendSmsState(true)

          setTimeout(()=>{ setSendSmsState(false)},3000)

        }).catch((err)=>{
          console.error(err)
        });

        } else{
          navigate("/login")
        }

    }else{
      navigate("/login")
    }

  }

  const handleSmsVerification =()=>{

      if(token)
        {
          const formData ={
            otp: userSmsOtp
          }
          const response = fetch("http://localhost:3000/verifynumber", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(formData),
        }).then((response)=> response.json()).then((data)=>{

          if(data.status !== 200)
          {
            setVerfiySmsState(true)
            
          }else if(data.status == 200){
            setVerfiySmsState(false)
            setVerfiySmsResponse(data)
          }else {
            setVerfiySmsState(false)
          }
        }).catch((err)=>{
          setVerfiySmsState(true) 
          console.error(err)
        });

        } else{
          navigate("/login")
        }
  }

  return (
    <>
      <div className='container px-4 py-4 md:py-12 md:px-12  min-h-[calc(100vh-4.5rem)] w-[100%] bg-slate-600'>
      <h1 className='text-center text-4xl font-bold text-white'>Home Page</h1>
       <hr className='my-12'/>
       <div className='flex justify-between bg-slate-500 rounded-xl flex-wrap'>
          <div className='pl-5 pt-3'>
              <h1 className='text-2xl font-bold text-white underline underline-offset-4'>Personal Details</h1>
                <p className='text-2xl font-medium text-white my-4'>First name: <span className='text-slate-950 text-xl'>{userDetails?.data?.first_name }</span></p>
                <p className='text-2xl font-medium text-white my-4'>Last name: <span className='text-slate-950 text-xl'>{userDetails?.data?.last_name }</span></p>

                <p className='text-2xl font-medium text-white my-4'>Email: <span className='text-slate-950 text-xl'>{userDetails?.data?.email}</span></p>

                <p className='text-2xl font-medium text-white my-4 flex items-center'>Account verified: 
                  {(userDetails?.data?.is_verified) ? <span className='text-slate-950 text-xl px-3 flex items-end gap-2'>verified <TiTick className="bg-green-500 text-white rounded-full text-2xl"/></span> : <span className='text-slate-950 text-xl px-3 flex items-end gap-2'>not verified <ImCross className='bg-red-500 text-white rounded-full text-2xl'/></span>} 
                </p>
                <p className='text-2xl font-medium text-white my-4'>phone_num: <span className='text-slate-950 text-xl'>{userDetails?.data?.phone_num?.number}</span></p>

                <p className='text-2xl font-medium text-white my-4 flex items-center'>Phone number verified: 
                  {(userDetails?.data?.phone_num?.number_verified) ? <span className='text-slate-950 text-xl px-3 flex items-end gap-2'>verified <TiTick className="bg-green-500 text-white rounded-full text-2xl"/></span> : <span className='text-slate-950 text-xl px-3 flex items-end gap-2'>not verified <ImCross className='bg-red-500 text-white rounded-full text-2xl'/></span>} 
                </p>
          </div>
            <div className='w-36 h-36 pr-5 pt-3 bg-slate-500 rounded-lg'>
            {(String(userDetails?.data?.profile_image).startsWith("https")) ? <img src={`${userDetails?.data?.profile_image}`} className="h-full w-full rounded-lg" alt="User Avatar" /> : (userDetails?.data?.profile_image) ? <img src={`http://localhost:3000/${userDetails?.data?.profile_image}`} className="h-full w-full rounded-lg" alt="User Avatar" /> :<img src="placeholder.jpg" className="h-full w-full rounded-lg" alt="User Avatar" /> }
            </div>
          </div>
          <hr className='my-12'/>
          <div className='container-edit-details'>
            <div className='py-4'>
                  {(userDetails?.data?.is_verified == false) ? <button onClick={handleEmailVerfication} className='bg-green-700 py-2 px-4 rounded-lg text-white font-semibold hover:bg-green-800'>Get email verfication Link</button> : null}
                  {sendEmailState && <p className='my-1 font-medium text-white text-xl'>***Email sent Successfully***</p>}
            </div>
            {(userDetails?.data?.phone_num?.number_verified == false) ? <><div className='flex items-center gap-3'>
                  <div className=" max-w-[25vw] ">
                    <input value={userDetails?.data?.phone_num?.number} disabled type="number" id="phone_num" name='phone_num' className="no-spinner shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder='Enter your mobile number'/>
                  </div>
                  <div>
                      <button onClick={handleGetSms} className='bg-green-700 hover:bg-green-800 py-2 px-4 rounded-lg text-white font-semibold '>Get sms OTP</button>   
                  </div>
              </div>
              {sendSmsState && <p className='my-1 font-medium text-white text-xl'>***sms sent Successfully***</p>}
              <label htmlFor="phone_num" className="block mt-8 mb-2 text-sm font-medium bg-gray-900 py-2 px-4 rounded-md text-white w-fit">Enter your OTP</label>
              <div className='flex items-center gap-3 '>
                  <div className="max-w-[25vw]">
                    <input onChange={(event)=>setUserSmsOtp(event.target.value)} value={userSmsOtp} type="number" id="phone_num" name='phone_num' className="no-spinner shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder='Enter sms 4 digit OTP'/>
                  </div>
                  <div>
                      <button onClick={handleSmsVerification} className='bg-green-700 hover:bg-green-800 py-2 px-4 rounded-lg text-white font-semibold '>verify mobile number</button>
                  </div>
              </div></> : null}
              {verfiySmsState && <p className='my-1 font-medium text-red-700 text-xl'>***invalid otp***</p>}
        </div>
      </div>
    </>
  )
}

export default Home
