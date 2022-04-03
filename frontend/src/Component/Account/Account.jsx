import { Avatar, Button, Dialog, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMyPosts, logoutUser } from '../../Actions/User';
import { Loader } from '../Loader/Loader';
import { Post } from '../Post/Post';
import './Account.css'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom';
import { User } from '../User/User';
import {deleteProfile} from '../../Actions/User'

export const Account = () => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, posts, error } = useSelector((state) => state.myPosts);
    const { error: likeError, message,loading:deleteLoading } = useSelector((state) => state.like);
    const { user, loading: userLoading } = useSelector((state) => state.user);
    const [followersToggle,setFollowersToggle]=useState(false);
    const [followingToggle,setFollowingToggle]=useState(false);
    
    const  logoutHandler=async()=>{
        await dispatch(logoutUser())
        alert.success(`Logged out successfully`);
    }

    const deleteProfileHandler=async()=>{
        await dispatch(deleteProfile());
        dispatch(logoutUser());
    }

    useEffect(() => {
        dispatch(getMyPosts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: 'clearError' });
        }
        if (likeError) {
            alert.error(likeError);
            dispatch({ type: 'clearError' });
        }
        if (message) {
            alert.success(message);
            dispatch({ type: 'clearMessage' })
        }
    }, [alert, error, message, dispatch, likeError]);



    return loading === true || userLoading === true ? (<Loader />) : (<>
        <div className="account">
            <div className="accountleft">
                {
                    posts && posts.length > 0 ? posts.map((post) => (
                        <Post
                            key={post._id}
                            postId={post._id}
                            caption={post.caption}
                            postImage={post.image.url}
                            likes={post.likes}
                            comments={post.comments}
                            ownerImage={post.owner.avatar.url}
                            ownerName={post.owner.name}
                            ownerId={post.owner._id}
                            isAccount={true}
                            isDelete={true}
                        />
                    )) : (<Typography>You have no posts.</Typography>)
                }
            </div>
            <div className="accountright">
                <Avatar src={user.avatar.url}
                    sx={{ height: "7vmax", width: "7vmax", borderRadius: "50%" }} />
                <Typography variant='h5'>{user.name}</Typography>
                <div>
                    <button onClick={() =>  setFollowersToggle(!followersToggle)} >
                        <Typography>Followers</Typography>
                    </button>
                    <Typography>{user.followers.length}</Typography>
                </div>
                <div>
                    <button onClick={() =>  setFollowingToggle(!followingToggle)} >
                        <Typography>Following</Typography>
                    </button>
                    <Typography>{user.following.length}</Typography>
                </div>
                <div>
                    <Typography>Post</Typography>
                    <Typography>{user.posts.length}</Typography>
                </div>
                <Button variant="contained"  onClick={logoutHandler}  >Logout</Button>
                <Link to="/update/profile">Edit Profile</Link>
                <Link to="/update/password">Change Password</Link>
                <Button disabled={deleteLoading} variant="text" style={{color:"red",margin:"2vmax"}} onClick={deleteProfileHandler}  >
                    DELETE MY PROFILE
                </Button>
                <Dialog open={followersToggle} onClose={() =>  setFollowersToggle(!followersToggle)}>
                <div className="DialogBox">
                    <Typography variant="h4">Followers</Typography>
                    {
                        user && user.followers.length > 0 ? user.followers.map((follower) => (
                            <User
                                key={follower._id}
                                userId={follower._id}
                                name={follower.name}
                                avatar={"data:image/jpeg;base64,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"}
                            />
                        )):(<Typography>No Followers to show</Typography>)
                    }
                </div>
            </Dialog>
            <Dialog open={followingToggle} onClose={() =>  setFollowingToggle(!followingToggle)}>
                <div className="DialogBox">
                    <Typography variant="h4">Following</Typography>
                    {
                        user && user.following.length > 0 ? user.following.map((following) => (
                            <User
                                key={following._id}
                                userId={following._id}
                                name={following.name}
                                avatar={following.avatar.url}
                            />
                        )):(<Typography>No Following to show</Typography>)
                    }
                </div>
            </Dialog>
            </div>
        </div>
    </>)
}
