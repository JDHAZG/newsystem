export const LoginReducer = (prevState={
    isLogin:false
},action) => {
    // console.log(action);
    let {type}=action;
    switch (type) {
        case "change_login":
            let newsstate={...prevState};
            newsstate.isLogin=!newsstate.isLogin;
            return newsstate;
        default:
            return prevState;
    }
}
