import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';

// Shared components
const Input = ({ label, type, value, onChange, error, ...props }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                error ? 'border-red-500' : ''
            }`}
            {...props}
        />
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
);

const Button = ({ children, loading, ...props }) => (
    <button
        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
        {...props}
    >
        {loading ? (
            <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </div>
        ) : (
            children
        )}
    </button>
);

export default function SignUp() {
    const navigate = useNavigate();
    const { wallet } = useWalletContext();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        membershipType: 'regular' // regular or premium
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s-]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        setSuccessMessage('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (!wallet) {
                throw new Error('Wallet not initialized');
            }

            // Register user
            await wallet.register(
                formData.name,
                formData.email,
                formData.phoneNumber,
                formData.membershipType
            );

            setSuccessMessage('Registration successful! Redirecting to login...');
            
            // Clear form
            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
                membershipType: 'regular'
            });

            // Redirect after success
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            setGeneralError(
                error.message || 'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Join SACCO Wallet
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Sign in
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {generalError && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{generalError}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{successMessage}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="Enter your full name"
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="Enter your email"
                            required
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={errors.phoneNumber}
                            placeholder="Enter your phone number"
                            required
                        />

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Membership Type
                            </label>
                            <select
                                name="membershipType"
                                value={formData.membershipType}
                                onChange={handleChange}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="regular">Regular Member</option>
                                <option value="premium">Premium Member</option>
                            </select>
                        </div>

                        <Button type="submit" loading={loading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6">
                        <p className="text-center text-sm text-gray-600">
                            By signing up, you agree to our{' '}
                            <button
                                onClick={() => navigate('/terms')}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Terms of Service
                            </button>
                            {' '}and{' '}
                            <button
                                onClick={() => navigate('/privacy')}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Privacy Policy
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}