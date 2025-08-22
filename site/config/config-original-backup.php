<?php

// Funktion zum rekursiven Suchen von Hover-Bildern in Unterordnern
function findInheritedHoverImage($page) {
    $availableImages = [];
    foreach ($page->children() as $child) {
        if ($child->intendedTemplate() == 'folder') {
            if ($child->hover_image()->isNotEmpty() && $child->hover_image()->toFile()) {
                $availableImages[] = $child->hover_image()->toFile();
            }
            // Rekursiv in Unterordner suchen
            $subImages = findInheritedHoverImage($child);
            if (is_array($subImages)) {
                $availableImages = array_merge($availableImages, $subImages);
            }
        }
    }
    if (!empty($availableImages)) {
        return $availableImages[array_rand($availableImages)];
    }
    return [];
}

return [
    'debug' => true,
    
    'api' => [
        'basicAuth' => false,
        'allowInsecure' => false,
        'routes' => [
            [
                'pattern' => 'content',
                'method' => 'GET',
                'auth' => false,
                'action' => function () {
                    $site = site();
                    $items = [];
                    
                    // Get all folders
                    foreach ($site->children() as $child) {
                        // Skip hidden folders (starting with _)
                        if (substr($child->slug(), 0, 1) === '_') {
                            continue;
                        }
                        
                        if ($child->intendedTemplate() == 'folder') {
                            $item = [
                                'name' => $child->title()->value(),
                                'type' => 'folder',
                                'path' => '/' . $child->slug(),
                                'icon' => 'folder-icon',
                                'item_count' => $child->children()->count() + $child->files()->count()
                            ];
                            
                            // KORRIGIERT: hover_image statt hover_background_images
                            if ($child->hover_image()->isNotEmpty() && $child->hover_image()->toFile()) {
                                $item['hover_thumbnail_url'] = $child->hover_image()->toFile()->url();
                            } elseif ($child->content()->has('inherit_hover_image') && $child->inherit_hover_image()->bool()) {
                                $inheritedImage = findInheritedHoverImage($child);
                                if ($inheritedImage) {
                                    $item['hover_thumbnail_url'] = $inheritedImage->url();
                                }
                            }
                            
                            $items[] = $item;
                        } elseif ($child->intendedTemplate() == 'textfile') {
                            $items[] = [
                                'name' => $child->title()->value(),
                                'type' => 'textfile',
                                'path' => '/' . $child->id(),
                                'icon' => 'text-file-icon',
                                'content' => $child->content()->value()
                            ];
                        } elseif ($child->intendedTemplate() == 'externallink') {
                            $items[] = [
                                'name' => $child->title()->value(),
                                'type' => 'externallink',
                                'path' => '/' . $child->id(),
                                'icon' => 'link-icon',
                                'url' => $child->link_url()->value(),
                                'external' => true
                            ];
                        }
                    }
                    
                    // Add media files from root - FILTERED!
                    foreach ($site->files() as $file) {
                        // Skip files that are in the desktop-images folder
                        if ($file->parent()->slug() === '_desktop-images') {
                            continue;
                        }
                        
                        // Template-Check für hover-background-image
                        if ($file->template() === 'hover-background-image') {
                            continue;
                        }
                        
                        // KORRIGIERT: Check mit hover_image
                        $isHoverImage = false;
                        foreach ($site->children() as $child) {
                            if ($child->intendedTemplate() == 'folder' && $child->hover_image()->isNotEmpty()) {
                                $hoverFile = $child->hover_image()->toFile();
                                if ($hoverFile && $hoverFile->id() === $file->id()) {
                                    $isHoverImage = true;
                                    break;
                                }
                            }
                        }
                        
                        if ($isHoverImage) {
                            continue;
                        }
                        
                        $fileItem = [
                            'name' => $file->filename(),
                            'type' => $file->type(),
                            'path' => '/' . $file->filename(),
                            'url' => $file->url(),
                            'size' => $file->niceSize()
                        ];
                        
                        if ($file->type() == 'image') {
                            $fileItem['srcset'] = $file->srcset('default');
                            $fileItem['thumbnail'] = $file->resize(300)->url();
                            $fileItem['dimensions'] = $file->width() . 'x' . $file->height();
                        }
                        
                        $fileItem['icon'] = match($file->type()) {
                            'image' => 'image-icon',
                            'document' => 'pdf-icon',
                            'audio' => 'audio-icon',
                            'video' => 'video-icon',
                            default => 'file-icon'
                        };
                        
                        $items[] = $fileItem;
                    }
                    
                    return [
                        'status' => 'ok',
                        'path' => '/',
                        'items' => $items
                    ];
                }
            ],
            
            [
                'pattern' => 'content/(:all)',
                'method' => 'GET',
                'auth' => false,
                'action' => function ($path) {
                    $currentPage = page($path);
                    
                    if (!$currentPage) {
                        return [
                            'status' => 'error',
                            'message' => 'Path not found'
                        ];
                    }
                    
                    $items = [];
                    
                    foreach ($currentPage->children() as $child) {
                        // Skip hidden folders
                        if (str_starts_with($child->slug(), '_')) {
                            continue;
                        }
                        
                        if ($child->intendedTemplate() == 'folder') {
                            $item = [
                                'name' => $child->title()->value(),
                                'type' => 'folder',
                                'path' => '/' . $child->id(),
                                'icon' => 'folder-icon',
                                'item_count' => $child->children()->count() + $child->files()->count()
                            ];
                            
                            // KORRIGIERT: hover_image statt hover_background_images
                            if ($child->hover_image()->isNotEmpty() && $child->hover_image()->toFile()) {
                                $item['hover_thumbnail_url'] = $child->hover_image()->toFile()->url();
                            } elseif ($child->content()->has('inherit_hover_image') && $child->inherit_hover_image()->bool()) {
                                $inheritedImage = findInheritedHoverImage($child);
                                if ($inheritedImage) {
                                    $item['hover_thumbnail_url'] = $inheritedImage->url();
                                }
                            }
                            
                            $items[] = $item;
                        } elseif ($child->intendedTemplate() == 'textfile') {
                            $items[] = [
                                'name' => $child->title()->value(),
                                'type' => 'textfile',
                                'path' => '/' . $child->id(),
                                'icon' => 'text-file-icon',
                                'content' => $child->content()->value()
                            ];
                        } elseif ($child->intendedTemplate() == 'externallink') {
                            $items[] = [
                                'name' => $child->title()->value(),
                                'type' => 'externallink',
                                'path' => '/' . $child->id(),
                                'icon' => 'link-icon',
                                'url' => $child->link_url()->value(),
                                'external' => true
                            ];
                        }
                    }
                    
                    // Add media files - FILTERED!
                    foreach ($currentPage->files() as $file) {
                        // Skip files that are in the desktop-images folder
                        if ($file->parent()->slug() === '_desktop-images') {
                            continue;
                        }
                        
                        // Template-Check für hover-background-image
                        if ($file->template() === 'hover-background-image') {
                            continue;
                        }
                        
                        // KORRIGIERT: Check mit hover_image
                        $isHoverImage = false;
                        
                        // Check if file is used as hover image in current page
                        if ($currentPage->hover_image()->isNotEmpty()) {
                            $hoverFile = $currentPage->hover_image()->toFile();
                            if ($hoverFile && $hoverFile->id() === $file->id()) {
                                $isHoverImage = true;
                            }
                        }
                        
                        // Also check children of current page
                        if (!$isHoverImage) {
                            foreach ($currentPage->children() as $child) {
                                if ($child->intendedTemplate() == 'folder' && $child->hover_image()->isNotEmpty()) {
                                    $hoverFile = $child->hover_image()->toFile();
                                    if ($hoverFile && $hoverFile->id() === $file->id()) {
                                        $isHoverImage = true;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        if ($isHoverImage) {
                            continue;
                        }
                        
                        $fileItem = [
                            'name' => $file->filename(),
                            'type' => $file->type(),
                            'path' => '/' . $currentPage->id() . '/' . $file->filename(),
                            'url' => $file->url(),
                            'size' => $file->niceSize()
                        ];
                        
                        if ($file->type() == 'image') {
                            $fileItem['srcset'] = $file->srcset('default');
                            $fileItem['thumbnail'] = $file->resize(300)->url();
                            $fileItem['dimensions'] = $file->width() . 'x' . $file->height();
                        }
                        
                        $fileItem['icon'] = match($file->type()) {
                            'image' => 'image-icon',
                            'document' => 'pdf-icon',
                            'audio' => 'audio-icon',
                            'video' => 'video-icon',
                            default => 'file-icon'
                        };
                        
                        $items[] = $fileItem;
                    }
                    
                    return [
                        'status' => 'ok',
                        'path' => '/' . $path,
                        'items' => $items
                    ];
                }
            ],
            
            [
                'pattern' => 'about',
                'method' => 'GET',
                'auth' => false,
                'action' => function () {
                    $about = page('about');
                    
                    if (!$about) {
                        return [
                            'status' => 'error',
                            'message' => 'About page not found'
                        ];
                    }
                    
                    return [
                        'status' => 'ok',
                        'title' => $about->title()->value(),
                        'content' => $about->about_text()->value()
                    ];
                }
            ],
            
            [
                'pattern' => 'desktop-images',
                'method' => 'GET',
                'auth' => false,
                'action' => function () {
                    $images = [];
                    
                    // Versuche alle möglichen Wege
                    $desktopPage = site()->find('_desktop-images');
                    
                    if (!$desktopPage) {
                        $desktopPage = site()->drafts()->find('_desktop-images');
                    }
                    
                    if (!$desktopPage) {
                        $desktopPage = site()->children()->find('_desktop-images');
                    }
                    
                    if (!$desktopPage) {
                        // Versuche ohne Unterstrich
                        $desktopPage = site()->find('desktop-images');
                    }
                    
                    if (!$desktopPage) {
                        $desktopPage = site()->drafts()->find('desktop-images');
                    }
                    
                    if ($desktopPage) {
                        foreach ($desktopPage->files() as $file) {
                            if ($file->type() == 'image') {
                                $images[] = [
                                    'url' => $file->url(),
                                    'srcset' => $file->srcset('default'),
                                    'filename' => $file->filename(),
                                    'size' => $file->niceSize()
                                ];
                            }
                        }
                    }
                    
                    return [
                        'status' => 'ok',
                        'message' => 'Found ' . count($images) . ' images',
                        'images' => $images
                    ];
                }
            ],
            
            [
                'pattern' => 'textfile-content/(:all)',
                'method' => 'GET',
                'auth' => false,
                'action' => function ($path) {
                    $textfile = page($path);
                    
                    if (!$textfile) {
                        return [
                            'status' => 'error',
                            'message' => 'Textfile not found'
                        ];
                    }
                    

                    
                    // Get content from the content field
                    $content = $textfile->content()->get('content')->value();
                    
                    // If that doesn't work, try the direct content
                    if (empty($content)) {
                        $content = $textfile->content()->value();
                    }
                    
                    return [
                        'status' => 'ok',
                        'content' => $content,
                        'title' => $textfile->title()->value(),

                    ];
                }
            ]
        ]
    ],
    
    'thumbs' => [
        'srcsets' => [
            'default' => [
                '320w'  => ['width' => 320, 'quality' => 80],
                '480w'  => ['width' => 480, 'quality' => 80],
                '640w'  => ['width' => 640, 'quality' => 80],
                '768w'  => ['width' => 768, 'quality' => 80],
                '1024w' => ['width' => 1024, 'quality' => 80],
                '1280w' => ['width' => 1280, 'quality' => 80],
                '1536w' => ['width' => 1536, 'quality' => 80],
                '1920w' => ['width' => 1920, 'quality' => 80],
                '2560w' => ['width' => 2560, 'quality' => 80]
            ]
        ]
    ]
];