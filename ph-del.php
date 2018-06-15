<?php


function rrmdir($dir) {
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (is_dir($dir."/".$object))
                    rrmdir($dir."/".$object);
                else
                    unlink($dir."/".$object);
            }
        }
        rmdir($dir);
    }
}


// Check g GET : if not set, returns info on existing zips.
// if set, a zip generation for "g" galery is asked.
if (!isset($_GET['g'])) {
    // No more used (for Ajax calls only)
    echo json_encode([
        'result' => false
    ]);
    exit();
}

$galery = $_GET['g'] ;

rrmdir('files/'. $galery);

array_map('unlink', glob("files/".$galery.".*"));

echo json_encode([
    'result' => true
]);