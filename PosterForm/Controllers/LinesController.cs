using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PosterForm.Models;
using System.IO;

namespace PosterForm.Controllers
{
    public class LinesController : Controller
    {
        private PosterFormConnectionEntities db = new PosterFormConnectionEntities();

        // GET: Lines
        public async Task<ActionResult> Index()
        {
            var line = db.Line.Include(l => l.Order);
            return View(await line.ToListAsync());
        }

        // GET: Lines/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Line line = await db.Line.FindAsync(id);
            if (line == null)
            {
                return HttpNotFound();
            }
            return View(line);
        }

        public ActionResult SaveUploadedFile(IEnumerable<HttpPostedFileBase> files)
        {
            bool SavedSuccessfully = true;
            string fName = "";
            try
            {
                //loop through all the files
                foreach (var file in files)
                {

                    //Save file content goes here
                    fName = file.FileName;
                    if (file != null && file.ContentLength > 0)
                    {

                        var originalDirectory = new DirectoryInfo(string.Format("{0}Images\\", Server.MapPath(@"\")));

                        string pathString = System.IO.Path.Combine(originalDirectory.ToString(), "imagepath");

                        var fileName1 = Path.GetFileName(file.FileName);

                        bool isExists = System.IO.Directory.Exists(pathString);

                        if (!isExists)
                            System.IO.Directory.CreateDirectory(pathString);

                        var path = string.Format("{0}\\{1}", pathString, file.FileName);
                        file.SaveAs(path);

                    }

                }

            }
            catch (Exception ex)
            {
                SavedSuccessfully = false;
            }


            if (SavedSuccessfully)
            {
                return RedirectToAction("Index", new { Message = "All files saved successfully" });
            }
            else
            {
                return RedirectToAction("Index", new { Message = "Error in saving file" });
            }
        }

        // GET: Lines/Create
        public ActionResult Create()
        {
            ViewBag.OrderId = new SelectList(db.Order, "Id", "UserName");


            ViewBag.PAPERTYPEName = new SelectList(db.PaperType, "Id", "PAPERNameAndPrice");

            //var cow = new SelectList(db.PaperType, "Id", "PAPERNameAndPrice");
           // ViewData["cow"] = cow;
            return View();
        }

        // POST: Lines/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
       
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(FullViewModel model)
        {
            PosterFormConnectionEntities db = new PosterFormConnectionEntities();

            if (ModelState.IsValid)
            {

                Line li = new Line();
                li.Id = model.Id;
                li.PaperCost = model.PaperCost;
                li.CuttingFee = model.CuttingFee;
                li.ItemUnits = model.ItemUnits;
                li.LineSubtotal = model.LineSubtotal;
                li.NumBoards = model.NumBoards;
                li.NumFrame = model.NumFrame;
                li.NumLam = model.NumLam;
                li.NumLamMatte = model.NumLamMatte;
                li.NumRhyno = model.NumRhyno;
                li.NumTubes = model.NumTubes;
                li.OrderId = model.OrderId;
                li.PaperGrommet = model.PaperGrommet;
                li.PaperHeight = model.PaperHeight;
                li.PaperTypeId = model.PaperTypeId;
                li.PaperTypeName = model.PaperTypeName;
                li.PaperWidth = model.PaperWidth;
                li.PaperUnits = model.PaperUnits;

                db.Line.Add(li);
                db.SaveChanges();

                Order ord = new Order();
                ord.UserName = model.UserName;
                ord.CustType = model.CustType;
                ord.DateIN = DateTime.Now;
                ord.OperatorIN = model.OperatorIN;
                ord.OperatorOut = model.OperatorOut;
                ord.TotalCost = model.TotalCost;
                ord.Paid = model.Paid;
                ord.Printed = model.Printed;
                ord.Ready = model.Ready;
                ord.DateOUT = model.DateOUT;
                ord.Location = model.Location;
                ord.Department = model.Department;
                ord.FirstName = model.FirstName;
                ord.LastName = model.LastName;
                ord.BadOrder = model.BadOrder;
                ord.Purpose = model.Purpose;

                db.Order.Add(ord);
                db.SaveChangesAsync();

                PaperType PapTy = new PaperType();
                PapTy.Id = model.PAPERTYPEzId;
                PapTy.Name = model.PAPERTYPEzName;
                PapTy.Price = model.PAPERTYPEzPrice;
                PapTy.Width = model.PAPERTYPEzWidth;

                

                return RedirectToAction("Index");
            }

            return View(model);
        }


        // GET: Lines/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Line line = await db.Line.FindAsync(id);
            if (line == null)
            {
                return HttpNotFound();
            }
            ViewBag.OrderId = new SelectList(db.Order, "Id", "UserName", line.OrderId);
            return View(line);
        }

        // POST: Lines/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,PaperTypeId,PaperTypeName,PaperCost,PaperWidth,PaperHeight,PaperUnits,ItemUnits,NumLam,PaperGrommet,NumBoards,LineSubtotal,OrderId,NumFrame,NumRhyno,NumTubes,CuttingFee,NumLamMatte")] Line line)
        {
            if (ModelState.IsValid)
            {
                db.Entry(line).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.OrderId = new SelectList(db.Order, "Id", "UserName", line.OrderId);
            return View(line);
        }

        // GET: Lines/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Line line = await db.Line.FindAsync(id);
            if (line == null)
            {
                return HttpNotFound();
            }
            return View(line);
        }

        // POST: Lines/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Line line = await db.Line.FindAsync(id);
            db.Line.Remove(line);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

    }
}
