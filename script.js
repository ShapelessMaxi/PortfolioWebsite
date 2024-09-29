window.onload = (event) => {
    fetch("/projectdata.json")
      .then((response) => response.json())
      .then((data) => {
        // Remove last project and experiment (template)
        data.projects.pop();

        // call different actions depending on which page is displayed
        switch (document.body.getAttribute("page")) {
          case "home":

          case "gallery":

          // create an object for each project
          let projects = [];
          for (let i = 0; i < data.projects.length; i++) {
            // create all project objects
            let currentProject = new project(
              data.projects[i].id,
              data.projects[i].title,
              data.projects[i].year,
              data.projects[i].category,
              data.projects[i].gallery,
              data.projects[i].keywords,
              data.projects[i].description,
              data.projects[i].tools,
              data.projects[i].documentation                 
            );
            projects.push(currentProject);
          }

          // create all project buttons
          let projectButtons = [];
          for (let i = 0; i < data.projects.length; i++) {
            let currentButton = new projectButton(
              data.projects[i].title,
              data.projects[i].year
            );
            projectButtons.push(currentButton);
          }

          // display the latest project
          // title and year
          document.getElementById("title").innerText = projects[0].title;
          document.getElementById("year").innerText = projects[0].year;
          // display the first image
          document.getElementById("gallery-img").src = projects[0].gallery[0].dir;
          // keywords
          for (let k = 0; k < projects[0].keywords.length; k++) {
            let currentKeyword = document.createElement("span");
            currentKeyword.classList.add("keyword");
            currentKeyword.innerText = projects[0].keywords[k];
            document.getElementById("keywords-box").appendChild(currentKeyword);
          }
          // tools
          for (let t = 0; t < projects[0].tools.length; t++) {
            let currentTool = document.createElement("span");
            currentTool.classList.add("tool");
            currentTool.innerText = projects[0].tools[t];
            document.getElementById("tools-box").appendChild(currentTool);
          }
          // description
          document.getElementById("description").innerText = projects[0].description;

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
                  // change the content of the page
                  // title and year
                  document.getElementById("title").innerText = projects[p].title;
                  document.getElementById("year").innerText = projects[p].year;
                  // display the first image
                  document.getElementById("gallery-img").src = projects[p].gallery[0].dir;
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
                }
              }
            
            });
          });

          
          // 2- populate the page with the first project's data

        
        // when a project button is clicked, change the data on the page
        

        // console.log(projects[0]);

      }
    });
  }