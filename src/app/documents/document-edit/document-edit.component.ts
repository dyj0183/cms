import { Component, OnInit, ViewChild } from '@angular/core';
import { Document } from '../document.model';
import { NgForm } from '@angular/forms';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css'],
})
export class DocumentEditComponent implements OnInit {
  // @ViewChild('f') signupForm: NgForm; // if we don't put 'f' in our onSubmit function, this is another way for us to access the form

  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  documentId: string;
  value: object;
  newDocument: Document

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.documentId = params['id']
      if (this.documentId == null) {
        this.editMode = false;
        return;
      }

      this.originalDocument = this.documentService.getDocument(this.documentId); // if the id is not equal to null or empty, then it means the user is editing an existing document

      if (this.originalDocument == null) {
        return;
      }

      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument)); // stringify => from JS object to string,
    });
  }

  // receive the 'f' form from the angular which is a NgForm that is also a javascript form object
  onSubmit(form: NgForm) {
    this.value = form.value; // get values from form's fields
    // this.newDocument = new Document("100", this.value.name, this.value.description, this.value.url);

    if (this.editMode == true) {

    }
    console.log(form);
  }

  onCancel() {}
}
