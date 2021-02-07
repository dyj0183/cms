import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice(); // return a new copy of the contacts array
  }

  getContact(id: string): Contact {
    // for (var eachContact of this.contacts) {
    //   return eachContact.id === id ? eachContact : null;
    // }
    return this.contacts.find((contact) => contact.id === id);
  }
}
