import { Component, OnDestroy, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  allDocuments: Document[] = [];
  subscription: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.allDocuments = this.documentService.getDocuments();

    // use Subject instead of event emitter, we assign the whole thing to "subscription" variable so that we can destroy it later
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (documentsList: Document[]) => {
        this.allDocuments = documentsList;
      }
    );
  }

  // we must destroy the observable "Subject" after we are done, otherwise it will cause memory leaking
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
