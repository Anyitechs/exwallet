import axios from 'axios';
import { MOCKPFI } from '@/constants/mockPfi';

const GET_OFFERINGS = "offerings";
const CREATE_DID_AND_VC = "did";
const GET_ALL_EXCHANGES = "exchange/all";
const CREATE_EXCHANGE = "exchange/create";
const CREATE_EXCHANGE_ORDER = "exchange/order/create";
const CLOSE_EXCHANGE_ORDER = "exchange/order/close";
const BASE_URL = "https://exwallet-7df4d97466ca.herokuapp.com/api/v1";
// const BASE_URL ="https://f6ef-102-89-76-136.ngrok-free.app/api/v1";

export const getOfferings = async (): Promise<any> => {
    try {
        const response = await axios.get(`${BASE_URL}/${GET_OFFERINGS}`);

        if (response.status === 200) {
            return response.data;
        }
    } catch (error: any) {
        console.log('error here: ', error.message);
    }
}

export const createDidAndVC = async (customerName: string, countryCode: string): Promise<any> => {
    try {
        const payload = {
            customerName,
            countryCode
        }

        const response = await axios.post(`${BASE_URL}/${CREATE_DID_AND_VC}`, payload);

        if (response.status === 201) {
            return response.data;
        }
    } catch (error: any) {
        console.log('error here: ', error.message);
    }
}

export const createExchange = async (userId: string, offering: Offering, amount: string, payoutDetails: Record<string, string>, payinDetails: Record<string, string>) => {
    try {
        console.log('user id: ', userId)
        
        const payload = {
            userId,
            offering,
            amount,
            payoutDetails,
            payinDetails
        }

        const response = await axios.post(`${BASE_URL}/${CREATE_EXCHANGE}`, payload);

        if (response.status === 201) {
            return response.data;
        }
    } catch (error: any) {
        console.log('error here: ', error.message);
    }
}

export const fetchExchanges = async (userId: string) : Promise<any> => {
    try {

        const response = await axios.get(`${BASE_URL}/${GET_ALL_EXCHANGES}/${userId}`);

        if (response.status === 200) {
            // console.log(`response data: ${JSON.stringify(response.data)}`)
            return response.data.data;
        }
    } catch (error: any) {
        console.log('error here: ', error.message);
    }
}

export const createExchangeOrder = async (userId: string, exchangeId: string, pfiUri: string) : Promise<any> => {
    try {
        const payload = {
            userId,
            exchangeId,
            pfiUri
        }

        const response = await axios.post(`${BASE_URL}/${CREATE_EXCHANGE_ORDER}`, payload);

        if (response.status === 201) {
            // console.log(`data here: ${JSON.stringify(response.data)}`)
            return response.data;
        }
    } catch (error: any) {
        console.log('error here: ', error.message)
    }
}

export const cancelExchangeOrder = async (userId: string, exchangeId: string, pfiUri: string, reason: string) : Promise<any> => {
    try {
        const payload = {
            userId, exchangeId, pfiUri, reason
        }

        const response = await axios.put(`${BASE_URL}/${CLOSE_EXCHANGE_ORDER}`, payload);

        if (response.status === 200) {
            // console.log(`data here: ${JSON.stringify(response.data)}`)
            return response.data;
        }
    } catch (error: any) {
        console.log('error here: ', error.message)
    }
}