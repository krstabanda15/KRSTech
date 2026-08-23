export const STUDENT_DISCOUNT_RATE = 0.1;
export const FREE_SHIPPING_THRESHOLD = 2999;
export const STANDARD_SHIPPING_FEE = 199;
export const studentPrice = (price:number) => Math.round(price * (1 - STUDENT_DISCOUNT_RATE));
export const discountPercent = (price:number, compareAt?:number) => compareAt && compareAt > price ? Math.round((1-price/compareAt)*100) : 0;

export const NFC_PRICES = {
  tag:199,
  keychain:299,
  pet:349,
  bracelet:399,
  card:499,
  couple:699,
  stand:599,
  premiumCard:899,
} as const;

export const bundleDefinitions = [
  {id:"student",name:"KADA Student Essentials",productIds:["5","22","17","20"],discountRate:.1},
  {id:"gamer",name:"KADA Gamer Starter",productIds:["2","6","9","17"],discountRate:.1},
  {id:"creator",name:"KADA Creator Starter",productIds:["21","20","22"],discountRate:.08},
] as const;

export const calculateBundle = (prices:number[],discountRate:number) => {
  const separate=prices.reduce((sum,price)=>sum+price,0);
  const price=Math.round(separate*(1-discountRate));
  return {separate,price,savings:separate-price};
};
export const businessNfcBundle = calculateBundle([NFC_PRICES.card,NFC_PRICES.stand,NFC_PRICES.keychain],.1);
