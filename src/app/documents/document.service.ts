import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number;

  // we set it up here so that we can use later in different functions
  documentListChangedEvent = new Subject<Document[]>();

  // constructor, every time we start the program it will reset the codes we have inside
  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;

  }

  // return the copy of all the documents data
  getDocuments() {
    this.http
      .get(
        'https://angularcms-aa6ec-default-rtdb.firebaseio.com/documents.json'
      )
      // success function
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId(); // loop through each document and get the max id

          // what is this sort doing?
          this.documents.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.documentListChangedEvent.next(this.documents.slice()); // use "Subject" to emit the copy of updated documents
        },
        // error function
        (error: any) => {
          console.log(error);
        }
      );
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
    const documentsListClone = this.documents.slice(); // make a copy of the new documents data
    this.documentListChangedEvent.next(documentsListClone); // return the new copy of the new documents data
  }

  // update the existing document with updated info
  updateDocument(originalDocument: Document, newDocument: Document) {
    // if one of them is "undefined" or "null", then just return
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    // check if we are getting a valid pos
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id; // we are updating the same document so the "id" should stay the same
    this.documents[pos] = newDocument; // save the newDocument to "replace" the original one in the "documets"
    const documentsListClone = this.documents.slice(); // make a copy of the entire "documents"
    this.documentListChangedEvent.next(documentsListClone); // "emit" or "pass" the new copy of the entire "documents" to the "document list"
  }
}
