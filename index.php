<!doctype html><html>
<head>
    <meta charset="UTF-8" />
    <title>21 juillet 2018 - Les photos</title>
    <link href="https://fonts.googleapis.com/css?family=Pinyon+Script|Lobster|Prompt|Racing+Sans+One|Share+Tech+Mono" rel="stylesheet" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous" />
    <link rel="stylesheet" href="21juillet.css" />
    <link rel="stylesheet" href="dropfile.css" />
    <link rel="icon" type="image/png" href="favicon.png" />
</head>
<body>
    <div id="spinner">
        <div class="lds-heart"><div></div></div>
    </div>

    <header>
        <h1>Les photos - 21 juillet 2018</h1>
    </header>

    <article>

        <div class="mainRow infoChamps">
            Afin de nous permettre de reconnaître vos photos, merci de renseigner ces deux champs facultatifs&nbsp;:
        </div>
        <div class="mainRow">
            <input id="username" name="nom" placeholder="Vos prénom et nom" />

            <input id="email" name="email" placeholder="Votre email" />
        </div>
        <div id="dropfile" class="mainRow">Déposez un ou plusieurs fichiers ici.</div>

        <div id="dropInfo" class="mainRow">
            <div ><div id="dropfileinfomessage"></div><div id="dropfileinfosize"></div></div>
            <div id="barFile" class="progress mainRow" data-label="Pas de transfert en cours...">
                <span class="value"></span>
            </div>

            <div class="mainRow"><div id="droptotalinfomessage"></div><div id="droptotalinfosize"></div></div>
            <div id="barTotal" class="progress mainRow" data-label="Pas de transfert en cours...">
                <span class="value"></span>
            </div>
        </div>
        <div class="mainRow" id="history">
            <h2>Messages</h2>
            <div></div>
        </div>
        <div id="galerieInfo" class="mainRow">
            <h2>Galerie</h2>
            <div></div>
        </div>
    </article>

    <footer>
        <a href="https://github.com/amalricBzh/multiUploader" target="_blank"><i>multiUploader 0.1</i></a>
        codé pour l'occasion..<a href="ph-adm.php">.</a>
    </footer>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
    <script src="dropper.js"></script>
    <script src="dropfile.js"></script>
    <script src="21juillet.js"></script>
</body>

</html>
