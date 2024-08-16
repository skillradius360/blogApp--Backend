class apiResponse{
    constructor(statusCode, data,error=[], stack=''){
            this.statusCode= statusCode
            this.response = statusCode
            this.success="success"
            this.error=error
            this.data= data
    }
}

export {apiResponse}