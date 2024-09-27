class projectButton {
    constructor(
      title,
      year
    ) {
      this.title = title;
      this.year = year;

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

      let buttonContainer = document.getElementById("project-list");
      buttonContainer.appendChild(this.button);
    }

    
  }