import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../web3.service';
import {  FormGroup,FormControl } from '@angular/forms';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  profileForm = new FormGroup({
    Name: new FormControl(''),
    Amount: new FormControl(''),
  });
  constructor() { }

  ngOnInit(): void {
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
  }

}
