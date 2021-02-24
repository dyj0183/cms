import { Component, OnInit, ViewChild } from '@angular/core';
import { Document } from '../document.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  // @ViewChild('f') signupForm: NgForm; // if we don't put 'f' in our onSubmit function, this is another way for us to access the form

  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  // receive the 'f' form from the angular which is a NgForm that is also a javascript form object
  onSubmit(form: NgForm) {
    console.log(form);
  }

  onCancel() {

  }
}
