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
  function urlBuilder (targetPage, language = null, returnPage = null, projectTitle = null, lastProject = null) {
    let url = `\\${targetPage}.html`;
    
    if (language) {
        url += `?lg=${language}`;
    }
    if (returnPage) {
        url += `${language ? '&' : '?'}returnPage=${returnPage}`;
    }
    if (projectTitle) {
        url += `${language || returnPage ? '&' : '?'}pt=${projectTitle}`;
    } else if (lastProject) {
        url += `${language || returnPage ? '&' : '?'}pr=${lastProject}`;
    }

    return url;
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
        } else {
          document.getElementsByClassName('titles')[0].innerText = "Biography";
          document.getElementsByClassName('titles')[1].innerText = "Statement";
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
        portfolioButton.href = urlBuilder("gallery", lg, null, null, lastProject);

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

        // Add click event to menu button
        let navbar = document.getElementById("navbar");
        let socials = document.getElementById("socials");
        let bunny = document.getElementById("logo");
        let languageBox = document.getElementById("menu-language-box");
        let menuButton = document.getElementById("menu-button");
        document.getElementById("menu-button").addEventListener("click", (event) => {
          if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            socials.classList.remove('active');
            bunny.classList.remove('active');
            languageBox.classList.remove('active');
            menuButton.classList.remove('active');
          } else {
            navbar.classList.add('active');
            socials.classList.add('active');
            bunny.classList.add('active');
            languageBox.classList.add('active');
            menuButton.classList.add('active');
          }           
        });

        // Dropdown buttons interaction, reveal textboxes
        let aboutCards = Array.from(document.getElementsByClassName('about-card'));
        let aboutCover = document.getElementById("content-cover");
      
        // Add click event to all about-cards
        aboutCards.forEach((card) => {
          card.addEventListener('click', function () {
            // Check screen size inside the click
            if (window.matchMedia("(max-width: 1199px)").matches) {
              // If the clicked card is already active, deactivate all
              if (card.classList.contains('active')) {
                aboutCards.forEach((c) => {
                  c.classList.remove('active');
                  c.children[0].classList.remove('active'); 
                  c.children[1].classList.remove('active'); 
                  aboutCover.classList.remove('active'); 
                });
              } else {
                // Otherwise, deactivate all and activate the clicked card
                aboutCards.forEach((c) => {
                  c.classList.remove('active');
                  c.children[0].classList.remove('active'); 
                  c.children[1].classList.remove('active'); 
                  aboutCover.classList.remove('active'); 
                });

                card.classList.add('active');
                card.children[0].classList.add('active');
                card.children[1].classList.add('active'); 
                aboutCover.classList.add('active');
              }
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

        // Language button interaction, Pass the current project ID in the URL
        let languageButtons = [document.getElementById("language"),document.getElementById("menu-language")];
        languageButtons.forEach(button => {
            button.addEventListener("click", (event) => {
            if (lg === 'en'){
              lg = 'fr';
            } else {
              lg = 'en';
            };
            button.href = urlBuilder("index", lg, null, null, lastProject); 
          });
        });

        // remove active class from navbar (static rather than opening menu, like before the mobile version)
        function navbarAdjust(x) {
          if (x.matches) { // If media query matches
            navbar.classList.remove('active');
            socials.classList.remove('active');
            bunny.classList.remove('active');
            languageBox.classList.remove('active');
            menuButton.classList.remove('active');
          }
        }
        // Create a MediaQueryList object
        var x = window.matchMedia("(min-width: 769px)")
        // Call listener function at run time
        navbarAdjust(x);
        // Attach listener function on state changes
        x.addEventListener("change", function() {
          navbarAdjust(x);
        });

        const mq = window.matchMedia("(min-width: 1119px)");
        function coverAdjust(e) {
          if (e.matches) { // screen >= 1019px
            aboutCards.forEach((c) => {
              c.classList.remove('active');
              c.children[0]?.classList.remove('active'); // title
              c.children[1]?.classList.remove('active'); // paragraph
            });
            aboutCover.classList.remove('active');
          }
        }

        // Run on page load
        coverAdjust(mq);

        // Modern listener
        mq.addEventListener("change", coverAdjust);

        break;
        
      case "gallery":

        // Remove last project from the json file (its a template to add more porjects more easily)
        data.projects.pop();

        // create an object for each project
        let projects = [];
        let cleanTitles = [];
        for (let i = 0; i < data.projects.length; i++) {
          // create all project objects
          let currentProject = new project(
            data.projects[i].title,
            data.projects[i].year,
            data.projects[i].filters,
            data.projects[i].category,
            data.projects[i].isDone,
            data.projects[i].gallery,
            data.projects[i].keywords,
            data.projects[i].description,
            data.projects[i].tools,
            data.projects[i].documentation                 
          );
          // create a new variable that will be the title without any punctuation
          cleanTitles.push(currentProject.title.replace(/[^\w]/g, ''));
          projects.push(currentProject);
        }

        // get language from url
        let lgGallery = urlSearch ("lg", "en");
        
        // Determine the displayed project from the URL or default to the first project
        // if the url contains a project title, search for its corresponding ID (index)
        let urlProjectTitle = urlSearch("pt", null);
        let lastProjectID;
        let displayedProject;
        if (urlProjectTitle != null) {
          for (let i = 0; i < cleanTitles.length; i++) {
            let currentTitle = cleanTitles[i];
            if (currentTitle.toLowerCase() === urlProjectTitle.toLowerCase()) {
              lastProjectID = i;
            }
          }
        } else {
          lastProjectID = urlSearch ("pr", 0);
        }
        displayedProject = projects[lastProjectID];
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
        
        // create a list of all projects related to each categories
        let categories = [];
        for (let i = 0; i < data.categories.length; i++) {
          categories.push(data.categories[i])
        }
        let categoryButtons = [];
        for (let i = 0; i < categories.length; i++) {
          let currentCategoryButton = new categoryButton(
            categories[i]
          );
          categoryButtons.push(currentCategoryButton);         
        }
        
        let projectButtons = [];
        for (let i = 0; i < data.projects.length; i++) {
          let project = data.projects[i];
          // Find the matching categoryButton
          let matchedCategory = categoryButtons.find(btn => btn.title === project.category);
          let matchedProjectList = matchedCategory.projectList;
       
          let currentButton = new projectButton(
            project.title,
            project.year,
            project.category,
            project.isDone,
            matchedProjectList
          );
          projectButtons.push(currentButton);
        }
        
        // Add click event to menu button
        let galleryNavbar = document.getElementById("navbar");
        let gallerySocials = document.getElementById("socials");
        let galleryBunny = document.getElementById("logo");
        let galleryLanguageBox = document.getElementById("gallery-menu-language-box");
        let galleryMenuButton = document.getElementById("menu-button");
        document.getElementById("menu-button").addEventListener("click", (event) => {
          if (galleryNavbar.classList.contains('active')) {
            galleryNavbar.classList.remove('active');
            gallerySocials.classList.remove('active');
            galleryBunny.classList.remove('active');
            galleryLanguageBox.classList.remove('active');
            galleryMenuButton.classList.remove('active');
          } else {
            galleryNavbar.classList.add('active');
            gallerySocials.classList.add('active');
            galleryBunny.classList.add('active');
            galleryLanguageBox.classList.add('active');
            galleryMenuButton.classList.add('active');
          }           
        });
        
        // activating the correct category button
        let allCategoryButtons = document.querySelectorAll('.category-button');
        for (let i = 0; i < allCategoryButtons.length; i++) {
          let buttonTitle = allCategoryButtons[i].firstElementChild.innerText;
          if (buttonTitle === displayedProject.category) {
            allCategoryButtons[i].classList.add('active');
          }
        }
        // activating the correct project list
        let allProjectList = document.querySelectorAll('.project-list');
        for (let i = 0; i < allProjectList.length; i++) {
          let categoryButtonText = allProjectList[i].previousSibling.innerText;
          if (categoryButtonText === displayedProject.category){
            allProjectList[i].classList.add('active');
          }
        }
        // activating the correct project button
        let allProjectButtons = document.querySelectorAll('.project-button');
        for (let i = 0; i < allProjectButtons.length; i++) {
          let buttonTitle = allProjectButtons[i].firstElementChild.innerText;
          if (buttonTitle === displayedProject.title) {
            allProjectButtons[i].classList.add('active');
          }
        }

        function lgButtonUrl(lastProjectID) {
          // Language button interaction, Pass the current project ID in the URL
          let languageButtons = [document.getElementById("language"), document.getElementById("menu-language")];
          languageButtons.forEach(button => {
            if (lgGallery === 'en'){
              lgGallery = 'fr';
            } else if (lgGallery === 'fr'){
              lgGallery = 'en';
            };
            button.href = urlBuilder("gallery", lgGallery, null, null, lastProjectID); 
          });
        }
        function aboutButtonsUrl(lastProjectID) {
          let aboutButtons = [document.getElementById('logo'), document.getElementById('name'), document.getElementById('alias')];
          aboutButtons.forEach(button => {
            button.href  = urlBuilder("index", lgGallery, null, null, lastProjectID);
          });
        }

        // remove active class from navbar (static rather than opening menu, like before the mobile version)
        function galleryNavbarAdjust(x) {
          if (x.matches) { // If media query matches
            galleryNavbar.classList.remove('active');
            gallerySocials.classList.remove('active');
            galleryBunny.classList.remove('active');
            galleryLanguageBox.classList.remove('active');
            galleryMenuButton.classList.remove('active');
          }
        }
        // Create a MediaQueryList object
        var x = window.matchMedia("(min-width: 1019px)")
        // Call listener function at run time
        galleryNavbarAdjust(x);
        // Attach listener function on state changes
        x.addEventListener("change", function() {
          galleryNavbarAdjust(x);
        });
        
        // category buttons interaction
        document.querySelectorAll('.category-button').forEach(button => {
          button.addEventListener('click', function() {
            // Remove Keywords and tools
            document.querySelectorAll('.keyword').forEach(keyword => keyword.remove());
            document.querySelectorAll('.tool').forEach(tool => tool.remove());

            // Remove Documentation buttons
            document.querySelectorAll('.doc-button').forEach(keyword => keyword.remove());

            // Remove Description
            let description = document.getElementById("description");
            Array.from(description.children).forEach(paragraph => paragraph.remove());

            // Remove and add 'active' class from all buttons and project lists
            document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.project-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.project-list').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            let activeList = this.nextSibling;
            activeList.classList.add('active');
            // make first project active, but not on mobile version
            let activeProjectButton = activeList.firstElementChild;
            function activateProject(x) {
              if (x.matches) { // If media query matches
                activeProjectButton.classList.add('active');
              }
            }
            // Create a MediaQueryList object
            var x = window.matchMedia("(min-width: 1019px)")
            // Call listener function at run time
            activateProject(x);

            // check which project needs to be displayed
            let activeProjectTitle = activeProjectButton.firstElementChild.innerText;
            for (let p = 0; p < projectButtons.length; p++) {
              if (activeProjectTitle === projectButtons[p].title) {
                displayedProject = projects[p];
                // reset gallery buttons click counts
                currentImgIndex = 0;
                imgCount = displayedProject.gallery.length;
                
                // update page content according to displayed project
                updateContent(displayedProject, lgGallery);
                
                // update project id
                lastProjectID = p;
                // update buttons urls
                lgButtonUrl(lastProjectID);
                aboutButtonsUrl(lastProjectID);
              }
            }
          });  
        });
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
                
                // update project id
                lastProjectID = p;
                // update buttons urls
                lgButtonUrl(lastProjectID);
                aboutButtonsUrl(lastProjectID);
              }
            }

            // Mobile, close menu
            galleryNavbar.classList.remove('active');
            gallerySocials.classList.remove('active');
            galleryBunny.classList.remove('active');
            galleryLanguageBox.classList.remove('active');
            galleryMenuButton.classList.remove('active');
          
          });  
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
        // Right button
        document.getElementById('right-gallery-button').addEventListener('click', () => updateGallery(1));
        // Left button
        document.getElementById('left-gallery-button').addEventListener('click', () => updateGallery(-1));
        
        // Language button interaction
        lgButtonUrl(lastProjectID);
        let langButtons = [document.getElementById("language"),document.getElementById("menu-language")];
        langButtons.forEach(button => {
        button.addEventListener("click", (event) => {
          if (lgGallery === "en") {
            lgGallery = "fr";
          } else if (lgGallery === "fr") {
            lgGallery = "en";
          }
          button.href = urlBuilder("gallery", lgGallery, null, null, lastProjectID);
        });
      });
        // About buttons interaction
        aboutButtonsUrl(lastProjectID);

        // Swipes
        // create a simple instance
        let galleryFull = document.getElementById('gallery');
        let lightboxFull = document.getElementById('img-caption-combo');
        var swipeGallery = new Hammer(galleryFull);
        var swipeLightbox = new Hammer(lightboxFull);
        // Swipe Right
        swipeGallery.on("swiperight", function(ev) {
            updateGallery(1);
        });
        swipeLightbox.on("swiperight", function(ev) {
            updateGallery(1);
        });
        // Swipe Left
        swipeGallery.on("swiperight", function(ev) {
            updateGallery(-1);
        });
        swipeLightbox.on("swiperight", function(ev) {
            updateGallery(-1);
        });

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
          document.getElementById('lightbox-caption').innerText = displayedProject.gallery[currentImgIndex].caption;
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
                // console.log("Log file content:", data);
              })
              .catch((error) => {
                // console.error("Error fetching log file:", error);
                document.getElementById("textlog").innerText = "Failed to load the log file.";
              });
          } else {
            // console.warn("No log file specified.");
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
    let docBox = document.getElementById("doc-button-box");
    let mobileDocBox = document.getElementById("mobile-doc-button-box");
    
    for (let d = 0; d < displayedProject.documentation.length; d++) {
      let currentDocButton = document.createElement("div");
      currentDocButton.classList.add('doc-button');
      currentDocButton.setAttribute("target", "_blank");
      currentDocButton.setAttribute("href", "");
      docBox.appendChild(currentDocButton);

      let currentMobileDocButton = document.createElement("div");
      currentMobileDocButton.classList.add('doc-button');
      currentMobileDocButton.setAttribute("target", "_blank");
      currentMobileDocButton.setAttribute("href", "");
      mobileDocBox.appendChild(currentMobileDocButton);    
      
      let currentButtonText = document.createElement("span");
      currentButtonText.classList.add('doc-button-text');
      currentButtonText.innerText = displayedProject.documentation[d].tag;
      currentDocButton.appendChild(currentButtonText);
      
      let currentMobileButtonText = document.createElement("span");
      currentMobileButtonText.classList.add('mobile-doc-button-text');
      currentMobileButtonText.innerText = displayedProject.documentation[d].tag;
      currentMobileDocButton.appendChild(currentMobileButtonText);

      let extArrowImg = document.createElement("img");
      extArrowImg.classList.add('ext-arrow-icon');
      extArrowImg.src = "\assets\\arrow_ext_h.png";
      currentDocButton.appendChild(extArrowImg);

      let mobileExtArrowImg = document.createElement("img");
      mobileExtArrowImg.classList.add('ext-arrow-icon');
      mobileExtArrowImg.src = "\assets\\arrow_ext_h.png";
      currentMobileDocButton.appendChild(mobileExtArrowImg);
      
      currentDocButton.addEventListener("click", function(event) {
        // dimensions based on screen size
        let logWidth = Math.round(screen.width * 0.4);
        let logLeft = Math.round(screen.width * 0.1);
        let docWidth = Math.round(screen.width * 0.6);
        let docLeft = Math.round(screen.width * 0.333);
        let extHeight = Math.round(screen.height * 0.666);
        let extTop = Math.round(screen.height * 0.2);

        // Check if the tag is "Log" or not
        if (displayedProject.documentation[d].tag === "Log" || displayedProject.documentation[d].tag === "Journal") {
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

      currentMobileDocButton.addEventListener("click", function(event) {
        // dimensions based on screen size
        let logWidth = Math.round(screen.width * 0.4);
        let logLeft = Math.round(screen.width * 0.1);
        let docWidth = Math.round(screen.width * 0.6);
        let docLeft = Math.round(screen.width * 0.333);
        let extHeight = Math.round(screen.height * 0.666);
        let extTop = Math.round(screen.height * 0.2);

        // Check if the tag is "Log" or not
        if (displayedProject.documentation[d].tag === "Log" || displayedProject.documentation[d].tag === "Journal") {
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
  let toolbox = document.getElementById("tools-box");
  let mobileToolbox = document.getElementById("mobile-tools-box");
  let keywordsBox = document.getElementById("keywords-box");
  let mobileKeywordsBox = document.getElementById("mobile-keywords-box");
  // tools
  if (language === 'fr'){
    toolbox.children[0].innerText = "Outils:";
    mobileToolbox.children[0].innerText = "Outils:";
    keywordsBox.children[0].innerText = "Mots clés:";
    mobileKeywordsBox.children[0].innerText = "Mots clés:";
  } else {
    toolbox.children[0].innerText = "Tools:";
    mobileToolbox.children[0].innerText = "Tools:";
    keywordsBox.children[0].innerText = "Keywords:";
    mobileKeywordsBox.children[0].innerText = "Keywords:";
  }
  for (let t = 0; t < displayedProject.tools.length; t++) {
    let currentTool = document.createElement("span");
    currentTool.classList.add("tool");
    currentTool.innerText = displayedProject.tools[t];
    toolbox.appendChild(currentTool);

    let mobileCurrentTool = document.createElement("span");
    mobileCurrentTool.classList.add("tool");
    mobileCurrentTool.innerText = displayedProject.tools[t];
    mobileToolbox.appendChild(mobileCurrentTool);
  }
  // keywords
  for (let k = 0; k < displayedProject.keywords.length; k++) {
    let currentKeyword = document.createElement("span");
    currentKeyword.classList.add("keyword");
    currentKeyword.innerText = displayedProject.keywords[k];
    keywordsBox.appendChild(currentKeyword);

    let mobileCurrentKeyword = document.createElement("span");
    mobileCurrentKeyword.classList.add("keyword");
    mobileCurrentKeyword.innerText = displayedProject.keywords[k];
    mobileKeywordsBox.appendChild(mobileCurrentKeyword);
  }

  // description
  let descriptionBox = document.getElementById("description");
  let mobileDescriptionBox = document.getElementById("mobile-description-box");
  for (let i = 0; i < displayedProject.description.length; i++) {
    let paragraph = document.createElement("p");
    paragraph.innerText = displayedProject.description[i];
    descriptionBox.appendChild(paragraph);
    let mobileParagraph = document.createElement("p");
    mobileParagraph.innerText = displayedProject.description[i];
    mobileDescriptionBox.appendChild(mobileParagraph);
  }

  // Extra doc buttons
  createDocButtons(displayedProject);

  // title and year
  document.getElementById("title").innerText = displayedProject.title;
  document.getElementById("year").innerText = displayedProject.year;

  // display the first image and caption
  let galleryElement = document.getElementById("gallery-img");
  galleryElement.src = displayedProject.gallery[0].dir;
  let captionElement = document.getElementById("caption");
  captionElement.innerText = displayedProject.gallery[0].caption;
}
// email button
function copyEmail() {
  // Get the text field
  let email = "hd.maxi.tattoo@gmail.com"

  // Copy the text inside the text field
  navigator.clipboard.writeText(email);

  // Alert the copied text
  alert("Copied: " + email);
}