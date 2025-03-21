import { Component } from "./base-component.js";
import { Project } from "../models/project.js";
import { ProjectStatus } from "../models/project.js";
import { projectStateManager } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";

// ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> {
    assignedProjects: Project[];
    private type: ProjectStatus;

    constructor(type: ProjectStatus) {
        const status = type === ProjectStatus.Active ? "active" : "finished";
        super("project-list", "app", `${status}-projects`, "beforeend");
        this.assignedProjects = [];
        this.type = type;


        projectStateManager.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(project => project.status === this.type);
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
        this.renderContent();
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
