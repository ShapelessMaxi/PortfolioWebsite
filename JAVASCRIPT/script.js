window.onload = (event) => {
  
  // rt: returnPage (which page are we coming from?)
  // lg: language (which language should we display)
  // pr: last project displayed
  // interest: randomized project when coming from an interest card

  // Find Variables by searching the current URL
  function urlSearch (parameter, parameterDefault) {
    let currentUrl = new URLSearchParams(window.location.search);
    parameter = currentUrl.get(parameter) || parameterDefault;
    return parameter
  }

  // Construct the URL with searchable Variables
  function urlBuilder (targetPage, language = null, returnPage = null, lastProject = null) {
    let url = `\\${targetPage}.html`;
    if (language) {
      url += `?lg=${language}`;
    }
    if (returnPage) {
      url += `&returnPage=${returnPage}`;
    }
    if (lastProject) {
      url += `&pr=${lastProject}`;
    }
    return url 
  }


  // Find which language was selected, then change the JSON file path
  let dataFile
  let urlParameters = new URLSearchParams(window.location.search);
  // Get the 'lg' parameter value from the URL query string; default to "en" if not found
  let language = urlParameters.get("lg") || "en";
  // Construct the file path for the project data based on the language parameter
  dataFile = "\data-" + language + ".json";

  // fetch data from the correct json file
  fetch(dataFile)
    .then((response) => response.json())
    .then((data) => {
    
    // call different actions depending on which page is displayed
    switch (document.body.getAttribute("page")) {
                
      case "splash":
        
        // Language buttons interactions
        const lgButtons = document.querySelectorAll('#eng-button, #fr-button');
        lgButtons.forEach(button => {
          button.addEventListener('click', () => {
            // get chosen language from element html data
            const lg = button.dataset.lang;
            // check which page we came from
            let rt = urlSearch("rt", "gallery");
            // Construct the nextPage URL after the language has been set
            let nextPage = rt + ".html?lg=" + lg;
            // Update the button's href
            button.href = nextPage;
          });
        });
      
      break;  
        
      case "about":

        // get language from url
        let lg = urlSearch("lg", "en");

        // change titles and other text depending on language
        if (lg === "fr") {
          document.getElementsByClassName('titles')[0].innerText = "Biographie";
          document.getElementsByClassName('titles')[1].innerText = "Déclaration";
          document.getElementById('language').children[0].innerText = "Langage";
        } else {
          document.getElementsByClassName('titles')[0].innerText = "Biography";
          document.getElementsByClassName('titles')[1].innerText = "Statement";
          document.getElementById('language').children[0].innerText = "Language";
        }
        // update the bio and statement text
        let paragraphs = document.querySelectorAll('.paragraphs');
        paragraphs.forEach((paragraph, index) => {
          if (index === 0) {
            paragraph.textContent = data.about[0].bio;
          } else if (index === 1) {
            paragraph.textContent = data.about[0].statement;
          }
        });

        // get the last project id displayed when coming from the gallery page
        let lastProject = urlSearch("pr", 0);
        // create the portfolio button url
        let portfolioButton = document.getElementById('portfolio-button');
        portfolioButton.href = urlBuilder("gallery", lg, null, lastProject);

        // create an object for each interest
        let interests = [];
        for (let i = 0; i < data.interests.length; i++) {
          // create all interests objects
          let currentInterest = new interest(
            data.interests[i].title,  
            data.interests[i].summary,
            data.interests[i].description,
            data.interests[i].tag            
          );
          interests.push(currentInterest);
        }
        // create all interest cards
        let interestCards = [];
        for (let i = 0; i < data.interests.length; i++) {
          let currentCard = new interestCard(
            data.interests[i].title,
            data.interests[i].summary,
            data.interests[i].description,
            data.interests[i].tag,
            lg
          );
          interestCards.push(currentCard);
        }

        // dropdown buttons interaction, reveal textboxes
        document.querySelectorAll('.drop-button').forEach(button => {
          button.addEventListener('click', function() {
            textbox = button.nextElementSibling;
            title = button.children[0];
            if (textbox.classList.contains('active')){
              title.classList.remove('active');
              textbox.classList.remove('active');
            } else {
              title.classList.add('active');
              textbox.classList.add('active');
            }
            });
        });
        // horizontal scrolling for interest cards
        const scrollContainer = document.getElementById('interest-cards-box');
        let isScrolling = false;
        let targetScroll = 0;
        const scrollSpeed = 0.75;
        scrollContainer.addEventListener('wheel', e => {
          // Check if the event is from a touchpad
          if (Math.abs(e.deltaY) < 40) {
            // Let the browser handle the touchpad's default smooth scrolling
            return;
          }

          e.preventDefault(); // Prevent default scroll behavior
          targetScroll += e.deltaY * scrollSpeed;
        
          // Start smooth scrolling if it's not already active
          if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(smoothScroll);
          }
        });
        function smoothScroll() {
          // Get the current scroll position
          const currentScroll = scrollContainer.scrollLeft;
      
          // Calculate the step to move towards the target scroll position
          const scrollStep = (targetScroll - currentScroll) * 0.1;  // This determines how smooth the scroll is
          
          // Move the scroll position
          scrollContainer.scrollLeft += scrollStep;
      
          // Check if the scroll is close to the target, stop the animation
          if (Math.abs(targetScroll - currentScroll) > 1) {
              requestAnimationFrame(smoothScroll);
          } else {
              isScrolling = false;  // Stop scrolling when we reach the target
          }
        }

        break;
        
      case "gallery":

        // Remove last project from the json file (its a template to add more porjects more easily)
        data.projects.pop();

        // create an object for each project
        let projects = [];
        for (let i = 0; i < data.projects.length; i++) {
          // create all project objects
          let currentProject = new project(
            data.projects[i].title,
            data.projects[i].year,
            data.projects[i].filters,
            data.projects[i].isDone,
            data.projects[i].gallery,
            data.projects[i].keywords,
            data.projects[i].description,
            data.projects[i].tools,
            data.projects[i].documentation                 
          );
          projects.push(currentProject);
        }

        // get language from url
        let lgGallery = urlSearch ("lg", "en");
        
        // Determine the displayed project from the URL or default to the first project
        let lastProjectID = urlSearch ("pr", 0);
        let displayedProject = projects[lastProjectID];            

        // getting an interest tag from the about page
        let interestProject = urlSearch("interest", null);
        if (interestProject) {
          // check which project can be of interest (from about page)
          let interestingProjects = [];
          for (let i = 0; i < projects.length; i++) {
            if (projects[i].filters.includes(interestProject)){
              interestingProjects.push(projects[i]);
            }               
          };
          // Get a random project
          let rIndex = Math.floor(Math.random() * interestingProjects.length);
          displayedProject = interestingProjects[rIndex];
        }
        
        // create all finished project buttons
        let finishedProjectButtons = [];
        for (let i = 0; i < data.projects.length; i++) {
          if (data.projects[i].isDone == "True") {
            let currentButton = new projectButton(
              data.projects[i].title,
              data.projects[i].year,
              data.projects[i].isDone
            );
            finishedProjectButtons.push(currentButton);
          }
        }
        // create all wip project buttons
        let wipProjectButtons = [];
        for (let i = 0; i < data.projects.length; i++) {
          if (data.projects[i].isDone == "False") {
            let currentButton = new projectButton(
              data.projects[i].title,
              data.projects[i].year,
              data.projects[i].isDone
            );
            wipProjectButtons.push(currentButton);
          }
        }
        // activating the correct button
        let allButtons = document.querySelectorAll('.project-button');
        for (let i = 0; i < allButtons.length; i++) {
          let buttonTitle = allButtons[i].firstElementChild.innerText;
          if (buttonTitle === displayedProject.title){
            allButtons[i].classList.add('active');
          }
        }
        // project buttons interaction
        document.querySelectorAll('.project-button').forEach(button => {
          button.addEventListener('click', function() {
            // Remove Keywords and tools
            document.querySelectorAll('.keyword').forEach(keyword => keyword.remove());
            document.querySelectorAll('.tool').forEach(tool => tool.remove());

            // Remove Documentation buttons
            document.querySelectorAll('.doc-button').forEach(keyword => keyword.remove());

            // Remove Description
            let description = document.getElementById("description");
            Array.from(description.children).forEach(paragraph => paragraph.remove());

            // Remove and add 'active' class from all buttons
            document.querySelectorAll('.project-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // check which project is associated with the button
            let currentTitle = this.childNodes[0].innerText;
            for (let p = 0; p < projects.length; p++) {
              if (currentTitle === projects[p].title) {
                displayedProject = projects[p];
                // reset gallery buttons click counts
                currentImgIndex = 0;
                imgCount = displayedProject.gallery.length;
                
                // update page content according to displayed project
                updateContent(displayedProject, lgGallery);

                // update url
                console.log(displayedProject)

                // update project id
                lastProjectID = p;
              }
            }
          });  
        });

        // Language button interaction
        // Pass the current project ID in the URL
        let langButton = document.getElementById("language");
        langButton.addEventListener("click", (event) => {
          if (lgGallery === 'en'){
            lgGallery = 'fr';
          } else {
            lgGallery = 'en';
          };
          langButton.href = urlBuilder("gallery", lgGallery, null, lastProjectID); 
        });

        // pass the language var in the url
        let aboutButtons = [document.getElementById('logo'), document.getElementById('name'), document.getElementById('alias')];
        aboutButtons.forEach(button => {
          button.href  = urlBuilder("about", lgGallery, null, lastProjectID);
        });
        
        // update page content according to current project
        updateContent(displayedProject, lgGallery);
        // reset gallery buttons click counts
        let currentImgIndex = 0;
        let imgCount = displayedProject.gallery.length;

        let galleryElement = document.getElementById("gallery-img");
        let captionElement = document.getElementById("caption");
        function updateGallery(indexChange) {
          // Update the current image index
          currentImgIndex += indexChange;
          if (currentImgIndex < 0) currentImgIndex = imgCount - 1;
          if (currentImgIndex >= imgCount) currentImgIndex = 0;

          // Update the gallery image and caption
          galleryElement.src = displayedProject.gallery[currentImgIndex].dir;
          captionElement.innerText = displayedProject.gallery[currentImgIndex].caption;

          // Update the lightbox image and caption
          document.getElementById('lightbox-img').src = displayedProject.gallery[currentImgIndex].dir;
          document.getElementById('lightbox-caption').innerText = displayedProject.gallery[currentImgIndex].caption;
        }
        // Right 
        document.getElementById('right-gallery-button').addEventListener('click', () => updateGallery(1));
        // Left button
        document.getElementById('left-gallery-button').addEventListener('click', () => updateGallery(-1));

        // Left and Right Keyboard arrows to naviguate gallery images
        document.addEventListener("keydown", (e) => {
          if (e.key === "ArrowLeft") updateGallery(-1);
          else if (e.key === "ArrowRight") updateGallery(1);
        });

        let lightbox = document.getElementById("lightbox");
        let lightboxImg = document.getElementById("lightbox-img");
        // close lightbox by default
        lightbox.style.display = "none";
        // Open lightbox on gallery image click
        galleryElement.addEventListener("click", () => {
          lightboxImg.src = galleryElement.src;
          lightbox.style.display = "flex";
        });
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            lightbox.style.display = "none";
          }
        });
        // Right Lightbox button
        document.getElementById('right-lightbox-button').addEventListener('click', () => updateGallery(1));
        // Left Lightbox button
        document.getElementById('left-lightbox-button').addEventListener('click', () => updateGallery(-1));
        // Close lightbox on clicking outside the image
        lightbox.addEventListener("click", (e) => {
          // Check if the click happened on the lightbox background and not the image
          if (e.target === lightboxImg || e.target === lightbox) {
            lightbox.style.display = "none";
          }
        });

      break;
    
      case "log":
          let urlParams = new URLSearchParams(window.location.search);
          let logFilePath = urlParams.get("log");

          if (logFilePath) {
            fetch(logFilePath)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch the log file. Status: ${response.status}`);
                }
                return response.text();
              })
              .then((data) => {
                document.getElementById("textlog").innerHTML = data;
                console.log("Log file content:", data);
              })
              .catch((error) => {
                console.error("Error fetching log file:", error);
                document.getElementById("textlog").innerText = "Failed to load the log file.";
              });
          } else {
            console.warn("No log file specified.");
            document.getElementById("textlog").innerText = "No log file specified.";
          }
          
          break;
    }
  });
}

// papge population
function createDocButtons (displayedProject) {
  if (displayedProject.documentation[0].tag === "") {
    // do not create a button
  } else {
      for (let d = 0; d < displayedProject.documentation.length; d++) {
      let currentDocButton = document.createElement("div");
      currentDocButton.classList.add('doc-button');
      currentDocButton.setAttribute("target", "_blank");
      currentDocButton.setAttribute("href", "");
      document.getElementById("doc-button-box").appendChild(currentDocButton);

      let currentButtonText = document.createElement("span");
      currentButtonText.classList.add('doc-button-text');
      currentButtonText.innerText = displayedProject.documentation[d].tag;
      currentDocButton.appendChild(currentButtonText);

      let extArrowImg = document.createElement("img");
      extArrowImg.classList.add('ext-arrow-icon');
      extArrowImg.src = "\assets\\arrow_ext_h.png";
      currentDocButton.appendChild(extArrowImg);
      
      currentDocButton.addEventListener("click", function(event) {
        // dimensions based on screen size
        let logWidth = Math.round(screen.width * 0.4);
        let logLeft = Math.round(screen.width * 0.1);
        let docWidth = Math.round(screen.width * 0.6);
        let docLeft = Math.round(screen.width * 0.333);
        let extHeight = Math.round(screen.height * 0.666);
        let extTop = Math.round(screen.height * 0.2);

        // Check if the tag is "Log" or not
        if (displayedProject.documentation[d].tag === "Log") {
          // Open the log page
          let logFilePath = displayedProject.documentation[d].link;
          let options = `width=${logWidth},height=${extHeight},left=${logLeft},top=${extTop},scrollbars=yes,resizable=yes`;
          window.open(`log.html?log=${encodeURIComponent(logFilePath)}`, "log", options);
        } else {
          // Open the external docs
          let options = `width=${docWidth},height=${extHeight},left=${docLeft},top=${extTop},scrollbars=yes,resizable=yes`;
          window.open(displayedProject.documentation[d].link, "doc", options);
        }
      });
    };
  }
}
function updateContent (displayedProject, language) {
  // Extra doc buttons
  createDocButtons(displayedProject);
  
  // description
  for (let i = 0; i < displayedProject.description.length; i++){
    let paragraph = document.createElement("p");
    paragraph.innerText = displayedProject.description[i];
    document.getElementById("description").appendChild(paragraph);
  }

  // tools
  if (language === 'fr'){
    document.getElementById("tools-box").children[0].innerText = "Outils:";
    document.getElementById("keywords-box").children[0].innerText = "Mots clés:";
    document.getElementById("finished-projects-title").innerText = "Complétés";
    document.getElementById("wip-projects-title").innerText = "En Cours";
  } else {
    document.getElementById("tools-box").children[0].innerText = "Tools:";
    document.getElementById("keywords-box").children[0].innerText = "Keywords:";
    document.getElementById("finished-projects-title").innerText = "Finished";
    document.getElementById("wip-projects-title").innerText = "WIP";

  }
  for (let t = 0; t < displayedProject.tools.length; t++) {
    let currentTool = document.createElement("span");
    currentTool.classList.add("tool");
    currentTool.innerText = displayedProject.tools[t];
    document.getElementById("tools-box").appendChild(currentTool);
  }
  // keywords
  for (let k = 0; k < displayedProject.keywords.length; k++) {
    let currentKeyword = document.createElement("span");
    currentKeyword.classList.add("keyword");
    currentKeyword.innerText = displayedProject.keywords[k];
    document.getElementById("keywords-box").appendChild(currentKeyword);
  }

  // title and year
  document.getElementById("title").innerText = displayedProject.title;
  document.getElementById("year").innerText = displayedProject.year;

  // display the first image and caption
  let galleryElement = document.getElementById("gallery-img");
  galleryElement.src = displayedProject.gallery[0].dir;
  let captionElement = document.getElementById("caption");
  captionElement.innerText = displayedProject.gallery[0].caption;
}
