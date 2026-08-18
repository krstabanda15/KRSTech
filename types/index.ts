export type Product={id:string;name:string;brand:string;category:string;price:number;oldPrice?:number;rating:number;reviewCount:number;stock:number;description:string;image:string;connection:string;specifications:Record<string,string>;highlights:string[];bestFor:string;buyerTip:string;featured?:boolean;newArrival?:boolean;bestSeller?:boolean};
export type CartLine={id:string;qty:number};
