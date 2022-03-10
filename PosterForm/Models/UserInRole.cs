using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PosterForm.Models
{
    public class UserInRole
    {
        [Key]
        public string Username { set; get; }
    }
}