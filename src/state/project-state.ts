import { Project, ProjectStatus } from "../models/project.js";

type Listener<T> = (items: T[]) => void;

export class ProjectStateManager {
    private listeners: Listener<Project>[] = [];
    private projects: Project[] = [];
    private static instance: ProjectStateManager;

    private constructor() {}

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectStateManager();
        return this.instance;
    }

    addListener(listenerFn: Listener<Project>) {
        this.listeners.push(listenerFn);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn([...this.projects]);
        }
    }
}

export const projectStateManager = ProjectStateManager.getInstance();
