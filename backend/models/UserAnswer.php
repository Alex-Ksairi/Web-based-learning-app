<?php
class UserAnswer {
    private $conn;
    private $table = "user_answers";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function save($user_id, $answer_id, $user_answer, $preferred_answer) {
        $query = "INSERT INTO {$this->table} 
                  (user_id, answer_id, user_answer, preferred_answer) 
                  VALUES (:user_id, :answer_id, :user_answer, :preferred_answer)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->bindParam(":answer_id", $answer_id, PDO::PARAM_INT);
        $stmt->bindParam(":user_answer", $user_answer, PDO::PARAM_STR);
        $stmt->bindParam(":preferred_answer", $preferred_answer, PDO::PARAM_STR);

        return $stmt->execute();
    }

    public function getAnsweredByUser($user_id) {
        $query = "SELECT ua.*, a.answer_text, q.question_text, q.difficulty 
                  FROM {$this->table} ua
                  JOIN answers a ON ua.answer_id = a.id
                  JOIN questions q ON a.question_id = q.id
                  WHERE ua.user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}


/*
require_once __DIR__ . '/../config/db.php';

class UserAnswer {
    private $conn;
    private $table = "user_answers";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function save($user_id, $answer_id, $user_answer, $preferred_answer) {
        $query = "INSERT INTO " . $this->table . " (user_id, answer_id, user_answer, preferred_answer) 
                  VALUES (:user_id, :answer_id, :user_answer, :preferred_answer)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":answer_id", $answer_id);
        $stmt->bindParam(":user_answer", $user_answer);
        $stmt->bindParam(":preferred_answer", $preferred_answer);

        return $stmt->execute();
    }
}
*/