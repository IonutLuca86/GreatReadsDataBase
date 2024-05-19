import {BASE_URL} from '../../config'

export default async function getAllGenres() {
    try{
        const response = await fetch(`${BASE_URL}/Genre`);
        if (!response.ok)
            {
                throw new Error(`Get Book from api failed with status: ${response.status}`)
            }
        const data = await response.json();
        // console.log(data);
        return data;    
    }catch(error)
    {
        console.log('login error:' + error);           
    }
}