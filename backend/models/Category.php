<?php
class Category {
    private $conn;
    private $table = "question_categories";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Check if category exists by name, otherwise insert it
    public function createOrGetId($name, $description) {
        // Check if exists
        $sql = "SELECT id FROM {$this->table} WHERE name = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $name);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            return $row['id'];
        }

        // Insert new category
        $sql = "INSERT INTO {$this->table} (name, description) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $name);
        $stmt->bindParam(2, $description);
        $stmt->execute();

        return $this->conn->lastInsertId();
    }

    // Get category name by id
    public function getCategoryNameById($id) {
        $sql = "SELECT name FROM {$this->table} WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['name'] : null;
    }

    public function getDescriptionById($id) {
        $sql = "SELECT description FROM {$this->table} WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['description'] : null;
    }
}