import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})
export class FormService {
  

  private employeesStore = new BehaviorSubject<Employee[]>([]);
  employees = this.employeesStore.asObservable();

  private key = 'angular';

  constructor() {}

  //adding new employee to the employee list
  addEmployeeToTheList(employee: Employee) {
    console.log("addEmployeeToTheList()");

    const encryptedLastName = CryptoJS.AES.encrypt(employee.lastName, this.key).toString();
    const employeeWithEncryptedLastName: Employee = { ...employee, lastName: encryptedLastName };
    console.log("encrypted : "+encryptedLastName);
    const currentEmployees = this.employeesStore.getValue();
    this.employeesStore.next([...currentEmployees, employeeWithEncryptedLastName]);
  }


  getEmployees(): Employee[] {
    console.log("getEmployees()");

    const currentEmployees = this.employeesStore.getValue();
    return currentEmployees.map(employee => {
      const decryptedLastName = CryptoJS.AES.decrypt(employee.lastName, this.key).toString(CryptoJS.enc.Utf8);
      console.log("decrepted : "+decryptedLastName);

      return { ...employee, lastName: decryptedLastName };
    });
  }

  updateEmployee(updatedEmployee: Employee) {
    const currentEmployees = this.employeesStore.getValue();
    const employeeIndex = currentEmployees.findIndex(employee => employee.email === updatedEmployee.email);
    if (employeeIndex > -1) {
      currentEmployees[employeeIndex] = updatedEmployee;
      this.employeesStore.next([...currentEmployees]);
    }
  }
  



}


//stor data in the structure
export interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  salary:number;
  bonus:number;
}

