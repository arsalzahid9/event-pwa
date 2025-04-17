

import { useState, useEffect } from 'react';
import { Users, BookOpen, Euro, Percent } from 'lucide-react';
import { getDashboardData } from '../../api/Admin/dashboard';
import Loader from '../../components/Loader';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setStatsData(response.data);
        setEventData(response.data.event_data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const stats = [
    { 
      title: 'Total Guides', 
      value: statsData?.total_user || 0,
      icon: <Users className="w-6 h-6" />, 
      color: 'bg-blue-100',
      format: (val: number) => val.toLocaleString()
    },
    { 
      title: 'User Growth', 
      value: statsData?.total_user_percentage || '0%',
      icon: <Percent className="w-6 h-6" />, 
      color: 'bg-blue-100',
      format: (val: string) => val
    },
    { 
      title: 'Total Revenue', 
      value: statsData?.total_order_amount || 0,
      icon: <Euro className="w-6 h-6" />, 
      color: 'bg-green-100',
      format: (val: number) => `${val.toFixed(2)}`
    },
    { 
      title: 'Revenue Share', 
      value: statsData?.total_order_amount_percentage || '0%',
      icon: <Percent className="w-6 h-6" />, 
      color: 'bg-green-100',
      format: (val: string) => val
    },
    { 
      title: 'Total Bookings', 
      value: statsData?.total_booking || 0,
      icon: <BookOpen className="w-6 h-6" />, 
      color: 'bg-purple-100',
      format: (val: number) => val.toLocaleString()
    },
    { 
      title: 'Booking Rate', 
      value: statsData?.total_booking_percentage || '0%',
      icon: <Percent className="w-6 h-6" />, 
      color: 'bg-purple-100',
      format: (val: string) => val
    }
  ];

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold ml-0 md:ml-8">Dashboard</h1>
      </div>
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <div className="text-right">
              <p className="text-gray-500">{stat.title}</p>

                <p className="text-2xl font-semibold">
                  {stat.format(stat.value)}
              </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">NOME DEL PARTECIPANTE</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">EVENTO</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">GUIDA</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">IMPORTO</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">DATI DI PRENOTAZIONE</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">STATO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {eventData.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium">{event.participant_name}</div>
                    <div className="text-gray-500">{event.participant_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{event.event_name}</td>
                  <td className="px-6 py-4 text-sm">{event.guide_name}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium">
                      {parseFloat(event.amount.replace(/\.(?=.*\.)/g, '')).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(event.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.payment_status?.toLowerCase() === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : event.payment_status?.toLowerCase() === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
