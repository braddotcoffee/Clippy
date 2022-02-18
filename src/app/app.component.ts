import { Component, HostListener, OnInit } from '@angular/core';
import { ObjectRetrieverService } from './object-retriever.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  videoUrls: any[] = [];
  allVideos: any[] = [];
  nextVideoIndex: number = 3;
  top: boolean = true;

  ngOnInit(): void {
    this.objectRetrieverService.getAllObjectsInBucket((objects: any[]) => {
      this.allObjectsRetrievedCallback(objects);
    });
  }
  title = 'Clippy';

  constructor(private objectRetrieverService: ObjectRetrieverService) {}

  private allObjectsRetrievedCallback(objects: any[]): void {
    console.log(objects);
    console.log(objects[0]);
    const objectsToRetrieve = objects.sort((a, b) =>
      a.LastModified < b.LastModified
        ? 1
        : a.LastModified > b.LastModified
        ? -1
        : 0
    );
    objectsToRetrieve.forEach((object: any) => {
      if (!object.Key.includes('.mp4')) return;

      const split = object.Key.split('/');
      let last = split[split.length - 1];
      // Combine split back together, but uri encode the last part
      last = encodeURIComponent(last);
      const url = split.slice(0, split.length - 1).join('/') + '/' + last;

      this.allVideos.push({
        url: `https://s3.woohoojin.dev/${url}`,
        date: object.LastModified,
      });

      this.videoUrls = this.allVideos.slice(0, this.nextVideoIndex);
    });
    this.objectRetrieverService.getObjectContent(
      objects[17].Key,
      this.getObjectCallback
    );
  }

  private loadOneMoreVideo() {
    if (this.allVideos.length > this.nextVideoIndex) {
      this.videoUrls.push(this.allVideos[this.nextVideoIndex]);
      this.nextVideoIndex++;
    }
  }

  private getObjectCallback(object: any): void {
    console.log(object);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.scrollY > 0) {
      this.top = false;
    } else {
      this.top = true;
    }

    let pos =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    if (pos >= max - 100) {
      this.loadOneMoreVideo();
    }
  }
}
