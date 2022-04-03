import { Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../Actions/User'
import { useAlert } from 'react-alert'

export const Login = () => {

  const {error}=useSelector((state)=>state.user);
  const {message}=useSelector((state)=>state.like);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const alert=useAlert();

  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password))
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: 'clearMessage' });
    }
  }, [alert, error, dispatch,message]);

  return <>
    <div className="login">
      <form className="loginForm" onSubmit={loginHandler} >
        <Typography variant='h3' style={{ padding: "2vmax", color: "white" }} >Login</Typography>
        <input type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Link to="/forgot/password"><Typography>Forgot Password?</Typography></Link>
        <Button type='submit'>Login</Button>
        <Link to="/register"><Typography>New User? Click to Register</Typography></Link>
      </form>
    </div>
  </>
}
