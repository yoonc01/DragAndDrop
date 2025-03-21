import { Component } from "./base-component.js";
import { Project } from "../models/project.js";

// ProjectItem Class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
    private project: Project;

    get assignedPeople() {
        if (this.project.people === 1)
            return "1 person";
        else
            return `${this.project.people} people`;
    }

    constructor(hostId: string, project: Project) {
        super("single-project", hostId, project.id, "beforeend");
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure() {

    }

    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = `${this.assignedPeople} assigned`;
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}