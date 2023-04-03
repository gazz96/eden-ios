import { API_URL, axiosRequest } from "../constant"
import Toast from 'react-native-toast-message';

const AuthAction = {
    attempt: async(email, password) => {
        const response = await axiosRequest.post('/auth/login',{
            email: email,
            password: password
        })
        return response.data;
    },
    register: async(data={}) => {
        const response = await axiosRequest.post('/auth/register',data)
        return response.data;
       
    },
    sendTokenResetPassword: async(data={}) => {
        const response = await axiosRequest.post('/user/send-reset-password-token',data)
        return response.data;
       
    },
    resetPassword: async(data={}) => {
        const response = await axiosRequest.post('/user/update-new-password',data)
        return response.data;
       
    },
    validate: async(token) => {
        return true
    },
    

}

export default AuthAction;