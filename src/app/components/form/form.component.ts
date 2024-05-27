import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import 'bootstrap';
import { AppComponent } from '../../app.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Employee, FormService } from '../../form.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateEmployeeComponent } from '../update-employee/update-employee.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [AppComponent, NgClass, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  employeeForm: FormGroup;
  employees: Employee[] = [];
  ifneedAdd: boolean = false;

  constructor(private formBuilder: FormBuilder, private employeeService: FormService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', [Validators.required, this.inputFifteenLetterValidator()]],
      lastName: ['',[Validators.required, this.inputFifteenLetterValidator()]],
      email: ['', [Validators.required, Validators.email,this.inputFifLetterValidator()]],
      phone: ['', [Validators.required, this.mobileNumberValidator]],
      address: ['', [Validators.required, this.inputFifLetterValidator()]],
      description: ['', Validators.required],
      salary: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.employees = this.employeeService.getEmployees();
  }

  addEmployee() {
    if (this.employeeForm.valid) {
      const newEmployee: Employee = this.employeeForm.value;
      this.calBonus();
      this.employeeService.addEmployeeToTheList(newEmployee);
      this.employees = this.employeeService.getEmployees();
      this.employeeForm.reset();
      this.snackBar.open('Employee added successfully!', 'Close', {
        duration: 3000,
      });
    } else {
      this.showValidationErrors();
    }
  }

  calBonus() {
    const bonusemp: Employee = this.employeeForm.value;
    bonusemp.bonus = bonusemp.salary * 0.1;
  }

  onChange(firstName: string) {
    const field = this.employeeForm.get(firstName);
    if (field && field.dirty) {
      alert(`Field ${firstName} has been changed to: ${field.value}`);
    }
  }

  addNew() {
    this.ifneedAdd = true;
  }

  closeAdd() {
    this.ifneedAdd = false;
  }

  openPopup(employee: Employee): void {
    const dialogRef = this.dialog.open(UpdateEmployeeComponent, {
      width: '500px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.updateEmployee(result);
        this.employees = this.employeeService.getEmployees();
      }
    });
  }

  mobileNumberValidator(control: any): { [key: string]: any } | null {
    const regex1 = /^(071|072|075|011|078|074|070|077)\d{7}$/;

    if (control.value && !regex1.test(control.value)) {
      return { 'invalidMobileNumber': true };
    }
    return null;
  }

  inputFifteenLetterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = /^[A-Za-z]{1,15}$/.test(value);

      return isValid ? null : { exactFifteenLetters: true };
    };
  }

  inputFifLetterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = /^[0-9A-Za-z/, .@]{1,50}$/.test(value);

      return isValid ? null : { exactFifLetters: true };
    };
  }

  showValidationErrors() {
    for (const controlName in this.employeeForm.controls) {
      const control = this.employeeForm.controls[controlName];
      if (control.invalid) {
        const errorMessage = this.getErrorMessage(control, controlName);
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
        });
        break;
      }
    }
  }

  getErrorMessage(control: AbstractControl, controlName: string): string {
    if (control.errors) {
      if (control.errors ['required']) {
        return `${controlName} cannot be empty`;
      } 

      else if (control.errors ['invalidMobileNumber']) {
        return `${controlName} is invalid`;
      } 

      else if (control.errors['exactFifteenLetters']) {
        return `${controlName} should contain letters and be between 1 to 15 characters`;
      } 

      else if (control.errors['exactFifLetters']) {
        return `${controlName} should contain letters and be between 1 to 50 characters`;
      } 
      
      else {
        return `${controlName} is invalid.`;
      }
    }
    return '';
  }
}
