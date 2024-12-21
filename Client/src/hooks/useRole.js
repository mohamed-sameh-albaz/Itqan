import { useEffect, useState } from "react";
import { requestAPI, useAPI } from "./useAPI";
import useUser from "./useUser";

function useRole(communityName) {
    const user = useUser()
    const [role, setRole] = useState({});

    async function getRole(){
        const {status, data} = await requestAPI('/roles/user-role', 'get', {params: {userId:user.id, communityName: communityName}})
    
        if(status > 199 && status < 300){
            setRole(data.data.role);
        }else{
            console.log("Error: ", data);
        }
    }

    useEffect(() => {
        getRole()
    }, [communityName, user]);

    return {role, roleId: role?.id ?? 3, roleName: role?.name ?? 'Member', roleColor: role?.color ?? '#a31c9c', canDelete: role?.id == 1, canEdit: role?.id == 1, canCreate: role?.id == 1, canAdmin: role?.id == 1};
}
export default useRole;