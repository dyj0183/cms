import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  maxMessageId: number;

  // we set it up here so that we can use later in different functions
  messageListChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) {}

  getMessage(id: String): Message {
    // for (var message of this.messages) {
    //   return message.id === id ? message : null;
    // }
    return this.messages.find((message) => message.id === id);
  }

  addMessage(message: Message) {
    this.messages.push(message);

    this.storeMessages();
  }

  // find out the max id in the messages
  getMaxId(): number {
    var maxId = 0;

    this.messages.forEach((message) => {
      if (message.id == null || message.id == undefined) {
        console.log('No id found');
      } else {
        var currentId = parseInt(message.id);
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
    });

    return maxId;
  }

  // return the copy of all the messages data by using "Get" to access the data from firebase
  // It returns an Observable object because all HTTP requests are asynchronous (i.e. the response will not be returned immediately). This Observerable object waits and listens for a response to be returned from the server.
  getMessages() {
    this.http
      .get('https://angularcms-aa6ec-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        // success function
        (messages: Message[]) => {
          this.messages = messages; // assign the messages we "get" from firebase to our local variable
          this.maxMessageId = this.getMaxId(); // loop through each message and get the max id

          // sort by subject???
          this.messages.sort((a, b) =>
            a.subject > b.subject ? 1 : b.subject > a.subject ? -1 : 0
          );
          this.messageListChangedEvent.next(this.messages.slice()); // use "Subject" to emit the copy of updated messages, so message-list can use it
        },
        // error function
        (error: any) => {
          console.log(error);
        }
      );
  }

  // this method will be called when a messages object is added, updated, or deleted
  storeMessages() {
    // by now, "this.messages" have been either added, deleted, or updated which means it is the most updated version
    let messagesJSON = JSON.stringify(this.messages); // when sending data to web server, the data must be a string, convert javascript object into a string by using JSON.stringify()

    // headers???
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // use "put" to update
    this.http
      .put(
        'https://angularcms-aa6ec-default-rtdb.firebaseio.com/messages.json',
        messagesJSON,
        { headers: headers }
      )
      .subscribe(() => {
        // put is unlike get, doesn't retunr anything
        this.messageListChangedEvent.next(this.messages.slice()); // emit the most updated messages for other components to use. we use observable "Subject" here which is why we use "next" instead of "emit"
      });
  }
}
