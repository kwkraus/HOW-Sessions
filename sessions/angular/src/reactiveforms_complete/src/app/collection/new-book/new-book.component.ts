import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.css']
})
export class NewBookComponent implements OnInit {

  newBookForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    author: new FormControl('', Validators.required),
    isCheckedOut: new FormControl(false),
    rating: new FormControl(0)
  });

  // newBookForm = this.fb.group({
  //   title: ['', [Validators.required, Validators.minLength(3)]],
  //   author: ['', Validators.required],
  //   isCheckedOut: [false],
  //   rating: [0],
  //   libraryAddress: this.fb.group({
  //     street: [''],
  //     city: [''],
  //     state: [''],
  //     zip: ['']
  //   }),
  //   reviews: this.fb.array([
  //     this.fb.control('')
  //   ]),
  // });

  constructor(private _dialogRef: MatDialogRef<NewBookComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.newBookForm.get('isCheckedOut').valueChanges.subscribe(
      isCheckedout => {
        console.log(`Is checkedout = ${isCheckedout}`);
      }
    );
  }

  cancel(): void {
    this._dialogRef.close();
  }

  save(): void {
    this._dialogRef.close(this.newBookForm.value);
  }

  onRatingUpdate(rating: number): void {
    this.newBookForm.get('rating').setValue(rating);
  }
}
