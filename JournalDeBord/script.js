  
let imgs = document.querySelectorAll(".entry-img");
let otherImgs = document.querySelectorAll(".bigger-img");
let lightbox = document.getElementById("lightbox");
let lightboxImg = document.getElementById("lightbox-img");

// close lightbox by default
lightbox.style.display = "none";
// Open lightbox on gallery image click
imgs.forEach(img => {
    img.addEventListener("click", () =>  {
    lightboxImg.src = img.src;
    lightbox.style.display = "flex";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      lightbox.style.display = "none"; 
    }
  });
});
// Close lightbox when lcicking on it
lightbox.addEventListener("click", () =>  {
  lightbox.style.display = "none";
});
otherImgs.forEach(img => {
    img.addEventListener("click", () =>  {
    lightboxImg.src = img.src;
    lightbox.style.display = "flex";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      lightbox.style.display = "none"; 
    }
  });
});
// Close lightbox when lcicking on it
lightbox.addEventListener("click", () =>  {
  lightbox.style.display = "none";
});

let titles = document.querySelectorAll(".title-box");
// Close entries by default
// Open entries on title click
titles.forEach(title => {
  title.addEventListener("click", () =>  {
    let entry = title.nextElementSibling;
    if (entry.style.display == "flex"){
      entry.style.display = "none";
    } else {
      entry.style.display = "flex";
    }
  });
});