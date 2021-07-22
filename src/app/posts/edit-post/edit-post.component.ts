import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/posts.models';
import { updatePost } from '../state/posts.actions';
import { getPostById } from '../state/posts.selector';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit, OnDestroy {
  post: Post;
  postForm: FormGroup;
  postSubscription: Subscription;
  constructor(private route: ActivatedRoute, private store: Store, private router: Router) { }

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params) => {
    //   const id = params.get('id');

    //   this.postSubscription = this.store.select(getPostById, { id }).subscribe((data: any) => {
    //     this.post = data;
    //     this.createForm();
    //   })
    // });
    this.createForm();
    this.postSubscription  = this.store.select(getPostById).subscribe((post : any) => {
      if(post) {
        this.post = post;
        this.postForm?.patchValue({
          title: post?.title,
          description: post?.description
        });
      }
    });
  }

  public createForm() {
      this.postForm = new FormGroup({
        title: new FormControl(null, [
          Validators.required,
          Validators.minLength(6)
        ]),
        description: new FormControl(null, [
          Validators.required,
          Validators.minLength(6)
        ])
      });
    console.log("edit comp =>", this.postForm)
  }

  public updateForm() {
    console.log("findInvalidControls => ", this.findInvalidControls());
    console.log("length desc =>", (this.postForm.value.description).length);
    if (!this.postForm.valid) {
      return;
    }

    const title = this.postForm.value.title;
    const description = this.postForm.value.description;

    const post: Post = {
      id: this.post.id,
      title: title,
      description: description
    }
    console.log("Dispatch updated action =>", post);
    this.store.dispatch(updatePost({ post }));
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.postForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
