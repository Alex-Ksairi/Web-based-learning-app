import { createContext, useContext, useState, useEffect } from "react";

const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    description: "",
    difficulty: ""
  });
  const baseURL = "http://localhost:8000/routes/questions.php";
  const userId = localStorage.getItem("user_id");

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      const res = await fetch(baseURL);
      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON:", text);
        setMessage({ type: "error", text: "Server error. Check console." });
        return;
      }

      if (data.success && data.questions) {
        setQuestions(data.questions);
      } else {
        setQuestions([]);
        setMessage({ type: "error", text: data.message || "No questions found." });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage({ type: "error", text: "Something went wrong fetching questions." });
    }
  };

  // Create question
  const addQuestion = async (formDataFromForm) => {
    if (!userId) {
      return { success: false, message: "No user ID. Please log in." };
    }

    const payload = { ...formDataFromForm, user_id: userId };

    try {
      const res = await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setFormData({
          question: "",
          answer: "",
          category: "",
          description: "",
          difficulty: ""
        });
        fetchQuestions();
        return { success: true, message: "Question created successfully!" };
      } else {
        return { success: false, message: data.message || "Error creating question." };
      }
    } catch (err) {
      console.error("Create error:", err);
      return { success: false, message: "Something went wrong." };
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        message,
        formData,
        setFormData,
        fetchQuestions,
        addQuestion
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => useContext(QuestionsContext);