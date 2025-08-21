import Card from "./Card";
import { useQuestions } from "../context/QuestionContext";

const UserDashboard = () => {
  const { questions } = useQuestions();

  return (
    <>
      <h1>User Dashboard</h1>
      <p>You can view and answer questions here.</p>

      <Card questions={questions} />
    </>
  );
};

export default UserDashboard;