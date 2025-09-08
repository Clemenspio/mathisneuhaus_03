<?php
// site/snippets/finder.php
// Saubere Trennung der Finder-Struktur
?>

<!-- Background Image -->
<div class="background-image" id="backgroundImage1"></div>
<div class="background-image" id="backgroundImage2"></div>

<!-- About Overlay -->
<div class="about-overlay" id="aboutOverlay" style="display: none;">
    <div class="about-text" id="aboutText">
        <!-- Content loaded dynamically -->
    </div>
</div>

<!-- Finder Interface -->
<div class="finder-interface">
    <div class="finder-container" id="finderContainer">
        <!-- Hover Background within Container -->
        <div class="finder-hover-bg" id="finderHoverBg"></div>

        <!-- Header -->
        <div class="finder-header" onclick="toggleAboutPage()">
            <div class="item-content">
                <div class="item-details">
                    <div class="item-name">
                        <span class="site-title" id="siteTitle">Mathis Neuhaus</span>
                    </div>
                </div>
                <div class="item-icon">
                    <img src="/assets/icons/Contact.svg" alt="Mathis Neuhaus" class="svg-icon">
                </div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="finder-main">
            <div class="finder-columns" id="finderColumns">
                <!-- Columns will be dynamically added here -->
            </div>
        </div>
    </div>
</div>

<!-- Overlays OUTSIDE all containers to prevent transform conflicts -->
<!-- Image Overlay -->
<div class="image-overlay" id="imageOverlay" onclick="hideImageOverlay()" style="display: none;">
    <div class="image-container">
        <img id="overlayImage" src="" alt="">
    </div>
</div>

<!-- Text File Overlay -->
<div class="text-overlay" id="textOverlay" onclick="hideTextOverlay()" style="display: none;">
    <div class="text-container" onclick="event.stopPropagation()">
        <!-- Scrollbarer Inhalt -->
        <div class="text-content" id="textContent">
            <!-- Text wird direkt geladen -->
        </div>
    </div>
</div>