window.onload = (event) => {
    fetch("/projectdata.json")
      .then((response) => response.json())
      .then((data) => {
        
// console.log(data.projects)
        
        for (let i = 0; i < data.projects.length; i++) {
            let projectbutton;
            data.projects[i];
            
            }

        document. createElement("div")


      });
    }