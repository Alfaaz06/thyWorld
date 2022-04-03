import React, { useEffect } from "react"
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import { Header } from "./Component/Header/Header"
import { Login } from "./Component/Login/Login"
import {Home} from './Component/Home/Home'
import './App.css'
import { useDispatch, useSelector } from "react-redux"
import { loadUser } from "./Actions/User"
import { Account } from "./Component/Account/Account"
import { NewPost } from "./Component/NewPost/NewPost"
import { Register } from "./Component/Register/Register"
import { UpdateProfile } from "./Component/Update/UpdateProfile"
import { UpdatePassword } from "./Component/Update/UpdatePassword"
import { ForgotPassword } from "./Component/ForgotPassword/ForgotPassword"
import { ResetPassword } from "./Component/Reset/ResetPassword"
import { UserProfile } from "./Component/UserProfile/UserProfile"
import { Search } from "./Component/Search/Search"
import { NotFound } from "./Component/NotFound/NotFound"

export const App = () => {
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(loadUser());
  },[dispatch])

  const { isAuthenticated } = useSelector((state)=>state.user);

  return <>
  <Router>
   { isAuthenticated  && <Header/>}
    <Routes>
      <Route path="/" element={isAuthenticated ? <Home/>:<Login/> } />
      <Route path="/account" element={isAuthenticated ? <Account/>:<Login/> } />
      <Route path="/newpost" element={isAuthenticated ? <NewPost/>:<Login/> } />
      <Route path="/register" element={isAuthenticated ? <Account/>:<Register/> } />
      <Route path="/update/Profile" element={isAuthenticated ? <UpdateProfile/>:<Login/> } />
      <Route path="/update/password" element={isAuthenticated ? <UpdatePassword/>:<Login/> } />
      <Route path="/forgot/password" element={isAuthenticated ? <UpdatePassword/>:<ForgotPassword/> } />
      <Route path="/password/reset/:token" element={isAuthenticated ? <UpdatePassword/>:<ResetPassword/> } />
      <Route path="/user/:id" element={isAuthenticated ? <UserProfile/>:<Login/> } />
      <Route path="/search" element={isAuthenticated ? <Search/>:<Login/> } />
      <Route  path="*"  element={<NotFound/>} />
    </Routes>
  </Router>
  </>
}
