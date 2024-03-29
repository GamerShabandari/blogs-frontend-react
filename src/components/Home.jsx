import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "animate.css";
import { MdLogin, MdLogout, MdNoteAdd, MdAdd, MdEditNote, MdDeleteForever, MdCancel, MdOutlineDateRange } from "react-icons/md";
import { RiUserAddLine, RiUserFollowLine } from "react-icons/ri";
import { Player, Controls } from '@lottiefiles/react-lottie-player';


export function Home() {

    const [allUsers, setAllUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [yourName, setYourName] = useState("User");
    const [subscribed, setSubscribed] = useState(false)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [createdUsername, setCreatedUsername] = useState("");
    const [createdPassword, setCreatedPassword] = useState("");
    const [createdEmail, setCreatedEmail] = useState("");
    const [subscriptionChoice, setSubscriptionChoice] = useState(false)
    const [createUserError, setCreateUserError] = useState(false)
    const [showCreatedUserMessage, setShowCreatedUserMessage] = useState(false)
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

    // if logged in get all your blogs if not logged in get all the registered users
    useEffect(() => {

        if (myUserId.length > 0) {

            fetchUsersBlogs(myUserId)
        }

        if (myUserId === "") {
            setLoadingUsers(true)
            fetchAllUsers();
        }

    }, [blogsUpdated, myUserId])

    // check localstorage if allready logged in or not
    useEffect(() => {
        let myUserIdSerialized = localStorage.getItem("myUserId");

        if (myUserIdSerialized) {
            let myUserIdDeSerialized = JSON.parse(localStorage.getItem("myUserId"));
            let mySubscribtionStatusDeSerialized = JSON.parse(localStorage.getItem("subscribtionStatus"));
            setSubscribed(mySubscribtionStatusDeSerialized);
            setLoggedIn(true);
            fetchUsersBlogs(myUserIdDeSerialized);
            setMyUserId(myUserIdDeSerialized);

            let myNameDeSerialized = JSON.parse(localStorage.getItem("yourName"));
            setYourName(myNameDeSerialized)
        }
    }, [])


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    // handle input state for login
    function handleNameInput(e) {
        setUsername(e.target.value)
    }
    // handle input state for login
    function handlePasswordInput(e) {
        setPassword(e.target.value)
    }
    // login user, if success change all relevant state-variables and save userid to localstorage, else show error 
    function login() {
        let usersLogin = {
            name: username,
            password: password
        }
        axios.post("https://express-blogosphere-backend.herokuapp.com/login", usersLogin, { headers: { "content-type": "application/json" } })
            // axios.post("http://localhost:4000/login", usersLogin, { headers: { "content-type": "application/json" } })
            .then(response => {

                if (response.data.loggedIn === true) {
                    setLoggedIn(true);
                    setShowError(false);
                    setUsername("");
                    setPassword("");
                    fetchUsersBlogs(response.data.userID)
                    setYourName(username.charAt(0).toUpperCase() + username.slice(1))
                    localStorage.setItem("myUserId", JSON.stringify(response.data.userID));
                    localStorage.setItem("subscribtionStatus", JSON.stringify(response.data.subscribed));
                    localStorage.setItem("yourName", JSON.stringify(username.charAt(0).toUpperCase() + username.slice(1)));
                    setMyUserId(response.data.userID);
                    setSubscribed(response.data.subscribed);
                } else if (response.data.loggedIn === false) {
                    setShowError(true);
                }
            })
            .catch(error => {
                console.log(error);
                alert("något gick snett i kommunikationen med servern")
            })
    }

    // get all blogs for logged in user
    function fetchUsersBlogs(userID) {

        axios.get("https://express-blogosphere-backend.herokuapp.com/blogs/" + userID)
            .then(response => {
                setUsersBlogs([...response.data])
            })

        // axios.get("http://localhost:4000/blogs/" + userID)
        //     .then(response => {
        //         setUsersBlogs([...response.data])
        //     })
    }

    // get all users to display in landingpage when not logged in
    function fetchAllUsers() {

        axios.get("https://express-blogosphere-backend.herokuapp.com/allusers/")
            .then(response => {
                setAllUsers([...response.data])
                setLoadingUsers(false)
            })

        // axios.get("http://localhost:4000/allusers/")
        //     .then(response => {
        //         setAllUsers([...response.data])
        //     })
    }
    // update username state-variable when creating a new user
    function handleCreatedNameInput(e) {
        setCreatedUsername(e.target.value)
    }
    // update password state-variable when creating a new user
    function handleCreatedPasswordInput(e) {
        setCreatedPassword(e.target.value)
    }
    // update email state-variable when creating a new user
    function handleCreatedEmailInput(e) {
        setCreatedEmail(e.target.value)
    }
    // update subscription choice state-variable when creating a new user
    function handleSubscription(e) {
        setSubscriptionChoice(e.target.checked);
    }
    // create a new user - if password and username are atleast 6 charachters and a valid email has been given. if success update all relevant state-variables and give user feedback
    function createUser() {
        if (createdUsername.length > 5 && createdPassword.length > 5 && /\S+@\S+\.\S+/.test(createdEmail)) {
            setCreateUserError(false);
            let newCreatedUser = {
                name: createdUsername,
                password: createdPassword,
                email: createdEmail,
                subscribed: subscriptionChoice
            }
            axios.post("https://express-blogosphere-backend.herokuapp.com/adduser", newCreatedUser, { headers: { "content-type": "application/json" } })
                // axios.post("http://localhost:4000/adduser", newCreatedUser, { headers: { "content-type": "application/json" } })
                .then(response => {
                    console.log(response.data);
                    fetchAllUsers()
                    setCreatedUsername("");
                    setCreatedPassword("");
                    setCreatedEmail("");
                    setToggleCreateAccount(false)
                    setShowCreatedUserMessage(true);

                    setTimeout(() => {
                        setShowCreatedUserMessage(false)
                    }, 2000)
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
    // handle tite state-variable when creating new blogpost
    function handleNewBlogTitle(e) {
        setNewBlogTitle(e.target.value)
    }
    // handle text state-variable when creating new blogpost
    function handleNewBlogText(e) {
        setNewBlogText(e.target.value)
    }
    // save new blogpost if both text and title input have a value
    function saveNewBlog() {

        if (newBlogTitle.length > 0 && newBlogText.length > 0) {
            let newBlog = {
                title: newBlogTitle,
                text: newBlogText,
                author: myUserId
            }
            axios.post("https://express-blogosphere-backend.herokuapp.com/blogs", newBlog, { headers: { "content-type": "application/json" } })
                // axios.post("http://localhost:4000/blogs", newBlog, { headers: { "content-type": "application/json" } })
                .then(response => {
                    console.log(response.data);
                    setNewBlogTitle("");
                    setNewBlogText("");

                    setBlogsUpdated(true);
                    setTimeout(() => {
                        setBlogsUpdated(false)
                    }, 2000)
                })
                .catch(error => {
                    console.log(error);
                    alert("något gick snett i kommunikationen med servern")
                })
        }
    }
    // delete chosen blogpost
    function deleteBlog(blogId) {

        axios.delete("https://express-blogosphere-backend.herokuapp.com/blogs/" + blogId)
            // axios.delete("http://localhost:4000/blogs/" + blogId)
            .then(response => {
                console.log(response.data);
                setBlogsUpdated(true);
                setTimeout(() => {
                    setBlogsUpdated(false)
                }, 2000)
            })
    }
    // keep track and update all inputs to use for updating blogpost 
    function editBlog(index) {
        setShowEditBookingForm(true);

        setEditBlogTitle(usersBlogs[index].title)
        setEditBlogText(usersBlogs[index].text)
        setEditBlogID(usersBlogs[index].id)
    }
    // handle edited blogpost title
    function handleEditBlogTitle(e) {
        setEditBlogTitle(e.target.value)
    }
    // handle edited blogpost text
    function handleEditBlogText(e) {
        setEditBlogText(e.target.value)
    }
    // save/post edited blogpost to server and give user feedback
    function saveEditedBlog() {
        let editedBlog = {
            id: editBlogID,
            title: editBlogTitle,
            text: editBlogText,
            author: myUserId
        }

        axios.put("https://express-blogosphere-backend.herokuapp.com/blogs/update", editedBlog, { headers: { "content-type": "application/json" } })
            // axios.put("http://localhost:4000/blogs/update", editedBlog, { headers: { "content-type": "application/json" } })
            .then(response => {
                console.log(response.data);
                setShowEditBookingForm(false);
                setEditBlogTitle("")
                setEditBlogText("")

                setBlogsUpdated(true);
                setTimeout(() => {
                    setBlogsUpdated(false)
                }, 2000)
            })
            .catch(error => {
                console.log(error);
                alert("något gick snett i kommunikationen med servern")
            })

    }
    // let user change subscription status 
    function changeSubscriptionStatus() {

        axios.post("https://express-blogosphere-backend.herokuapp.com/subscribe", { id: myUserId }, { headers: { "content-type": "application/json" } })
            // axios.post("http://localhost:4000/subscribe", { id: myUserId }, { headers: { "content-type": "application/json" } })
            .then(response => {
                console.log(response.data);
                localStorage.setItem("subscribtionStatus", JSON.stringify(!subscribed));
                setSubscribed(!subscribed);
            })
            .catch(error => {
                console.log(error);
                alert("något gick snett i kommunikationen med servern")
            })
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    // JSX list of logged in users all blogpost 
    let usersBlogsListHtml = usersBlogs.map((blog, i) => {
        return (<motion.div className="blogCard" key={i}
            initial={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ ease: "easeInOut", duration: 0.2, delay: i * 0.4 }}
        >
            <h3>{blog.title}</h3>
            <p>{blog.text}</p>
            <h6><MdOutlineDateRange></MdOutlineDateRange> {blog.created}</h6>
            <div className="cardButtons">
                <MdEditNote className="editBtn" onClick={() => { editBlog(i) }}></MdEditNote>
                <MdDeleteForever className="deleteBtn" onClick={() => { deleteBlog(blog.id) }}></MdDeleteForever>
            </div>
        </motion.div>)
    })
    // JSX list of a chosen users all blogpost when guest is browsing at landingpage
    let usersBlogsListForGuestsHtml = usersBlogs.map((blog, i) => {
        return (<motion.div className="blogCard"
            key={i}
            initial={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3, delay: i * 0.3 }}
        >
            <h3>{blog.title}</h3>
            <p>{blog.text}</p>
            <h6><MdOutlineDateRange></MdOutlineDateRange> {blog.created}</h6>
        </motion.div>)
    })
    // JSX list of all registered users on site
    let allUsersList = allUsers.map((user, i) => {
        return (<div className="userContainer" key={i}>

            <div onClick={() => { fetchUsersBlogs(user.id) }}>
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </div>

        </div>)
    })


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    return (<>

        <header> {/* header with logo and animated globe */}
            <h1 className="logo animate__animated animate__flipInX">
                Bl
                <Player className="globe animate__animated animate__bounceIn animate__delay-1s"
                    autoplay
                    loop
                    src="https://assets1.lottiefiles.com/private_files/lf30_fngabhfr.json"
                >
                    <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
                </Player>
                gosphere
            </h1>


            {/* if logged in show this welcome section  */}
            {loggedIn && <><h4 className="welcome  animate__animated animate__bounce">Welcome {yourName}</h4><MdLogout className="logoutBtn animate__animated animate__flipInX" onClick={() => { setLoggedIn(false); setUsersBlogs([]); localStorage.removeItem("myUserId"); localStorage.removeItem("yourName") }}></MdLogout>
                <Player className="animate__animated animate__bounceIn animate__delay-1s"
                    autoplay
                    keepLastFrame
                    src="https://assets8.lottiefiles.com/packages/lf20_qf1pt6ua.json"
                    style={{ height: '50px', width: '50px' }}
                >
                    <Controls visible={false} />
                </Player>

                {subscribed && <>
                    <div className="subInfo animate__animated animate__fadeIn">
                        <h5>Thank you for subscribing to our newsletter.</h5>
                        <button className="Btn" onClick={changeSubscriptionStatus}>unsubscribe</button>
                    </div>

                </>}
                {!subscribed && <>
                    <div className="subInfo animate__animated animate__fadeIn">
                        <h5>Would you like to subscribe to our newsletter?</h5>
                        <button className="Btn" onClick={changeSubscriptionStatus}>subscribe</button>

                    </div>
                </>}

            </>}
        </header>
        <main>

            {/* form for editing blogpost  */}
            {showEditBookingForm && <div className="editFormContainer animate__animated animate__flipInX">
                <input type="text" placeholder="title" value={editBlogTitle} onChange={handleEditBlogTitle} />
                <textarea cols="30" rows="40" placeholder="text" value={editBlogText} onChange={handleEditBlogText}></textarea>
                <div className="buttonsContainer">
                    <MdCancel className="deleteBtn animate__animated animate__flipInX  animate__delay-1s" onClick={() => { setShowEditBookingForm(false); setEditBlogTitle(""); setEditBlogText("") }}></MdCancel>
                    <MdAdd className="editBtn animate__animated animate__flipInX  animate__delay-1s" onClick={saveEditedBlog}></MdAdd>
                </div>
            </div>}


            {/* if not logged in show this section containing create-user form and login-form */}
            {!loggedIn && <div className="homeFormsContainer">
                <RiUserAddLine className="Btn" onClick={() => { setToggleCreateAccount(!toggleCreateAccount) }}></RiUserAddLine>
                {showCreatedUserMessage && <h5 className="createdUser animate__animated animate__flipInX">new account created</h5>}

                {/* create-user form  */}
                {toggleCreateAccount &&
                    <>
                        <form className="createAccountForm  animate__animated animate__flipInX">
                            <div className="checkboxContainer">
                                <input type="checkbox" id="subscriptionCheckbox" onChange={handleSubscription} />
                                <label htmlFor="subscriptionCheckbox"> subscribe to newsletter</label>
                            </div>
                            <input type="text" placeholder="username (atleast 6 characters)" value={createdUsername} onChange={handleCreatedNameInput} />
                            <input type="password" placeholder="password (atleast 6 characters)" value={createdPassword} onChange={handleCreatedPasswordInput} />
                            <input type="text" placeholder="email" value={createdEmail} onChange={handleCreatedEmailInput} />
                            <RiUserFollowLine className="Btn" onClick={createUser}></RiUserFollowLine>
                            {createUserError && <div className="error animate__animated animate__bounceIn">username and password atleast 6 characters and valid email</div>}
                        </form>
                    </>
                }

                {/* login form  */}
                <form className="loginForm">
                    <legend>Login</legend>
                    <input type="text" placeholder="username" value={username} onChange={handleNameInput} />
                    <input type="password" placeholder="password" value={password} onChange={handlePasswordInput} />
                    <MdLogin className="Btn" onClick={login}></MdLogin>
                </form>
                {showError && <div className="error animate__animated animate__bounceIn">Incorrect login, try again.</div>}

                {/* loading animation and section with all bloggers on site  */}
                <main>
                    <aside>
                        {loadingUsers &&
                            <Player className="loading animate__animated animate__bounceIn"
                                autoplay
                                loop
                                src="https://assets4.lottiefiles.com/temp/lf20_XyXrJ3.json"
                                style={{ height: '200px', width: '200px' }}
                            >
                                <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
                            </Player>
                        }
                        {!loadingUsers && <>
                            <h4 className="bloggersTitle">Our bloggers</h4>
                            <div className="usersListContainer">
                                {allUsersList}</div>
                            <div className="GuestsBlogPostContainer">{usersBlogsListForGuestsHtml}</div>
                        </>}
                    </aside>
                </main>
            </div>

            }

            {/* if not logged in show this create new blog section and display all users blogpost   */}
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

        {/* footer with link to admin login  */}
        <footer>
            <a href="https://express-blogosphere-backend.herokuapp.com/login">Admin login</a>
        </footer>
    </>)
}