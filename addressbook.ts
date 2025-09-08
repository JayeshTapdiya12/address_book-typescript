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

class AddressBookSystem {
  private books: Map<string, AddressBook>;

  constructor() {
    this.books = new Map<string, AddressBook>();
  }

  addAddressBook(name: string): void {
    if (this.books.has(name)) {
      console.log(`Address Book with name '${name}' already exists!`);
    } else {
      this.books.set(name, new AddressBook());
      console.log(`Address Book '${name}' created successfully.`);
    }
  }

  getAddressBook(name: string): AddressBook | undefined {
    return this.books.get(name);
  }

  listAddressBooks(): void {
    console.log("Available Address Books:");
    this.books.forEach((_book, name) => console.log(name));
  }
}

const book = new AddressBookSystem();

book.addAddressBook("Family");
book.addAddressBook("Friends");

// Add contacts into "Family" Address Book
const familyBook = book.getAddressBook("Family");
if (familyBook) {
  familyBook.addContact(
    new Contact(
      "Jayesh",
      "Tapdiya",
      "MG Road",
      "Bangalore",
      "Karnataka",
      560001,
      9876543210,
      "jayesh@email.com"
    )
  );
  familyBook.addContact(
    new Contact(
      "Ravi",
      "Kumar",
      "Brigade Road",
      "Bangalore",
      "Karnataka",
      560002,
      9123456780,
      "ravi@email.com"
    )
  );
  familyBook.toString();
}

// Add contacts into "Friends" Address Book
const friendsBook = book.getAddressBook("Friends");
if (friendsBook) {
  friendsBook.addContact(
    new Contact(
      "Amit",
      "Shah",
      "Andheri",
      "Mumbai",
      "Maharashtra",
      400001,
      9988776655,
      "amit@email.com"
    )
  );
  friendsBook.toString();
}
