import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "viewer", // Default role
    });
    const { register, error } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            setIsSubmitting(true);
            setTimeout(() => {
                window.location.href = "/admin";
            }, 1500);
        } catch (err) {
            setIsSubmitting(false);
            // Error handled by context
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
            {/* Success Loader Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fas fa-user-check text-2xl text-emerald-500 animate-pulse"></i>
                        </div>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-white tracking-widest uppercase animate-pulse">
                        Creating Account...
                    </h3>
                    <p className="mt-2 text-white/50 text-sm">Setting up your personal dashboard</p>
                </div>
            )}

            <div className={`max-w-md w-full bg-[#111] p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm transition-all duration-500 ${isSubmitting ? 'scale-90 opacity-0 blur-2xl' : 'scale-100 opacity-100 blur-0'}`}>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-white/50">Join us to explore more</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            placeholder="johndoe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            placeholder="example@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        >
                            <option value="viewer" className="bg-[#111]">Viewer (Read-only)</option>
                            <option value="admin" className="bg-[#111]">Admin (Full Access)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-4"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-8 text-center text-white/50 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium ml-1 transition-colors">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
