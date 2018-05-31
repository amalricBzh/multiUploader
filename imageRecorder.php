<?php

function bytesToSize1024($bytes, $precision = 2) {
    $unit = array('B','KB','MB');
    return @round($bytes / pow(1024, ($i = floor(log($bytes, 1024)))), $precision).' '.$unit[$i];
}


if (isset($_FILES['myfile'])) {
    $sFileName = $_FILES['myfile']['name'];
    $sFileType = $_FILES['myfile']['type'];
    $sFileSize = bytesToSize1024($_FILES['myfile']['size'], 1);

    move_uploaded_file( $_FILES['myfile']['tmp_name'], 'files/'. $_FILES['myfile']['name']);

    echo <<<EOF
<div class="s">
    <p>Le fichier {$sFileName} a été correctement transféré.</p>
    <p>Type : {$sFileType}</p>
    <p>Taille : {$sFileSize}</p>
</div>
EOF;

} else {
    echo '<div class="f">Une erreur s\'est produite.</div>';
}
