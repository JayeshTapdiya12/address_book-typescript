//  this is the main branch of the address book

class Contact {
  fname: string;
  lname: string;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  phoneNumber: number;
  email: string;
  constructor(
    fname: string,
    lname: string,
    address: string,
    city: string,
    state: string,
    zipcode: number,
    phoneNumber: number,
    email: string
  ) {
    this.fname = fname;
    this.lname = lname;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
    this.phoneNumber = phoneNumber;
    this.email = email;
  }
  toString(): string {
    return `${this.fname} ${this.lname} , ${this.address}, ${this.city}, ${this.state}, ${this.zipcode}, ${this.phoneNumber}, ${this.email}`;
  }
}

class AddressBook {
  private contacts: Contact[] = [];

  addContact(contact: Contact): void {
    this.contacts.push(contact);
  }
}
