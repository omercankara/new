export function moneyFormat(amount: number, currency: string = 'TRY'): string {
    return new Intl.NumberFormat('tr-TR', { 
        style: 'currency', 
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}