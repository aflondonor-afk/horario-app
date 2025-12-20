import React from 'react';

interface HeaderProps {
  selectedBlock: string;
  setSelectedBlock: (block: string) => void;
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedBlock,
  setSelectedBlock,
  selectedFloor,
  setSelectedFloor,
  selectedDay,
  setSelectedDay,
}) => {
  return (
    <header className="flex-none border-b border-border-green bg-background-dark z-30 shadow-lg">
      <div className="px-6 py-3 flex items-center justify-between gap-6 overflow-x-auto no-scrollbar">
        {/* Logo and Controls */}
        <div className="flex items-center gap-4 min-w-fit">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">calendar_month</span>
          </div>
          <div className="mr-2 hidden md:block">
            <h1 className="text-white text-sm font-bold leading-tight tracking-[-0.015em]">Horario Académico</h1>
            <p className="text-text-muted text-[10px] font-medium">Gestión de Aulas</p>
          </div>
          
          {/* Dropdowns */}
          <div className="flex items-center gap-3">
            {/* Selector de Bloque */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary">
                <span className="material-symbols-outlined text-[20px]">domain</span>
              </div>
              <select 
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="pl-10 pr-8 h-9 w-40 bg-surface-dark border border-border-green rounded-full text-white text-xs font-medium focus:outline-none focus:border-primary cursor-pointer transition-colors hover:border-primary/50 appearance-none"
              >
                <option value="33">Bloque 33</option>
                <option value="32">Bloque 32</option>
                <option value="03">Bloque 03</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
              </div>
            </div>

            {/* Selector de Piso */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary">
                <span className="material-symbols-outlined text-[20px]">layers</span>
              </div>
              <select 
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="pl-10 pr-8 h-9 w-32 bg-surface-dark border border-border-green rounded-full text-white text-xs font-medium focus:outline-none focus:border-primary cursor-pointer transition-colors hover:border-primary/50 appearance-none"
              >
                <option value="1">Piso 1</option>
                <option value="2">Piso 2</option>
                <option value="3">Piso 3</option>
                <option value="4">Piso 4</option>
                <option value="5">Piso 5</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
              </div>
            </div>

            {/* Selector de Día */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </div>
              <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="pl-10 pr-8 h-9 w-36 bg-surface-dark border border-border-green rounded-full text-white text-xs font-medium focus:outline-none focus:border-primary cursor-pointer transition-colors hover:border-primary/50 appearance-none"
              >
                <option value="LUNES">Lunes</option>
                <option value="MARTES">Martes</option>
                <option value="MIÉRCOLES">Miércoles</option>
                <option value="JUEVES">Jueves</option>
                <option value="VIERNES">Viernes</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center justify-end gap-3 min-w-fit">
           <div 
             className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-surface-dark cursor-pointer hover:ring-primary transition-all" 
             style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfUMim874ctP5jFdKE-cIQfnK-Yo-wOUqc-LrQPL7Cai-OK4k3I6CTm0gJPAZ6R9w9HDlifSO0kHUL0zLEdn35aEYD9D9y5hhqaHdQjxPS421CE3WcajD0-mmlIgVXU7iTuehjoXFclwMErs1Iq_7DmEB0xxuB4oFM0R7mMLbAtxzNFNv0_01gYROUp1ivyTZJhL7rw4GXgRnZkktwJu6s3xlF392zYK6hgeOHIeLtJsUMpmMwGTl255aLSqnItKS5M0FzIkDSQQ")' }}
           >
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;