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

// eslint-disable complexity
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
    //console.log("onDropperEvent", event);

    if (event.type && event.type === "message") {
        //console.log(event);
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

    if (event.type && event.type === "image") {
        //console.log ("Image => ", event);
    }
}
// eslint-enable complexity

let dropper = new Dropper({
    dropZone: "#dropfile",
    onEvent: onDropperEvent,
    usernameField: "#username",
    emailField: "#email"
});