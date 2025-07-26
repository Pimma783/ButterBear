document.addEventListener('DOMContentLoaded', function() {
    const mainProductImage = document.getElementById('main-product-image');
    const thumbnailImages = document.querySelectorAll('.thumbnail-image');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Function to handle thumbnail clicks
    thumbnailImages.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const fullSrc = this.getAttribute('data-full-src');
            mainProductImage.src = fullSrc;

            // Remove active state from all thumbnails
            thumbnailImages.forEach(img => {
                img.classList.remove('border-primary-blue', 'opacity-100');
                img.classList.add('border-transparent', 'opacity-70');
            });

            // Add active state to the clicked thumbnail
            this.classList.remove('border-transparent', 'opacity-70');
            this.classList.add('border-primary-blue', 'opacity-100');
        });
    });

    // Set the initial active thumbnail (optional, but good for UX)
    if (thumbnailImages.length > 0) {
        // Find the thumbnail that matches the current main image, or just pick the first one
        let initialActiveThumbnail = Array.from(thumbnailImages).find(thumb => thumb.getAttribute('data-full-src') === mainProductImage.src);
        if (!initialActiveThumbnail) {
            initialActiveThumbnail = thumbnailImages[0];
        }
        initialActiveThumbnail.classList.remove('border-transparent', 'opacity-70');
        initialActiveThumbnail.classList.add('border-primary-blue', 'opacity-100');
    }

    // Toggle mobile menu visibility
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});