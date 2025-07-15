import { Asset } from "./asset";
import { Booking } from "./booking";
import { FinanceReport } from "./finance";

export interface Site {
  id: number;
  sitename: string;
  standard_code?: string;
  phase_id: string;
  region_id: string;
  state_id: number;
  state: State;
  active_status: number;
  is_active: boolean;
  email: string;
  website: string;
  website_last_updated: string;
  longtitude: string;
  latitude: string;
  operate_date: string;
  technology: string;
  bandwidth: string;
  building_type_id: string;
  building_area_id: string;
  building_rental_id: boolean;
  zone_id: string;
  area_id: string;
  level_id: string;
  oku_friendly: boolean;
  dusp_tp_id: string;
  dusp_tp_id_display: string;
  dusp_tp?: {
    id: string;
    name: string;
    parent?: {
      id: string;
      name: string;
      logo_url?: string;
    };
  }; // Add dusp_tp field for organization details
  nd_site_status: {
    eng: string;
  };
  nd_site_profile: {
    sitename: string;
    state_id: number;
  };
  nd_site: {
    id: string;
    standard_code: string;
    refid_tp: string;
    refid_mcmc: string;
    nd_site_profile?: {
      nd_asset?: Asset[];
    };
    nd_asset: Asset[];
  }[];
  nd_phases: {
    name: string;
  };
  nd_region: {
    eng: string;
  };
  nd_site_address: {
    address1: string;
    address2: string;
    postcode: string;
    city: string;
    district_id: string;
    state_id: string;
    nd_state: {
      id: string;
      name: string;
    };
  }[];
  nd_parliament?: {
    id: string;
  };
  nd_dun?: {
    id: string;
  };
  nd_mukim?: {
    id: string;
  };
  nd_site_socioeconomic: {
    nd_socioeconomics: {
      id: string;
      eng: string;
    };
  }[];
  nd_site_space: {
    nd_space: {
      id: string;
      eng: string;
    };
  }[];
  nd_site_operation?: {
    id: number;
    days_of_week: string;
    open_time: string;
    close_time: string;
    is_closed: boolean;
  }[];
  nd_asset?: Asset[];
}

export interface SiteStatus {
  id: string;
  eng: string;
}

export interface Phase {
  id: string;
  name: string;
}

export interface Region {
  id: string;
  eng: string;
}

export interface District {
  id: string;
  name: string;
}

export interface Parliament {
  id: string;
  fullname: string;
}

export interface Dun {
  id: string;
  full_name: string;
}

export interface Mukim {
  id: string;
  name: string;
}

export interface State {
  id: string | number;
  name: string;
}

export interface Technology {
  id: string;
  name: string;
}

export interface Bandwidth {
  id: string;
  name: string;
}

export interface BuildingType {
  id: string;
  eng: string;
}

export interface Zone {
  id: string;
  area: string;
  zone: string;
}

export interface CategoryArea {
  id: string;
  name: string;
}

export interface BuildingLevel {
  id: string;
  eng: string;
}

export interface Socioeconomic {
  id: string;
  eng: string;
}
export interface Space {
  id: number;
  eng: string;
  is_enable_book?: boolean;
  created_by?: string;
  created_at?: string | Date;
  updated_by?: string;
  updated_at?: string | Date;
}

export interface SiteSpace {
  id: number;
  nd_space?: Space;
  nd_site_profile?: SiteProfile;
  nd_booking?: Booking[];
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by?: string;
  updated_by?: string;
}

export interface SiteProfile {
  id: number;
  refid_tp?: string;
  dusp_tp_id?: string;
  region_id?: number;
  phase_id?: number;
  state_id?: number;
  parliament_rfid?: number;
  dun_rfid?: number;
  mukim_id?: number;
  ust_id?: number;
  active_status?: number;
  sitename?: string;
  fullname?: string;
  latitude?: string;
  longtitude?: string;
  website?: string;
  operate_date?: string;
  nd_site?: Site[];
  nd_state?: State;
  nd_phases?: Phase;
  nd_region?: Region;
  nd_finance_report?: FinanceReport[];
}

export interface SiteOption {
  id: string;
  label: string;
}
