import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  // we set it up here so that we can use later in different functions
  messageListChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }

  // getMessages(): Message[] {
  //   return this.messages;
  // }

  getMessage(id: String): Message {
    // for (var message of this.messages) {
    //   return message.id === id ? message : null;
    // }
    return this.messages.find((message) => message.id === id);
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
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

  // return the copy of all the documents data by using "Get" to access the data from firebase
  // It returns an Observable object because all HTTP requests are asynchronous (i.e. the response will not be returned immediately). This Observerable object waits and listens for a response to be returned from the server.
  getMessages() {
    this.http
      .get(
        'https://angularcms-aa6ec-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe(
        // success function
        (messages: Message[]) => {
          this.messages = messages; // assign the documents we "get" from firebase to our local variable
          this.maxMessageId = this.getMaxId(); // loop through each document and get the max id

          // sort by subject???
          this.messages.sort((a, b) =>
            a.subject > b.subject ? 1 : b.subject > a.subject ? -1 : 0
          );
          this.messageListChangedEvent.next(this.messages.slice()); // use "Subject" to emit the copy of updated documents, so document-list can use it
        },
        // error function
        (error: any) => {
          console.log(error);
        }
      );
  }
}
