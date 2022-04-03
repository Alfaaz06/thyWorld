import { Button, Typography } from '@mui/material';
import React, {useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, loadUser } from '../../Actions/User';
import { Loader } from '../Loader/Loader';
import { User } from '../User/User';
import './Search.css'

export const Search = ({ history }) => {

    const { users, loading } = useSelector((state) => state.allUsers);

    const [name, setName] = useState("");

    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(getAllUsers(name))
        dispatch(loadUser())
    }

    return <>
        {
            loading ? <Loader /> : (<>
                <Typography variant='h2' sx={{ marginLeft: "2vmax" }}  >Search</Typography>
                <div className="search" onSubmit={submitHandler} >
                    <form className="searchForm">
                        <input type="text" placeholder='Search a User' required value={name} onChange={(e) => setName(e.target.value)} />
                        <Button disabled={loading} type="submit" >Search</Button>
                        <div className="searchResult">
                            {users && users.map((user) => (
                                <User
                                    key={user._id}
                                    userId={user._id}
                                    name={user.name}
                                    avatar={user.avatar.url}
                                />
                            ))}
                        </div>
                    </form>
                </div>
            </>)
        }
    </>
}
