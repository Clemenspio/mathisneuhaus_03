<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page->title() ?> - Finder</title>
    <link rel="preload" href="<?= url('assets/icons/Contact.svg') ?>" as="image" type="image/svg+xml">
    <link rel="stylesheet" href="<?= url('assets/css/main.css') ?>">
</head>
<body>
    <!-- Background Image -->
    <div class="background-image" id="backgroundImage"></div>
    
    <!-- About Overlay -->
    <div class="about-overlay" id="aboutOverlay" style="display: none;">
        <div class="about-text" id="aboutText">
            <div class="loading">
                <div class="spinner"></div>
                Loading about information...
            </div>
        </div>
    </div>
    
    <!-- Finder Interface -->
    <div class="finder-interface">
        <div class="finder-container" id="finderContainer">
            <!-- Hover Background within Container -->
            <div class="finder-hover-bg" id="finderHoverBg"></div>
            
            <!-- Image Overlay -->
            <div class="image-overlay" id="imageOverlay" onclick="hideImageOverlay()" style="display: none;">
                <div class="image-container" onclick="event.stopPropagation()">
                    <img id="overlayImage" src="" alt="">
                </div>
            </div>

            <!-- Text File Overlay -->
            <div class="text-overlay" id="textOverlay" onclick="hideTextOverlay()" style="display: none;">
                <div class="text-container" onclick="event.stopPropagation()">
                    <!-- Close Button -->
                    <button class="text-close-btn" onclick="hideTextOverlay()" title="Schließen">&times;</button>
                    
                    <!-- Scrollbarer Inhalt -->
                    <div class="text-content" id="textContent">
                        <div class="text-loading">
                            <div class="text-spinner"></div>
                            Text wird geladen...
                        </div>
                    </div>
                </div>
            </div>
        <div class="finder-header">
            <h1 class="finder-title"><?= $page->title() ?></h1>
            <?php if ($page->description()->isNotEmpty()): ?>
                <p><?= $page->description() ?></p>
            <?php endif; ?>
            
            <!-- Breadcrumb Navigation -->
            <div class="breadcrumb">
                <a href="<?= $site->url() ?>" class="breadcrumb-item">🏠 Start</a>
                <?php 
                $parents = $page->parents();
                foreach ($parents as $parent): ?>
                    <span class="breadcrumb-separator">/</span>
                    <a href="<?= $parent->url() ?>" class="breadcrumb-item"><?= $parent->title() ?></a>
                <?php endforeach; ?>
                <span class="breadcrumb-separator">/</span>
                <a href="<?= $page->url() ?>" class="breadcrumb-item breadcrumb-current"><?= $page->title() ?></a>
            </div>
        </div>
        
        <div class="finder-content">
            <!-- Aktueller Pfad anzeigen -->
            <div class="path-section">
                <h3 class="path-title">Aktueller Pfad:</h3>
                <div class="finder-grid path-grid">
                    <!-- Start/Home -->
                    <a href="<?= $site->url() ?>" class="finder-item active-path">
                        <span class="finder-item-icon">🏠</span>
                        <div class="finder-item-title">Start</div>
                        <div class="finder-item-type">Home</div>
                    </a>
                    
                    <!-- Eltern-Ordner im Pfad -->
                    <?php 
                    $parents = $page->parents();
                    foreach ($parents as $parent): ?>
                        <a href="<?= $parent->url() ?>" class="finder-item active-path">
                            <span class="finder-item-icon">📁</span>
                            <div class="finder-item-title"><?= $parent->title() ?></div>
                            <div class="finder-item-type">Ordner</div>
                        </a>
                    <?php endforeach; ?>
                    
                    <!-- Aktuelle Seite -->
                    <a href="<?= $page->url() ?>" class="finder-item active-path">
                        <span class="finder-item-icon">📁</span>
                        <div class="finder-item-title"><?= $page->title() ?></div>
                        <div class="finder-item-type">Aktueller Ordner</div>
                    </a>
                </div>
            </div>
            
            <!-- Inhalt des aktuellen Ordners -->
            <div class="content-section">
                <h3 class="content-title">Inhalt:</h3>
                <?php 
                // Funktion für Dateinamen-Kürzung mit Ellipsis in der Mitte
                function truncateFilename($filename, $maxLength = 33) {
                    if (strlen($filename) <= $maxLength) {
                        return $filename;
                    }
                    
                    // Letzten Punkt finden um Name von Extension zu trennen
                    $lastDotPos = strrpos($filename, '.');
                    
                    if ($lastDotPos === false || $lastDotPos === 0) {
                        // Keine Extension, in der Mitte kürzen
                        return truncateInMiddle($filename, $maxLength);
                    }
                    
                    $extension = substr($filename, $lastDotPos);
                    $nameOnly = substr($filename, 0, $lastDotPos);
                    
                    // Verfügbaren Platz für Namen berechnen (total - extension)
                    $availableSpace = $maxLength - strlen($extension);
                    
                    if ($availableSpace <= 3) {
                        // Nicht genug Platz, nur Anfang und Extension zeigen
                        return substr($filename, 0, max(1, $maxLength - strlen($extension) - 1)) . '…' . $extension;
                    }
                    
                    // Namen in der Mitte kürzen
                    $truncatedName = truncateInMiddle($nameOnly, $availableSpace);
                    return $truncatedName . $extension;
                }
                
                // Hilfsfunktion für Kürzung in der Mitte
                function truncateInMiddle($text, $maxLength) {
                    if (strlen($text) <= $maxLength) {
                        return $text;
                    }
                    
                    // Berechnen wie viel vom Anfang und Ende zu zeigen ist
                    $ellipsisLength = 1; // Länge von '…'
                    $availableLength = $maxLength - $ellipsisLength;
                    $startLength = ceil($availableLength / 2);
                    $endLength = floor($availableLength / 2);
                    
                    $start = substr($text, 0, $startLength);
                    $end = substr($text, -$endLength);
                    
                    return $start . '…' . $end;
                }
                
                $children = $page->children();
                $files = $page->files();
                
                if ($children->count() > 0 || $files->count() > 0): ?>
                    <div class="finder-grid">
                    <!-- Ordner anzeigen -->
                    <?php foreach ($children as $child): ?>
                        <?php 
                        $hoverImageUrl = '';
                        if ($child->hover_image()->isNotEmpty()) {
                            $hoverImageUrl = $child->hover_image()->toFile()->url();
                        }
                        ?>
                        <a href="<?= $child->url() ?>" class="finder-item" 
                           <?php if ($hoverImageUrl): ?>data-hover-image="<?= $hoverImageUrl ?>"<?php endif; ?>>
                            <?php 
                            $icon = '📁';
                            if ($child->intendedTemplate() === 'folder' && $child->icon()->isNotEmpty()) {
                                $iconMap = [
                                    'folder' => '📁',
                                    'documents' => '📄',
                                    'images' => '🖼️',
                                    'music' => '🎵',
                                    'videos' => '🎬',
                                    'downloads' => '⬇️',
                                    'applications' => '🖥️'
                                ];
                                $icon = $iconMap[$child->icon()->value()] ?? '📁';
                            } elseif ($child->intendedTemplate() === 'document') {
                                $icon = '📄';
                            } elseif ($child->intendedTemplate() === 'image') {
                                $icon = '🖼️';
                            } elseif ($child->intendedTemplate() === 'link') {
                                $icon = '🔗';
                            }
                            ?>
                            <span class="finder-item-icon"><?= $icon ?></span>
                            <div class="finder-item-title"><?= $child->title() ?></div>
                            <div class="finder-item-type">
                                <?php 
                                $typeMap = [
                                    'folder' => 'Ordner',
                                    'document' => 'Dokument',
                                    'image' => 'Bild',
                                    'link' => 'Link'
                                ];
                                echo $typeMap[$child->intendedTemplate()] ?? 'Seite';
                                ?>
                            </div>
                            <?php if ($child->description()->isNotEmpty()): ?>
                                <div class="finder-item-description"><?= $child->description() ?></div>
                            <?php endif; ?>
                        </a>
                    <?php endforeach; ?>
                    
                    <!-- Dateien anzeigen -->
                    <?php foreach ($files as $file): ?>
                        <?php 
                        $fileType = 'file';
                        $dataAttributes = '';
                        
                        if ($file->type() === 'image') {
                            $fileType = 'image';
                            $dataAttributes = 'data-type="image" data-image-url="' . $file->url() . '"';
                        } elseif ($file->extension() === 'txt' || $file->extension() === 'md') {
                            $fileType = 'textfile';
                            $dataAttributes = 'data-type="textfile" data-path="' . $file->url() . '"';
                        }
                        ?>
                        <a href="<?= $file->url() ?>" class="finder-item" 
                           <?php if ($fileType !== 'file'): ?>target="_blank"<?php endif; ?>
                           <?= $dataAttributes ?>>
                            <?php 
                            $icon = '📎';
                            $extension = $file->extension();
                            $iconMap = [
                                'pdf' => '📋',
                                'doc' => '📝',
                                'docx' => '📝',
                                'xls' => '📊',
                                'xlsx' => '📊',
                                'ppt' => '📽️',
                                'pptx' => '📽️',
                                'jpg' => '🖼️',
                                'jpeg' => '🖼️',
                                'png' => '🖼️',
                                'gif' => '🖼️',
                                'mp4' => '🎬',
                                'mov' => '🎬',
                                'mp3' => '🎵',
                                'wav' => '🎵',
                                'zip' => '📦',
                                'txt' => '📄'
                            ];
                            $icon = $iconMap[$extension] ?? '📎';
                            ?>
                            <span class="finder-item-icon"><?= $icon ?></span>
                            <div class="finder-item-title" title="<?= $file->name() ?>"><?= truncateFilename($file->name()) ?></div>
                            <div class="finder-item-type"><?= strtoupper($extension) ?> Datei</div>
                            <div class="finder-item-description"><?= $file->niceSize() ?></div>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="empty-state">
                    <div class="empty-state-icon">📁</div>
                    <h3>Dieser Ordner ist leer</h3>
                    <p>Fügen Sie Ordner oder Dateien hinzu, um zu beginnen.</p>
                </div>
            <?php endif; ?>
            </div>
        </div>
    </div>
    
    <script>
        // Load random background image
        async function loadBackgroundImage() {
            try {
                const response = await fetch('/api/desktop-images');
                const data = await response.json();
                
                if (data.status === 'ok' && data.images && data.images.length > 0) {
                    // Select random image
                    const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
                    const backgroundImage = document.getElementById('backgroundImage');
                    backgroundImage.style.backgroundImage = `url('${randomImage.url}')`;
                }
            } catch (error) {
                console.error('Failed to load background image:', error);
            }
        }

        // Show hover image
        function showHoverImage(imageUrl) {
            const hoverBg = document.getElementById('finderHoverBg');
            hoverBg.style.backgroundImage = `url('${imageUrl}')`;
            hoverBg.classList.add('active');
        }
        
        // Hide hover image
        function hideHoverImage() {
            const hoverBg = document.getElementById('finderHoverBg');
            hoverBg.classList.remove('active');
        }

        // Show image overlay
        function showImageOverlay(imageUrl) {
            console.log('showImageOverlay called with:', imageUrl);
            const overlay = document.getElementById('imageOverlay');
            const image = document.getElementById('overlayImage');
            
            if (overlay && image) {
                image.src = imageUrl;
                overlay.style.display = 'flex';
                
                setTimeout(() => {
                    overlay.classList.add('active');
                }, 10);
            }
        }

        // Hide image overlay
        function hideImageOverlay() {
            const overlay = document.getElementById('imageOverlay');
            if (overlay) {
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            }
        }

        // Show text overlay
        function showTextOverlay(title, content, path) {
            console.log('showTextOverlay called with:', title, path);
            const overlay = document.getElementById('textOverlay');
            const textContent = document.getElementById('textContent');
            
            if (!overlay || !textContent) {
                console.error('Text overlay elements not found');
                return;
            }
            
            // Show loading state
            textContent.innerHTML = `
                <div class="text-loading">
                    <div class="text-spinner"></div>
                    Dokument wird geladen...
                </div>
            `;
            
            // Show overlay
            overlay.style.display = 'flex';
            
            // Trigger fade in
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
            
            // Load and display content
            setTimeout(() => {
                displayTextContent(content);
            }, 300);
            
            console.log('Text overlay should be visible now');
        }

        // Display text content with proper formatting
        function displayTextContent(content) {
            const textContent = document.getElementById('textContent');
            
            if (!textContent) {
                console.error('Text content element not found');
                return;
            }
            
            let textContentString = '';
            
            // Handle different content types
            if (typeof content === 'object' && content !== null) {
                // Kirby content object
                if (content.value !== null && content.value !== undefined) {
                    textContentString = content.value;
                } else if (content.content) {
                    textContentString = content.content;
                } else {
                    textContentString = JSON.stringify(content, null, 2);
                }
            } else if (typeof content === 'string') {
                textContentString = content;
            } else {
                textContentString = 'Inhalt konnte nicht geladen werden.';
            }
            
            console.log('Processing text content:', textContentString);
            
            // Format text content with better paragraph and heading handling
            if (textContentString && textContentString.trim() !== '') {
                // Split into paragraphs and format
                const paragraphs = textContentString
                    .replace(/\r\n/g, '\n')
                    .replace(/\r/g, '\n')
                    .split(/\n\n+/)
                    .filter(p => p.trim() !== '');
                
                if (paragraphs.length > 0) {
                    const formattedText = paragraphs
                        .map((p, index) => {
                            const trimmedP = p.trim();
                            
                            // First paragraph becomes H1 title
                            if (index === 0) {
                                return `<h1>${trimmedP.replace(/\n/g, '<br>')}</h1>`;
                            }
                            
                            // Check if paragraph starts with # for other headings
                            if (trimmedP.startsWith('# ')) {
                                return `<h1>${trimmedP.substring(2).replace(/\n/g, '<br>')}</h1>`;
                            } else if (trimmedP.startsWith('## ')) {
                                return `<h2>${trimmedP.substring(3).replace(/\n/g, '<br>')}</h2>`;
                            } else if (trimmedP.startsWith('### ')) {
                                return `<h3>${trimmedP.substring(4).replace(/\n/g, '<br>')}</h3>`;
                            } else {
                                return `<p>${p.replace(/\n/g, '<br>')}</p>`;
                            }
                        })
                        .join('');
                    textContent.innerHTML = formattedText;
                } else {
                    // Single paragraph becomes H1
                    const formattedText = textContentString
                        .replace(/\n/g, '<br>');
                    textContent.innerHTML = `<h1>${formattedText}</h1>`;
                }
            } else {
                textContent.innerHTML = '<div class="text-error">Kein Inhalt verfügbar oder Inhalt konnte nicht geladen werden.</div>';
            }
        }

        // Load text file content from server
        async function loadTextFileContent(path, title) {
            console.log('Loading text file:', path, title);
            
            try {
                const response = await fetch(`/api/textfile-content${path}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.status === 'ok' && data.content) {
                    showTextOverlay(title, data.content, path);
                } else {
                    console.error('Failed to load text file content:', data);
                    showTextOverlay(title, 'Fehler beim Laden der Datei.', path);
                }
            } catch (error) {
                console.error('Failed to load text file content:', error);
                showTextOverlay(title, 'Fehler beim Laden der Datei.', path);
            }
        }

        // Hide text overlay
        function hideTextOverlay() {
            const overlay = document.getElementById('textOverlay');
            if (overlay) {
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            }
        }

        // Toggle about page function
        function toggleAboutPage() {
            const finderContainer = document.getElementById('finderContainer');
            
            if (finderContainer.classList.contains('slide-down')) {
                // In slide-down state, hide about page
                console.log('Toggle: hiding about page');
                hideAboutPage();
            } else {
                // In normal state, show about page
                console.log('Toggle: showing about page');
                showAboutPage();
            }
            
            // Stop event propagation to prevent double handling
            event.stopPropagation();
        }

        // Show about overlay
        function showAboutPage() {
            const finderContainer = document.getElementById('finderContainer');
            const aboutOverlay = document.getElementById('aboutOverlay');
            const aboutText = document.getElementById('aboutText');
            
            // Slide finder down with normal animation
            finderContainer.classList.add('slide-down');
            
            // Show about overlay
            aboutOverlay.style.display = 'flex';
            
            // Load about content
            loadAboutContent();
            
            // Fade in about text
            setTimeout(() => {
                aboutOverlay.classList.add('active');
                aboutText.classList.add('fade-in');
            }, 300);
        }

        // Hide about overlay
        function hideAboutPage() {
            const finderContainer = document.getElementById('finderContainer');
            const aboutOverlay = document.getElementById('aboutOverlay');
            const aboutText = document.getElementById('aboutText');
            
            // Fade out about text
            aboutText.classList.remove('fade-in');
            aboutOverlay.classList.remove('active');
            
            // Slide finder back up
            finderContainer.classList.remove('slide-down');
            
            // Hide about overlay after animation
            setTimeout(() => {
                aboutOverlay.style.display = 'none';
            }, 300);
        }

        // Load about content
        async function loadAboutContent() {
            const aboutText = document.getElementById('aboutText');
            
            try {
                const response = await fetch('/api/about');
                const data = await response.json();
                
                if (data.status === 'ok') {
                    aboutText.innerHTML = data.content;
                } else {
                    aboutText.innerHTML = 'About information not available';
                }
            } catch (error) {
                console.error('Failed to load about:', error);
                aboutText.innerHTML = 'About information not available';
            }
        }

        // Initialize the finder
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Initializing finder...');
            
            // Mobile transparency bug fix: Only apply on mobile devices
            if (window.innerWidth <= 768) {
                const initializeInterfaceWhenReady = () => {
                    const finderInterface = document.querySelector('.finder-interface');
                    const finderContainer = finderInterface?.querySelector('.finder-container');
                    
                    if (finderContainer) {
                        // Force browser to recalculate styles
                        finderContainer.offsetHeight;
                        
                        // Check if background styles are applied
                        const styles = window.getComputedStyle(finderContainer);
                        const bgColor = styles.backgroundColor;
                        
                        // Only show background if interface styles are ready
                        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                            // Interface is ready - now load and show background
                            loadBackgroundImage();
                            
                            // Show background after short delay to ensure image is loaded
                            setTimeout(() => {
                                const backgroundImages = document.querySelectorAll('.background-image');
                                console.log('Mobile: Adding interface-ready class to', backgroundImages.length, 'background images');
                                backgroundImages.forEach(bg => {
                                    bg.classList.add('interface-ready');
                                    console.log('Added interface-ready to:', bg.id);
                                });
                            }, 200); // Slightly longer delay for mobile
                        } else {
                            // Retry in 50ms if styles aren't ready
                            setTimeout(initializeInterfaceWhenReady, 50);
                            return;
                        }
                    } else {
                        // Fallback: show background after maximum wait
                        setTimeout(() => {
                            console.log('Mobile: Fallback - loading background');
                            loadBackgroundImage();
                            const backgroundImages = document.querySelectorAll('.background-image');
                            console.log('Mobile: Fallback - adding interface-ready to', backgroundImages.length, 'images');
                            backgroundImages.forEach(bg => bg.classList.add('interface-ready'));
                        }, 500);
                    }
                };
                
                // Start mobile initialization
                initializeInterfaceWhenReady();
            } else {
                // Desktop: Normal initialization (unchanged)
                loadBackgroundImage();
            }
            
            // Add hover events for folders with thumbnails
            document.querySelectorAll('.finder-item').forEach(item => {
                const hoverImageUrl = item.getAttribute('data-hover-image');
                if (hoverImageUrl) {
                    item.addEventListener('mouseenter', function() {
                        showHoverImage(hoverImageUrl);
                    });
                    item.addEventListener('mouseleave', function() {
                        hideHoverImage();
                    });
                }
            });
            
            // Add click events for text files
            document.querySelectorAll('.finder-item[data-type="textfile"]').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const path = this.getAttribute('data-path');
                    const title = this.querySelector('.finder-item-title').textContent;
                    loadTextFileContent(path, title);
                });
            });
            
            // Add click events for images
            document.querySelectorAll('.finder-item[data-type="image"]').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const imageUrl = this.getAttribute('data-image-url');
                    showImageOverlay(imageUrl);
                });
            });
        });
    </script>
</body>
</html> 