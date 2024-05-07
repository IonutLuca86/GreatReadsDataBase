using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GRDB.Server.Common.DTOs
{
    public class AuthorCreateDTO
    {
        public string AuthorName { get; set; }
        public string? BirthDate { get; set; }
        public string? WorkCount { get; set; }
    }
    public class AuthorDTO : AuthorCreateDTO
    {
        public int Id { get; set; }
    }
}
