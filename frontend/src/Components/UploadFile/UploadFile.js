import React, {useEffect, useState, useContext} from "react";
import "./UploadFile.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import {ContextMenu, MenuItem, ContextMenuTrigger, SubMenu} from "react-contextmenu";
import {useFileUpload} from "use-file-upload";
import {
    createNewFolder,
    deleteUserContent,
    getFolder,
    shareUserFile,
    updateFolder,
    uploadFile, userSharedFile
} from "../../context/action/file";
import {useNavigate, useLocation, Redirect, Link} from 'react-router-dom';
import {GlobalContext} from "../../context/Provider";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/ListGroup";
import FileViewer from "react-file-viewer";

const UploadFile = () => {
    // New Folder Function
    const {notificationDispatch, authDispatch} = useContext(GlobalContext)
    const [show, setShow] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [shareFile, setShareFile] = useState(false);
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [shared, setShared] = useState([]);
    const [editFolderData, setEditFolderData] = useState({id: '', name: ''})
    const [shareFileData, setShareFileData] = useState({id: '', email: ''})
    const [deleteData, setDeleteData] = useState({id: '', fType: ''})
    const [fileDetails, setFileDetails] = useState()
    const [folderName, setFolderName] = useState("File/Folders")

    const location = useLocation();
    const history = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Rename Function
    const [renameShow, setRenameShow] = useState(false);

    const renameHandleClose = () => setRenameShow(false);
    const renameHandleShow = () => setRenameShow(true);

    const handleFile = () => setShowFile(!showFile);
    const shareFileClose = () => setShareFile(!shareFile);

    //File Folder Details
    const [detailsShow, setDetailsShow] = useState(false);


    const detailsHandleClose = () => setDetailsShow(false);
    const detailsHandleShow = () => setDetailsShow(true);

    const onError = e => {
        console.log(e, "error in file-viewer");
    };


    useEffect(() => {
        getFolder(location.search)
            .then(res => {
                if (res.status === 400) {
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: res.message
                    })
                } else if (res.status === 200) {
                    setFolders(res.result[0].folder)
                    setFiles(res.result[0].file)
                    setFolderName(res.result[0].name || "Folder/File")
                }

            })
        userSharedFile()
            .then(res => {
                if (res.status === 400) {
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: res.message
                    })
                } else if (res.status === 200) {
                    setShared(res.result)
                }

            })
    }, [location])

    // File Upload
    const [file, selectFile] = useFileUpload();
    const fileUpload = () => {
        const id = new URLSearchParams(location.search).get('folder');
        selectFile({}, ({source, name, size, file}) => {
            uploadFile(file, name, size, id)
                .then(res => {
                    let data
                    if (res.status === 400) {
                        data = res.message
                    } else if (res.status === 200) {
                        data = res.message
                        setFiles(prevState => [...prevState, res.result])
                    }
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: data
                    })
                })

        });
    };


    const shareFileHandle = () => {
        shareFileClose()
        shareUserFile({...shareFileData})
            .then(res => {
                let data
                if (res.status === 400) {
                    data = res.message
                } else if (res.status === 200) {
                    data = res.message
                }
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: data
                })
            })
    }

    // context menu
    const copyCoupon = (e, data) => {
        var coupon = data.copy;
        navigator.clipboard.writeText(coupon);
        alert(`Coupon code ${coupon} copied to your clipboard`);
    };

    const createFolder = () => {
        handleClose()
        const name = document.getElementById("new_folder").value
        const id = new URLSearchParams(location.search).get('folder');

        createNewFolder({name: name, sub_folder: id})
            .then(res => {
                let data;
                if (res.status === 400) {
                    data = res.message
                } else if (res.status === 200) {
                    data = res.message
                    setFolders(prevState => [...prevState, res.result])
                }
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: data
                })
            })
    }

    const renameFolder = () => {
        renameHandleClose()
        //let new_user = users.map(u => u.pk === user.pk ? user : u)
        updateFolder(editFolderData)
            .then(res => {
                let data;
                if (res.status === 400) {
                    data = res.message
                } else if (res.status === 200) {
                    data = res.message
                    let new_folders = folders.map(f => f.pk === res.result.pk ? res.result : f)
                    setFolders(new_folders)
                }
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: data
                })
            })
    }

    const deleteContent = () => {
        deleteUserContent({...deleteData})
            .then(res => {
                let data;
                if (res.status === 400) {
                    data = res.message
                } else if (res.status === 200) {
                    data = res.message
                    if (deleteData.fType === "folder") {
                        let test = folders.filter(f => f.id !== deleteData.id)
                        setFolders(test)
                    } else {
                        let test = files.filter(f => f.id !== deleteData.id)
                        setFiles(test)
                    }
                }
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: data
                })
            })
    }

    return (
        <>
            <section className="upload-section">
                <div>

                    <div className="upload-div">

                        <label className="dropdown">
                            <div className="dd-button">
                                <i className="fas fa-plus"></i> New
                            </div>

                            <input type="checkbox" className="dd-input" id="test"/>

                            <ul className="dd-menu">
                                <li onClick={handleShow}>
                                    <i className="fas fa-folder-plus"></i> Folder Create
                                </li>
                                <li onClick={fileUpload}>
                                    <i className="fas fa-file-upload"></i> File Upload
                                </li>
                            </ul>
                        </label>


                        <div>
                            <Button variant="secondary" onClick={() => {
                                authDispatch({
                                    type: "LOG_OUT"
                                })
                                history('/login')
                            }}>Logout</Button>
                        </div>
                    </div>

                    <div className="upload-folder">

                        { location.search && <div style={{display: "flex", alignItem: "center", paddingLeft: "1rem"}}>
                            <i style={{paddingTop: ".8rem"}} className="fas fa-arrow-circle-left"></i>
                            <h6 style={{marginLeft: ".5rem", cursor: "pointer", marginTop:".7rem"}}
                                onClick={() => history(-1)}>Back</h6>
                        </div>}

                        <h4 style={{margin: "10px 20px"}}>{folderName}</h4>
                        <div className="upload-folder-btn">
                            {folders.map(folder =>
                                <ContextMenuTrigger id="contextmenu" collect={() => {
                                    setEditFolderData({...editFolderData, id: folder.id})
                                    setFileDetails(folder)
                                    setDeleteData({id: folder.id, fType: "folder"})
                                }}>
                                    <button onClick={() => history(`/file?folder=${folder.id}`)}>
                                        <i className="fas fa-folder"></i> {folder.name}
                                    </button>
                                </ContextMenuTrigger>
                            )}

                        </div>
                    </div>

                    <div className="upload-folder">
                        <h5 className="upload-text">Files</h5>

                        <div className="upload-folder-btn">
                            {files.map(file =>
                                <ContextMenuTrigger id="contextmenu" collect={() => {
                                    setShareFileData({...shareFileData, id: file.id})
                                    setFileDetails(file)
                                    setDeleteData({id: file.id, fType: "file"})
                                }}>

                                    <a href={`/show/${file.id}`} target="_blank" rel="noopener noreferrer">
                                        <button>
                                        <i className="fas fa-file-alt"></i>{" "}

                                        <div className="content-name" >
                                            {/*<img src={file.content} alt="preview"/>*/}
                                            {/*<span> {file.path.split('/').at(-1)} </span>*/}
                                            <span className="content-name"> {file.name} </span>
                                            {/*<span> {file.size} </span>*/}
                                        </div></button>
                                    </a>

                                </ContextMenuTrigger>)}

                        </div>

                    </div>

                    {shared.length ? <div className="upload-folder">
                        <h5 className="upload-text">Shared with me</h5>

                        <div className="upload-folder-btn">
                            {shared.map(file =>
                                <ContextMenuTrigger id="contextmenu" collect={() => {
                                    setShareFileData({...shareFileData, id: ""})
                                    setFileDetails(file)
                                    setDeleteData({id: file.id, fType: "file"})
                                }}>

                                    <button>
                                        <i className="fas fa-file-alt"></i>{" "}

                                        <div onClick={() =>
                                            setShowFile(true)
                                        }>
                                            {/*<img src={file.content} alt="preview"/>*/}
                                            {/*<span> {file.path.split('/').at(-1)} </span>*/}
                                            <span> {file.name} </span>
                                            {/*<span> {file.size} </span>*/}
                                        </div>
                                    </button>

                                </ContextMenuTrigger>)}

                        </div>

                    </div> : null}

                </div>
            </section>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Folder</Modal.Title>
                </Modal.Header>
                <input className="folder-input" type="text" id="new_folder" name="new_folder"/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={createFolder}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>

            <ContextMenu id="contextmenu" className="right-btn">
                <MenuItem onClick={renameHandleShow} className="right-btn-sub">
                    <i className="fas fa-file-signature"></i>
                    <span>Rename</span>
                </MenuItem>
                {shareFileData.id && <MenuItem className="right-btn-sub" onClick={shareFileClose}>
                    <i className="fas fa-share-square"></i>
                    <span>Share</span>
                </MenuItem>}
                <MenuItem className="right-btn-sub" onClick={detailsHandleShow}>
                    <i className="fas fa-feather-alt"></i>
                    <span>Details</span>
                </MenuItem>
                <MenuItem className="right-btn-sub" onClick={deleteContent}>
                    <i className="fas fa-trash-alt"></i>
                    <span>Delete</span>
                </MenuItem>
            </ContextMenu>


            <Modal show={false} onHide={handleFile}>
                <Modal.Header closeButton>
                    <Modal.Title>Rename</Modal.Title>
                </Modal.Header>
                <details open>
                    <summary>.pdf</summary>
                    <FileViewer fileType="pdf"
                                filePath={"http://127.0.0.1:8000/media/IMAGE-BASED-DOCTORS-PRESCRIPTION-RECOGNITION-USING-l.pdf"}
                                onError={onError}/>
                </details>
                <Modal.Footer>
                    <Button variant="secondary" onClick={renameHandleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={renameFolder}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={detailsShow} onHide={detailsHandleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                {fileDetails && <ListGroup as="ol" numbered>
                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">File Name</div>
                        </div>
                        <Badge variant="primary" pill>
                            {fileDetails.name}
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">File Size</div>
                        </div>
                        <Badge variant="primary" pill>
                            {fileDetails.size}
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Creating Date</div>
                        </div>
                        <Badge variant="primary" pill>
                            {new Date(fileDetails.created_at).toString()}
                        </Badge>
                    </ListGroup.Item>
                </ListGroup>}
                <Modal.Footer>
                    <Button variant="secondary" onClick={detailsHandleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={shareFile} onHide={shareFileClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Share new</Modal.Title>
                </Modal.Header>
                <input className="folder-input" type="email" id="share" name="share" onChange={(e) =>
                    setShareFileData({...shareFileData, email: e.target.value})
                }/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={shareFileClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={shareFileHandle}>
                        Share
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={renameShow} onHide={renameHandleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Rename</Modal.Title>
                </Modal.Header>
                <input className="folder-input" type="text" id="rename" name="rename" onChange={
                    (e) => setEditFolderData({...editFolderData, name: e.target.value})
                }/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={renameHandleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={renameFolder}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UploadFile;
