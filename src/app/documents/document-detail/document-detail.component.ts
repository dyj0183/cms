import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css'],
})
export class DocumentDetailComponent implements OnInit {
  // @Input() documentDetail: Document
  documentDetail: Document;
  documentId: string;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.documentId = params['id'];
      this.documentDetail = this.documentService.getDocument(this.documentId);
    });
  }

  onDelete() {
    this.documentService.deleteDocument(this.documentDetail);
    // route back to the '/documents' URL
    this.router.navigateByUrl('/documents');
  }
}
