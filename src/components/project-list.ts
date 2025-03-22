import { Component } from "./base-component.js";
import { Project } from "../models/project.js";
import { ProjectStatus } from "../models/project.js";
import { projectStateManager } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";
import { DragTarget } from "../drapAndDrop/drap-and-drop.js";
import { autobind } from "../util/autobind.js";

// ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
    assignedProjects: Project[];
    private type: ProjectStatus;

    constructor(type: ProjectStatus) {
        const status = type === ProjectStatus.Active ? "active" : "finished";
        super("project-list", "app", `${status}-projects`, "beforeend");
        this.assignedProjects = [];
        this.type = type;


        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);

        projectStateManager.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(project => project.status === this.type);
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain")
        {
            event.preventDefault();
            const liseEl = this.element.querySelector("ul")!;
            liseEl.classList.add("droppable");
        }
    }

    @autobind
    dropHandler(event: DragEvent): void {
        const projectId = event.dataTransfer!.getData("text/plain");
        projectStateManager.moveProject(projectId, this.type);
    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
        const liseEl = this.element.querySelector("ul")!;
        liseEl.classList.remove("droppable");
    }

    private renderProjects() {
        const listEl = document.getElementById( `${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = "";
        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
        }
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        const status = this.type === ProjectStatus.Active ? "active" : "finished" ;
        this.element.querySelector("h2")!.textContent = `${status.toUpperCase()} PROJECTS`;
    }
}
