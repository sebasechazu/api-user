'use strict'
class User {
    constructor(name, phone, user, password, type, note, status) {
        this.name = name;
        this.phone = phone;
        this.user = user;
        this.password = password;
        this.type = type;
        this.note = note;
        this.status = status;
    }
}

export default User;