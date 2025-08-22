<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/UserAnswerController.php';

header("Content-Type: application/json");

$database = new Database();
$db = $database->getConnection();

$controller = new UserAnswerController($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode($controller->submitAnswer($data));
} elseif ($method === "GET" && isset($_GET['user_id'])) {
    // New block to handle GET requests
    $user_id = $_GET['user_id'];
    echo json_encode($controller->getAnsweredQuestions($user_id));
} else {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}