import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import '../assets/scss/components/_forms.scss';
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