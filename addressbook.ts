//  this is the main branch of the address book

// import readlineSync from "readline-sync";
import * as readlineSync from "readline-sync";

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
    const duplicate = this.contacts.find(
      (c) =>
        c.fname.toLowerCase() === contact.fname.toLowerCase() &&
        c.lname.toLowerCase() === contact.lname.toLowerCase()
    );
    if (duplicate) {
      console.log("the name is already exist in the address book");
    } else {
      this.contacts.push(contact);
    }
  }
  getContacts(): Contact[] {
    return this.contacts;
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
  searchByCityOrState(property: keyof Contact, value: string): string[] {
    const match: string[] = [];
    for (const contact of this.contacts) {
      const propValue = contact[property];
      if (
        typeof propValue === "string" &&
        propValue.toLowerCase() === value.toLowerCase()
      ) {
        console.log(`The person living in ${value} is ${contact.fname}`);
        match.push(contact.fname);
      }
    }
    return match;
  }
  sortBy(field: keyof Contact) {
    this.contacts.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];

      if (typeof valA === "number" && typeof valB === "number") {
        return valA - valB;
      }
      return String(valA).localeCompare(String(valB));
    });

    console.log(`Contacts sorted by ${field}:`);
    this.contacts.forEach((c) => console.log(c.toString()));
  }
}

class AddressBookSystem {
  private books: Map<string, AddressBook>;
  private cityDictionary: Map<string, Contact[]>;
  private stateDictionary: Map<string, Contact[]>;

  constructor() {
    this.books = new Map<string, AddressBook>();
    this.cityDictionary = new Map<string, Contact[]>();
    this.stateDictionary = new Map<string, Contact[]>();
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

  searchByCityOrState(property: keyof Contact, value: string): void {
    let found = false;
    this.books.forEach((book, bookName) => {
      const results = book.searchByCityOrState(property, value);
      results.forEach((name) => {
        console.log(`[${bookName}] ${name}`);
        found = true;
      });
    });
    if (!found) {
      console.log(`No person found in ${value}`);
    }
  }

  buildDictionaries(): void {
    this.cityDictionary.clear();
    this.stateDictionary.clear();

    this.books.forEach((book) => {
      for (const contact of book.getContacts()) {
        // City dictionary
        if (!this.cityDictionary.has(contact.city)) {
          this.cityDictionary.set(contact.city, []);
        }
        this.cityDictionary.get(contact.city)!.push(contact);

        // State dictionary
        if (!this.stateDictionary.has(contact.state)) {
          this.stateDictionary.set(contact.state, []);
        }
        this.stateDictionary.get(contact.state)!.push(contact);
      }
    });
  }

  viewByCity(city: string): void {
    const persons = this.cityDictionary.get(city);
    if (persons && persons.length > 0) {
      console.log(`Persons in city ${city}:`);
      persons.forEach((c) => console.log(`- ${c.fname} ${c.lname}`));
    } else {
      console.log(`No persons found in city ${city}`);
    }
  }

  viewByState(state: string): void {
    const persons = this.stateDictionary.get(state);
    if (persons && persons.length > 0) {
      console.log(`Persons in state ${state}:`);
      persons.forEach((c) => console.log(`- ${c.fname} ${c.lname}`));
    } else {
      console.log(`No persons found in state ${state}`);
    }
  }
  countByCity(city: string): number {
    let count = 0;
    this.books.forEach((book) => {
      book.getContacts().forEach((contact) => {
        if (contact.city.toLowerCase() === city.toLowerCase()) {
          count++;
        }
      });
    });
    return count;
  }

  countByState(state: string): number {
    let count = 0;
    this.books.forEach((book) => {
      book.getContacts().forEach((contact) => {
        if (contact.state.toLowerCase() === state.toLowerCase()) {
          count++;
        }
      });
    });
    return count;
  }
}
function menu(system: AddressBookSystem) {
  while (true) {
    console.log("\nOptions:");
    console.log("1. Create Address Book");
    console.log("2. Add Contact");
    console.log("3. Display Contacts");
    console.log("4. Edit Contact");
    console.log("5. Delete Contact");
    console.log("6. Search by City");
    console.log("7. Search by State");
    console.log("8. View by City");
    console.log("9. View by State");
    console.log("10. Count by City");
    console.log("11. Count by State");
    console.log("12. Sort by Name");
    console.log("13. Sort by City/State/Zip");
    console.log("14. Exit");

    const option = readlineSync.questionInt("Select option: ");

    switch (option) {
      case 1: {
        const name = readlineSync.question("Enter Address Book name: ");
        system.addAddressBook(name);
        break;
      }
      case 2: {
        const bookName = readlineSync.question("Book to add contact to: ");
        const book = system.getAddressBook(bookName);
        if (book) {
          const fname = readlineSync.question("First name: ");
          const lname = readlineSync.question("Last name: ");
          const address = readlineSync.question("Address: ");
          const city = readlineSync.question("City: ");
          const state = readlineSync.question("State: ");
          const zipcode = readlineSync.questionInt("Zipcode: ");
          const phoneNumber = readlineSync.questionInt("Phone Number: ");
          const email = readlineSync.question("Email: ");
          const contact = new Contact(
            fname,
            lname,
            address,
            city,
            state,
            zipcode,
            phoneNumber,
            email
          );
          book.addContact(contact);
        } else {
          console.log("Book not found.");
        }
        break;
      }
      case 3: {
        const bookName = readlineSync.question("Book name to view: ");
        const book = system.getAddressBook(bookName);
        if (book) {
          book.getContacts().forEach((c) => console.log(c.toString()));
        } else {
          console.log("Book not found.");
        }
        break;
      }
      case 4: {
        const bookName = readlineSync.question("Book name: ");
        const book = system.getAddressBook(bookName);
        if (book) {
          const name = readlineSync.question(
            "Enter First Name of contact to edit: "
          );
          const property = readlineSync.question(
            "Property to edit (fname/lname/address/city/state/zipcode/phoneNumber/email): "
          ) as keyof Contact;
          const change = readlineSync.question("New value: ");
          book.editContact(name, property, change);
        }
        break;
      }
      case 5: {
        const bookName = readlineSync.question("Book name: ");
        const book = system.getAddressBook(bookName);
        if (book) {
          const name = readlineSync.question(
            "Enter First Name of contact to delete: "
          );
          book.deleteContact(name);
        }
        break;
      }
      case 6: {
        const city = readlineSync.question("City to search: ");
        system.searchByCityOrState("city", city);
        break;
      }
      case 7: {
        const state = readlineSync.question("State to search: ");
        system.searchByCityOrState("state", state);
        break;
      }
      case 8: {
        system.buildDictionaries();
        const city = readlineSync.question("City: ");
        system.viewByCity(city);
        break;
      }
      case 9: {
        system.buildDictionaries();
        const state = readlineSync.question("State: ");
        system.viewByState(state);
        break;
      }
      case 10: {
        const city = readlineSync.question("City: ");
        console.log(`Count: ${system.countByCity(city)}`);
        break;
      }
      case 11: {
        const state = readlineSync.question("State: ");
        console.log(`Count: ${system.countByState(state)}`);
        break;
      }
      case 12: {
        const bookName = readlineSync.question("Book name: ");
        const book = system.getAddressBook(bookName);
        if (book) book.sortBy("fname");
        break;
      }
      case 13: {
        const bookName = readlineSync.question("Book name: ");
        const book = system.getAddressBook(bookName);
        if (book) {
          const field = readlineSync.question("Sort by: ") as keyof Contact;
          book.sortBy(field);
        }
        break;
      }
      case 14:
        console.log("Goodbye!");
        process.exit(0);
      default:
        console.log("Invalid option.");
    }
  }
}

const system = new AddressBookSystem();
menu(system);
