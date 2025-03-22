import { Component } from "./base-component.js";
import { Project } from "../models/project.js";
import { Draggable } from "../drapAndDrop/drap-and-drop.js";
import { autobind } from "../util/autobind.js";

// ProjectItem Class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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

        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.renderContent();
    }

    @autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData("text/plain", this.project.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = `${this.assignedPeople} assigned`;
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}