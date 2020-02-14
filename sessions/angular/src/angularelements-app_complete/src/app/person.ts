export class Person {
    constructor(private firstName: string, private lastName: string) {
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    someMethod() {
        return 42;
    }
}
