import { Component, HostListener, OnInit } from '@angular/core';
import { ObjectRetrieverService } from './object-retriever.service';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  initialVideoUrls: any[] = [];
  videoUrls: any[] = [];
  allVideos: any[] = [];
  nextVideoIndex: number = 3;
  top: boolean = true;
  searchQuery: string = "";
  videoUrlLookup = new Map<string, any>();

  ngOnInit(): void {
    this.objectRetrieverService.getAllObjectsInBucket((objects: any[]) => {
      this.allObjectsRetrievedCallback(objects);
    });
  }
  title = 'Clippy';

  constructor(
    private objectRetrieverService: ObjectRetrieverService,
    private searchService: SearchService
  ) { }

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
      if (!object.Key.endsWith('.mp4')) return;

      const split = object.Key.split('/');
      let last = split[split.length - 1];
      // Combine split back together, but uri encode the last part
      last = encodeURIComponent(last);
      const url = split.slice(0, split.length - 1).join('/') + '/' + last;

      const urlMetadata = {
        url: `https://s3.woohoojin.dev/${url}`,
        date: object.LastModified,
      };
      this.allVideos.push(urlMetadata);
      this.videoUrlLookup.set(object.Key, urlMetadata);

      this.videoUrls = this.allVideos.slice(0, this.nextVideoIndex);
      this.initialVideoUrls = this.videoUrls;
    });
    this.objectRetrieverService.getObjectContent(
      objects[17].Key,
      this.getObjectCallback
    );

    console.log(this.searchService.getTitleMap(objects))
  }

  private loadOneMoreVideo() {
    if (this.searchQuery !== "") return;
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

  search(): void {
    if (this.searchQuery === "") {
      this.videoUrls = this.initialVideoUrls;
      return;
    }

    const keys = this.searchService.getKeysForSearchWord(
      this.searchService.prepareSearchQuery(this.searchQuery)
    );

    const toRender: any[] = [];
    keys.forEach(key => {
      toRender.push(this.videoUrlLookup.get(key)!)
    })

    this.videoUrls = toRender;
  }
}
