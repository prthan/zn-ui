(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Ellipse";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  let Component=function(x, y, w, h, ctx)
  {
    let component=this;
    component.ctx=ctx;
    component.$shape=new Konva.Group({x: x, y: y, width: w, height: h, draggable: true});
    component.$shape.setAttr("zn-ctx", ctx);
    component.$shape.addName("ellipse");


    component.addHitRegion(w, h, ctx);
    component.addSelectArea(w, h, ctx);
    component.addConnectorPoints();
    component.addShapeDetails(w, h, ctx);
    component.addText(w, h, ctx);
    component.setupEventHandlers();
  }

  Component.prototype.addHitRegion=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let hitSize=props["connector.size"] * 2;
    let hitRegion=new Konva.Rect({
      x: -hitSize + 0.5, 
      y: -hitSize + 0.5, 
      width: w + hitSize * 2, 
      height: h + hitSize * 2,
      strokeWidth: 0,
      fill: props["hitregion.fill"]
    });
    hitRegion.addName("hit-region");
    group.add(hitRegion);
    component.hitRegion=hitRegion;
  }

  Component.prototype.addShapeDetails=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let ellipse=new Konva.Ellipse({
      x: w/2 + 0.5, y: h/2 + 0.5, 
      radius: {x: w/2, y: h/2},
      fill: props["ellipse.fill"], 
      stroke: props["ellipse.stroke"],
      strokeWidth: 3,
      listening: false
    });
    ellipse.addName("ellipse");
    group.add(ellipse);
    component.ellipse=ellipse;
  }

  Component.prototype.addSelectArea=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let size=props["shape.select.offset"];
    let selection=new Konva.Ellipse({
      x: w/2 + 0.5, y: h/2 + 0.5, 
      radius: {x: w/2 + size, y: h/2 +  size },
      fill: props["shape.select.fill"],
      stroke: props["shape.select.stroke"],
      strokeWidth: props["shape.select.stroke.size"],
      dash: [4 , 4],
      visible: false,
      listening: false
    });

    selection.addName("selection");
    group.add(selection);
    component.selection=selection;
  }
    
  Component.prototype.addText=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    if(!component.ctx.text) return;

    let text=new Konva.Text({
      x: 0, y: 0, 
      width: w, height: h, 
      stroke: props["text.color"],
      text: ctx.text,
      align: "center",
      verticalAlign: "middle",
      strokeWidth: 1,
      fontFamily: props["text.family"],
      fontSize: props["text.size"],
      fontStyle: props["text.style"],
      lineHeight: props["text.lineheight"],
      shadowForStrokeEnabled: false,
      listening: false
    });
    text.addName("text");
    group.add(text);
    component.text=text;
  }

  Component.prototype.addConnectorPoints=function()
  {
    let component=this;
    let group=component.$shape;

    component.connectorPoints=zn.designer.shape.ConnectorPoint.generateForRectangularShape(group);
    Object.values(component.connectorPoints).forEach(point=>group.add(point.$shape));
  }

  Component.prototype.updateShape=function(w, h)
  {
    let component=this;
    let group=component.$shape;
    let s={width: w, height: h};

    group.setSize(s);

    let hitSize=props["connector.size"] * 2;
    component.hitRegion.size({width: w + hitSize * 2, height: h + hitSize * 2});

    component.ellipse.position({x:  w/2 + 0.5, y: h/2 + 0.5});
    component.ellipse.radius({x: w/2, y: h/2});
    
    let offset=props["shape.select.offset"];
    component.selection.position({x:  w/2 + 0.5, y: h/2 + 0.5});
    component.selection.radius({x: w/2 + offset, y: h/2 +  offset});

    component.text.size(s);

    zn.designer.shape.ConnectorPoint.updateForRectangularShape(component);
  }

  Component.prototype.setupEventHandlers=function()
  {
    let component=this;
    let group=component.$shape;

    group.on("dragend", ()=>base.handleShapeDragEnd(component));
    group.on("dragmove", ()=>base.handleShapeDragMove(component));
    group.on("mouseenter", ()=>base.handleShapeHover(component));
    group.on("click", ()=>base.handleShapeClick(component));
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);
