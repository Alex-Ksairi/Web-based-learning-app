<?php

use Dotenv\Dotenv;

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host = $_ENV['DB_HOST'];
        $this->db_name = $_ENV['DB_NAME'];
        $this->username = $_ENV['DB_USERNAME'];
        $this->password = $_ENV['DB_PASSWORD'];
    }

    public function getConnection(){
        $this->conn = null;
        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception){
            error_log("Connection error: " . $exception->getMessage());
            return null;
        }

        return $this->conn;
    }
}

// --- TEMPORARY TEST BLOCK ---
// You can uncomment this section to test your connection
$testDb = new Database();
$testConnection = $testDb->getConnection();

if ($testConnection) {
    echo "Database connection successful! 🎉";
    try {
        $stmt = $testConnection->query("SELECT 1");
        if ($stmt) {
            echo "<br>Simple query executed successfully.";
        } else {
            echo "<br>Simple query failed.";
        }
    } catch (PDOException $e) {
        echo "<br>Simple query error: " . $e->getMessage();
    }
} else {
    echo "Database connection failed. Please check your credentials and database server status.";
}
// --- END TEMPORARY TEST BLOCK ---

?>