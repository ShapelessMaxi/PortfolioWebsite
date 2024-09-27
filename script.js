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

          // project buttons interaction
          document.querySelectorAll('.project-button').forEach(button => {
            button.addEventListener('click', function() {
                // Remove and add 'active' class from all buttons
                document.querySelectorAll('.project-button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // check which project is associated with the button
                let currentTitle = this.childNodes[0].innerText;
                for (let i = 0; i < projects.length; i++) {
                  if (currentTitle === projects[i].title) {
                    // change the content of the page
                    // title and year
                    document.getElementById("title").innerText = projects[i].title;
                    document.getElementById("year").innerText = projects[i].year;
                    // display the first image
                    document.getElementById("gallery-img").src = projects[i].gallery[0].dir;
                    // keywords
                    for (let u = 0; u < projects[i].keywords.length; u++) {
                      let currentKeyword = document.createElement("span");
                      currentKeyword.classList.add("keyword");
                      currentKeyword.innerText = projects[i].keywords[u];
                      document.getElementById("keywords-box").appendChild(currentKeyword);
                    }
                    // description
                    document.getElementById("description").innerText = projects[i].description;
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