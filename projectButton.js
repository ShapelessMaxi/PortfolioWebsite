class projectButton {
    constructor(
      title,
      year,
      isDone
    ) {
      this.title = title;
      this.year = year;
      this.isDone = isDone;

      this.createButton();
    }
    
    createButton() {
      // title
      this.titleBox = document.createElement("p");
      this.titleBox.classList.add("title");
      this.titleBox.textContent = this.title;
      // year (more in the if statement)
      this.yearBox = document.createElement("p");
      this.yearBox.classList.add("year");
      // button
      this.button = document.createElement("a");
      this.button.classList.add("project-button");
      
      this.button.appendChild(this.titleBox);
      this.button.appendChild(this.yearBox);
      
      if (this.isDone == "True") {
        // year (finalization)
        this.yearBox.textContent = this.year;
        // choose the right container
        let buttonContainer = document.getElementById("project-list");
        buttonContainer.appendChild(this.button);
        
      } else if (this.isDone == "False") {
        // year (finalization)
        let currentYear = new Date().getFullYear()
        this.yearBox.textContent = this.year + " - " + currentYear;
        // choose the right container
        let buttonContainer = document.getElementById("wip-list");
        buttonContainer.appendChild(this.button);
      }
    }

    
  }