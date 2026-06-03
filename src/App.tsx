import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Dribbble,
  Eye,
  EyeOff,
  FileText,
  Info,
  LayoutGrid,
  MessageSquare,
  Search,
  Spade,
  Timer,
  TrendingUp,
  Trophy,
  User,
  Wallet,
  X,
} from 'lucide-react';

export default function App() {
  // Vault state & User values
  const [balanceBTC, setBalanceBTC] = useState<number>(0.035);
  const [balanceUSDT, setBalanceUSDT] = useState<number>(2373.00);
  
  const [activeCurrency, setActiveCurrency] = useState<'BTC' | 'USDT'>('BTC');
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(true); // Open by default as requested!
  const [vaultTab, setVaultTab] = useState<'deposit' | 'withdraw'>('withdraw');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0.035');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showHeaderDropdown, setShowHeaderDropdown] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'casino' | 'bets' | 'sports' | 'chat'>('browse');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      setNotification(`Please enter a valid ${activeCurrency} wallet address.`);
      return;
    }
    if (!password) {
      setNotification("Please enter password to withdraw.");
      return;
    }
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setNotification("Please enter a valid withdrawal amount.");
      return;
    }

    const shortAddress = walletAddress.trim().length > 12 
      ? `${walletAddress.trim().substring(0, 6)}...${walletAddress.trim().slice(-4)}` 
      : walletAddress.trim();

    if (activeCurrency === 'BTC') {
      if (amt > balanceBTC) {
        setNotification("Insufficient balance in your vault.");
        return;
      }
      setBalanceBTC(prev => Number((prev - amt).toFixed(8)));
      setNotification(`Successfully processed withdrawal of ${parseFloat(amt.toFixed(8))} BTC to wallet ${shortAddress}!`);
    } else {
      if (amt > balanceUSDT) {
        setNotification("Insufficient balance in your vault.");
        return;
      }
      setBalanceUSDT(prev => Number((prev - amt).toFixed(2)));
      setNotification(`Successfully processed withdrawal of $${amt.toFixed(2)} USDT to wallet ${shortAddress}!`);
    }
    
    setPassword('');
    setWalletAddress('');
    setTimeout(() => {
      setNotification(null);
      setIsVaultOpen(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#1A2530] text-white pb-20 font-sans selection:bg-[#1475E1] selection:text-white relative">
      {/* Top Header */}
      <header className="flex items-center justify-between px-3 py-3 bg-[#1A2530] sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="text-3xl font-serif italic text-white flex items-center justify-center cursor-pointer" onClick={() => setIsVaultOpen(true)}>
            S<span className="text-[#1A2530] hidden">take</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          {/* Balance Container with switcher */}
          <div className="relative">
            <div className="flex items-center bg-[#24333E] rounded text-sm divide-x divide-[#1A2530] overflow-hidden drop-shadow-sm">
              <button 
                onClick={() => setShowHeaderDropdown(!showHeaderDropdown)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#2d3e4b] transition-colors"
                id="header-balance-dropdown-btn"
              >
                <span className="font-semibold text-[15px]">
                  {activeCurrency === 'BTC' ? parseFloat(balanceBTC.toFixed(8)).toString() : balanceUSDT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {activeCurrency === 'BTC' ? (
                  <div className="w-4 h-4 bg-[#F7931A] rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
                    ₿
                  </div>
                ) : (
                  <div className="w-4 h-4 bg-[#50AF95] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                    T
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-[#B1B8BE]" />
              </button>
              <button 
                onClick={() => {
                  setVaultTab('withdraw');
                  setIsVaultOpen(true);
                }}
                className="bg-[#1475E1] px-4 py-2 hover:bg-[#1a80f0] transition-colors cursor-pointer"
                id="wallet-open-btn-header"
                title="Wallet Vault"
              >
                <Wallet className="w-4 h-4 fill-white" />
              </button>
            </div>

            {showHeaderDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-[#24333E] rounded-lg shadow-xl border border-[#304554] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                <div className="p-1.5 flex flex-col gap-1">
                  <button 
                    onClick={() => {
                      setActiveCurrency('BTC');
                      setWithdrawAmount(parseFloat(balanceBTC.toFixed(8)).toString());
                      setShowHeaderDropdown(false);
                    }}
                    className={`flex items-center justify-between w-full p-2 rounded-md text-left text-xs transition-colors hover:bg-[#304554] ${activeCurrency === 'BTC' ? 'bg-[#1c2831] text-white font-semibold' : 'text-[#B1B8BE]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#F7931A] rounded-full flex items-center justify-center text-[9px] font-bold text-white">₿</div>
                      <span>Bitcoin (BTC)</span>
                    </div>
                    <span>{parseFloat(balanceBTC.toFixed(8)).toString()}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setActiveCurrency('USDT');
                      setWithdrawAmount(balanceUSDT.toFixed(2));
                      setShowHeaderDropdown(false);
                    }}
                    className={`flex items-center justify-between w-full p-2 rounded-md text-left text-xs transition-colors hover:bg-[#304554] ${activeCurrency === 'USDT' ? 'bg-[#1c2831] text-white font-semibold' : 'text-[#B1B8BE]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#50AF95] rounded-full flex items-center justify-center text-[10px] font-bold text-white">T</div>
                      <span>Tether (USDT)</span>
                    </div>
                    <span>${balanceUSDT.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              setVaultTab('withdraw');
              setIsVaultOpen(true);
            }}
            className="w-8 h-8 bg-[#304554] hover:bg-[#3b5466] transition-colors rounded flex items-center justify-center text-sm font-semibold ml-2 text-white shadow-sm"
          >
            C
          </button>
          <button className="p-2 text-white relative">
            <Bell className="w-5 h-5 fill-current" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1A2530]"></span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* User Stats Card */}
        <div className="mx-4 my-2 p-4 bg-[#24333E] rounded-xl border border-[#304554] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center">
              cash2cash310 <ChevronRight className="w-4 h-4 ml-1 text-[#B1B8BE]" />
            </h2>
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm font-bold">0.00%</span>
            <Info className="w-4 h-4 text-[#B1B8BE]" />
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#17212B] rounded-full overflow-hidden mb-2">
            <div className="w-[5%] h-full bg-[#14E153] rounded-full shadow-[0_0_8px_#14E153]"></div>
          </div>
          <p className="text-xs text-[#B1B8BE]">Next level: Bronze</p>
        </div>

        {/* Casino & Sports Category Cards */}
        <div className="grid grid-cols-2 gap-3 mx-4 my-4">
          {/* Casino Card */}
          <button className="bg-[#24333E] rounded-xl overflow-hidden flex flex-col group transition-transform active:scale-95">
            <div className="h-28 w-full relative overflow-hidden">
              <img 
                src="https://mediumrare.imgix.net/casino-16-jan-2026-en.png?w=700&h=460&fit=min&auto=format" 
                alt="Casino" 
                className="w-full h-full object-cover" 
                draggable={false}
              />
            </div>
            <div className="p-3 flex justify-between items-center w-full bg-[#24333E]">
              <span className="font-semibold px-1">Casino</span>
              <div className="flex items-center gap-1.5 text-xs text-[#B1B8BE]">
                <div className="w-2 h-2 rounded-full bg-[#14E153] shadow-[0_0_6px_#14E153]"></div>
                55,027
              </div>
            </div>
          </button>

          {/* Sports Card */}
          <button className="bg-[#24333E] rounded-xl overflow-hidden flex flex-col group transition-transform active:scale-95">
            <div className="h-28 w-full relative overflow-hidden">
              <img 
                src="https://mediumrare.imgix.net/sports-16-jan-2026-en.png?cacheBuster=1&w=700&h=460&fit=min&auto=format" 
                alt="Sports" 
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="p-3 flex justify-between items-center w-full bg-[#24333E]">
              <span className="font-semibold px-1">Sports</span>
              <div className="flex items-center gap-1.5 text-xs text-[#B1B8BE]">
                <div className="w-2 h-2 rounded-full bg-[#14E153] shadow-[0_0_6px_#14E153]"></div>
                44,724
              </div>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mx-4 my-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#B1B8BE]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3.5 bg-[#0F212E] border border-transparent rounded-lg leading-5 text-white placeholder-[#B1B8BE] focus:outline-none focus:bg-[#24333E] focus:border-[#304554] transition-all hover:bg-[#24333E] text-sm"
            placeholder="Search your game or event"
          />
        </div>

        {/* Trending Games Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center px-4 mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-white" /> Trending Games
            </h2>
            <button className="text-sm font-semibold text-white hover:text-gray-300">
              View All
            </button>
          </div>

          {/* Horizontal Scroll list */}
          <div className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {/* Game 1 */}
            <div className="snap-start shrink-0 w-[124px] sm:w-[140px] flex flex-col gap-2 cursor-pointer group">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative shadow-md">
                <img 
                  src="https://mediumrare.imgix.net/14d5410c6cf4c303d291262a10e949dc14b0ac2eca2a7a730b0401919c01358e?w=360&h=472&fit=min&auto=format" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  alt="Gates of Olympus"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#B1B8BE]">
                <div className="w-[6px] h-[6px] rounded-full bg-[#14E153] shadow-[0_0_4px_#14E153]"></div>
                635 <span className="text-[10px]">playing</span>
              </div>
            </div>

            {/* Game 2 */}
            <div className="snap-start shrink-0 w-[124px] sm:w-[140px] flex flex-col gap-2 cursor-pointer group">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative shadow-md">
                <img 
                  src="https://mediumrare.imgix.net/76411df1039d658a8b9c9f90c14467c7ca7c240feeed97274ea73208d786484e?w=360&h=472&fit=min&auto=format" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  alt="Sugar Rush"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#B1B8BE]">
                <div className="w-[6px] h-[6px] rounded-full bg-[#14E153] shadow-[0_0_4px_#14E153]"></div>
                547 <span className="text-[10px]">playing</span>
              </div>
            </div>

            {/* Game 3 */}
            <div className="snap-start shrink-0 w-[124px] sm:w-[140px] flex flex-col gap-2 cursor-pointer group">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative shadow-md">
                <img 
                  src="https://mediumrare.imgix.net/fdf333e96a5e21555bbb4e9e04a3ee4e1986c9cca9aa75141597041cc8334d23?w=360&h=472&fit=min&auto=format" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  alt="Sweet Bonanza"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#B1B8BE]">
                <div className="w-[6px] h-[6px] rounded-full bg-[#14E153] shadow-[0_0_4px_#14E153]"></div>
                320 <span className="text-[10px]">playing</span>
              </div>
            </div>
            
             {/* Load More Area block */}
             <div className="snap-start shrink-0 w-[80px] flex flex-col gap-2 items-center justify-center opacity-0">
               {/* Spacer to allow scrolling past last item */}
             </div>
          </div>
          
          {/* Centered Load More Divider */}
          <div className="flex items-center justify-center mt-2 pb-6 px-4">
            <div className="h-px bg-[#304554] flex-1"></div>
            <button className="text-sm font-semibold text-[#B1B8BE] hover:text-white transition-colors px-4">
              Load More
            </button>
            <div className="h-px bg-[#304554] flex-1"></div>
          </div>
        </div>

        {/* Trending Sports Section */}
        <div className="mt-2">
          <div className="flex justify-between items-center px-4 mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Dribbble className="w-5 h-5 text-[#B1B8BE]" /> Trending Sports
            </h2>
            <button className="text-sm font-semibold text-white hover:text-gray-300">
              View All
            </button>
          </div>

          {/* Horizontal Scroll list for Sports */}
          <div className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {/* Sport 1: Soccer */}
            <div className="snap-start shrink-0 w-[124px] sm:w-[140px] flex flex-col gap-2 cursor-pointer group">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative shadow-md bg-[#24333E]">
                <img 
                  src="https://mediumrare.imgix.net/soccer-en.png?w=360&h=472&fit=min&auto=format" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  alt="Soccer"
                />
              </div>
            </div>

            {/* Sport 2: Tennis */}
            <div className="snap-start shrink-0 w-[124px] sm:w-[140px] flex flex-col gap-2 cursor-pointer group">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative shadow-md bg-[#24333E]">
                <img 
                  src="https://mediumrare.imgix.net/tennis-en.png?w=360&h=472&fit=min&auto=format" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  alt="Tennis"
                />
              </div>
            </div>

            {/* Sport 3: Basketball */}
            <div className="snap-start shrink-0 w-[124px] sm:w-[140px] flex flex-col gap-2 cursor-pointer group">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative shadow-md bg-[#24333E]">
                <img 
                  src="https://mediumrare.imgix.net/basketball-en.png?w=360&h=472&fit=min&auto=format" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  alt="Basketball"
                />
              </div>
            </div>
            
             {/* Spacer */}
             <div className="snap-start shrink-0 w-[80px] flex flex-col gap-2 items-center justify-center opacity-0"></div>
          </div>

          {/* Centered Load More Divider */}
          <div className="flex items-center justify-center mt-2 pb-6 px-4">
            <div className="h-px bg-[#304554] flex-1"></div>
            <button className="text-sm font-semibold text-[#B1B8BE] hover:text-white transition-colors px-4">
              Load More
            </button>
            <div className="h-px bg-[#304554] flex-1"></div>
          </div>
        </div>

        {/* Races & Raffles Section */}
        <div className="mt-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Timer className="w-5 h-5 text-[#B1B8BE]" /> Races & Raffles
            </h2>
            <div className="flex bg-[#24333E] rounded-md overflow-hidden">
              <button className="px-3 py-2 border-r border-[#1A2530] hover:bg-[#304554] transition-colors text-[#B1B8BE]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 hover:bg-[#304554] transition-colors text-[#B1B8BE] hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[#24333E] rounded-xl outline outline-1 outline-[#304554] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[17px] mb-1">$100k Race</h3>
                <p className="text-[#B1B8BE] tracking-tight text-sm mb-4">Ready to race to the top?</p>
                <div className="flex items-center gap-3">
                  <button className="bg-[#304554] hover:bg-[#3B5466] transition-colors text-white text-[13px] font-semibold px-4 py-2.5 rounded-md">
                    Leaderboard
                  </button>
                  <button className="text-[#B1B8BE] hover:text-white">
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center -mt-2">
                {/* Circular timer */}
                <div className="relative w-[110px] h-[110px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="55" cy="55" r="48" fill="none" stroke="#304554" strokeWidth="8" />
                    <circle cx="55" cy="55" r="48" fill="none" stroke="#2596be" strokeWidth="8" strokeDasharray="301" strokeDashoffset="40" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(37,150,190,0.5)]" />
                  </svg>
                  <div className="flex flex-col items-center justify-center z-10 pt-1">
                    <span className="text-[#B1B8BE] text-[11px] font-semibold mb-0.5">Ends in</span>
                    <span className="font-bold text-[15px] tracking-tight text-white">23h 59m</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 mt-6 border-t border-[#304554] flex items-center gap-2 text-[13px]">
              <Trophy className="w-[18px] h-[18px] text-[#B1B8BE]" />
              <span className="text-[#B1B8BE]">Not entered yet</span>
            </div>
          </div>
        </div>

        {/* Bets Tabs and Table Section */}
        <div className="mt-8 mx-4">
          <div className="flex gap-4 border-b border-[#304554] mb-5 overflow-x-auto hide-scrollbar">
            <button className="pb-3 px-1 border-b-2 border-transparent text-[#B1B8BE] hover:text-white transition-colors font-semibold text-sm whitespace-nowrap bg-[#2A3B47] rounded-t-lg rounded-tr-[24px] px-4 -ml-4 flex-1 text-center bg-opacity-0">
             <div className="bg-[#2A3B47] -ml-4 px-6 py-2.5 rounded-t-lg rounded-tr-[12px] border-b-2 border-[#1475E1] text-white">
               Casino Bets
             </div>
            </button>
            <button className="pb-3 px-1 border-b-2 border-transparent text-white hover:text-white transition-colors font-semibold text-sm whitespace-nowrap pt-2.5">
              Sports Bets
            </button>
            <button className="pb-3 px-1 border-b-2 border-transparent text-white hover:text-white transition-colors font-semibold text-sm whitespace-nowrap pt-2.5">
              Race Leaderboard
            </button>
          </div>

          <div className="bg-[#24333E] rounded-xl outline outline-1 outline-[#304554] shadow-sm mb-[80px]">
             <div className="flex justify-between items-center text-xs font-semibold text-[#B1B8BE] px-4 py-4 border-b border-[#304554]">
               <span>Game</span>
               <span>Payout</span>
             </div>
             
             {/* Row 1 */}
             <div className="flex justify-between items-center px-4 py-3.5 border-b border-[#304554] hover:bg-[#2A3B47] transition-colors cursor-pointer">
               <div className="flex items-center gap-3 w-1/2">
                 <div className="opacity-80">
                   <LayoutGrid className="w-[18px] h-[18px] text-[#B1B8BE] -rotate-45" /> {/* Fake icon for cards/bets */}
                 </div>
                 <span className="text-[13px] font-semibold truncate text-white">First Person Bl...</span>
               </div>
               <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#14E153]">
                 3558.502500...
                 <div className="w-[14px] h-[14px] bg-[#50AF95] rounded-full flex items-center justify-center text-[9px] font-bold text-white">T</div>
               </div>
             </div>

             {/* Row 2 */}
             <div className="flex justify-between items-center px-4 py-3.5 hover:bg-[#2A3B47] transition-colors cursor-pointer rounded-b-xl">
               <div className="flex items-center gap-3 w-1/2">
                 <div className="opacity-80">
                   <Dribbble className="w-[18px] h-[18px] text-[#B1B8BE]" />
                 </div>
                 <span className="text-[13px] font-semibold truncate text-white">Ruleta en Espa...</span>
               </div>
               <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#14E153]">
                 8290.000000...
                 <div className="w-[14px] h-[14px] bg-[#50AF95] rounded-full flex items-center justify-center text-[9px] font-bold text-white">T</div>
               </div>
             </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 px-4 w-full max-w-2xl mx-auto left-0 right-0 flex justify-between items-center pointer-events-none z-40">
        <button className="w-11 h-11 bg-[#24333E] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-[#304554] pointer-events-auto transition-transform active:scale-95">
          <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center overflow-hidden">
             <div className="w-2 relative right-[2px] h-2 bg-white rotate-45 transform scale-x-[2]"></div>
          </div>
        </button>
        <button className="w-12 h-12 bg-[#304554] hover:bg-[#3B5466] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] text-white pointer-events-auto transition-transform active:scale-95">
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-[#24333E] border-t border-[#304554] px-2 py-2 flex justify-between items-center text-xs z-50 iphone-safe-area pb-safe">
        {/* Helper for iOS bottom safe area */}
        <style>{`
          .pb-safe { padding-bottom: max(env(safe-area-inset-bottom), 0.5rem); }
        `}</style>
        <button className="flex flex-col items-center justify-center w-1/5 py-1 text-white gap-1 hover:text-white transition-colors">
          <LayoutGrid className="w-5 h-5 fill-[#B1B8BE] text-[#24333E]" />
          <span className="font-medium text-[11px]">Browse</span>
        </button>
        <button className="flex flex-col items-center justify-center w-1/5 py-1 text-[#B1B8BE] hover:text-white transition-colors">
          <Spade className="w-5 h-5 fill-current text-[#B1B8BE]" />
          <span className="font-medium text-[11px] mt-1">Casino</span>
        </button>
        <button className="flex flex-col items-center justify-center w-1/5 py-1 text-[#B1B8BE] hover:text-white transition-colors">
          <FileText className="w-5 h-5 fill-current text-[#B1B8BE]" />
          <span className="font-medium text-[11px] mt-1">Bets</span>
        </button>
        <button className="flex flex-col items-center justify-center w-1/5 py-1 text-[#B1B8BE] hover:text-white transition-colors">
          <Trophy className="w-5 h-5 fill-current text-[#B1B8BE]" />
          <span className="font-medium text-[11px] mt-1">Sports</span>
        </button>
        <button className="flex flex-col items-center justify-center w-1/5 py-1 text-[#B1B8BE] hover:text-white transition-colors">
          <MessageSquare className="w-5 h-5 fill-current text-[#B1B8BE]" />
          <span className="font-medium text-[11px] mt-1">Chat</span>
        </button>
      </nav>

      {/* Vault / Withdrawal modal overlay representation */}
      {isVaultOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-[450px] bg-[#1a2c38] border border-[#2d404e] rounded-2xl shadow-2xl overflow-hidden dynamic-modal animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#1e323e] border-b border-[#2d404e]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center border-2 border-dashed border-[#b1b8be] rounded-md relative bg-[#13232c]">
                  <div className="w-2 h-2 rounded-full border border-[#b1b8be] bg-transparent"></div>
                </div>
                <span className="font-bold text-[16px] tracking-wide text-white">Vault</span>
              </div>
              <button 
                onClick={() => setIsVaultOpen(false)}
                className="text-[#B1B8BE] hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-[#2e4350]"
                id="vault-close-btn-header"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 bg-[#0f212e] text-sans">
              
              {/* Deposit/Withdraw Switcher */}
              <div className="flex bg-[#1a2c38] p-1 rounded-xl mb-6 border border-[#233543]">
                <button
                  type="button"
                  onClick={() => {
                    setVaultTab('deposit');
                    setNotification(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    vaultTab === 'deposit' 
                      ? 'bg-[#2f4553] text-white shadow-sm shadow-black/30' 
                      : 'text-[#8b9ba5] hover:text-white'
                  }`}
                >
                  Deposit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVaultTab('withdraw');
                    setNotification(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    vaultTab === 'withdraw' 
                      ? 'bg-[#2f4553] text-white shadow-sm shadow-black/30' 
                      : 'text-[#8b9ba5] hover:text-white'
                  }`}
                >
                  Withdraw
                </button>
              </div>

              {vaultTab === 'deposit' ? (
                // Deposit Workspace
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-[#1a2c38] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#2d404e]">
                    <Wallet className="w-6 h-6 text-[#1475E1]" />
                  </div>
                  <h4 className="font-bold text-[15px] mb-1">Deposit To Secure Vault</h4>
                  <p className="text-xs text-[#8b9ba5] max-w-xs mx-auto mb-5 leading-relaxed">
                    Instantly save your active balance to the offline protected vault. 
                  </p>
                  <button 
                    onClick={() => setVaultTab('withdraw')}
                    className="w-full bg-[#1475E1] hover:bg-[#1a80f0] text-xs font-bold text-white py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Go Back to Withdraw
                  </button>
                </div>
              ) : (
                // Withdraw Workspace Form
                <form onSubmit={handleWithdraw} className="space-y-4">
                  {notification && (
                    <div className={`p-3 rounded-lg text-xs leading-relaxed font-semibold transition-all ${
                      notification.includes('Successfully') 
                        ? 'bg-[#14E153]/20 border border-[#14E153]/40 text-[#14E153]' 
                        : 'bg-red-500/20 border border-red-500/40 text-red-400'
                    }`}>
                      {notification}
                    </div>
                  )}

                  {/* Available Vault Balance */}
                  <div>
                    <label className="block text-[#8b9ba5] text-xs font-bold mb-2">Available Vault Balance</label>
                    <div className="bg-[#1a2c38] border border-[#2d404e] rounded-xl p-3.5 flex items-center justify-between select-none">
                      <div className="flex items-center gap-3">
                        {activeCurrency === 'BTC' ? (
                          <div className="w-9 h-9 bg-[#F7931A] rounded-full flex items-center justify-center text-md font-extrabold text-white shadow-md shadow-[#F7931A]/15">
                            ₿
                          </div>
                        ) : (
                          <div className="w-9 h-9 bg-[#50AF95] rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md shadow-[#50AF95]/15">
                            T
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-white leading-tight">
                            {activeCurrency === 'BTC' ? 'BTC' : 'USDT'}
                          </p>
                          <p className="text-[10px] font-bold text-[#8b9ba5] mt-0.5">
                            {activeCurrency === 'BTC' ? 'Bitcoin' : 'Tether'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-[15px] text-white tracking-wide">
                          {activeCurrency === 'BTC' ? parseFloat(balanceBTC.toFixed(8)).toString() : balanceUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] font-bold text-[#8b9ba5] leading-normal mt-0.5">
                          {activeCurrency === 'BTC' ? `$${(balanceBTC * 67800).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD` : `$${balanceUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount Box */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[#8b9ba5] text-xs font-bold">Amount</label>
                      <span className="text-xs font-bold text-[#8b9ba5]">
                        {activeCurrency === 'BTC' ? `$${(parseFloat(withdrawAmount || '0') * 67800).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${parseFloat(withdrawAmount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>
                    <div className="relative flex items-center bg-[#13232c] border border-[#2d404e] rounded-xl overflow-hidden focus-within:border-[#1475E1] transition-all">
                      <input
                        type="text"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="flex-1 bg-transparent border-none text-white text-sm font-bold py-3.5 px-4 outline-none placeholder-[#4a5c68]"
                        placeholder={activeCurrency === 'BTC' ? "0.00" : "0.00"}
                        required
                      />
                      <div className="flex items-center gap-2 pr-3.5 pl-2 z-10 select-none">
                        {activeCurrency === 'BTC' ? (
                          <span className="w-5 h-5 bg-[#F7931A] rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shadow-xs">₿</span>
                        ) : (
                          <span className="w-5 h-5 bg-[#50AF95] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs">T</span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (activeCurrency === 'BTC') {
                              setWithdrawAmount(parseFloat(balanceBTC.toFixed(8)).toString());
                            } else {
                              setWithdrawAmount(balanceUSDT.toFixed(2));
                            }
                          }}
                          className="bg-[#24333E] hover:bg-[#2d404e] transition-colors text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-[#2d404e]"
                        >
                          Max
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Address Box */}
                  <div>
                    <label className="block text-[#8b9ba5] text-xs font-bold mb-2">
                      Wallet Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center bg-[#13232c] border border-[#2d404e] rounded-xl overflow-hidden focus-within:border-[#1475E1] transition-all">
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="flex-1 bg-transparent border-none text-white text-sm py-3.5 px-4 outline-none placeholder-[#4a5c68]"
                        placeholder={activeCurrency === 'BTC' ? "Paste BTC wallet address" : "Paste USDT ERC-20 / TRC-20 wallet address"}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Requirement Box */}
                  <div>
                    <label className="block text-[#8b9ba5] text-xs font-bold mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center bg-[#13232c] border border-[#2d404e] rounded-xl overflow-hidden focus-within:border-[#1475E1] transition-all">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 bg-transparent border-none text-white text-sm py-3.5 px-4 outline-none placeholder-[#4a5c68] font-mono tracking-wider"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-3 text-[#8b9ba5] hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Trigger */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full bg-[#1475E1] hover:bg-[#1a80f0] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md active:scale-[0.99] transition-all cursor-pointer"
                    >
                      Withdraw to Wallet
                    </button>
                  </div>
                </form>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

