export enum ProjectStatus {
    Active,
    Finished
}

export class Project {
    private static idCounter: number = 0;
    id: string;
    title: string;
    description: string;
    people: number;
    status: ProjectStatus;

    constructor(title: string, description: string, people: number, status: ProjectStatus) {
        this.id = (Project.idCounter++).toString();
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}