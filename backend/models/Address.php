<?php
class Address {
    private $conn;
    private $table_name = "addresses";

    public $id;
    public $street;
    public $house_number;
    public $country;
    public $city;
    public $postal_code;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET street=:street, house_number=:house_number, country=:country, city=:city, postal_code=:postal_code";

        $stmt = $this->conn->prepare($query);

        $this->street = htmlspecialchars(strip_tags($this->street));
        $this->house_number = htmlspecialchars(strip_tags($this->house_number));
        $this->country = htmlspecialchars(strip_tags($this->country));
        $this->city = htmlspecialchars(strip_tags($this->city));
        $this->postal_code = htmlspecialchars(strip_tags($this->postal_code));

        $stmt->bindParam(":street", $this->street);
        $stmt->bindParam(":house_number", $this->house_number);
        $stmt->bindParam(":country", $this->country);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":postal_code", $this->postal_code);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        // error_log("Error creating address: " . $stmt->errorInfo()[2]); // For debugging
        return false;
    }

    public function update() {
        if (empty($this->id)) {
            // error_log("Address update attempted without an ID.");
            return false;
        }

        $query = "UPDATE " . $this->table_name . "
                  SET street=:street, house_number=:house_number, country=:country, city=:city, postal_code=:postal_code
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->street = htmlspecialchars(strip_tags($this->street));
        $this->house_number = htmlspecialchars(strip_tags($this->house_number));
        $this->country = htmlspecialchars(strip_tags($this->country));
        $this->city = htmlspecialchars(strip_tags($this->city));
        $this->postal_code = htmlspecialchars(strip_tags($this->postal_code));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":street", $this->street);
        $stmt->bindParam(":house_number", $this->house_number);
        $stmt->bindParam(":country", $this->country);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":postal_code", $this->postal_code);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        // error_log("Error updating address: " . $stmt->errorInfo()[2]); // For debugging
        return false;
    }

    public function readOne() {
        $query = "SELECT street, house_number, country, city, postal_code
                  FROM " . $this->table_name . "
                  WHERE id = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->street = $row['street'];
            $this->house_number = $row['house_number'];
            $this->country = $row['country'];
            $this->city = $row['city'];
            $this->postal_code = $row['postal_code'];
            return true;
        }
        return false;
    }
}

?>