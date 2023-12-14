export interface Cartproduct{
    product_name: string;
    category: string;
    price: number;
    quantity: number;
}

export interface Cart{
    items : Cartproduct[]
}