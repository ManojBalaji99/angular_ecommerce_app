export interface shippingAddress{
    customer_id: string | undefined,
    full_name: string,
    address: string,
    city : string
}

export interface PaymentDetails{
    method: string
    details : {
    card_number: string;
    expiryDate: string;
    cvv: string;
    }
}