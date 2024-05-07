using GRDB.ServerAPI.Interfaces;

namespace GRDB.ServerAPI.Entities
{
    public class BookAuthorConnection : IReferenceEntity
    {
        public int BookId { get; set; }
        public Book Book { get; set; }

        public int AuthorId { get; set; }
        public BookAuthor Author { get; set; }
    }
}
