import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Post } from 'src/app/models/posts.models';
import { addPost } from '../state/posts.actions';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  postForm: FormGroup;
  
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ])
    })
  }

  showDescriptionErrors() {
   const descriptionForm = this.postForm.get('description');
   if(descriptionForm && descriptionForm.touched && !descriptionForm.valid) {
     if(descriptionForm && descriptionForm.errors && descriptionForm.errors.required) {
       return 'Description is required';
     }
     if(descriptionForm && descriptionForm.errors && descriptionForm.errors.minlength) {
      return 'Description Minlength is 10';
    }
   }
  }
  onAddPost() {
    if(!this.postForm.valid) {
      return;
    }

    const post: Post = {
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      id: ''
    }

    this.store.dispatch(addPost({ post }));
  }

}
