function formatBytes(bytes, decimals) {
    if(bytes === 0) return '0';
    var k = 1024,
        dm = decimals || 2,
        sizes = ['o', 'Ko', 'Mo', 'Go'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



function DropUpload(params) {

    var dropZone = params.dropZone ;
    var onEvent = params.onEvent ;

    var filelist = [];
    var lastFileSize = 0 ;

    var totalSize = 0;
    var totalProgress = 0 ;

    var nbFiles = 0 ;
    var nbFilesCompleted = 0 ;

    var isUploading = false ;

    function init() {
        filelist = [];
        lastFileSize = 0 ;
        totalSize = 0 ;
        totalProgress = 0 ;
        isUploading = false ;
        nbFiles = 0 ;
        nbFilesCompleted = 0 ;
    }



    /*************** Init ******/
    // Un peu d'animation sur les event drop et surtout éviter la propagation des évènements
    $(document).on('dragenter', dropZone, function() {
        $(this).addClass('dragOver');
        return false;
    });

    $(document).on('dragover', dropZone, function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).addClass('dragOver');
        return false;
    });

    $(document).on('dragleave', dropZone, function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragOver');
        return false;
    });

    // Gestion du largage des fichiers
    // Gestion du largage des éléments
    $(document).on('drop', dropZone, function(event) {
        if (event.originalEvent.dataTransfer) {
            if (event.originalEvent.dataTransfer.files.length) {
                // stop propagation
                event.preventDefault();
                event.stopPropagation();
                $(this).addClass('transfering').removeClass('dragOver');
                // Upload
                processFiles(event.originalEvent.dataTransfer.files);
            }
        } else {
            $(this).removeClass('transfering').removeClass('dragOver');
        }
    });

    function processFiles(files) {
        if (!files || !files.length) {
            return ;
        }
        // Si pas d'upload en cours, on repart à zéro
        if (!isUploading) {
            init();
        }

        // Add each file to queue
        for (var i = 0; i < files.length ; i++) {
            console.log('processFiles ', files[i]);
            filelist.push(files[i]);
            nbFiles ++ ;
            totalSize += files[i].size;
        }


        // If not uploading, start upload
        if (!isUploading) {
            uploadNext();
        }
        // Else no need to do something more
    }

    function uploadNext() {
        isUploading = true ;
        lastFileSize = 0 ;
        if (filelist.length) {
            var nextFile = filelist.shift();
            if (nextFile.size > 200 * 1024 * 1024) {
                onEvent({message: 'Fichier \' + nextFile.name + \' trop gros : ignoré (maximum : 200Mo).'});
                handleComplete(nextFile);
            } else {
                uploadFile(nextFile);
            }
        } else {
            onEvent({
                type: 'end'
            });
            $(dropZone).removeClass('transfering').removeClass('dragOver');
            init();
        }
    }

    function uploadFile(file) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:1234/imageRecorder.php');
        xhr.onload = function () {
            onEvent({message: '-->onload: ' + this.responseText});
            handleComplete(file);
        };
        xhr.error = function () {
            onEvent({message: '-->onerror: ' + this.responseText});
            handleComplete(file);
        };
        xhr.upload.onprogress = function (event) {
            handleProgress(event);
        };
        xhr.upload.onloadstart = function (event) {
            onEvent({
                type: 'start',
                filename: file.name,
                fileMax: event.total,
                fileCurrent: event.loaded,
                totalMax: totalSize,
                totalCurrent: totalProgress,
                nbFiles: nbFiles,
                nbFilesCompleted: nbFilesCompleted
            });
        };
        var formData = new FormData();
        formData.append('myfile', file);
        xhr.send(formData);
    }

    function handleProgress(event) {
        var message = {
            type: 'progress'
        };
        message.fileProgression = Math.round(100 * event.loaded/event.total);
        message.fileCurrent = event.loaded ;
        message.fileMax = event.total ;
        // Mise à jour de TotalProgress
        totalProgress += event.loaded - lastFileSize ;
        lastFileSize = event.loaded ;
        message.totalProgression = Math.round(100 * totalProgress / totalSize);
        message.totalCurrent = totalProgress ;
        message.totalMax = totalSize;
        onEvent(message);
    }

    function handleComplete(file) {
        nbFilesCompleted ++ ;
        onEvent({
           type: 'progress',
           nbFiles: nbFiles,
           nbFilesCompleted: nbFilesCompleted
        });
        uploadNext();
    }

    return {

    }
}


var dropper = new DropUpload({
    dropZone: '#dropfile',
    onEvent: onDropperEvent
});


function onDropperEvent(event) {
    if (event.type && (event.type === 'progress' || event.type === 'start')) {
        // Infos et progress bar fichiers
        if (event.hasOwnProperty('fileProgression')) {
            $('#barFile span').css('width', event.fileProgression+'%');
            $('#barFile').attr('data-label', event.fileProgression+'%');
        }
        if (event.hasOwnProperty('filename')) {
            $('#dropfileinfomessage').html(event.filename + ' ');
        }
        if (event.hasOwnProperty('fileCurrent') && event.hasOwnProperty('fileMax')) {
            if (event.fileCurrent === event.fileMax) {
                // Tout est transféré, il faut copier du répertoire temporaire au final (en php)
                $('#dropfileinfosize').html('Finalisation...');
            } else {
                $('#dropfileinfosize').html(formatBytes(event.fileCurrent)+'/'+formatBytes(event.fileMax));
            }
        }
        // Infos et progress bar total
        if (event.hasOwnProperty('totalProgression')) {
            $('#barTotal span').css('width', event.totalProgression+'%');
            $('#barTotal').attr('data-label', event.totalProgression+'%');
        }
        if (event.hasOwnProperty('nbFiles') && event.hasOwnProperty('nbFilesCompleted')) {
            $('#droptotalinfomessage').html('Fichiers transférés : ' + event.nbFilesCompleted + '/' + event.nbFiles);
        }
        if (event.hasOwnProperty('totalCurrent') && event.hasOwnProperty('totalMax')) {
            $('#droptotalinfosize').html(formatBytes(event.totalCurrent)+'/'+formatBytes(event.totalMax));
        }
    }
    if (event.type && event.type === 'start') {
        $('#dropfile').html('Transfert en cours...');
    }
    if (event.type && event.type === 'end') {
        $('#dropfile').html('Déposez un ou plusieurs fichiers ici.');
        $('#dropfileinfosize').html('Terminé.');
    }
    console.log('onDropperEvent', event);
}