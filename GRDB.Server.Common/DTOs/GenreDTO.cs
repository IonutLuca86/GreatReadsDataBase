using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GRDB.Server.Common.DTOs
{
    public class GenreCreateDTO
    {
        public string Name { get; set; }
    }
    public class GenreDTO : GenreCreateDTO
    {
        public int Id { get; set; }

        //public List<BookDTO> Books { get; set; }
    }
}
