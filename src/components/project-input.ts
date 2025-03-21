import { Component } from "./base-component.js";
import { Validatable, validate } from "../util/validation.js";
import { autobind } from "../util/autobind.js";
import { projectStateManager } from "../state/project-state.js";

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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