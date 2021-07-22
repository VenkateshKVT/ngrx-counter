import { createReducer, on } from '@ngrx/store';
import { Post } from 'src/app/models/posts.models';
import { addPost, updatePost, deletePost, loadPostSuccess, addPostSuccess, updatePostSuccess, deletePostsSuccess } from './posts.actions';
import { initialState } from './posts.state';

const _postsReducer = createReducer(
    initialState,
    on(addPostSuccess, (state: any, action: any) => {
        let post = { ...action.post } as any;
        return {
            ...state,
            posts: [...state.posts, post],
        }
    }),
    on(updatePostSuccess, (state: any, action: any) => {
        const updatedPost = state.posts.map((post: any) => {
            return action.post.id === post.id ? action.post : post;
        });
        return {
            ...state,
            posts: updatedPost,
        }
    }),
    on(deletePostsSuccess, (state: any, action: any) => {
      const updatedPosts = state.posts.filter((post: any) => {
            return post.id !== action.id; 
      })
      return {
        ...state,
        posts: updatedPosts,
    }
    }),
    on(loadPostSuccess, (state: any, action: any) => {
        return {
            ...state,
            posts: action.posts
        }
    })
    
);

export function postsReducer(state: any, action: any) {
    return _postsReducer(state, action);
}