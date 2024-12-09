import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const categoriesApi= createApi({
    reducerPath : "categories",
    baseQuery : fetchBaseQuery({baseUrl:import.meta.env.VITE_API_URL}),
    endpoints: (builder)=> ({
              
        getCategories: builder.mutation({
            query : (token)=>({
                url: `category/getcategories?page=1&limit=20`,
                method: "GET",
                headers: { "Content-Type": "application/json",  'Authorization': `Bearer ${token}` },
            })
        }),

        addCategoriesApi: builder.mutation({
            query : (data)=>(console.log(data),{
                url: `category/addcategory`,
                method: "POST",
                headers: { "Content-Type": "application/json",  'Authorization': `Bearer ${data.token}` },
                body: data.formData
            })
        }),
        deleteCategoriesApi: builder.mutation({
            query : (data)=>({
                url: `category/deletecategory`,
                method: "DELETE",
                headers: { "Content-Type": "application/json",  'Authorization': `Bearer ${data.token}` },
                body: {category_name: data.category_name}
            })
        }),
        editCategoriesApi: builder.mutation({
            query : (data)=>({
                url: `category/editcategory`,
                method: "PATCH",
                headers: { "Content-Type": "application/json",  'Authorization': `Bearer ${data.token}` },
                body: {category_name: data.category_name, new_name:data.new_name }
            })
        }),

    })
})

export const {useGetCategoriesMutation, useAddCategoriesApiMutation, useDeleteCategoriesApiMutation, useEditCategoriesApiMutation} = categoriesApi