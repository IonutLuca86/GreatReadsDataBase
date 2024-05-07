using GRDB.ServerAPI.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace GRDB.ServerAPI.Entities
{
    public class GrdbUser : IdentityUser<int>,IEntity
    {   
      
        public virtual ICollection<Book>? Books { get; set; }
        public virtual ICollection<BookReview>? Reviews { get; set; }
    }
}
