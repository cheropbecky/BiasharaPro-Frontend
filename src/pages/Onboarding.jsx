import React, { useEffect } from 'react';

export default function Onboarding() {
  useEffect(() => {
    const id = 'plus-jakarta-font';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div  
      className="min-h-screen md:h-screen overflow-hidden md:flex md:flex-row flex-col"
      style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}
    >
      <aside className="relative overflow-hidden md:w-1/2 w-full h-50 md:h-full bg-[#006948] text-white shrink-0 md:flex md:flex-col" aria-hidden="true">
        <img
          src="https://www.figma.com/api/mcp/asset/43040056-185f-4b2f-aa9e-d90be2bdb442"
          alt="Nairobi duka"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60"
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(128deg, rgba(0,105,72,0.8) 0%, rgba(0,133,93,0.4) 100%)',
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-12 md:p-12">
          <h2
            className="text-[32px] md:text-[48px] font-extrabold leading-[1.1]"
            style={{ letterSpacing: '-0.5px' }}
          >
            Boresha biashara yako leo.
          </h2>
          <p className="mt-4 text-[18px] text-[#f5fff7] leading-[1.6] max-w-md hidden md:block">
            Jiunge na maelfu ya wamiliki wa maduka wanaotumia BiasharaPro kusimamia mauzo na akiba zao kwa urahisi.
          </p>
        </div>
      </aside>

      <main className="md:w-1/2 w-full bg-[#eff5ef] flex items-center justify-center p-6 md:p-12 overflow-y-auto md:overflow-hidden">
        <div
          className="w-full max-w-120 rounded-3xl"
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(226,232,240,0.5)',
            padding: '49px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#006948] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 11L12 4l9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8z" fill="#fff" />
              </svg>
            </div>
            <div className="text-[24px] font-extrabold text-[#006948]">BiasharaPro</div>
          </div>

          <h3 className="mt-10 text-[24px] font-extrabold text-[#171d19] leading-[1.2]">Karibu BiasharaPro!</h3>
          <p className="mt-2 text-[16px] text-[#3d4a42] leading-normal">Tusaidie kufahamu biashara yako ili tuanze safari yetu.</p>

          <div className="flex gap-2 mt-4">
            <div className="w-8 h-1.5 rounded-full bg-[#006948]" />
            <div className="w-8 h-1.5 rounded-full bg-[#bccac0]" />
            <div className="w-8 h-1.5 rounded-full bg-[#bccac0]" />
          </div>

          <form className="mt-9.75 flex flex-col gap-3.75">
            <div>
              <label className="text-[14px] font-semibold text-[#3d4a42] uppercase tracking-[0.7px] mb-[8.59px] block">JINA LA BIASHARA</label>
              <input
                defaultValue="Mama Wanjiku General Store"
                className="w-full text-[16px] text-[#171d19] bg-[rgba(255,255,255,0.5)] border border-[#bccac0] rounded-2xl p-4.25 focus:outline-none focus:border-[#006948]"
              />
            </div>

            <div className="relative">
              <label className="text-[14px] font-semibold text-[#3d4a42] uppercase tracking-[0.7px] mb-[8.59px] block">NAMBA YA SIMU</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[16px] text-[#3d4a42]">+254</span>
                <input
                  placeholder="712 345 678"
                  className="w-full text-[16px] text-[#171d19] bg-[rgba(255,255,255,0.5)] border border-[#bccac0] rounded-2xl p-4.25 pl-15.25 placeholder-[#6b7280] focus:outline-none focus:border-[#006948]"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[14px] font-semibold text-[#3d4a42] uppercase tracking-[0.7px] mb-[8.59px] block">AINA YA BIASHARA</label>
              <div className="relative">
                <select className="w-full appearance-none text-[16px] text-[#171d19] bg-[rgba(255,255,255,0.5)] border border-[#bccac0] rounded-2xl p-4.25 pr-12 focus:outline-none focus:border-[#006948]">
                  <option>Duka la Rejareja (Retail Shop)</option>
                  <option>Duka la Hardware</option>
                  <option>Saluni</option>
                  <option>Madawa / Duka la Dawa</option>
                  <option>Mkahawa / Cafe</option>
                  <option>Nyingine</option>
                </select>
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10l5 5 5-5" stroke="#3d4a42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-2 rounded-2xl text-white text-[16px] font-medium flex items-center justify-center gap-2"
              style={{
                background: '#006948',
                paddingTop: '17px',
                paddingBottom: '16px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                transition: 'background 200ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#005a3d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#006948')}
            >
              <span>Endelea</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
 