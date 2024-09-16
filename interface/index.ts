interface Offering {
    metadata: {
      from: string;
      protocol: string;
      kind: string;
      id: string;
      createdAt: string;
    };
    data: {
      description: string;
      payoutUnitsPerPayinUnit: string;
      payout: {
        currencyCode: string;
        methods: {
          kind: string;
          estimatedSettlementTime: number;
          requiredPaymentDetails: {
            $schema: string;
            title: string;
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: Record<string, any>;
          };
        }[];
      };
      payin: {
        currencyCode: string;
        methods: {
          kind: string;
          requiredPaymentDetails: Record<string, any>;
        }[];
      };
      requiredClaims: {
        id: string;
        format: {
          jwt_vc: {
            alg: string[];
          };
        };
        input_descriptors: {
          id: string;
          constraints: {
            fields: {
              path: string[];
              filter: {
                type: string;
                const: string;
              };
            }[];
          };
        }[];
      };
    };
    signature: string;
}
  
interface OfferingsResponse {
  success: boolean;
  message: string;
  offerings: Offering[];
}

interface Metadata {
  from: string;
  to: string;
  protocol: string;
  kind: 'quote' | 'rfq' | 'order' | 'orderstatus' | 'close';
  id: string;
  exchangeId: string;
  createdAt: string;
}

interface Payin {
  amount: string;
  kind: string;
  paymentDetailsHash: string;
}

interface Payout {
  kind: string;
  paymentDetailsHash: string;
  currencyCode?: string;
  amount?: string;
}

interface Data {
  offeringId?: string;
  payin: Payin;
  payout: Payout;
  claimsHash?: string;
  expiresAt?: string;
  orderStatus?: string;
}

interface Transaction {
  metadata: Metadata;
  data: Data;
  signature: string;
  privateData?: any;
}

type TransactionResponse = Transaction[];
  