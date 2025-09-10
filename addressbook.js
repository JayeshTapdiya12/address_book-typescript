"use strict";
//  this is the main branch of the address book
Object.defineProperty(exports, "__esModule", { value: true });
// import readlineSync from "readline-sync";
var readlineSync = require("readline-sync");
var Contact = /** @class */ (function () {
    function Contact(fname, lname, address, city, state, zipcode, phoneNumber, email) {
        this.fname = fname;
        this.lname = lname;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
    Contact.prototype.toString = function () {
        return "".concat(this.fname, " ").concat(this.lname, " , ").concat(this.address, ", ").concat(this.city, ", ").concat(this.state, ", ").concat(this.zipcode, ", ").concat(this.phoneNumber, ", ").concat(this.email);
    };
    return Contact;
}());
var AddressBook = /** @class */ (function () {
    function AddressBook() {
        this.contacts = [];
    }
    AddressBook.prototype.addContact = function (contact) {
        var duplicate = this.contacts.find(function (c) {
            return c.fname.toLowerCase() === contact.fname.toLowerCase() &&
                c.lname.toLowerCase() === contact.lname.toLowerCase();
        });
        if (duplicate) {
            console.log("the name is already exist in the address book");
        }
        else {
            this.contacts.push(contact);
        }
    };
    AddressBook.prototype.getContacts = function () {
        return this.contacts;
    };
    AddressBook.prototype.findContact = function (name) {
        return this.contacts.findIndex(function (c) { return c.fname.toLowerCase() === name.toLowerCase(); });
    };
    AddressBook.prototype.editContact = function (name, property, change) {
        var _a, _b;
        var index = this.findContact(name);
        if (index !== -1) {
            if ((_a = this.contacts[index]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(property)) {
                this.contacts[index][property] = change;
                console.log("Contact ".concat(name, " updated successfully."), (_b = this.contacts[index]) === null || _b === void 0 ? void 0 : _b.toString());
            }
            else {
                console.log("Invalid property name.");
            }
        }
        else {
            console.log("the contact not found");
        }
    };
    AddressBook.prototype.deleteContact = function (name) {
        var _a;
        var index = this.findContact(name);
        if (index !== 1) {
            console.log("contact delted", (_a = this.contacts[index]) === null || _a === void 0 ? void 0 : _a.toString());
            this.contacts.splice(index, 1);
        }
        else {
            console.log("the contact not found / exists");
        }
    };
    AddressBook.prototype.searchByCityOrState = function (property, value) {
        var match = [];
        for (var _i = 0, _a = this.contacts; _i < _a.length; _i++) {
            var contact = _a[_i];
            var propValue = contact[property];
            if (typeof propValue === "string" &&
                propValue.toLowerCase() === value.toLowerCase()) {
                console.log("The person living in ".concat(value, " is ").concat(contact.fname));
                match.push(contact.fname);
            }
        }
        return match;
    };
    AddressBook.prototype.sortBy = function (field) {
        this.contacts.sort(function (a, b) {
            var valA = a[field];
            var valB = b[field];
            if (typeof valA === "number" && typeof valB === "number") {
                return valA - valB;
            }
            return String(valA).localeCompare(String(valB));
        });
        console.log("Contacts sorted by ".concat(field, ":"));
        this.contacts.forEach(function (c) { return console.log(c.toString()); });
    };
    return AddressBook;
}());
var AddressBookSystem = /** @class */ (function () {
    function AddressBookSystem() {
        this.books = new Map();
        this.cityDictionary = new Map();
        this.stateDictionary = new Map();
    }
    AddressBookSystem.prototype.addAddressBook = function (name) {
        if (this.books.has(name)) {
            console.log("Address Book with name '".concat(name, "' already exists!"));
        }
        else {
            this.books.set(name, new AddressBook());
            console.log("Address Book '".concat(name, "' created successfully."));
        }
    };
    AddressBookSystem.prototype.getAddressBook = function (name) {
        return this.books.get(name);
    };
    AddressBookSystem.prototype.listAddressBooks = function () {
        console.log("Available Address Books:");
        this.books.forEach(function (_book, name) { return console.log(name); });
    };
    AddressBookSystem.prototype.searchByCityOrState = function (property, value) {
        var found = false;
        this.books.forEach(function (book, bookName) {
            var results = book.searchByCityOrState(property, value);
            results.forEach(function (name) {
                console.log("[".concat(bookName, "] ").concat(name));
                found = true;
            });
        });
        if (!found) {
            console.log("No person found in ".concat(value));
        }
    };
    AddressBookSystem.prototype.buildDictionaries = function () {
        var _this = this;
        this.cityDictionary.clear();
        this.stateDictionary.clear();
        this.books.forEach(function (book) {
            for (var _i = 0, _a = book.getContacts(); _i < _a.length; _i++) {
                var contact = _a[_i];
                // City dictionary
                if (!_this.cityDictionary.has(contact.city)) {
                    _this.cityDictionary.set(contact.city, []);
                }
                _this.cityDictionary.get(contact.city).push(contact);
                // State dictionary
                if (!_this.stateDictionary.has(contact.state)) {
                    _this.stateDictionary.set(contact.state, []);
                }
                _this.stateDictionary.get(contact.state).push(contact);
            }
        });
    };
    AddressBookSystem.prototype.viewByCity = function (city) {
        var persons = this.cityDictionary.get(city);
        if (persons && persons.length > 0) {
            console.log("Persons in city ".concat(city, ":"));
            persons.forEach(function (c) { return console.log("- ".concat(c.fname, " ").concat(c.lname)); });
        }
        else {
            console.log("No persons found in city ".concat(city));
        }
    };
    AddressBookSystem.prototype.viewByState = function (state) {
        var persons = this.stateDictionary.get(state);
        if (persons && persons.length > 0) {
            console.log("Persons in state ".concat(state, ":"));
            persons.forEach(function (c) { return console.log("- ".concat(c.fname, " ").concat(c.lname)); });
        }
        else {
            console.log("No persons found in state ".concat(state));
        }
    };
    AddressBookSystem.prototype.countByCity = function (city) {
        var count = 0;
        this.books.forEach(function (book) {
            book.getContacts().forEach(function (contact) {
                if (contact.city.toLowerCase() === city.toLowerCase()) {
                    count++;
                }
            });
        });
        return count;
    };
    AddressBookSystem.prototype.countByState = function (state) {
        var count = 0;
        this.books.forEach(function (book) {
            book.getContacts().forEach(function (contact) {
                if (contact.state.toLowerCase() === state.toLowerCase()) {
                    count++;
                }
            });
        });
        return count;
    };
    return AddressBookSystem;
}());
function menu(system) {
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
        var option = readlineSync.questionInt("Select option: ");
        switch (option) {
            case 1: {
                var name_1 = readlineSync.question("Enter Address Book name: ");
                system.addAddressBook(name_1);
                break;
            }
            case 2: {
                var bookName = readlineSync.question("Book to add contact to: ");
                var book = system.getAddressBook(bookName);
                if (book) {
                    var fname = readlineSync.question("First name: ");
                    var lname = readlineSync.question("Last name: ");
                    var address = readlineSync.question("Address: ");
                    var city = readlineSync.question("City: ");
                    var state = readlineSync.question("State: ");
                    var zipcode = readlineSync.questionInt("Zipcode: ");
                    var phoneNumber = readlineSync.questionInt("Phone Number: ");
                    var email = readlineSync.question("Email: ");
                    var contact = new Contact(fname, lname, address, city, state, zipcode, phoneNumber, email);
                    book.addContact(contact);
                }
                else {
                    console.log("Book not found.");
                }
                break;
            }
            case 3: {
                var bookName = readlineSync.question("Book name to view: ");
                var book = system.getAddressBook(bookName);
                if (book) {
                    book.getContacts().forEach(function (c) { return console.log(c.toString()); });
                }
                else {
                    console.log("Book not found.");
                }
                break;
            }
            case 4: {
                var bookName = readlineSync.question("Book name: ");
                var book = system.getAddressBook(bookName);
                if (book) {
                    var name_2 = readlineSync.question("Enter First Name of contact to edit: ");
                    var property = readlineSync.question("Property to edit (fname/lname/address/city/state/zipcode/phoneNumber/email): ");
                    var change = readlineSync.question("New value: ");
                    book.editContact(name_2, property, change);
                }
                break;
            }
            case 5: {
                var bookName = readlineSync.question("Book name: ");
                var book = system.getAddressBook(bookName);
                if (book) {
                    var name_3 = readlineSync.question("Enter First Name of contact to delete: ");
                    book.deleteContact(name_3);
                }
                break;
            }
            case 6: {
                var city = readlineSync.question("City to search: ");
                system.searchByCityOrState("city", city);
                break;
            }
            case 7: {
                var state = readlineSync.question("State to search: ");
                system.searchByCityOrState("state", state);
                break;
            }
            case 8: {
                system.buildDictionaries();
                var city = readlineSync.question("City: ");
                system.viewByCity(city);
                break;
            }
            case 9: {
                system.buildDictionaries();
                var state = readlineSync.question("State: ");
                system.viewByState(state);
                break;
            }
            case 10: {
                var city = readlineSync.question("City: ");
                console.log("Count: ".concat(system.countByCity(city)));
                break;
            }
            case 11: {
                var state = readlineSync.question("State: ");
                console.log("Count: ".concat(system.countByState(state)));
                break;
            }
            case 12: {
                var bookName = readlineSync.question("Book name: ");
                var book = system.getAddressBook(bookName);
                if (book)
                    book.sortBy("fname");
                break;
            }
            case 13: {
                var bookName = readlineSync.question("Book name: ");
                var book = system.getAddressBook(bookName);
                if (book) {
                    var field = readlineSync.question("Sort by: ");
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
var system = new AddressBookSystem();
menu(system);
