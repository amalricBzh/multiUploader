<?php

function formatSizeUnits($bytes) {
    if ($bytes >= 1073741824) {
        $bytes = number_format($bytes / 1073741824, 2) . ' Go';
    } elseif ($bytes >= 1048576) {
        $bytes = number_format($bytes / 1048576, 2) . ' Mo';
    } elseif ($bytes >= 1024) {
        $bytes = number_format($bytes / 1024, 2) . ' Ko';
    } elseif ($bytes > 1) {
        $bytes = $bytes . ' octets';
    } elseif ($bytes == 1) {
        $bytes = $bytes . ' octet';
    } else {
        $bytes = '0 octets';
    }

    return $bytes;
}


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




function getGaleries(){
    $galeries = [] ;
    // On ouvre le dossier "files"
    if ($handle = opendir('files/')) {
        // Pour chaque entrée qui est un répertoire
        while (false !== ($entry = readdir($handle))) {
            if ($entry !== "." && $entry !== ".." && is_dir('files/'. $entry)) {
                $galeries[$entry] = getGaleryInfos ($entry);
            }
        }
        closedir($handle);
    }

    return $galeries ;
}


$galeries = getGaleries();


?><html>
<header>
    <meta charset="UTF-8">
    <title>21 juillet 2018 - Photos admin</title>
    <link href="https://fonts.googleapis.com/css?family=Pinyon+Script|Lobster|Prompt|Racing+Sans+One|Share+Tech+Mono" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
    <link rel="stylesheet" href="21juillet.css">
    <link rel="stylesheet" href="admin.css">
    <link rel="icon" type="image/png" href="favicon.png" />
</header>
<body>
<div id="spinner">
    <div class="lds-heart"><div></div></div>
</div>

<header>
    <h1>Admin photos - 21 juillet 2018</h1>
</header>

<div id="galerieInfo" class="mainRow">
    <h2>Galeries</h2>
    <div>
    <?php
        foreach ($galeries as $name => $galerie) {
            echo "<div>";
            echo "<div><a href=\"{$galerie['fullname']}\" target=\"_blank\">{$galerie['name']}</a></div>";
            if (strlen(trim($galerie['user']))>0){
                echo "<div>{$galerie['user']}</div>";
            }
            if (strlen(trim($galerie['email']))>0){
                echo "<div>{$galerie['email']}</div>";
            }
            echo "<div>{$galerie['nbFiles']} fichier(s)</div>";
            echo "<div>".formatSizeUnits($galerie['size'])."</div>";
            echo "<div><a href=\"ph-zip.php?g={$galerie['name']}\"><i class=\"fas fa-download\"></i></a></div>";
            echo "</div>";
        }
    ?>
    </div>
</div>


<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
<script src="adm.js"></script>
</body>

</html>

