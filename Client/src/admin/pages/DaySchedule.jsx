import React, { useState } from 'react';

// --- DATA DEFINITIONS --- //

const workoutDetails = [
  {
    type: "table",
    title: "💪 Exact Workout",
    headers: ["Exercise", "Reps"],
    rows: [
      ["Push-ups", "10"],
      ["Squats", "15"],
      ["Lunges", "10 each leg"],
      ["Plank", "30 sec"],
      ["Jumping jacks", "25"]
    ]
  },
  {
    type: "table",
    title: "📈 Progression Plan",
    headers: ["Week", "Change"],
    rows: [
      ["1–2", "Follow base"],
      ["3–4", "+5 reps each"],
      ["5–6", "Add 4th round"],
      ["7–8", "Increase speed + control"]
    ]
  }
];

const fruitDetails = [
  {
    type: "table",
    title: "🍎 Fruit Slot (Morning — FIXED)",
    headers: ["Fruits", "Why"],
    rows: [
      ["Papaya", "Best for skin"],
      ["Apple", "General health"],
      ["Banana", "Energy"],
      ["Orange", "Vitamin C"]
    ]
  }
];

// Split Diet Plans Time-Wise
const breakfastDetails = [
  {
    type: "table",
    title: "🍳 Breakfast Options",
    headers: ["Option", "Details"],
    rows: [
      ["Option 1", "Oats"],
      ["Option 2", "Paneer"],
      ["Option 3", "Peanut butter roti"]
    ]
  }
];

const lunchDetails = [
  {
    type: "table",
    title: "🍲 Lunch Components",
    headers: ["Component", "Food Item"],
    rows: [
      ["Carbohydrates", "Roti"],
      ["Protein", "Dal"],
      ["Vitamins & Fiber", "Sabzi + Salad"]
    ]
  }
];

const snackDetails = [
  {
    type: "table",
    title: "🥜 Snack Choices",
    headers: ["Option", "Nutritional Benefit"],
    rows: [
      ["Fresh Fruit", "Vitamins & Hydration"],
      ["Roasted Chana", "Protein & Crunch"],
      ["Peanuts", "Healthy Fats"]
    ]
  }
];

const dinnerDetails = [
  {
    type: "table",
    title: "🥗 Light Dinner Options",
    headers: ["Meal Type", "Details"],
    rows: [
      ["Standard", "Roti + Sabzi"],
      ["Lighter", "Soup"],
      ["Easy to Digest", "Khichdi"]
    ]
  }
];

// Redesigned Skincare using Card layouts instead of pure tables
const amSkincareDetails = [
  {
    type: "cards",
    title: "🌅 AM Skincare Routine (Budget Friendly)",
    items: [
      { step: "1. Cleanser", desc: "Salicylic face wash", brand: "Minimalist / Garnier" },
      { step: "2. Serum", desc: "Niacinamide 5%", brand: "Minimalist" },
      { step: "3. Moisturizer", desc: "Gel-based", brand: "Pond’s Super Light Gel" },
      { step: "4. Sunscreen", desc: "SPF 50", brand: "Neutrogena / Minimalist" }
    ]
  }
];

const pmSkincareDetails = [
  {
    type: "cards",
    title: "🌙 PM Skincare Routine",
    items: [
      { step: "1. Cleanser", desc: "Salicylic face wash", brand: "Minimalist / Garnier" },
      { step: "2. Treatment", desc: "Retinol (3x/week)", brand: "Minimalist / Pharma brand" },
      { step: "3. Moisturizer", desc: "Gel-based", brand: "Pond’s Super Light Gel" }
    ]
  }
];

const sunscreenDetails = [
  {
    type: "cards",
    title: "☀️ Sunscreen Reapplication",
    items: [
      { step: "Target Areas", desc: "Face, Neck, and Hands", brand: "Reapply completely" },
      { step: "Amount", desc: "Follow the 2-finger rule", brand: "SPF 50 Neutrogena / Minimalist" }
    ]
  }
];

// Main timeline correctly mapped with Categories and Specific Time Details
const masterRoutine = [
  { time: "4:00 AM", category: "Lifestyle", categoryColor: "text-sky-700 bg-sky-100", activity: "Wake up", action: "1 glass water + 1 tbsp chia seeds (soaked)", color: "border-sky-400" },
  { time: "4:10–4:30", category: "Lifestyle", categoryColor: "text-sky-700 bg-sky-100", activity: "Pranayama", action: "Breathing (stress ↓ acne ↓)", color: "border-sky-400" },
  { time: "4:30–5:00", category: "Fitness", categoryColor: "text-rose-700 bg-rose-100", activity: "Workout", action: "Follow workout table", details: workoutDetails, color: "border-rose-400" },
  { time: "5:00–5:20", category: "Lifestyle", categoryColor: "text-sky-700 bg-sky-100", activity: "Bath", action: "Mild soap", color: "border-sky-400" },
  { time: "5:20–5:30", category: "Nutrition", categoryColor: "text-green-700 bg-green-100", activity: "🍎 Fruit Slot", action: "Papaya + Apple OR Banana OR Orange", details: fruitDetails, color: "border-green-400" },
  { time: "5:30–5:40", category: "Skincare", categoryColor: "text-amber-700 bg-amber-100", activity: "🔥 Skincare (AM)", action: "Face wash → Niacinamide → Moisturizer → Sunscreen", details: amSkincareDetails, color: "border-amber-400" },
  { time: "5:40–7:15", category: "Work", categoryColor: "text-indigo-700 bg-indigo-100", activity: "Deep Work", action: "React", color: "border-indigo-500" },
  { time: "7:15–8:15", category: "Work", categoryColor: "text-indigo-700 bg-indigo-100", activity: "Project", action: "Build", color: "border-indigo-500" },
  { time: "8:15–8:35", category: "Learning", categoryColor: "text-purple-700 bg-purple-100", activity: "German", action: "Learn", color: "border-indigo-500" },
  { time: "8:35–9:00", category: "Nutrition", categoryColor: "text-green-700 bg-green-100", activity: "Breakfast", action: "High protein veg meal", details: breakfastDetails, color: "border-green-400" },
  { time: "1:00 PM", category: "Skincare", categoryColor: "text-amber-700 bg-amber-100", activity: "🔥 Sunscreen", action: "Reapply (face, neck, hands)", details: sunscreenDetails, color: "border-amber-400" },
  { time: "1:30 PM", category: "Nutrition", categoryColor: "text-green-700 bg-green-100", activity: "Lunch", action: "Balanced veg meal", details: lunchDetails, color: "border-green-400" },
  { time: "4:00 PM", category: "Skincare", categoryColor: "text-amber-700 bg-amber-100", activity: "🔥 Sunscreen", action: "Reapply", details: sunscreenDetails, color: "border-amber-400" },
  { time: "5:00 PM", category: "Nutrition", categoryColor: "text-green-700 bg-green-100", activity: "Snack", action: "Fruit / roasted chana / peanuts", details: snackDetails, color: "border-green-400" },
  { time: "7:00 PM", category: "Nutrition", categoryColor: "text-green-700 bg-green-100", activity: "Dinner", action: "Light veg meal", details: dinnerDetails, color: "border-green-400" },
  { time: "7:30–8:00", category: "Fitness", categoryColor: "text-rose-700 bg-rose-100", activity: "Walking", action: "20–30 min (fat loss)", color: "border-rose-400" },
  { time: "9:00 PM", category: "Skincare", categoryColor: "text-amber-700 bg-amber-100", activity: "🔥 Skincare (PM)", action: "Face wash → Retinol (3x/week) → Moisturizer", details: pmSkincareDetails, color: "border-amber-400" },
  { time: "10:00 PM", category: "Lifestyle", categoryColor: "text-slate-600 bg-slate-200", activity: "Sleep", action: "No screen", color: "border-slate-800" }
];

// --- COMPONENTS --- //

const NestedContent = ({ content }) => {
  if (content.type === "cards") {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden w-full">
        <div className="bg-slate-100/50 px-4 py-3 border-b border-slate-200">
          <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            {content.title}
          </h4>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
          {content.items.map((item, idx) => (
            <div key={idx} className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg flex flex-col shadow-sm">
              <span className="font-bold text-amber-800 text-[11px] uppercase mb-1 tracking-wider">{item.step}</span>
              <span className="text-slate-700 text-sm font-medium mb-3">{item.desc}</span>
              <span className="text-slate-500 text-[11px] mt-auto bg-white border border-amber-100 inline-block px-2 py-1 rounded w-max">
                🏷️ {item.brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default to table
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden w-full">
      <div className="bg-slate-100/50 px-4 py-3 border-b border-slate-200">
        <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          {content.title}
        </h4>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead>
            <tr className="bg-white border-b border-slate-200">
              {content.headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {content.rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className={`px-4 py-3 text-sm ${j === 0 ? 'font-medium text-slate-700' : 'text-slate-600'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RoutineRow = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = !!item.details;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 ${item.color}`}>
      
      {/* Visible Row */}
      <div 
        className={`p-4 md:px-6 md:py-5 ${hasDetails ? 'cursor-pointer group' : ''}`}
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      >
        <div className="grid grid-cols-1 md:grid-cols-[100px_220px_1fr_40px] items-start md:items-center gap-3 md:gap-4">
          {/* Time */}
          <div className="font-bold text-slate-700 text-sm md:text-base whitespace-nowrap">
            {item.time}
          </div>
          
          {/* Activity & Category Badge */}
          <div className="flex flex-col items-start gap-1">
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.categoryColor}`}>
              {item.category}
            </span>
            <div className="font-semibold text-slate-900 text-lg md:text-base flex items-center">
              {item.activity}
              {hasDetails && (
                <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wide md:hidden">
                  Details
                </span>
              )}
            </div>
          </div>
          
          {/* Exact Action */}
          <div className="text-slate-600 text-sm md:text-base leading-relaxed mt-1 md:mt-0">
            {item.action}
          </div>
          
          {/* Expand Icon */}
          <div className="hidden md:flex justify-end">
            {hasDetails && (
              <div className="bg-slate-50 p-1.5 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      {hasDetails && (
        <div 
          className={`transition-all duration-500 ease-in-out bg-slate-50 overflow-hidden ${
            isExpanded ? 'max-h-[2000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`p-4 md:p-6 grid grid-cols-1 ${item.details.length > 1 && item.details[0].type !== "cards" ? 'lg:grid-cols-2' : ''} gap-6`}>
            {item.details.map((detail, i) => (
              <NestedContent key={i} content={detail} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function DaySchedule() {
  return (
    <div className="text-slate-800 antialiased min-h-screen pb-12 bg-slate-50">
      {/* Inject custom scrollbar styles globally for the nested tables */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label="calendar">🗓️</span> Master Daily Routine
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            A holistic dashboard combining your schedule, workouts, diet, and skincare. Click rows to expand details.
          </p>
        </div>
      </header>

      {/* Main Container for the Timeline */}
      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* Table Column Headers (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-[100px_220px_1fr_40px] gap-4 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <div>Time</div>
          <div>Activity</div>
          <div>Exact Action</div>
          <div></div>
        </div>

        {/* Routine List */}
        <div className="space-y-3">
          {masterRoutine.map((item, index) => (
            <RoutineRow key={index} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}