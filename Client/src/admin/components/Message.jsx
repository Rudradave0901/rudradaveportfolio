import React, { useState } from 'react'
import useMessages from '../../hooks/useMessages';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dtUtils';
import { isAdmin as checkIsAdmin } from '../../utils/authUtils';

const Message = () => {
    const { messages, loading, error, pagination, setPage, deleteMessage, markAsRead } = useMessages();
    const { user } = useAuth();
    const isAdmin = checkIsAdmin(user);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const handleViewMessage = (msg) => {
        setSelectedMessage(msg);
        if (!msg.isRead) {
            markAsRead(msg._id);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this message?')) {
            await deleteMessage(id);
        }
    };

    if (loading && messages.length === 0) return <div className="p-10 text-center text-zinc-500">Loading Inquiries...</div>;

    return (
        <>
            <section id="section-messages" className="content-section">
                <div className="card overflow-hidden bg-zinc-900/30 border border-zinc-800 rounded-3xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-white">Contact Inquiries</h3>
                            <p className="text-sm text-zinc-500 mt-1">Manage communications from your portfolio visitors.</p>
                        </div>
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-500 mr-2">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white disabled:opacity-20 transition-all"
                                >
                                    <i className="fas fa-chevron-left text-[10px]"></i>
                                </button>
                                <button
                                    onClick={() => setPage(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white disabled:opacity-20 transition-all"
                                >
                                    <i className="fas fa-chevron-right text-[10px]"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    {error && <div className="m-8 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-2xl text-sm">{error}</div>}

                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar relative">
                        {loading && (
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                <i className="fas fa-spinner fa-spin text-cyan-500"></i>
                            </div>
                        )}
                        {messages.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                                    <i className="fas fa-envelope-open text-2xl"></i>
                                </div>
                                <p className="text-zinc-500">No messages yet. They will appear here when visitors contact you.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    onClick={() => handleViewMessage(msg)}
                                    className={`p-6 hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-6 group ${!msg.isRead ? 'bg-cyan-500/[0.02]' : ''}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-lg ${!msg.isRead ? 'bg-cyan-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h5 className="font-bold text-white truncate">{msg.name}</h5>
                                                <p className="text-xs text-zinc-500">{msg.email}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest whitespace-nowrap">
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                                {isAdmin && (
                                                    <button
                                                        onClick={(e) => handleDelete(e, msg._id)}
                                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <i className="fas fa-trash-alt text-xs"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-400 line-clamp-1 leading-relaxed">{msg.message}</p>
                                    </div>
                                    {!msg.isRead && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full self-center shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-pulse"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail Modal */}
                {selectedMessage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                            <div className="p-8 border-b border-zinc-800 flex justify-between items-start">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                                        {selectedMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{selectedMessage.name}</h3>
                                        <p className="text-sm text-cyan-500 font-medium">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="w-10 h-10 rounded-2xl bg-zinc-800 text-zinc-500 hover:text-white transition-colors flex items-center justify-center"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="mb-8">
                                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Message Body</p>
                                    <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 text-zinc-300 leading-relaxed font-s-16 whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs text-zinc-600">
                                    <span>Sent on: {formatDate(selectedMessage.createdAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => {
                                                handleDelete(e, selectedMessage._id);
                                                setSelectedMessage(null);
                                            }}
                                            className="text-red-900/50 hover:text-red-500 font-bold uppercase tracking-widest transition-colors"
                                        >
                                            Delete Forever
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default Message