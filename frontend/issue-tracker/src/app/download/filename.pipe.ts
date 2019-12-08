import { Pipe, PipeTransform } from '@angular/core';


/**
 * Filters out unix epoch timestamp from filename
 */

@Pipe({
  name: 'filename'
})
export class FilenamePipe implements PipeTransform {

  transform(filename: string, ...args: any[]): any {
    let strArr: string[];
    let ext: string;
    // filename: "<filename>-<unix-epoch>.<ext>";
    strArr = filename.split('.');
    // pop extension
    ext = strArr.pop();
    strArr = strArr.join().split('-');
    // remove unix timestamp
    strArr.pop();
    // return filename: "filename.ext"
    return strArr.join('-') + '.' + ext;
  }

}
