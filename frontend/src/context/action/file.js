import axios from "axios";
import Cookies from 'js-cookie'
import {getHeader, login} from "./auth";

export const getFolder = (sub_folder = "") => {
    return axios
        .get(`api/directory/folder/${sub_folder}`, getHeader())
        .then(res => {
            let data = {status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const createNewFolder = (folder) => {
    const body = JSON.stringify({...folder})
    return axios
        .post(`api/directory/folder/`,body, getHeader())
        .then(res => {
            let data = {message: {message: "Folder Create", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const updateFolder = (folder) => {
    const id = folder.id
    delete folder.id
    const body = JSON.stringify({...folder})
    return axios
        .patch(`api/directory/folder/${id}/`,body, getHeader())
        .then(res => {
            let data = {message: {message: "Folder Updated", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const uploadFile = (source, name, size, folder=null) => {
    //const body = JSON.stringify({...folder})
    let config = getHeader()
    config['Content-Type'] = 'multipart/form-data'
    let body = new FormData()
    body.append("content", source)
    body.append("name", name)
    body.append("size", size)
    folder && body.append("folder", folder)

    console.log(source, name, size, parseInt(folder), body)
    return axios
        .post("/api/directory/file/", body, config)
        .then(res => {
             let data = {message: {message: "Confirm", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            console.log(error.response.data)
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const shareUserFile = ({id, email}) => {
    const body = JSON.stringify(email)
    console.log(email, body)
    return axios
        .post(`/api/directory/file/${id}/share/`, body, getHeader())
        .then(res => {
             let data = {message: {message: "Confirm", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const deleteUserContent = ({id, fType}) => {
    return axios
        .delete(`/api/directory/${fType}/${id}/`, getHeader())
        .then(res => {
            let data = {message: {message: "Successfully Delete", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const userSharedFile = () => {
    return axios
        .get("/api/directory/shared/files/", getHeader())
        .then(res => {
            let data = {status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}