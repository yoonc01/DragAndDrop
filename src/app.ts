class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    constructor() {
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
        this.attach();
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}

new ProjectInput();