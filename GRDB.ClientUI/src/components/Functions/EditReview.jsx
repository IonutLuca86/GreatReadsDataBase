import {BASE_URL} from '../../config'

export default async function editReview(reviewId,bookId,userid,reviewText,token) {

    try{
        const model = {id:reviewId,BookId:bookId,UserId:userid,ReviewContent:reviewText};
        const response = await fetch(`${BASE_URL}/Reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(model),
    });
        if (!response.ok)
            {
                throw new Error(`Adding new review failed with status: ${response.status}`)
            } 
        else{return true;}         
    }catch(error)
    {
        console.log('delete error:' + error);           
    }
}