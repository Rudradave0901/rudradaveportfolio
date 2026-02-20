import React from 'react'

const Dashboard = () => {
  return (
    <>
        {/* <!-- DASHBOARD SECTION --> */}
        <section id="section-dashboard" className="content-section">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="card p-6 stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                            <i className="fas fa-project-diagram text-xl"></i>
                        </div>
                        <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">+12%</span>
                    </div>
                    <h3 className="text-3xl font-bold">14</h3>
                    <p className="text-sm text-gray-400">Total Projects</p>
                </div>
                <div className="card p-6 stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <i className="fas fa-eye text-xl"></i>
                        </div>
                        <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">+5%</span>
                    </div>
                    <h3 className="text-3xl font-bold">1.2k</h3>
                    <p className="text-sm text-gray-400">Profile Views</p>
                </div>
                <div className="card p-6 stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <i className="fas fa-clock text-xl"></i>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold">3.2</h3>
                    <p className="text-sm text-gray-400">Years Exp.</p>
                </div>
                <div className="card p-6 stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <i className="fas fa-paper-plane text-xl"></i>
                        </div>
                        <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">3 New</span>
                    </div>
                    <h3 className="text-3xl font-bold">48</h3>
                    <p className="text-sm text-gray-400">Inquiries</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Recent Projects</h3>
                        <button onclick="showSection('projects')" className="text-cyan-500 text-xs hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b border-white/5 uppercase">
                                    <th className="pb-3 font-medium">Project Name</th>
                                    <th className="pb-3 font-medium">Tech Stack</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-white/5">
                                    <td className="py-4 font-medium">E-Commerce React App</td>
                                    <td className="py-4">React, Tailwind</td>
                                    <td className="py-4"><span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] rounded">Live</span></td>
                                    <td className="py-4 text-right"><button className="text-gray-400 hover:text-cyan-500"><i className="fas fa-ellipsis-v"></i></button></td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="py-4 font-medium">Antelope Canyon Shuttle</td>
                                    <td className="py-4">HTML, CSS, JS</td>
                                    <td className="py-4"><span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] rounded">Live</span></td>
                                    <td className="py-4 text-right"><button className="text-gray-400 hover:text-cyan-500"><i className="fas fa-ellipsis-v"></i></button></td>
                                </tr>
                                <tr>
                                    <td className="py-4 font-medium">Online Degree Info</td>
                                    <td className="py-4">Laravel, MySQL</td>
                                    <td className="py-4"><span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] rounded">In Progress</span></td>
                                    <td className="py-4 text-right"><button className="text-gray-400 hover:text-cyan-500"><i className="fas fa-ellipsis-v"></i></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <button onclick="showSection('projects')" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500 hover:bg-cyan-500/5 transition-all text-left flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                                <i className="fas fa-plus"></i>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">New Project</p>
                                <p className="text-xs text-gray-500">Upload to portfolio</p>
                            </div>
                        </button>
                        <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-left flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                <i className="fas fa-file-pdf"></i>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Update Resume</p>
                                <p className="text-xs text-gray-500">PDF Version 2.4</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Dashboard