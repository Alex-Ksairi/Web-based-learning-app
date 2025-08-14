import PropTypes from 'prop-types';
import '../assets/scss/components/_forms.scss';

function Form({ title, fields, buttonText, onSubmit }) {
  return (
    <div className="main-container">
        <form className="app-form" onSubmit={onSubmit}>
        <h2>{title}</h2>

        {fields.map((field) => (
            <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
                type={field.type}
                name={field.name}
                id={field.name}
                placeholder={field.placeholder}
                required={field.required}
            />
            </div>
        ))}

        <button type="submit">{buttonText}</button>
        </form>
    </div>
  );
}

Form.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      required: PropTypes.bool,
    })
  ).isRequired,
  buttonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form;