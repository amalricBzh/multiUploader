<?php

?><html>
<header>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="dropfile.css">
</header>
<body>
    <h1>Drag and drop test</h1>

    <div id="dropfile" class="mainRow">Déposez un ou plusieurs fichiers ici.</div>

    <div class="mainRow"><div id="dropfileinfomessage"></div><div id="dropfileinfosize"></div></div>
    <div id="barFile" class="progress mainRow" data-label="Pas de transfert en cours...">
        <span class="value"></span>
    </div>

    <div class="mainRow"><div id="droptotalinfomessage"></div><div id="droptotalinfosize"></div></div>
    <div id="barTotal" class="progress mainRow" data-label="Pas de transfert en cours...">
        <span class="value"></span>
    </div>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="dropfile.js"></script>
</body>

</html>
