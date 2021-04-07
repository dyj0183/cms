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
  private databaseUrl = 'http://localhost:3000/documents/';

  // we set it up here so that we can use later in different functions
  documentListChangedEvent = new Subject<Document[]>();

  // constructor, every time we start the program it will reset the codes we have inside
  // dependency injection for us to use HttpClient
  constructor(private http: HttpClient) {}

  sortAndSend() {
    this.documents = this.documents.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : b.name.toLowerCase() > a.name.toLowerCase()
        ? -1
        : 0
    );
    this.documentListChangedEvent.next(this.documents.slice());
  }

  // return the copy of all the documents data by using "Get" to access the data from firebase
  // It returns an Observable object because all HTTP requests are asynchronous (i.e. the response will not be returned immediately). This Observerable object waits and listens for a response to be returned from the server.
  getDocuments() {
    this.http
      .get<{ message: String; documents: Document[] }>(this.databaseUrl)
      .subscribe(
        (res: any) => {
          // Get documents from database
          this.documents = res.documents;
          // Sort & Emit the document list
          this.sortAndSend();
        },
        (error) => {
          console.log('Document Error ' + error);
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

    // delete from database
    this.http
      .delete(this.databaseUrl + document.id)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      });
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
    if (!newDocument) {
      return;
    }
    newDocument.id = '';
    // setting headers for the http post
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; document: Document }>(
        this.databaseUrl,
        newDocument,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  // update the existing document with updated info
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    // Setting header
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(this.databaseUrl + originalDocument.id, newDocument, {
        headers: headers,
      })
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });

    this.documents[pos] = newDocument;
    this.sortAndSend();
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
      .subscribe(() => {
        // put is unlike get, doesn't retunr anything
        this.documentListChangedEvent.next(this.documents.slice()); // emit the most updated documents for other components to use. we use observable "Subject" here which is why we use "next" instead of "emit"
      });
  }
}
