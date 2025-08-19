import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Form from '../components/Form';
import isEqual from 'lodash.isequal';

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
                    //setInitialAddressData({});
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
                                // console.warn("User has address_id but no address data found. User might need to create one.");
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
                            // console.log("Logged-in user has no address linked. Will display empty address form or skip step 2.");
                        }
                    } else {
                        // console.error("User details not found for logged in user:", userData.message);
                        navigate('/login', { replace: true });
                    }
                } else {
                    // console.warn("Access to EditProfile attempted without login or recent registration. Redirecting to login.");
                    navigate('/login', { replace: true });
                    return;
                }
            } catch (error) {
                // console.error('Error in EditProfile fetchData:', error);
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
        { name: 'email', label: 'Email*', type: 'email', placeholder: '', required: true },
    ];

    const addressFields = [
        { name: 'street', label: 'Street*', type: 'text', placeholder: '', required: true },
        { name: 'house_number', label: 'House Number*', type: 'text', placeholder: '', required: true },
        { name: 'city', label: 'City*', type: 'text', placeholder: '', required: true },
        { name: 'postal_code', label: 'Postal Code*', type: 'text', placeholder: '', required: true },
        { name: 'country', label: 'Country*', type: 'text', placeholder: '', required: true },
    ];

    const handleProfileSubmit = async (formData) => {
        console.log("Submitting profile data:", formData);
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
            // console.error('Profile update error:', error);
            return { success: false, message: 'Something went wrong during profile update.' };
        }
    };

    const handleAddressSubmit = async (formData) => {
        if (!addressId) {
            return { success: false, message: 'No address ID found. Cannot update without an ID.' };
        }
        
        // console.log("Submitting address data for address_id:", addressId, formData);
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
            // console.error('Address update error:', error);
            return { success: false, message: 'Something went wrong during address update.' };
        }
    };

    if (loading) {
        return <div>Loading profile data...</div>;
    }

    if (step === 2) {
        return (
            <Form
                title="Complete Your Profile: Address"
                fields={addressFields}
                buttonText="Save Address"
                onSubmit={handleAddressSubmit}
                initialData={initialAddressData}
            />
        );
    } else {
        return (
            <Form
                title="Edit Your Profile"
                fields={profileFields}
                buttonText="Save Profile"
                onSubmit={handleProfileSubmit}
                initialData={initialProfileData}
            />
        );
    }
}

export default EditProfile;