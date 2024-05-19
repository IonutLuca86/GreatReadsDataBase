import {BASE_URL} from '../../config'

export default async function addNewAuthor(authorName,birthDate,workCount,token) {

    try{
        const model = {AuthorName:authorName,BirthDate:birthDate,WorkCount:workCount};
        const response = await fetch(`${BASE_URL}/Authors`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(model),
    });
        if (!response.ok)
            {
                throw new Error(`Adding new author failed with status: ${response.status}`)
            } 
            const data = await response.json();
            console.log(data)
            return data;        
    }catch(error)
    {
        console.log('add error:' + error);           
    }
}