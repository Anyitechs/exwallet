import { MOCKPFI } from "@/constants/mockPfi";

export const SELECTED_OFFER = "SELECTED_OFFER";
export const SET_OFFERINGS = "SET_OFFERINGS";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const SET_USER_ID = "SET_USER_ID";

export interface GlobalState {
  MOCKPFI: typeof MOCKPFI;
  offerings: Offering[];
  loading: boolean;
  error: string | null;
  userId: string | null;
  selectedOffer: Offering | null;
}

export type GlobalAction =
  | { type: typeof SELECTED_OFFER; payload: Offering | null }
  | { type: typeof SET_OFFERINGS; payload: Offering[] }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_ERROR; payload: string | null }
  | { type: typeof SET_USER_ID; payload: string | null };

const reducer = (state: GlobalState, action: GlobalAction): GlobalState => {
  switch (action.type) {
    case SELECTED_OFFER:
      return { ...state, selectedOffer: action.payload };
    case SET_OFFERINGS:
      return { ...state, offerings: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_USER_ID:
      return { ...state, userId: action.payload };
    default:
      return state;
  }
};

export default reducer;
