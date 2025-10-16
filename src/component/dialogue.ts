export default class Dialogue {
    declare container: HTMLDivElement
    constructor(text: string, x: number, y: number) {
        this.container = document.createElement("div")
        this.container.style.position = "fixed";
        const width = 500;
        const height = 200;
        this.container.style.width = width + "px";
        this.container.style.height = height + "px";
        const posX = x - width / 2
        const posY = y - height / 2
        this.container.style.left = posX + "px";
        this.container.style.top = posY + "px";
        this.container.style.borderStyle = "solid";
        this.container.style.borderColor = "white";
        this.container.style.borderRadius = "2px";
        this.container.style.outline = "";
        this.container.style.backgroundColor = "black";
        this.container.id = "dialogue"
        this.container.style.display = "flex"
        this.container.style.alignItems = "center"
        this.container.style.justifyContent = "center"

        //text
        const textElem = document.createElement("p")
        textElem.style.color = "white"
        textElem.style.fontSize = "24px"
        textElem.innerHTML = text
        textElem.style.userSelect = "none"
        this.container.append(textElem)
    }
}