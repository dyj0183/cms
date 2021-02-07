import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})

export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('message') message: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  // currentSender = 'Brother Thayne';
  currentSender = '1';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const messageValue = this.message.nativeElement.value;

    const message = new Message (
      '1',
      subjectValue,
      messageValue,
      this.currentSender
    );

    this.addMessageEvent.emit(message);

    this.onClear();

    this.messageService.addMessage(message);
  }

  onClear() {
    this.subject.nativeElement.value = "";
    this.message.nativeElement.value = "";
  }

}
