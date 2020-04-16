function catchErrors(err, displayError) {
    let errorMsg;
    if (err.response) {
        // The request was made and the server responded with a status code that is not in the range of 2xx
        errorMsg = err.response.data
        console.error("Error response: ", errorMsg);

        // For Cloudinary image uploads
        if (err.response.data.error) {
            errorMsg = error.response.data.error.message
        }
    } else if (err.request) {
        // The request was made but no response was received
        errorMsg = err.request
        console.error("Error request: ", errorMsg);
    } else {
        // Something else happened in making the request that triggered an error
        errorMsg = err.message
        console.error("Error message: ", errorMsg);
    }
    displayError(errorMsg)
}

export default catchErrors