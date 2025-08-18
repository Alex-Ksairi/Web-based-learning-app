import PropTypes from 'prop-types';
import '../assets/scss/components/_forms.scss';

function Form({ title, fields, buttonText, onSubmit, switchText, link, linkText, successMessage, errorMessage }) {
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

        <div className='switch-form'>
          <p>{switchText}</p>
          <a href={link}>{linkText}</a>
        </div>
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
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
  switchText: PropTypes.string,
  link: PropTypes.string,
  linkText: PropTypes.string,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
};

export default Form;