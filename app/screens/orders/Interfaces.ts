interface IService{
    name:string;
    quantity:number;
    unitPrice:number;
}

interface IGarments{
    type:string;
    description:string;
    observations:string;
    services:IService[]
}

interface IOrder{
    id?:number;
    client_id:number;
    user_id:number;
    created_at?:Date | string;
    estimated_delivery_date?:Date | string;
    real_delivery_date?:Date | string;
    state:string;
    total:number;
    pagado:boolean;
    garments?:IGarments[]
}



export type {
    IOrder,
    IGarments,
    IService
}