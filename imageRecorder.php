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
    $fileName = isset($_FILES['myfile']['name']) ? trim($_FILES['myfile']['name']): '';
    $fileType = isset($_FILES['myfile']['type']) ? trim($_FILES['myfile']['type']): '';
    $fileSize = isset($_FILES['myfile']['size']) ? trim($_FILES['myfile']['size']): '';

    if (empty($fileName) || empty($fileType) || empty($fileSize)) {
        echo json_encode([
            "message" => "Les donénes envoyées ne sont pas valides.",
        ]);
        return;
    }

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
    $fullFilename = $directory. $_FILES['myfile']['name'] ;
    move_uploaded_file( $_FILES['myfile']['tmp_name'], $fullFilename);

    // Check file size for basic integrity
    $serverFilesize = filesize($fullFilename);
    if ((int) $fileSize !== $serverFilesize) {
        echo json_encode([
            "message" => "Erreur : le fichier {$fileName} n'a pas été correctement transféré.",
            "fileType" => $fileType,
            "fileSize" => $fileSize,
            "serveurFilesize" => $serverFilesize
        ]);
        return ;
    }

    echo json_encode([
        "message" => "Le fichier {$fileName} a été correctement transféré.",
        "fileType" => $fileType,
        "fileSize" => $fileSize,
        "filename" => $fullFilename
        ]);
} else {
    echo json_encode([
        "message" => "Une erreur s'est produite.",
    ]);
}
