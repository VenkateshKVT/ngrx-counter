import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { customIncrement } from '../state/counter.action';
import { getChannelName } from '../state/counter.selector';
import { CounterState } from '../state/counter.state';

@Component({
  selector: 'app-custom-counter-input',
  templateUrl: './custom-counter-input.component.html',
  styleUrls: ['./custom-counter-input.component.css']
})
export class CustomCounterInputComponent implements OnInit {

  public value: number;
  public channelName: string;
  constructor(private store: Store<AppState>) { }
  ngOnInit(): void {
    this.store.select(getChannelName).subscribe((data) => {
      this.channelName = data;
    })
  }

  onAdd() {
    this.store.dispatch(customIncrement({value: this.value}));
  }
}
