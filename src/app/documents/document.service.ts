import { Injectable } from '@angular/core';
import { Document } from './document.model';
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
  // dependency injection for us to use HttpClient
  constructor(private http: HttpClient) {}

  // return the copy of all the documents data by using "Get" to access the data from firebase
  // It returns an Observable object because all HTTP requests are asynchronous (i.e. the response will not be returned immediately). This Observerable object waits and listens for a response to be returned from the server.
  getDocuments() {
    this.http
      .get(
        'https://angularcms-aa6ec-default-rtdb.firebaseio.com/documents.json'
      )
      .subscribe(
        // success function
        (documents: Document[]) => {
          this.documents = documents; // assign the documents we "get" from firebase to our local variable
          this.maxDocumentId = this.getMaxId(); // loop through each document and get the max id

          // sort???
          this.documents.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          this.documentListChangedEvent.next(this.documents.slice()); // use "Subject" to emit the copy of updated documents, so document-list can use it
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

    this.storeDocuments(); // call the storeDocuments to do the emit work and update on the firebase
  }

  // find out the max id in the documents
  getMaxId(): number {
    var maxId = 0;

    this.documents.forEach((document) => {
      if (document.id == null || document.id == undefined) {
        console.log('No id found');
      } else {
        var currentId = parseInt(document.id);
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
    });

    return maxId;
  }

  // create a new document to add
  addDocument(newDocument: Document) {
    if (!newDocument) { // check if it is null or undefined
      return;
    }

    this.maxDocumentId++; // this is for a new document, so we increase one for the new id to use
    newDocument.id = this.maxDocumentId.toString(); // must convert the "maxDocumentId" into string before we can assing it
    this.documents.push(newDocument); // add this new document to the original doucments data

    this.storeDocuments(); // call the storeDocuments to do the emit work and update on the firebase
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

    this.storeDocuments(); // call the storeDocuments to do the emit work and update on the firebase
  }

  // this method will be called when a Document object is added, updated, or deleted
  storeDocuments() {
    // by now, "this.documents" have been either added, deleted, or updated which means it is the most updated version
    let documentsJSON = JSON.stringify(this.documents); // when sending data to web server, the data must be a string, convert javascript object into a string by using JSON.stringify()

    // headers???
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // use "put" to update
    this.http
      .put(
        'https://angularcms-aa6ec-default-rtdb.firebaseio.com/documents.json',
        documentsJSON,
        { headers: headers }
      )
      .subscribe(() => { // put is unlike get, doesn't retunr anything
        this.documentListChangedEvent.next(this.documents.slice()); // emit the most updated documents for other components to use. we use observable "Subject" here which is why we use "next" instead of "emit"
      });
  }
}
