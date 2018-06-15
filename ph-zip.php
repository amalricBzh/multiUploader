<?php

include 'inc-galerie.php' ;

////////////// Start //////////
///////////////////////////////

$startTime = microtime(true);

// Check g GET : if not set, returns info on existing zips.
// if set, a zip generation for "g" galery is asked.
if (!isset($_GET['g'])) {
    // No more used (for Ajax calls only)
    return getZipInfo();
}

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
    echo json_encode($zipInfo);
    die;
}

$zipInfo['newZip'] = [] ;
// Il reste des todos. On prend le prochain à traiter.
$file = array_shift($zipInfo['todo']);
//Y at-il un zip en cours, et quelle est sa taille ?
$zipSize = 0 ;
if ($zipInfo['currentZip'] !== null) {
    // Si le zip plus le prochain fichier font plus de 200Mo, OU que le dernier ajout a duré plus de 10s,
    // on fait un nouveau zip.
    if (filesize($zipInfo['currentZip']) + $file['size'] > 20 * 1024 * 1024 ||
        $zipInfo['lastTime'] > 10) {
        $zipInfo['done'][] = $zipInfo['currentZip'] ;
        $zipInfo['newZip'][] = $zipInfo['currentZip'] ;
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

// Si plus de fichiers à ajouter, on met le zip courant dans les zip faits.
if (count ($zipInfo['todo']) === 0) {
    $zipInfo['done'][] = $zipInfo['currentZip'] ;
    $zipInfo['newZip'][] = $zipInfo['currentZip'] ;
    $zipInfo['currentZip'] = null ;
}

$zipInfo['lastTime'] = microtime(true) - $startTime ;
// On écrit le fichier de config qui doit être à jour
file_put_contents($progressFile, json_encode($zipInfo));
echo json_encode($zipInfo);
