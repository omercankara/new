import axios from "axios";
import api from "./api";

const editUser = (payload: any) => {
    return api.put('/auth/user', payload).then(res => {
        return res.data;
    });
};

const editPassword = (payload: any) => {
    return api.put('/auth/password', payload).then(res => {
        return res.data;
    });
};

export default {
    editUser,
    editPassword
};
