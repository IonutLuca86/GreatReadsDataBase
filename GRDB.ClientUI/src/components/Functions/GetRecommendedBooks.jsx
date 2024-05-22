import {BASE_URL} from '../../config'

export default async function getRecommendedBooks(count) {

    try{
        const response = await fetch(`${BASE_URL}/Books/recommended/${count}`);
        if (!response.ok)
            {
                throw new Error(`Login failed with status: ${response.status}`)
            }
        const data = await response.json();
        // console.log(data);      
        return data;    
    }catch(error)
    {
        console.log('login error:' + error);           
    }
}