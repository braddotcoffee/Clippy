import { Component, OnInit } from '@angular/core';
import { ObjectRetrieverService } from './object-retriever.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  videoUrls: string[] = []

  ngOnInit(): void {
    this.objectRetriverService.getAllObjectsInBucket((objects: any[]) => { this.allObjectsRetrievedCallback(objects) })
  }
  title = 'Clippy';

  constructor(private objectRetriverService: ObjectRetrieverService) { }

  private allObjectsRetrievedCallback(objects: any[]): void {
    console.log(objects)
    console.log(objects[0])
    const objectsToRetrieve = objects.sort(
      (a, b) => a.LastModified < b.LastModified ? 1 : a.LastModified > b.LastModified ? -1 : 0
    ).slice(0, 6);
    objectsToRetrieve.forEach((object: any) => {
      if (!object.Key.includes(".mp4")) return
      this.videoUrls.push(
        `https://s3.woohoojin.dev/${object.Key}`
      )
    })
    this.objectRetriverService.getObjectContent(objects[17].Key, this.getObjectCallback)
  }

  private getObjectCallback(object: any): void {
    console.log(object)
  }
}

