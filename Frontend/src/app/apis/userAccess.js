import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const userAccessApi= createApi({
    reducerPath : "userAccess",
    baseQuery : fetchBaseQuery({baseUrl:import.meta.env.VITE_API_URL}),
    endpoints: (builder)=> ({
       
        // getAllProducts : builder.query({
        //     query : ()=> "/products"
        // }),
        
        userRegister: builder.mutation({
            query : (userDetails)=>({
                url: `signup`,
                method: "POST",
                header: { "Content-Type": "multipart/form-data" },
                body:userDetails
            })
        }),
        userLogin: builder.mutation({
            query : (userDetails)=>({
                url: `signin`,
                method: "POST",
                header: { "Content-Type": "application/json"},
                body:userDetails
            })
        }),

        userValidate: builder.mutation({
            query : (token)=>({
                url: 'validate',
                method: "POST",
                headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` }
            })
        }),
    })
})

export const {useUserRegisterMutation, useUserLoginMutation, useUserValidateMutation } = userAccessApi