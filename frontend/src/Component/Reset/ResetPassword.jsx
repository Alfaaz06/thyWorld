import { Typography, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { resetPassword } from '../../Actions/User'
import './ResetPassword.css'

export const ResetPassword = () => {

    const {error,loading,message}=useSelector((state)=>state.like);

 
    const dispatch = useDispatch();
    const params = useParams();
    const alert = useAlert();
    const [password, setPassword] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(resetPassword(params.token, password));
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
        },[alert,error,dispatch,message]);

    return <>
        <Typography variant='h2' sx={{ marginLeft: "2vmax", marginTop: "2vmax" }}  >Reset Password</Typography>
        <div className="resetPassword" onSubmit={submitHandler} >
            <form className="resetPasswordForm">
                <input type="password" placeholder='Create Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                <Link to="/" style={{textDecoration:"none"}} ><Typography>Login</Typography></Link>
                <Typography>Or</Typography>
                <Link to="/forgot/password" style={{textDecoration:"none"}} ><Typography>Send Another Token</Typography></Link>
                <Button disabled={loading}  type="submit" >Reset Password</Button>
            </form>
        </div>
    </>
}
