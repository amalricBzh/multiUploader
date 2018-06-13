
$(document).ready(function (){
    $('.fa-cog').click(function(event){
        let galerie = $(event.target).data('id') ;
        $(event.target).addClass('fa-spin');
        generateZip(galerie);
    });
});


function generateZip(galerie) {
    $.get("ph-zip.php?g="+galerie)
        .done(function(data) {
            let jsonData = JSON.parse(data);
            if (jsonData.todo.length > 0) {
                console.log("Done, calling next.");
                setTimeout(function(){
                    generateZip(galerie);
                }, 180);
            } else {
                $('.fa-cog[data-id="'+galerie+'"]').removeClass('fa-spin');
                console.log("All done.");

            }
        })
        .fail(function(/*data*/) {
            console.log("FAILED");
        });
}