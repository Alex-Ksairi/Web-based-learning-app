<?php

header("Content-Type: text/plain"); 

require_once __DIR__ . '/../config/db.php';

$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    echo "Database connection successful! 🎉\n";
    echo "Host: " . $_ENV['DB_HOST'] . "\n";
    echo "Database Name: " . $_ENV['DB_NAME'] . "\n";

    try {
        $stmt = $conn->query("SELECT 1");
        if ($stmt) {
            echo "Simple query executed successfully.\n";
        } else {
            echo "Simple query failed.\n";
        }
    } catch (PDOException $e) {
        echo "Simple query error: " . $e->getMessage() . "\n";
    }
} else {
    echo "Database connection failed. 😞\n";
    echo "Please check your database server status and credentials in your .env file.\n";
}
?>