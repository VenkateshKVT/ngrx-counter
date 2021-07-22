import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Post } from "src/app/models/posts.models";
import { getCurrentRoute } from "src/app/store/router/router.selector";
import { PostsState } from "./posts.state";

export const POSTS_STATE_NAME = 'posts'
const getPostsState = createFeatureSelector<PostsState>(POSTS_STATE_NAME);

export const getPosts = createSelector(getPostsState, (state) => {
    return state.posts;
});

// export const getPostById = createSelector(getPostsState, (state: any, props: any) => {
//     return state.posts.find((post: Post) => post.id === props.id);
// });


export const getPostById = createSelector(getPosts, getCurrentRoute, (posts, route) => {
    return posts ? posts.find(post => post.id === route.params['id']) : null;
})