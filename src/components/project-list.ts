import { Component } from "./base-component.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjecStatus } from "../models/project.js";
import { AutoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project.js";
import { ProjectItem } from "./project-item.js";

//ProjectList Class

export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
{
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`);

        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @AutoBind
    dragOverHandler(event: DragEvent): void {
        if (
            event.dataTransfer &&
            event.dataTransfer.types[0] === "text/plain"
        ) {
            event.preventDefault();
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable");
        }
    }

    @AutoBind
    dropHandler(event: DragEvent): void {
        const prjId = event.dataTransfer!.getData("text/plain");
        projectState.moveProject(
            prjId,
            this.type === "active" ? ProjecStatus.Active : ProjecStatus.Finished
        );
    }

    @AutoBind
    dragLeaveHandler(event: DragEvent): void {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable");
    }

    configure(): void {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
        projectState.addListenet((projects: Project[]) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === ProjecStatus.Active;
                }
                return prj.status === ProjecStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent =
            this.type.toUpperCase() + " PROJECTS";
    }

    private renderProjects() {
        const listEl = document.getElementById(
            `${this.type}-projects-list`
        )! as HTMLUListElement;
        listEl.innerHTML = "";
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
        }
    }
}
