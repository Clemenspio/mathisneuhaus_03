<?php

/**
 * API Routes für Mathis Neuhaus Portfolio
 * Alternative zu den config.php API-Routes
 */

return [
    [
        'pattern' => 'api/test',
        'method' => 'GET',
        'action' => function () {
            return [
                'status' => 'ok',
                'message' => 'API is working',
                'environment' => 'production'
            ];
        }
    ],
    
    [
        'pattern' => 'api/content',
        'method' => 'GET',
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
                    
                    if ($child->hover_image()->isNotEmpty() && $child->hover_image()->toFile()) {
                        $hoverFile = $child->hover_image()->toFile();
                        $item['hover_thumbnail_url'] = $hoverFile->url();
                        $item['hover_srcset'] = $hoverFile->srcset('default');
                        $item['hover_image_inset'] = $child->content()->has('hover_image_inset') ? $child->hover_image_inset()->bool() : false;
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
                if ($file->parent()->slug() === '_desktop-images') {
                    continue;
                }
                
                if ($file->template() === 'hover-background-image') {
                    continue;
                }
                
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
                    $fileItem['thumbnail'] = $file->resize(80)->url();
                    $fileItem['dimensions'] = $file->width() . 'x' . $file->height();
                    
                    $fileSize = $file->size();
                    $fileItem['file_size'] = $fileSize;
                    $fileItem['is_large_image'] = $fileSize > 5000000;
                    
                    if ($fileItem['is_large_image']) {
                        $fileItem['optimized_small'] = $file->resize(800)->url();
                        $fileItem['optimized_medium'] = $file->resize(1200)->url();
                        $fileItem['optimized_large'] = $file->resize(1920)->url();
                    }
                }
                
                $fileType = $file->type();
                if ($fileType === 'image') {
                    $fileItem['icon'] = 'image-icon';
                } elseif ($fileType === 'document') {
                    $fileItem['icon'] = 'pdf-icon';
                } elseif ($fileType === 'audio') {
                    $fileItem['icon'] = 'audio-icon';
                } elseif ($fileType === 'video') {
                    $fileItem['icon'] = 'video-icon';
                } else {
                    $fileItem['icon'] = 'file-icon';
                }
                
                $items[] = $fileItem;
            }
            
            usort($items, function($a, $b) {
                if ($a['type'] === 'textfile' && $b['type'] !== 'textfile') {
                    return -1;
                }
                if ($b['type'] === 'textfile' && $a['type'] !== 'textfile') {
                    return 1;
                }
                return strcasecmp($a['name'], $b['name']);
            });
            
            return [
                'status' => 'ok',
                'path' => '/',
                'items' => $items
            ];
        }
    ],
    
    [
        'pattern' => 'api/desktop-images',
        'method' => 'GET',
        'action' => function () {
            $images = [];
            
            $desktopPage = site()->find('_desktop-images');
            
            if (!$desktopPage) {
                $desktopPage = site()->drafts()->find('_desktop-images');
            }
            
            if (!$desktopPage) {
                $desktopPage = site()->children()->find('_desktop-images');
            }
            
            if (!$desktopPage) {
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
        'pattern' => 'api/content/(:all)',
        'method' => 'GET',
        'action' => function ($path) {
            try {
                $currentPage = page($path);
                
                if (!$currentPage) {
                    $currentPage = site()->find($path);
                }
                
                if (!$currentPage) {
                    foreach (site()->children()->listed() as $child) {
                        if ($child->slug() === $path) {
                            $currentPage = $child;
                            break;
                        }
                    }
                }
                
                if (!$currentPage) {
                    return [
                        'status' => 'error',
                        'message' => 'Page not found: ' . $path
                    ];
                }
            } catch (Throwable $e) {
                return [
                    'status' => 'error', 
                    'message' => 'Error: ' . $e->getMessage()
                ];
            }
            
            $items = [];
            
            foreach ($currentPage->children() as $child) {
                if (substr($child->slug(), 0, 1) === '_') {
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
                    
                    if ($child->hover_image()->isNotEmpty() && $child->hover_image()->toFile()) {
                        $hoverFile = $child->hover_image()->toFile();
                        $item['hover_thumbnail_url'] = $hoverFile->url();
                        $item['hover_srcset'] = $hoverFile->srcset('default');
                        $item['hover_image_inset'] = $child->content()->has('hover_image_inset') ? $child->hover_image_inset()->bool() : false;
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
            
            foreach ($currentPage->files() as $file) {
                if ($file->parent()->slug() === '_desktop-images') {
                    continue;
                }
                
                if ($file->template() === 'hover-background-image') {
                    continue;
                }
                
                $isHoverImage = false;
                
                if ($currentPage->hover_image()->isNotEmpty()) {
                    $hoverFile = $currentPage->hover_image()->toFile();
                    if ($hoverFile && $hoverFile->id() === $file->id()) {
                        $isHoverImage = true;
                    }
                }
                
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
                    $fileItem['thumbnail'] = $file->resize(80)->url();
                    $fileItem['dimensions'] = $file->width() . 'x' . $file->height();
                    
                    $fileSize = $file->size();
                    $fileItem['file_size'] = $fileSize;
                    $fileItem['is_large_image'] = $fileSize > 5000000;
                    
                    if ($fileItem['is_large_image']) {
                        $fileItem['optimized_small'] = $file->resize(800)->url();
                        $fileItem['optimized_medium'] = $file->resize(1200)->url();
                        $fileItem['optimized_large'] = $file->resize(1920)->url();
                    }
                }
                
                $fileType = $file->type();
                if ($fileType === 'image') {
                    $fileItem['icon'] = 'image-icon';
                } elseif ($fileType === 'document') {
                    $fileItem['icon'] = 'pdf-icon';
                } elseif ($fileType === 'audio') {
                    $fileItem['icon'] = 'audio-icon';
                } elseif ($fileType === 'video') {
                    $fileItem['icon'] = 'video-icon';
                } else {
                    $fileItem['icon'] = 'file-icon';
                }
                
                $items[] = $fileItem;
            }
            
            usort($items, function($a, $b) {
                if ($a['type'] === 'textfile' && $b['type'] !== 'textfile') {
                    return -1;
                }
                if ($b['type'] === 'textfile' && $a['type'] !== 'textfile') {
                    return 1;
                }
                return strcasecmp($a['name'], $b['name']);
            });
            
            return [
                'status' => 'ok',
                'path' => '/' . $path,
                'items' => $items
            ];
        }
    ]
];
?>
