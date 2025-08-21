import "../assets/scss/pages/_dashboard.scss";
import "../assets/scss/components/_cards.scss";
import Form from "./Form";
import Card from "./Card";
import { useQuestions } from "../context/QuestionContext";

const AdminDashboard = () => {
  const { questions, formData, setFormData, addQuestion } = useQuestions();

  const fields = [
    { name: "question", label: "Question*", type: "text", required: true },
    { name: "answer", label: "Answer*", type: "text", required: true },
    { name: "category", label: "Category*", type: "text", required: true },
    { name: "description", label: "Category description*", type: "text", required: true },
    { name: "difficulty", label: "Difficulty*", type: "text", required: true }
  ];

  return (
    <div className="dashboard">
      <main>
        <h1>Admin Dashboard</h1>
        <p>Manage questions, answers, and categories.</p>

        <Card questions={questions} />

        <Form
          title="Create a question"
          fields={fields}
          buttonText="Create"
          formData={formData}
          setFormData={setFormData}
          onSubmit={addQuestion}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;