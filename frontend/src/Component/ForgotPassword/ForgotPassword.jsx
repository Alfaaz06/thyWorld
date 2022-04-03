import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../Actions/User';
import './ForgotPassword.css'

export const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const alert=useAlert ();
    const {error,loading,message}=useSelector((state)=>state.like);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    }

    useEffect(() => {
        if (error) {
          alert.error(error);
          dispatch({ type: 'clearErrors' });
        }
        if (message) {
          alert.success(message);
          dispatch({ type: 'clearMessage' });
        }
      }, [alert, error, dispatch,message]);

    return <>
        <Typography variant='h2' sx={{ marginLeft: "2vmax", marginTop: "2vmax" }}  >Update Password</Typography>
        <div className="forgotPassword" onSubmit={submitHandler} >
            <form className="forgotPasswordForm">
                <input type="email" placeholder='Enter your email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button disabled={loading} type="submit" >Send Token</Button>
            </form>
        </div>
    </>
}
