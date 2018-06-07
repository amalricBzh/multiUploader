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



// Event management functions
function onEventStart(event) {
    setFilenameProgressBar(event.filename);
    setFilesizeProgressBar(formatBytes(event.fileCurrent)+"/"+formatBytes(event.fileMax));
    setTotalFileNbProgressBar(event.nbFilesCompleted, event.nbFiles);
    setTotalSizeProgressBar(event.totalCurrent, event.totalMax);
    $("#dropfile").html("Transfert en cours...");
    $("#dropInfo").show();
}

function onEventEnd(/* event */) {
    $("#dropfile").html("Déposez un ou plusieurs fichiers ici.");
    $("#dropfileinfosize").html("Terminé.");
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
    if (event.galerie) {
        let galerieDiv = $("#galerieInfo > div") ;
        galerieDiv.html("")
            .append("Un album a été créé, vous pouvez le visualiser en suivant ce lien&nbsp;: ");
        $("<a>",{
            text: "Galerie photo",
            title: "Lien vers vos photos téléchargées",
            href: "files/"+event.galerie+"/",
            target: "_blank",

        }).appendTo("#galerieInfo > div");
        galerieDiv.append(". Si vous ne rechargez pas cette page, les nouvelles photos que vous enverrez " +
            "seront ajoutez à ce même album.");
        setTimeout(function(){
            $("#dropInfo").fadeOut();
            $("#galerieInfo").fadeIn();
        }, 1000);
    }
}

function onEventImage(event) { }


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
        case "image":
            onEventImage(event);
            break;
        case "message":
            onEventMessage(event);
            break;
        default:
            break;
    }

}

/* global Dropper */
let dropper = new Dropper({
    dropZone: "#dropfile",
    onEvent: onDropperEvent,
    usernameField: "#username",
    emailField: "#email"
});