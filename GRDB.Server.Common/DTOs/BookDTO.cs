using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GRDB.Server.Common.DTOs
{
    public class BookCreateDTO
    {

        public string? ISBN { get; set; }

        public string Title { get; set; }
        public string? Publisher { get; set; }
        public string? PublishedDate { get; set; }
        public string? Language { get; set; }
        public string? CoverUrl { get; set; }
        public string? BookUrl { get; set; }
        public int UserId { get; set; }

    }

    public class BookUpdateDTO : BookCreateDTO
    {
        public int Id { get; set; }
    }

    public class BookDTO : BookUpdateDTO
    {
        public GrdbUserDTO User { get; set; }
        public List<AuthorDTO> Authors { get; set; }
        public List<GenreDTO> BookGenres { get; set; }  
    }

    public class CompleteBookInfo : BookDTO
    {
        public List<BookReviewDTO> BookReviews { get; set; }
    }
}
