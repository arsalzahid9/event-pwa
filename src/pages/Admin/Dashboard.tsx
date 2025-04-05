

  import { CalendarDays, Users, Ticket, Activity } from 'lucide-react';

export const Dashboard = () => {
  // Mock data - replace with real data from your API
  const stats = [
    { title: 'Total Events', value: '24', icon: <CalendarDays className="w-6 h-6" />, color: 'bg-blue-100' },
    { title: 'Total Guides', value: '15', icon: <Users className="w-6 h-6" />, color: 'bg-green-100' },
    { title: 'Total Bookings', value: '189', icon: <Ticket className="w-6 h-6" />, color: 'bg-purple-100' },
    { title: 'Active Events', value: '4', icon: <Activity className="w-6 h-6" />, color: 'bg-yellow-100' }
  ];

  const recentBookings = [
    { id: 1, event: 'Tech Conference', guide: 'Sarah Smith', date: '2024-03-15', participants: 120 },
    { id: 2, event: 'Music Festival', guide: 'John Doe', date: '2024-03-14', participants: 450 },
    { id: 3, event: 'Business Summit', guide: 'Emma Wilson', date: '2024-03-13', participants: 89 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-gray-500">{stat.title}</p>
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Event Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Guide</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Participants</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 text-sm">{booking.event}</td>
                  <td className="px-6 py-4 text-sm">{booking.guide}</td>
                  <td className="px-6 py-4 text-sm">{booking.date}</td>
                  <td className="px-6 py-4 text-sm">{booking.participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentBookings.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No recent bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
