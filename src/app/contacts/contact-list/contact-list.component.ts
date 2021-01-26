import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts: Contact[] = [
    new Contact("1", "R.Kent Jackson", "jacksonk@byui.edu", "208-496-3771", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/1200px-Outdoors-man-portrait_%28cropped%29.jpg", null),
    new Contact("2", "Rex Barzee", "barzeer@byui.edu", "208-496-3768", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/1200px-Outdoors-man-portrait_%28cropped%29.jpg", null)
  ]

  @Output() selectedContactEvent = new EventEmitter<Contact>();

  onSelected (contact: Contact) {
    this.selectedContactEvent.emit(contact); // send the contact data to the parent based on the one the user clicks on
  }

  constructor() { }

  ngOnInit(): void {
  }

}
