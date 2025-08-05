class categoryButton {
    constructor(
        title
    ) {
        this.title = title;

        this.createButton();
        this.createProjectList();
    }
    
    createButton() {
        // title
        this.titleBox = document.createElement("p");
        this.titleBox.classList.add("title");
        this.titleBox.textContent = this.title;
        
        // button
        this.button = document.createElement("a");
        this.button.classList.add("project-button");

        this.button.appendChild(this.titleBox);
      
        // choose the right container
        let buttonContainer = document.getElementById("category-list");
        buttonContainer.appendChild(this.button);
    }

    createProjectList() {
        // div
        this.projectList = document.createElement("div");
        this.projectList.classList.add("project-list");
        this.button.after(this.projectList);
    }
  }