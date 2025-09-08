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

// Touch device detection
function isTouchDevice() {
    return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
}


// Overlay navigation state
let currentOverlayItems = [];
let currentOverlayIndex = -1;
let overlayType = null; // 'image' or 'text'

// Initialize the finder
document.addEventListener('DOMContentLoaded', function() {
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> parent of 20788c6 (broken mobile text image hover)
<<<<<<< HEAD
    
    // Funktionen direkt aufrufen, ohne Verzögerung
=======
>>>>>>> parent of 6ad1859 (done version)
=======
>>>>>>> parent of 6ad1859 (done version)
<<<<<<< HEAD
>>>>>>> parent of 20788c6 (broken mobile text image hover)
=======
>>>>>>> parent of 20788c6 (broken mobile text image hover)
    loadBackgroundImage(true);

    const initialPath = window.location.pathname;
    if (initialPath && initialPath !== '/') {
        loadPath(initialPath);
    } else {
        loadRootContent();
    }
    
    // Initiale Anwendung der dynamischen Kürzung und Hover-Funktionalität
    applyTruncation();
    updateHoverFunctionality();
    
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
    window.addEventListener('resize', debounce(() => {
        applyTruncation();
        updateHoverFunctionality();
    }, 150));
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

    updatePathIndicators();

    // After loading, select the first item of the last column
    if (columns.length > 0) {
        activeColumnIndex = columns.length - 1;
        if (columns[activeColumnIndex].items.length > 0) {
            activeItemIndex = 0;
            updateActiveSelection();
        }
        
        // Spalten wachsen dynamisch mit Inhalt
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
            // Spalten wachsen dynamisch
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

    // Spalten wachsen dynamisch mit Inhalt (wie ursprünglich)

    // "Docking" scroll logic - immediate UI update
    requestAnimationFrame(() => {
        const targetScrollLeft = column.offsetLeft;
        columnsContainer.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
        
        // Nach dem Hinzufügen einer neuen Spalte: Dateinamen in allen Spalten neu berechnen
        setTimeout(() => {
            applyTruncation();
        }, 100); // Kurze Verzögerung für Layout-Stabilität
    });

    // Asynchronous preloading - doesn't block UI
    setTimeout(() => {
        preloadFolderImages(items);
    }, 100); // Small delay to ensure UI is responsive first
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
        // Markiere das Item als Hover-fähig für CSS-Selektoren
        itemDiv.setAttribute('data-has-hover', 'true');
        
        // Nur auf echten Desktop-Geräten (ohne Touch): Hover-Funktionalität aktivieren
        if (window.innerWidth > 768 && !isTouchDevice()) {
            // Verhindere Mouse-Events die durch Touch ausgelöst werden
            let lastTouchTime = 0;
            
            // Touch-Events überwachen um Mouse-Events zu blockieren
            itemDiv.addEventListener('touchstart', () => {
                lastTouchTime = Date.now();
            }, { passive: true });
            
            // Desktop: Mouse events - ANGEPASST für Cross-Fade
            itemDiv.onmouseenter = (e) => {
                // Blockiere Mouse-Events die kurz nach Touch-Events auftreten
                if (Date.now() - lastTouchTime < 500) {
                    return;
                }
                // Ein geplantes Ausblenden abbrechen, falls vorhanden
                if (hideDelayTimeout) {
                    clearTimeout(hideDelayTimeout);
                    hideDelayTimeout = null;
                }
                showHoverImage(item.hover_thumbnail_url, item.hover_image_inset);
            };
            
            itemDiv.onmouseleave = (e) => {
                // Blockiere Mouse-Events die kurz nach Touch-Events auftreten
                if (Date.now() - lastTouchTime < 500) {
                    return;
                }
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
        }
        
        // Mobile: Keine Hover-Funktionalität - nur einfache Klicks
        if (window.innerWidth <= 768) {
            // Keine Touch-Events für Hover auf Mobile
            // Nur einfache Klick-Funktionalität bleibt erhalten
        }
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

    if (item.type === 'folder') {
        history.pushState({ path: item.path }, '', item.path);

        try {
            const response = await fetch(`/api/content${item.path}`);
            const data = await response.json();
            
            // Remove columns AFTER successful data fetch to prevent flickering
            removeColumnsAfter(columnIndex);
            addColumn(item.name, data.items || [], item.hover_thumbnail_url, item.path);
            
            // Update clickedPath based on current columns after removal/addition
            clickedPath = columns.map(col => col.path).filter(Boolean);
        } catch (error) {
            console.error('Failed to load folder:', error);
            // Remove columns and add empty column even on error
            removeColumnsAfter(columnIndex);
            addColumn(item.name, [], item.hover_thumbnail_url, item.path);
            
            // Update clickedPath based on current columns after removal/addition
            clickedPath = columns.map(col => col.path).filter(Boolean);
        }

        updatePathIndicators();
        
        // Anwendung der dynamischen Kürzung nach dem Hinzufügen einer neuen Spalte
        setTimeout(() => {
            applyTruncation();
            updateHoverFunctionality();
        }, 50);
    } else if (item.type === 'externallink' || item.type === 'document') {
        // Externe Links und PDFs in neuem Tab öffnen
        if (item.url) {
            window.open(item.url, '_blank');
        } else if (item.path) {
            // Falls kein URL vorhanden ist, verwende den Pfad
            window.open(item.path, '_blank');
        }
    } else if (item.type === 'textfile') {
        loadTextFileContent(item.path, item.name);
    } else if (item.type === 'image') {
        // Intelligent image selection for large files
        let optimizedUrl = item.url;
        let optimizedSrcset = item.srcset;
        
        if (item.is_large_image && item.optimized_small) {
            // For large images (>5MB), start with optimized version
            const viewportWidth = window.innerWidth;
            const devicePixelRatio = window.devicePixelRatio || 1;
            const effectiveWidth = viewportWidth * devicePixelRatio;
            
            if (effectiveWidth <= 1000) {
                optimizedUrl = item.optimized_small; // 800px version for small screens
                console.log(`Loading optimized small version for large image (${(item.file_size / 1024 / 1024).toFixed(1)}MB)`);
            } else if (effectiveWidth <= 1500) {
                optimizedUrl = item.optimized_medium; // 1200px version for medium screens
                console.log(`Loading optimized medium version for large image (${(item.file_size / 1024 / 1024).toFixed(1)}MB)`);
            } else {
                optimizedUrl = item.optimized_large; // 1920px version for large screens
                console.log(`Loading optimized large version for large image (${(item.file_size / 1024 / 1024).toFixed(1)}MB)`);
            }
        }
        
        showImageOverlay(optimizedUrl, optimizedSrcset, item.path);
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
        updatePathIndicators();
        
        // Verhindere Animation beim Zurückgehen - setze alle Items in der letzten Spalte auf sichtbar
        if (columns.length > 0) {
            const lastColumn = columns[columns.length - 1].element;
            const items = lastColumn.querySelectorAll('.finder-item');
            items.forEach(item => {
                item.style.opacity = '1';
                item.style.animation = 'none';
            });
        }
    }, 300); // Should match the transition duration
}

function removeColumnsAfter(index) {
    const columnsContainer = document.getElementById('finderColumns');
    if (index === undefined || index === null) return;

    while (columnsContainer.children.length > index + 1) {
        columnsContainer.removeChild(columnsContainer.lastChild);
    }

    columns = columns.slice(0, index + 1);
    
    // Spalten-Breiten bleiben dynamisch
    
    // Reset selection to the new last column
    activeColumnIndex = columns.length - 1;
    activeItemIndex = -1;
    updateActiveSelection();

    updatePathIndicators();
}

// Dynamische Kürzung basierend auf verfügbarer Breite - NUR bei echtem Platzmangel
function truncateFilenameDynamically(element) {
    // Stelle sicher, dass der Text nicht bereits gekürzt ist
    const originalFilename = element.dataset.originalFilename || element.textContent;
    element.textContent = originalFilename; // Setze auf Original zurück für die Breitenmessung
    
    // Warte kurz auf Layout-Stabilisierung
    setTimeout(() => {
        // Messe echte Breiten
        const textWidth = element.scrollWidth;
        const containerWidth = element.clientWidth;
        
        // NUR kürzen wenn der Text WIRKLICH überläuft
        // Minimaler Puffer - nutze fast den ganzen Platz
        if (textWidth > containerWidth) {
            console.log(`Truncating: ${originalFilename} (${textWidth}px > ${containerWidth}px)`);
            const truncatedName = getTruncatedName(originalFilename, containerWidth);
            element.textContent = truncatedName;
        } else {
            // Genug Platz - kein Kürzen nötig
            element.textContent = originalFilename;
        }
    }, 10);
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
    
    // Weniger aggressive Berechnung - nutze fast den ganzen verfügbaren Platz
    const avgCharWidth = 11; // Etwas kompakter für bessere Platznutzung
    let maxLength = Math.floor(availableWidth / avgCharWidth);
    
    // Weniger Puffer - nutze mehr vom verfügbaren Platz
    maxLength = Math.max(8, maxLength); // Minimaler Sicherheitspuffer
    
    // Verfügbare Zeichen für den Namen (ohne Extension und Ellipsis)
    const availableForName = maxLength - extension.length - ellipsis.length;
    
    // NUR kürzen wenn der Name wirklich zu lang ist
    if (name.length > availableForName && availableForName >= 6) {
        // ECHTE Mitte-Kürzung: 50/50 Split
        const startLength = Math.ceil(availableForName / 2);
        const endLength = Math.floor(availableForName / 2);
        
        if (startLength >= 2 && endLength >= 2) {
            const truncatedName = `${name.substring(0, startLength)}${ellipsis}${name.substring(name.length - endLength)}${extension}`;
            console.log(`Middle truncation: "${filename}" → "${truncatedName}" (${startLength}+${endLength} chars, ${availableWidth}px available)`);
            return truncatedName;
        }
    }
    
    // Fallback: Kein Kürzen
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
        // Use optimized thumbnail for small display with proper srcset
        return `<img src="${item.thumbnail || item.url}" alt="${item.name}" class="image-thumbnail">`;
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

// Function to update only path indicators without re-rendering items
function updatePathIndicators() {
    columns.forEach((column, colIndex) => {
        const items = column.element.querySelectorAll('.finder-item.content-item');
        items.forEach((itemElement, itemIndex) => {
            const item = column.items[itemIndex];
            if (item && item.type === 'folder') {
                if (clickedPath.includes(item.path)) {
                    itemElement.classList.add('active-path');
                } else {
                    itemElement.classList.remove('active-path');
                }
            }
        });
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

function showHoverImage(imageUrl, isInset = false) {
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
    
    // Store previous inset state before changing
    const wasInset = hoverBg.classList.contains('inset');
    
    // Toggle inset class based on isInset parameter
    if (isInset) {
        hoverBg.classList.add('inset');
    } else {
        hoverBg.classList.remove('inset');
    }
    
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
        
        // If switching between different inset modes, preserve old layer's positioning
        if (wasInset !== isInset) {
            // Mark the old layer to keep its original positioning during fade-out
            activeLayer.setAttribute('data-preserve-inset', wasInset ? 'true' : 'false');
        }
        
        // Prepare the new layer
        inactiveLayer.classList.remove('fade-out');
        inactiveLayer.style.backgroundImage = `url('${imageUrl}')`;
        inactiveLayer.removeAttribute('data-preserve-inset'); // New layer uses current mode
        
        // Start cross-fade immediately
        inactiveLayer.classList.add('active');
        activeLayer.classList.remove('active');
        activeLayer.classList.add('fade-out');
        
        // Track cleanup timeout
        const cleanupTimeoutId = setTimeout(() => {
            activeLayer.classList.remove('fade-out');
            activeLayer.style.backgroundImage = '';
            activeLayer.removeAttribute('data-preserve-inset'); // Clean up after fade
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
    
    // Store the current inset state before any cleanup
    const wasInset = hoverBg.classList.contains('inset');
    
    // Clear all cleanup timeouts - we're taking control now
    pendingCleanupTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    pendingCleanupTimeouts.clear();
    
    // Fade out all active layers BUT keep inset class during fade
    for (let layer of layers) {
        if (layer.classList.contains('active')) {
            layer.classList.add('fade-out');
            layer.classList.remove('active');
        }
    }
    
    // Clean up after animation completes - but DON'T remove inset class during fade-out
    hoverTimeout = setTimeout(() => {
        // Only clean up if hover is still inactive (no new hover started)
        if (!isHoverActive) {
            for (let layer of layers) {
                layer.classList.remove('fade-out');
                layer.style.backgroundImage = '';
            }
            currentHoverImage = null;
            // ONLY remove inset class if we were inset AND all layers are truly cleaned
            if (wasInset) {
                hoverBg.classList.remove('inset');
            }
        }
        hoverTimeout = null;
    }, 550); // 50ms mehr als CSS transition (500ms) für saubere Koordination
}

// Preload all images in a folder for faster switching
function preloadFolderImages(items) {
    const imageItems = items.filter(item => item.type === 'image' && item.url);
    const hoverItems = items.filter(item => item.type === 'folder' && item.hover_thumbnail_url);
    
    // Only preload if there are actually images to preload
    if (hoverItems.length === 0 && imageItems.length === 0) {
        return; // No images to preload, exit early
    }
    
    // Priority 1: Preload hover images ONLY on desktop (not mobile/touch - they don't exist functionally)
    if (hoverItems.length > 0 && window.innerWidth > 768 && !isTouchDevice()) {
        hoverItems.forEach(item => {
            if (item.hover_thumbnail_url) {
                const hoverImg = new Image();
                hoverImg.src = item.hover_thumbnail_url;
            }
        });
    }
    
    // Priority 2: Preload overlay images with intelligent throttling
    if (imageItems.length > 0) {
        // Throttled preloading to prevent network congestion
        const preloadBatch = 3; // Start with 3 images
        const maxPreload = Math.min(10, imageItems.length);
        
        // Immediate batch
        imageItems.slice(0, preloadBatch).forEach(item => {
            const img = new Image();
            img.src = item.thumbnail || item.url; // Prefer thumbnails for faster loading
        });
        
        // Delayed batch for full resolution images
        if (imageItems.length > preloadBatch) {
            setTimeout(() => {
                imageItems.slice(preloadBatch, maxPreload).forEach((item, index) => {
                    setTimeout(() => {
                        const img = new Image();
                        img.src = item.url;
                        if (item.srcset) {
                            img.srcset = item.srcset;
                        }
                    }, index * 200); // Stagger loading by 200ms
                });
            }, 500); // Wait 500ms before starting full resolution preload
        }
    }
    
    if (imageItems.length > 0 || hoverItems.length > 0) {
        const startTime = performance.now();
        const hoverCount = (window.innerWidth > 768 && !isTouchDevice()) ? hoverItems.length : 0;
        console.log(`Smart preloading: ${hoverCount} hover images (desktop only), ${Math.min(imageItems.length, 10)} overlay images (throttled)`);
        
        // Performance monitoring for debugging  
        if (navigator.connection) {
            const connection = navigator.connection;
            console.log(`Network: ${connection.effectiveType}, Downlink: ${connection.downlink}Mbps, RTT: ${connection.rtt}ms`);
        }
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
        
        // Calculate optimal image size based on viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // Use 90% of viewport for overlay, considering device pixel ratio
        const targetWidth = Math.floor(viewportWidth * 0.9 * devicePixelRatio);
        const targetHeight = Math.floor(viewportHeight * 0.9 * devicePixelRatio);
        
        // Intelligent sizes attribute for responsive loading
        const sizes = `(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 70vw`;
        
        // Preload das neue Bild
        const newImage = new Image();
        newImage.onload = function() {
            // Erst wenn das neue Bild geladen ist, ersetzen wir das alte
            image.src = imageUrl;
            image.srcset = srcset || '';
            image.sizes = sizes;
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('active'), 10);
        };
        
        // Falls das Bild bereits im Cache ist, wird onload sofort ausgeführt
        newImage.src = imageUrl;
        if (srcset) {
            newImage.srcset = srcset;
            newImage.sizes = sizes;
        }
        
        // Log for debugging responsive loading
        if (console && console.log) {
            console.log(`Loading overlay image for ${targetWidth}x${targetHeight}px viewport (${devicePixelRatio}x DPR)`);
        }
    }
}

function hideImageOverlay() {
    const overlay = document.getElementById('imageOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            // Nicht das Element entfernen - nur ausblenden für bessere Stabilität auf Mobile
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
    // Check cache first
    if (textFileCache.has(path)) {
        console.log(`Loading text from cache: ${path}`);
        showTextOverlay(title, textFileCache.get(path), path);
        return;
    }
    
    // Show overlay immediately with loading state
    showTextOverlayWithLoading(title, path);
    
    const startTime = performance.now();
    
    try {
        const response = await fetch(`/api/textfile-content${path}`);
        const data = await response.json();
        
        const loadTime = performance.now() - startTime;
        console.log(`Text file loaded in ${loadTime.toFixed(2)}ms: ${path}`);
        
        if (data.status === 'ok' && data.content) {
            // Cache the content
            textFileCache.set(path, data.content);
            showTextOverlay(title, data.content, path);
        } else {
            showTextOverlay(title, 'Fehler beim Laden der Datei.', path);
        }
    } catch (error) {
        const loadTime = performance.now() - startTime;
        console.error(`Failed to load text file after ${loadTime.toFixed(2)}ms:`, error);
        showTextOverlay(title, 'Fehler beim Laden der Datei.', path);
    }
}

function showTextOverlayWithLoading(title, path) {
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
    
    // Show loading state immediately - ensure full height and proper centering
    textContent.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; min-height: 100%; height: 100%; text-align: center; font-size: 16px; color: #666; position: absolute; top: 0; left: 0; right: 0; bottom: 0; padding: 20px;">Loading...</div>';
    
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);
}



function hideTextOverlay() {
    const overlay = document.getElementById('textOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            // Nicht das Element entfernen - nur ausblenden für bessere Stabilität auf Mobile
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
    
    // Reset scroll position before showing (ensures it's always at top)
    if (aboutOverlay) {
        console.log('About scroll before reset:', aboutOverlay.scrollTop);
        aboutOverlay.scrollTop = 0;
        console.log('About scroll after reset:', aboutOverlay.scrollTop);
        
        // Force scroll reset with requestAnimationFrame for reliability
        requestAnimationFrame(() => {
            aboutOverlay.scrollTop = 0;
            console.log('About scroll after RAF reset:', aboutOverlay.scrollTop);
        });
    }
    
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
    
    setTimeout(() => {
        aboutOverlay.style.display = 'none';
    }, 300);
    loadBackgroundImage();
}

// Cache for about content to avoid reloading
let aboutContentCache = null;

// Cache for text file content to avoid reloading
let textFileCache = new Map();

async function loadAboutContent() {
    const aboutText = document.getElementById('aboutText');
    
    // Show simple loading text immediately - responsive sizing
    const isMobile = window.innerWidth <= 768;
    const fontSize = isMobile ? '32px' : '62px';
    const lineHeight = isMobile ? '34px' : '64px';
    aboutText.innerHTML = `<div style="text-align: center; padding: 25vh 0; font-size: ${fontSize}; line-height: ${lineHeight}; color: #FFFFFF; opacity: 0.6;">Loading...</div>`;
    
    // Use cached content if available
    if (aboutContentCache) {
        aboutText.innerHTML = aboutContentCache;
        return;
    }
    
    try {
        const response = await fetch('/api/about');
        const data = await response.json();
        
        if (data.status === 'ok') {
            let content = data.content;
            if (typeof content === 'object' && content.value) content = content.value;
            
            content = content.replace(/\(email:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="mailto:$1" style="color: #FFFFFF; text-decoration: underline; text-underline-offset: 8px;">$2</a>');
            content = content.replace(/\(link:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="$1" style="color: #FFFFFF; text-decoration: underline;" target="_blank">$2</a>');
            content = content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
            
            let finalContent = `<p>${content}</p>`;
            
            // Add credits if available
            if (data.credits && data.credits.trim() !== '') {
                let credits = data.credits;
                if (typeof credits === 'object' && credits.value) credits = credits.value;
                
                // Process Kirby link syntax in credits too
                credits = credits.replace(/\(email:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="mailto:$1" style="color: #FFFFFF; text-decoration: underline; text-underline-offset: 8px;">$2</a>');
                credits = credits.replace(/\(link:\s*([^\s]+)\s+text:\s*([^)]+)\)/gi, '<a href="$1" style="color: #FFFFFF; text-decoration: underline;" target="_blank">$2</a>');
                credits = credits.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
                finalContent += `<div class="about-credits"><p>${credits}</p></div>`;
            }
            
            // Cache the content and display it
            aboutContentCache = finalContent;
            aboutText.innerHTML = finalContent;
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

// Funktion zur Aktualisierung der Hover-Funktionalität basierend auf Bildschirmgröße
function updateHoverFunctionality() {
    const isMobile = window.innerWidth <= 768;
    const isTouch = isTouchDevice();
    const hoverItems = document.querySelectorAll('.finder-item[data-has-hover]');
    
    hoverItems.forEach(itemDiv => {
        // Entferne alle bestehenden Event-Listener
        itemDiv.onmouseenter = null;
        itemDiv.onmouseleave = null;
        
        // Entferne alle Touch-Event-Listener
        itemDiv.removeEventListener('touchstart', itemDiv._touchStartHandler);
        itemDiv.removeEventListener('touchend', itemDiv._touchEndHandler);
        itemDiv.removeEventListener('touchcancel', itemDiv._touchCancelHandler);
        itemDiv.removeEventListener('touchmove', itemDiv._touchMoveHandler);
        
        if (!isMobile && !isTouch) {
            // Nur echte Desktop-Geräte: Hover-Funktionalität aktivieren
            const item = getItemFromElement(itemDiv);
            if (item && item.hover_thumbnail_url) {
                // Verhindere Mouse-Events die durch Touch ausgelöst werden
                let lastTouchTime = 0;
                
                // Touch-Events überwachen um Mouse-Events zu blockieren
                itemDiv.addEventListener('touchstart', () => {
                    lastTouchTime = Date.now();
                }, { passive: true });
                
                itemDiv.onmouseenter = (e) => {
                    // Blockiere Mouse-Events die kurz nach Touch-Events auftreten
                    if (Date.now() - lastTouchTime < 500) {
                        return;
                    }
                    if (hideDelayTimeout) {
                        clearTimeout(hideDelayTimeout);
                        hideDelayTimeout = null;
                    }
                    showHoverImage(item.hover_thumbnail_url, item.hover_image_inset);
                };
                
                itemDiv.onmouseleave = (e) => {
                    // Blockiere Mouse-Events die kurz nach Touch-Events auftreten
                    if (Date.now() - lastTouchTime < 500) {
                        return;
                    }
                    isHoverActive = false;
                    hideDelayTimeout = setTimeout(() => {
                        if (hideDelayTimeout && !isHoverActive) {
                            hideHoverImage();
                        }
                        hideDelayTimeout = null;
                    }, 50);
                };
            }
        }
        // Auf Mobile: Keine Hover-Funktionalität
    });
}

// Helper-Funktion um Item-Daten aus einem DOM-Element zu extrahieren
function getItemFromElement(element) {
    // Versuche das Item aus den Spalten-Daten zu finden
    for (let column of columns) {
        // Suche nur nach content-item (ohne Back-Button)
        const contentItems = Array.from(column.element.querySelectorAll('.finder-item.content-item'));
        const itemIndex = contentItems.indexOf(element);
        if (itemIndex !== -1 && column.items[itemIndex]) {
            return column.items[itemIndex];
        }
    }
    return null;
}

// Spalten wachsen dynamisch mit ihrem Inhalt (wie ursprünglich)

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