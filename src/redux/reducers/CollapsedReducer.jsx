export const CollApsedReducer = (prevState={
    isCollapsed:false
},action) => {
    // console.log(action);
    let {type}=action;
    switch (type) {
        case "change_collapsed":
            let newsstate={...prevState};
            newsstate.isCollapsed=!newsstate.isCollapsed;
            return newsstate;
        default:
            return prevState;
    }
}
