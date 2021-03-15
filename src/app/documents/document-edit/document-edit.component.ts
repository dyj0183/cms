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

  originalDocument: Document; // unedited version
  document: Document; // edited version in the form
  editMode: boolean = false;
  documentId: string;
  // value: object;
  newDocument: Document

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.documentId = params['id']
      if (!this.documentId) { // if this id is not found, that means it is used to add the new document instead of editing
        this.editMode = false; // so the editmode should be false
        return;
      }

      this.originalDocument = this.documentService.getDocument(this.documentId); // if the id is not equal to null or empty, then it means the component is being used to edit an existing document

      if (this.originalDocument == null) {
        return;
      }

      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument)); // stringify => from JS object to string, "parse" returns a new JSON object
    });
  }

  // receive the 'f' form from the angular which is a NgForm that is also a javascript form object
  onSubmit(form: NgForm) {
    const value = form.value; // get values from form's fields

    this.newDocument = new Document("100", value.name, value.description, value.url, []);

    if (this.editMode == true) {
      this.documentService.updateDocument(this.originalDocument, this.newDocument);
    } else {
      this.documentService.addDocument(this.newDocument);
    }

    console.log(form); // this will show us the javascript object of the form

    // route back to the '/documents' URL
    this.router.navigateByUrl('/documents');
  }

  onCancel() {
    // route back to the '/documents' URL
    this.router.navigateByUrl('/documents');
  }
}
