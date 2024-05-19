import {BASE_URL} from '../../config'

export default async function updateBook(newBookId,newBook,token) {

    try{        
        const response = await fetch(`${BASE_URL}/Books/${newBookId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
    });
        if (!response.ok)
            {
                throw new Error(`Adding new book failed with status: ${response.status}`)
            } 
            // const data = await response.json();
            // console.log(data)
            return true;        
    }catch(error)
    {
        console.log('add error:' + error);           
    }
}