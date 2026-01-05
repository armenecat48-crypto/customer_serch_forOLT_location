
import { create } from 'zustand';
import { OLT, MapViewState } from './types';

interface OltStore {
  allOlts: OLT[];
  setAllOlts: (olts: OLT[]) => void;
  
  highlightedOltId: string | null;
  setHighlightedOlt: (id: string | null) => void;
  
  searchResult: OLT | null;
  setSearchResult: (olt: OLT | null) => void;
  
  mapView: MapViewState;
  setMapView: (view: MapViewState) => void;
  
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useOltStore = create<OltStore>((set) => ({
  allOlts: [],
  setAllOlts: (olts) => set({ allOlts: olts }),
  
  highlightedOltId: null,
  setHighlightedOlt: (id) => set({ highlightedOltId: id }),
  
  searchResult: null,
  setSearchResult: (olt) => set({ searchResult: olt }),
  
  mapView: {
    center: [7.5, 100.5], // Center of Southern Thailand
    zoom: 7,
  },
  setMapView: (view) => set({ mapView: view }),
  
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
