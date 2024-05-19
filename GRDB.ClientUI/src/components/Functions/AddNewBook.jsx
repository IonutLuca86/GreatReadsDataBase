import {BASE_URL} from '../../config'

export default async function addNewBook(newBook,token) {

    try{        
        const response = await fetch(`${BASE_URL}/Books`, {
            method: 'POST',
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
            const data = await response.json();
            console.log(data)
            return data;        
    }catch(error)
    {
        console.log('add error:' + error);           
    }
}