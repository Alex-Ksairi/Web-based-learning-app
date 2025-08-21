<?php
class Question {
    private $conn;
    private $table = "questions";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create a new question
    public function create($question_text, $category_id, $difficulty, $user_id) {
        $sql = "INSERT INTO {$this->table} (category_id, user_id, question_text, difficulty)
                VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $category_id);
        $stmt->bindParam(2, $user_id);
        $stmt->bindParam(3, $question_text);
        $stmt->bindParam(4, $difficulty);
        $stmt->execute();
        return $this->conn->lastInsertId();
    }

    // Get all questions
    public function readAll() {
        $sql = "SELECT * FROM {$this->table} ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findByTextAndCategory($question_text, $category_id) {
        $sql = "SELECT * FROM {$this->table} WHERE question_text = ? AND category_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $question_text);
        $stmt->bindParam(2, $category_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}