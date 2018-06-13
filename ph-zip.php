<?php

include 'inc-galerie.php' ;

////////////// Start //////////
///////////////////////////////

$startTime = microtime(true);
$galery = $_GET['g'] ;

// On regarde s'il y a des infos de zippage
$progressFile = 'files/'.$galery.'.json' ;
if (file_exists($progressFile)) {
    $zipInfo = json_decode(file_get_contents($progressFile), true);
} else {
    // Init et fin de traitement
    $galeryInfo = getGaleryInfos($galery);
    $zipInfo = [
        'name' => $galery,
        'currentZip' => null,
        'zipIndex' => 0,
        'todo' => $galeryInfo['files'],
        'done' => [],
        'lastTime' => 0
    ];
}

// Si terminé : fin de traitement
if (count($zipInfo['todo']) === 0) {
    echo json_encode($zipInfo); die;
}

// Il reste des todos. On prend le prochain à traiter.
$file = array_shift($zipInfo['todo']);
//Y at-il un zip en cours, et quelle est sa taille ?
$zipSize = 0 ;
if ($zipInfo['currentZip'] !== null) {
    // Si le zip plus le prochain fichier font plus de 200Mo, OU que le dernier ajout a duré plus de 20s,
    // on met le zip en terminé.
    if (filesize($zipInfo['currentZip']) + $file['size'] > 200 * 1024 * 1024 ||
        $zipInfo['lastTime'] > 12) {
        $zipInfo['done'][] = $zipInfo['currentZip'] ;
        $zipInfo['currentZip'] = null ;
    }
}
// Si pas de zip en cours, on le créé
if ($zipInfo['currentZip'] === null) {
    $zipInfo['zipIndex'] ++ ;
    $zipInfo['currentZip'] = 'files/'.$galery.'.'.$zipInfo['zipIndex'].'.zip';
}
// on ouvre le fichier zip
$zip = new ZipArchive();
$zip->open('files/'.$galery.'.'.$zipInfo['zipIndex'].'.zip', ZipArchive::CREATE);
// On ajoute le fichier  à traiter
$zip->addFile($file['fullname'], $file['name']);
$zip->close();
$zipInfo['lastTime'] = microtime(true) - $startTime ;
// On écrit le fichier de config qui doit être à jour
file_put_contents($progressFile, json_encode($zipInfo));
echo json_encode($zipInfo); die;
