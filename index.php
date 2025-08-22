<?php

// PHP Memory Settings für große Datei-Uploads
ini_set('memory_limit', '1G');
ini_set('upload_max_filesize', '512M');
ini_set('post_max_size', '1G');
ini_set('max_execution_time', 600);
ini_set('max_input_time', 600);

require 'kirby/bootstrap.php';

echo (new Kirby)->render();
