<?php
class Answer {
    private $conn;
    private $table = "answers";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create a new answer
    public function create($answer_text, $question_id) {
        $sql = "INSERT INTO {$this->table} (question_id, answer_text) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $question_id);
        $stmt->bindParam(2, $answer_text);
        $stmt->execute();
        return $this->conn->lastInsertId();
    }
    
    // Get answer text by question id
    public function getAnswerByQuestionId($question_id) {
        $sql = "SELECT id, answer_text FROM {$this->table} WHERE question_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $question_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}