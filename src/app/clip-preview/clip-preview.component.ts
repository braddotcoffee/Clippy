import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-clip-preview',
  templateUrl: './clip-preview.component.html',
  styleUrls: ['./clip-preview.component.scss']
})
export class ClipPreviewComponent implements OnInit {
  @Input() videoUrl: string = "";

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  getVideoUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }

  getTitle() {
    const parts = this.videoUrl.split("/")
    return parts[parts.length - 1].replace(/_/g, " ").replace(".mp4", "")
  }
}
