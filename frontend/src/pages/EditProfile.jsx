import '../assets/scss/pages/_edit_profile.scss';
import Form from '../components/Form';

function EditProfile() {
  const fields = [
    { name: 'name', label: 'Name*', type: 'text', placeholder: '', required: true },
    { name: 'surname', label: 'Surname*', type: 'text', placeholder: '', required: true },
    { name: 'street', label: 'Street*', type: 'text', placeholder: '', required: true },
    { name: 'house-number', label: 'House number*', type: 'text', placeholder: '', required: true },
    { name: 'country', label: 'Country*', type: 'text', placeholder: '', required: true },
    { name: 'city', label: 'City*', type: 'text', placeholder: '', required: true },
    { name: 'postal-code', label: 'Postal code*', type: 'text', placeholder: '', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: '' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form
      title="Edit your profile"
      fields={fields}
      buttonText="Save changes"
      onSubmit={handleSubmit}
    />
  );
}

export default EditProfile;