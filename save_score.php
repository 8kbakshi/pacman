<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pacman";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fix: use 'username' as expected from JS
$name = $_POST['username'];
$score = $_POST['score'];

$sql = "INSERT INTO scores (username, score) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $name, $score);

if ($stmt->execute()) {
    echo "Score saved!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();