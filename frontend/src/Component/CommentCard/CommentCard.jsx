import { Button, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import './CommentCard.css'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCommentonPost } from '../../Actions/post'
import { getFollowingPosts, getMyPosts } from '../../Actions/User'

export const CommentCard = ({
    userId, comment, name, avatar, commentId, postId, isAccount
}) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const deleteCommentHandler = () => {
        dispatch(deleteCommentonPost(postId, commentId));
        if (isAccount) dispatch(getMyPosts())
        else dispatch(getFollowingPosts());
        dispatch(getFollowingPosts())
    }
    return <>
        <div className="commentUserBox">
            <div className="commentUser">
                <Link to={'/user/${userId'}>
                    <img src={avatar} alt="name" />
                    <Typography style={{ minWidth: "6vmax" }} >
                        {name}
                    </Typography>
                </Link>
                <Typography>
                    {comment}
                </Typography>
            </div>
            {
                isAccount ? (<Button onClick={deleteCommentHandler}>{`Remove`}</Button>) : (userId === user._id) ? <Button onClick={deleteCommentHandler}>{`Remove`}</Button> : null
            }
        </div>
    </>
}
