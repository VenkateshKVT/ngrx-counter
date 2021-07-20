import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { Post } from '../models/posts.models';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private _http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this._http
      .get<Post[]>(`https://vue-completecourse.firebaseio.com/posts.json`)
      .pipe(
        map((data: any) => {
          const posts: Post[] = [];
          for (let key in data) {
            posts.push({ ...data[key], id: key });
          }
          return posts;
        })
      );
  }

  addPost(post: Post): Observable<{ name: string }> {
    return this._http.post<{ name: string }>(
      `https://vue-completecourse.firebaseio.com/posts.json`,
      post
    );
  }

  updatePost(post: Post) {
    const postData = {
      [post.id]: { title: post.title, description: post.description },
    };
    return this._http.patch(
      `https://vue-completecourse.firebaseio.com/posts.json`,
      postData
    );
  }

  deletePost(id: string) {
    return this._http.delete(
      `https://vue-completecourse.firebaseio.com/posts/${id}.json`
    );
  }

  getPostById(id: string): Observable<Post> {
    return this._http.get<Post>(
      `https://vue-completecourse.firebaseio.com/posts/${id}.json`
    );
  }
}
