import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  maxContactId: number;
  // contactSelectedEvent = new EventEmitter<Contact>();
  // contactChangedEvent = new EventEmitter<Contact[]>();

  contactListChangedEvent = new Subject<Contact[]>();

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    return this.contacts.slice(); // return a new copy of the contacts array
  }

  getContact(id: string): Contact {
    // for (var eachContact of this.contacts) {
    //   return eachContact.id === id ? eachContact : null;
    // } why this wouldn't work?
    return this.contacts.find((contact) => contact.id === id);
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getMaxId(): number {
    var maxId = 0;

    this.contacts.forEach((contact) => {
      var currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId;
  }

  // create a new contact to add
  addContact(newContact: Contact) {
    if (newContact == null || newContact == undefined) {
      return;
    }

    this.maxContactId++; // incrase one because we are adding a new contact
    newContact.id = this.maxContactId.toString(); // must convert the "maxContactId" into string before we can assing it
    this.contacts.push(newContact); // add this new contact to the original contacts data
    const contactsListClone = this.contacts.slice(); // make a copy of the new contacts data
    this.contactListChangedEvent.next(contactsListClone); // return the new copy of the new contacts data
  }

  // update the existing contact with updated info
  updateContact(originalContact: Contact, newContact: Contact) {
    // if one of them is "undefined" or "null", then just return
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    // check if we are getting a valid pos
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id; // we are updating the same contact so the "id" should stay the same
    this.contacts[pos] = newContact; // save the newContact to "replace" the original one in the "contacts"
    const contactsListClone = this.contacts.slice(); // make a copy of the entire "contacts"
    this.contactListChangedEvent.next(contactsListClone); // "emit" or "pass" the new copy of the entire "contacts" to the "contact list"
  }
}
