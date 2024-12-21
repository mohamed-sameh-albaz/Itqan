import { useState } from "react";

function useUser() {
    const userInit = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(userInit);
    return user;
}

export default useUser;