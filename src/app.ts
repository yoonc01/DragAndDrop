// Validate
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required)
        isValid = isValid && validatableInput.toString().trim().length !== 0;
    if (validatableInput.minLength !== undefined && typeof validatableInput.value == "string")
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    if (validatableInput.maxLength !== undefined && typeof validatableInput.value == "string")
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    if (validatableInput.minValue !== undefined && typeof validatableInput.value === "number")
        isValid = isValid && validatableInput.value >= validatableInput.minValue;
    if (validatableInput.maxValue !== undefined && typeof validatableInput.value === "number")
        isValid = isValid && validatableInput.value <= validatableInput.maxValue;
    return isValid;

}

// autobind decorator
// target과 methodName를 사용하지 않으므로 _, _2로 선언해도 된다.
const autobind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(templateId: string, hostId: string, elementId: string, insertPosition: InsertPosition) {
        // document에서 검색하므로 getElementById를 통해 검색(document 객체에서 ID를 기준으로 즉시 검색하여 최적화)
        const templateEl = document.getElementById(templateId);
        const hostEl = document.getElementById(hostId);

        if (!templateEl)
            throw new Error("Could not find project-input element!");
        this.templateElement = templateEl as HTMLTemplateElement;

        if (!hostEl)
            throw new Error("Could not find app element!");
        this.hostElement = hostEl as T;

        const importedHtmlContent = document.importNode(this.templateElement.content, true);
        this.element = importedHtmlContent.firstElementChild as U;
        this.element.id = elementId;
        this.attach(insertPosition);
    }

    // "beforebegin" | "afterbegin" | "beforeend" | "afterend" === InsertPosition
    private attach(insertPosition: InsertPosition) {
        this.hostElement.insertAdjacentElement(insertPosition, this.element);
    }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super("project-input", "app", "user-input","afterbegin");

        // 범위가 좁혀졌으니 querySelector를 통해 가독성 향상
        this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description")! as HTMLInputElement;

        this.configure();
    }

    private getUserInputs(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        }

        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            minValue: 1,
            maxValue: 5,
        }

        if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable))
            alert("Invalid input, please try again!");
        else
            return [enteredTitle, enteredDescription, +enteredPeople];
    }

    private clearInputs() {
        this.titleInputElement.value = "";
        this.peopleInputElement.value = "";
        this.descriptionInputElement.value = "";
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInputs = this.getUserInputs();
        // 튜플을 js에서 array다!
        if (Array.isArray(userInputs))
        {
            const [title, description, people] = userInputs;
            projectStateManager.addProject(title, description, people);
            this.clearInputs();
        }
    }

    configure() {
        // binding을 하지 않으면 콜백함수를 호출하는 친구는 this.element이기에 submitHandler의 this는 this.element가 된다.
        this.element.addEventListener("submit", this.submitHandler);
    }
}

// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
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

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
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

enum ProjectStatus {
    Active,
    Finished
}

class Project {
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

type Listener<T> = (items: T[]) => void;

class ProjectStateManager{
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

const projectStateManager = ProjectStateManager.getInstance();

new ProjectInput();
new ProjectList(ProjectStatus.Active);
new ProjectList(ProjectStatus.Finished);
