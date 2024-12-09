import React from 'react'
import NavBar from "./NavBar";
import Home from './Home';
import Categories from './Categories';
import CompletedTodos from './CompletedTodos';
import Todo from './Todo';
import Login from "./Login"
import SignUp from "./SignUp"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditUserDetails from './EditUserDetails';


const Index = () => {
  return (
    <>
    <BrowserRouter>
      <NavBar/>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/createtodo" element={<Todo />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/completedtodos" element={<CompletedTodos/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/edit" element={<EditUserDetails/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default Index
