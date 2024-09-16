export const filterOfferings = (offerings: Offering[]) => {
    const currencyOptions = Array.from(
        new Set([
          ...offerings.map((offering) => offering.data.payin.currencyCode),
          ...offerings.map((offering) => offering.data.payout.currencyCode),
        ])
    ).map((currency) => ({ label: currency, value: currency }));
    
    return currencyOptions;
}

export const matchedOfferings = (offerings: Offering[], fromCurrency: string, toCurrency: string) => {
    return offerings.filter(
        (offering) =>
        offering.data.payin.currencyCode === fromCurrency &&
        offering.data.payout.currencyCode === toCurrency
    );
}
