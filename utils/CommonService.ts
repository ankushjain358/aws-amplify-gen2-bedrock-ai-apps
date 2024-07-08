class CommonService {

    public generateRandomString(): string {
        return new Date().getTime().toString();
    }

}

// Export an instance of the ApiService
const commonService = new CommonService();
export default commonService;