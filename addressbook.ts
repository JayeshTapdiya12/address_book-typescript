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
  sortBy(
    property: keyof Pick<
      Contact,
      "fname" | "lname" | "city" | "state" | "zipcode"
    >
  ): void {
    this.contacts.sort((a, b) => {
      const valA = a[property];
      const valB = b[property];

      if (typeof valA === "number" && typeof valB === "number") {
        return valA - valB;
      }
      return String(valA).localeCompare(String(valB));
    });

    console.log(`Contacts sorted by ${property}:`);
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
