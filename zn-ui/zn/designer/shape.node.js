(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Node";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(x, y, w, h, ctx, oid)
    {
      let component = this;
      component.$class = `${__package}.${__name}`;
      component.$type = "node";

      component.ctx = ctx;
      component.oid = oid || zn.shortid();

      component.$shape = new Konva.Group({ x: x, y: y, width: w, height: h });
      component.$shape.setAttr("zn-ctx", ctx);
      component.$shape.setAttr("zn-oid", component.oid);
      component.$shape.addName("rectangle");

      component.addHitRegion(w, h, ctx);
      component.addConnectorPoints();
      component.addShapeDetails(w, h, ctx);
      component.addText(w, h, ctx);
      component.setupEventHandlers();
    }

    addHitRegion(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let hitSize = props["connector.size"] * 2;
      let hitRegion = new Konva.Rect({
        x: -hitSize,
        y: 0,
        width: w + hitSize * 2,
        height: h,
        strokeWidth: 0,
        fill: props["hitregion.fill"]
      });
      hitRegion.addName("hit-region");
      group.add(hitRegion);
      component.hitRegion = hitRegion;
    }

    addShapeDetails(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let rect = new Konva.Rect({
        x: 0, y: 0,
        width: w, height: h,
        fill: props["rect.fill"],
        strokeWidth: 0,
        listening: false
      });
      rect.addName("rect");
      group.add(rect);
      component.rect = rect;
    }

    addText(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let offset = ((ctx.$level || 0) + 1) * props["node.level.offset"];

      let text = new Konva.Text({
        x: offset, y: 0,
        width: w - offset - 20, height: h,
        text: ctx.text,
        align: "left",
        verticalAlign: "middle",
        strokeWidth: 1,
        fontFamily: props["text.family"],
        fontSize: props["text.size"],
        fontStyle: props["text.style"],
        lineHeight: props["text.lineheight"],
        wrap: "none",
        ellipsis: true,
        shadowForStrokeEnabled: false,
        listening: false
      });
      if(props["text.stroke"]) text.stroke(props["text.color"])
      else text.fill(props["text.color"]);
      text.addName("text");
      group.add(text);
      component.text = text;
    }

    addConnectorPoints()
    {
      let component = this;
      let group = component.$shape;

      component.connectorPoints =
      {
        left: zn.designer.shape.ConnectorPoint.generateForShape(group, "left"),
        right: zn.designer.shape.ConnectorPoint.generateForShape(group, "right")
      };

      Object.values(component.connectorPoints).forEach(point => group.add(point.$shape));
    }

    updateShape(w, h)
    {
      let component = this;
      let group = component.$shape;
      let s = { width: w, height: h };

      group.setSize(s);

      let hitSize = props["connector.size"] * 2;
      component.hitRegion.size({ width: w + hitSize * 2, height: h });
      component.rect.size(s);

      component.text.size({ width: w - 20, height: h });

      zn.designer.shape.ConnectorPoint.updateForRectangularShape(component);
    }

    setText(text)
    {
      let component=this;
      component.ctx.text=text;
      component.text.text(text);
      component.$shape.getLayer().batchDraw();
    }

    setLevel(level)
    {
      let component=this;
      component.ctx.$level=level;
      let size=component.$shape.getSize();
      let offset = (level + 1) * props["node.level.offset"];
      component.text.x(offset);
      component.text.width(size.width - offset - 20);
      component.$shape.getLayer().batchDraw();
    }

    setIndex(index)
    {
      let component=this;
      component.ctx.index=index;
      component.connectorPoints.left.ctx.parent.index=index;
      component.connectorPoints.right.ctx.parent.index=index;
    }

    getRect()
    {
      let component = this;
      let size = component.$shape.getSize();
      let pos = component.$shape.getPosition();

      return { x: pos.x, y: pos.y, width: size.width, height: size.height };
    }

    setupEventHandlers()
    {
      let component = this;
      let group = component.$shape;
      group.on("mouseenter", () =>
      {
        if (!group.getParent().hasName("transform"))
          base.handleShapeHover(component);
      });
    }

    mark(state)
    {
      let component = this;
      if (state)
        component.text.stroke(props["node.mark.color"]);
      else
        component.text.stroke(props["text.color"]);
      component.$shape.getLayer().batchDraw();
    }

    destroy()
    {
      let component = this;
      component.$shape.destroy();
    }

    connectorLines()
    {
      let component = this;
      return base.getConnetorLines(component);
    }
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

