import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import '../assets/scss/pages/_login.scss';

function Login() {
    const navigate = useNavigate();
    const url = "http://localhost:8000/routes/auth.php";

    const fields = [
        { name: 'email', label: 'Email*', type: 'email', placeholder: '', required: true },
        { name: 'password', label: 'Password*', type: 'password', placeholder: '', required: true }
    ];

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch(`${url}?action=login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user_id', data.user.id);
                localStorage.setItem('session_token', data.session_token);
                
                navigate('/', { replace: true });
            }

            return data;

        } catch (error) {
            // console.error('Login error:', error);
            return {
                success: false,
                message: "Login failed. Please check your email and password."
            };
        }
    };

    return (
        <Form
            title="Login"
            fields={fields}
            buttonText="Login"
            onSubmit={handleSubmit}
            switchText="New here? "
            link="/register"
            linkText="Create an account"
        />
    );
}

export default Login;