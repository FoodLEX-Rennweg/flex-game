<?php
$pdo = 0;
include('pdo_object.php');
$query = $pdo->prepare('SELECT bezeichnung FROM foodlex.produkt');
$query->execute();

$foodNames = array();
foreach ($query as $row) {
    $foodNames[] = $row['bezeichnung'];
}
$foodNames = json_encode($foodNames);

$query = $pdo->prepare('SELECT bezeichnung FROM foodlex.land');
$query->execute();

$flagNames = array();
foreach ($query as $row) {
    $flagNames[] = $row['bezeichnung'];
}
$flagNames = json_encode($flagNames);

$query = $pdo->prepare('SELECT * FROM foodlex.land_produkt');
$query->execute();
$food_country = $query->fetchAll();
$food_country = json_encode($food_country);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>FoodLEX | Game</title>
    <link rel='stylesheet' href='../CSS/style.css'/>
</head>
<body>
<div class="center-container results-container">
    <div class="results">
        <div class="results-txt">
            <h1>Glückwunsch!</h1>
            <h2>Dein Fußabdruck beträgt:</h2>
            <span class="co2" id="co2-span">0 </span>
            <span class="co2">&nbsp;Fußabdruck</span>
            <br>
            <button class="back-btn" onclick="location.reload()">Zurück</button>
        </div>
        <div class="results-list">
            <h2>Falsch zugeordnete Produkte</h2>

            <div id="wrong-list">
            </div>

        </div>
    </div>
</div>

<div class="tutorial">
    <div class="tutorial-content">
        <h1>Willkommen zum Spiel</h1>

        <h2>Wie man spielt:</h2>
        <p>Zu Beginn des Spiels wird eine zufällige Jahreszeit zugewiesen, in der du sozusagen "einkaufst".</p>
        <p>
            - In immer schneller werdenden Zeitabständen werden von oben Lebensmittel herunterfallen, welche zu der
            derzeitigen
            Jahreszeit entweder <br/>
            <span class="bold">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Regional</span>
            <img src="../media/flags/1.png">
            <br/>oder<br/>
            <span class="bold">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nicht Regional</span>
            <img src="../media/flags/globe.png">
            <br/>sein können
        </p>
        <p>- Deine Aufgabe ist es, die fallenden Lebensmittel in die richtige Körbe fallen zu lassen um Punkte zu
            bekommen.
        </p>

        <p>Zusätzliche Punkte bekommt man, wenn man das Lebensmittel dem richtigen Land zuordnen kann</p>
        <p>- Verwende die Pfeiltasten 🡐 🡒 🡓 um die Lebensmittel nach links, rechts oder unten zu schieben</p>
    </div>
    <button class="close-btn" onclick="dismiss(this);">Schließen</button>

</div>

<div class="center-container">
    <div class="container">
        <div class="season">
            <div class="season-image-container">
                <img id="season-img" src="../media/seasons/1.png">
            </div>
            <span>SAISON</span>
        </div>
        <div class="game">
            <canvas id="tetris-canvas" width='600' height='800'></canvas>
            <canvas id="basket-canvas" width='600' height='90'></canvas>
        </div>
        <div class="ui-right">
            <div class="score">
                <div>SCORE:</div>
                <div id="score-txt">0</div>
            </div>
            <div class="timer">
                <span id="timer-span">00:00</span>
            </div>
            <div class="food-name">
                <span id="food-name-span">NAME</span>
            </div>
        </div>
        <div class="buttons">

            <button class="ui-btn" id="info-btn" onclick="showTutorial()">
                <img src="../media/icons/info.svg" class="filter-white"/>
            </button>

            <button class="ui-btn" id="play-btn" onclick="startGame();">
                <img src="../media/icons/play.svg" class="filter-white"/>
            </button>

            <button class="ui-btn" id="retry-btn" onclick="retryGame();">
                <img src="../media/icons/undo.svg" class="filter-white"/>
            </button>

            <button class="ui-btn" id="home-btn" onclick="location.href='http://foodlex.42web.io/'">
                <img src="../media/icons/home.svg" class="filter-white"/>
            </button>
        </div>
    </div>

</div>


<script src='../JS/food.js'></script>
<script src='../JS/tetris.js' defer></script>
<script src='../JS/baskets.js'></script>
<script src='../JS/flags.js'></script>
<script src='../JS/controller.js'></script>
<script src='../JS/render.js' defer></script>
<script>
    const foodNames = <?php echo $foodNames; ?>;
    const foodsToCountries = <?php echo $food_country; ?>;
    const flagNames = <?php echo $flagNames; ?>;
    foodsToCountries.forEach(e => {
        delete e['0'];
        delete e['1'];
        delete e['2'];
        delete e['3'];
    });

    let foodIcons = [];
    for (let i = 0; i < foodNames.length; i++) {
        let img = new Image();
        img.src = '../media/food-icons/' + (i + 1) + '.png';
        foodIcons.push(img);
    }

    const flagImages = [];

    for (let i = 0; i < flagNames.length; i++) {
        let img = new Image();
        img.src = '../media/flags/' + (i + 1) + '.png';
        flagImages.push(img);
    }

    console.log(foodsToCountries)
    console.log(flagNames)

    const globeImg = new Image();
    globeImg.src = '../media/flags/globe.png';

    let foodRegionalities = [];
    foodsToCountries.forEach(row => {
        let foodId = Number(row['FK_ProduktID']);

        let countryID = Number(row['FK_LandID']);
        let seasonId = Number(row['FK_JahresID']);
        let co2Usage = Number(row['CO2_Verbrauch']);
        if (!foodRegionalities[foodId - 1]) {
            foodRegionalities[foodId - 1] = {
                'R': 0,
                'NR': 0,
                'CO2': [0, 0],
            }
        }
        if (countryID === 1) {
            foodRegionalities[foodId - 1]['R'] = seasonId;
            foodRegionalities[foodId - 1]['CO2'][0] = co2Usage;
        } else {
            foodRegionalities[foodId - 1]['NR'] = countryID;
            foodRegionalities[foodId - 1]['CO2'][1] = co2Usage;
        }
    })
    console.log(foodRegionalities);


    window.onload = function () {
        currentCountries = getRandomizedCountries();
        renderBaskets();
    }

    function dismiss(element) {
        element.parentNode.style.opacity = '0';
        window.setTimeout(() => {
            element.parentNode.style.visibility = 'hidden';
        }, 600)
    }

    function showTutorial() {
        document.getElementsByClassName('tutorial')[0].style.opacity = '1';
        document.getElementsByClassName('tutorial')[0].style.visibility = 'visible';
    }
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script>
    $(document).ready(function () {
        if (!localStorage.getItem("pageloadcount")) {
            let tutorial = document.getElementsByClassName('tutorial')[0];
            tutorial.style.visibility = 'visible';
        }
        localStorage.setItem("pageloadcount", "1");
    });
</script>
</body>
</html>