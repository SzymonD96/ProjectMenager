//Project Type
export var ProjecStatus;
(function (ProjecStatus) {
    ProjecStatus[ProjecStatus["Active"] = 0] = "Active";
    ProjecStatus[ProjecStatus["Finished"] = 1] = "Finished";
})(ProjecStatus || (ProjecStatus = {}));
export class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
