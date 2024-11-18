import api from './api';

const login = (payload: any) => {
    return api.post('auth/login', payload);
}

const loginSocial = (payload: any) => {
    return api.post('/auth-with/google', payload);
}

const logout = () => {
    return api.post('auth/logout');
}

const register = (payload: any) => {
    console.log(payload)
    return api.post('auth/register', payload);
   
}




const refreshToken = (refreshToken: string) => {
    return api.post('auth/refresh', {
        refreshToken: refreshToken
    })
}


const meProducts = () => {
     return api.get('auth/list?with[]=products');
}


const me = () => {
    return api.post('/auth/me');
}



const forgotPasswordEmail = (payload: any) => {
    return api.post('auth/forget-password', payload)
}

const resetPassword = (payload: any) => {
    return api.post('auth/reset-password', payload)
}


export default {
    login,
    logout,
    register,
    refreshToken,
    me,
    meProducts,
    loginSocial,
    forgotPasswordEmail,
    resetPassword
}
