// Remove spinner when all is loaded (especially web fonts)
$(window).bind("load", function(){
    $("#spinner").fadeOut(800, function() {
        $(this).hide();
    });
});
