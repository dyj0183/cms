import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number;

  // we set it up here so that we can use later in different functions
  documentListChangedEvent = new Subject<Document[]>();

  // constructor, every time we start the program it will reset the codes we have inside
  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  // return the copy of all the documents data
  getDocuments(): Document[] {
    return this.documents.slice();
  }

  // return a specific document based on the "id" passed in
  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id);
  }

  // remove the "clicked" document from the "document list" and return a copy of the rest of the documents back
  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice()); // we use observable "Subject" here which is why we use "next" instead of "emit"
  }

  // find out the max id in the documents
  getMaxId(): number {
    var maxId = 0;

    this.documents.forEach((document) => {
      var currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    var test = "test";
    return maxId;
  }

  // create a new document to add
  addDocument(newDocument: Document) {
    if (newDocument == null || newDocument == undefined) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString(); // must convert the "maxDocumentId" into string before we can assing it
    this.documents.push(newDocument); // add this new document to the original doucments data
    var documentsListClone = this.documents.slice(); // make a copy of the new documents data
    this.documentListChangedEvent.next(documentsListClone); // return the new copy of the new documents data
  }
}
