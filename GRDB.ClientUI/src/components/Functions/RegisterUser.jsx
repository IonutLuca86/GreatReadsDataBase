import {BASE_URL} from '../../config'

export default async function registerUser(registerModel) {

    try{
        const response = await fetch(`${BASE_URL}/Authenticate/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerModel)
        });
        if (!response.ok)
            {
                throw new Error(`Register failed with status: ${response.status}`)
            }
        else {return true;}
       
    }catch(error)
    {
        console.log('login error:' + error);           
    }
}

