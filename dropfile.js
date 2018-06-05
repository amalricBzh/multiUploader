// Remove spinner when all is loaded (especially web fonts)
$(window).bind("load", function(){
    $("#spinner").fadeOut(800, function() {
        (this).remove();
    });
});

function formatBytes(bytes, decimals) {
    if(bytes === 0) return '0';
    let k = 1024,
        dm = decimals || 2,
        sizes = ["o", "Ko", "Mo", "Go"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}


function DropUpload(params) {

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
    // unique pseudo-aléatoire. Valable pour toutes les phots chargées par
    // cette page
    var directory = Math.floor(Date.now() / 1000) - 1528200000 ;

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
            lastStatus: steps[chenillardStep]
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
        // contournement pb sur les arrondis et somme d"arrondis...
        if (message.totalProgression >= 100) {
            message.totalProgression = 100 ;
            message.totalCurrent = message.totalMax ;
        }
        onEvent(message);
    }

    function handleComplete(/* file */) {
        nbFilesCompleted ++ ;
        onEvent({
            type: "progress",
            nbFiles: nbFiles,
            nbFilesCompleted: nbFilesCompleted
        });
        uploadNext();
    }

    function uploadFile(file) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/imageRecorder.php");
        xhr.onload = function () {
            onEvent({
                type: "message",
                lastStatus: "Terminé"
            });
            handleComplete(file);
        };
        xhr.error = function () {
            onEvent({
                type: "message",
                lastStatus: "Erreur"
            });
            onEvent({
                type: "message",
                message: "Erreur de transfert, le fichier n'a pas été transféré."
            });
            handleComplete(file);
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
                nbFiles: nbFiles,
                nbFilesCompleted: nbFilesCompleted
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
        file = undefined ;
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
            if (nextFile.size > 200 * 1024 * 1024) {
                onEvent({
                    type: "message",
                    lastStatus: "Erreur"
                });
                onEvent({
                    type: "message",
                    message: "Fichier " + nextFile.name + " trop gros : ignoré (maximum : 200Mo)."
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
                galerie: directory
            });
        }
    }

    function processFiles(files) {
        onEvent({
            type: 'message',
            asyncMessage: 'Lecture des fichiers'
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

    return {

    }
}


let dropper = new DropUpload({
    dropZone: "#dropfile",
    onEvent: onDropperEvent,
    usernameField: "#username",
    emailField: "#email"
});


function onDropperEvent(event) {
    if (event.type && (event.type === "progress" || event.type === "start")) {
        // Infos et progress bar fichiers
        if (event.hasOwnProperty("fileProgression")) {
            $("#barFile span").css("width", event.fileProgression+"%");
            $("#barFile").attr("data-label", event.fileProgression+"%");
        }
        if (event.hasOwnProperty("filename")) {
            $("#dropfileinfomessage").html(event.filename + " ");
        }
        if (event.hasOwnProperty("fileCurrent") && event.hasOwnProperty("fileMax")) {
            if (event.fileCurrent === event.fileMax) {
                // Tout est transféré, il faut copier du répertoire temporaire au final (en php)
                $("#dropfileinfosize").html("Finalisation...");
                editHistory("Finalisation...");
            } else {
                $("#dropfileinfosize").html(formatBytes(event.fileCurrent)+"/"+formatBytes(event.fileMax));
            }
        }
        // Infos et progress bar total
        if (event.hasOwnProperty("totalProgression")) {
            $("#barTotal span").css("width", event.totalProgression+"%");
            $("#barTotal").attr("data-label", event.totalProgression+"%");
        }
        if (event.hasOwnProperty("nbFiles") && event.hasOwnProperty("nbFilesCompleted")) {
            $("#droptotalinfomessage").html("Fichiers transférés : " + event.nbFilesCompleted + "/" + event.nbFiles);
        }
        if (event.hasOwnProperty("totalCurrent") && event.hasOwnProperty("totalMax")) {
            $("#droptotalinfosize").html(formatBytes(event.totalCurrent)+"/"+formatBytes(event.totalMax));
        }
    }
    if (event.type && event.type === "start") {
        $("#dropfile").html("Transfert en cours...");
        $("#dropInfo").show();
    }
    if (event.type && event.type === "end") {
        $("#dropfile").html("Déposez un ou plusieurs fichiers ici.");
        $("#dropfileinfosize").html("Terminé.");
    }
    //console.log('onDropperEvent', event);

    if (event.type && event.type === "message") {
        console.log(event);
        if (event.message) {
            addHistory(event.message);
        }
        if (event.lastStatus) {
            editHistory(event.lastStatus);
        }
        if (event.asyncMessage) {
            addAsyncHistory(event.asyncMessage);
        }
        if (event.galerie) {
            let galerieDiv = $("#galerieInfo") ;
            galerieDiv.html("")
                .append("Un album a été créé, vous pouvez le visualiser en suivant ce lien&nbsp;: ");
            $("<a>",{
                text: "Galerie photo",
                title: "Lien vers vos photos téléchargées",
                href: "files/"+event.galerie+"/",
                target: "_blank",

            }).appendTo("#galerieInfo");
            galerieDiv.append(". Si vous ne rechargez pas cette page, les nouvelles photos que vous enverrez " +
                "seront ajoutez à ce même album.");
            setTimeout(function(){
                $("#dropInfo").fadeOut();
                $("#galerieInfo").fadeIn();
            }, 1000);
        }
    }
}

function addHistory(text, edit) {
    edit = edit || "";
    let history = $("#history");
    history
        .append('<div class="dyn">'+text+" <span>"+edit+"</span></div>")
        .animate({scrollTop: history.prop("scrollHeight")}, 80);
}

function addAsyncHistory(text) {
    let history = $("#history");
    history
        .append("<div>"+text+"</div>")
        .animate({scrollTop: history.prop("scrollHeight")}, 80);
}

function editHistory(text) {
    $("#history div.dyn span").last().html(text);
}

