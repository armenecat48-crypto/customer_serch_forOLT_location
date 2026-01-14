
export interface OLT {
  id: string; // Internal unique ID
  ip_address: string;
  site_name: string | null;
  site_code: string | null;
  cat_office_name: string | null;
  equ_type_name: string;
  DV_lat: number | null;
  DV_lng: number | null;
  enterprise_name: string;
  platform_chassis: string | number;
  power_consumption_watts: number;
  pon_port: number;
  pon_up: number;
  pon_down: number;
  cat_ids: string | null;
  active_service: string | null;
  count_active_catid: number;
  count_circuits: number | null;
}

export interface SearchResult {
  olt: OLT;
  catId: string;
}

export interface MapViewState {
  center: [number, number];
  zoom: number;
}
