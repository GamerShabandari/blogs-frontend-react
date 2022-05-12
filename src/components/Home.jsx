import axios from "axios";
import { useEffect, useState } from "react"

export function Home() {

    const [allUsers, setAllUsers] = useState([]);
    const [yourName, setYourName] = useState("User");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [createdUsername, setCreatedUsername] = useState("");
    const [createdPassword, setCreatedPassword] = useState("");
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
        return (<div className="blogCard" key={i}>
            <h3>{blog.title}</h3>
            <div>{blog.text}</div>
            <h6>{blog.created}</h6>
            <button onClick={() => { deleteBlog(blog.id) }}>X</button>
            <button onClick={() => { editBlog(i) }}>edit</button>
        </div>)
    })

    let usersBlogsListForGuestsHtml = usersBlogs.map((blog, i) => {
        return (<div className="blogCard" key={i}>
            <h3>{blog.title}</h3>
            <div>{blog.text}</div>
            <h6>{blog.created}</h6>
        </div>)
    })

    let allUsersList = allUsers.map((user, i) => {
        return (<div className="userContainer" key={i}>

            <div onClick={() => { fetchUsersBlogs(user.id) }}>{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</div>

        </div>)
    })


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    return (<>
        <header>
            <h1>BLOGGUS MAXIMUS</h1>
            {loggedIn && <><h2>Välkommen {yourName}</h2><button onClick={() => { setLoggedIn(false); setUsersBlogs([]); localStorage.removeItem("myUserId"); localStorage.removeItem("yourName") }}>log out</button></>}
        </header>
        <main>
            {blogsUpdated && <div><h1>Bloggar Uppdaterade...</h1></div>}

            {showEditBookingForm && <div className="editFormContainer">
                <input type="text" placeholder="title" value={editBlogTitle} onChange={handleEditBlogTitle} />
                <textarea cols="30" rows="10" placeholder="text" value={editBlogText} onChange={handleEditBlogText}></textarea>
                <button onClick={saveEditedBlog}>save</button>
                <button onClick={() => { setShowEditBookingForm(false); setEditBlogTitle(""); setEditBlogText("") }}>cancel</button>
            </div>}

            {!loggedIn && <div>
                <form>
                    <h4>First time here? Create an account!</h4>
                    <input type="text" placeholder="username (atleast 6 characters)" value={createdUsername} onChange={handleCreatedNameInput} />
                    <input type="password" placeholder="password (atleast 6 characters)" value={createdPassword} onChange={handleCreatedPasswordInput} />
                    <button type="button" onClick={createUser}>create new user</button>
                </form>

                <form>
                    <h4>Allready a member, login below</h4>
                    <input type="text" placeholder="username" value={username} onChange={handleNameInput} />
                    <input type="password" placeholder="password" value={password} onChange={handlePasswordInput} />
                    <button type="button" onClick={login}>login</button>
                </form>
                {showError && <div>Fel uppgifter! försök igen</div>}

                <main>
                    <aside>
                        <div>{allUsersList}</div>
                        <div>{usersBlogsListForGuestsHtml}</div>
                    </aside>
                </main>
            </div>

            }

            {loggedIn && <main>
                <div className="createBlogContainer">
                    <h3>Create New Post</h3>
                    <form className="createBlogForm">
                        <input type="text" placeholder="title" value={newBlogTitle} onChange={handleNewBlogTitle} />
                        <textarea cols="30" rows="10" value={newBlogText} onChange={handleNewBlogText}></textarea>
                        <button type="button" onClick={saveNewBlog}>spara</button>
                    </form>
                </div>
                <div>
                    <h3>Your Posts:</h3>{usersBlogsListHtml}
                </div>
            </main>
            }
        </main>
    </>)
}