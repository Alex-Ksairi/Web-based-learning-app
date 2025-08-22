<?php
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../models/Question.php';
require_once __DIR__ . '/../models/Answer.php';
require_once __DIR__ . '/../models/User.php';

class QuestionController {
    private $questionModel;
    private $categoryModel;
    private $answerModel;
    private $userModel;

    public function __construct($db) {
        $this->questionModel = new Question($db);
        $this->categoryModel = new Category($db);
        $this->answerModel   = new Answer($db);
        $this->userModel   = new User($db);
    }

    public function create($data) {
        $userId       = $data['user_id'] ?? null;
        $questionText = trim($data['question'] ?? '');
        $answerText   = trim($data['answer'] ?? '');
        $categoryName = trim($data['category'] ?? '');
        $description  = trim($data['description'] ?? '');
        $difficulty   = trim($data['difficulty'] ?? '');

        if (!$userId || !$questionText || !$answerText || !$categoryName) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            exit();
        }

        // Verify user exists
        $user = $this->userModel->findById($userId);
        if (!$user) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid user_id"]);
            exit();
        }

        // Creates or gets category ID
        $categoryId = $this->categoryModel->createOrGetId($categoryName, $description);

        // --- Check for duplicate question in this category ---
        $existingQuestion = $this->questionModel->findByTextAndCategory($questionText, $categoryId);
        if ($existingQuestion) {
            http_response_code(409);
            echo json_encode([
                "success" => false,
                "message" => "This question already exists in the category '$categoryName'."
            ]);
            exit();
        }

        // Create question
        $questionId = $this->questionModel->create($questionText, $categoryId, $difficulty, $userId);
        if (!$questionId) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to create question"]);
            exit();
        }

        // Create answer
        $answerId = $this->answerModel->create($answerText, $questionId);
        if (!$answerId) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to create answer"]);
            exit();
        }

        echo json_encode([
            "success" => true,
            "question_id" => $questionId,
            "category_id" => $categoryId,
            "answer_id" => $answerId
        ]);
    }

    public function index() {
        $questions = $this->questionModel->readAll();
        $output = [];
        
        foreach ($questions as $q) {
            $categoryName = $this->categoryModel->getCategoryNameById($q['category_id']);
            $answerRow = $this->answerModel->getAnswerByQuestionId($q['id']);
            $answerText = $answerRow ? $answerRow['answer_text'] : null;
            $description = $this->categoryModel->getDescriptionById($q['category_id']);
            
            $output[] = [
                'id' => $q['id'],
                'question' => $q['question_text'],
                'answer' => $answerText,
                'category' => $categoryName,
                'description' => $description,
                'difficulty' => $q['difficulty']
            ];
        }
        
        http_response_code(200);
        return $output;
        exit;
    }
}