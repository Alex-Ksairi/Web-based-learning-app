import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import '../assets/scss/components/_forms.scss';
import "../assets/scss/components/_buttons.scss";
import isEqual from 'lodash.isequal';

function Form({
  title,
  fields,
  buttonText,
  onSubmit,
  switchText,
  link,
  linkText,
  successMessage: propSuccessMessage,
  errorMessage: propErrorMessage,
  initialData = {},

  // Optional controlled props (when provided, Form becomes controlled)
  formData: formDataProp,
  setFormData: setFormDataProp,

  onSuccess,
  onError
}) {
  // Determine mode
  const isControlled = typeof setFormDataProp === 'function' && formDataProp !== undefined;

  // Uncontrolled state (used only when not controlled)
  const [internalData, setInternalData] = useState(initialData);

  // The data/setter the rest of the component will use
  const data = isControlled ? formDataProp : internalData;
  const setData = isControlled ? setFormDataProp : setInternalData;

  // Messages
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  // When initialData changes (and we are UNCONTROLLED), sync it
  const prevInitialDataRef = useRef();
  useEffect(() => {
    if (!isControlled && !isEqual(initialData, prevInitialDataRef.current)) {
      setInternalData(initialData);
      prevInitialDataRef.current = initialData;
    }
  }, [initialData, isControlled]);

  // Clear messages after a delay
  useEffect(() => {
    if (formSuccessMessage) {
      const t = setTimeout(() => {
        setFormSuccessMessage('');
        if (onSuccess) onSuccess();
      }, 3000);
      return () => clearTimeout(t);
    }
    if (formErrorMessage) {
      const t = setTimeout(() => {
        setFormErrorMessage('');
        if (onError) onError();
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [formSuccessMessage, formErrorMessage, onSuccess, onError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    setFormSuccessMessage('');
    setFormErrorMessage('');
  };

  const emptyFromFields = () =>
    fields.reduce((acc, f) => {
      acc[f.name] = '';
      return acc;
    }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSuccessMessage('');
    setFormErrorMessage('');

    try {
      const responseData = await onSubmit(data);

      if (responseData && responseData.success) {
        setFormSuccessMessage(responseData.message || propSuccessMessage || 'Operation successful!');

        // If UNCONTROLLED, clear here.
        // If CONTROLLED, parent (AdminDashboard) will clear and the inputs will reflect immediately.
        if (!isControlled) {
          setInternalData(emptyFromFields());
        }
      } else {
        setFormErrorMessage(responseData?.message || propErrorMessage || 'Operation failed!');
      }
    } catch {
      setFormErrorMessage(propErrorMessage || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="main-container">
      <form className="app-form" onSubmit={handleSubmit}>
        <h2>{title}</h2>

        {formSuccessMessage && <p className="success-message">{formSuccessMessage}</p>}
        {formErrorMessage && <p className="error-message">{formErrorMessage}</p>}

        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              placeholder={field.placeholder}
              required={field.required}
              value={data[field.name] ?? ''}
              onChange={handleChange}
              disabled={field.disabled}
            />
          </div>
        ))}

        <button type="submit">{buttonText}</button>

        <div className='switch-form'>
          <p>{switchText}</p>
          <a href={link}>{linkText}</a>
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
      disabled: PropTypes.bool,
    })
  ).isRequired,
  buttonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  switchText: PropTypes.string,
  link: PropTypes.string,
  linkText: PropTypes.string,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  initialData: PropTypes.object,

  // Optional controlled props
  formData: PropTypes.object,
  setFormData: PropTypes.func,

  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default Form;



/*
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import '../assets/scss/components/_forms.scss';
import "../assets/scss/components/_buttons.scss";
import isEqual from 'lodash.isequal';

function Form({ title, fields, buttonText, onSubmit, switchText, link, linkText, successMessage: propSuccessMessage, errorMessage: propErrorMessage, initialData = {}, onSuccess, onError }) {
    const [formData, setFormData] = useState(initialData);
    const [formSuccessMessage, setFormSuccessMessage] = useState('');
    const [formErrorMessage, setFormErrorMessage] = useState('');

    const prevInitialDataRef = useRef();

    useEffect(() => {
        if (!isEqual(initialData, prevInitialDataRef.current)) {
            setFormData(initialData);
            prevInitialDataRef.current = initialData;
        }
    }, [initialData]);

    useEffect(() => {
        if (formSuccessMessage) {
            const timer = setTimeout(() => {
                setFormSuccessMessage('');
                if (onSuccess) {
                    onSuccess();
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
        if (formErrorMessage) {
            const timer = setTimeout(() => {
                setFormErrorMessage('');
                if (onError) {
                    onError();
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [formSuccessMessage, formErrorMessage, onSuccess, onError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormSuccessMessage('');
        setFormErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSuccessMessage('');
        setFormErrorMessage('');

        try {
            const responseData = await onSubmit(formData);

            if (responseData && responseData.success) {
                setFormSuccessMessage(responseData.message || propSuccessMessage || 'Operation successful!');
            } else {
                setFormErrorMessage(responseData.message || propErrorMessage || 'Operation failed!');
            }
        } catch (error) {
            // console.error('Form submission error:', error);
            setFormErrorMessage(propErrorMessage || 'An unexpected error occurred.');
        }
    };
    
    return (
        <div className="main-container">
            <form className="app-form" onSubmit={handleSubmit}>
                <h2>{title}</h2>

                {formSuccessMessage && <p className="success-message">{formSuccessMessage}</p>}
                {formErrorMessage && <p className="error-message">{formErrorMessage}</p>}

                {fields.map((field) => (
                    <div className="form-group" key={field.name}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            id={field.name}
                            placeholder={field.placeholder}
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            disabled={field.disabled}
                        />
                    </div>
                ))}

                <button type="submit">{buttonText}</button>

                <div className='switch-form'>
                    <p>{switchText}</p>
                    <a href={link}>{linkText}</a>
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
    initialData: PropTypes.object,
    onSuccess: PropTypes.func,
    onError: PropTypes.func, 
};

export default Form;
*/