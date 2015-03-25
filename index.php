<html>
    <head>
        <script src="js/sigma.min.js"></script>
        <script src="js/sigma.parsers.json.min.js"></script>
        <script src="js/jquery-2.1.3.min.js"></script>
        <script src="js/plugins/sigma.layout.forceAtlas2.min.js" type="text/javascript"></script>
        <link rel="stylesheet" href="css/index.css">
    </head>
    <body>
        <div id="title">[TREE]</div>
        <div id="container"></div>
        <div id="menu">
            <ul>
                <li onClick="AddNode()">Ajouter</li>
                <li>Supprimer</li>
            </ul>
        </div>
        <div id="edit">
            <h2 id="node-name">[NODE]</h2>
            <p id="question"></p>
        </div>
    </body>
</html>
<script src="js/index.js"></script>