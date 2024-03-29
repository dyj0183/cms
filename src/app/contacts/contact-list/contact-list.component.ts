import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subscription: Subscription;
  term: string; // this term will be used for contacts-filter.pipe

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {

    // subscribe to the observable "Subject" in the service
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contactsList: Contact[]) => {
        this.contacts = contactsList;
      }
    );

    this.contactService.getContacts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // getContacts() {
  //   this.contacts = this.contactService.getContacts();
  // }

  // for the users to search professors in the contact list
  search(value: string) {
    this.term = value;
  }
}
