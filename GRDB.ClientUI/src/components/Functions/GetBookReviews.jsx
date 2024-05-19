import {BASE_URL} from '../../config'

export default async function getBookReviews(id) {

    try{
        const response = await fetch(`${BASE_URL}/Reviews/book/${id}`);
        if (!response.ok)
            {
                throw new Error(`Get Reviews from api failed with status: ${response.status}`)
            }
        const data = await response.json();
        // console.log(data);
        return data;    
    }catch(error)
    {
        console.log('login error:' + error);           
    }
}