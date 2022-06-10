export default class ApiServerError extends Error {

    code: string;

    constructor(message: string) {
        super(message);
        this.code = '';
    }

}

export const CODE_SUCCESS = "success";
export const CODE_TOKEN_NO = "customer.error.login.no";
export const CODE_TOKEN_INVALID = "customer.error.login.invalid";
export const CODE_PRO_NO = "customer.error.is.not.member";  
export const CODE_PRO_COUNT_LIMIT = "customer.error.is.member.count.limit";   
export const CODE_ORDER_IN_PAYING = "exit.order.in.paying.error"    
export const CODE_UN_PAY = "exit.order.un.paying.error"    
export const CODE_DISCOUNT_ERROR = "coupon.code.invalid.error";   