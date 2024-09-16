import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useReducer,
    Dispatch,
} from "react";
  
import { MOCKPFI } from "@/constants/mockPfi";
import { getOfferings } from "@/lib/tbDex";
import { getItem } from "@/lib/localStorage";
import reducer, { SELECTED_OFFER, GlobalState, GlobalAction } from "./reducer";

interface GlobalContextType {
    MOCKPFI: typeof MOCKPFI;
    offerings: Offering[];
    loading: boolean;
    error: string | null;
    userId: string | null;
    selectedOffer: Offering | null;
    setUserOffer: (offer: Offering | null) => void;
}
  
const initialState: GlobalState = {
    MOCKPFI,
    offerings: [],
    loading: true,
    error: null,
    userId: null,
    selectedOffer: null,
};
  
export const GlobalContext = createContext<GlobalContextType | undefined>(
    undefined
);
  
type ContextProviderProps = {
    children: ReactNode;
};
  
export const GlobalProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const getUserID = async () => {
        const userId = await getItem("userId");
        dispatch({ type: "SET_USER_ID", payload: userId });
    };

    const getPfiOfferings = async () => {
        try {
        const response = await getOfferings();
        if (response.success) {
            dispatch({ type: "SET_OFFERINGS", payload: response.offerings });
        }
        } catch (error: any) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        } finally {
        dispatch({ type: "SET_LOADING", payload: false });
        }
    };

    const setUserOffer = (offer: Offering | null) => {
        dispatch({ type: SELECTED_OFFER, payload: offer });
    };

    useEffect(() => {
        getUserID();
        getPfiOfferings();
    }, []);

    return (
        <GlobalContext.Provider
        value={{
            MOCKPFI: state.MOCKPFI,
            offerings: state.offerings,
            loading: state.loading,
            error: state.error,
            userId: state.userId,
            selectedOffer: state.selectedOffer,
            setUserOffer,
        }}
        >
        {children}
        </GlobalContext.Provider>
    );
};
  
export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
};
  