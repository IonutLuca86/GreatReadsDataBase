using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GRDB.Server.Common.DTOs
{
    public class BookReviewCreateDTO
    {
        public int BookId { get; set; }
        public int UserId { get; set; }
        public string ReviewContent { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
    }
    public class BookReviewUpdateDTO : BookReviewCreateDTO
    {
        public int Id { get; set; }
    }

    public class BookReviewDTO : BookReviewUpdateDTO
    {
        public BookDTO Book { get; set; }
        public GrdbUserDTO User { get; set; }

    }
}
