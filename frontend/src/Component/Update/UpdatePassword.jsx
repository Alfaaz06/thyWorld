import React from 'react'
import './UpdatePassword.css'
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../Loader/Loader';
import { updatePassword } from '../../Actions/User';

export const UpdatePassword = () => {

    
    const { loading,error, message } = useSelector((state) => state.like);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();


    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(updatePassword(oldPassword, newPassword));
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }
        if (message) {
            alert.success(message);
            dispatch({ type: "clearMessage" });
        }

    }, [dispatch, alert, error, message])

    return <>
        {
            loading ? <Loader /> : (<>
                <Typography variant='h2' sx={{ marginLeft: "2vmax", marginTop:"2vmax" }}  >Update Password</Typography>
                <div className="updatePassword" onSubmit={submitHandler} >
                    <form className="updatePasswordForm">
                        <input type="password" placeholder='Old Password' required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        <input type="password" placeholder='Create a new Password' required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <Button disabled={loading} type="submit" >Update Password</Button>
                    </form>
                </div>
            </>)
        }
    </>
}