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

  private findContact(name: string): number {
    return this.contacts.findIndex(
      (c) => c.fname.toLowerCase() === name.toLowerCase()
    );
  }

  editContact(name: string, property: keyof Contact, change: any): void {
    const index = this.findContact(name);
    if (index !== -1) {
      if (this.contacts[index]?.hasOwnProperty(property)) {
        (this.contacts[index] as any)[property] = change;
        console.log(
          `Contact ${name} updated successfully.`,
          this.contacts[index]?.toString()
        );
      } else {
        console.log("Invalid property name.");
      }
    } else {
      console.log("the contact not found");
    }
  }

  deleteContact(name: string): void {
    const index = this.findContact(name);
    if (index !== 1) {
      console.log(`contact delted`, this.contacts[index]?.toString());
      this.contacts.splice(index, 1);
    } else {
      console.log("the contact not found / exists");
    }
  }
}
