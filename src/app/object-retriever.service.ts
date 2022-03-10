import { Injectable } from '@angular/core';
import S3 from 'aws-sdk/clients/s3'

@Injectable({
  providedIn: 'root'
})
export class ObjectRetrieverService {
  globalParams = {
    Bucket: "woohoojin-clips",
    Delimeter: "/"
  }
  s3Client = new S3();

  constructor() {
  }

  getAllObjectsInBucket(callback: (objects: any[]) => void) {
    const objects: any[] = []
    const explorationQueue: string[] = []
    this.listObjectsWithPrefix("mp4/", objects, -1, explorationQueue, callback)
  }

  getObjectContent(objectKey: string, callback: (object: any) => void): void {
    const params = {
      Bucket: this.globalParams.Bucket,
      Key: objectKey
    }
    this.s3Client.makeUnauthenticatedRequest("getObject", params, (err: any, data: any) => {
      if (err) console.error(err)
      callback(data);
    });
  }

  private listObjectsWithPrefix(prefix: string, objects: any[], currentIndex: number, queue: string[], callback: (objects: any[]) => void): void {
    const params = {
      Bucket: this.globalParams.Bucket,
      Delimiter: this.globalParams.Delimeter,
      Prefix: prefix
    }
    this.s3Client.makeUnauthenticatedRequest("listObjectsV2", params, (err, data) => {
      if (err) console.error(err)
      if (data.Contents.length > 0) {
        data.Contents.forEach((object: any) => objects.push(object))
      }
      if (data.CommonPrefixes.length > 0) {
        data.CommonPrefixes.forEach((folderName: any) => queue.push(folderName.Prefix))
      }
      if (currentIndex < queue.length - 1) {
        this.listObjectsWithPrefix(queue[currentIndex + 1], objects, currentIndex + 1, queue, callback);
      } else {
        console.log(objects)
        callback(objects)
      }
    })
  }
}
