import { Person } from './person';
describe('my first test', () => {
    let person: Person;
    beforeEach(() => {
        person = new Person('John', 'Doe');
    });
    it('should spy on property', () => {
        const spy = spyOnProperty(person, 'fullName').and.returnValue('dummy stubbed name');
        expect(person.fullName).toBe('dummy stubbed name');
        expect(spy).toHaveBeenCalled();
    });
    it('should spy on method', () => {
        function stub() {
            return 26;
        }
        const spy = spyOn(person, 'someMethod').and.returnValue(stub());
        expect(person.someMethod()).toBe(26);
        expect(spy).toHaveBeenCalled();
    });
});
