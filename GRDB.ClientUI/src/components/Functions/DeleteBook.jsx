import {BASE_URL} from '../../config'

export default async function deleteBook(bookId,token) {

    try{   
         
        const response = await fetch(`${BASE_URL}/Books/${bookId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
        },
      
    });
        if (!response.ok)
            {
                throw new Error(`Delete failed with status: ${response.status}`)
            } 
            return true;        
    }catch(error)
    {
        console.log('delete error:' + error);           
    }
}