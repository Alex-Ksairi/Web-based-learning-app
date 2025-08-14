import '../assets/scss/pages/_register.scss'; // optional, if you want page-specific styles
import Form from '../components/Form';

function Register() {
  const fields = [
    { name: 'name', label: 'Name*', type: 'text', placeholder: '', required: true },
    { name: 'surname', label: 'Surname*', type: 'text', placeholder: '', required: true },
    { name: 'email', label: 'Email*', type: 'email', placeholder: '', required: true },
    { name: 'password', label: 'Password*', type: 'password', placeholder: '', required: true }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form
      title="Register"
      fields={fields}
      buttonText="Sign Up"
      onSubmit={handleSubmit}
    />
  );
}

export default Register;