document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll(".photo-container img");
    images.forEach(img => {
        img.addEventListener("click", function() {
            alert("你點擊了圖片：" + this.alt);
        });
    });
});

let slideIndex = 0;
function showSlides() {
    let slides = document.querySelectorAll(".slide");
    slides.forEach(slide => slide.style.opacity = 0);
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].style.opacity = 1;
    setTimeout(showSlides, 4000);
}

document.addEventListener("DOMContentLoaded", showSlides);


