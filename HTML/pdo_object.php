<?php
// PDO initialization
$server = 'mysql:dbname=foodlex;host=localhost';
$username = 'root';
$password = '';
$opt = array
(
    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
);

try {
    $pdo = new PDO($server, $username, $password, $opt);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $error) {
    die('Verbindung fehlgeschlagen: ' . $error->getMessage());
}
?>