<?php
/**
 * Created by PhpStorm.
 * User: AmalricBzh
 * Date: 08/06/2018
 */

if (isset($_GET['url']) && !empty($_GET['url'])) {
    $url = $_GET['url'];    // phpcs:ignore PHPCS_WordPress_CSRF_NonceVerification
} else {
    echo json_encode([
        'result' => 'failed',
        'message' => 'Invalid file'
    ]);
    exit();

}
if (!file_exists($url)) {
    echo json_encode([
        'result' => 'failed',
        'message' => 'Unknown file'
    ]);
    exit();
}

$vignette64 = createVignette($url, 155);

echo json_encode($vignette64);


function getSourceImage($file)
{
    $fileType = @exif_imagetype ($file) ;
    switch ($fileType) {
        case IMAGETYPE_GIF :
            $sourceImage = @imagecreatefromgif($file);
            break;
        case IMAGETYPE_JPEG:
            $sourceImage = @imagecreatefromjpeg($file);
            break;
        case IMAGETYPE_PNG:
            $sourceImage = @imagecreatefrompng($file);
            break;
        default:
            return [
                'result' => 'failed',
                'message' => 'Unknown format'
            ];
            break;
    }

    return [
        'result' => 'success',
        'image' => $sourceImage
    ];
}

function getExifData($file)
{
    // Exif infos
    $exifDatas = @exif_read_data($file, 'FILE', true, false);
    $exif = [
        'orientation' => 1
    ];
    if ($exifDatas !== false) {
        if (!empty($exifDatas['IFD0']['Orientation'])){
            $exif['orientation'] = $exifDatas['IFD0']['Orientation'];
        }
    }
    return $exif ;
}


function createVignette($source, $size)
{
    $sourceImageData = getSourceImage($source);
    // Création de la vignette
    if ($sourceImageData['result'] !== 'success') {
        return $sourceImageData;
    }

    $sourceImage = $sourceImageData['image'];

    $exif = getExifData($source);

    // Init création image
    $width = imagesx($sourceImage);
    $newWidth = $width ;
    $height = imagesy($sourceImage);
    $newHeight = $height ;
    if ($newWidth > $size){
        $newWidth = $size ;
        $newHeight = floor($height * $size / $width);
    }
    if ($newHeight > $size){
        $newHeight = $size ;
        $newWidth = floor($width * $size / $height);
    }
    $vignette = imagecreatetruecolor($newWidth, $newHeight);
    // Copie source dans la vignette avec changement de la taille
    imagecopyresampled($vignette, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
    // Tourne la vignette
    switch($exif['orientation']) {
        case 3:
            $vignette = imagerotate($vignette, 180, 0);
            break;
        case 6:
            $vignette = imagerotate($vignette, 270, 0);
            $tmp = $newWidth;
            $newWidth = $newHeight;
            $newHeight = $tmp;
            break;
        case 8:
            $vignette = imagerotate($vignette, 90, 0);
            $tmp = $newWidth;
            $newWidth = $newHeight;
            $newHeight = $tmp;
            break;
    }

    ob_start();
        imagejpeg($vignette, NULL, 60);
        $resizedJpegData = ob_get_contents();
    ob_end_clean();

    return [
        'result' => 'success',
        'url' => $source,
        'thumbnail' => base64_encode($resizedJpegData),
        'width' => $newWidth,
        'height' => $newHeight
    ];
}