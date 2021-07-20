import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { Post } from "src/app/models/posts.models";
import { PostsService } from "src/app/services/posts.service";
import { loadPosts, loadPostSuccess, LOAD_POSTS_SUCCESS } from "./posts.actions";

@Injectable()

export class PostsEffects {
    constructor(private actions$: Actions, private postsService: PostsService) {

    }

    loadPosts$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadPosts),
            mergeMap(() => {
                return this.postsService.getPosts().pipe(
                    map((posts) => {
                        return loadPostSuccess({posts});
                    })
                );                
            })
        )
    });
}