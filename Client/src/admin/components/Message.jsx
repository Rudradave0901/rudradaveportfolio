import React from 'react'

const Message = () => {
  return (
    <>
        {/* <!-- MESSAGES SECTION --> */}
        <section id="section-messages" className="content-section">
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold">Contact Inquiries</h3>
                </div>
                <div className="divide-y divide-white/5">
                    <div onclick="viewMessage('John Doe', 'john@example.com', 'Hi Rudra, I saw your portfolio and I\'m interested in collaborating on a React project. Your work on the E-commerce app is impressive. Let\'s talk!')" className="p-6 hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex-shrink-0 flex items-center justify-center text-cyan-500 font-bold">JD</div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h5 className="font-bold">John Doe <span className="text-xs font-normal text-gray-500 ml-2">john@example.com</span></h5>
                                <span className="text-[10px] text-gray-500">2 hours ago</span>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-1">Hi Rudra, I saw your portfolio and I'm interested in collaborating on a React project...</p>
                        </div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full self-center"></div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Message