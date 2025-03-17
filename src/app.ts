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
        isValid = isValid && validatableInput.value > validatableInput.minValue;
    if (validatableInput.maxValue !== undefined && typeof validatableInput.value === "number")
        isValid = isValid && validatableInput.value > validatableInput.maxValue;
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

// Project Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        // document에서 검색하므로 getElementById를 통해 검색(document 객체에서 ID를 기준으로 즉시 검색하여 최적화)
        const templateEl = document.getElementById("project-input");
        const hostEl = document.getElementById("app");

        if (!templateEl)
            throw new Error("Could not find project-input element!");
        this.templateElement = templateEl as HTMLTemplateElement;

        if (!hostEl)
            throw new Error("Could not find app element!");
        this.hostElement = hostEl as HTMLDivElement;

        const importedHtmlContent = document.importNode(this.templateElement.content, true);
        this.element  = importedHtmlContent.firstElementChild as HTMLElement;
        this.element.id = "user-input";

        // 범위가 좁혀졌으니 querySelector를 통해 가독성 향상
        this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description")! as HTMLInputElement;

        this.configure();
        this.attach();
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
            const [title, decsription, people] = userInputs;
            console.log(title, decsription, people);
            this.clearInputs();
        }
    }

    private configure() {
        // binding을 하지 않으면 콜백함수를 호출하는 친구는 this.element이기에 submitHandler의 this는 this.element가 된다.
        this.element.addEventListener("submit", this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}

// ProjectList Class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    constructor(private type: "active" | "finished") {
        const templateEl = document.getElementById("project-list");
        const hostEl = document.getElementById("app");

        if (!templateEl)
            throw new Error("Could not find project-list element!");

        if (!hostEl)
            throw new Error("Could not find app element!");

        this.templateElement = templateEl as HTMLTemplateElement;
        this.hostElement = hostEl as HTMLDivElement;

        const importedHtmlContent = document.importNode(this.templateElement.content, true);
        this.element = importedHtmlContent.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    }

    private attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");
