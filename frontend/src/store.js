import { configureStore } from "@reduxjs/toolkit"
import { likeReducer, myPostReducers, userPostReducers } from "./Reducers/postReducer";
import { allUsersReducers, postOfFollowingReducers, userProfileReducer, userReducer } from "./Reducers/userReducer";

export const store = configureStore({
    reducer: {
        user: userReducer,
        postOfFollowing: postOfFollowingReducers,
        allUsers: allUsersReducers,
        like: likeReducer,
        myPosts: myPostReducers,
        userProfile: userProfileReducer,
        userPosts: userPostReducers
    }
});