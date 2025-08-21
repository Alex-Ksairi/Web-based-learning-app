const Card = ({ questions }) => {
    return (
        <>
            <section className="cards-container">
            <h2>All Questions</h2>
            <div className="cards-grid">
                {questions.length > 0 ? (
                questions.map((q) => (
                    <div key={q.id} className="card">
                    <h3>{q.question}</h3>
                    <p><strong>Answer:</strong> {q.answer}</p>
                    <p><strong>Category:</strong> {q.category}</p>
                    <p><strong>Difficulty:</strong> {q.difficulty}</p>
                    </div>
                ))
                ) : (
                <p>No questions available.</p>
                )}
            </div>
            </section>
        </>
    );
};

export default Card;