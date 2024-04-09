$(document).ready(function() {
    var loadingOverlay = document.querySelector('.loading-overlay');
    var theRest = document.querySelector('.wrapper');
    function startLoadingAnimation() {
        theRest.style.display = 'none';
        loadingOverlay.style.display = 'flex';
    }
    startLoadingAnimation();
    function hideLoading(){
        theRest.style.display = 'grid';
        loadingOverlay.style.display = 'none';
    }
    function hideLoadingAnimation(){
        setTimeout(hideLoading, 600);
    }

    window.addEventListener('load', function() {
        // This code will run when everything on the page has finished loading
        console.log('Page fully loaded');

        // Hide loading animation
        hideLoadingAnimation();
    });

    // hide the projects by default
    var projects = $(".menu-3D, .menu-inter, .menu-coding, .menu-tattoo");
    var uiElements = $("#artwork-viewer-bg, #artwork-title, .artwork-button-box, .artwork-viewer, .artwork-text, .artwork-footnote-box");
    projects.hide();
    uiElements.hide();

    // Object to store arrays of images for each project
    var projectImages = {};
    // Function to fetch images for a specific project
    function fetchImages(projectNames, hasVideo) {
        $.ajax({
          //  url: 'http://localhost:5000/images/' + projectNames,
          url: "getImages.php",
            type: "GET", //send it through get method
            data: { 
             projectNames: projectNames, 
            },
            dataType: 'json',
            success: function(response) {
                projectImages[projectNames] = response;
                if (hasVideo) {
                    projectImages[projectNames].splice(1, 0, 'video_02');
                    return
                } else {
                    return
                } 
            },
            error: function(xhr, status, error) {
                console.error('Error fetching images for ' + projectNames + ':', error);
            }
        });
    }

        // change the code here to add videos to projects
        // has video function
        var PostApocalypticHottieVideoURL = 'https://www.youtube.com/embed/kZotRX9Zqgo?si=W-x68jLcYak3hMhs';
        var AwakeningofTheFrogVideoURL = 'https://www.youtube.com/embed/zROBx7WUO-w?si=z9QLX9JEdaEhG0sH';
        // var ProjectVideoURL = 'https://www.youtube.com/embed/zROBx7WUO-w?si=z9QLX9JEdaEhG0sH';
    // Function to create image arrays for each project
    function imageArrays() {
        var allProjects = $(".menu-project");
        
        for (var i = 0; i < allProjects.length; i++) {
            var projectNames = $(allProjects[i]).text().replace(/[^\w]/g, '').replace(/\d/g, '');
            
            var hasVideo = false; 
            var videoUrl;
            // check which projects has videos (hardcoded for now....)
            if (projectNames === "PostApocalypticHottie") {
                hasVideo = true;
                videoUrl = 'https://youtu.be/zROBx7WUO-w?si=1RMF4_3dejxu3FJQ';
                } else if (projectNames === "AwakeningofTheFrog") {
                hasVideo = true;
                } else if (projectNames === "bodymod") {
                    hasVideo = true;
                // } else if (projectNames === "AwakeningofTheFrog") {
                //     hasVideo = true;
                } else {
                    hasVideo = false;
                };
            fetchImages(projectNames, hasVideo);
        };
        // Log projectImages here if needed
    }
    // Call the imageArrays function to start fetching images
    imageArrays();

    var modalViewer = document.getElementById('modal-artwork-viewer-img');
    var modal = document.getElementById('myModal');
    var modalYoutube = document.getElementById('modal-artwork-viewer-vid-02');
    var viewedImg = document.getElementById('artwork-viewer-img');
    var youtubeFrame = document.getElementById('artwork-viewer-vid-02');
    // Function to display the next image or video
    function displayNextImage(currentIndex, projectName, imagesArray) {
        var modalImg = document.getElementById('modal-artwork-viewer-img');
        var viewedImg = document.getElementById('artwork-viewer-img');

        var nextContent = imagesArray[currentIndex];
        if (nextContent === 'video_02') {
            // Hide image
            viewedImg.style.display = 'none';
            modalImg.style.display = 'none';

            // choose video url
            var videoURL;
            if (projectName === "PostApocalypticHottie") {
                videoURL = PostApocalypticHottieVideoURL;
            } else if (projectName === "AwakeningofTheFrog") {
                videoURL = AwakeningofTheFrogVideoURL;
            }

            // Check if modalViewer is visible
            if (modal.style.display === 'grid') {
                console.log('yoo')
                // Set the YouTube frame source and display it
                modalYoutube.setAttribute('src', videoURL);
                modalYoutube.style.display = 'block';
            } else {
                // Set the YouTube frame source and display it
                youtubeFrame.setAttribute('src', videoURL);
                youtubeFrame.style.display = 'block';
            }
        } else {
            // Hide video
            modalYoutube.style.display = 'none';
            youtubeFrame.style.display = 'none';

            // Display image
            var imgFile = "project_data/" + projectName + "/" + nextContent;
            viewedImg.setAttribute('src', imgFile);
            viewedImg.style.display = 'block';
            modalImg.setAttribute('src', imgFile);
            modalImg.style.display = 'block';
        }
    }

    // fetch project data (html)
    function fetchData (project){
        var dataFileName = "project_data/" + project;
        dataFileName += '.html';

        $.ajax({
            url: dataFileName,
            dataType: 'html',
            cache: false,
            success: function(data) {
                var title = $(data).filter("h1").html();
                var subtitle = $(data).filter("h2").html();
                var description = $(data).filter("p").html();
                var footnotes = $(data).filter("span").html();

                $('#artwork-title-main').html(title);
                $('#artwork-title-sub').html(subtitle);
                $('#artwork-description').html(description);
                $('#artwork-footnote').html(footnotes);
            },
            error: function() {
                console.log('Error loading data');
            }
        });
    }

    // fetch and display project data from adjacent html file
    $(".menu-project").click(function() {
        uiElements.show();

        // Remove the .active class from all category buttons
        $(".menu-project").removeClass('menu-active');
        // make the button active
        $(this).addClass("menu-active");

        // get the correct file name from the button text
        var fileName = $(this).text().replace(/[^\w]/g, '').replace(/\d/g, '');
        fetchData(fileName);
         
        // display the first image
        var viewedImg = $('#artwork-viewer-img');
        var imagesArray = projectImages[fileName];
        if (imagesArray.length > 0) {
            var firstImage = imagesArray[0];
            var imgFile = "project_data/" + fileName + "/" + firstImage;
            viewedImg.attr('src', imgFile);
        }
    });

    function findProjectName(activeProject, projectName){
        // find active project
        var menuProjects = document.querySelectorAll('.menu-project');
        menuProjects.forEach(function(project) {
            if (project.classList.contains('menu-active')) {
                activeProject.push(project.textContent);
            }
        });               
        // find the correct project name
        projectName = activeProject[0];
        projectName = projectName.replace(/[^\w]/g, '').replace(/\d/g, '');

        return projectName;
    }
    // define index variable
    var currentIndex = 0;
    //  new click event functon for left and right arrow
    var arrows = document.querySelectorAll('.artwork-button, .modal-artwork-button');
    arrows.forEach(function(arrow) {
        arrow.addEventListener('click', function(event) {
            
            var projectName = '';
            var menuProjects = document.querySelectorAll('.menu-project');
            menuProjects.forEach(function(project) {
                if (project.classList.contains('menu-active')) {
                    projectName = project.textContent.replace(/[^\w]|[\d\s]/g, '');
                    $("#artwork-viewer-img").attr('src', projectName);
                }
            });

            // Check which button is clicked
            var direction = this.id === "left-viewer-button"; // true if left button, false otherwise
            
            var imagesArray = projectImages[projectName];
            if (imagesArray.length > 0) {
                if (direction) {
                    currentIndex = (currentIndex + imagesArray.length - 1) % imagesArray.length;
                } else {
                    currentIndex = (currentIndex + 1) % imagesArray.length;
                }
            }
            
            // Call the displayNextImage function with the appropriate direction
            displayNextImage(currentIndex, projectName, imagesArray);
        });
    });

    // make the images 'hoverable'
    $('#artwork-viewer-img, #artwork-viewer-vid-02, #modal-artwork-viewer-img, #modal-artwork-viewer-vid-02').hover(function() {
        $(this).css('cursor', 'pointer');
    });
    
    // Open the modal and insert the viewed image in it
    if (viewedImg) {
        viewedImg.addEventListener('click', function(event) {
            viewedImg.style.display = 'none';
            var modal = document.getElementById('myModal');
            if (modal) {
                modal.style.display = 'grid';
                var viewedImgSrc = viewedImg.getAttribute('src');
                document.getElementById('modal-artwork-viewer-img').setAttribute('src', viewedImgSrc);
            }
        });
    } else {
        console.log('artwork-viewer-img element not found.');
    }

    // Close the modal
    var modal = document.getElementById('myModal');
    if (modalViewer) {
        var artworkViewerImg = document.getElementById('artwork-viewer-img');
        modalViewer.addEventListener('click', function() {
            if (modal && artworkViewerImg) {
                modal.style.display = 'none';
                artworkViewerImg.style.display = 'block';
            }
        });
    } else {
        console.log('Modal viewer element not found.');
    }
    // Event listener to close modal on escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'grid') {
            modal.style.display = 'none';
            var artworkViewerImg = document.getElementById('artwork-viewer-img');
            
            if (modalYoutube.style.display === 'block') {
                var currentVid = modalYoutube.getAttribute('src');
                youtubeFrame.setAttribute('src', currentVid);
                youtubeFrame.style.display = 'block';
                artworkViewerImg.style.display = 'none';
            } else if (artworkViewerImg) {
                youtubeFrame.style.display = 'none';
                artworkViewerImg.style.display = 'block';
            }
        }
    });

    
    function hoverAnimation(selector, targetSelector, sliced) {
        // Get all elements matching the selector
        var elements = document.querySelectorAll(selector);

        // Define animations array outside of event listeners to ensure it's accessible
        var animations = ['hover-animation-l', 'hover-animation-m', 'hover-animation-r'];
        
        // For each element, attach mouseenter and mouseleave event listeners
        elements.forEach(function(element) {
            element.addEventListener('mouseenter', function() {
                // Trigger animation when mouse enters the element
                var targetElements = element.parentNode.querySelectorAll(targetSelector);
                if (selector === targetSelector) {
                    targetElements.forEach(function(element) {
                        element.classList.add('hover-animation-arrow');
                    });
                } else if (sliced && targetElements && !element.classList.contains('menu-active')) {
                    targetElements.forEach(function(targetElement, targetIndex) {
                        if (targetIndex < animations.length) {
                            targetElement.classList.add(animations[targetIndex]);
                        }
                    });
                } else if (targetElements && !element.classList.contains('menu-active')) {
                    targetElements.forEach(function(element) {
                        element.classList.add('hover-animation');
                    });
                }
            });
    
            element.addEventListener('mouseleave', function() {
                // Remove animation when mouse leaves
                var targetElements = element.parentNode.querySelectorAll(targetSelector);
                if (sliced && targetElements) {
                    targetElements.forEach(function(targetElement, targetIndex) {
                        if (targetIndex < animations.length) {
                            targetElement.classList.remove(animations[targetIndex]);
                        }
                    });
                } else if (targetElements) {
                    targetElements.forEach(function(element) {
                        element.classList.remove('hover-animation');
                        element.classList.remove('hover-animation-arrow');
                    });
                }
            });
        });
    }
    // Call hover animation function for different elements
    function activateHover (){
        // gallery page
        hoverAnimation(".button-text", ".button-img", false);
        hoverAnimation(".menu-category", ".button-img", true);
        hoverAnimation(".menu-project", ".button-img", true);
        hoverAnimation(".artwork-button", ".artwork-button", false);
        // contact page
        hoverAnimation(".textbox-title", ".button-img", true);
        hoverAnimation(".text-contact-button", ".img-contact-button", false);
        hoverAnimation("#text-contact-to-gallery", ".button-img", false);
        // index page
        hoverAnimation(".contact-btn-link", ".button-img", false);
    }
    activateHover();

    // clicked animation
    function clickedAnimation(buttons) {
        buttons.forEach(function(button) {
            button.addEventListener('click', function(event) {

                $("#artwork-viewer-vid-02").hide();
                $("#artwork-viewer-img").show();
                
                var activeProject = [];
                var projectName = '';
                var menuProjects = document.querySelectorAll('.menu-project');
                menuProjects.forEach(function(project) {
                    if (project.classList.contains('menu-active')) {
                        findProjectName(activeProject, projectName);
                        currentIndex = 0;
                        $("#artwork-viewer-img").attr('src', projectName[currentIndex]);
                    }
                });               
                
                // Find elements related to the clicked button
                var imgContainer = button.nextElementSibling;
                var middleChild = imgContainer ? imgContainer.children[1] : null;
                var middleChildImg = middleChild.querySelector('img');
                
                buttons.forEach(function(btn) {
                    var btnImgContainer = btn.nextElementSibling;
                    if (btnImgContainer) {
                        var btnLeftChild = btnImgContainer.children[0];
                        var btnMiddleChild = btnImgContainer.children[1];
                        var btnRightChild = btnImgContainer.children[2];
                        var middleChildImg = btnMiddleChild.querySelector('img');
                
                        if (btnLeftChild) {
                            btnLeftChild.classList.remove('hover-animation-l');
                            btnLeftChild.classList.remove('hover-animation');
                        }
                        if (btnMiddleChild) {
                            btnMiddleChild.classList.remove('hover-animation-m');
                            btnMiddleChild.classList.remove('hover-animation');
                            btnMiddleChild.classList.remove('clicked-animation');
                            middleChildImg.classList.remove('clicked-animation');
                        }
                        if (btnRightChild) {
                            btnRightChild.classList.remove('hover-animation-r');
                            btnRightChild.classList.remove('hover-animation');
                        }
                    }
                
                    btn.classList.remove('menu-active'); // Remove active class from all buttons
                });
                
                
                // Add active class to the clicked button
                button.classList.add('menu-active');
                
                // Add the animation classes to the clicked button
                var maxStretch = 500;
                var minStretch = 300;
                var stretchAmount = Math.floor(Math.random() * (maxStretch - minStretch) + minStretch);

                // stretch middle portion
                middleChild.style.setProperty('--stretch-amount', stretchAmount + 'px');
                middleChild.classList.add('clicked-animation');
                middleChildImg.style.setProperty('--stretch-amount', stretchAmount + 'px');
                middleChildImg.classList.add('clicked-animation');

            });
        });     
    }
    // Select all category buttons and project buttons
    var categoryButtons = document.querySelectorAll('.menu-category');
    var projectButtons = document.querySelectorAll('.menu-project');
    var contactButtons = document.querySelectorAll('.textbox-title');
    // Call the clickedAnimation function for category buttons and project buttons
    clickedAnimation(categoryButtons);
    clickedAnimation(projectButtons);
    clickedAnimation(contactButtons);
    
    // collapsible gallery menu
    document.querySelectorAll('.menu-category').forEach(function(categoryButton) {
        categoryButton.addEventListener('click', function() {
            // Get the ID of the clicked category button
            var categoryId = categoryButton.getAttribute('id');

            // Hide all project categories
            document.querySelectorAll('.menu-3D, .menu-inter, .menu-coding, .menu-tattoo').forEach(function(projectCategory) {
                projectCategory.style.display = 'none';
            });

            // Show the corresponding project category based on the clicked category button
            switch (categoryId) {
                case "menu-category-3D":
                    document.querySelectorAll('.menu-3D').forEach(function(projectCategory) {
                        projectCategory.style.display = 'block';
                    });
                    break;
                case "menu-category-inter":
                    document.querySelectorAll('.menu-inter').forEach(function(projectCategory) {
                        projectCategory.style.display = 'block';
                    });
                    break;
                case "menu-category-coding":
                    document.querySelectorAll('.menu-coding').forEach(function(projectCategory) {
                        projectCategory.style.display = 'block';
                    });
                    break;
                case "menu-category-tattoo":
                    document.querySelectorAll('.menu-tattoo').forEach(function(projectCategory) {
                        projectCategory.style.display = 'block';
                    });
                    break;
                default:
                    break;
            }
        });
    });

    // hide the text
    // Check if the statement-box element exists before manipulating it
    var statementBox = document.getElementById('statement-box');
    if (statementBox) {
        document.getElementById('textbox-statement').style.display = 'none';
        document.getElementById('textbox-bio').style.display = 'none';
    }
    
    // collapsible contact text boxes
    document.querySelectorAll('.textbox-title').forEach(function(textboxButton) {
        textboxButton.addEventListener('click', function() {
            // Get the ID of the clicked category button
            var textboxId = textboxButton.getAttribute('id');

            // Hide the text
            document.querySelectorAll('#textbox-statement, #textbox-bio').forEach(function(projectCategory) {
            projectCategory.style.display = 'none';
            });

            // Show the corresponding project category based on the clicked category button
            switch (textboxId) {
                case "textbox-menu-statement":
                    document.querySelectorAll('#textbox-statement').forEach(function(projectCategory) {
                        projectCategory.style.display = 'block';
                        document.getElementById('statement-box').style.backgroundImage = 'linear-gradient(to bottom, var(--main-color) 95%, #a1a1a1 100%)';
                        document.getElementById('statement-box').style.overflowY = 'scroll';
                    });
                    break;
                case "textbox-menu-bio":
                    document.querySelectorAll('#textbox-bio').forEach(function(projectCategory) {
                        projectCategory.style.display = 'block';
                        document.getElementById('statement-box').style.backgroundImage = 'linear-gradient(to bottom, var(--main-color) 95%, #a1a1a1 100%)';
                        document.getElementById('statement-box').style.overflowY = 'scroll';
                    });
                    break;
                default:
                    break;
            }
        });
    });

}); // end of ready() function
