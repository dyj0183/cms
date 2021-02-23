import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css'],
})
export class ContactDetailComponent implements OnInit {
  contactDetail: Contact;
  id: string;
  // @Input() contactDetail: Contact;
  // contact: Contact =
  // new Contact('1', 'Brother Barzee', 'barzeer@byui.edu', '200-222-3232', "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/1200px-Outdoors-man-portrait_%28cropped%29.jpg", null);

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // get id from the router (app-routiing.module)
    this.route.params.subscribe((params: Params) => {
      this.id = params['id']; // I can do params.id as well
      this.contactDetail = this.contactService.getContact(this.id);
    });
  }

  onDelete() {
    this.contactService.deleteContact(this.contactDetail);
    this.router.navigateByUrl('/contacts');
  }
}
