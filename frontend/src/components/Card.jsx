import { useEffect, useState } from "react";
import Form from "../components/Form";

const Card = ({ questions }) => {
  const [user, setUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const baseURL = "http://localhost:8000";

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("session_token");

  const fields = [
    { name: "answer", label: "Your answer*", type: "text", required: true },
  ];

  // Fetch user details and answered questions
  useEffect(() => {
    if (userId && token) {
      // Fetch user
      fetch(`${baseURL}/routes/auth.php?action=getUserDetails&id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);

            // Fetch answered questions for this user
            fetch(`${baseURL}/routes/user_answers.php?user_id=${data.user.id}`)
              .then((res) => res.json())
              .then((answeredData) => {
                if (answeredData.success) {
                  setAnsweredQuestions(answeredData.answered);

                  // Skip already answered questions
                  const firstUnansweredIndex = questions.findIndex(
                    (q) =>
                      !answeredData.answered.some((a) => a.question_id === q.id)
                  );
                  setCurrentIndex(
                    firstUnansweredIndex >= 0
                      ? firstUnansweredIndex
                      : questions.length
                  );
                }
              })
              .catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, [userId, token, questions]);

  const handleSubmit = async (formData, question, resetForm) => {
    if (!user) return { success: false, message: "User not logged in" };

    const payload = {
      user_id: user.id,
      question_id: question.id,
      user_answer: formData.answer,
    };

    try {
      const response = await fetch(`${baseURL}/routes/user_answers.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Save question in answeredQuestions state
      setAnsweredQuestions((prev) => [
        ...prev,
        {
          ...question,
          user_answer: formData.answer,
          preferred_answer: data.preferred_answer || question.answer,
          correct: data.success,
          question_id: question.id,
        },
      ]);

      if (data.success) {
        setCurrentIndex((prev) => prev + 1); // Move to next question
        resetForm(); // Reset input field
      }

      return data;
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "Something went wrong submitting your answer",
      };
    }
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "easy";
      case "medium":
        return "medium";
      case "advanced":
        return "advanced";
      default:
        return "easy";
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    const order = { easy: 1, medium: 2, advanced: 3 };
    return (
      order[a.difficulty.toLowerCase()] - order[b.difficulty.toLowerCase()]
    );
  });

  const currentQuestion =
    sortedQuestions.length > 0 && currentIndex < sortedQuestions.length
      ? sortedQuestions[currentIndex]
      : null;

  return (
    <div className="cards-container">
      {/* Admin view */}
      {user?.role && user.role.trim().toLowerCase() === "admin" && (
        <div className="cards-grid">
          {sortedQuestions.map((q) => (
            <div key={q.id} className="card">
              <h3>
                #{q.id}: {q.question}
              </h3>
              <p>
                <strong>Category:</strong> {q.category}
              </p>
              <div className="block">
                <p>
                  <strong>Difficulty:</strong>
                </p>
                <p className={getDifficultyClass(q.difficulty)}>
                  {q.difficulty}
                </p>
              </div>
              <p>
                <strong>Answer:</strong> {q.answer}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* User view */}
      <div className="cards-grid">
        {user?.role?.trim().toLowerCase() !== "admin" && currentQuestion && (
          <div className="card">
            <h3>
              #{currentQuestion.id}: {currentQuestion.question}
            </h3>
            <div className="block">
              <p>
                <strong>Difficulty:</strong>
              </p>
              <p className={getDifficultyClass(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </p>
            </div>
            <div className="form">
              <Form
                fields={fields}
                buttonText="Submit"
                onSubmit={(formData, resetForm) =>
                  handleSubmit(formData, currentQuestion, resetForm)
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Answered questions */}
      {answeredQuestions.length > 0 && (
        <>
          <h2>Answered Questions</h2>
          <div className="cards-grid">
            {answeredQuestions.map((q) => (
              <div key={q.id} className="card">
                <h3>
                  #{q.id}: {currentQuestion.question}
                </h3>
                <div className="block">
                  <p>
                    <strong>Difficulty:</strong>
                  </p>
                  <p className={getDifficultyClass(currentQuestion.difficulty)}>
                    {currentQuestion.difficulty}
                  </p>
                </div>
                <p>
                  <strong>Your Answer:</strong> {q.user_answer}
                </p>
                <p>
                  <strong>Correct Answer:</strong> {q.preferred_answer}
                </p>
                <p>
                  <strong>Status:</strong> ✅ Correct
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Card;