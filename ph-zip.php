<?php

function getGaleryInfos($name) {

    $directory = 'files/' . $name ;
    $files = [];
    $size = 0;
    $user = '' ;
    $email = '' ;
    if ($handle = opendir($directory)) {
        // Pour chaque entrée qui n'est pas un répertoire
        while (false !== ($entry = readdir($handle))) {
            $filename = $directory . '/' . $entry ;
            if ($entry !== "." && $entry !== ".." && !is_dir($filename)) {
                $filesize = filesize($filename) ;
                $size += $filesize ;
                $files[] = [
                    'name' => $entry,
                    'fullname' => $filename,
                    'date' => filemtime($filename),
                    'size' => $filesize,
                ];
            }
        }

        // Get Json info
        $jsonFile = $directory . '/info.json' ;
        if (file_exists($jsonFile)) {
            $string = file_get_contents($jsonFile);
            $jsonData = json_decode($string, true);
            $user = $jsonData['username'];
            $email = $jsonData['email'];
        }

        closedir($handle);
    }




    return [
        'name' => $name,
        'fullname' => $directory,
        'files' => $files,
        'nbFiles' => count($files),
        'size' => $size,
        'user' => $user,
        'email' => $email,
    ] ;
}

