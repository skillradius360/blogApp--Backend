class apiResponse{
    constructor(statusCode, data,message, stack=''){
            this.statusCode= statusCode
            this.response = statusCode
            this.success="success"
            this.message=message
            this.data= data
    }
}

export {apiResponse}