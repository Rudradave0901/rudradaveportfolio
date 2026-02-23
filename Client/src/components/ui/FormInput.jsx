import React, { memo } from "react";

const FormInput = memo(({ label, type = "text", name, value, onChange, placeholder, required = false, isTextArea = false, rows = "3" }) => {
    const inputClasses = "w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all";

    return (
        <div>
            {label && <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">{label}</label>}
            {isTextArea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    className={`${inputClasses} resize-none`}
                    required={required}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={inputClasses}
                    required={required}
                />
            )}
        </div>
    );
});

export default FormInput;
