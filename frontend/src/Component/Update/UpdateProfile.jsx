import { Avatar, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, updateProfile } from '../../Actions/User';
import { Loader } from '../Loader/Loader';
import './UpdateProfile.css'

export const UpdateProfile = ({history}) => {

    const { loading, error, user } = useSelector((state) => state.user);
    const { loading: loadingUpdate, error: errorUpdate, message } = useSelector((state) => state.like);

    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState(user.name);
    const [avatar, SetAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar.url);

    const alert = useAlert();
    const dispatch = useDispatch();


    const updateHandler = async (e) => {
        e.preventDefault();
        await dispatch(updateProfile(name, email, avatar));
        dispatch(loadUser())
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.readyState === 2) {
                SetAvatar(reader.result)
                setAvatarPreview(reader.result)
            }
        }
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }
        if (errorUpdate) {
            alert.error(errorUpdate);
            dispatch({ type: "clearErrors" });
        }
        if (message) {
            alert.success(message);
            dispatch({ type: "clearMessage" });
        }

    }, [dispatch, alert, error, message, errorUpdate,history])

    return <>
        {
            loading ? <Loader /> : (<>
                <Typography variant='h2' sx={{ marginLeft: "2vmax" }}  >Edit Profile</Typography>
                <div className="update" onSubmit={updateHandler} >
                    <form className="updateForm">
                        <div className="avatar">
                            <Avatar src={avatarPreview} alt="User" sx={{ height: "10vmax", width: "10vmax" }} />
                            <input type="file" accept='image/*' onChange={handleImageChange} />
                        </div>
                        <input type="name" placeholder='Enter your Name' required value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" placeholder='Enter your Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Button disabled={loadingUpdate} type="submit" >Update Information</Button>
                    </form>
                </div>
            </>)
        }
    </>
}
