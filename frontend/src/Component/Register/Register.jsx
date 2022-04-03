import { Avatar, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../../Actions/User';
import signup from '../../images/signup.svg'
import './Register.css'


export const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [avatar, SetAvatar] = useState(null);

    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const registerHandler = (e) => {
        e.preventDefault();
        console.log(email, password, name, avatar);
        dispatch(registerUser(name, email, password, avatar));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.readyState === 2) {
                SetAvatar(reader.result)
            }
        }
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }

    }, [dispatch, alert, error])

    return <>
        <div className="registerBanner">
            <div className="slogan">
                <Typography variant='h2' >thyWorld</Typography>
                <Typography>Capture moments and  <br /> Connect with your family and friends.</Typography>
            </div>
        </div>
        <div className="register" onSubmit={registerHandler} >
            <form className="registerForm">
                <p>Register Form</p>
                <div className="avatar">
                    <Avatar src={avatar} alt="User" sx={{ height: "8vmax", width: "8vmax" }} />
                    <input type="file" accept='image/*' onChange={handleImageChange} />
                </div>
                <input type="name" placeholder='First & Last Name' required value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='Your Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button disabled={loading} type="submit" >Register</Button>
                <Link to="/"><Typography>Already a user? LOGIN</Typography></Link>
            </form>
            <div className="auth">
                <img src={signup} alt="svg" />
            </div>
        </div>
    </>
}
