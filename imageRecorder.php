<?php

if (isset($_FILES['myfile'])) {
    $fileName = isset($_FILES['myfile']['name']) ? trim($_FILES['myfile']['name']): '';
    $fileType = isset($_FILES['myfile']['type']) ? trim($_FILES['myfile']['type']): '';
    $fileSize = isset($_FILES['myfile']['size']) ? trim($_FILES['myfile']['size']): '';
    $directory = isset($_POST['directory']) ? trim($_POST['directory']): '000';

    if (empty($fileName) || empty($fileType) || empty($fileSize) || empty($directory)) {
        echo json_encode([
            "message" => "Les donénes envoyées ne sont pas valides.",
        ]);
        return;
    }

    $username = isset($_POST['username']) ? trim ($_POST['username']) : 'Anonyme' ;
    $email = isset($_POST['email']) ? trim ($_POST['email']) : '' ;
    $email = $_POST['email'] ;


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
