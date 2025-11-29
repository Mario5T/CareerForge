import { useEffect } from 'react';

const ContactUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const emails = [
        'priyankgaur2005@gmail.com',
        'shreyassrkr@gmail.com',
        'aditya.singh.3305t@gmail.com',
        'raisubhan728@gmail.com'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-end items-center">
                        <a href="/" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-lg shadow-sm p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

                    <div className="space-y-6">
                        <p className="text-lg text-gray-700 text-center mb-8">
                            Have questions or need assistance? Reach out to us at any of the following email addresses:
                        </p>

                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Addresses</h2>
                            <ul className="space-y-3">
                                {emails.map((email, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                            className="text-blue-600 flex-shrink-0">
                                            <rect width="20" height="16" x="2" y="4" rx="2" />
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                        </svg>
                                        <a
                                            href={`mailto:${email}`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline text-lg"
                                        >
                                            {email}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8 text-center text-gray-600">
                            <p>We'll get back to you as soon as possible!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
