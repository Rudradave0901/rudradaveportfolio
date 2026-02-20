import React, { useState, useEffect, useRef } from 'react';
import useBanner from '../../hooks/useBanner';

const BASE_URL = "http://localhost:4000";

const Banner = () => {
    const { bannerData, loading, error, createBanner, updateBanner } = useBanner();
    const [formData, setFormData] = useState({
        name: '',
        headline: '',
        designations: '', // comma separated string for input
    });

    const [images, setImages] = useState({
        BannerImage: null,
        smallBannerImage: null
    });

    const [previews, setPreviews] = useState({
        banner: null,
        small: null
    });

    const bannerInputRef = useRef(null);
    const smallInputRef = useRef(null);

    useEffect(() => {
        if (bannerData) {
            setFormData({
                name: bannerData.name || '',
                headline: bannerData.headline || '',
                designations: (bannerData.designations || []).join(', '),
            });
            setPreviews({
                banner: bannerData.bannerImageUrl ? `${BASE_URL}${bannerData.bannerImageUrl}` : null,
                small: bannerData.smallImageUrl ? `${BASE_URL}${bannerData.smallImageUrl}` : null
            });
        }
    }, [bannerData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setImages(prev => ({ ...prev, [type]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type === 'BannerImage' ? 'banner' : 'small']: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('headline', formData.headline);
        data.append('designations', JSON.stringify(formData.designations.split(',').map(s => s.trim()).filter(Boolean)));

        if (images.BannerImage) data.append('BannerImage', images.BannerImage);
        if (images.smallBannerImage) data.append('smallBannerImage', images.smallBannerImage);

        if (bannerData) {
            await updateBanner(data);
        } else {
            await createBanner(data);
        }
    };

    if (loading && !bannerData) return <div className="p-10 text-center">Loading...</div>;

    return (
        <section id="section-banner" className="content-section py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h3 className="text-3xl font-extrabold text-white tracking-tight">
                        Banner Settings
                    </h3>
                    <p className="mt-2 text-zinc-400">
                        Customize your homepage intro and visuals.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {error && <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm">{error}</div>}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Images Column */}
                        <div className="lg:col-span-1 space-y-8">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 ml-1">Main Banner Image</label>
                                <div
                                    onClick={() => bannerInputRef.current.click()}
                                    className="relative aspect-[3/4] rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900 overflow-hidden cursor-pointer group hover:border-cyan-500/50 transition-all shadow-lg"
                                >
                                    {previews.banner ? (
                                        <img src={previews.banner} alt="Banner" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                                            <i className="fas fa-image text-4xl mb-2 group-hover:text-cyan-500 transition-colors"></i>
                                            <span className="text-xs font-bold uppercase tracking-tighter">Upload Large</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                        <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold">Replace</span>
                                    </div>
                                </div>
                                <input ref={bannerInputRef} type="file" onChange={(e) => handleImageChange(e, 'BannerImage')} className="hidden" accept="image/*" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 ml-1">Small Profile Image</label>
                                <div
                                    onClick={() => smallInputRef.current.click()}
                                    className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900 overflow-hidden cursor-pointer group hover:border-cyan-500/50 transition-all shadow-lg mx-auto md:mx-0"
                                >
                                    {previews.small ? (
                                        <img src={previews.small} alt="Small" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                                            <i className="fas fa-user-circle text-2xl mb-1 group-hover:text-cyan-500 transition-colors"></i>
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Small</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                        <i className="fas fa-camera text-white text-xs"></i>
                                    </div>
                                </div>
                                <input ref={smallInputRef} type="file" onChange={(e) => handleImageChange(e, 'smallBannerImage')} className="hidden" accept="image/*" />
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 space-y-6 shadow-xl">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all font-s-16"
                                        placeholder="E.g. Rudra Dave"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Main Headline</label>
                                    <textarea
                                        name="headline"
                                        value={formData.headline}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all font-s-18 font-bold resize-none"
                                        placeholder="Your impact statement..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Designations (Comma separated)</label>
                                    <input
                                        type="text"
                                        name="designations"
                                        value={formData.designations}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 transition-all font-s-16"
                                        placeholder="E.g. Web Developer, UI/UX Designer"
                                        required
                                    />
                                    <p className="mt-2 text-[10px] text-zinc-500 uppercase tracking-wider ml-1">Separate with commas (e.g. Developer, Designer, Freelancer)</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(8,145,178,0.3)] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        bannerData ? 'Update Banner' : 'Create Banner'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Banner;
