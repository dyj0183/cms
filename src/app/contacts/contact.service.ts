import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  maxContactId: number;

  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {}

  getContacts() {
    this.http
      .get('https://angularcms-aa6ec-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        // success function
        (contacts: Contact[]) => {
          this.contacts = contacts; // assign the contacts we "get" from firebase to our local variable
          this.maxContactId = this.getMaxId(); // loop through each contact and get the max id

          // sort???
          this.contacts.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          this.contactListChangedEvent.next(this.contacts.slice()); // use "Subject" to emit the copy of updated contacts, so contact-list can use it
        },
        // error function
        (error: any) => {
          console.log(error);
        }
      );
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

    this.storeContacts();
    // this.contactListChangedEvent.next(this.contacts.slice());
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
    if (!newContact) {
      return;
    }

    this.maxContactId++; // incrase one because we are adding a new contact
    newContact.id = this.maxContactId.toString(); // must convert the "maxContactId" into string before we can assing it
    this.contacts.push(newContact); // add this new contact to the original contacts data

    this.storeContacts();
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

    this.storeContacts();
  }

  // this method will be called when a Contact object is added, updated, or deleted
  storeContacts() {
    // by now, "this.contacts" have been either added, deleted, or updated which means it is the most updated version
    let contactsJSON = JSON.stringify(this.contacts); // when sending data to web server, the data must be a string, convert javascript object into a string by using JSON.stringify()

    // headers???
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // use "put" to update
    this.http
      .put(
        'https://angularcms-aa6ec-default-rtdb.firebaseio.com/contacts.json',
        contactsJSON,
        { headers: headers }
      )
      .subscribe(() => {
        // put is unlike get, doesn't retunr anything
        this.contactListChangedEvent.next(this.contacts.slice()); // emit the most updated contacts for other components to use. we use observable "Subject" here which is why we use "next" instead of "emit"
      });
  }
}
