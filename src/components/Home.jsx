import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "animate.css";
import { MdLogin, MdLogout, MdNoteAdd, MdAdd, MdEditNote, MdDeleteForever, MdCancel } from "react-icons/md";
import { RiUserAddLine, RiUserFollowLine } from "react-icons/ri";
import { GrUpdate, GrGlobe } from "react-icons/gr"


export function Home() {

    const [allUsers, setAllUsers] = useState([]);
    const [yourName, setYourName] = useState("User");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [createdUsername, setCreatedUsername] = useState("");
    const [createdPassword, setCreatedPassword] = useState("");
    const [createUserError, setCreateUserError] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false);
    const [showError, setShowError] = useState(false);
    const [usersBlogs, setUsersBlogs] = useState([]);
    const [newBlogTitle, setNewBlogTitle] = useState("");
    const [newBlogText, setNewBlogText] = useState("");
    const [editBlogTitle, setEditBlogTitle] = useState("");
    const [editBlogText, setEditBlogText] = useState("");
    const [editBlogID, setEditBlogID] = useState("");
    const [blogsUpdated, setBlogsUpdated] = useState(false);
    const [showEditBookingForm, setShowEditBookingForm] = useState(false);
    const [myUserId, setMyUserId] = useState("");
    const [toggleCreateBlog, setToggleCreateBlog] = useState(false);
    const [toggleCreateAccount, setToggleCreateAccount] = useState(false);


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {

        if (myUserId.length > 0) {

            fetchUsersBlogs(myUserId)
        }

        if (myUserId === "") {
            fetchAllUsers();
        }

    }, [blogsUpdated, myUserId])

    useEffect(() => {
        let myUserIdSerialized = localStorage.getItem("myUserId");

        if (myUserIdSerialized) {
            let myUserIdDeSerialized = JSON.parse(localStorage.getItem("myUserId"));
            setLoggedIn(true);
            fetchUsersBlogs(myUserIdDeSerialized)
            setMyUserId(myUserIdDeSerialized);

            let myNameDeSerialized = JSON.parse(localStorage.getItem("yourName"));
            setYourName(myNameDeSerialized)
        }
    }, [])


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////


    function handleNameInput(e) {
        setUsername(e.target.value)
    }

    function handlePasswordInput(e) {
        setPassword(e.target.value)
    }

    function login() {
        let usersLogin = {
            name: username,
            password: password
        }
        axios.post("http://localhost:4000/login", usersLogin, { headers: { "content-type": "application/json" } })
            .then(response => {

                if (response.data.loggedIn === true) {
                    setLoggedIn(true);
                    setShowError(false);
                    setUsername("");
                    setPassword("");
                    fetchUsersBlogs(response.data.userID)
                    setYourName(username.charAt(0).toUpperCase() + username.slice(1))
                    localStorage.setItem("myUserId", JSON.stringify(response.data.userID));
                    localStorage.setItem("yourName", JSON.stringify(username.charAt(0).toUpperCase() + username.slice(1)));
                    setMyUserId(response.data.userID)
                } else if (response.data.loggedIn === false) {
                    setShowError(true);
                }
            })
            .catch(error => {
                console.log(error);
                alert("något gick snett i kommunikationen med servern")
            })
    }

    function fetchUsersBlogs(userID) {

        axios.get("http://localhost:4000/blogs/" + userID)
            .then(response => {
                setUsersBlogs([...response.data])
            })
    }

    function fetchAllUsers() {

        axios.get("http://localhost:4000/allusers/")
            .then(response => {
                setAllUsers([...response.data])
            })
    }

    function handleCreatedNameInput(e) {
        setCreatedUsername(e.target.value)
    }

    function handleCreatedPasswordInput(e) {
        setCreatedPassword(e.target.value)
    }

    function createUser() {
        if (createdUsername.length > 5 && createdPassword.length > 5) {
            setCreateUserError(false);
            let newCreatedUser = {
                name: createdUsername,
                password: createdPassword
            }
            axios.post("http://localhost:4000/adduser", newCreatedUser, { headers: { "content-type": "application/json" } })
                .then(response => {
                    console.log(response.data);
                    fetchAllUsers()
                    setCreatedUsername("");
                    setCreatedPassword("");
                })
                .catch(error => {
                    console.log(error);
                    alert("något gick snett i kommunikationen med servern")
                })
        }
        else {
            setCreateUserError(true);
        }

    }

    function handleNewBlogTitle(e) {
        setNewBlogTitle(e.target.value)
    }

    function handleNewBlogText(e) {
        setNewBlogText(e.target.value)
    }

    function saveNewBlog() {

        if (newBlogTitle.length > 0 && newBlogText.length > 0) {
            let newBlog = {
                title: newBlogTitle,
                text: newBlogText,
                author: myUserId
            }
            axios.post("http://localhost:4000/blogs", newBlog, { headers: { "content-type": "application/json" } })
                .then(response => {
                    console.log(response.data);
                    setNewBlogTitle("");
                    setNewBlogText("");

                    setBlogsUpdated(true);
                    setTimeout(() => {
                        setBlogsUpdated(false)
                    }, 1000)
                })
                .catch(error => {
                    console.log(error);
                    alert("något gick snett i kommunikationen med servern")
                })
        }
    }

    function deleteBlog(blogId) {

        axios.delete("http://localhost:4000/blogs/" + blogId)
            .then(response => {
                console.log(response.data);
                setBlogsUpdated(true);
                setTimeout(() => {
                    setBlogsUpdated(false)
                }, 1000)
            })
    }

    function editBlog(index) {
        setShowEditBookingForm(true);

        setEditBlogTitle(usersBlogs[index].title)
        setEditBlogText(usersBlogs[index].text)
        setEditBlogID(usersBlogs[index].id)
    }

    function handleEditBlogTitle(e) {
        setEditBlogTitle(e.target.value)
    }

    function handleEditBlogText(e) {
        setEditBlogText(e.target.value)
    }

    function saveEditedBlog() {
        let editedBlog = {
            id: editBlogID,
            title: editBlogTitle,
            text: editBlogText,
            author: myUserId
        }

        axios.put("http://localhost:4000/blogs/update", editedBlog, { headers: { "content-type": "application/json" } })
            .then(response => {
                console.log(response.data);
                setShowEditBookingForm(false);
                setEditBlogTitle("")
                setEditBlogText("")

                setBlogsUpdated(true);
                setTimeout(() => {
                    setBlogsUpdated(false)
                }, 1000)
            })
            .catch(error => {
                console.log(error);
                alert("något gick snett i kommunikationen med servern")
            })

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    let usersBlogsListHtml = usersBlogs.map((blog, i) => {
        return (<motion.div className="blogCard" key={i}
            initial={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ ease: "easeInOut", duration: 0.2, delay: i * 0.4 }}
        >
            <h3>{blog.title}</h3>
            <div>{blog.text}</div>
            <h6>{blog.created}</h6>
            <div className="cardButtons">
                <MdEditNote className="editBtn" onClick={() => { editBlog(i) }}></MdEditNote>
                <MdDeleteForever className="deleteBtn" onClick={() => { deleteBlog(blog.id) }}></MdDeleteForever>
            </div>
        </motion.div>)
    })

    let usersBlogsListForGuestsHtml = usersBlogs.map((blog, i) => {
        return (<motion.div className="blogCard"
            key={i}
            initial={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3, delay: i * 0.3 }}
        >
            <h3>{blog.title}</h3>
            <div>{blog.text}</div>
            <h6>{blog.created}</h6>
        </motion.div>)
    })

    let allUsersList = allUsers.map((user, i) => {
        return (<motion.div className="userContainer" key={i} initial={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ ease: "easeInOut", duration: 0.4, delay: i * 0.4 }}>

            <motion.div onClick={() => { fetchUsersBlogs(user.id) }}>
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </motion.div>

        </motion.div>)
    })


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    return (<>
        <header>
            <h1 className="logo animate__animated animate__flipInX">Bl<GrGlobe className="globe"></GrGlobe>gosphere</h1>
            {loggedIn && <><h4 className="welcome  animate__animated animate__bounce">Welcome {yourName}</h4><MdLogout className="logoutBtn animate__animated animate__flipInX" onClick={() => { setLoggedIn(false); setUsersBlogs([]); localStorage.removeItem("myUserId"); localStorage.removeItem("yourName") }}></MdLogout></>}
        </header>
        <main>
            {blogsUpdated && <GrUpdate className="loading"></GrUpdate>}

            {showEditBookingForm && <div className="editFormContainer animate__animated animate__flipInX">
                <input type="text" placeholder="title" value={editBlogTitle} onChange={handleEditBlogTitle} />
                <textarea cols="30" rows="40" placeholder="text" value={editBlogText} onChange={handleEditBlogText}></textarea>
                <div className="buttonsContainer">
                    <MdCancel className="deleteBtn animate__animated animate__flipInX  animate__delay-1s" onClick={() => { setShowEditBookingForm(false); setEditBlogTitle(""); setEditBlogText("") }}></MdCancel>
                    <MdAdd className="editBtn animate__animated animate__flipInX  animate__delay-1s" onClick={saveEditedBlog}></MdAdd>
                </div>
            </div>}

            {!loggedIn && <div className="homeFormsContainer">
                <RiUserAddLine className="Btn" onClick={() => { setToggleCreateAccount(!toggleCreateAccount) }}></RiUserAddLine>
                {toggleCreateAccount && <form className="createAccountForm  animate__animated animate__flipInX">
                    <input type="text" placeholder="username (atleast 6 characters)" value={createdUsername} onChange={handleCreatedNameInput} />
                    <input type="password" placeholder="password (atleast 6 characters)" value={createdPassword} onChange={handleCreatedPasswordInput} />
                    <RiUserFollowLine className="Btn" onClick={createUser}></RiUserFollowLine>
                    {createUserError && <div className="error animate__animated animate__bounceIn">username and password must be atleast 6 characters</div>}
                </form>}


                <form className="loginForm">
                    <legend>Login</legend>
                    <input type="text" placeholder="username" value={username} onChange={handleNameInput} />
                    <input type="password" placeholder="password" value={password} onChange={handlePasswordInput} />
                    <MdLogin className="Btn" onClick={login}></MdLogin>
                </form>
                {showError && <div className="error animate__animated animate__bounceIn">Incorrect login, try again.</div>}

                <main>
                    <aside>

                        <h4 className="bloggersTitle">Our bloggers</h4>
                        <div className="usersListContainer">
                            {allUsersList}</div>
                        <div className="GuestsBlogPostContainer">{usersBlogsListForGuestsHtml}</div>
                    </aside>
                </main>
            </div>

            }

            {loggedIn && <main>
                <div className="createBlogContainer">
                    <h3 className="createPost" onClick={() => { setToggleCreateBlog(!toggleCreateBlog) }}>Create New Post <MdNoteAdd></MdNoteAdd> </h3>
                    {toggleCreateBlog && <form className="createBlogForm animate__animated animate__flipInX">
                        <input type="text" placeholder="title" value={newBlogTitle} onChange={handleNewBlogTitle} />
                        <textarea cols="30" rows="20" value={newBlogText} onChange={handleNewBlogText}></textarea>
                        <MdAdd className="Btn animate__animated animate__flipInX  animate__delay-1s" type="button" onClick={saveNewBlog}>save</MdAdd>
                    </form>}
                </div>
                <div className="blogPostContainer">
                    {usersBlogsListHtml}
                </div>
            </main>
            }
        </main>
    </>)
}