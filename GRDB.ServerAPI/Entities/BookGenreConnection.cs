using GRDB.ServerAPI.Interfaces;

namespace GRDB.ServerAPI.Entities
{
    public class BookGenreConnection : IReferenceEntity
    {
        public int BookId { get; set; }
        public Book Book { get; set; }

        public int GenreId { get; set; }
        public BookGenre Genre { get; set; }
    }
}
