<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $surname;
    public $email;
    public $password_hash;
    public $address_id;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create a new user record
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET name=:name, surname=:surname, email=:email, role=:role, password_hash=:password_hash, address_id=:address_id";

        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->surname = htmlspecialchars(strip_tags($this->surname));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password_hash = htmlspecialchars(strip_tags($this->password_hash));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->address_id = htmlspecialchars(strip_tags($this->address_id));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":surname", $this->surname);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":password_hash", $this->password_hash);
        $stmt->bindParam(":address_id", $this->address_id);

        // Execute query
        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Check if email already exists
    public function emailExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Get user details by email for login
    public function getUserByEmail() {
        $query = "SELECT id, name, surname, email, role, password_hash, address_id
                  FROM " . $this->table_name . "
                  WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row;
    }

    // Find user by ID
    public function findById($id) {
        $query = "SELECT id, name, surname, email, password_hash, role, address_id
                  FROM " . $this->table_name . "
                  WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row;
    }

    // Update user record
    public function update() {
        if (empty($this->id)) {
            error_log("User update attempted without an ID.");
            return false;
        }

        $query_parts = [];
        $params = [];

        if (isset($this->name)) {
            $query_parts[] = "name=:name";
            $params[':name'] = htmlspecialchars(strip_tags($this->name));
        }
        if (isset($this->surname)) {
            $query_parts[] = "surname=:surname";
            $params[':surname'] = htmlspecialchars(strip_tags($this->surname));
        }
        if (isset($this->email)) {
            $query_parts[] = "email=:email";
            $params[':email'] = htmlspecialchars(strip_tags($this->email));
        }
        
        if (isset($this->address_id)) {
            $query_parts[] = "address_id=:address_id";
            $params[':address_id'] = htmlspecialchars(strip_tags($this->address_id));
        }


        if (empty($query_parts)) {
            error_log("No fields provided for user update for ID: " . $this->id);
            return false;
        }

        $query = "UPDATE " . $this->table_name . " SET " . implode(", ", $query_parts) . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $params[':id'] = htmlspecialchars(strip_tags($this->id));

        foreach ($params as $key => &$val) {
            $stmt->bindParam($key, $val);
        }

        try {
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("User update error: " . $e->getMessage());
            return false;
        }
    }
}
?>