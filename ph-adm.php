<?php

function formatSizeUnits($bytes) {
    $res = '0 octets';
    if ($bytes >= 1073741824) {
        $res = number_format($bytes / 1073741824, 2) . ' Go';
    } elseif ($bytes >= 1048576) {
        $res = number_format($bytes / 1048576, 2) . ' Mo';
    } elseif ($bytes >= 1024) {
        $res = number_format($bytes / 1024, 2) . ' Ko';
    } elseif ($bytes > 1) {
        $res = $bytes . ' octets';
    } elseif ($bytes == 1) {
        $res = $bytes . ' octet';
    }

    return $res;
}

include 'inc-galerie.php' ;

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
$zipInfo = getZipInfo();

foreach ($galeries as $name => $galery) {
    $galeries[$name]['cog'] = false ;
    // Si pas de zip info, ou zipInfo{allDone] = false => on met la roue crantée pour (re)générer le zip.
    if (!array_key_exists($name, $zipInfo) || $zipInfo[$name]['allDone'] === false ){
        $galeries[$name]['cog'] = true ;
    }
    $galeries[$name]['zipFiles'] = [];
    // S'il y a des zips à afficher
    if (array_key_exists($name, $zipInfo) && count($zipInfo[$name]['zipFiles']) > 0){
        $galeries[$name]['zipFiles'] = $zipInfo[$name]['zipFiles'] ;
    }
}

echo "<pre>"; var_dump($galeries); echo "</pre>";


?><!doctype html><html>
<head>
    <meta charset="UTF-8" />
    <title>21 juillet 2018 - Photos admin</title>
    <link href="https://fonts.googleapis.com/css?family=Pinyon+Script|Lobster|Prompt|Racing+Sans+One|Share+Tech+Mono"
          rel="stylesheet" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
          integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous" />
    <link rel="stylesheet" href="21juillet.css" />
    <link rel="stylesheet" href="adm.css" />
    <link rel="icon" type="image/png" href="favicon.png" />
</head>
<body>
<div id="spinner">
    <div class="lds-heart"><div>
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
            if (strlen(trim($galerie['user']))>0) {
                echo "<div>{$galerie['user']}</div>";
            }
            if (strlen(trim($galerie['email']))>0) {
                echo "<div>{$galerie['email']}</div>";
            }
            echo "<div>{$galerie['nbFiles']} fichier(s)</div>";
            echo "<div>".formatSizeUnits($galerie['size'])."</div>";
            echo "<div class=\"icons\" data-id=\"{$galerie['name']}\">" ;
            if ($galerie['cog']) {
                echo "<span class=\"cog\" data-id=\"{$galerie['name']}\"><i class=\"fas fa-cog\"></i></span>";
            }
            foreach ($galerie['zipFiles'] as $zip) {
                echo ' <a href="'.$zip.'">';
                echo '<span class="fa-layers fa-fw">';
                echo '<i class="fas fa-download"></i>';
                echo '<span class="fa-layers-counter download-badge">' . explode('.', $zip)[1]. '</span>';
                echo '</a>';
                echo '</span>';
            }
            echo "</div>" ;
            echo "</div>";
        }
    ?>
    </div>
</div>


<script src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"
        integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T"
        crossorigin="anonymous"></script>
<script defer src="https://use.fontawesome.com/releases/v5.0.13/js/all.js"
        integrity="sha384-xymdQtn1n3lH2wcu0qhcdaOpQwyoarkgLVxC/wZ5q7h9gHtxICrpcaSUfygqZGOe"
        crossorigin="anonymous"></script>
<script src="adm.js"></script>
</body>

</html>

