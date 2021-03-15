import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact; // unedited version
  contact: Contact; // edited version in the form
  editMode: boolean = false;
  contactId: string;
  newContact: Contact;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.contactId = params['id'];

      if (!this.contactId) {
        // if this id is not found, that means it is used to add the new contact instead of editing
        this.editMode = false; // so the editmode should be false
        return;
      }

      this.originalContact = this.contactService.getContact(this.contactId); // if the id is not equal to null or empty, then it means the component is being used to edit an existing contact

      // check if the contact exists or we get the valid contact (check if it is null or undefined)
      if (this.originalContact == null || this.originalContact == undefined ) {
        return;
      }

      this.editMode = true; // we are going to edit the original contact
      // this "contact" will be used in the HTML form to prepopulate the data in the input fields
      // why don't we just use the originalContact's info for prepopulating?
      this.contact = JSON.parse(JSON.stringify(this.originalContact)); // stringify => from JS object to string, "parse" returns a new JSON object
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value; // get values from form's fields

    // create a new contact, the "id" value doesn't really matter here because we will have check and update that in both "addContact" and "updateContact" functions
    this.newContact = new Contact("100", value.name, value.email, value.phone, value.imageUrl, []);

    // if the edit mode is true, then we want to call the edit function, otherwise, call the addContact function
    if (this.editMode == true) {
      this.contactService.updateContact(this.originalContact, this.newContact);
    } else {
      this.contactService.addContact(this.newContact);
    }

    // after we are done, route back to the main page: '/contacts' URL
    this.router.navigateByUrl('/contacts');
  }

  onCancel() {
    // route back to the '/contacts' URL which is the main page for contacts
    this.router.navigateByUrl('/contacts');
  }
}
