class projectButton {
    constructor(
      title,
      year,
      category,
      isDone,
      projectList
    ) {
      this.title = title;
      this.year = year;
      this.category = category;
      this.isDone = isDone;
      this.projectList = projectList;

      this.createButton();
    }
    
    createButton() {
      // title
      this.titleBox = document.createElement("p");
      this.titleBox.classList.add("title");
      this.titleBox.textContent = this.title;
      // year
      this.yearBox = document.createElement("p");
      this.yearBox.classList.add("year");
      this.yearBox.textContent = this.year;
      // button
      this.button = document.createElement("a");
      this.button.classList.add("project-button");
      
      this.button.appendChild(this.titleBox);
      this.button.appendChild(this.yearBox);
      

      // choose the right container
      this.projectList.appendChild(this.button);
    }
  }