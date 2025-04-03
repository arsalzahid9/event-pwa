import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LifeBuoy, Mail, Phone, MessageSquare } from 'lucide-react';

export default function HelpSupport() {
  const navigate = useNavigate();

  const supportOptions = [
    {
      icon: <Mail className="text-blue-600" size={20} />,
      title: 'Email Support',
      description: 'Get help via email',
      action: () => window.location.href = 'mailto:support@tourwhiz.com'
    },
    {
      icon: <Phone className="text-blue-600" size={20} />,
      title: 'Call Support',
      description: 'Speak with our support team',
      action: () => window.location.href = 'tel:+15551234567'
    },
    // {
    //   icon: <MessageSquare className="text-blue-600" size={20} />,
    //   title: 'Live Chat',
    //   description: 'Chat with us in real-time',
    // }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 fixed w-full top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center">
              <LifeBuoy className="text-blue-900 mr-2" size={28} />
              <h1 className="text-xl font-semibold text-blue-900">Help & Support</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <p className="text-gray-600 text-sm leading-6 mb-8">
              We're here to help! Choose your preferred support method below.
            </p>

            <div className="space-y-4">
              {supportOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={option.action}
                  className="group p-4 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-800">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-blue-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Available 24/7 for urgent matters
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Standard response time: 1-2 business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}