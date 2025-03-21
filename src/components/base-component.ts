export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
