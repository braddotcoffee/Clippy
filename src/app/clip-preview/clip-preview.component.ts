import { Component, Input, OnInit } from '@angular/core';
import { SafeUrlPipe } from '../safe-url-pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-clip-preview',
  templateUrl: './clip-preview.component.html',
  styleUrls: ['./clip-preview.component.scss'],
})
export class ClipPreviewComponent implements OnInit {
  @Input() videoUrl: string = '';
  @Input() videoDate: Date = new Date();
  ago: string = '';

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const now = new Date();
    const diff = now.getTime() - this.videoDate.getTime();
    // Print the diff in terms of X Minutes ago, or X Days ago if it's >= 1 day
    if (diff < 1000 * 60 * 60) {
      this.ago = `${Math.floor(diff / (1000 * 60))} minutes ago`;
    } else if (diff < 1000 * 60 * 60 * 24) {
      this.ago = `${Math.floor(diff / (1000 * 60 * 60))} hours ago`;
    } else {
      // Singular "day" for 1 day
      // Plural "days" for > 1 day
      this.ago = `${Math.floor(diff / (1000 * 60 * 60 * 24))} day${Math.floor(diff / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''} ago`;
    }
    console.log(this.videoDate);
  }

  copyLink() {
    this.snackBar.open("Copied!", "", {
      duration: 1500,
    });

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.videoUrl.replace(".mp4", ".html");
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  getTitle() {
    const parts = this.videoUrl.split('/');
    return parts[parts.length - 1].replace(/_/g, ' ').replace('.mp4', '');
  }
}
