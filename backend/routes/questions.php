<?php
ob_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- Include required files ---
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/QuestionController.php';

try {
    // --- Initialize DB ---
    $database = new Database();
    $conn = $database->getConnection();
    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $controller = new QuestionController($conn);

    // --- GET all questions ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $questions = $controller->index(); // should return array
        echo json_encode(["success" => true, "questions" => $questions]);
        exit;
    }

    // --- POST: create new question ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            throw new Exception("Invalid JSON payload");
        }

        // Validate required fields
        $required = ['question', 'answer', 'category', 'description', 'difficulty', 'user_id'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }

        // Create question
        $newId = $controller->create($data, true);

        $output = json_encode([
            "success" => true,
            "id" => $newId
        ]);

        $buffer = ob_get_clean();
        if (!empty($buffer)) {
            error_log("Unexpected output before JSON: " . $buffer);
        }

        echo $output;
        exit;
    }

    // --- Unsupported method ---
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
    exit;
}