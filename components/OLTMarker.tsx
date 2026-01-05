
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { OLT } from '../types';
import { useOltStore } from '../oltStore';

interface OLTMarkerProps {
  olt: OLT;
}

export const OLTMarker: React.FC<OLTMarkerProps> = ({ olt }) => {
  const { highlightedOltId } = useOltStore();
  const isHighlighted = highlightedOltId === olt.id;

  // Determine status color: Red if down, Green if active, Orange if maintenance/unknown
  const getStatusColor = () => {
    if (olt.pon_down > 5) return '#ef4444'; // critical
    if (olt.pon_down > 0) return '#f97316'; // warning
    return '#22c55e'; // healthy
  };

  const color = getStatusColor();
  const size = isHighlighted ? 24 : 14;

  const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(0,0,0,0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      ${isHighlighted ? 'transform: scale(1.5); animation: pulse 1.5s infinite;' : ''}
    "></div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0px ${color}80; }
        70% { box-shadow: 0 0 0 15px ${color}00; }
        100% { box-shadow: 0 0 0 0px ${color}00; }
      }
    </style>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });

  return (
    <Marker position={[olt.DV_lat!, olt.DV_lng!]} icon={customIcon}>
      <Popup minWidth={280}>
        <div className="overflow-hidden font-sans">
          <div className="bg-blue-600 p-3 text-white">
            <h3 className="font-bold text-base leading-tight">{olt.site_name || 'Unnamed Site'}</h3>
            <span className="text-xs opacity-80 uppercase tracking-wider">{olt.site_code || 'No Code'}</span>
          </div>
          <div className="p-3 space-y-2 bg-white text-gray-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">IP Address</span>
              <span className="font-mono">{olt.ip_address}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-500 font-medium">Equip / Chassis</span>
              <span className="text-right">{olt.enterprise_name} ${olt.platform_chassis}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-green-50 p-2 rounded text-center">
                <p className="text-[10px] text-green-600 font-bold uppercase">PON UP</p>
                <p className="text-xl font-bold text-green-700">{olt.pon_up}</p>
              </div>
              <div className="bg-red-50 p-2 rounded text-center">
                <p className="text-[10px] text-red-600 font-bold uppercase">PON DOWN</p>
                <p className="text-xl font-bold text-red-700">{olt.pon_down}</p>
              </div>
            </div>
            <div className="bg-orange-50 p-2 rounded flex justify-between items-center">
              <span className="text-xs font-bold text-orange-700">POWER CONSUMPTION</span>
              <span className="text-sm font-bold text-orange-800">{olt.power_consumption_watts}W</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-2">
              Office: {olt.cat_office_name || 'N/A'}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
