import { Post } from "src/app/models/posts.models";

export interface PostsState {
    posts: Post[];
}

export const initialState = {
    posts: [
        { id: '1', title: 'Sample post One', description: 'Description of post one '},
        { id: '2', title: 'Sample post Two', description: 'Description of post two '}
    ]
}