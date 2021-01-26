// import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})

export class MessageItemComponent implements OnInit {
  @Input() messageItem: Message;

  constructor() { }

  ngOnInit(): void {
  }

}
