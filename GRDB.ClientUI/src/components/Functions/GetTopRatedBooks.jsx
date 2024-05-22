import {BASE_URL} from '../../config'

export default async function getTopRatedBooks(count) {

    try{
        const response = await fetch(`${BASE_URL}/Books/toprated/${count}`);
        if (!response.ok)
            {
                throw new Error(`Login failed with status: ${response.status}`)
            }
        const data = await response.json();
       
        return data;    
    }catch(error)
    {
        console.log('login error:' + error);           
    }
}