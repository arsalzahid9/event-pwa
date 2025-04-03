import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, User, BarChart2, Share2, Key, MailCheck } from 'lucide-react';

const Section = ({ title, children, icon }: { 
  title: string; 
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="mb-6">
    <div className="flex items-start mb-4">
      <div className="bg-blue-100 p-2 rounded-lg mr-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
    </div>
    <div className="text-gray-600 text-sm leading-6 pl-12">
      {children}
    </div>
  </div>
);

export default function PrivacySecurity() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 fixed w-full top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center">
              <Shield className="text-blue-900 mr-2" size={28} />
              <h1 className="text-xl font-semibold text-blue-900">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <p className="text-gray-600 text-sm leading-6 mb-8">
              Last updated: October 2023<br />
              At TourWhiz, we're committed to protecting your privacy while providing a seamless event management experience.
            </p>

            <Section 
              title="1. Event-Related Data"
              icon={<User className="text-blue-900" size={20} />}
            >
              We collect information necessary for event management:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Participant details (name, contact info)</li>
                <li>Event attendance records</li>
                <li>Payment information for ticket purchases</li>
              </ul>
            </Section>

            <Section 
              title="2. How We Use Your Data"
              icon={<BarChart2 className="text-blue-900" size={20} />}
            >
              Your information helps us:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Manage event registrations</li>
                <li>Process ticket payments</li>
                <li>Improve event organization</li>
                <li>Communicate event updates</li>
              </ul>
            </Section>

            <Section 
              title="3. Data Sharing with Event Organizers"
              icon={<Share2 className="text-blue-900" size={20} />}
            >
              We share necessary information with:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Event organizers for attendance management</li>
                <li>Payment processors for transactions</li>
                <li>Venue staff for security purposes</li>
              </ul>
            </Section>

            <Section 
              title="4. Your Event Data Rights"
              icon={<Key className="text-blue-900" size={20} />}
            >
              You can:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Access your event participation history</li>
                <li>Request correction of your details</li>
                <li>Delete your account and associated data</li>
              </ul>
            </Section>

            <Section 
              title="5. Data Security Measures"
              icon={<Lock className="text-blue-900" size={20} />}
            >
              We protect your data with:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Encrypted data transmission</li>
                <li>Secure payment processing</li>
                <li>Regular security audits</li>
              </ul>
            </Section>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>For privacy concerns related to events, contact:</p>
              <p className="mt-2 text-blue-600">privacy@eventsapp.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}