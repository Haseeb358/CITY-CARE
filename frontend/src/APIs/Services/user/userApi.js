import axios from "axios";
let apiUrl = import.meta.env.VITE_API_URL;
let userRoute = import.meta.env.VITE_API_USER_ROUTE;

function UserAPi(endpoint, method = "get", data = null) {

    try {
        
        let link = `${apiUrl}${userRoute}/${endpoint}`;
        let config = {
            method: method,
            url: link,
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true, // Include cookies in the request
        };
        if (data) {
            config.data = data;
        }
        return axios(config);


    } catch (error) {
        throw error;
    }


}
export default UserAPi;