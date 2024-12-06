class interestCard {
    constructor(
      title,
      summary,
      description,
      tag,
      language
    ) {
      this.title = title;
      this.summary = summary;
      this.description = description;
      this.tag= tag;
      this.language = language;

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
      // button icon
      let linkImg = document.createElement("img");
      linkImg.classList.add('link-icon');
      linkImg.src = "\assets\\arrow_ext_h.png";
      // Append the first icon
      // this.button.appendChild(linkImg.cloneNode(true));
      // this.button.appendChild(linkImg.cloneNode(true));
      // this.button.appendChild(linkImg.cloneNode(true));
      // Add text to the button
      let text = '';
      if (this.language === "fr") {
        text = 'Project Associé';
      } else {
        text = 'Related Project';
      }
      const buttonText = document.createTextNode(text);
      this.button.appendChild(buttonText);
      // Append the second icon
      this.button.appendChild(linkImg.cloneNode(true));
      // button url
      if (this.title === "Tattooing") {
        this.button.href = 'https://www.instagram.com/hd.maxi/';
        this.button.target= '_blank';
      } else {
        let interest = this.tag;
        this.button.href = `/gallery.html?lg=${encodeURIComponent(this.language)}&interest=${encodeURIComponent(interest)}`;
      }
      this.button.classList.add("project-button");
      
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