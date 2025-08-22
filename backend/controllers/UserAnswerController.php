<?php
require_once __DIR__ . '/../models/UserAnswer.php';
require_once __DIR__ . '/../models/Answer.php';

class UserAnswerController {
    private $db;
    private $userAnswerModel;
    private $answerModel;

    public function __construct($db) {
        $this->db = $db;
        $this->userAnswerModel = new UserAnswer($db);
        $this->answerModel = new Answer($db);
    }

    public function submitAnswer($data) {
        if (!isset($data['user_id'], $data['question_id'], $data['user_answer'])) {
            return ["success" => false, "message" => "Missing required fields"];
        }

        $user_id = $data['user_id'];
        $question_id = $data['question_id'];
        $user_answer = trim(strtolower($data['user_answer']));

        // Get correct answer row
        $answerRow = $this->answerModel->getAnswerByQuestionId($question_id);
        if (!$answerRow) {
            return ["success" => false, "message" => "No answer available for this question"];
        }

        $answer_id = $answerRow['id'];
        $correct   = strtolower($answerRow['answer_text']);

        if ($user_answer === $correct) {
            // Save correct answer
            $this->userAnswerModel->save($user_id, $question_id, $answer_id, $user_answer, $correct);

            return [
                "success" => true,
                "message" => "Great, you answered correctly!",
                "preferred_answer" => $correct
            ];
        } elseif (levenshtein($user_answer, $correct) <= 3) {
            return [
                "success" => false,
                "message" => "Almost there! Here's a hint: " . substr($correct, 0, 3) . "..."
            ];
        }

        return ["success" => false, "message" => "Wrong answer. Try again!"];
    }

    public function getAnsweredQuestions($user_id) {
        $answered = $this->userAnswerModel->getAnsweredByUser($user_id);
        return ["success" => true, "answered" => $answered];
    }
}