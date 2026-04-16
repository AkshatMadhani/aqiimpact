import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trash2, Shield, Activity, TrendingUp, Sparkles, RefreshCw, AlertCircle, Crown, ChevronRight, Star, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { adminAPI, interventionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterventions: 0,
    avgExposureReduction: 0,
  });
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, interventionsRes] = await Promise.all([
        adminAPI.getUsers(),
        interventionAPI.getAll('Delhi'),
      ]);

      const userData = usersRes.data.data;
      const interventionData = interventionsRes.data.data;

      setUsers(userData.users);
      setInterventions(interventionData);

      const avgReduction =
        interventionData.length > 0
          ? interventionData.reduce(
              (sum, i) => sum + (i.estimatedImpact?.exposureReduction || 0),
              0
            ) / interventionData.length
          : 0;

      setStats({
        totalUsers: userData.total,
        totalInterventions: interventionData.length,
        avgExposureReduction: avgReduction.toFixed(1),
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
    >
      <div className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[8px_8px_0px_0px_#111827] transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 100%)` }} />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-gray-600 text-sm font-bold mb-2 uppercase tracking-wide">{label}</p>
            <p className="text-5xl font-black text-gray-900">{value}</p>
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-gray-900"
            style={{ backgroundColor: color }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        </div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 bg-yellow-300 rounded-full px-4 py-2 mb-4 border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
              >
                <Crown className="w-4 h-4 text-gray-900" />
                <span className="text-gray-900 text-sm font-bold">ADMIN ACCESS</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                Control Center
                <motion.span
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block ml-3"
                >
                  ⚡
                </motion.span>
              </h1>
              <p className="text-xl text-white/90 mb-2">Welcome back, {user?.name}!</p>
              <p className="text-white/70">Manage your platform with power and precision</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="hidden md:block"
            >
              <div className="bg-yellow-300 p-8 rounded-3xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]">
                <Shield className="w-24 h-24 text-gray-900" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section className="py-12 bg-white relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(#111827 1px, transparent 1px)`, backgroundSize: '24px 24px', opacity: '0.05' }} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 -mt-20">
            <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="#3B82F6" delay={0.1} />
            <StatCard icon={Activity} label="Interventions" value={stats.totalInterventions} color="#10B981" delay={0.2} />
            <StatCard icon={TrendingUp} label="Avg Reduction" value={`${stats.avgExposureReduction}%`} color="#A855F7" delay={0.3} />
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 border-b-2 border-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Registered Users</h2>
                  <p className="text-white/80">Manage all platform members</p>
                </div>
                <motion.button
                  onClick={fetchData}
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-300 p-4 rounded-2xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] hover:shadow-none transition-all"
                >
                  <RefreshCw className="w-6 h-6 text-gray-900" />
                </motion.button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-900">
                  <tr>
                    <th className="text-left py-4 px-6 font-black text-gray-900 uppercase text-sm">Name</th>
                    <th className="text-left py-4 px-6 font-black text-gray-900 uppercase text-sm">Email</th>
                    <th className="text-left py-4 px-6 font-black text-gray-900 uppercase text-sm">City</th>
                    <th className="text-left py-4 px-6 font-black text-gray-900 uppercase text-sm">Age</th>
                    <th className="text-left py-4 px-6 font-black text-gray-900 uppercase text-sm">Role</th>
                    <th className="text-left py-4 px-6 font-black text-gray-900 uppercase text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem, index) => (
                    <motion.tr
                      key={userItem._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-gray-900">{userItem.name}</td>
                      <td className="py-4 px-6 text-gray-600">{userItem.email}</td>
                      <td className="py-4 px-6 text-gray-600">{userItem.city}</td>
                      <td className="py-4 px-6 text-gray-600">{userItem.age || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                            userItem.role === 'admin'
                              ? 'bg-yellow-300 text-gray-900 border-gray-900'
                              : 'bg-blue-100 text-blue-700 border-blue-700'
                          }`}
                        >
                          {userItem.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(userItem._id)}
                          className="bg-red-500 text-white p-2 rounded-xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={userItem.role === 'admin'}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="bg-gray-100 w-24 h-24 rounded-3xl border-2 border-gray-900 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-semibold">No users found</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-8 border-b-2 border-gray-900">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-300 p-3 rounded-2xl border-2 border-gray-900">
                  <Activity className="w-8 h-8 text-gray-900" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Recent Interventions</h2>
                  <p className="text-white/80">Latest city-level actions and their impact</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-4">
              {interventions.slice(0, 5).map((intervention, index) => (
                <motion.div
                  key={intervention._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] hover:shadow-[4px_4px_0px_0px_#111827] transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold border-2 border-gray-900">
                        {intervention.actionType.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 text-lg">
                      {intervention.description}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>📅</span>
                      {new Date(intervention.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right ml-6">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 text-white px-6 py-3 rounded-2xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]">
                      <p className="text-3xl font-black">
                        {intervention.estimatedImpact?.exposureReduction || 0}%
                      </p>
                      <p className="text-xs font-bold uppercase">Reduction</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {interventions.length === 0 && (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="bg-gray-100 w-24 h-24 rounded-3xl border-2 border-gray-900 flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold">No interventions found</p>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;