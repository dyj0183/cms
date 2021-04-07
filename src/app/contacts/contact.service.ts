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
  private databaseUrl = 'http://localhost:3000/contacts/';

  constructor(private http: HttpClient) {}

  sortAndSend() {
    this.contacts = this.contacts.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : b.name.toLowerCase() > a.name.toLowerCase()
        ? -1
        : 0
    );

    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getContacts() {
    this.http
      .get<{ message: String; contacts: Contact[] }>(this.databaseUrl)
      .subscribe(
        (res: any) => {
          this.contacts = res.contacts;
          this.sortAndSend();
        },
        (error) => {
          console.log('Contact Error: ' + error);
        }
      );
  }

  getContact(id: string): Contact {
    // for (var eachContact of this.contacts) {
    //   return eachContact.id === id ? eachContact : null;
    // } why this wouldn't work?
    return this.contacts.find((contact) => contact.id === id);
  }

  deleteContact(contacts: Contact) {
    if (!contacts) {
      return;
    }

    const pos = this.contacts.indexOf(contacts);
    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete(this.databaseUrl + contacts.id)
      .subscribe((response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      });
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
    if (!newContact) return;

    // Removing id if it exists (db sets this)
    newContact.id = '';

    // setting headers for the http post
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; contact: Contact }>(
        this.databaseUrl,
        newContact,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new contact to contacts
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      });
  }

  // update the existing contact with updated info
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;

    // Setting header
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(this.databaseUrl + originalContact.id, newContact, {
        headers: headers,
      })
      .subscribe((response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      });
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
