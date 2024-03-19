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
            url: 'http://localhost:5000/images/' + projectNames,
            dataType: 'json',
            success: function(response) {
                projectImages[projectNames] = response;
                // Log projectImages here if needed
                // console.log('List of images for ' + projectName + ':', response);
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

    // collapsible gallery menu
    $(".menu-category").click(function() {

        // Remove the .active class from all category buttons
        $('.menu-category').removeClass('menu-active');

        // add the active class to the clicked element
        $(this).addClass('menu-active');

        // show/hide the projects
        if ($(this).attr("id") === "menu-category-3D") {
            $(".menu-3D").show();
            $(".menu-inter").hide();
            $(".menu-coding").hide();
            $(".menu-tattoo").hide();
        
        } else if ($(this).attr("id") === "menu-category-inter") {
            $(".menu-3D").hide();
            $(".menu-inter").show();
            $(".menu-coding").hide();
            $(".menu-tattoo").hide();
        
        } else if ($(this).attr("id") === "menu-category-coding") {
            $(".menu-3D").hide();
            $(".menu-inter").hide();
            $(".menu-coding").show();
            $(".menu-tattoo").hide();
        
        } else if ($(this).attr("id") === "menu-category-tattoo") {
            $(".menu-3D").hide();
            $(".menu-inter").hide();
            $(".menu-coding").hide();
            $(".menu-tattoo").show();
        };
        
    });

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
        currentIndex = parseInt(currentIndex) - 1   ;

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

        // make the image hoverable
        $('#artwork-viewer-img').hover(function() {
            $(this).css('cursor', 'pointer');
        });
    });
    
    // Get the modal, and insert the viewed image in it
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
        $('#artwork-viewer-img').show;
    });
    
}); // end of ready() function
