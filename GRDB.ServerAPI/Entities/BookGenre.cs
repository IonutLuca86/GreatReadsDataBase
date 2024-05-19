using GRDB.ServerAPI.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace GRDB.ServerAPI.Entities
{
    public class BookGenre : IEntity
    {
        public int Id { get; set; }
    
        public string Name { get; set; }

        public virtual ICollection<Book> Books { get; set; }
    }
}
