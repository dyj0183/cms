import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  allDocuments: Document[] = [
    new Document ("WDD 430 Full-Stack Development", "Learn to use Angular", "https:sdfdsfdsfsd"),
    new Document ("CSE 310 Applied Programming", "Explore different programming languages", "https:/dfsdfdsfsd"),
    new Document ("CSE 340 Web Backend Development", "Learn about PHP & SQL", "https:/sfsdfds")
  ]

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);

  }


  constructor() { }

  ngOnInit(): void {
  }

}
