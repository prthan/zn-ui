(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Rectangle";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  let Component=function(x, y, w, h, ctx)
  {
    let component=this;
    component.ctx=ctx;
    component.$shape=new Konva.Group({x: x, y: y, width: w, height: h, draggable: true});
    component.$shape.setAttr("zn-ctx", ctx);
    component.$shape.addName("rectangle");

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

    let rect=new Konva.Rect({
      x: 0.5, y: 0.5, 
      width: w, height: h, 
      fill: props["rect.fill"], 
      stroke: props["rect.stroke"],
      strokeWidth: 3,
      cornerRadius: 5,
      listening: false
    });
    rect.addName("rect");
    group.add(rect);
    component.rect=rect;
  }

  Component.prototype.addSelectArea=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let size=props["shape.select.offset"];
    let selection=new Konva.Rect({
      x: -size + 0, 
      y: -size + 0, 
      width: w + size * 2, 
      height: h + size * 2,
      fill: props["shape.select.fill"],
      strokeWidth: props["shape.select.stroke.size"],
      stroke: props["shape.select.stroke"],
      dash: [4 , 4],
      visible: false,
      listening: false,
      cornerRadius: 5
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
    component.rect.size(s);
    
    let offset=props["shape.select.offset"];
    component.selection.size({width: w + offset * 2, height: h + offset * 2});

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

