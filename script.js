window.onload = (event) => {
    fetch("/projectdata.json")
      .then((response) => response.json())
      .then((data) => {
        // Remove last project from the json file (its a template to add more porjects more easily)
        data.projects.pop();

        // call different actions depending on which page is displayed
        switch (document.body.getAttribute("page")) {
          
          case "log":
            const urlParams = new URLSearchParams(window.location.search);
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
           
          case "about":

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

            break;
            
          case "gallery":
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
            let displayedProject = projects[0]

            // create all finished project buttons
            let finishedProjectButtons = [];
            for (let i = 0; i < data.projects.length; i++) {
              if (data.projects[i].isDone == "True") {
                let isFirst;
                if (i === 0) {
                  isFirst = true;
                } else {
                  isFirst = false;
                }
                let currentButton = new projectButton(
                  data.projects[i].title,
                  data.projects[i].year,
                  data.projects[i].isDone,
                  isFirst
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

            // reset gallery buttons click counts
            let currentImgIndex = 0;
            let imgCount = displayedProject.gallery.length;

            // update page content according to current project
            updateContent(displayedProject);
            
            // project buttons interaction
            document.querySelectorAll('.project-button').forEach(button => {
              button.addEventListener('click', function() {
                // Remove Keywords and tools
                document.querySelectorAll('.keyword').forEach(keyword => keyword.remove());
                document.querySelectorAll('.tool').forEach(tool => tool.remove());

                // Remove Documentation buttons
                document.querySelectorAll('.doc-button').forEach(keyword => keyword.remove());

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
                    updateContent(displayedProject);

                  }
                }
              
              });
            });

            // gallery buttons interaction
            let galleryElement = document.getElementById("gallery-img");
            let captionElement = document.getElementById("caption");
            // right button
            document.getElementById('right-gallery-button').addEventListener('click', function() {
              // for each click, count up
              currentImgIndex ++;
              currentImgIndex = currentImgIndex % imgCount;
              galleryElement.src = displayedProject.gallery[currentImgIndex].dir;
              captionElement.innerText = displayedProject.gallery[currentImgIndex].caption;
            });
            
            // left button
            document.getElementById('left-gallery-button').addEventListener('click', function() {
              // for each click, count down
              currentImgIndex--;
              if (currentImgIndex < 0) {
                currentImgIndex = imgCount - 1;
              }
              
              galleryElement.src = displayedProject.gallery[currentImgIndex].dir;
              captionElement.innerText = displayedProject.gallery[currentImgIndex].caption;
            });

          break;
      }
    });
  }

  // papge population
  function createDocButtons (displayedProject) {
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

      currentDocButton.addEventListener("click", function(event) {
        // Check if the tag is "Log" or not
        if (displayedProject.documentation[d].tag === "Log") {
          // Open the log page
          let logFilePath = displayedProject.documentation[d].link;
          let logOptions = "width=600,height=1000,left=200,top=300,scrollbars=yes,resizable=yes";
          window.open(`log.html?log=${encodeURIComponent(logFilePath)}`, "log", logOptions);
        } else {
          // Open the external docs
          let options = "width=1500,height=1000,left=1000,top=300,scrollbars=yes,resizable=yes";
          window.open(displayedProject.documentation[d].link, "doc", options);
        }
      });
    };
  }
  function updateContent (displayedProject) {
    // description
    document.getElementById("description").innerText = displayedProject.description;

    // Extra doc buttons
    createDocButtons(displayedProject);

    // tools
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
