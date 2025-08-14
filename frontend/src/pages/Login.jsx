import '../assets/scss/pages/_login.scss';
import Form from '../components/Form';

function Login() {
  const fields = [
    { name: 'email', label: 'Email*', type: 'email', placeholder: '', required: true },
    { name: 'password', label: 'Password*', type: 'password', placeholder: '', required: true }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form
      title="Login"
      fields={fields}
      buttonText="Login"
      onSubmit={handleSubmit}
    />
  );
}

export default Login;