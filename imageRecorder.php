<?php

if (isset($_FILES['myfile'])) {
    $fileName = '' ;
    $fileType = '' ;
    $fileSize = '';
    $directory = '000';
    $username = 'Anonyme' ;
    $email = '' ;
    // Validation
    if (isset($_FILES['myfile']['name'])) {
        $fileName = trim($_FILES['myfile']['name']);
    }
    if (isset($_FILES['myfile']['type'])) {
        $fileType = trim($_FILES['myfile']['type']) ;
    }
    if (isset($_FILES['myfile']['size'])) {
        $fileSize = trim($_FILES['myfile']['size']) ;
    }
    if (isset($_POST['directory'])) {               // phpcs:ignore PHPCS_WordPress_CSRF_NonceVerification
        $directory = trim($_POST['directory']) ;    // phpcs:ignore PHPCS_WordPress_CSRF_NonceVerification
    }

    if (empty($fileName) || empty($fileType) || empty($fileSize) || empty($directory)) {
        echo json_encode([
            "message" => "Les donénes envoyées ne sont pas valides.",
        ]);
        return;
    }
    if (isset($_POST['username'])) {                // phpcs:ignore PHPCS_WordPress_CSRF_NonceVerification
        $username = trim ($_POST['username']) ;     // phpcs:ignore PHPCS_WordPress_CSRF_NonceVerification
    }
    if (isset($_POST['email'])) {                   // phpcs:ignore PHPCS_WordPress_CSRF_NonceVerification
        $email = trim ($_POST['email']) ;           // phpcs:ignore PHPCS_WordPress_CSRF_NonceVerification
    }

    $directory = 'files/'.$directory.'/';
    $userInfo = $username ;

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

    file_put_contents(
        $directory . 'info.json',
        json_encode(['username' => $username, 'email' => $email]),
        LOCK_EX
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
