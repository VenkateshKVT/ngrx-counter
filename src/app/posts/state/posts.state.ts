import { Post } from "src/app/models/posts.models";

export interface PostsState {
    posts: Post[];
}

export const initialState = {
    posts: [
           ]
}