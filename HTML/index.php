<?php
$myObject = [(object)['property' => 'Here we go', 'prop2' => 'here we not go']];
?>

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>HTML5 Tetris</title>
        <link rel='stylesheet' href='../CSS/style.css'/>
    </head>
    <body>
    <canvas id="tetris-canvas" width='150' height='300'></canvas>
    <canvas id="basket-canvas" width='150' height='30'></canvas>
    <button id="playbutton" onclick="playButtonClicked();">Play</button>

    <script src='../JS/food.js'></script>
    <script src='../JS/tetris.js'></script>
    <script src='../JS/baskets.js'></script>
    <script src='../JS/controller.js'></script>
    <script src='../JS/render.js'></script>
    <script>
        const js_data = '<?php echo json_encode($myObject); ?>';
        console.log(js_data);
        const js_obj_data = JSON.parse(js_data)[0];
        console.log(js_obj_data);
        console.log(js_obj_data['prop2']);
    </script>
    </body>
    </html>

<?php
?>