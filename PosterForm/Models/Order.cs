//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PosterForm.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Order
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Order()
        {
            this.Line = new HashSet<Line>();
            this.Note = new HashSet<Note>();
            this.OrderPack = new HashSet<OrderPack>();
        }
    
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
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Line> Line { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Note> Note { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<OrderPack> OrderPack { get; set; }
    }
}
