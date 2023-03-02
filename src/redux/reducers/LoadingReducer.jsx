export const LoadingReducer = (prevState={
    isLoading:false
},action) => {
    // console.log(action);
    let {type,payload}=action;
    switch (type) {
        case "change_loading":
            let newsstate={...prevState};
            newsstate.isLoading=payload;
            return newsstate;
        default:
            return prevState;
    }
}
