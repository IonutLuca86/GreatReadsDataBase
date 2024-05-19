using GRDB.ServerAPI.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace GRDB.ServerAPI.Entities
{
    public class BookAuthor : IEntity
    {
        public int Id { get; set; }
    
        public string AuthorName { get; set; }
        public string? BirthDate { get; set; }
        public string? WorkCount { get; set; }

        public virtual ICollection<Book>? Books { get; set; }
    }
}
