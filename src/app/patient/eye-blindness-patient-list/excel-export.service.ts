import { utils as XLSXUtils, writeFile } from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx/types';

import { Injectable } from '@angular/core';

export interface IExportAsExcelProps {
  readonly data: any[];
  readonly fileName: string;
  readonly sheetName?: string;
  readonly header?: string[];
  readonly table?: HTMLElement;
}

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  fileExtension = '.xlsx';

  public exportAsExcel({
                         data,
                         fileName,
                         sheetName = 'Data',
                         header = [],
                         table
                       }: IExportAsExcelProps): void {
    let wb: WorkBook;

    if (table) {
      wb = XLSXUtils.table_to_book(table);
    } else {
      const ws: WorkSheet = XLSXUtils.json_to_sheet(data, { header });
      wb = XLSXUtils.book_new();
      XLSXUtils.book_append_sheet(wb, ws, sheetName);
    }

    writeFile(wb, `${fileName}${this.fileExtension}`);
  }
}
