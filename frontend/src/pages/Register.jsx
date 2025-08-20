import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import '../assets/scss/pages/_register.scss';

function Register() {
    const navigate = useNavigate();
    const url = "http://localhost:8000/routes/auth.php";

    const fields = [
        { name: 'name', label: 'Name*', type: 'text', placeholder: '', required: true },
        { name: 'surname', label: 'Surname*', type: 'text', placeholder: '', required: true },
        { name: 'email', label: 'Email*', type: 'email', placeholder: '', required: true },
        { name: 'password', label: 'Password*', type: 'password', placeholder: '', required: true }
    ];

    const handleSubmit = async (formData) => {
        
        try {
            const response = await fetch(`${url}?action=register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || `HTTP error! status: ${response.status}`
                };
            }

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user_id', data.user.id);
                localStorage.setItem('session_token', data.session_token);
                navigate('/edit-profile?step=2', { replace: true });
            }
            
            return data;

        } catch (error) {
            // console.error('Registration error:', error);
            return {
                success: false,
                message: "Registration failed. Please try again."
            };
        }
    };

    return (
        <Form
            title="Create an account"
            fields={fields}
            buttonText="Sign up"
            onSubmit={handleSubmit}
            switchText="Already have an account? "
            link="/login"
            linkText="Login"
        />
    );
}

export default Register;