<html>
<header>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css?family=Pinyon+Script|Lobster|Prompt|Racing+Sans+One|Share+Tech+Mono" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="dropfile.css">
    <title>21 juillet 2018 - Les photos</title>
    <link rel="icon" type="image/png" href="favicon.png" />
</header>
<body>
    <div id="spinner">
        <div class="lds-heart"><div></div></div>
    </div>

    <header>
        <h1>Les photos - 21 juillet 2018</h1>
    </header>

    <div class="mainRow infoChamps">
        Afin de nous permettre de reconnaître vos photos, merci de renseigner ces deux champs facultatifs&nbsp;:
    </div>
    <div class="mainRow">
        <input id="username" name="nom" placeholder="Vos prénom et nom" />

        <input id="email" name="email" placeholder="Votre email" />
    </div>
    <div id="dropfile" class="mainRow">Déposez un ou plusieurs fichiers ici.</div>

    <div id="dropInfo">
        <div class="mainRow"><div id="dropfileinfomessage"></div><div id="dropfileinfosize"></div></div>
        <div id="barFile" class="progress mainRow" data-label="Pas de transfert en cours...">
            <span class="value"></span>
        </div>

        <div class="mainRow"><div id="droptotalinfomessage"></div><div id="droptotalinfosize"></div></div>
        <div id="barTotal" class="progress mainRow" data-label="Pas de transfert en cours...">
            <span class="value"></span>
        </div>

        <div class="mainRow" id="history">
        </div>
    </div>
    <div id="galerieInfo" class="mainRow">

    </div>


    <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="dropfile.js"></script>
</body>

</html>
