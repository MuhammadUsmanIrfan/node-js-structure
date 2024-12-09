import React, { useState, useEffect,useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetToken } from '../app/slices/LoginSlice';
import { jwtTokenValidation,} from "../app/slices/userValidateSlice.js";
import { getQrCodeApi,setUserAuth,setUserEditDetailsResponse,setFirstNameStatus,setLastNameStatus,setMobileNumStatus,setPasswordStatus,setSelectedCountry } from "../app/slices/editUserSlice.js";
import { editUserDetails,changeUserPassowrd } from "../app/slices/editUserSlice.js";
import Select from "react-select";
import countryList from "react-select-country-list";
import { getCountryCallingCode } from "libphonenumber-js";
import { toast } from "react-toastify";

const EditUserDetails = () => {

  const editUserReducer = useSelector(
    (state) => state.editUserReducer
  );

  const token = useSelector((state)=> (state.loginReducer.token ));
  const userEditDetailsResponse = useSelector((state) => state.editUserReducer.userEditDetailsResponse);
  const tokenValidateResponse = useSelector(
    (state) => state.userValidateReducer.tokenValidateResponse
  );
  const qrCodeResponse = useSelector(
    (state) => state.editUserReducer.qrCodeResponse
  );
  const setUserAuthResponse = useSelector(
    (state) => state.editUserReducer.setUserAuthResponse
  );
  const toggleQrCode = useSelector(
    (state) => state.editUserReducer.toggleQrCode
  );
  const disableQrcode = useSelector(
    (state) => state.editUserReducer.disableQrcode
  );
  


  const [userDetails, setUserDetails] = useState({});
  

  const [toggleChangPassord, setToggleChangPassord] = useState(false);
  // const [toggleQrCode, setToggleQrCode] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [checkOldPassword, setCheckOldPassword] = useState(false);
  

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if(token)
      {
        dispatch(jwtTokenValidation(token))
      }else{
        navigate("/login")
      }
  }, [token,editUserReducer.firstNameStatus, editUserReducer.lastNameStatus, editUserReducer.passwordStatus,editUserReducer.selectedCountry,editUserReducer.mobileNumStatus]);


  useEffect(() => {
    if (
      tokenValidateResponse?.error?.status == 400 ||
      tokenValidateResponse?.success === false
    ) {
     
      dispatch(resetToken());
      navigate("/login");
    } else{
      
      setUserDetails(tokenValidateResponse);
      if(disableQrcode)
        {
          toast.success("Google Auth is successfully disabled",{
            position: "bottom-left"
          })
        }

    }
  }, [tokenValidateResponse,userDetails,userEditDetailsResponse,disableQrcode, editUserReducer.firstNameStatus, editUserReducer.lastNameStatus, editUserReducer.passwordStatus,editUserReducer.selectedCountry,editUserReducer.mobileNumStatus]);

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



  const handleForm = async (data) => {

    const validationStatus = {
      firstNameStatus: false,
      lastNameStatus: false,
      mobileNumStatus: false,
    };

    if( data?.first_name){
      if( data?.first_name.length <= 2)
        {
          validationStatus.firstNameStatus = true;
          dispatch(setFirstNameStatus(true))
        } else{
          validationStatus.firstNameStatus = false;
          dispatch(setFirstNameStatus(false))
        }
      }

      if( data?.last_name){
        if( data?.last_name.length <= 2)
          {
            validationStatus.lastNameStatus = true;
            dispatch(setLastNameStatus(true))
          } else{
            validationStatus.lastNameStatus = false;
            dispatch(setLastNameStatus(false))
          }
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
             !validationStatus.mobileNumStatus)
             {
              
              validationStatus.firstNameStatus = false 
              validationStatus.lastNameStatus = false
              validationStatus.mobileNumStatus = false
              dispatch(setFirstNameStatus(false))
              dispatch(setLastNameStatus(false))
              dispatch(setMobileNumStatus(false))

              let complete_num = null   
              // console.log("checking number condition-->", editUserReducer?.selectedCountry?.value && data?.phone_num)
              if(editUserReducer?.selectedCountry?.value && data?.phone_num)
              {     
                const country_code = String(editUserReducer.selectedCountry.value)
                const phone_num = String(data?.phone_num)
                complete_num =  Number(country_code.concat(phone_num))
              }
            const formData = new FormData();
            // formData.append('first_name',  data.first_name ? data.first_name : "");
            // formData.append('last_name', data.last_name ? data.last_name : "");
            // formData.append('file', (data.file[0])?data.file[0]:null);  
            // formData.append('number', (complete_num)? complete_num: 0);
            
            formData.append("first_name", data.first_name ? data.first_name : "");
            formData.append("last_name", data.last_name ? data.last_name : "");
            formData.append("file", data.file[0] ? data.file[0] : "");
            formData.append('number', (complete_num)? complete_num: "");

            console.log("checking form data-->", formData)
            if (token) {
              const updateData = {
                token,
                data : formData
              }

              try {
                await dispatch(editUserDetails(updateData)).unwrap()     
                setUserDetails(userEditDetailsResponse)
                
                if(userEditDetailsResponse?.status==200)
                  {
                    toast.success("user details update successfully!",{
                      position: "bottom-left"
                    });
                  }
               
              } catch (error) {
                toast.error("Failed to update user details",{
                  position: "bottom-left"
                });
              }
            

            
            } else {
              dispatch(resetToken())
              navigate("/login");
            }
              
            }

    
  };


  const handleChange = (selectedOption) => {
    dispatch(setSelectedCountry(selectedOption));
  };


  const handleChangePassword = async (data) => {
    if (data.new_password == data.r_password) {
      setCheckPassword(false);
      if (token) {
        const formdata = {
          token,
          data:{
            old_password: data.old_password,
            new_password: data.new_password,
          }
        }

        dispatch(changeUserPassowrd(formdata))

        if (userEditDetailsResponse?.status == 200) {
          dispatch(resetToken())
          navigate("/login");
        
        } else {
          setCheckOldPassword(true);
        }
      } else {
        dispatch(resetToken())
        navigate("/login");
      }
    } else {
      setCheckPassword(true);
    }
  };

  const handleEnableGoogleAuth = (event)=>{
   event.preventDefault()

    const fromdata = {
      token
    }
    const fromdata2 = {
      token,
      data : {
        user_value: true
      }
    }
    dispatch(getQrCodeApi(fromdata))
    dispatch(setUserAuth(fromdata2))
  
  }

  const handleDisableGoogleAuth =async (event)=>{
    event.preventDefault()

    const fromdata = {
      token,
      data : {
        user_value: false
      }
    }
   
    dispatch(setUserAuth(fromdata))
    // setToggleQrCode(false)
  }

  
  return (
    <>
      <div className="container px-4 py-4 md:py-12 md:px-12  min-h-[calc(100vh-4.5rem)] w-[100%] bg-slate-600 relative">
        <div className="bg-slate-700 min-h-full w-[12%] absolute left-0 top-0">
          <p
            onClick={() => setToggleChangPassord(false)}
            className="cursor-pointer py-3 px-2 font-medium hover:underline text-yellow-500"
          >
            Change user details
          </p>
          <p
            onClick={() => setToggleChangPassord(true)}
            className="cursor-pointer py-3 px-2 font-medium hover:underline text-yellow-500"
          >
            Change Password
          </p>
        </div>

        {toggleChangPassord ? (
          <>
            <h1 className="text-center text-4xl font-bold text-white">
              Change Password
            </h1>
            <form
              className="max-w-sm mx-auto "
              onSubmit={handleSubmit(handleChangePassword)}
              method="POST"
            >
              <div className="mb-5 mt-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  old password
                </label>
                <input
                  autoComplete="new-password"
                  type="password"
                  id="password"
                  name="old_password"
                  {...register("old_password")}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required
                />
                {checkOldPassword && (
                  <span className="text-red-900">*wrong password*</span>
                )}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  new password
                </label>
                <input
                  autoComplete="new-password"
                  type="password"
                  id="new_password"
                  name="new_password"
                  {...register("new_password")}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required
                />
                {checkPassword && (
                  <span className="text-red-900">*Password not matching*</span>
                )}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="r_password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Repeat password
                </label>
                <input
                  autoComplete="new-password"
                  type="password"
                  id="r_password"
                  name="r_password"
                  {...register("r_password")}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required
                />
                {checkPassword && (
                  <span className="text-red-900">*Password not matching*</span>
                )}
              </div>

              <div className="flex justify-center ">
                <button
                  type="submit"
                  className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Change password
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-center text-4xl font-bold text-white">
              Edit User Details
            </h1>
            <form
              className="max-w-sm mx-auto "
              onSubmit={handleSubmit(handleForm)}
              method="POST"
              encType="multipart/form-data"
            >
              <div className="w-36 h-36 bg-slate-300 rounded-md absolute right-10">
                {String(userDetails?.data?.profile_image).startsWith(
                  "https"
                ) ? (
                  <img
                    src={`${userDetails?.data?.profile_image}`}
                    className="h-full w-full rounded-md"
                    alt="User Avatar"
                  />
                ) : userDetails?.data?.profile_image ? (
                  <img
                    src={`http://localhost:3000/${userDetails?.data?.profile_image}`}
                    className="h-full w-full rounded-md"
                    alt="User Avatar"
                  />
                ) : (
                  <img
                    src="placeholder.jpg"
                    className="h-full w-full rounded-md"
                    alt="User Avatar"
                  />
                )}
              </div>

              <div className="flex gap-12 mt-5">
                <div className="mb-5">
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    {...register("first_name")}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  />
                  {(editUserReducer.firstNameStatus) && <p className='text-red-900'>**First name length sould be greater than 2**</p>}
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="last_name"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    {...register("last_name")}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  />
                  {(editUserReducer.lastNameStatus) && <p className='text-red-900'>**last name length sould be greater than 2**</p>}
                </div>
              </div>

              {userDetails?.data?.phone_num?.number == 0 ||
              userDetails?.data?.phone_num?.number_verified == false ? (
                <div className="mb-5">
                  <label
                    htmlFor="phone_num"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Enter your Mobile Number
                  </label>
                  <div className='phone-num-container flex gap-2 items-center'>          
                    <div className='select-country-container grow'>
                      <Select options={countries} onChange={handleChange} />
                    </div>

                      <input
                        type="number"
                        id="phone_num"
                        name="phone_num"
                        {...register("phone_num")}
                        className="no-spinner shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[60%]  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      />
                  </div>
                  {(editUserReducer.mobileNumStatus) && <p className='text-red-900'>**Phone_num length must be 10**</p>}
                </div>
              ) : null}

              <div className="mb-5">
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  {...register("file")}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                />
              </div>

              <div className="flex justify-between gap-4 mb-4">
              <button
                  type="submit"
                  className="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={(event)=>handleEnableGoogleAuth(event)}
                >
                 Enable Google Auth and get QR code
                </button>
              <button
                  type="submit"
                  className="block text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
                  onClick={(event)=>handleDisableGoogleAuth(event)}
                >
                 Disable Google Auth and get QR code
                </button>
              </div>
               
              <hr />
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="block w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Update details
                </button>
                
              </div>
             
            </form>
            {toggleQrCode &&  <div className="absolute top-[30%]  left-[14vw]">
              <h3 className="text-white text-xl font-medium my-4 border border-gray-500 p-3 rounded-md">Please Scan this QR code with <br /> your google Auth App</h3>
            <img
             src={qrCodeResponse?.data?.qrcode}
             alt=""
     />
            </div>}
          </>
        )}
      </div>
    </>
  );
};

export default EditUserDetails;
