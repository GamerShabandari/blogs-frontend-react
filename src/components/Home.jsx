import axios from "axios";
import { useState } from "react"

export function Home() {

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

    const [myUserId, setMyUserId] = useState(""); /////// OBS!  ändra den här till localstorage senare //////////


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
                    fetchUsersBlogs(response.data.userID)
                    setYourName(username.charAt(0).toUpperCase() + username.slice(1))
                    setMyUserId(response.data.userID) /////// DET HÄR KAN DU TA BORT SEN OCH FIXA MED LOCALSTORAGE ////////////////////////////////////////////////////////////////
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
            console.log(newBlog);
            axios.post("http://localhost:4000/blogs", newBlog, { headers: { "content-type": "application/json" } })
                .then(response => {
                    console.log(response.data);
                    setNewBlogTitle("");
                    setNewBlogText("");
                })
                .catch(error => {
                    console.log(error);
                    alert("något gick snett i kommunikationen med servern")
                })
        }
    }

    function deleteBlog(blogId){

        axios.delete("http://localhost:4000/blogs/" + blogId)
            .then(response => {
                console.log(response.data);
            })
    }

    let usersBlogsListHtml = usersBlogs.map((blog, i) => {
        return (<div className="blogCard" key={i}>
            <h3>{blog.title}</h3>
            <div>{blog.text}</div>
            <h6>{blog.created}</h6>
            <button onClick={()=>{deleteBlog(blog.id)}}>X</button>
            <button>edit</button>
        </div>)
    })

    return (<>
        <header>
            <h1>BLOGGUS MAXIMUS</h1>
            {loggedIn && <h2>Välkommen {yourName}</h2> }
        </header>
        <main>
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
            </div>
            } {showError && <div>Fel uppgifter! försök igen</div>}

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