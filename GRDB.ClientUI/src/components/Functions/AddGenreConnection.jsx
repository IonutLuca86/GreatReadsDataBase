import {BASE_URL} from '../../config'

export default async function addGenreConnection(bookId,genreId,token) {

    try{
        const model = {BookId:bookId,GenreId:genreId};
        const response = await fetch(`${BASE_URL}/BookGenreConnection`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(model),
    });
        if (!response.ok)
            {
                throw new Error(`Adding new genre connection failed with status: ${response.status}`)
            } 
            const data = await response.json();
            console.log(data)
            return data;        
    }catch(error)
    {
        console.log('add error:' + error);           
    }
}