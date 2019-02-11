import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { GenerationService } from '../services/generation.service';
import { Constants } from '../services/constants';
import { SessionStorageService } from '../services/session-storage.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  public number: number;
  public loading: Boolean = false;
  public userId;
  public password;
  public identifiers = [];
  public error = false;
  public errorMessage;
  public numberError = null;
  public numberZError = null;
  public passwordError = null;
  public success = '';
  public zuriNumber: number;
  @ViewChild('barcode') public barcode: ElementRef;

  constructor(
    public dialog: MatDialog,
    private genService: GenerationService,
    private sessionStorageService: SessionStorageService
  ) {  }

  ngOnInit() {
    this.userId = this.sessionStorageService.getObject(Constants.USER_KEY).systemId;
  }

  public checkNumber(number) {
    this.success = '';
    this.errorMessage = '';
    if (number > 500) {
      this.numberError = 'You cannot generate more than 500 identifers at once!';
    } else if (number < 10) {
      this.numberError = 'You cannot generate less than 10 identifiers!';
    } else {
      this.number = number;
      this.numberError = null;
    }
  }

  public checkZuri(number) {
    this.success = '';
    this.errorMessage = '';
    if (number > 5000) {
      this.numberZError = 'You cannot generate more than 1000 identifers at once!';
    } else if (number < 10) {
      this.numberZError = 'You cannot generate less than 10 identifiers!';
    } else {
      this.zuriNumber = number;
      this.numberZError = null;
    }
  }

  public checkPass(password) {
    this.success = '';
    this.errorMessage = '';
    this.password = password;
    if (this.password) {
      this.passwordError = null;
    } else {
      this.passwordError = 'Password is required!';
    }
  }

  public generate() {
    this.error = false;
    this.loading = true;
    if (!this.number) {
      this.loading = false;
      this.numberError = 'Number of identifiers to generate is required!';
    }
    if (!this.password) {
      this.loading = false;
      this.passwordError = 'Password is required!';
    }
    if (!this.numberError && !this.passwordError && this.number && this.password) {
      this.openDialog();
      this.genService.generateIdentifers(this.number, this.userId, this.password)
      .subscribe((data) => {
        const fileURL = URL.createObjectURL(data);
        window.open(fileURL);
        this.closeDialog();
        this.loading = false;
        this.success = 'Identifiers successfully generated';
      }, (err) => {
        this.error = true;
        this.loading = false;
        this.closeDialog();
        this.errorMessage = 'There was an error generating identifiers!';
      });
    }

  }

  public generateZuri() {
    this.error = false;
    this.loading = true;
    if (!this.zuriNumber) {
      this.loading = false;
      this.numberZError = 'Number of identifiers to generate is required!';
    }
    if (!this.numberZError && this.zuriNumber && this.userId) {
      this.openDialog();
      this.genService.generateZuriIds(this.zuriNumber, this.userId)
      .subscribe((data) => {
        saveAs(data, 'data.csv');
        this.closeDialog();
        this.loading = false;
        this.success = 'Identifiers successfully generated';
      }, (err) => {
        this.error = true;
        this.loading = false;
        this.closeDialog();
        this.errorMessage = 'There was an error generating identifiers!';
      });
    }

  }

  public openDialog(): void {
    this.dialog.open(DialogComponent, {
      panelClass: 'transparent',
      disableClose: true
    });
  }
  public closeDialog(): void {
    this.dialog.closeAll();
    this.password = '';
    this.number = null;
  }

}
