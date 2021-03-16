import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): any {
    const filteredArray: Contact[] = []; // this will be the array list that contains all the filtered array

    if (term && term.length > 0) {
      contacts.forEach((contact) => {
        if (contact.name.toLowerCase().includes(term.toLowerCase())) {
          filteredArray.push(contact); // if it matches, then push it to the filteredArray list
        }
      });
    }

    if (filteredArray.length < 1) {
      return contacts; // if the search found nothing, then just retunr the original list of arrys
    } else {
      return filteredArray;
    }
  }
}
