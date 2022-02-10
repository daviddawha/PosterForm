using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace PosterForm.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string Department { get; set; }
        public string UserName { get; set; }
        public DateTime DateIN { get; set; }
        public decimal TotalCost { get; set; }
        public Boolean Paid { get; set; }
        public Boolean Printed { get; set; }
        public string OperatorOut { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Location { get; set; }
        public string Purpose { get; set; }
        public string CustType { get; set; }
    }

    public static class IdentityInfo
    {
        public static string GetLastName(this System.Security.Principal.IPrincipal usr)
        {
            var lastNameClaim = ((ClaimsIdentity)usr.Identity).FindFirst("LastName");
            if (lastNameClaim != null)
                return lastNameClaim.Value;

            return "";
        }
    }
}