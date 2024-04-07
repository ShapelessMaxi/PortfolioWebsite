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
    var uiElements = $("#artwork-viewer-vid-02, #artwork-viewer-bg, #artwork-title, .artwork-button-box, .artwork-viewer, .artwork-text, .artwork-footnote-box");
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
                // Log projectImages here if needed
                // console.log('List of images for ' + projectNames + ':', response);
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
            // console.log(hasVideo);
           
            fetchImages(projectNames, hasVideo);
        };
        // Log projectImages here if needed
    }
    // Call the imageArrays function to start fetching images
    imageArrays();

    // Function to display the next image
    function displayNextImage(currentIndex, projectName, imagesArray) {

        var youtubeFrame = $("#artwork-viewer-vid-02");
        var modalImg = $('#modal-artwork-viewer-img');
        var viewedImg = $('#artwork-viewer-img');

        var nextContent = imagesArray[currentIndex];
        if (nextContent === 'video_02') {
            // Display video
            var videoURL;
            if (projectName === "PostApocalypticHottie") {
                videoURL = PostApocalypticHottieVideoURL;
            } else if (projectName === "AwakeningofTheFrog") {
                videoURL = AwakeningofTheFrogVideoURL;
            }
            youtubeFrame.attr('src', videoURL);
            youtubeFrame.show();

            // Hide image
            if (viewedImg) {
                viewedImg.hide();
            }
            viewedImg.attr('src', nextContent);
        } else {
            // Hide video
            youtubeFrame.hide();
            // Display image
            var imgFile = "project_data/" + projectName + "/" + nextContent;
            viewedImg.attr('src', imgFile);
            viewedImg.show();
            modalImg.attr('src', imgFile).show();
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
                // console.log(data)
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
    var arrows = document.querySelectorAll('.artwork-button');
    arrows.forEach(function(arrow) {
        arrow.addEventListener('click', function(event) {
            
            // $("#artwork-viewer-vid-02").hide();
            // $("#artwork-viewer-img").show();
            
            var projectName = '';
            var menuProjects = document.querySelectorAll('.menu-project');
            menuProjects.forEach(function(project) {
                if (project.classList.contains('menu-active')) {
                    projectName = project.textContent.replace(/[^\w]|[\d\s]/g, '');
                    console.log(projectName);
                    $("#artwork-viewer-img").attr('src', projectName);
                }
            });

            // // Get the current source of the viewed image
            // var viewedImg = $('#artwork-viewer-img');
            // var imgSrc = viewedImg.attr('src');
                        
            // Check which button is clicked
            var direction = this.id === "left-viewer-button"; // true if left button, false otherwise
            
            var imagesArray = projectImages[projectName];
            console.log(imagesArray)
            if (imagesArray.length > 0) {
                if (direction) {
                    currentIndex = (currentIndex + imagesArray.length - 1) % imagesArray.length;
                } else {
                    currentIndex = (currentIndex + 1) % imagesArray.length;
                }
            }
            // console.log(currentIndex);
            
            // Call the displayNextImage function with the appropriate direction
            displayNextImage(currentIndex, projectName, imagesArray);
        });
    });

    // make the images 'hoverable'
    $('#artwork-viewer-img').hover(function() {
        $(this).css('cursor', 'pointer');
    });
    
    // open the modal, and insert the viewed image in it
    var modal = document.getElementById("myModal");
    var viewedImg = $('#artwork-viewer-img');
    $('#artwork-viewer-img').click(function(){
        $(this).hide();
        modal.style.display = "grid";
        var viewedImgSrc = viewedImg.attr('src');
        $('#modal-artwork-viewer-img').attr('src', viewedImgSrc);
    });

    // close the modal by clicking on the image
    $('.close').click(function(){
        modal.style.display = "none";
        $('#artwork-viewer-img').show();
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
                if (sliced && targetElements && !element.classList.contains('menu-active')) {
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
        hoverAnimation(".contact-btn-link", ".button-img", false);
        // contact page
        hoverAnimation(".textbox-title", ".button-img", true);
        hoverAnimation(".text-contact-button", ".img-contact-button", false);
        hoverAnimation("#text-contact-to-gallery", ".button-img", false);
        // index page
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
                var rightChild = imgContainer ? imgContainer.children[0] : null;
                var middleChild = imgContainer ? imgContainer.children[1] : null;
                var leftChild = imgContainer ? imgContainer.children[2] : null;
                
                buttons.forEach(function(btn) {
                    var btnImgContainer = btn.nextElementSibling;
                    if (btnImgContainer) {
                        var btnLeftChild = btnImgContainer.children[0];
                        var btnMiddleChild = btnImgContainer.children[1];
                        var btnRightChild = btnImgContainer.children[2];
                
                        if (btnLeftChild) {
                            btnLeftChild.classList.remove('hover-animation-l');
                            btnLeftChild.classList.remove('hover-animation');
                        }
                        if (btnMiddleChild) {
                            btnMiddleChild.classList.remove('hover-animation-m');
                            btnMiddleChild.classList.remove('hover-animation');
                            btnMiddleChild.classList.remove('clicked-animation');
                        }
                        if (btnRightChild) {
                            btnRightChild.classList.remove('hover-animation-r');
                            btnRightChild.classList.remove('hover-animation');
                            btnRightChild.classList.remove('translate-animation');
                        }
                    }
                
                    btn.classList.remove('menu-active'); // Remove active class from all buttons
                });
                
                
                // Add active class to the clicked button
                button.classList.add('menu-active');
                
                // Add the animation classes to the clicked button
                var stretchAmount = Math.floor(Math.random() * (550 - 250) + 200);
                var translateAmount = stretchAmount - 1;
                // stretch middle portion
                middleChild.style.setProperty('--stretch-amount', stretchAmount);
                middleChild.classList.add('clicked-animation');
                // translate left portion
                leftChild.style.setProperty('--stretch-amount', translateAmount + 'px');
                leftChild.classList.add('translate-animation');

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
    
    // Check if any contact button has the class 'menu-active'
    contactButtons.forEach(function(button) {
        if (button.classList.contains("menu-active")) {
            console.log("At least one contact button has the class 'menu-active'");
        }
    });

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
