/* eslint complexity: ["error", 12]*/

// Remove spinner when all is loaded (especially web fonts)
$(window).bind("load", function(){
    $("#spinner").fadeOut(800, function() {
        (this).remove();
    });
});

function formatBytes(bytes, decimals) {
    if (bytes === 0) {
        return "0" ;
    }
    let k = 1024,
        dm = decimals || 2,
        sizes = ["o", "Ko", "Mo", "Go"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    // eslint-disable-next-line security/detect-object-injection
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// History functions
function addHistory(text, edit) {
    edit = edit || "";
    let history = $("#history > div");
    history
        .append("<div class=\"dyn\">"+text+" <span>"+edit+"</span></div>")
        .animate({scrollTop: history.prop("scrollHeight")}, 80);
}

function addAsyncHistory(text) {
    let history = $("#history > div");
    history
        .append("<div>"+text+"</div>")
        .animate({scrollTop: history.prop("scrollHeight")}, 80);
}

function editHistory(text) {
    $("#history > div > div.dyn span").last().html(text);
}


// Progress bar functions
function setFilenameProgressBar(filename) {
    $("#dropfileinfomessage").html(filename + " ");
}

function setFilesizeProgressBar(filesize) {
    $("#dropfileinfosize").html(filesize);
}

function setFileProgressionProgressBar(progression) {
    $("#barFile span").css("width", progression+"%");
    $("#barFile").attr("data-label", progression+"%");
}

function setTotalProgressionProgressBar(progression) {
    $("#barTotal span").css("width", progression+"%");
    $("#barTotal").attr("data-label", progression+"%");
}

function setTotalFileNbProgressBar(nbFilesCompleted, nbFiles) {
    $("#droptotalinfomessage").html("Fichiers transférés : " + nbFilesCompleted + "/" + nbFiles);
}

function setTotalSizeProgressBar(current, max) {
    $("#droptotalinfosize").html(formatBytes(current)+"/"+formatBytes(max));
}

// Galery functions

function addGalerieItem(icon, url, fileSize, fileName) {

    let div = document.createElement("div");
    $(div)
        .append("<div class=\"icon\"><i class=\"far "+ icon +" fa-5x\"></i></div>")
        .append("<div class=\"filename\">"+fileName+"</div>")
        .append("<div class=\"filesize\">" + formatBytes(fileSize) + "</div>")
        .appendTo("#galerieInfo > div");
}

// Event management functions
function onEventStart(event) {
    setFilenameProgressBar(event.filename);
    setFilesizeProgressBar(formatBytes(event.fileCurrent)+"/"+formatBytes(event.fileMax));
    setTotalFileNbProgressBar(event.nbFilesCompleted, event.nbFiles);
    setTotalSizeProgressBar(event.totalCurrent, event.totalMax);
    $("#dropfile").html("Transfert en cours...");
    $("#dropInfo").show();
    // Affichage galerie après 1.5s
    setTimeout(function(){
        $("#galerieInfo").fadeIn();
    }, 500);
}

function onEventEnd(/* event */) {
    $("#dropfile").html("Déposez un ou plusieurs fichiers ici.");
    $("#dropfileinfosize").html("Terminé.");
    // Cache des progress bar après 1.5s
    setTimeout(function(){
        $("#dropInfo").fadeOut();
    }, 1500);
}

function onEventProgress(event) {
    // Infos et progress bar fichiers
    if (event.hasOwnProperty("fileProgression")) {
        setFileProgressionProgressBar(event.fileProgression);
    }
    if (event.hasOwnProperty("filename")) {
        setFilenameProgressBar(event.filename + " ");
    }
    if (event.hasOwnProperty("fileCurrent") && event.hasOwnProperty("fileMax")) {
        if (event.fileCurrent === event.fileMax) {
            // Tout est transféré, il faut copier du répertoire temporaire au final (en php)
            setFilesizeProgressBar("Finalisation...");
            editHistory("Finalisation...");
        } else {
            setFilesizeProgressBar(formatBytes(event.fileCurrent)+"/"+formatBytes(event.fileMax));
        }
    }
    // Infos et progress bar total
    if (event.hasOwnProperty("totalProgression")) {
        setTotalProgressionProgressBar(event.totalProgression);
    }
    if (event.hasOwnProperty("nbFiles") && event.hasOwnProperty("nbFilesCompleted")) {
        setTotalFileNbProgressBar(event.nbFilesCompleted, event.nbFiles);
    }
    if (event.hasOwnProperty("totalCurrent") && event.hasOwnProperty("totalMax")) {
        setTotalSizeProgressBar(event.totalCurrent, event.totalMax);
    }
}

function onEventMessage(event) {
    if (event.message) {
        addHistory(event.message);
    }
    if (event.lastStatus) {
        editHistory(event.lastStatus);
    }
    if (event.asyncMessage) {
        addAsyncHistory(event.asyncMessage);
    }
}

function onEventNewImage(event) {
    // On va chercher la vignette
    // Get thumbail
    $.get("imageThumbnail.php", {url: event.fileUrl})
        .done(function(data) {
            let jsonData = JSON.parse(data);
            if (jsonData.result === "success") {
                let div = document.createElement("div");
                $(div)
                    .append("<div class=\"image\"><img src=\"data:image/png;base64,"+jsonData.thumbnail+"\" /></div>")
                    .append("<div class=\"filename\">" + event.fileName+"</div>")
                    .append("<div class=\"filesize\">" + formatBytes(event.fileSize) + "</div>")
                    .appendTo("#galerieInfo > div");
            } else {
                addGalerieItem('fa-image', event.url, event.fileSize, event.fileName);
            }
        })
        .fail(function(/*data*/) {
            addGalerieItem('fa-image', event.url, event.fileSize, event.fileName);
        });

}

function onEventNewFile(event) {
    // On ajoute une vignette à la galerie
    let icon = "fa-file";
    switch (event.fileType) {
        case "application/x-gzip":
            icon = "fa-file-archive";
            break;
        case "application/pdf":
            icon= "fa-file-pdf";
            break;
        case "text/plain":
            icon = "fa-file-alt";
            break;
        case "application/vnd.oasis.opendocument.spreadsheet":
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
            icon = "fa-file-excel";
            break;
        case "application/vnd.oasis.opendocument.text":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            icon = "fa-file-word";
            break;
        default:
            break;
    }
    addGalerieItem(icon, event.fileUrl, event.fileSize, event.fileName);
}


// Routage des évènement
function onDropperEvent(event) {
    switch (event.type) {
        case "start":
            onEventStart(event);
            break;
        case "progress":
            onEventProgress(event);
            break;
        case "end":
            onEventEnd(event);
            break;
        case "newImage":
            onEventNewImage(event);
            break;
        case "newFile":
            onEventNewFile(event);
            break;
        case "message":
            onEventMessage(event);
            break;
        default:
            break;
    }

}

$(document).ready(function (){
    /* global Dropper */
    let dropper = new Dropper({
        dropZone: "#dropfile",
        onEvent: onDropperEvent,
        usernameField: "#username",
        emailField: "#email"
    });
});
