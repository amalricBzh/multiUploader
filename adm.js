
function startZipAnimation(galerie) {
    $("span.cog[data-id=\""+galerie+"\"]")
        .find("[data-fa-i2svg]")
        .addClass("fa-spin");
}

function stopZipAnimation(galerie) {
    $("span.cog[data-id=\""+galerie+"\"]")
        .find("[data-fa-i2svg]")
        .removeClass("color-green")
        .removeClass("fa-spin");
}

function setCogOk(galerie) {
    $("span.cog[data-id=\""+galerie+"\"]")
        .find("[data-fa-i2svg]")
        .removeClass("color-red")
        .addClass("color-green");
}

function setCogKo(galerie) {
    $("span.cog[data-id=\""+galerie+"\"]")
        .find("[data-fa-i2svg]")
        .removeClass("color-green")
        .addClass("color-red");
}

function setCogNormal(galerie) {
    $("span.cog[data-id=\""+galerie+"\"]")
        .find("[data-fa-i2svg]")
        .removeClass("color-green")
        .removeClass("color-red");
}

function removeCog(galerie) {
    $("span.cog[data-id=\""+galerie+"\"]")
        .remove();
}

function addDownload(galerie, zipFile) {
    // Get zip number
    let number = zipFile.split(".")[1];
    let badge = "<span class=\"fa-layers-counter download-badge\">" + number + "</span>";
    let icon = "<i class=\"fas fa-download\"></i>" + badge ;
    let container = "<span class=\"fa-layers fa-fw\">" + icon + "</span>";
    $(".icons[data-id=\""+galerie+"\"]").append(" <a href=\""+zipFile+"\">"+container+"</a>");
}


function generateZip(galerie) {
    setCogOk(galerie);
    $.get("ph-zip.php?g="+galerie)
        .done(function(data) {
            setCogNormal(galerie);
            let jsonData = JSON.parse(data);
            // S'il y a un/des nouveaux zip
            if (jsonData.newZip.length > 0) {
                jsonData.newZip.forEach(function(element){
                    addDownload(galerie, element);
                });
            }

            if (jsonData.todo.length > 0) {
                setCogNormal(galerie);
                setTimeout(function(){
                    generateZip(galerie);
                }, 180);
            } else {
                stopZipAnimation(galerie);
                removeCog(galerie);
            }
        })
        .fail(function(/*data*/) {
            stopZipAnimation(galerie);
            setCogKo(galerie);
        });
}


$(document).ready(function (){
    $("span.cog").one("click", function(event){
        event.preventDefault();
        event.stopPropagation();
        let galerie = $(this).data("id") ;
        startZipAnimation(galerie);
        generateZip(galerie);
        return false ;
    });
});


