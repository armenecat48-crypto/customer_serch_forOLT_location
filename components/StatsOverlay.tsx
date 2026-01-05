
import React, { useMemo } from 'react';
import { useOltStore } from '../oltStore';
import { BarChart, Sensors, Speed, Bolt } from '@mui/icons-material';

export const StatsOverlay: React.FC = () => {
  const { allOlts } = useOltStore();

  const stats = useMemo(() => {
    const totalPonUp = allOlts.reduce((sum, olt) => sum + (olt.pon_up || 0), 0);
    const totalPonDown = allOlts.reduce((sum, olt) => sum + (olt.pon_down || 0), 0);
    const totalPower = allOlts.reduce((sum, olt) => sum + (olt.power_consumption_watts || 0), 0);

    return {
      totalSites: allOlts.length,
      totalPonUp,
      totalPonDown,
      totalPower,
      avgPowerPerSite: allOlts.length > 0 ? (totalPower / allOlts.length).toFixed(1) : 0,
    };
  }, [allOlts]);

  const StatBox = ({ title, value, icon, colorClass, bgColorClass }: any) => (
    <div className={`${bgColorClass} p-3 rounded-xl border border-white flex flex-col justify-between shadow-sm`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{title}</span>
        <div className={`${colorClass} opacity-80`}>{icon}</div>
      </div>
      <div className="text-2xl font-black text-gray-800 leading-none">{value}</div>
    </div>
  );

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-[450px] z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-100">
      <div className="grid grid-cols-2 gap-3">
        <StatBox 
          title="Total Sites" 
          value={stats.totalSites} 
          icon={<Sensors fontSize="small" />} 
          colorClass="text-blue-600" 
          bgColorClass="bg-blue-50/50"
        />
        <StatBox 
          title="Total Consumption" 
          value={`${stats.totalPower}W`} 
          icon={<Bolt fontSize="small" />} 
          colorClass="text-orange-600" 
          bgColorClass="bg-orange-50/50"
        />
        <StatBox 
          title="PON Active" 
          value={stats.totalPonUp} 
          icon={<Speed fontSize="small" />} 
          colorClass="text-green-600" 
          bgColorClass="bg-green-50/50"
        />
        <StatBox 
          title="PON Offline" 
          value={stats.totalPonDown} 
          icon={<Speed fontSize="small" />} 
          colorClass="text-red-600" 
          bgColorClass="bg-red-50/50"
        />
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
        <span className="text-gray-500">Average Power usage per Site:</span>
        <span className="font-bold text-gray-800">{stats.avgPowerPerSite}W</span>
      </div>
    </div>
  );
};
