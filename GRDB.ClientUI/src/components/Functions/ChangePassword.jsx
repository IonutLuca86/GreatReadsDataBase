import {BASE_URL} from '../../config'

export default async function changePassword(userId,currrentPassword,newPassword,confirmPassword, token, navigate) {

    try{
        const model = {
            id:userId,
            currrentPassword: currrentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        }
        const response = await fetch(`${BASE_URL}/Authenticate/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            'Authorization': `Bearer ${token}`,           
        });
        if (!response.ok)
            {
                throw new Error(`Register failed with status: ${response.status}`)
            }
        else {
            sessionStorage.clear();
            navigate('/login');
        }
       
    }catch(error)
    {
        console.log('login error:' + error);           
    }
}
