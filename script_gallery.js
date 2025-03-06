// document.addEventListener("DOMContentLoaded", () => {
//     let currentIndex = 0;
//     let currentImages = [];
//     const fullscreenContainer = document.getElementById("fullscreen-container");
//     const fullscreenImg = document.getElementById("fullscreen-img");
//     const downloadBtn = document.getElementById("download-btn");

//     function toggleGallery(category) {
//         const gallery = document.getElementById(`${category}-gallery`);
//         const isVisible = gallery.style.display === "block";
    
//         // 關閉所有已展開的區塊
//         document.querySelectorAll(".expanded-gallery").forEach(el => el.style.display = "none");
    
//         if (!isVisible) {
//             gallery.style.display = "block";
//             loadGalleryImages(category); // 這行新增，動態載入圖片
//         }
//     }
    
//     function loadGalleryImages(category) {
//         const gallery = document.getElementById(`${category}-gallery`);
//         gallery.innerHTML = ""; // 清空舊內容，避免重複載入
    
//         fetch(`gallery_getImage.php?category=${category}`)
//             .then(response => response.json())
//             .then(images => {
//                 if (!Array.isArray(images) || images.length === 0) {
//                     gallery.innerHTML = "<p>沒有圖片</p>";
//                     return;
//                 }
    
//                 // **修正：不會自動放大第一張圖，而是先顯示縮圖**
//                 images.forEach((src, index) => {
//                     const img = document.createElement("img");
//                     img.src = src;
//                     img.classList.add("gallery-thumbnail");
//                     img.onclick = () => openFullscreen(images, index); // 點擊後才放大
//                     gallery.appendChild(img);
//                 });
    
//                 gallery.style.display = "block"; // 顯示該分類的縮圖
//             })
//             .catch(error => console.error("載入圖片時發生錯誤:", error));
//     }
    
    

//     function openFullscreen(images, index) {
//         currentImages = images;
//         currentIndex = index;
//         fullscreenImg.src = images[index];
    
//         // **修正：確保圖片適應視窗大小，而非全螢幕**
//         fullscreenImg.style.maxWidth = "90vw"; 
//         fullscreenImg.style.maxHeight = "80vh"; 
    
//         fullscreenContainer.style.display = "flex";
//         loadThumbnails(); // 顯示縮圖列
//         updateDownloadLink();
//     }
    
//     function loadThumbnails() {
//         const thumbnailContainer = document.getElementById("thumbnail-container");
//         thumbnailContainer.innerHTML = ""; // 清空舊縮圖
    
//         currentImages.forEach((src, index) => {
//             const thumb = document.createElement("img");
//             thumb.src = src;
//             thumb.classList.add("thumbnail-img");
    
//             thumb.onclick = () => {
//                 currentIndex = index;
//                 fullscreenImg.src = currentImages[currentIndex];
//                 updateDownloadLink();
//             };
    
//             thumbnailContainer.appendChild(thumb);
//         });
    
//         // **確保縮圖列顯示在圖片下方，而非右側**
//         thumbnailContainer.style.display = "flex";
//         thumbnailContainer.style.flexDirection = "row"; // 水平排列
//     }
    
    
//     function closeFullscreen() {
//         fullscreenContainer.style.display = "none";
//     }

//     function prevImage() {
//         if (currentIndex > 0) {
//             currentIndex--;
//             fullscreenImg.src = currentImages[currentIndex];
//             updateDownloadLink();
//         }
//     }

//     function nextImage() {
//         if (currentIndex < currentImages.length - 1) {
//             currentIndex++;
//             fullscreenImg.src = currentImages[currentIndex];
//             updateDownloadLink();
//         }
//     }

//     function updateDownloadLink() {
//         downloadBtn.href = currentImages[currentIndex];
//     }

//     document.querySelectorAll(".preview-img").forEach((img, index) => {
//         img.addEventListener("click", () => {
//             const images = Array.from(img.closest(".gallery-section").querySelectorAll(".preview-img"))
//                                .map(el => el.src);
//             openFullscreen(images, index);
//         });
//     });

//     document.querySelector(".close-btn").addEventListener("click", closeFullscreen);
//     document.querySelector(".left-btn").addEventListener("click", prevImage);
//     document.querySelector(".right-btn").addEventListener("click", nextImage);

//     document.querySelectorAll(".gallery-text").forEach(text => {
//         text.style.fontSize = "1.2em";
//         text.style.textAlign = "left";
//         text.style.marginLeft = "20px"; // 調整圖片與文字間距
        
//         const title = text.querySelector("h2");
//         const description = text.querySelector("p");
        
//         if (title) {
//             title.style.fontSize = "1.5em";
//             title.style.fontWeight = "bold";
//             title.style.marginBottom = "5px";
//         }
        
//         if (description) {
//             description.style.fontSize = "1em";
//             description.style.color = "#666";
//         }
//     });

//     // 允許調整標題與內文大小
//     const headerTitle = document.querySelector(".gallery-hero h1");
//     const headerText = document.querySelector(".gallery-hero p");
    
//     if (headerTitle) {
//         headerTitle.style.fontSize = "2.5em";
//         headerTitle.style.fontWeight = "bold";
//     }
    
//     if (headerText) {
//         headerText.style.fontSize = "1.8em";
//         // headerText.style.color = "#ddd";
//         headerText.style.color = rgba(218, 215, 215, 0.85);

//     }
// });

// 全局變量
let currentCategory = '';
let currentImages = [];
let currentIndex = 0;

// 當頁面載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 添加每個相冊區塊的點擊事件
    const gallerySections = document.querySelectorAll('.gallery-section');
    gallerySections.forEach(section => {
        // 從section本身獲取id
        const galleryId = section.querySelector('.expanded-gallery').id;
        const category = galleryId.split('-')[0]; // 從id中提取類別名稱
        
        // 僅在點擊內容區域時觸發
        const contentDiv = section.querySelector('.gallery-content');
        contentDiv.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            toggleGallery(category);
        });
    });
});

// 切換展開/收起相冊
function toggleGallery(category) {
    currentCategory = category;
    const galleryElement = document.getElementById(`${category}-gallery`);
    
    // 如果相冊已經展開，則收起
    if (galleryElement.style.display === 'block') {
        galleryElement.style.display = 'none';
        return;
    }
    
    // 收起其他所有已展開的相冊
    const allGalleries = document.querySelectorAll('.expanded-gallery');
    allGalleries.forEach(gallery => {
        gallery.style.display = 'none';
    });
    
    // 顯示載入中的提示
    galleryElement.innerHTML = '<p>載入中...</p>';
    galleryElement.style.display = 'block';
    
    // 獲取該類別的所有圖片
    fetchImages(category)
        .then(images => {
            if (images.length === 0) {
                galleryElement.innerHTML = '<p>沒有找到圖片</p>';
                return;
            }
            
            currentImages = images;
            
            // 生成縮圖
            let thumbnailsHTML = '<div class="thumbnails-grid">';
            images.forEach((image, index) => {
                thumbnailsHTML += `
                    <div class="thumbnail" onclick="showFullscreen('${image}', ${index})">
                        <img src="${image}" alt="婚紗照片${index + 1}">
                    </div>
                `;
            });
            thumbnailsHTML += '</div>';
            
            galleryElement.innerHTML = thumbnailsHTML;
        })
        .catch(error => {
            console.error('獲取圖片時出錯:', error);
            galleryElement.innerHTML = `<p>載入圖片時出錯: ${error.message}</p>`;
        });
}

// 從伺服器獲取圖片列表
async function fetchImages(category) {
    try {
        const response = await fetch("imagesGar.json");
        if (!response.ok) throw new Error("無法載入圖片");

        const data = await response.json();
        return data[category] || [];
    } catch (error) {
        console.error("獲取圖片時出錯:", error);
        return [];
    }
}
// async function fetchImages(category) {
//     try {
//         const response = await fetch(`gallery_getImage.php?category=${category}`);
//         if (!response.ok) {
//             throw new Error(`HTTP 錯誤: ${response.status}`);
//         }
//         const data = await response.json();
        
//         if (data.error) {
//             throw new Error(data.error);
//         }
        
//         return data;
//     } catch (error) {
//         console.error('獲取圖片時出錯:', error);
//         throw error;
//     }
// }

// 顯示全屏圖片
function showFullscreen(imageSrc, index) {
    currentIndex = index;
    
    const fullscreenContainer = document.getElementById('fullscreen-container');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const downloadBtn = document.getElementById('download-btn');
    
    // 設置全屏圖片
    fullscreenImg.src = imageSrc;
    
    // 設置下載按鈕
    downloadBtn.href = imageSrc;
    
    // 生成縮略圖
    thumbnailContainer.innerHTML = '';
    currentImages.forEach((image, idx) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `縮略圖 ${idx + 1}`;
        thumbnail.className = 'thumbnail-img';
        if (idx === currentIndex) {
            thumbnail.classList.add('active');
        }
        thumbnail.onclick = function() {
            showFullscreen(image, idx);
        };
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // 顯示全屏容器
    fullscreenContainer.style.display = 'flex';
    
    // 防止背景滾動
    document.body.style.overflow = 'hidden';
}

// 關閉全屏顯示
function closeFullscreen() {
    const fullscreenContainer = document.getElementById('fullscreen-container');
    fullscreenContainer.style.display = 'none';
    
    // 恢復背景滾動
    document.body.style.overflow = 'auto';
}

// 顯示上一張圖片
function prevImage() {
    if (currentImages.length === 0) return;
    
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showFullscreen(currentImages[currentIndex], currentIndex);
}

// 顯示下一張圖片
function nextImage() {
    if (currentImages.length === 0) return;
    
    currentIndex = (currentIndex + 1) % currentImages.length;
    showFullscreen(currentImages[currentIndex], currentIndex);
}

// 監聽鍵盤事件
document.addEventListener('keydown', function(event) {
    if (document.getElementById('fullscreen-container').style.display !== 'flex') return;
    
    if (event.key === 'Escape') {
        closeFullscreen();
    } else if (event.key === 'ArrowLeft') {
        prevImage();
    } else if (event.key === 'ArrowRight') {
        nextImage();
    }
});