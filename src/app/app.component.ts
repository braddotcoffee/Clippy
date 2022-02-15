import { Component, OnInit } from '@angular/core';
import S3 from 'aws-sdk/clients/s3'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Clippy';
  globalParams = {
    Bucket: "woohoojin-clips",
    Delimeter: "/"
  }
  s3Client = new S3();

  ngOnInit(): void {
    const objects: any[] = []
    this.listObjectsWithPrefix("mp4/", objects)
  }

  listObjectsWithPrefix(prefix: string, objects: any[]): void {
    const params = {
      Bucket: this.globalParams.Bucket,
      Delimiter: this.globalParams.Delimeter,
      Prefix: prefix
    }
    this.s3Client.makeUnauthenticatedRequest("listObjectsV2", params, (err, data) => {
      if (err) console.error(err)
      console.log(data)
      if (data.Contents.length > 0) {
        data.Contents.forEach((object: any) => objects.push(object))
      }
      if (data.CommonPrefixes.length > 0) {
        data.CommonPrefixes.forEach((folderName: any) => this.listObjectsWithPrefix(folderName.Prefix, objects))
      } else {
        this.allObjectsRetrievedCallback(objects)
      }
    })
  }

  allObjectsRetrievedCallback(objects: string[]): void {
    console.log(objects)
  }
}

