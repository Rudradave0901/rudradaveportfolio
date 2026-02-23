import React from 'react'
import { useAuth } from '../../context/AuthContext'
import useVisitorStats from '../../hooks/useVisitorStats';
import useProjects from '../../hooks/useProjects';
import useMessages from '../../hooks/useMessages';
import { formatDate } from '../../utils/dtUtils';
import { isAdmin as checkIsAdmin } from '../../utils/authUtils';

const Dashboard = () => {
    const { user } = useAuth();
    const isAdmin = checkIsAdmin(user);
    const { stats } = useVisitorStats();
    const { projects } = useProjects();
    const { messages } = useMessages();

    return (
        <>
            {/* <!-- DASHBOARD SECTION --> */}
            <section id="section-dashboard" className="content-section">
                {!isAdmin && (
                    <div className="mb-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                <i className="fas fa-eye"></i>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Read-Only Mode</p>
                                <p className="text-xs text-zinc-500">Viewing admin dashboard as {user?.role || 'viewer'}. Modification access restricted.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="card p-6 stat-card border border-zinc-800 bg-zinc-900/30">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                                <i className="fas fa-project-diagram text-xl"></i>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{projects?.length || 0}</h3>
                        <p className="text-sm text-zinc-500 font-medium">Total Projects</p>
                    </div>
                    <div className="card p-6 stat-card border border-zinc-800 bg-zinc-900/30">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                                <i className="fas fa-eye text-xl"></i>
                            </div>
                            {stats && stats.recentVisits > 0 && (
                                <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">+{stats.recentVisits} New</span>
                            )}
                        </div>
                        <h3 className="text-3xl font-bold text-white">{stats?.totalVisits || 0}</h3>
                        <p className="text-sm text-zinc-500 font-medium">Unique Visits</p>
                    </div>
                    <div className="card p-6 stat-card border border-zinc-800 bg-zinc-900/30">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                <i className="fas fa-users text-xl"></i>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{stats?.uniqueIPs || 0}</h3>
                        <p className="text-sm text-zinc-500 font-medium">Total Visitors</p>
                    </div>
                    <div className="card p-6 stat-card border border-zinc-800 bg-zinc-900/30">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                <i className="fas fa-paper-plane text-xl"></i>
                            </div>
                            {messages?.filter(m => !m.isRead).length > 0 && (
                                <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                    {messages.filter(m => !m.isRead).length} New
                                </span>
                            )}
                        </div>
                        <h3 className="text-3xl font-bold text-white">{messages?.length || 0}</h3>
                        <p className="text-sm text-zinc-500 font-medium">Inquiries</p>
                    </div>
                </div>

                <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-8`}>
                    <div className={`${isAdmin ? 'lg:col-span-2' : ''} card p-6 border border-zinc-800 bg-zinc-900/30`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-white">Recent Projects</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs text-zinc-500 border-b border-zinc-800 uppercase tracking-widest font-bold">
                                        <th className="pb-3 px-2">Project Name</th>
                                        <th className="pb-3 px-2">Tech Stack</th>
                                        <th className="pb-3 px-2 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {projects?.slice(0, 5).map(project => (
                                        <tr key={project._id} className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-2 font-medium text-white">{project.title}</td>
                                            <td className="py-4 px-2 text-zinc-400">{project.skill?.slice(0, 3).join(', ')}</td>
                                            <td className="py-4 px-2 text-right">
                                                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full border border-green-500/20">Active</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!projects || projects.length === 0) && (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-zinc-500">No projects found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="card p-6 border border-zinc-800 bg-zinc-900/30">
                            <h3 className="font-bold text-lg text-white mb-6">Quick Actions</h3>
                            <div className="space-y-4">
                                <button className="w-full p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all text-left flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <i className="fas fa-plus"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">New Project</p>
                                        <p className="text-xs text-zinc-500">Upload to portfolio</p>
                                    </div>
                                </button>
                                <button className="w-full p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-orange-500 hover:bg-orange-500/10 transition-all text-left flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <i className="fas fa-file-pdf"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Update Resume</p>
                                        <p className="text-xs text-zinc-500">Sync latest version</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {isAdmin && (
                    <div className="mt-8 card p-6 border border-zinc-800 bg-zinc-900/30">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-white">Visitor Traffic Logs</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs text-zinc-500 border-b border-zinc-800 uppercase tracking-widest font-bold">
                                        <th className="pb-3 px-2">IP Address</th>
                                        <th className="pb-3 px-2">User Agent</th>
                                        <th className="pb-3 px-2 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {stats?.logs?.slice(0, 10).map((log, idx) => (
                                        <tr key={idx} className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-2 font-mono text-zinc-400">{log.ip}</td>
                                            <td className="py-4 px-2 text-zinc-500 truncate max-w-md">{log.userAgent}</td>
                                            <td className="py-4 px-2 text-right text-zinc-600">
                                                {formatDate(log.timestamp, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!stats?.logs || stats.logs.length === 0) && (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-zinc-500">No traffic logs recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default Dashboard