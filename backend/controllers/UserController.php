<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Address.php';

class UserController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function register($data) {
        if (empty($data['name']) || empty($data['surname']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Please fill all required fields.'];
        }

        $user = new User($this->conn);
        $user->name = $data['name'];
        $user->surname = $data['surname'];
        $user->email = $data['email'];

        if ($user->emailExists()) {
            http_response_code(409);
            return ['success' => false, 'message' => 'Email already registered.'];
        }
        
        $user->password_hash = password_hash($data['password'], PASSWORD_BCRYPT);
        
        $address = new Address($this->conn);
        
        try {
            // Step 1: Create the Address record first to get a valid ID
            if (!$address->create()) {
                http_response_code(500);
                return ['success' => false, 'message' => 'Failed to prepare address for user.'];
            }
            
            // Step 2: Use the new address ID to create the User record
            $user->address_id = $address->id; 
            if (!$user->create()) {
                http_response_code(500);
                return ['success' => false, 'message' => 'Registration failed. User creation failed.'];
            }
            
            http_response_code(201);
            return ['success' => true, 'message' => 'Registration successful! Please complete your address.', 'user' => ['id' => $user->id, 'email' => $user->email], 'address_id' => $address->id];
        } catch (Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => 'A server error occurred: ' . $e->getMessage()];
        }
    }

    public function login($data) {
        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Please enter email and password.'];
        }

        $user = new User($this->conn);
        $user->email = $data['email'];

        $user_data = $user->getUserByEmail();
        
        if ($user_data && password_verify($data['password'], $user_data['password_hash'])) {
            http_response_code(200);
            return ['success' => true, 'message' => 'Login successful!', 'user' => ['id' => $user_data['id'], 'name' => $user_data['name'], 'email' => $user_data['email'], 'role' => $user_data['role']], 'token' => 'dummy_jwt_token'];
        } else {
            http_response_code(401);
            return ['success' => false, 'message' => 'Invalid email or password.'];
        }
    }

    public function updateAddress($data, $addressId) {
        if (empty($addressId)) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Address ID is required for update.'];
        }

        if (
            empty($data['street']) ||
            empty($data['house_number']) ||
            empty($data['country']) ||
            empty($data['city']) ||
            empty($data['postal_code'])
        ) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Please fill all required address fields.'];
        }

        $address = new Address($this->conn);
        $address->id = $addressId;

        if (!$address->readOne()) {
            http_response_code(404);
            return ['success' => false, 'message' => 'Address not found.'];
        }

        $address->street = $data['street'];
        $address->house_number = $data['house_number'];
        $address->country = $data['country'];
        $address->city = $data['city'];
        $address->postal_code = $data['postal_code'];

        if ($address->update()) {
            http_response_code(200);
            return ['success' => true, 'message' => 'Address updated successfully!'];
        } else {
            http_response_code(500);
            return ['success' => false, 'message' => 'Failed to update address.'];
        }
    }

    public function getUserDetails($userId) {
        if (empty($userId)) {
            http_response_code(400);
            return ['success' => false, 'message' => 'User ID is required.'];
        }

        $user = new User($this->conn);
        $user_data = $user->findById($userId);

        if ($user_data) {
            unset($user_data['password_hash']);
            http_response_code(200);
            return ['success' => true, 'user' => $user_data];
        } else {
            http_response_code(404);
            return ['success' => false, 'message' => 'User not found.'];
        }
    }

    public function readAddress($addressId) {
        if (empty($addressId)) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Address ID is required.'];
        }

        $address = new Address($this->conn);
        $address->id = $addressId;

        if ($address->readOne()) {
            http_response_code(200);
            return ['success' => true, 'address' => [
                'street' => $address->street,
                'house_number' => $address->house_number,
                'country' => $address->country,
                'city' => $address->city,
                'postal_code' => $address->postal_code
            ]];
        } else {
            http_response_code(404);
            return ['success' => false, 'message' => 'Address not found.'];
        }
    }

    public function updateProfile($data, $userId) {
        if (empty($userId)) {
            http_response_code(400);
            return ['success' => false, 'message' => 'User ID is required for update.'];
        }

        $user = new User($this->conn);
        $user->id = $userId;

        if (isset($data['name'])) $user->name = $data['name'];
        if (isset($data['surname'])) $user->surname = $data['surname'];
        if (isset($data['email'])) $user->email = $data['email'];

        if ($user->update()) {
            http_response_code(200);
            return ['success' => true, 'message' => 'Profile updated successfully!'];
        } else {
            http_response_code(500);
            return ['success' => false, 'message' => 'Failed to update profile.'];
        }
    }
}

?>