import { useEffect, useState } from "react";
import Form from "../components/Form";

const Card = ({ questions }) => {
  const [user, setUser] = useState(null);
  const baseURL = "http://localhost:8000";

  const fields = [
    {
      name: "answer",
      label: "Your answer*",
      type: "text",
      placeholder: "",
      required: true,
    },
  ];

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("session_token");

    if (userId && token) {
      fetch(`${baseURL}/routes/auth.php?action=getUserDetails&id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(`${baseURL}?action=TEST`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return {
        success: false,
        message: "CHANGE TEXT HERE",
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
        return "Easy";
    }
  };

  return (
    <div className="cards-container">
      <h2>All Questions</h2>
      <div className="cards-grid">
        {questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.id} className="card">
              <h3>
                #{q.id}: {q.question}
              </h3>

              {user?.role && user.role.trim().toLowerCase() === "admin" ? (
                // Admin view: show everything
                <>
                  <p>
                    <strong>Category:</strong> {q.category}
                  </p>
                  <div className="block">
                    <p><strong>Difficulty:</strong></p>
                    <p className={getDifficultyClass(q.difficulty)}>{q.difficulty}</p>
                  </div>
                  <p>
                    <strong>Answer:</strong> {q.answer}
                  </p>
                </>
              ) : (
                // User view: only question + input
                <>
                  <div className="block">
                    <p><strong>Difficulty:</strong></p>
                    <p className={getDifficultyClass(q.difficulty)}>{q.difficulty}</p>
                  </div>
                  <div className="form">
                    <Form
                      fields={fields}
                      buttonText="Submit"
                      onSubmit={handleSubmit}
                    />
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </div>
    </div>
  );
};

export default Card;
