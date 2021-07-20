import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/posts.models';
import { AppState } from 'src/app/store/app.state';
import { deletePost, loadPosts } from '../state/posts.actions';
import { getPosts } from '../state/posts.selector';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {
  posts: Observable<Post[]>;
  
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    console.log("getPosts from store")
    this.posts = this.store.select(getPosts);
    this.store.dispatch(loadPosts());
  }

  onDelete(id: string|undefined) {
    if(confirm('Are you sure you want to delete ? ')) {
      console.log("Delete the post");
      this.store.dispatch(deletePost({ id }));
      // this.store.dispatch(updatePost({ post }));
    }
  }

}
