using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GRDB.Server.Common.DTOs
{
    public class GrdbUserCreateDTO
    {
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        //public byte[]? PasswordHash { get; set; }
        //public byte[]? PasswordSalt { get; set; }
    }
    public class GrdbUserUpdateDTO : GrdbUserCreateDTO
    {
        public int Id { get; set; }
    }
    public class GrdbUserDTO : GrdbUserUpdateDTO
    {
        public List<BookDTO>? AddedBooks { get; set; }
        public List<BookReviewDTO>? AddedReviews { get; set; }
    }
}
