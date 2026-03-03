import { useState } from "react";
import { Person, Email, LocationOn, Notes, CheckCircle, Work, Schedule, Star } from "@mui/icons-material";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Employees_Submit() {
    document.title = 'Job Boat Employees Form';

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        agent: "Form Submission",
        name: "",
        phone: "",
        alt_phone: "",
        email: "",
        address: "",
        city: "",
        preferred_location: "",
        availability: "",
        experience: "",
        position: "",
        right_to_work: "",
        remark: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Employee name is required";
        }

        if (!formData.phone || formData.phone.length < 8) {
            newErrors.phone = "Valid phone number is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.preferred_location.trim()) {
            newErrors.preferred_location = "Preferred location is required";
        }

        if (!formData.availability.trim()) {
            newErrors.availability = "Availability is required";
        }

        if (!formData.experience.trim()) {
            newErrors.experience = "Experience is required";
        }

        if (!formData.position.trim()) {
            newErrors.position = "Position is required";
        }

        if (!formData.right_to_work.trim()) {
            newErrors.right_to_work = "Right to work is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const url = `${import.meta.env.VITE_SERVER_URL}/api/employees`;
            await axios.post(url, formData);

            setSubmitted(true);

            setFormData({
                agent: "Form Submission",
                name: "",
                phone: "",
                alt_phone: "",
                email: "",
                address: "",
                city: "",
                preferred_location: "",
                availability: "",
                experience: "",
                position: "",
                right_to_work: "",
                remark: "",
            });
        } catch (err) {
            setErrors({ submit: err.response?.data || "Submission failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
            <div className="bg-white w-full max-w-4xl rounded-sm shadow-sm border border-gray-200">
                <div className="border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 bg-gray-900 text-white">
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                        <div className="sm:ml-2">
                            <h1 className="text-lg sm:text-2xl font-semibold">
                                Employee Registration Form
                            </h1>
                            <p className="text-xs sm:text-sm mt-1">
                                Please complete all required fields to register
                            </p>
                        </div>
                        <a href="https://jobboat.co.uk/" target="_blank" rel="noopener noreferrer">
                            <img
                                src="/Assets/Img/a.png"
                                alt="Logo"
                                className="h-6 sm:h-10"
                            />
                        </a>
                    </div>
                </div>

                {submitted ? (
                    <div className="px-4 sm:px-8 py-12 sm:py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                            <CheckCircle className="text-green-600" style={{ fontSize: 40 }} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                            Registration Submitted
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-md mx-auto px-4">
                            Your registration has been successfully submitted. Our team will review your information and contact you shortly.
                        </p>

                        <button
                            onClick={() => setSubmitted(false)}
                            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                        >
                            Submit Another Registration
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="px-4 sm:px-8 py-4 sm:py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Employee Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Person className="absolute left-3 top-3 text-gray-400" fontSize="small" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border ${errors.name ? "border-red-500" : "border-gray-300"
                                            } rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm`}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Email className="absolute left-3 top-3 text-gray-400" fontSize="small" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border ${errors.email ? "border-red-500" : "border-gray-300"
                                            } rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm`}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <PhoneInput
                                    country={"gb"}
                                    value={formData.phone}
                                    onChange={(phone) => {
                                        setFormData({ ...formData, phone });
                                        if (errors.phone) {
                                            setErrors({ ...errors, phone: "" });
                                        }
                                    }}
                                    inputClass="!w-full !h-10 !text-sm"
                                    inputStyle={{
                                        width: "100%",
                                        height: "42px",
                                        borderColor: errors.phone ? "#ef4444" : "#d1d5db",
                                    }}
                                />
                                {errors.phone && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alternative Phone Number
                                </label>
                                <PhoneInput
                                    country={"gb"}
                                    value={formData.alt_phone}
                                    onChange={(alt_phone) =>
                                        setFormData({
                                            ...formData,
                                            alt_phone,
                                        })
                                    }
                                    inputClass="!w-full !h-10 !text-sm"
                                    inputStyle={{
                                        width: "100%",
                                        height: "42px",
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <LocationOn className="absolute left-3 top-3 text-gray-400" fontSize="small" />
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border ${errors.city ? "border-red-500" : "border-gray-300"
                                            } rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm`}
                                        placeholder="Enter city"
                                    />
                                </div>
                                {errors.city && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.city}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <LocationOn className="absolute left-3 top-3 text-gray-400" fontSize="small" />
                                    <input
                                        type="text"
                                        name="preferred_location"
                                        value={formData.preferred_location}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border ${errors.preferred_location ? "border-red-500" : "border-gray-300"
                                            } rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm`}
                                        placeholder="Enter preferred work location"
                                    />
                                </div>
                                {errors.preferred_location && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.preferred_location}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Work className="absolute left-3 top-3 text-gray-400" fontSize="small" />
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border ${errors.position ? "border-red-500" : "border-gray-300"
                                            } rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm`}
                                        placeholder="Enter desired position"
                                    />
                                </div>
                                {errors.position && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.position}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Star className="absolute left-3 top-3 text-gray-400" fontSize="small" />
                                    <input
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border ${errors.experience ? "border-red-500" : "border-gray-300"
                                            } rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm`}
                                        placeholder="e.g., 2 years, Entry Level"
                                    />
                                </div>
                                {errors.experience && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.experience}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Availability <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Schedule className="absolute left-3 top-3 text-gray-400" fontSize="small" />
                                    <input
                                        type="text"
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border ${errors.availability ? "border-red-500" : "border-gray-300"
                                            } rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm`}
                                        placeholder="e.g., Full-time, Part-time, Weekends"
                                    />
                                </div>
                                {errors.availability && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.availability}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Right to Work <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="right_to_work"
                                    value={formData.right_to_work}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border ${errors.right_to_work ? "border-red-500" : "border-gray-300"
                                        } rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm`}
                                >
                                    <option value="">Select option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                                {errors.right_to_work && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.right_to_work}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <LocationOn className="absolute left-3 top-3 text-gray-400" fontSize="small" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.address ? "border-red-500" : "border-gray-300"
                                        } rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none`}
                                    placeholder="Enter complete address"
                                />
                            </div>
                            {errors.address && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.address}</p>
                            )}
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Remarks
                            </label>
                            <div className="relative">
                                <Notes className="absolute left-3 top-3 text-gray-400" fontSize="small" />
                                <textarea
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
                                    placeholder="Any additional information or comments"
                                />
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="mt-4 sm:mt-6 p-4 bg-red-50 border border-red-200 rounded">
                                <p className="text-sm text-red-600">{errors.submit}</p>
                            </div>
                        )}

                        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-3 px-4 rounded font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Submitting Registration..." : "Submit Registration"}
                            </button>
                        </div>

                        <footer className="w-full py-4 mt-6 text-center">
                            <a
                                href="https://jobboat.co.uk/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-md text-gray-800 font-bold hover:text-green-600 transition"
                            >
                                Visit website
                            </a>
                        </footer>
                    </form>
                )}
            </div>
        </div>
    );
}