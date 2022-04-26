using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace PosterForm.Models
{
    public class FullViewModel
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string CustType { get; set; }
        public Nullable<System.DateTime> DateIN { get; set; }
        public string OperatorIN { get; set; }
        public Nullable<decimal> TotalCost { get; set; }
        public Nullable<bool> Paid { get; set; }
        public Nullable<bool> Printed { get; set; }
        public Nullable<bool> Ready { get; set; }
        public string OperatorOut { get; set; }
        public Nullable<System.DateTime> DateOUT { get; set; }
        public string Location { get; set; }
        public string Department { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Nullable<bool> BadOrder { get; set; }
        public string Purpose { get; set; }

        public int PaperTypeId { get; set; }
        public string PaperTypeName { get; set; }
        public decimal PaperCost { get; set; }
        public decimal PaperWidth { get; set; }
        public decimal PaperHeight { get; set; }
        public int PaperUnits { get; set; }
        public decimal ItemUnits { get; set; }
        public int NumLam { get; set; }
        public int PaperGrommet { get; set; }
        public int NumBoards { get; set; }
        public decimal LineSubtotal { get; set; }
        public int OrderId { get; set; }
        public int NumFrame { get; set; }
        public int NumRhyno { get; set; }
        public int NumTubes { get; set; }
        public decimal CuttingFee { get; set; }
        public int NumLamMatte { get; set; }


        public int PAPERTYPEzId { get; set; }
        public string PAPERTYPEzName { get; set; }
        public int PAPERTYPEzWidth { get; set; }
        public decimal PAPERTYPEzPrice { get; set; }
        public string PAPERNameAndPrice { get { return this.PAPERTYPEzName + " " + this.PAPERTYPEzPrice; } }
    }
}