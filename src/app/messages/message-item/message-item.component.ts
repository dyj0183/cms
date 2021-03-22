// import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})

export class MessageItemComponent implements OnInit {
  @Input() messageItem: Message;
  messageSender: String = ""

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    const contact: Contact = this.contactService.getContact(this.messageItem.sender);
    this.messageSender = contact.name;
  }
}
