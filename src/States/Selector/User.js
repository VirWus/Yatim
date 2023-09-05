import {selector} from "recoil";

const UserState = selector({
    key: "User",

    get: ({get}) => {
        const user = get(UserState);
        return user;
    }
});
export default UserState;   