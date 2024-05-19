import {BASE_URL} from '../../config'

export default async function deleteReview(id,token) {

    try{
        const response = await fetch(`${BASE_URL}/Reviews/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
        },});
        if (!response.ok)
            {
                throw new Error(`Delete review failed with status: ${response.status}`)
            } 
            else{return true;}         
    }catch(error)
    {
        console.log('delete error:' + error);           
    }
}