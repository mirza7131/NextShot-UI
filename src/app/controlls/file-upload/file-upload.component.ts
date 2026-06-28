import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable, take } from 'rxjs';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [MessageService]
})
export class FileUploadComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    console.log(this.acceptFiles)
  }
  @Input() control: FormControl
  @Input() label: string = ''
  @Input() mode: any = null
  @Input() maxFileSize = 300 * 1024
  @Input() chooseLabel: string = 'choose'
  @Input() auto: boolean = false
  @Input() multiselect: boolean = false
  @Input() fingurePrintUpload: boolean = false
  @Input() uploadedFiles: any[] = [];
  @Input() acceptFiles: string = ''
  @Output() file = new EventEmitter<any>();
  @ViewChild('fileUploadComponent') fileUploadComponent: any;



  ngAfterViewInit(): void {
    // this.hideUploadButton();
  }

  hideUploadButton(): void {
    setTimeout(() => {

      const uploadButton = this.fileUploadComponent.uploadButton.nativeElement;
      uploadButton.style.display = 'none';
    });
  }

  showUploadButton(): void {
    setTimeout(() => {

      const uploadButton = this.fileUploadComponent.uploadButton.nativeElement;
      uploadButton.style.display = 'block';
    });
  }

  onCancel(): void {

    // Your file upload logic
  }
  onUpload(event: any) {

    let flag = false
    // console.log("Total Files: ", event.files)
    for (let file of event.files) {
      if (file.type.includes("image/jpg") || file.type.includes("image/jpeg")) {
        // this.uploadedFiles.push(file);
        // this.file.emit(this.uploadedFiles)
        if (file.size > this.maxFileSize) {
          // return this.messageService.add({ severity: 'error', summary: 'Success', detail: 'File Size Exceeded' });
        } else {
          this.uploadedFiles.forEach((ele: File) => {
            if (ele.name == file.name && ele.size == file.size && ele.type == file.type && ele.lastModified == file.lastModified) {
              flag = true;
            }
          })

          if (flag) {
            return this.messageService.add({ severity: 'info', summary: 'info', detail: 'File Already Added To List' });
          }
          if (!this.multiselect) {
            this.uploadedFiles = []
            this.uploadedFiles.push(file);
          } else {
            this.uploadedFiles.push(file);
          }

          this.file.emit(this.uploadedFiles);
          // return this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Added To list' });
        }
      }
      else {
        return this.messageService.add({ severity: 'error', summary: 'error', detail: 'Only jpg images Allowed' });
      }
    }

  }

  // For Compressing Image Till here
  // onUpload(event: any) {
  //    
  //   for (let file of event.files) {
  //     if(file.type.includes("image/jpg") || file.type.includes("image/jpeg")){
  //       // this.uploadedFiles.push(file);
  //       // this.file.emit(this.uploadedFiles)
  //       if (file.size > 200000) {
  //         console.log(`Image size Before compressed: ${file.size} bytes.`)
  //         this.compress(file).pipe(take(1)).subscribe(compressedImage => {
  //             console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
  //             // now you can do upload the compressed image 
  //             if (compressedImage.size > 200000) {
  //               return this.messageService.add({ severity: 'error', summary: 'Success', detail: 'Unable to compress image size' });
  //             }else if(compressedImage.size <= 200000){
  //                
  //               this.uploadedFiles.push(compressedImage);
  //               this.file.emit(this.uploadedFiles)
  //               return this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  //             }
  //           })
  //         // return this.messageService.add({ severity: 'error', summary: 'Success', detail: 'File Size Exceeded' });
  //       }else{
  //         return this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  //       }
  //     }
  //     else{
  //   return this.messageService.add({ severity: 'error', summary: 'error', detail: 'Only jpg images Allowed' });
  //     }
  //   }

  // }
  // compress(file: File): Observable<File> {

  //   // in bytes, compress images larger than 1MB
  //   const fileSizeMax = 1 * 200 * 200
  //   // in pixels, compress images have the width or height larger than 1024px
  //   const widthHeightMax = 200
  //   const defaultWidthHeightRatio = 1
  //   const defaultQualityRatio = 0.7

  //   const imageType = file.type || 'image/jpeg'
  //   const reader = new FileReader()
  //   reader.readAsDataURL(file)

  //   return Observable.create((observer:any) => {
  //     // This event is triggered each time the reading operation is successfully completed.
  //     reader.onload = ev => {
  //       // Create an html image element
  //       const img = this.createImage(ev)
  //       // Choose the side (width or height) that longer than the other
  //       const imgWH = img.width > img.height ? img.width : img.height

  //       // Determines the ratios to compress the image
  //       let withHeightRatio = (imgWH > widthHeightMax) ? widthHeightMax/imgWH : defaultWidthHeightRatio
  //       let qualityRatio = (file.size > fileSizeMax) ? fileSizeMax/file.size : defaultQualityRatio

  //       // Fires immediately after the browser loads the object
  //       img.onload = () => { 
  //         const elem = document.createElement('canvas')
  //         // resize width, height
  //         elem.width = img.width * withHeightRatio
  //         elem.height = img.height * withHeightRatio

  //         const ctx = <CanvasRenderingContext2D>elem.getContext('2d')
  //         ctx.drawImage(img, 0, 0, elem.width, elem.height)
  //         ctx.canvas.toBlob(
  //           // callback, called when blob created
  //           (blob:any) => { 
  //             observer.next(new File(
  //               [blob],
  //               file.name,
  //               {
  //                 type: imageType,
  //                 lastModified: Date.now(),
  //               }
  //             ))
  //           },
  //           imageType,
  //           qualityRatio, // reduce image quantity 
  //         )
  //       }
  //     }

  //     // Catch errors when reading file
  //     reader.onerror = error => observer.error(error)
  //   })
  // }
  // private createImage(ev:any) {
  //   let imageContent = ev.target.result
  //   const img = new Image()
  //   img.src = imageContent
  //   return img
  // }
  // For Compressing Image Till here

  uploadFile() {

    this.file.emit(this.uploadedFiles)
  }

  onRemove(event: any) {

    this.uploadedFiles = this.uploadedFiles.filter(file => file !== event.file);
    if (this.uploadedFiles != null) {
      this.file.emit(this.uploadedFiles)
      return this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Removed Successfully' });
    }
  }

  reset() {
    this.uploadedFiles = [];
    this.fileUploadComponent._files = []
    this.fileUploadComponent.files = []
    this.file.emit(this.uploadedFiles)
  }

}
