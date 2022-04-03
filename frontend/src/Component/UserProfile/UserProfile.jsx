import { Avatar, Button, Dialog, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserPosts, getUserProfile } from '../../Actions/User';
import { Loader } from '../Loader/Loader';
import { Post } from '../Post/Post';
import { useAlert } from 'react-alert'
import { useParams } from 'react-router-dom';
import { User } from '../User/User';
import { followAndUnfollowUser } from '../../Actions/post';

export const UserProfile = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();

    const { loading, posts, error } = useSelector((state) => state.userPosts);
    const { user: me } = useSelector((state) => state.user);
    const { user, loading: userLoading,error:userError } = useSelector((state) => state.userProfile);
    const {error:followError,message,loading:followLoding}=useSelector((state)=>state.like);

    const [followersToggle, setFollowersToggle] = useState(false);
    const [followingToggle, setFollowingToggle] = useState(false);
    const [following, setFollowing] = useState(false);
    const [myProfile, setMyProfile] = useState(false);

    const followHandler = () => {
        setFollowing(!following);
        dispatch(followAndUnfollowUser(user._id));
        
    }

    useEffect(() => {
        dispatch(getUserPosts(params.id));
        dispatch(getUserProfile(params.id));
    }, [dispatch, params.id]);

    useEffect(() => {
        if (me._id === params.id) setMyProfile(true);

        if(user){
            user.followers.forEach((item)=>{
                if(item._id===me._id){
                    setFollowing(true);
                }else{
                    setFollowing(false);
                }
            })
        }
    }, [user,me._id,params.id]);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: 'clearError' });
        }
        if (followError) {
            alert.error(followError);
            dispatch({ type: 'clearError' });
        }
        if (userError) {
            alert.error(userError);
            dispatch({ type: 'clearError' });
        }
        if (message) {
            alert.success(message);
            dispatch({ type: 'clearMessage' })
        }
    }, [alert, error, message, dispatch,userError, followError]);



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
                        />
                    )) : (<Typography>User has not posted anything yet.</Typography>)
                }
            </div>
            <div className="accountright">
                {
                    user && (
                        <>
                            <Avatar src={user.avatar.url}
                                sx={{ height: "7vmax", width: "7vmax", borderRadius: "50%" }} />
                            <Typography variant='h5'>{user.name}</Typography>
                            <div>
                                <button onClick={() => setFollowersToggle(!followersToggle)} >
                                    <Typography>Followers</Typography>
                                </button>
                                <Typography>{user.followers.length}</Typography>
                            </div>
                            <div>
                                <button onClick={() => setFollowingToggle(!followingToggle)} >
                                    <Typography>Following</Typography>
                                </button>
                                <Typography>{user.following.length}</Typography>
                            </div>
                            <div>
                                <Typography>Post</Typography>
                                <Typography>{user.posts.length}</Typography>
                            </div>
                            {myProfile ? null : (<Button variant="contained" onClick={followHandler} disabled={followLoding}  >{following ? "Unfollow" : "Follow"}</Button>)}
                        </>
                    )
                }
                <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
                    <div className="DialogBox">
                        <Typography variant="h4">Followers</Typography>
                        {
                            user && user.followers.length > 0 ? user.followers.map((follower) => (
                                <User
                                    key={follower._id}
                                    userId={follower._id}
                                    name={follower.name}
                                    avatar={follower.avatar.url}
                                />
                            )) : (<Typography>No Followers to show</Typography>)
                        }
                    </div>
                </Dialog>
                <Dialog open={followingToggle} onClose={() => setFollowingToggle(!followingToggle)}>
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
                            )) : (<Typography>No Following to show</Typography>)
                        }
                    </div>
                </Dialog>
            </div>
        </div>
    </>)
}
