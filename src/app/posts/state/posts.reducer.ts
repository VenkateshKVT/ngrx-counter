import { createReducer, on } from '@ngrx/store';
import { Post } from 'src/app/models/posts.models';
import { addPost, updatePost, deletePost } from './posts.actions';
import { initialState } from './posts.state';

const _postsReducer = createReducer(
    initialState,
    on(addPost, (state, action) => {
        let post = { ...action.post } as any;
        post.id = ((state.posts.length + 1).toString() || '');
        return {
            ...state,
            posts: [...state.posts, post],
        }
    }),
    on(updatePost, (state: any, action: any) => {
        console.log("upadtedPost =>", action);
        const updatedPost = state.posts.map((post: any) => {
            return action.post.id === post.id ? action.post : post;
        });
        console.log('updatedposts => ', updatedPost);
        return {
            ...state,
            posts: updatedPost,
        }
    }),
    on(deletePost, (state: any, action: any) => {
      console.log("deletePost reducer =>", action);
      const updatedPosts = state.posts.filter((post: any) => {
            return post.id !== action.id; 
      })
      return {
        ...state,
        posts: updatedPosts,
    }
    }));

export function postsReducer(state: any, action: any) {
    return _postsReducer(state, action);
}