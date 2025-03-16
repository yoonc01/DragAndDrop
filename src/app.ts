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

    private submitHandler(event: Event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
    }

    private configure() {
        // binding을 하지 않으면 콜백함수를 호출하는 친구는 this.element이기에 submitHandler의 this는 this.element가 된다.
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}

new ProjectInput();