import React from 'react'
import Index from './components/Index'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <>
     <ToastContainer />
      <Index />
    </>
  )
}

export default App
