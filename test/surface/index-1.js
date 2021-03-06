$(()=>
{
  let surfaceFactory=zn.designer.surface;
  let surface=surfaceFactory.create({
    target: ".surface"
  });
  surface.init();

  /*let assign=new zn.designer.shape.Rectangle(100,100,100,50, {name:"assign", text: "Assign"});
  surface.addShape(assign);

  let translate=new zn.designer.shape.Rectangle(100,200,100,50, {name: "translate", text: "Translate"});
  surface.addShape(translate);

  let invoke=new zn.designer.shape.Rectangle(100,300,150,50, {name: "invoke", text: "Invoke the target service"});
  surface.addShape(invoke);

  surface.addShape(new zn.designer.shape.Ellipse(100,400,70,70, {name: "receive", text: "Receive"}));
  surface.addShape(new zn.designer.shape.Ellipse(100,500,70,70, {name: "return", text: "Return"}));

  let check=new zn.designer.shape.Diamond(300,100,80,80, {name:"check", text: "Check"});
  surface.addShape(check);
  
  let ca=new zn.designer.shape.Diamond(300,200,80,80, {name: "case", text: "Case"});
  surface.addShape(ca);
  
  let sw=new zn.designer.shape.Diamond(300,300,90,90, {name: "switch", text: "Switch On Status"});
  surface.addShape(sw);

  surface.addShape(new zn.designer.shape.Pill(500,100,100,40, {name:"concat", text: "Concat"}));
  surface.addShape(new zn.designer.shape.Pill(500,200,110,40, {name:"copy", text: "Copy"}));
  surface.addShape(new zn.designer.shape.Pill(500,300,100,40, {name:"filter", text: "Filter"}));
  surface.addShape(new zn.designer.shape.Pill(500,400,100,40, {name:"reduce", text: "Reduce"}));

  let person=
  [
    {text: "ID"}, {text: "Name"},
    {text: "Address", $list: [{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}]},
    {text: "Contact Details", $list: [{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}]}
  ];
  let listPerson=new zn.designer.shape.List(700, 300, 150, 40, {name: "person", text: "PERSON", list: person});
  surface.addShape(listPerson);
  
  let address=[{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}];
  let listAddress=new zn.designer.shape.List(1000, 300, 150, 40, {name: "address", text: "ADDRESS", list: address});
  surface.addShape(listAddress);

  let contact=[{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}];
  let listContact=new zn.designer.shape.List(1000, 500, 150, 40, {name: "contact", text: "CONTACT", list: contact});
  surface.addShape(listContact);*/

  surface.on("rel-create", (evt)=>console.log("rel-create :", evt.from, "=>", evt.to));
  surface.on("rel-select", (evt)=>console.log("rel-select :", evt.rel));
  surface.on("obj-select", (evt)=>console.log("obj-select :", evt.obj));
  surface.on("selection-set-change", (evt)=>console.log("selection :", evt.selection));
  surface.on("position-object", (evt)=>surface.shapeActions[surface.shapeAction](evt));
  surface.on("delete", (evt)=>console.log("delete", evt));

  surface.shapeCount=0;
  surface.shapeActions={};
  surface.shapeActions["add-rect"]=(evt)=>
  {
    let ctx={name: "shape-"+(surface.shapeCount++), text: "Invoke"};
    surface.addShape("rectangle", {x: evt.x - 50, y: evt.y - 25, width: 100, height: 50}, ctx);
  }

  surface.shapeActions["add-receive"]=(evt)=>
  {
    let ctx={name: "shape-"+(surface.shapeCount++), text: "Receive"};
    surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
  }

  surface.shapeActions["add-return"]=(evt)=>
  {
    let ctx={name: "shape-"+(surface.shapeCount++), text: "Return"};
    surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
  }

  surface.shapeActions["add-pill"]=(evt)=>
  {
    let ctx={name: "shape-"+(surface.shapeCount++), text: "Assign"};
    surface.addShape("pill", {x: evt.x - 50, y: evt.y - 20, width: 100, height: 40}, ctx);
  }

  surface.shapeActions["add-diamond"]=(evt)=>
  {
    let ctx={name: "shape-"+(surface.shapeCount++), text: "Check"};
    surface.addShape("diamond", {x: evt.x - 45, y: evt.y - 45, width: 90, height: 90}, ctx);
  }

  surface.shapeActions["add-var-person"]=(evt)=>
  {
    let list=
    [
      {text: "ID"}, {text: "Name"},
      {text: "Address", $list: [{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}]},
      {text: "Contact Details", $list: [{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}]}
    ];
    let ctx={name: "shape-"+(surface.shapeCount++), text: "PERSON", list: list};
    surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  surface.shapeActions["add-var-address"]=(evt)=>
  {
    let list=[{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}];
    let ctx={name: "shape-"+(surface.shapeCount++), text: "ADDRESS", list: list};
    surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  surface.shapeActions["add-var-contact"]=(evt)=>
  {
    let list=[{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}];
    let ctx={name: "shape-"+(surface.shapeCount++), text: "CONTACT", list: list};
    surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  let exportBtn=zn.ui.components.button.create({
    name: "exportBtn",
    target: ".export-btn",
    text: "Export",
    action: "export"
  });
  exportBtn.on("action", (evt)=>
  {
    console.log(surface.exportToJson());
  });
  exportBtn.init();

  let importBtn=zn.ui.components.button.create({
    name: "importBtn",
    target: ".import-btn",
    text: "Import",
    action: "import"
  });
  importBtn.on("action", (evt)=>
  {
    surface.importFromJson($(".import-data").html());
  });
  importBtn.init();

  let shapeBtnAction=(evt)=>
  {
    surface.shapeAction=evt.action;
    surface.setMode("position");
  }

  let btns=[
    {name: "rect", target: ".shape-btn-1", text: "Invoke", action: "add-rect"},
    {name: "receive", target: ".shape-btn-2", text: "Receive", action: "add-receive"},
    {name: "return", target: ".shape-btn-3", text: "Return", action: "add-return"},
    {name: "pill", target: ".shape-btn-4", text: "Assign", action: "add-pill"},
    {name: "diamond", target: ".shape-btn-5", text: "Check", action: "add-diamond"},
    {name: "varperson", target: ".shape-btn-6", text: "Var Person", action: "add-var-person"},
    {name: "varaddress", target: ".shape-btn-7", text: "Var Address", action: "add-var-address"},
    {name: "varcontact", target: ".shape-btn-8", text: "Var Contact", action: "add-var-contact"}
  ]
  btns.forEach((btn)=>
  {
    let zbbtn=zn.ui.components.button.create(btn);
    zbbtn.on("action", shapeBtnAction);
    zbbtn.init();
  })

})

