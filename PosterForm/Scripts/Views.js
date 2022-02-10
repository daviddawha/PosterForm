$(function () {
	function round(value, decimals) {
		return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	}

	/*--------------------Backbone Models---------------------------------*/
	var Paper = Backbone.Model.extend({
		defaults: function () {
			return {
				id: null,
				name: null,
				price: 0
			}
		}
	});

	var Option = Backbone.Model.extend({
		defaults: function () {
			return {
				id: null,
				name: null,
				price: 0
			}
		}
	});

	var Order = Backbone.Model.extend({
		defaults: function () {
			return {
				Id: null,
				Username: null,
				CustType: null,
				OperatorIN: null,
				DateIN: null,
				TotalCost: 0,
				Paid: false,
				Printed: false,
				OperatorOut: null,
				DateOUT: null,
				Lines: [], // holds the array of orderlienes
				OrderPacks: [],
				Location: null,
				Purpose: null,
				FirstName: null,
				LastName: null,
				Department: null,
			};
		},

		url: '/Orders/Create/',
	});

	var Orderline = Backbone.Model.extend({
		defaults: function () {
			return {
				files: [], //Holds the array of ordelines
				Notes: []
			}
		},

		initialize: function () {
			OrderId = 0;
			lineid = 0;
			//Changed initilization of PaperType to default to Layout Adjustment 8-4-16 Kpw
			//PaperTypeId = 0;
			//PaperTypeName = null;
			PaperTypeId = 2;
			PaperTypeName = "Layout Adjustment";
			PaperCost = 0;
			PaperWidth = 0;
			PaperHeight = 0;
			PaperUnits = 0;
			ItemUnits = 1.0;
			//Added 1/19/17 to track number of images per line item
			NumImages = null;

			NumLam = 0;
			NumLamMatte = 0;
			PaperGrommet = 0;
			NumBoards = 0;

			//Added Aug 1st
			NumFrame = 0;
			NumRhyno = 0;
			NumTubes = 0;
			CuttingFee = 0;

			lineSubtotal = 0;
			files = [];
			SelectedPaperType = null;
			IPaperWidth = null;
			IPaperHeight = null;
			IItemUnits = null;

			INumImages = null;

			INumLam = 0;
			INumLamMatte = 0;
			INumBoards = 0;
			IPaperGrommets = null;
			INumFrame = 0;
			INumRhyno = 0;
			INumTubes = 0;

			ICuttingFee = 0;

			ISubtotal = 0;
		},
	});

	var OrderPackFile = Backbone.Model.extend({
		defaults: function () {
			return {
				FileName: null,
				Color: null,
				Quantity: 0,
			}
		},

		initialize: function () {
			PackId = 0;
			OrderId = 0;
			FileName = null;
			Color = null;
			Printed = null;
			Soaked = null;
			Quantity = null;
			packlineid = 0;
		},
	});

	var OrderNum = Backbone.Model.extend({
		initialize: function () {
			id = 0;
		}
	});

	/*--------------------Backbone Collections---------------------------------*/
	var PaperCollection = Backbone.Collection.extend({
		model: Paper,
		url: '/Orders/GetPaperTypes',
		initialize: function () { },
		papers: function () {
			return this.models;
		}
	});

	var Papers = new PaperCollection;
	Papers.fetch({
		//success: function (collection) { console.log(collection); }
	});

	var OptionCollection = Backbone.Collection.extend({
		model: Option,
		url: '/Orders/GetFinishings',
		initialize: function () { },
		options: function () {
			return this.models;
		}
	});

	var Options = new OptionCollection;
	Options.fetch({
		//success: function (collection) { console.log(collection); }
	});

	var jobCollection = Backbone.Collection.extend({
		model: OrderNum,
		url: '/Orders/GetJobs',
		initialize: function () { },
		jobs: function () {
			return this.models;
		}
	});

	var Jobs = new jobCollection;
	Jobs.fetch({
		//success: function (collection) { console.log(collection); }
	});

	/*--------------------Backbone Views---------------------------------*/
	var PaperCollectionView = Backbone.View.extend({
		tagName: "div",
		template: _.template($('#paper-template').html()),

		initialize: function () {
			this.selected = this.model.models[0];
		},

		events: {
			'change select': 'paperListChange'
		},

		render: function () {
			$(this.el).html(this.template(this.model.toJSON()));
			_.each(this.model.models, this.renderPapers, this);
			return this.el;
		},

		renderPapers: function (model) {
			var id = model.get('id');
			var name = model.get('name');
			var price = model.get('price');
			var option = $('<option></option>');
			var select = $(this.el).find('.paper-list')[0];
			$(option).html(name + ' $' + price);
			$(option).val(id);
			$(select).append($(option));
		},

		paperListChange: function (e) {
			var model = _.find(this.model.models, function (model) {
				if (model.get('id') == $(e.target).val()) {
					return model;
				};
			}, this);
			this.selected = model;

			//if (model.get('id') <= 8) {
			//    this.$('PaperWidth').show()
			//    this.$('PaperHeight').show();
			//    this.$('.ItemUnits').hide();
			//}
			//else {
			//    this.$('.ItemUnits').show();
			//    this.$('PaperWidth').hide();
			//    this.$('PaperHeight').hide();
			//}
		}
	});

	var OrderView = Backbone.View.extend({
		tagName: "div",
		el: $('#Order'),

		lines: [],
		orderPackFiles: [],

		events: {
			"click #addorderline": "addOrderline",
			"change #orderline-list": "calcTotalCost",
			"change #orderline-template": "calcTotalCost",
			"click #submitOrder": "onSave",
			//"change #OperatorIN": "showSubmitButton",
			"click #completeOrder": "showOperatorInput",
			"click #addOrderPackFile": "addOrderPackFile",
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.template = _.template($(this.options.itemplate).html());
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.find('#completeOrder').hide();
			this.$el.find('#lblOperator').hide();
			this.$el.find('#OperatorIN').hide();
			this.$el.find('#submitOrder').hide();
			return this;
		},

		//showSubmitButton: function () {
		//},

		showOperatorInput: function () {
			$('#completeOrder').hide();
			$('#lblOperator').show();
			$('#OperatorIN').show();
			$('#submitOrder').show();
		},

		addOrderline: function () {
			var flag = false;

			//Added 4/3/17 to verify that a deparmtent is selected.
			if (this.$('#Department').val() == "") {
				alert("Please select a department");
				flag = true;
			}

			//Added 4/3/17 to verify that a customer type is selected.
			if (this.$('#CustType').val() == "") {
				alert("Please select a customer type");
				flag = true;
			}

			if (flag == false) {
				//added to hide complete order button when
				$('#completeOrder').hide();
				$('#lblOperator').hide();
				$('#OperatorIN').hide();
				$('#submitOrder').hide();
				var orderline = new Orderline();
				var length = this.lines.length;
				orderline.set('lineid', length);
				var view = new OrderlineView({ model: orderline });

				this.$("#orderline-list").append(view.render().el);
				this.$el.find('.confirmOrderlines').hide();
				var upload = $("#file_upload" + length).kendoUpload({
					async: {
						saveUrl: "/Orders/UploadFile",
						autoUpload: true
					},
					multiple: true,
					showFileList: true,
					orderline: view,
					success: function (e) {
						view.addFile(e.files);
					},
				});
				this.lines.push(view);
			}
			else {
				alert("Please enter all customer details before proceeding");
				//window.location.reload();
				//@One didn't like the fact the application forced a reload whenever a user's input is invalid or empty
				console.log("window.location.reload() commented out 08/14/2020 - 1/4");
			}
		},

		addOrderPackFile: function () {
			var packFile = new OrderPackFile();

			var packfilelength = this.orderPackFiles.length;
			packFile.set('packlineid', packfilelength);

			var view = new OrderPackFileView({ model: packFile });

			this.$("#orderpackfile-list").append(view.render().el);

			var upload = $("#pack_file_upload_" + packfilelength).kendoUpload({
				async: {
					saveUrl: "/Orders/UploadFile",
					autoUpload: true
				},
				multiple: false,
				showFileList: true,
				success: function (e) {
					view.addPackFile(e.files);
				},
			});
			this.orderPackFiles.push(view);
		},

		calcTotalCost: function () {
			//console.log("Calling TotalCost()");
			var totalcost = 0;
			$('.lineSubtotal').each(function () {
				totalcost += parseFloat($(this).val());
			});
			//console.log("Total Cost: " + totalcost);
			totalcost = totalcost.toFixed(2);
			this.$('#TotalCost').html(totalcost);
			this.model.TotalCost = totalcost;
		},

		onSave: function (e) {
			var linearray = [];
			var length = this.lines.length;
			var i = 0;
			var flag = false;
			while (i < length) {
				//if (this.lines[i].model.SelectedPaperType != null) { //added an if statement to check for null orderlines.
				if (this.lines[i].model.lineSubtotal != null) { //added an if statement to check for null orderlines.
					linearray[i] = this.lines[i].model;
				}
				//if (this.lines[i].model.selectedPaperType == null)
				else {
					flag = true;
				}
				i++;
			};

			var packsarray = [];
			var plength = this.orderPackFiles.length;
			var j = 0;
			while (j < plength) {
				//if (this.lines[i].model.SelectedPaperType != null) { //added an if statement to check for null orderlines.
				packsarray[j] = this.orderPackFiles[j].model;
				j++;
			};

			//Added 9/16 to verify that a operator is present.
			if (this.$('#OperatorIN').val() == "") {
				flag = true;
			}

			//Added 4/3/17 to verify that a deparmtent is selected.
			if (this.$('#Department').val() == "") {
				alert("Please select a department");
				flag = true;
			}

			//Added 4/3/17 to verify that a customer type is selected.
			if (this.$('#CustType').val() == "") {
				alert("Please select a customer type");
				flag = true;
			}

			if (flag) {
				alert("The system detected a null orderline, please redo the order");
				//document.location.reload(true);
				//window.location.reload();
				//@One didn't like the fact the application forced a reload whenever a user's input is invalid or empty
				console.log("window.location.reload() commented out 08/14/2020 - 2/4");
			}

			if (this.lines.length > 0 && this.model.TotalCost >= 0 && flag == false) {
				if (this.$('.OperatorIN').val() != null) {
					this.model.save({
						Id: 0,
						CustType: this.$('#CustType').val(),
						OperatorIN: this.$('#OperatorIN').val(),
						DateIN: null,
						TotalCost: this.model.TotalCost,
						DateOUT: null,
						Lines: linearray,
						OrderPacks: packsarray,
						Location: this.$('#Location').val(),
						Purpose: this.$('#Purpose').val(),
						FirstName: this.$('#FirstName').val(),
						LastName: this.$('#LastName').val(),
						Department: this.$('#Department').val(),
					},
						{
							success: function (model, response) {
								window.location = "/Orders/ViewOrders";
								//window.location = "https://devposterform.unr.edu/Home/ViewOrders";
								////this.$el.find('#completeOrder').show();
								//var url = window.location.href;
								//var units = Jobs.models[0].attributes.id + 1; //Grabs the most recent order and adds 1 to that value to display the receipt for that order
								//window.location = "https://posterform.unr.edu/Home/Receipt/" + units; //need to change this based on DEV environment or PROD environment.
							},
							error: function (model, response) {
								alert("Order was not saved properly, please redo the order");
								//document.location.reload(true);
								//@One didn't like the fact the application forced a reload whenever a user's input is invalid or empty
								console.log("window.location.reload() commented out 08/14/2020 - 3/4");
								//console.log(model);
							}
						}
					);
				}
				else alert("An operator is required");
			}
			else alert("An order must have a minimum of one line item");
		}
	});

	var OrderlineView = Backbone.View.extend({
		tagName: "div",

		files: [],

		template: _.template($('#orderline-template').html()),

		events: {
			"change .PaperHeight": "calclineSubtotal",
			"change select": "calclineSubtotal",
			"change .PaperMount": "calclineSubtotal",
			"change .PaperLam": "calclineSubtotal",
			"change .PaperGrommet": "calclineSubtotal",
			"change .NumLam": "calclineSubtotal",
			"change .NumLamMatte": "calclineSubtotal",
			"change .NumBoards": "calclineSubtotal",
			"change .ItemUnits": "calclineSubtotal",
			"change .NumImages": "calclineSubtotal",
			"click #confirmOrderlines": "saveChanges",
			//Added Aug 1st
			"change .NumFrame": "calclineSubtotal",
			"change .NumRhyno": "calclineSubtotal",
			"change .NumTubes": "calclineSubtotal",
			"change .CuttingFee": "calclineSubtotal",
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function () {
			var paperView = new PaperCollectionView({ model: Papers });
			this.paperList = paperView;
			this.$el.html(paperView.render());
			this.$el.append(this.template(this.model.toJSON()));
			return this;
		},

		calclineSubtotal: function (e) {
			//if (this.paperList.selected.get('price') >= 6.00) {
			//    this.$('PaperWidth').show()
			//    this.$('PaperHeight').show();
			//    this.$('.ItemUnits').hide();
			//}
			//else {
			//    this.$('.ItemUnits').show();
			//    this.$('PaperWidth').hide();
			//    this.$('PaperHeight').hide();
			//}

			// local variables
			var height = ((this.$('#PaperHeight').val()));
			var width = (this.$('#PaperWidth').val());
			var cost = this.paperList.selected.get('price');
			var units = 0;
			var flooredHeight = 0;
			var modOfHeight = 0;
			var copies = round(this.$('#ItemUnits').val(), 2);

			//Adding rouding up and down for lamination 4/6/15
			var lamHeight = this.$('#NumLam').val();
			var lamCost = Options.models[0].attributes.price;
			var lamUnits = 0;
			var flooredLam = 0;
			var modOfLam = 0;

			var lamHeightMatte = this.$('#NumLamMatte').val();
			var lamCostMatte = Options.models[0].attributes.price;
			var lamUnitsMatte = 0;
			var flooredLamMatte = 0;
			var modOfLamMatte = 0;

			console.log("Paper Cost: " + cost);
			console.log("Gloss Lamination Cost: " + lamCost);
			console.log("Matte Lamination Cost: " + lamCostMatte);

			////Preventive Validation
			//if (this.$('#PaperHeight').val() != 0 || this.$('#PaperWidth').val() != 0) {
			//    this.$('#ItemUnits').hide();

			//}
			//else {
			//    this.$('#ItemUnits').show();
			//}

			////Paper Selection Index Getter
			//var selectedVal = this.$('#paperlist :selected').val()

			//if (selectedVal < 11) {
			//    this.$('#ItemUnits').val(1);
			//    this.$('#ItemUnits').hide();
			//    this.$('#PaperWidth').show();
			//    this.$('#PaperWidth').val(0);
			//    this.$('#PaperHeight').show();
			//    this.$('#PaperHeight').val(0);
			//    this.$('#CuttingFee').show();
			//    this.$('#CuttingFee').val(0);
			//}

			//if (selectedVal < 21 && selectedVal >= 11) {
			//    this.$('#ItemUnits').show();
			//    this.$('#PaperWidth').hide();
			//    this.$('#PaperWidth').val(0);
			//    this.$('#PaperHeight').hide();
			//    this.$('#PaperHeight').val(0);
			//    this.$('#CuttingFee').hide();
			//    this.$('#CuttingFee').val(0);
			//}

			//else {
			//    this.$('#ItemUnits').val(1);
			//    this.$('#ItemUnits').hide();
			//    this.$('#PaperWidth').show();
			//    this.$('#PaperHeight').show();
			//    this.$('#CuttingFee').show();
			//}

			//9/3/15 Added to keep track of the paper type name, prevent from it setting to null.
			this.model.SelectedPaperType = this.paperList.selected.get('name');
			this.model.SelectedPaperTypeId = this.paperList.selected.get('id');

			//if (selectedVal != 21) {
			//    this.$('#CuttingFee').hide();
			//}
			//else {
			//    this.$('#CuttingFee').show();
			//    if (subtotal == 0)
			//    {
			//        subtotal += this.$('#CuttingFee').val();
			//    }
			//}

			// Validations
			if ((this.$('#PaperWidth').val()) >= 64 || (this.$('#PaperWidth').val()) <= -1) {
				alert("Width must be greater than 0 and less than 63");
				this.$('#PaperWidth').val(0);
				if ((this.$('#PaperHeight').val()) <= -1) {
					alert("Height must be greater than 0");
					this.$('#PaperHeight').val(0);
					// Exit function here
				}
			}

			if ((this.$('#PaperHeight').val()) <= -1) {
				alert("Height must be greater than 0");
				this.$('#PaperHeight').val(0);
				// Exit function here
			}

			//Validation for Magnetic Papertype 6/23/16 -------------------------------------------------------------------------
			if (this.model.SelectedPaperTypeId == 32 && width > 47) {
				alert("Magnetic Paper Type Width must be no greater than 47\"");
				this.$('#PaperWidth').val(0);
			}

			// Check that only one checkbox is checked
			if ((this.$('#NumLam').val() > 0 || this.$('#NumLamMatte').val() > 0) && (this.$('#NumBoards').val() > 0 || this.$('#NumRhyno').val() > 0)) {
				console.log("Cannot laminate and mount the same thing");
				this.$('#NumLam').val(0);
				this.$('#NumLamMatte').val(0);
				this.$('#NumBoards').val(0);
				this.$('#NumRhyno').val(0);
				alert("Please select either mounting (foam-cor/rhyno) or lamination!");
			}

			// Check that framing is only available if mounting
			//if ((this.$('#NumFrame').val()) > 0) {
			//    if ((this.$('#NumBoards').val()) > 0 || (this.$('#NumRhyno').val()) > 0) {
			//    }
			//    else {
			//        this.$('#NumFrame').val(0);
			//        this.$('#NumBoards').val(0);
			//        this.$('#NumRhyno').val(0);
			//        alert("Please select mounting (foam-cor/rhyno) first then add frames!");
			//    }
			//}

			// Calculations
			flooredHeight = Math.floor(height / 12)
			modOfHeight = height % 12;
			if (modOfHeight > 6) { units = flooredHeight + 1 }
			else { units = flooredHeight; }
			if (height < 12 && height > 0) { units = 1; }
			var subtotal = units * cost;
			this.model.PaperUnits = units;

			//Lamination Calculations Gloss 4/6/15
			flooredLam = Math.floor(lamHeight / 12)
			modOfLam = lamHeight % 12;

			//Lamination Calculations Matte 4/6/15
			flooredLamMatte = Math.floor(lamHeightMatte / 12)
			modOfLamMatte = lamHeightMatte % 12;

			//Previous method of calculation pre 9/16
			//// Calculate Paper Costs
			//if (copies == 1 && units > 0) {
			//    //console.log("Cost: " + cost);
			//    //console.log("Units: " + units);

			//    subtotal = units * cost;
			//}

			//Previous method of calculation pre 9/16
			//// Calculate addons
			//if (width == 0 && height == 0) {
			//    //console.log("Subtotal: " + subtotal);
			//    //console.log("Copies: " + copies);

			//    subtotal = cost * copies;
			//}

			//New validation method 4/7/16 -------------------------------------------------------------------------
			//Check for non-poster items with width and height
			if (copies > 1 && height > 0 && width > 0 && this.model.SelectedPaperTypeId >= 11 && this.model.SelectedPaperTypeId <= 24) {
				if (confirm("Please confirm that you'd like to use the item copies, instead of width and height, to calculate subtotal cost?")) {
					// capture copies value
					copies = this.$('#ItemUnits').val();

					//reset width and height values to 0
					this.$('#PaperWidth').val(0);
					width = this.$('#PaperWidth').val();
					this.$('#PaperHeight').val(0);
					height = this.$('#PaperHeight').val();

					//recalculation of subtotal cost based on copies done below
				}
				else {
					this.$('#ItemUnits').val(1);
					copies = 1;
				}
			}

			// Calculate addons, non-poster costs
			if (width == 0 && height == 0 && this.model.SelectedPaperTypeId >= 11) {
				//console.log("Subtotal: " + subtotal);
				//console.log("Copies: " + copies);

				subtotal = cost * copies;
			}

			//New method of calculation 9/16 -------------------------------------------------------------------------
			// Calculate Paper Costs
			if (copies == 1 && units > 0 && (this.model.SelectedPaperTypeId < 11 || this.model.SelectedPaperTypeId == 26 || this.model.SelectedPaperTypeId == 31 || this.model.SelectedPaperTypeId == 32)) {
				//console.log("Cost: " + cost);
				//console.log("Units: " + units);

				subtotal = units * cost;
			}

			//Added 9/16/15
			if (this.model.SelectedPaperTypeId < 11 || this.model.SelectedPaperTypeId == 26 || this.model.SelectedPaperTypeId == 31 || this.model.SelectedPaperTypeId == 32) {
				if (copies > 1) {
					if (height >= 30 && width >= 30) {
						if (confirm("You are about to submit an order to do 2 copies of a particular poster, the poster needs to be larger than 30 inches in both width and height")) {
							subtotal = cost * units * copies;
						}
						else {
							subtotal = cost * units;
						}
					}
					else {
						alert("To submit 2 copies of a particular poster, the poster needs to be larger than 30 inches in both width and height. Reverting # of copies to 1.");
						this.$('#ItemUnits').val(1)
					}
				}
				else {
					subtotal = cost * units;
				}
			}

			//New method of calculation 9/15 -------------------------------------------------------------------------

			//Lamination Gloss 4/6/15
			if (lamHeight > 0) {
				if (lamHeightMatte == 0) // Check that only Gloss has a value
				{
					if (width < 61 || height < 61) //If one side can be laminated then continue
					{
						console.log("Calculating Gloss Lamination Cost");
						//Adding rouding up and down for lamination 4/6/15
						if (modOfLam > 6) {
							lamUnits = flooredLam + 1;
						}
						else { lamUnits = flooredLam; }
						if (lamHeight < 12 && lamHeight > 0) { lamUnits = 1; }

						console.log("lam height:" + lamHeight);
						console.log("Mod of Lam:" + modOfLam);
						console.log("flooredLam:" + flooredLam);
						console.log("Lam units:" + lamUnits);

						var lamSubTotal = (lamUnits) * lamCost;

						subtotal += lamSubTotal;
						//console.log("The New Subtotal with lamination is: " +subtotal);
					}
					else //Else return error msg, reset values
					{
						alert("Poster cannot be laminated, width exceeds 61 inches");
						lamUnits = 0;
						this.$('#NumLam').val(0);
					}
				}
				else {
					alert("Cannot be both Glossy and Matte Laminate");
					lamUnits = 0;
					lamUnitsMatte = 0;
					this.$('#NumLam').val(0);
					this.$('#NumLamMatte').val(0);
				}
			}

			this.model.NumLam = (lamUnits);

			//New method of tracking matte laminate 8/14/14-------------------------------------------------------------------------

			//Lamination Matte 4/6/15
			if (lamHeightMatte > 0) {
				if (lamHeight == 0) // Check that only Matte has a value
				{
					if (width < 61 || height < 61) //If one side can be laminated then continue
					{
						console.log("Calculating Matte Lamination Cost");
						//Adding rouding up and down for lamination 4/6/15
						if (modOfLamMatte > 6) {
							lamUnitsMatte = flooredLamMatte + 1;
						}
						else { lamUnitsMatte = flooredLamMatte; }
						if (lamHeightMatte < 12 && lamHeightMatte > 0) { lamUnitsMatte = 1; }

						console.log("lam height:" + lamHeightMatte);
						console.log("Mod of Lam:" + modOfLamMatte);
						console.log("flooredLam:" + flooredLamMatte);
						console.log("Lam units:" + lamUnitsMatte);

						var lamSubTotal = (lamUnitsMatte) * lamCost;

						subtotal += lamSubTotal;
						//console.log("The New Subtotal with lamination is: " +subtotal);
					}
					else //Else return error msg, reset values
					{
						alert("Poster cannot be laminated, width exceeds 61 inches");
						lamUnits = 0;
						this.$('#NumLamMatte').val(0);
					}
				}
				else {
					alert("Cannot be both Matte and Glossy Laminate");
					lamUnits = 0;
					lamUnitsMatte = 0;
					this.$('#NumLam').val(0);
					this.$('#NumLamMatte').val(0);
				}
			}

			this.model.NumLamMatte = (lamUnitsMatte);

			//Mounting
			if ((this.$('#NumBoards').val()) > 0) {
				//console.log("Calculating Mounting Cost");
				//var mount = ((width * height) / 600); //Calculate # of boards
				//if (mount == 0) { mount = 1;}
				//console.log("# of Boards: " + mount);
				var mountCost = Options.models[1].attributes.price;
				var mountSubTotal = (this.$('#NumBoards').val()) * mountCost;
				subtotal += mountSubTotal;
				//console.log("The New Subtotal with mounting is: " +subtotal);
			}
			this.model.NumBoards = (this.$('#NumBoards').val());

			// Calculate Grommet Cost
			var grommet = (this.$('#PaperGrommet').val());
			//console.log("# of Grommets: " + grommet);
			var grommetCost = Options.models[2].attributes.price;
			var grommetSubTotal = 0;
			if (grommet > 0) {
				grommetSubTotal = grommet * grommetCost;

				subtotal += grommetSubTotal;
				//console.log(subtotal);
			}
			this.model.PaperGrommet = grommet;

			//Added Aug 1st
			//Frames
			if ((this.$('#NumFrame').val()) > 0) {
				var frameCost = Options.models[3].attributes.price;
				var frameSubTotal = (this.$('#NumFrame').val()) * frameCost;
				subtotal += frameSubTotal;
			}
			this.model.NumFrame = (this.$('#NumFrame').val());

			//Rhyno Mounting
			if ((this.$('#NumRhyno').val()) > 0) {
				//console.log("Calculating Mounting Cost");
				//var mount = ((width * height) / 600); //Calculate # of boards
				//if (mount == 0) { mount = 1;}
				//console.log("# of Boards: " + mount);
				var rhynoCost = Options.models[4].attributes.price;
				var rhynoSubTotal = (this.$('#NumRhyno').val()) * rhynoCost;
				subtotal += rhynoSubTotal;
				//console.log("The New Subtotal with mounting is: " +subtotal);
			}
			this.model.NumRhyno = (this.$('#NumRhyno').val());

			// Calculate Tube Cost
			var tubes = (this.$('#NumTubes').val());
			//console.log("# of Grommets: " + grommet);
			var tubeCost = Options.models[5].attributes.price;
			var tubeSubTotal = 0;
			if (tubes > 0) {
				tubeSubTotal = tubes * tubeCost;

				subtotal += tubeSubTotal;
				//console.log(subtotal);
			}
			this.model.NumTubes = tubes;

			// Calculate Cutting Fee
			var cutCost = (this.$('#CuttingFee').val());
			var cutSubTotal = 0;
			if (this.$('#CuttingFee').val() > 0) {
				cutSubTotal = cutCost * 1.00;

				subtotal += cutSubTotal;
				//console.log(subtotal);
			}
			this.model.CuttingFee = cutCost;

			//Format and display total
			//console.log("Closing Subtotal:" + subtotal);
			//subtotal += this.$('#CuttingFee').val();
			subtotal = parseFloat(subtotal).toFixed(2);
			this.$('.lineSubtotal').val(subtotal);
			this.model.lineSubtotal = subtotal;
		},

		addFile: function (e) {
			//files = this.model.get('files');
			//files.push(e);
			//var c = 0;
			//var i = 0;
			//_.each(files, function () {
			//	i++;
			//});
			//while (c < i) {
			//	files[c].id = c;
			//	c++;
			//}
			//this.model.set('files', files);
			files = this.model.get('files');
			_.each(e, function (fi) {
				files.push(fi)
			});
			var c = 0;
			var i = 0;
			_.each(files, function () {
				i++;
			});
			while (c < i) {
				files[c].id = c;
				c++;
			}
			this.model.set('files', files);
			this.$el.find('.confirmOrderlines').show();
			console.log(files);
		},

		saveChanges: function () {
			//console.log("Calling Save Line");

			//save values:
			//var papername = this.paperList.selected.get('name'); //commented out to test selectedPaperType
			var papername = this.model.SelectedPaperType; //testing this to see if things get saved properly. will need to replicate for papertype id and cost so that it saves properly.
			var width = (this.$('#PaperWidth').val());
			var height = (this.$('#PaperHeight').val());
			var copies = round(this.$('#ItemUnits').val(), 2);

			var numImages = (this.$("#NumImages").val());

			//var laminate = (this.$('#NumLam').val());

			var mount = (this.$('#NumBoards').val());
			var grommet = (this.$('#PaperGrommet').val());

			//Added Aug 1st, 2013
			var frame = (this.$('#NumFrame').val());
			var rhyno = (this.$('#NumRhyno').val());
			var tube = (this.$('#NumTubes').val());
			var cutfee = (this.$('#CuttingFee').val());

			//Added Aug 14th, 2014
			//var laminateMatte = (this.$('#NumLamMatte').val());

			//Added 4/6/15
			var saved_lamUnits = 0;
			var laminateHeight = (this.$('#NumLam').val());

			var saved_lamUnitsMatte = 0;
			var laminateMatteHeight = (this.$('#NumLamMatte').val());

			//Lamination Calculations Gloss 4/6/15
			var saved_flooredLamMatte = Math.floor(laminateMatteHeight / 12)
			var saved_modOfLamMatte = laminateMatteHeight % 12;

			//Lamination Calculations Matte 4/6/15
			saved_flooredLam = Math.floor(laminateHeight / 12)
			saved_modOfLam = laminateHeight % 12;

			//Converting values entered into feet units for lamination 4/6/15
			if (saved_modOfLam > 6) {
				saved_lamUnits = saved_flooredLam + 1;
			}
			else { saved_lamUnits = saved_flooredLam; }
			if (laminateHeight < 12 && laminateHeight > 0) { saved_lamUnits = 1; }

			//For Matte
			if (saved_modOfLamMatte > 6) {
				saved_lamUnitsMatte = saved_flooredLamMatte + 1;
			}
			else { saved_lamUnitsMatte = saved_flooredLamMatte; }
			if (laminateMatteHeight < 12 && laminateMatteHeight > 0) { saved_lamUnitsMatte = 1; }

			var subtotal = this.model.lineSubtotal;

			//if (width >= 0 && width <= 60 && height >= 0 && subtotal > 0) {
			if (width >= 0 && width <= 63 && height >= 0 && numImages != "") { //removing subtotal > 0 requirement, 9/15/14 adding requirement to check papertype not null 9/3
				//Check for attempts to enter an incorrect number of copies, added paper new papertypes 6/23
				if (copies > 1 && height < 30 && width < 30 && (this.model.SelectedPaperTypeId < 11 || this.model.SelectedPaperTypeID == 26 || this.model.SelectedPaperTypeID == 31 || this.model.SelectedPaperTypeID == 32)) {
					alert("Posters under 30x30 cannot have more than 1 copy. Item Units (Copies) reset to 1.")
					this.$('#ItemUnits').val(1);
					copies = 1;
				}

				//Check for attempts to enter a ridiculous number of copies, added paper new papertypes 6/23
				if (copies > 1 && height > 30 && width > 30 && (this.model.SelectedPaperTypeId < 11 || this.model.SelectedPaperTypeID == 26 || this.model.SelectedPaperTypeID == 31 || this.model.SelectedPaperTypeID == 32)) {
					if (confirm("You've entered multiple copies for valid posters")) {
						copies = this.$('#ItemUnits').val();
					}
					else {
						this.$('#ItemUnits').val(1);
						copies = 1;
					}
				}

				this.model.set({
					OrderId: 0,
					PaperTypeId: this.paperList.selected.get('id'),
					//PaperTypeName: this.paperList.selected.get('name'),
					PaperTypeName: this.model.SelectedPaperType,
					PaperCost: this.paperList.selected.get('price'),
					PaperWidth: (this.$('#PaperWidth').val()),
					PaperHeight: (this.$('#PaperHeight').val()),
					PaperUnits: this.model.PaperUnits,
					ItemUnits: (this.$('#ItemUnits').val()),
					NumImages: this.$("#NumImages").val(),
					NumLam: (saved_lamUnits),
					PaperGrommet: (this.$('#PaperGrommet').val()),
					NumBoards: (this.$('#NumBoards').val()),

					//Added Aug 1st
					NumFrame: (this.$('#NumFrame').val()),
					NumRhyno: (this.$('#NumRhyno').val()),
					NumTubes: (this.$('#NumTubes').val()),
					CuttingFee: (this.$('#CuttingFee').val()),

					//Added Aug 14th, 2014
					NumLamMatte: (saved_lamUnitsMatte),

					//Added 4/6/15
					//NumLamMatte: lamUnitsMatte,

					lineSubtotal: this.model.lineSubtotal,
				});

				// Hide inputs
				this.$el.find('.file_upload').hide();
				this.$el.find('.confirmOrderlines').hide();

				//replace values
				this.$('.paper-list').hide();
				this.$('.SelectedPaperType').val(papername);
				this.$('.PaperWidth').hide();
				this.$('.IPaperWidth').val(width);
				this.$('.PaperHeight').hide();
				this.$('.IPaperHeight').val(height);
				this.$('.ItemUnits').hide();
				this.$('.IItemUnits').val(copies);

				this.$('.NumImages').hide();
				this.$('.INumImages').val(numImages);

				this.$('.NumLam').hide();
				this.$('.INumLam').val(laminateHeight);
				this.$('.NumBoards').hide();
				this.$('.INumBoards').val(mount);
				this.$('.PaperGrommet').hide();
				this.$('.IPaperGrommets').val(grommet);

				//Added Aug 1st
				this.$('.NumFrame').hide();
				this.$('.INumFrame').val(frame);
				this.$('.NumRhyno').hide();
				this.$('.INumRhyno').val(rhyno);
				this.$('.NumTubes').hide();
				this.$('.INumTubes').val(tube);

				//Added Aug 14th
				this.$('.NumLamMatte').hide();
				this.$('.INumLamMatte').val(laminateMatteHeight);

				this.$('#CuttingFee').hide();
				this.$('#ICuttingFee').show();
				this.$('#ICuttingFee').val(cutfee);

				this.$('.ISubtotal').show();
				//this.$('.ISubtotal').val("Subtotal: $" + parseFloat(subtotal).toFixed(2));
				this.$('.ISubtotal').val("Subtotal: $" + subtotal);

				$('#completeOrder').show();
			}
			else {
				alert("Error with the orderline, one or more items are not valid, check that number of images is at least 0.");
				//Auto refresh added Aug 1st.
				//window.location.reload();
				//@One didn't like the fact the application forced a reload whenever a user's input is invalid or empty
				console.log("window.location.reload() commented out 08/14/2020 - 2/4");
			}
		}
	});

	var OrderPackFileView = Backbone.View.extend({
		tagName: 'div',
		template: _.template($('#orderPackFile-template').html()),

		events: {
			'change .pack-color': 'changed',
			'change .pack-quantity': 'changed',
		},

		initialize: function () {
			_.bindAll(this, "changed");
			this.render();
		},
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		changed: function (evt) {
			var changed = evt.currentTarget;
			var value = $(evt.currentTarget).val();
			var obj = {};
			obj[changed.id] = value;
			this.model.set(obj);
		},

		addPackFile: function (e) {
			var that = this.model;
			_.each(e, function (fi) {
				that.set('FileName', fi.name);
			});
		},
	});

	var order = new Order();
	var orderView = new OrderView({ model: order, renderid: "#Order", itemplate: "#order-template" });
	orderView.render();
});