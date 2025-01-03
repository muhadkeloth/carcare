
export type returnvalue = string | boolean;
export type returnApiPromise = {status:number;data:any};
export type bodyEmailvsRole = {email:string,role:string}

export type Message = {
    _id?:string;
    chatId:string;
    senderId:string;
    message:string;
    image?:string;
    createdAt:string;
};

export type onlineUser = {userId:string;isOnline:boolean}