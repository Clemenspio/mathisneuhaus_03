<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Mathis Neuhaus</title>
    <link rel="stylesheet" href="<?= url('assets/css/main.css') ?>">
</head>
<body>
            <div class="about-frame">
            <div class="header-group">
                <div class="files-text">FILES</div>
                <button class="close-button" onclick="goBack()">←</button>
            </div>
        
        <div class="about-content">
            <?= $page->about_text()->kirbytext() ?>
        </div>
        
        <button class="back-button" onclick="goBack()">← Back to Finder</button>
    </div>

    <script>
        function goBack() {
            window.history.back();
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                goBack();
            }
        });
    </script>
</body>
</html> 