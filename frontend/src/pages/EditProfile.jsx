import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Form from '../components/Form';
import isEqual from 'lodash.isequal';
import Header from '../components/Header';
import '../assets/scss/pages/_dashboard.scss';

function EditProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [addressId, setAddressId] = useState(null);
    const [initialProfileData, setInitialProfileData] = useState({});
    const [initialAddressData, setInitialAddressData] = useState({});
    const [loading, setLoading] = useState(true);
    const url = "http://localhost:8000/routes/auth.php";

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentStep = parseInt(queryParams.get('step')) || 1;
        const tempAddressId = localStorage.getItem('temp_address_id');
        const loggedInUserId = localStorage.getItem('user_id');

        setStep(currentStep);

        const fetchData = async () => {
            setLoading(true);
            try {
                if (currentStep === 2 && tempAddressId) {
                    setAddressId(tempAddressId);
                    setInitialAddressData({});
                } else if (loggedInUserId) {
                    const userResponse = await fetch(`${url}?action=getUserDetails&id=${loggedInUserId}`);
                    if (!userResponse.ok) throw new Error('Failed to fetch user details.');
                    const userData = await userResponse.json();

                    if (userData.success && userData.user) {
                        if (!isEqual(initialProfileData, userData.user)) {
                            setInitialProfileData(userData.user);
                        }
                        const userAddressId = userData.user.address_id;

                        if (userAddressId) {
                            const addressResponse = await fetch(`${url}?action=readAddress&id=${userAddressId}`);
                            if (!addressResponse.ok) throw new Error('Failed to fetch address details.');
                            const addressData = await addressResponse.json();

                            if (addressData.success && addressData.address) {
                                if (!isEqual(initialAddressData, addressData.address)) {
                                    setInitialAddressData(addressData.address);
                                }
                                setAddressId(userAddressId);
                            } else {
                                if (!isEqual(initialAddressData, {})) {
                                    setInitialAddressData({});
                                }
                                setAddressId(null);
                            }
                        } else {
                            if (!isEqual(initialAddressData, {})) {
                                setInitialAddressData({});
                            }
                            setAddressId(null);
                        }
                    } else {
                        navigate('/login', { replace: true });
                        return;
                    }
                } else {
                    navigate('/login', { replace: true });
                    return;
                }
            } catch (error) {
                console.error('Error in EditProfile fetchData:', error);
                navigate('/login', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search, navigate]);

    const profileFields = [
        { name: 'name', label: 'Name*', type: 'text', placeholder: '', required: true },
        { name: 'surname', label: 'Surname*', type: 'text', placeholder: '', required: true },
        { name: 'email', label: 'Email*', type: 'email', placeholder: '', required: true, disabled: true },
    ];

    const addressFields = [
        { name: 'street', label: 'Street*', type: 'text', placeholder: '', required: true },
        { name: 'house_number', label: 'House Number*', type: 'text', placeholder: '', required: true },
        { name: 'city', label: 'City*', type: 'text', placeholder: '', required: true },
        { name: 'postal_code', label: 'Postal Code*', type: 'text', placeholder: '', required: true },
        { name: 'country', label: 'Country*', type: 'text', placeholder: '', required: true },
    ];

    const allFields = [...profileFields, ...addressFields];

    const handleProfileSubmit = async (formData) => {
        if (!initialProfileData.id) {
            return { success: false, message: 'User ID not found for profile update.' };
        }
        try {
            const response = await fetch(`${url}?action=updateProfile&id=${initialProfileData.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return { success: false, message: 'Something went wrong during profile update.' };
        }
    };

    const handleAddressSubmit = async (formData) => {
        if (!addressId) {
            return { success: false, message: 'No address ID found. Cannot update without an ID.' };
        }
        
        try {
            const response = await fetch(`${url}?action=updateAddress&id=${addressId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.removeItem('temp_address_id');
                navigate('/', { replace: true });
            }
            return data;
        } catch (error) {
            return { success: false, message: 'Something went wrong during address update.' };
        }
    };
    
    const handleCombinedSubmit = async (formData) => {
        if (!initialProfileData.id) {
            return { success: false, message: 'User ID not found for profile update.' };
        }

        const profileData = {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
        };
        const addressData = {
            street: formData.street,
            house_number: formData.house_number,
            city: formData.city,
            postal_code: formData.postal_code,
            country: formData.country,
        };
        
        let profileUpdateSuccess = false;
        let addressUpdateSuccess = false;

        try {
            const profileResponse = await fetch(`${url}?action=updateProfile&id=${initialProfileData.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });
            const profileUpdateData = await profileResponse.json();
            profileUpdateSuccess = profileUpdateData.success;
            if (!profileUpdateSuccess) {
                return { success: false, message: profileUpdateData.message || 'Something went wrong during profile update.' };
            }
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, message: 'Something went wrong during profile update.' };
        }

        const userAddressId = initialProfileData.address_id || initialAddressData.id;
        if (userAddressId) {
            try {
                const addressResponse = await fetch(`${url}?action=updateAddress&id=${userAddressId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(addressData),
                });
                const addressUpdateData = await addressResponse.json();
                addressUpdateSuccess = addressUpdateData.success;
                if (!addressUpdateSuccess) {
                    return { success: false, message: addressUpdateData.message || 'Something went wrong during address update.' };
                }
            } catch (error) {
                console.error('Address update error:', error);
                return { success: false, message: 'Something went wrong during address update.' };
            }
        } else {
            console.warn("No address ID found, skipping address update.");
            addressUpdateSuccess = true;
        }

        if (profileUpdateSuccess && addressUpdateSuccess) {
            navigate('/', { replace: true });
            return { success: true, message: 'Profile and Address updated successfully!' };
        }
        
        return { success: false, message: 'Update failed.' };
    };

    if (loading) {
        return <div>Loading profile data...</div>;
    }

    if (step === 2) {
        return (
            <Form
                title="Complete your profile: Address"
                fields={addressFields}
                buttonText="Save Address"
                onSubmit={handleAddressSubmit}
                initialData={initialAddressData}
            />
        );
    } else {
        const combinedInitialData = { ...initialProfileData, ...initialAddressData };

        return (
            <>
                <div className="dashboard">
                    <Header user={initialProfileData}/>
                    <Form
                        title="Edit your profile"
                        fields={allFields}
                        buttonText="Save Changes"
                        onSubmit={handleCombinedSubmit}
                        initialData={combinedInitialData}
                    />
                </div>
            </>
            
        );
    }
}

export default EditProfile;