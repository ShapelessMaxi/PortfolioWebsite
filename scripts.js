$(document).ready(function() {
    console.log("document ready");

    // hide the projects by default
    var projects = $(".menu-3D, .menu-inter, .menu-coding, .menu-tattoo");
    var uiElements = $("#artwork-viewer-bg, #artwork-title, .artwork-button-box, .artwork-viewer, .artwork-text, .artwork-footnote-box");
    projects.hide();
    uiElements.hide();

    // Object to store arrays of images for each project
    var projectImages = {};
    // Function to fetch images for a specific project
    function fetchImages(projectNames) {
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
                // Log projectImages here if needed
                // console.log('List of images for ' + projectNames + ':', response);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching images for ' + projectNames + ':', error);
            }
        });
    }
    // Function to create image arrays for each project
    function imageArrays() {
        var allProjects = $(".menu-project");

        for (var i = 0; i < allProjects.length; i++) {
            var projectNames = $(allProjects[i]).text().replace(/[^\w]/g, '').replace(/\d/g, '');
            fetchImages(projectNames);
        }
        // Log projectImages here if needed
        // console.log(projectImages);
    }
    // Call the imageArrays function to start fetching images
    imageArrays();

    // Function to display the next image
    var currentIndex = 0;
    function displayNextImage(currentIndex, projectName, direction) {
        // Select the image viewer where the image is displayed
        var viewedImg = $('#artwork-viewer-img');
        var modalImg = $('#modal-artwork-viewer-img');
        // Select the image array
        var imagesArray = projectImages[projectName];
        // console.log(projectImages);

        // Increment/decrease the index
        if (direction){
            var nextIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
        } else {
            var nextIndex = (currentIndex + 1) % imagesArray.length;
        }

        if (imagesArray.length > 0) {
            var nextImage = imagesArray[nextIndex];
            var imgFile = "project_data/" + projectName + "/" + nextImage;
            viewedImg.attr('src', imgFile);
            modalImg.attr('src', imgFile);
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

    // artwork viewer left and right button 
    $('.artwork-button, .modal-artwork-button').click(function() {

        // select the image viewer where the image is displayed
        var viewedImg = $('#artwork-viewer-img');

        // find the displayed image index
        currentIndex = viewedImg.attr('src'); 
        currentIndex = currentIndex.replace(/\D/g, "");
        currentIndex = parseInt(currentIndex) - 1;

        // find which project is currently being viewed
        var activeProject = [];
        $(".menu-project").each(function() {
            if ($(this).hasClass('menu-active')) {
                activeProject.push($(this).text());
            }
        });
        // find the correct project name
        var projectName = activeProject[0];
        projectName = projectName.replace(/[^\w]/g, '').replace(/\d/g, '');
        
        // check which of the left or right button is clicked
        // true-> right; false-> true
        var direction = $(this).attr("id") === "left-viewer-button";
        displayNextImage(currentIndex, projectName, direction);

        // make the image 'hoverable'
        $('#artwork-viewer-img').hover(function() {
            $(this).css('cursor', 'pointer');
        });
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

    function hoverAnimation(selector, targetSelector) {
        // Get all elements matching the selector
        var elements = document.querySelectorAll(selector);
    
        // For each element, attach mouseenter and mouseleave event listeners
        elements.forEach(function(element) {
            element.addEventListener('mouseenter', function() {
                // Trigger animation when mouse enters the element
                var targetElement = element.parentNode.querySelector(targetSelector);
                if (targetElement) {
                    targetElement.classList.add('hover-animation');
                }
            });
    
            element.addEventListener('mouseleave', function() {
                // Remove animation when mouse leaves
                var targetElement = element.parentNode.querySelector(targetSelector);
                if (targetElement) {
                    targetElement.classList.remove('hover-animation');
                }
            });
        });
    }
    // Call hover animation function for different elements
    hoverAnimation(".textbox-title", ".img-contact-button");
    hoverAnimation(".text-contact-button", ".img-contact-button");
    hoverAnimation("#text-contact-to-gallery", ".button-img");
    // clicked animation
    function clickedAnimation(buttons) {
        buttons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                // Find elements related to the clicked button
                var imgContainer = button.nextElementSibling;
                var middleChild = imgContainer ? imgContainer.children[1] : null;
                var leftChild = imgContainer ? imgContainer.children[2] : null;
                
                // Reset the animation on all buttons
                buttons.forEach(function(btn) {
                    var btnImgContainer = btn.nextElementSibling;
                    var btnMiddleChild = btnImgContainer ? btnImgContainer.children[1] : null;
                    var btnLeftChild = btnImgContainer ? btnImgContainer.children[2] : null;
                    
                    if (btnMiddleChild) {
                        btnMiddleChild.classList.remove('clicked-animation');
                    }
                    if (btnLeftChild) {
                        btnLeftChild.classList.remove('translate-animation');
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

                // // hide/unhide the text
                // if (button.classList.contains("menu-active")) {
                //     console.log('boop')
                // }
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
                        document.getElementById('statement-box').style.backgroundImage = 'linear-gradient(to bottom, var(--main-color) 95%, #919090 100%)';
                        document.getElementById('statement-box').style.overflowY = 'scroll';
                    });
                    break;
                case "textbox-menu-bio":
                    document.querySelectorAll('#textbox-bio').forEach(function(projectCategory) {
                        projectCategory.style.display = 'block';
                        document.getElementById('statement-box').style.backgroundImage = 'linear-gradient(to bottom, var(--main-color) 95%, #919090 100%)';
                        document.getElementById('statement-box').style.overflowY = 'scroll';
                    });
                    break;
                default:
                    break;
            }
        });
    });


}); // end of ready() function
