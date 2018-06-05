<?php

function bytesToSize1024($bytes, $precision = 2) {
    $unit = array('B','KB','MB');
    return @round($bytes / pow(1024, ($ind = floor(log($bytes, 1024)))), $precision).' '.$unit[$ind];
}

function filterString($string) {
    return preg_replace(['/&.*;/', '/\W/'], '-',
        preg_replace('/&([A-Za-z]{1,2})(grave|acute|circ|cedil|uml|lig);/',
        '$1',
            htmlentities($string,ENT_NOQUOTES,'UTF-8')));
}

function filterMail($mail) {
    return preg_replace('[^A-Za-z0-9.@_-]', '+', $mail);
}


if (isset($_FILES['myfile'])) {
    $sFileName = $_FILES['myfile']['name'];
    $sFileType = $_FILES['myfile']['type'];
    $sFileSize = bytesToSize1024($_FILES['myfile']['size'], 1);

    $username = $_POST['username'] ;
    $email = $_POST['email'] ;

    $directory = 'files/'.$_POST['directory'].'/';

    $userInfo = "Anonyme" ;

    if ($username !== ''){
        $userInfo = $username ;
    }
    if ($email !== '') {
        $userInfo .= ' - ' . $email;
    }

    if (!file_exists($directory)) {
        mkdir($directory, 0777, true);
    }
    // Write file info
    file_put_contents(
        $directory . 'info.txt',
        date("Y-m-d H:i:s"). ' ; ' . $userInfo . ' ; ' . $_FILES['myfile']['name'] . "\r\n",
        FILE_APPEND | LOCK_EX
    );
    // Move uploaded file
    move_uploaded_file( $_FILES['myfile']['tmp_name'], $directory. $_FILES['myfile']['name']);

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
