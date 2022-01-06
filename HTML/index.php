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

$query = $pdo->prepare('SELECT * FROM foodlex.land_produkt');
$query->execute();
$food_country = $query->fetchAll();
$food_country = json_encode($food_country);
?>

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>HTML5 Tetris</title>
        <link rel='stylesheet' href='../CSS/style.css'/>
    </head>
    <body>
    <canvas id="tetris-canvas" width='450' height='900'></canvas>
    <canvas id="basket-canvas" width='450' height='90'></canvas>
    <button id="playbutton" onclick="playButtonClicked();">Play</button>

    <script src='../JS/food.js'></script>
    <script src='../JS/tetris.js'></script>
    <script src='../JS/baskets.js'></script>
    <script src='../JS/controller.js'></script>
    <script src='../JS/render.js'></script>
    <script>
        const foodNames = <?php echo $foodNames; ?>;
        const foodsToCountries = <?php echo $food_country; ?>;
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
        console.log(foodsToCountries)

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

    </script>
    </body>
    </html>

<?php
?>