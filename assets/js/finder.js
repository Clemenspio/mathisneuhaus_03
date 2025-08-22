/**
 * Finder JavaScript
 * Saubere Trennung der JavaScript-Logik
 */

// Global state
let columns = [];
let clickedPath = []; // Array to track clicked folders in path
let activeColumnIndex = 0;
let activeItemIndex = -1; // -1 means no item is selected
let currentBackground = 1;

// Overlay navigation state
let currentOverlayItems = [];
let currentOverlayIndex = -1;
let overlayType = null; // 'image' or 'text'

// Initialize the finder
document.addEventListener('DOMContentLoaded', function() {
    loadBackgroundImage(true);

    const initialPath = window.location.pathname;
    if (initialPath && initialPath !== '/') {
        loadPath(initialPath);
    } else {
        loadRootContent();
    }
    
    // Initiale Anwendung der dynamischen Kürzung
    setTimeout(() => {
        applyTruncation();
    }, 100);
    
    // Add click event for background image to toggle about page
    const backgroundImage1 = document.getElementById('backgroundImage1');
    const backgroundImage2 = document.getElementById('backgroundImage2');

    if (backgroundImage1) {
        backgroundImage1.addEventListener('click', function(e) {
            // Only trigger if clicking directly on the background, not on overlays
            if (e.target === backgroundImage1) {
                toggleAboutPage();
            }
        });
    }
     if (backgroundImage2) {
        backgroundImage2.addEventListener('click', function(e) {
            // Only trigger if clicking directly on the background, not on overlays
            if (e.target === backgroundImage2) {
                toggleAboutPage();
            }
        });
    }
    
    // Add hover effects only for the finder header (top bar)
    const finderHeader = document.querySelector('.finder-header');
    if (finderHeader) {
        finderHeader.addEventListener('mouseenter', function() {
            const finderContainer = document.getElementById('finderContainer');
            if (finderContainer && !finderContainer.classList.contains('slide-down')) {
                finderContainer.classList.add('hover-effect');
            }
        });
        
        finderHeader.addEventListener('mouseleave', function() {
            const finderContainer = document.getElementById('finderContainer');
            if (finderContainer) {
                finderContainer.classList.remove('hover-effect');
            }
        });
    }
    
    // Add click event for about overlay to close when clicking outside about text
    const aboutOverlay = document.getElementById('aboutOverlay');
    if (aboutOverlay) {
        aboutOverlay.addEventListener('click', function(e) {
            // Close about page when clicking anywhere except a link
            if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                hideAboutPage();
            }
        });
    }
    
    // Add click events for image overlay to close
    const imageOverlay = document.getElementById('imageOverlay');
    if (imageOverlay) {
        imageOverlay.addEventListener('click', function(e) {
            // Close overlay when clicking on the overlay, image container, or the image itself
            if (e.target === imageOverlay || 
                e.target.classList.contains('image-container') ||
                e.target.tagName === 'IMG') {
                hideImageOverlay();
            }
        });
        
        // Add touch events for mobile support
        imageOverlay.addEventListener('touchend', function(e) {
            // Only handle single touch
            if (e.touches.length === 0 && e.changedTouches.length === 1) {
                // Close overlay when tapping on the overlay, image container, or the image itself
                if (e.target === imageOverlay || 
                    e.target.classList.contains('image-container') ||
                    e.target.tagName === 'IMG') {
                    e.preventDefault(); // Prevent click event
                    hideImageOverlay();
                }
            }
        }, { passive: false });
    }
    
    // Add click events for text overlay to close
    const textOverlay = document.getElementById('textOverlay');
    if (textOverlay) {
        textOverlay.addEventListener('click', function(e) {
            // Close overlay when clicking on the overlay (not the content itself)
            if (e.target === textOverlay) {
                hideTextOverlay();
            }
        });
    }
    
    // Add keyboard navigation for overlays
    document.addEventListener('keydown', function(e) {
        // Only handle arrow keys when an overlay is open
        if (document.getElementById('imageOverlay').classList.contains('active') || 
            document.getElementById('textOverlay').classList.contains('active')) {
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                navigateOverlay(-1);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                navigateOverlay(1);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                hideImageOverlay();
                hideTextOverlay();
            }
        }
    });

    // Custom scroll snapping logic for mobile
    const columnsContainer = document.getElementById('finderColumns');
    let scrollTimeout;
    columnsContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.innerWidth <= 768) {
                snapToClosestColumn(columnsContainer);
            }
        }, 150); // Adjust timeout as needed
    });
    
    // Event Listener für Fenstergrößenänderung
    window.addEventListener('resize', debounce(applyTruncation, 150));
});

function snapToClosestColumn(container) {
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    
    let closestColumn = null;
    let minDistance = Infinity;

    columns.forEach(column => {
        const columnLeft = column.element.offsetLeft;
        const distance = Math.abs(scrollLeft - columnLeft);
        
        if (distance < minDistance) {
            minDistance = distance;
            closestColumn = column.element;
        }
    });

    if (closestColumn) {
        container.scrollTo({
            left: closestColumn.offsetLeft,
            behavior: 'smooth'
        });
    }
}

window.addEventListener('popstate', function(event) {
    const path = (event.state && event.state.path) ? event.state.path : '/';
    loadPath(path);
});

async function loadPath(path) {
    const columnsContainer = document.getElementById('finderColumns');
    columnsContainer.innerHTML = '';
    columns = [];
    clickedPath = [];
    activeColumnIndex = 0;
    activeItemIndex = -1;

    // Split path into segments including the root
    const segments = ['/', ...path.split('/').filter(Boolean)];
    let currentPathSegment = '';

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        
        if (i > 0) {
            currentPathSegment += `/${segment}`;
        }
        
        const pathToLoad = (i === 0) ? '' : currentPathSegment;
        
        try {
            const response = await fetch(`/api/content${pathToLoad}`);
            const data = await response.json();

            if (data.status === 'ok') {
                const title = (i === 0) ? 'Home' : segments[i];
                addColumn(title, data.items, null, pathToLoad || '/');
                clickedPath.push(pathToLoad || '/');
            } else {
                break; // Stop if a path segment is invalid
            }
        } catch (error) {
            console.error(`Failed to load segment ${pathToLoad}:`, error);
            break;
        }
    }

    updateAllColumnsForPath();

    // After loading, select the first item of the last column
    if (columns.length > 0) {
        activeColumnIndex = columns.length - 1;
        if (columns[activeColumnIndex].items.length > 0) {
            activeItemIndex = 0;
            updateActiveSelection();
        }
    }
}

// Load random background image
async function loadBackgroundImage(initial = false) {
    try {
        const response = await fetch('/api/desktop-images');
        const data = await response.json();
        
        if (data.status === 'ok' && data.images && data.images.length > 0) {
            const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
            
            // Preload the image to find the best source from srcset
            const img = new Image();
            img.srcset = randomImage.srcset;
            // The sizes attribute helps the browser to choose the right image from srcset
            img.sizes = '100vw'; 

            img.onload = () => {
                const background1 = document.getElementById('backgroundImage1');
                const background2 = document.getElementById('backgroundImage2');

                const newBg = (currentBackground === 1) ? background2 : background1;
                const oldBg = (currentBackground === 1) ? background1 : background2;

                if (initial) {
                    oldBg.style.backgroundImage = `url('${img.currentSrc || randomImage.url}')`;
                    oldBg.style.opacity = 1;
                } else {
                    newBg.style.backgroundImage = `url('${img.currentSrc || randomImage.url}')`;
                    newBg.style.opacity = 0;
                    newBg.style.transition = 'opacity 0.5s ease-in-out';
                    
                    setTimeout(() => {
                        newBg.style.opacity = 1;
                        oldBg.style.opacity = 0;
                        currentBackground = (currentBackground === 1) ? 2 : 1;
                    }, 10);
                }
            };
            
            // If the image fails to load, fallback to the original URL
            img.onerror = () => {
                const background1 = document.getElementById('backgroundImage1');
                background1.style.backgroundImage = `url('${randomImage.url}')`;
            };
        }
    } catch (error) {
        console.error('Failed to load background image:', error);
    }
}

// Load root content
async function loadRootContent() {
    // When loading root, reset the URL to the base path
    history.pushState({ path: '/' }, '', '/');
    try {
        const response = await fetch('/api/content');
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            addColumn('Home', data.items, null, '/');
        }
    } catch (error) {
        console.error('Failed to load content:', error);
    }
}

// Add a new column
function addColumn(title, items, hoverImageUrl = null, path = null) {
    const columnsContainer = document.getElementById('finderColumns');

    const column = document.createElement('div');
    column.className = 'finder-column';

    const itemsList = document.createElement('div');
    itemsList.className = 'items-list';

    renderColumnContent(itemsList, items, columns.length > 0, columns.length);

    if (title === 'Home') {
        column.classList.add('home-column');
    }

    column.appendChild(itemsList);
    columnsContainer.appendChild(column);
    
    const parentColumnIndex = activeColumnIndex;
    columns.push({ title, items, element: column, hoverImageUrl, path });

    // Preload all images in this folder
    preloadFolderImages(items);

    // "Docking" scroll logic
    requestAnimationFrame(() => {
        const targetScrollLeft = column.offsetLeft;
        columnsContainer.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
    });
}

// Create item element
function createItemElement(item, columnIndex) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'finder-item content-item';
    
    if (item.type === 'folder' && clickedPath.includes(item.path)) {
        itemDiv.classList.add('active-path');
    }
    
    itemDiv.onclick = () => handleItemClick(item, columnIndex);
    
    if (item.type === 'folder' && item.hover_thumbnail_url) {
        // Desktop: Mouse events - ANGEPASST für Cross-Fade
        itemDiv.onmouseenter = () => {
            // Ein geplantes Ausblenden abbrechen, falls vorhanden
            if (hideDelayTimeout) {
                clearTimeout(hideDelayTimeout);
                hideDelayTimeout = null;
            }
            showHoverImage(item.hover_thumbnail_url);
        };
        
        itemDiv.onmouseleave = () => {
            // Set hover as inactive immediately when leaving item
            isHoverActive = false;
            
            // Das Ausblenden mit einer kurzen Verzögerung planen
            hideDelayTimeout = setTimeout(() => {
                // Hide if we're still not hovering over any item
                if (hideDelayTimeout && !isHoverActive) {
                    hideHoverImage();
                }
                hideDelayTimeout = null;
            }, 50); // 50ms Verzögerung für Cross-Fade
        };
        
        // Mobile: Touch events (tap and hold)
        let touchHoldTimer = null;
        let isHoverShowing = false;
        let autoHideTimer = null;
        let touchStartTime = 0;
        let hasMoved = false;
        
        itemDiv.addEventListener('touchstart', (e) => {
            // Modern approach: Use timestamps and movement detection
            touchStartTime = Date.now();
            hasMoved = false;
            
            touchHoldTimer = setTimeout(() => {
                // Only show hover if we haven't moved and still holding
                if (!hasMoved && Date.now() - touchStartTime >= 100) {
                    showHoverImage(item.hover_thumbnail_url);
                    isHoverShowing = true;
                    // Note: showHoverImage already sets isHoverActive = true
                    // No haptic feedback - user doesn't want it
                    
                    // Auto-hide after 3 seconds as fallback
                    autoHideTimer = setTimeout(() => {
                        if (isHoverShowing) {
                            hideHoverImage();
                            isHoverShowing = false;
                        }
                    }, 3000);
                }
            }, 100); // Show after 100ms hold - schneller für Mobile
        }, { passive: true });
        
        itemDiv.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // Always clear all timers first
            if (touchHoldTimer) {
                clearTimeout(touchHoldTimer);
                touchHoldTimer = null;
            }
            if (autoHideTimer) {
                clearTimeout(autoHideTimer);
                autoHideTimer = null;
            }
            
            // Always hide hover if showing
            if (isHoverShowing) {
                hideHoverImage();
                isHoverShowing = false;
                // Prevent click event if we were showing hover
                e.preventDefault();
                return;
            }
            
            // Modern tap detection: short duration + no movement = intentional tap
            if (!hasMoved && touchDuration < 300) { // Under 300ms = tap, not scroll
                handleItemClick(item, columnIndex);
            }
            // If moved or held too long, don't open the item
        }, { passive: false });
        
        // Also hide on touchcancel (when touch is interrupted)
        itemDiv.addEventListener('touchcancel', (e) => {
            // Clear all timers
            if (touchHoldTimer) {
                clearTimeout(touchHoldTimer);
                touchHoldTimer = null;
            }
            if (autoHideTimer) {
                clearTimeout(autoHideTimer);
                autoHideTimer = null;
            }
            
            if (isHoverShowing) {
                hideHoverImage();
                isHoverShowing = false;
                // isHoverActive is set to false in hideHoverImage()
            }
        }, { passive: true });
        
        itemDiv.addEventListener('touchmove', (e) => {
            // Any movement cancels intentional tap and hover
            hasMoved = true;
            
            // Cancel hover on any movement
            if (touchHoldTimer) {
                clearTimeout(touchHoldTimer);
                touchHoldTimer = null;
            }
            if (autoHideTimer) {
                clearTimeout(autoHideTimer);
                autoHideTimer = null;
            }
            if (isHoverShowing) {
                hideHoverImage();
                isHoverShowing = false;
            }
        }, { passive: true });
    }
    
    const icon = getIcon(item.type, item);
    
    itemDiv.innerHTML = `
        <div class="item-content">
            <div class="item-icon">${icon}</div>
            <div class="item-details">
                <div class="item-name" title="${item.name}" data-original-filename="${item.name}">${item.name}</div>
            </div>
        </div>
    `;
    
    return itemDiv;
}

// Handle item clicks
async function handleItemClick(item, columnIndex) {
    hideHoverImage();
    removeColumnsAfter(columnIndex);

    if (item.type === 'folder') {
        clickedPath = columns.map(col => col.path).filter(Boolean);
        if (!clickedPath.includes(item.path)) {
            clickedPath.push(item.path);
        }

        history.pushState({ path: item.path }, '', item.path);

        try {
            const response = await fetch(`/api/content${item.path}`);
            const data = await response.json();
            addColumn(item.name, data.items || [], item.hover_thumbnail_url, item.path);
        } catch (error) {
            console.error('Failed to load folder:', error);
            addColumn(item.name, [], item.hover_thumbnail_url, item.path);
        }

        updateAllColumnsForPath();
        
        // Anwendung der dynamischen Kürzung nach dem Hinzufügen einer neuen Spalte
        setTimeout(() => {
            applyTruncation();
        }, 50);
    } else if (item.type === 'externallink') {
        if (item.url) window.open(item.url, '_blank');
    } else if (item.type === 'textfile') {
        loadTextFileContent(item.path, item.name);
    } else if (item.type === 'image' && item.url) {
        showImageOverlay(item.url, item.srcset, item.path);
    } else if (item.url) {
        window.open(item.url, '_blank');
    }
}

function goBack() {
    if (columns.length <= 1) return; // Cannot go back from root

    const columnsContainer = document.getElementById('finderColumns');
    const targetColumnIndex = columns.length - 2;
    const targetColumn = columns[targetColumnIndex].element;
    const columnToRemove = columns[columns.length - 1].element;

    // Scroll to the previous column
    columnsContainer.scrollTo({
        left: targetColumn.offsetLeft,
        behavior: 'smooth'
    });
    
    // Add class to animate removal
    columnToRemove.classList.add('removing');

    // Use a timeout to allow the scroll and fade animation to complete before removing the column
    setTimeout(() => {
        removeColumnsAfter(targetColumnIndex);

        const parentPath = columns[targetColumnIndex].path;
        history.pushState({ path: parentPath }, '', parentPath);

        clickedPath.pop();
        updateAllColumnsForPath();
    }, 300); // Should match the transition duration
}

function removeColumnsAfter(index) {
    const columnsContainer = document.getElementById('finderColumns');
    if (index === undefined || index === null) return;

    while (columnsContainer.children.length > index + 1) {
        columnsContainer.removeChild(columnsContainer.lastChild);
    }

    columns = columns.slice(0, index + 1);
    
    // Reset selection to the new last column
    activeColumnIndex = columns.length - 1;
    activeItemIndex = -1;
    updateActiveSelection();

    updateAllColumnsForPath();
}

// Dynamische Kürzung basierend auf verfügbarer Breite
function truncateFilenameDynamically(element) {
    // Stelle sicher, dass der Text nicht bereits gekürzt ist,
    // um die ursprüngliche Länge zu erhalten.
    const originalFilename = element.dataset.originalFilename || element.textContent;
    element.textContent = originalFilename; // Setze auf Original zurück für die Breitenmessung
    
    if (element.scrollWidth > element.clientWidth) {
        // Führe die Kürzung durch
        const truncatedName = getTruncatedName(originalFilename, element.clientWidth);
        element.textContent = truncatedName;
    }
}

function getTruncatedName(filename, availableWidth) {
    const ellipsis = '…';
    const lastDotIndex = filename.lastIndexOf('.');
    let name = filename;
    let extension = '';
    
    if (lastDotIndex > 0) {
        name = filename.substring(0, lastDotIndex);
        extension = filename.substring(lastDotIndex);
    }
    
    // Zeichenbreite schätzen basierend auf Font-Größe
    // Die .item-name hat font-size: 20px, Karl Font ist ca. 0.6em breit pro Zeichen
    const avgCharWidth = 12; // Angepasst für 20px Karl Font
    let maxLength = Math.floor(availableWidth / avgCharWidth);
    
    // Subtrahiere die Länge der Endung und der Ellipse
    maxLength -= (extension.length + ellipsis.length);
    
    if (name.length > maxLength && maxLength > 3) {
        const startLength = Math.ceil(maxLength / 2);
        const endLength = Math.floor(maxLength / 2);
        return `${name.substring(0, startLength)}${ellipsis}${name.substring(name.length - endLength)}${extension}`;
    }
    
    return filename;
}

// Fallback-Funktion für Kompatibilität (wird durch dynamische Kürzung ersetzt)
function truncateFilename(filename, maxLength = null) {
    // Diese Funktion wird nur noch als Fallback verwendet
    return filename;
}

// Helper function to truncate text in the middle (Legacy)
function truncateInMiddle(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    
    // Calculate how much to show from start and end
    const ellipsisLength = 1; // Length of '…'
    const availableLength = maxLength - ellipsisLength;
    const startLength = Math.ceil(availableLength / 2);
    const endLength = Math.floor(availableLength / 2);
    
    const start = text.substring(0, startLength);
    const end = text.substring(text.length - endLength);
    
    return start + '…' + end;
}

// Get icon for item type
function getIcon(type, item) {
    if (type === 'image' && item.url) {
        return `<img src="${item.thumbnail || item.url}" srcset="${item.srcset || ''}" sizes="40px" alt="${item.name}" class="image-thumbnail">`;
    }
    
    const icons = {
        folder: '<img src="/assets/icons/Folder.svg" alt="Folder" class="svg-icon">',
        textfile: '<img src="/assets/icons/Textfile.svg" alt="Textfile" class="svg-icon">',
        externallink: '<img src="/assets/icons/link.svg" alt="Link" class="svg-icon">',
        image: '🖼️',
        document: '<img src="/assets/icons/pdffile.svg" alt="PDF" class="svg-icon">',
        audio: '<img src="/assets/icons/music.svg" alt="Audio" class="svg-icon">',
        video: '🎬'
    };
    return icons[type] || '<img src="/assets/icons/Textfile.svg" alt="File" class="svg-icon">';
}

// Function to update all columns to reflect current path
function updateAllColumnsForPath() {
    columns.forEach((column, colIndex) => {
        const itemsList = column.element.querySelector('.items-list');
        if (itemsList) {
            renderColumnContent(itemsList, column.items, colIndex > 0, colIndex);
        }
    });
}

// NEW function to render the content of a column
function renderColumnContent(itemsList, items, hasBackButton, columnIndex) {
    itemsList.innerHTML = ''; // Clear previous content

    if (hasBackButton) {
        const backButton = document.createElement('div');
        backButton.className = 'finder-item finder-back-button';
        backButton.innerHTML = `
            <div class="item-content">
                <div class="item-icon"><img src="/assets/icons/Backbutton.svg" alt="Back" class="svg-icon"></div>
                <div class="item-details">
                    <div class="item-name">... back</div>
                </div>
            </div>
        `;
        backButton.onclick = () => goBack();
        itemsList.appendChild(backButton);
    }

    if (items.length === 0) {
        if (!hasBackButton) { // Only show empty state if there's no back button
            itemsList.innerHTML += `
                <div class="empty-state">
                    <div class="empty-state-icon">📁</div>
                    <p>Dieser Ordner ist leer</p>
                </div>
            `;
        }
    } else {
        items.forEach((item, itemIndex) => {
            const itemElement = createItemElement(item, columnIndex); // Pass correct column index
            itemsList.appendChild(itemElement);
        });
    }
}

// UI functions (Overlays, Hover, etc.)
let hoverTimeout = null;
let currentHoverImage = null;
let hideDelayTimeout = null; // Neue Variable für verzögertes Ausblenden
let isHoverActive = false; // Flag to track hover state
let pendingCleanupTimeouts = new Set(); // Track all cleanup timeouts

function showHoverImage(imageUrl) {
    const hoverBg = document.getElementById('finderHoverBg');
    
    // Clear ALL pending timeouts to prevent interference
    if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
    }
    
    // Clear all cleanup timeouts
    pendingCleanupTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    pendingCleanupTimeouts.clear();
    
    // Set hover as active immediately
    isHoverActive = true;
    
    // Ensure we have two layers for cross-fade
    if (hoverBg.children.length === 0) {
        hoverBg.innerHTML = '<div class="hover-layer"></div><div class="hover-layer"></div>';
    }
    
    const layer1 = hoverBg.children[0];
    const layer2 = hoverBg.children[1];
    
    // Check if we're switching between different images
    if (currentHoverImage && currentHoverImage !== imageUrl && isHoverActive) {
        // Cross-fade: use the inactive layer for the new image
        const activeLayer = layer1.classList.contains('active') ? layer1 : layer2;
        const inactiveLayer = activeLayer === layer1 ? layer2 : layer1;
        
        // Prepare the new layer
        inactiveLayer.classList.remove('fade-out');
        inactiveLayer.style.backgroundImage = `url('${imageUrl}')`;
        
        // Start cross-fade immediately
        inactiveLayer.classList.add('active');
        activeLayer.classList.remove('active');
        activeLayer.classList.add('fade-out');
        
        // Track cleanup timeout
        const cleanupTimeoutId = setTimeout(() => {
            activeLayer.classList.remove('fade-out');
            activeLayer.style.backgroundImage = '';
            pendingCleanupTimeouts.delete(cleanupTimeoutId);
        }, 550); // Synchron mit CSS transition (500ms + buffer)
        
        pendingCleanupTimeouts.add(cleanupTimeoutId);
        currentHoverImage = imageUrl;
        
    } else if (!currentHoverImage || layer1.style.backgroundImage === '' || !layer1.classList.contains('active')) {
        // First image or recovering from broken state: reset and show
        layer1.classList.remove('fade-out');
        layer2.classList.remove('fade-out', 'active');
        layer2.style.backgroundImage = '';
        
        layer1.style.backgroundImage = `url('${imageUrl}')`;
        layer1.classList.add('active'); // Always show if this is a new request
        
        currentHoverImage = imageUrl;
    }
    // If same image is already showing and active, do nothing
    
    // Debug: ensure we have a visible image
    if (isHoverActive && currentHoverImage === imageUrl) {
        const hasActiveLayer = layer1.classList.contains('active') || layer2.classList.contains('active');
        if (!hasActiveLayer) {
            // Recovery: force show the image
            layer1.style.backgroundImage = `url('${imageUrl}')`;
            layer1.classList.add('active');
        }
    }
}

function hideHoverImage() {
    const hoverBg = document.getElementById('finderHoverBg');
    const layers = hoverBg.children;
    
    // Set hover as inactive immediately
    isHoverActive = false;
    
    // Clear all cleanup timeouts - we're taking control now
    pendingCleanupTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    pendingCleanupTimeouts.clear();
    
    // Fade out all active layers
    for (let layer of layers) {
        if (layer.classList.contains('active')) {
            layer.classList.add('fade-out');
            layer.classList.remove('active');
        }
    }
    
    // Clean up after animation completes
    hoverTimeout = setTimeout(() => {
        // Only clean up if hover is still inactive (no new hover started)
        if (!isHoverActive) {
            for (let layer of layers) {
                layer.classList.remove('fade-out');
                layer.style.backgroundImage = '';
            }
            currentHoverImage = null;
        }
        hoverTimeout = null;
    }, 550); // 50ms mehr als CSS transition (500ms) für saubere Koordination
}

// Preload all images in a folder for faster switching
function preloadFolderImages(items) {
    const imageItems = items.filter(item => item.type === 'image' && item.url);
    
    // Limit preloading to avoid overwhelming the browser
    const maxPreload = 10;
    const imagesToPreload = imageItems.slice(0, maxPreload);
    
    imagesToPreload.forEach(item => {
        const img = new Image();
        img.src = item.url;
        if (item.srcset) {
            img.srcset = item.srcset;
        }
        // Images werden im Browser Cache gespeichert für spätere Verwendung
    });
    
    if (imageItems.length > 0) {
        console.log(`Preloading ${Math.min(imagesToPreload.length, imageItems.length)} images from folder`);
    }
}

function createImageOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'imageOverlay';
    overlay.className = 'image-overlay';
    overlay.onclick = hideImageOverlay;
    
    const container = document.createElement('div');
    container.className = 'image-container';
    // Entferne stopPropagation, damit Klicks auf das Bild auch das Overlay schließen
    
    const image = document.createElement('img');
    image.id = 'overlayImage';
    image.alt = '';
    
    container.appendChild(image);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    return overlay;
}

function showImageOverlay(imageUrl, srcset, itemPath = null) {
    let overlay = document.getElementById('imageOverlay');
    let image = document.getElementById('overlayImage');
    
    // Falls das Element entfernt wurde, erstelle es neu
    if (!overlay) {
        overlay = createImageOverlay();
    }
    if (!image) {
        image = document.getElementById('overlayImage');
    }
    
    if (overlay && image) {
        // Setup overlay navigation
        setupOverlayNavigation('image', itemPath);
        
        // Preload das neue Bild
        const newImage = new Image();
        newImage.onload = function() {
            // Erst wenn das neue Bild geladen ist, ersetzen wir das alte
            image.src = imageUrl;
            image.srcset = srcset || '';
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('active'), 10);
        };
        
        // Falls das Bild bereits im Cache ist, wird onload sofort ausgeführt
        newImage.src = imageUrl;
        if (srcset) {
            newImage.srcset = srcset;
        }
    }
}

function hideImageOverlay() {
    const overlay = document.getElementById('imageOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            // Entferne das Element komplett aus dem DOM auf mobilen Geräten
            if (window.innerWidth <= 768) {
                overlay.remove();
            }
        }, 300);
    }
    // Reset overlay navigation
    currentOverlayItems = [];
    currentOverlayIndex = -1;
    overlayType = null;
}

function createTextOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'textOverlay';
    overlay.className = 'text-overlay';
    overlay.onclick = hideTextOverlay;
    
    const container = document.createElement('div');
    container.className = 'text-container';
    container.onclick = (e) => e.stopPropagation();
    
    const content = document.createElement('div');
    content.className = 'text-content';
    content.id = 'textContent';
    
    container.appendChild(content);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    return overlay;
}

function showTextOverlay(title, content, path) {
    let overlay = document.getElementById('textOverlay');
    let textContent = document.getElementById('textContent');
    
    // Falls das Element entfernt wurde, erstelle es neu
    if (!overlay) {
        overlay = createTextOverlay();
    }
    if (!textContent) {
        textContent = document.getElementById('textContent');
    }
    
    if (!overlay || !textContent) return;
    
    // Setup overlay navigation
    setupOverlayNavigation('text', path);
    
    displayTextContent(content);
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);
}

function displayTextContent(content) {
    const textContent = document.getElementById('textContent');
    if (!textContent) return;

    let textContentString = content.value || content.content || (typeof content === 'string' ? content : '');

    if (textContentString.trim() !== '') {
        // Process Kirby link syntax: (link: URL text: LINK TEXT)
        textContentString = textContentString.replace(/\(link:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="$1" style="color: #333333; text-decoration: underline;" target="_blank">$2</a>');
        
        // Process email syntax: (email: EMAIL text: LINK TEXT)
        textContentString = textContentString.replace(/\(email:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="mailto:$1" style="color: #333333; text-decoration: underline;">$2</a>');
        
        const paragraphs = textContentString.replace(/\r/g, '').split(/\n\n+/).filter(p => p.trim() !== '');
        textContent.innerHTML = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    } else {
        textContent.innerHTML = '<div class="text-error">Kein Inhalt verfügbar.</div>';
    }
}

async function loadTextFileContent(path, title) {
    try {
        const response = await fetch(`/api/textfile-content${path}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.content) {
            showTextOverlay(title, data.content, path);
        } else {
            showTextOverlay(title, 'Fehler beim Laden der Datei.', path);
        }
    } catch (error) {
        console.error('Failed to load text file:', error);
        showTextOverlay(title, 'Fehler beim Laden der Datei.', path);
    }
}



function hideTextOverlay() {
    const overlay = document.getElementById('textOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            // Entferne das Element komplett aus dem DOM auf mobilen Geräten
            if (window.innerWidth <= 768) {
                overlay.remove();
            }
        }, 300);
    }
    // Reset overlay navigation
    currentOverlayItems = [];
    currentOverlayIndex = -1;
    overlayType = null;
}

// About page functions
function toggleAboutPage() {
    const finderContainer = document.getElementById('finderContainer');
    if (finderContainer.classList.contains('slide-down')) {
        hideAboutPage();
    } else {
        showAboutPage();
    }
    if (event) event.stopPropagation();
}

function showAboutPage() {
    const finderContainer = document.getElementById('finderContainer');
    const aboutOverlay = document.getElementById('aboutOverlay');
    const aboutText = document.getElementById('aboutText');
    
    document.body.style.overflow = 'hidden';
    finderContainer.classList.add('slide-down');
    aboutOverlay.style.display = 'flex';
    loadAboutContent();
    
    setTimeout(() => {
        aboutOverlay.classList.add('active');
        aboutText.classList.add('fade-in');
    }, 300);
}

function hideAboutPage() {
    const finderContainer = document.getElementById('finderContainer');
    const aboutOverlay = document.getElementById('aboutOverlay');
    const aboutText = document.getElementById('aboutText');
    
    document.body.style.overflow = '';
    aboutText.classList.remove('fade-in');
    aboutOverlay.classList.remove('active');
    finderContainer.classList.remove('slide-down');
    
    setTimeout(() => aboutOverlay.style.display = 'none', 300);
    loadBackgroundImage();
}

async function loadAboutContent() {
    const aboutText = document.getElementById('aboutText');
    try {
        const response = await fetch('/api/about');
        const data = await response.json();
        
        if (data.status === 'ok') {
            let content = data.content;
            if (typeof content === 'object' && content.value) content = content.value;
            
            content = content.replace(/\(email:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="mailto:$1" style="color: #FFFFFF; text-decoration: underline; text-underline-offset: 8px;">$2</a>');
            content = content.replace(/\(link:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="$1" style="color: #FFFFFF; text-decoration: underline;" target="_blank">$2</a>');
            content = content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
            aboutText.innerHTML = `<p>${content}</p>`;
            
            // Add credits if available
            if (data.credits && data.credits.trim() !== '') {
                let credits = data.credits;
                if (typeof credits === 'object' && credits.value) credits = credits.value;
                
                // Process Kirby link syntax in credits too
                credits = credits.replace(/\(email:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="mailto:$1" style="color: #FFFFFF; text-decoration: underline; text-underline-offset: 8px;">$2</a>');
                credits = credits.replace(/\(link:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="$1" style="color: #FFFFFF; text-decoration: underline;" target="_blank">$2</a>');
                credits = credits.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
                aboutText.innerHTML += `<div class="about-credits"><p>${credits}</p></div>`;
            }
        } else {
            aboutText.innerHTML = 'About information not available.';
        }
    } catch (error) {
        console.error('Failed to load about:', error);
        aboutText.innerHTML = 'About information not available.';
    }
} 

// Anwendung der dynamischen Kürzung
function applyTruncation() {
    const fileItems = document.querySelectorAll('.item-name');
    fileItems.forEach(item => {
        // Speichere den originalen Dateinamen, falls noch nicht geschehen
        if (!item.dataset.originalFilename) {
            item.dataset.originalFilename = item.textContent;
        }
        truncateFilenameDynamically(item);
    });
}

// Debounce-Funktion zur Performance-Optimierung
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Global Keyboard Handler
document.addEventListener('keydown', function(e) {
    const aboutOverlay = document.getElementById('aboutOverlay');
    const imageOverlay = document.getElementById('imageOverlay');
    const textOverlay = document.getElementById('textOverlay');

    // Handle overlay closing with ESC
    if (e.key === 'Escape') {
        if (imageOverlay && imageOverlay.classList.contains('active')) {
            hideImageOverlay();
        } else if (textOverlay && textOverlay.classList.contains('active')) {
            hideTextOverlay();
        } else if (aboutOverlay && aboutOverlay.classList.contains('active')) {
            hideAboutPage();
        }
        return; // Stop further processing if an overlay was closed
    }

    // Stop keyboard navigation if an overlay is active
    if ((aboutOverlay && aboutOverlay.classList.contains('active')) || 
        (imageOverlay && imageOverlay.classList.contains('active')) || 
        (textOverlay && textOverlay.classList.contains('active'))) {
        return;
    }

    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            navigateItems(-1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            navigateItems(1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateColumns(1);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            navigateColumns(-1);
            break;
        case 'Enter':
            e.preventDefault();
            activateSelectedItem();
            break;
    }
});

function navigateItems(direction) {
    if (activeColumnIndex < 0 || activeColumnIndex >= columns.length) return;
    const column = columns[activeColumnIndex];
    if (!column.items || column.items.length === 0) return;

    activeItemIndex += direction;

    // Clamp the index within bounds
    if (activeItemIndex < 0) activeItemIndex = 0;
    if (activeItemIndex >= column.items.length) activeItemIndex = column.items.length - 1;

    updateActiveSelection();
}

function navigateColumns(direction) {
    if (direction === 1) {
        // Arrow Right should behave like Enter
        activateSelectedItem();
        return;
    }

    // Arrow Left
    const previousColumnIndex = activeColumnIndex;
    activeColumnIndex += direction;

    // Clamp the index within bounds
    if (activeColumnIndex < 0) activeColumnIndex = 0;
    if (activeColumnIndex >= columns.length) activeColumnIndex = columns.length - 1;

    // If moving to a new column, select the item that is part of the path
    if (activeColumnIndex !== previousColumnIndex) {
        activeItemIndex = -1; // Deselect item in previous column
        const currentPath = clickedPath[activeColumnIndex];
        if (currentPath) {
            const itemIndex = columns[activeColumnIndex].items.findIndex(item => item.path === currentPath);
            if (itemIndex !== -1) {
                activeItemIndex = itemIndex;
            }
        }
    }

    updateActiveSelection();
}

function activateSelectedItem() {
    if (activeColumnIndex < 0 || activeColumnIndex >= columns.length ||
        activeItemIndex < 0 || activeItemIndex >= columns[activeColumnIndex].items.length) {
        return;
    }
    const item = columns[activeColumnIndex].items[activeItemIndex];
    handleItemClick(item, activeColumnIndex);
}

function updateActiveSelection() {
    // Remove previous selection
    document.querySelectorAll('.finder-item.active-selection').forEach(item => {
        item.classList.remove('active-selection');
    });

    if (activeColumnIndex < 0 || activeColumnIndex >= columns.length ||
        activeItemIndex < 0 || activeItemIndex >= columns[activeColumnIndex].items.length) {
        return;
    }

    // Highlight the new selection
    const columnElement = columns[activeColumnIndex].element;
    const itemElement = columnElement.querySelectorAll('.content-item')[activeItemIndex];
    if (itemElement) {
        itemElement.classList.add('active-selection');
        itemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Overlay navigation functions
function setupOverlayNavigation(type, currentPath) {
    overlayType = type;
    currentOverlayItems = [];
    currentOverlayIndex = -1;
    
    // Get items from current active column
    if (activeColumnIndex >= 0 && activeColumnIndex < columns.length) {
        const column = columns[activeColumnIndex];
        // Include both images AND textfiles for navigation
        currentOverlayItems = column.items.filter(item => {
            return item.type === 'image' || item.type === 'textfile';
        });
        
        // Find current item index
        if (currentPath) {
            currentOverlayIndex = currentOverlayItems.findIndex(item => item.path === currentPath);
        }
    }
}

function navigateOverlay(direction) {
    if (currentOverlayItems.length === 0) return;
    
    // Calculate new index
    let newIndex = currentOverlayIndex + direction;
    
    // Wrap around
    if (newIndex < 0) {
        newIndex = currentOverlayItems.length - 1;
    } else if (newIndex >= currentOverlayItems.length) {
        newIndex = 0;
    }
    
    currentOverlayIndex = newIndex;
    const item = currentOverlayItems[currentOverlayIndex];
    
    // Show the new item based on its type (not the current overlay type)
    if (item.type === 'image') {
        // Switch to image overlay if not already there
        hideTextOverlay();
        showImageOverlay(item.url, item.srcset, item.path);
    } else if (item.type === 'textfile') {
        // Switch to text overlay if not already there
        hideImageOverlay();
        loadTextFileContent(item.path, item.name);
    }
} 