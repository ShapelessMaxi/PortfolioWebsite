class interestCard {
    constructor(
      title,
      summary,
      description,
      tag
    ) {
      this.title = title;
      this.summary = summary;
      this.description = description;
      this.tag= tag;

      this.createCard();
    }
    
    createCard() {
      // title
      this.titleBox = document.createElement("p");
      this.titleBox.classList.add("interest-title");
      this.titleBox.textContent = this.title;
      // summary
      this.summaryBox = document.createElement("p");
      this.summaryBox.classList.add("interest-summary");
      this.summaryBox.textContent = this.summary;
      // description
      this.descriptionBox = document.createElement("p");
      this.descriptionBox.classList.add("interest-description");
      this.descriptionBox.textContent = this.description;

      // related project button
      this.button = document.createElement("a");
      this.button.textContent = "related project";
      if (this.title === "Tattooing") {
        this.button.href = 'https://www.instagram.com/hd.maxi/';
        this.button.target= '_blank';
      } else {
        let interest = this.tag;
        this.button.href = `/index.html?interest=${encodeURIComponent(interest)}`;
      }
      this.button.classList.add("project-button");

      // link icon
      let linkImg = document.createElement("img");
      linkImg.classList.add('link-icon');
      linkImg.src = "\assets\\arrow_ext_h.png";
      this.button.appendChild(linkImg);

      // card
      this.card = document.createElement("div");
      this.card.classList.add("interest-cards");     
      
      this.card.appendChild(this.titleBox);
      this.card.appendChild(this.summaryBox);
      this.card.appendChild(this.descriptionBox);
      this.card.appendChild(this.button);
    
      let cardContainer = document.getElementById("interest-cards-box");
      cardContainer.appendChild(this.card);
        
    }

    
  }