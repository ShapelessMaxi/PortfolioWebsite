window.onload = (event) => {
    fetch("/projectdata.json")
      .then((response) => response.json())
      .then((data) => {
        // Remove last project and experiment (template)
        data.projects.pop();

        // call different actions depending on which page is displayed
        switch (document.body.getAttribute("page")) {
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

            // reset gallery buttons click counts
            let currentImgIndex = 0;
            let imgCount = displayedProject.gallery.length;

            // display the latest project
            // title and year
            document.getElementById("title").innerText = displayedProject.title;
            document.getElementById("year").innerText = displayedProject.year;
            // display the first image
            let galleryElement = document.getElementById("gallery-img");
            galleryElement.src =displayedProject.gallery[0].dir;
            // keywords
            for (let k = 0; k < displayedProject.keywords.length; k++) {
              let currentKeyword = document.createElement("span");
              currentKeyword.classList.add("keyword");
              currentKeyword.innerText = projects[0].keywords[k];
              document.getElementById("keywords-box").appendChild(currentKeyword);
            }
            // tools
            for (let t = 0; t < displayedProject.tools.length; t++) {
              let currentTool = document.createElement("span");
              currentTool.classList.add("tool");
              currentTool.innerText = projects[0].tools[t];
              document.getElementById("tools-box").appendChild(currentTool);
            }
            // description
            document.getElementById("description").innerText = displayedProject.description;
            // extra documentation
            document.getElementById("doc-button-text").innerText = displayedProject.documentation[0].tag;
            document.getElementById("doc-button").setAttribute('href', displayedProject.documentation[0].link);

            // project buttons interaction
            document.querySelectorAll('.project-button').forEach(button => {
              button.addEventListener('click', function() {
                // Remove Keywords and tools
                document.querySelectorAll('.keyword').forEach(keyword => keyword.remove());
                document.querySelectorAll('.tool').forEach(tool => tool.remove());
                
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

                    // change the content of the page
                    // title and year
                    document.getElementById("title").innerText = projects[p].title;
                    document.getElementById("year").innerText = projects[p].year;
                    // display the first image
                    galleryElement.src = projects[p].gallery[0].dir;
                    // keywords
                    for (let k = 0; k < projects[p].keywords.length; k++) {
                      let currentKeyword = document.createElement("span");
                      currentKeyword.classList.add("keyword");
                      currentKeyword.innerText = projects[p].keywords[k];
                      document.getElementById("keywords-box").appendChild(currentKeyword);
                    }
                    // tools
                    for (let t = 0; t < projects[p].tools.length; t++) {
                      let currentTool = document.createElement("span");
                      currentTool.classList.add("tool");
                      currentTool.innerText = projects[p].tools[t];
                      document.getElementById("tools-box").appendChild(currentTool);
                    }
                    // description
                    document.getElementById("description").innerText = projects[p].description;
                    // extra documentation
                    document.getElementById("doc-button-text").innerText = projects[p].documentation[0].tag;
                    document.getElementById("doc-button").setAttribute('href', projects[p].documentation[0].link);
                  }
                }
              
              });
            });

            // gallery buttons interaction
            // right button
            document.getElementById('right-gallery-button').addEventListener('click', function() {
              // for each click, count up
              currentImgIndex ++;
              currentImgIndex = currentImgIndex % imgCount;
              galleryElement.src = displayedProject.gallery[currentImgIndex].dir;
            });
            // left button
            document.getElementById('left-gallery-button').addEventListener('click', function() {
              // for each click, count down
              currentImgIndex--;
              if (currentImgIndex < 0) {
                currentImgIndex = imgCount - 1;
              }
              galleryElement.src = displayedProject.gallery[currentImgIndex].dir;
            });

            break;
      }

    });
  }