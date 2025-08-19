<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Set CORS headers if the origin is allowed
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400'); // Cache preflight response for 24 hours
    header('Content-Type: application/json');
}

// Handle preflight OPTIONS requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../controllers/UserController.php';

$userController = new UserController();

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

$request_data = [];
if ($method === 'POST') {
    $json_data = file_get_contents("php://input");
    $request_data = json_decode($json_data, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
        exit();
    }
}

switch ($action) {
    case 'register':
        if ($method === 'POST') {
            echo json_encode($userController->register($request_data));
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed for register.']);
        }
        break;

    case 'login':
        if ($method === 'POST') {
            echo json_encode($userController->login($request_data));
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed for login.']);
        }
        break;

    case 'updateAddress':
        if ($method === 'POST') {
            $addressId = $_GET['id'] ?? null;
            echo json_encode($userController->updateAddress($request_data, $addressId));
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed for updateAddress.']);
        }
        break;

    case 'getUserDetails':
        if ($method === 'GET') {
            $userId = $_GET['id'] ?? null;
            echo json_encode($userController->getUserDetails($userId));
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed for getUserDetails.']);
        }
        break;

    case 'readAddress':
        if ($method === 'GET') {
            $addressId = $_GET['id'] ?? null;
            echo json_encode($userController->readAddress($addressId));
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed for readAddress.']);
        }
        break;

    case 'updateProfile':
        if ($method === 'POST') {
            $userId = $_GET['id'] ?? null;
            echo json_encode($userController->updateProfile($request_data, $userId));
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed for updateProfile.']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action or missing action parameter.']);
        break;
}

?>