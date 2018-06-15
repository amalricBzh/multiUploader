/* eslint complexity: ["error", 10]*/
/* eslint no-use-before-define": ["error", { "functions": false }] */

function Dropper(params) {

    var dropZone = params.dropZone ;
    var onEvent = params.onEvent ;
    var user = {
        name:  params.usernameField || "",
        email: params.emailField || ""
    };

    var filelist = [];
    var lastFileSize = 0 ;

    var totalSize = 0;
    var totalProgress = 0 ;

    var nbFiles = 0 ;
    var nbFilesCompleted = 0 ;

    var isUploading = false ;
    var chenillardStep = 0 ;

    // nom du répertoire basé sur le timestamp en secondes pour un nom
    // unique pseudo-aléatoire. Valable pour toutes les photos chargées par
    // cette page
    var directory = Math.floor(Date.now() / 1000) - 1529000000 ;

    function init() {
        filelist = [];
        lastFileSize = 0 ;
        totalSize = 0 ;
        totalProgress = 0 ;
        isUploading = false ;
        nbFiles = 0 ;
        nbFilesCompleted = 0 ;
    }

    function handleProgress(event) {
        chenillardStep ++ ;
        let steps = [
            "*&nbsp;&nbsp;&nbsp;&nbsp;", "&nbsp;*&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;*&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;*&nbsp;", "&nbsp;&nbsp;&nbsp;&nbsp;*",
            "&nbsp;&nbsp;&nbsp;*&nbsp;", "&nbsp;&nbsp;*&nbsp;&nbsp;", "&nbsp;*&nbsp;&nbsp;&nbsp;"
        ];
        chenillardStep %= steps.length ;
        onEvent({
            type: "message",
            lastStatus: steps[chenillardStep] // eslint-disable-line security/detect-object-injection
        });

        let message = {
            type: "progress"
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
        // contournement pb sur les arrondis et somme d'arrondis...
        if (message.totalProgression >= 100) {
            message.totalProgression = 100 ;
            message.totalCurrent = message.totalMax ;
        }
        onEvent(message);
    }

    function handleComplete(event, filesize) {
        nbFilesCompleted ++ ;
        onEvent({
            type: "progress",
            nbFiles,
            nbFilesCompleted
        });
        // Si la taille téléchargée est bien celle du ficheir
        if (parseInt(event.fileSize) === parseInt(filesize)) {
            // On a bien la bonne taille de fichier
            onEvent({
                type: "message",
                lastStatus: "OK"
            });
            // Evènement nouveau fichier
            let newEvent = {
                type: "newFile",
                fileType: event.fileType,
                fileSize: event.fileSize,
                fileName: event.filename,
                fileUrl: event.fileUrl
            };

            // Si c'est une image, on envoie un event image
            if (["image/gif", "image/jpeg", "image/png"].indexOf(event.fileType) > -1) {
                // On change l'évènement
                newEvent.type = "newImage" ;
                newEvent.fileType= event.fileType.replace("image/", "");
            }
            onEvent(newEvent);
        } else {
            // Taille du fichier client != taille du ficheir serveur
            onEvent({
                type: "message",
                lastStatus: "Erreur"
            });
            onEvent({
                type: "message",
                message: "Le transfert du fichier a été interrompu avant la fin (" + filesize + " vs " + event.fileSize + ")."
            });
        }

        uploadNext();
    }

    function uploadFile(file) {
        let xhr = new XMLHttpRequest();
        let filesize = file.size ;
        xhr.open("POST", "/imageRecorder.php");
        xhr.responseType = "json";

        xhr.onload = function (event) {
            onEvent({
                type: "message",
                lastStatus: "Terminé"
            });
            handleComplete(event.target.response, filesize);
        };
        xhr.error = function (event) {
            onEvent({
                type: "message",
                lastStatus: "Erreur"
            });
            onEvent({
                type: "message",
                message: "Erreur de transfert, le fichier n'a pas été transféré."
            });
            handleComplete(event.target.response, filesize);
        };
        xhr.upload.onprogress = function (event) {
            handleProgress(event);
        };
        xhr.upload.onloadstart = function (event) {
            onEvent({
                type: "start",
                filename: file.name,
                fileMax: event.total,
                fileCurrent: event.loaded,
                totalMax: totalSize,
                totalCurrent: totalProgress,
                nbFiles,
                nbFilesCompleted
            });
        };
        let formData = new FormData();
        formData.append("myfile", file);
        formData.append("directory", directory);
        if (user.name !== "") {
            formData.append("username", $(user.name).val());
        } else {
            formData.append("username", "");
        }
        if (user.email !== "") {
            formData.append("email", $(user.email).val());
        } else {
            formData.append("email", "");
        }

        xhr.send(formData);
        file = null ;
    }

    function uploadNext() {
        isUploading = true ;
        lastFileSize = 0 ;
        if (filelist.length) {
            let nextFile = filelist.shift();
            onEvent({
                type: "message",
                message: "Transfert de "+ nextFile.name,
                lastStatus: "*$nbsp;$nbsp;$nbsp;$nbsp;"
            });
            if (nextFile.size > 300 * 1024 * 1024) {
                onEvent({
                    type: "message",
                    lastStatus: "Erreur"
                });
                onEvent({
                    type: "message",
                    message: "Fichier " + nextFile.name + " trop gros : ignoré (maximum : 300Mo)."
                });
                handleComplete(nextFile);
            } else {
                uploadFile(nextFile);
            }
        } else {
            onEvent({
                type: "end"
            });
            $(dropZone).removeClass("transfering").removeClass("dragOver");
            init();
            onEvent({
                type: "message",
                asyncMessage: "Tous les transferts sont terminés !",
            });
        }
    }


    function processFiles(files) {
        onEvent({
            type: "message",
            asyncMessage: "Initialisation du nouveau transfert..."
        });
        if (!files || !files.length) {
            return ;
        }
        // Si pas d'upload en cours, on repart à zéro
        if (!isUploading) {
            init();
        }

        // Add each file to queue
        for (let i = 0; i < files.length ; i++) {
            //console.log(files[i]);
            filelist.push(files[i]);    // eslint-disable-line security/detect-object-injection
            nbFiles ++ ;
            totalSize += files[i].size;     // eslint-disable-line security/detect-object-injection
        }

        // If not uploading, start upload
        if (!isUploading) {
            uploadNext();
        }
        // Else no need to do something more
    }

    /*************** Init ******/
    // Un peu d'animation sur les event drop et surtout éviter la propagation des évènements
    $(document).on("dragenter", dropZone, function() {
        $(this).addClass("dragOver");
        return false;
    });

    $(document).on("dragover", dropZone, function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).addClass("dragOver");
        return false;
    });

    $(document).on("dragleave", dropZone, function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass("dragOver");
        return false;
    });

    // Gestion du largage des fichiers
    $(document).on("drop", dropZone, function(event) {
        if (event.originalEvent.dataTransfer) {
            if (event.originalEvent.dataTransfer.files.length) {
                // stop propagation
                event.preventDefault();
                event.stopPropagation();
                $(this).addClass("transfering").removeClass("dragOver");
                // Upload
                processFiles(event.originalEvent.dataTransfer.files);
            }
        } else {
            $(this).removeClass("transfering").removeClass("dragOver");
        }
    });

    return {} ;
}