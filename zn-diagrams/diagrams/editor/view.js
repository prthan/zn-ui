(function(window)
{
  let __package = "diagrams.view";
  let __name = "Editor";

  class View extends zn.Base
  {
    constructor(options)
    {
      super(options);
      this.toolActions=
      [
        {icon: "rect.png", action: "add-rectangle", descr: "Rectangle", text: "Rectangle"},
        {icon: "ellipse.png", action: "add-ellipse", descr: "Ellipse", text: "Ellipse"},
        {icon: "diamond.png", action: "add-diamond", descr: "Diamond", text: "Diamond"},
        {icon: "pill.png", action: "add-pill", descr: "Pill", text: "Pill"},
        {icon: "list.png", action: "add-list", descr: "List", text: "List"}
      ],
      this.shapeCount=0;
      this.shapeProperties=
      {
        "rectangle": ["NAME", "X", "Y", "WIDTH", "HEIGHT", "TEXT", "SUBTEXT"],
        "ellipse": ["NAME", "X", "Y", "WIDTH", "HEIGHT", "TEXT"],
        "pill": ["NAME", "X", "Y", "WIDTH", "HEIGHT", "TEXT"],
        "diamond": ["NAME", "X", "Y", "WIDTH", "HEIGHT", "TEXT"],
        "stage": ["WIDTH", "HEIGHT"],
        "list": ["NAME", "X", "Y", "WIDTH", "TEXT"]
      }
      this.propertySheet=
      {
        name: null,
        properties: null
      }
      this.selected={obj: null, stage: null};
    }

    init()
    {
      let view=this;
      view.setupUI();
      view.setupEventHandlers();
      view.loadWS();
    }
    
    setupUI()
    {
      let view=this;
      view.surface=zn.designer.Surface.get("surface");
    }

    setupEventHandlers()
    {
      let view=this;

      $(".property-sheets").on("change", "[data-property-group='rect'] input", (evt)=>view.updateObjectRect());
      $(".property-sheets").on("change", "[data-property-group='text'] input, [data-property-group='text'] textarea", (evt)=>view.updateObjectText());
      $(".property-sheets").on("change", "[data-property='name'] input", (evt)=>view.updateObjectName());
      $(".property-sheets").on("change", "[data-property-group='stage'] input", (evt)=>view.updateStageRect());

      $(".list-editor").on("click", ".list-item", (evt)=>
      {
        $(".list-editor .list-item.selected").removeClass("selected");
        let $listItem=$(evt.currentTarget);
        $listItem.addClass("selected");
      });

      view._saveWS=zn.utils.debounce(()=>view.saveWS(), 600);
    }

    loadWS()
    {
      let view=this;
      
      let diagram=window.localStorage.getItem("/zn/diagrams/diagram");

      if(diagram) view.diagram=JSON.parse(diagram);
      else
      {
        view.diagram={name: "Untitled", data: "{}", createdOn: new Date().getTime(), lastUpdatedOn: new Date().getTime()};
        window.localStorage.setItem("/zn/diagrams/diagram", JSON.stringify(view.diagram));
      }
      view.surface.importFromJson(view.diagram.data);
    }

    saveWS()
    {
      let view=this;
      view.diagram.data=view.surface.exportToJson();
      view.diagram.lastUpdatedOn=new Date().getTime();
      window.localStorage.setItem("/zn/diagrams/diagram", JSON.stringify(view.diagram));
    }

    onToolAction($event, action)
    {
      let view=this;
      $event.preventDefault();
      view.toolAction=action;
      view.surface.setMode("position");
    }
    
    onSurfacePosition($event)
    {
      let view=this;
      view[view.toolAction]($event);
    }

    onStageSelect()
    {
      let view=this;
      view.selected={stage: "Y"};
      view.showPropertiesForStage();
    }

    showPropertiesForStage()
    {
      let view=this;
      let stage=view.surface.stage;
      view.propertySheet.properties=view.shapeProperties["stage"];
      $(`.properties-list [data-property='stage-width'] input`).val(Math.round(stage.width()));
      $(`.properties-list [data-property='stage-height'] input`).val(Math.round(stage.height()));
      view.apply();
    }

    updateStageRect()
    {
      let view=this;
      view.surface.setSize(parseInt($(`.properties-list [data-property='stage-width'] input`).val()),
                           parseInt($(`.properties-list [data-property='stage-height'] input`).val()));
      view._saveWS();
    }

    onObjectSelect($event)
    {
      let view=this;
      view.selected={obj: $event.obj};
      view.showPropertiesForObject($event.obj);
    }

    onObjectRectUpdate($event)
    {
      let view=this;
      if(view.selected && view.selected.obj && view.selected.obj.oid==$event.obj.oid) view.showPropertiesForObject($event.obj);
      view._saveWS();
    }

    showPropertiesForObject(obj)
    {
      let view=this;
      let shapeComponent=view.surface.getShapeComponent(obj.oid);
      let rect=shapeComponent.getRect();
      view.propertySheet.properties=view.shapeProperties[shapeComponent.$type];

      $(`.properties-list [data-property='name'] input`).val(shapeComponent.ctx.name);
      Object.keys(rect).forEach((key)=>$(`.properties-list [data-property='${key}'] input`).val(Math.round(rect[key])));
      $(`.properties-list [data-property='text'] input`).val(shapeComponent.ctx.text);
      if(shapeComponent.$type=="rectangle") $(`.properties-list [data-property='subtext'] textarea`).val(shapeComponent.ctx.subtext);
      view.apply();
    }

    onSelectionChange($event)
    {
      console.log($event);
    }

    updateObjectRect()
    {
      let view=this;
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      let rect={x:0, y:0, width: 0, height: 0};
      Object.keys(rect).forEach((key)=>rect[key]=parseInt($(`.properties-list [data-property='${key}'] input`).val()));
      shapeComponent.setRect(rect);
      view._saveWS();
    }

    updateObjectText()
    {
      let view=this;
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      shapeComponent.setText($(`.properties-list [data-property='text'] input`).val());
      if(shapeComponent.$type=="rectangle") shapeComponent.setSubText($(`.properties-list [data-property='subtext'] textarea`).val());
      view._saveWS();
    }

    updateObjectName()
    {
      let view=this;
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      shapeComponent.ctx.name=$(`.properties-list [data-property='name'] input`).val();
      view._saveWS();
    }

    listItemUpdate($event)
    {
      let view=this;
      let index=parseInt($event.source.attr("data-index"));
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      shapeComponent.setNodeText(index, $event.newValue);
      view._saveWS();
    }

    listItemUp()
    {
      let $selectedItem=$(".list-editor .list-item.selected");
      if($selectedItem.get().length==0) return;

      let view=this;
      let index=parseInt($selectedItem.attr("data-index"));
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      shapeComponent.moveNodeUp(index);
      view._saveWS();
    }

    listItemDown()
    {
      let $selectedItem=$(".list-editor .list-item.selected");
      if($selectedItem.get().length==0) return;

      let view=this;
      let index=parseInt($selectedItem.attr("data-index"));
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      shapeComponent.moveNodeDown(index);
      view._saveWS();
    }

    listItemLevelOut()
    {
      let $selectedItem=$(".list-editor .list-item.selected");
      if($selectedItem.get().length==0) return;

      let level=parseInt($selectedItem.attr("data-level"));
      if(level==0) return;

      let view=this;
      let index=parseInt($selectedItem.attr("data-index"));
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      shapeComponent.setNodeLevel(index, --level);
      view._saveWS();
    }

    listItemLevelIn()
    {
      let $selectedItem=$(".list-editor .list-item.selected");
      if($selectedItem.get().length==0) return;

      let view=this;
      let level=parseInt($selectedItem.attr("data-level"));
      let index=parseInt($selectedItem.attr("data-index"));
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      shapeComponent.setNodeLevel(index, ++level);
      view._saveWS();
    }

    listItemAdd()
    {
      let index=null;
      let $selectedItem=$(".list-editor .list-item.selected");
      if($selectedItem.get().length!=0) index=parseInt($selectedItem.attr("data-index"))+1;
      
      let view=this;
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      shapeComponent.insertNode({text: "[Text]", $level: 0}, index);
      view._saveWS();
    }

    listItemDelete()
    {
      let $selectedItem=$(".list-editor .list-item.selected");
      if($selectedItem.get().length==0) return;

      let view=this;
      let index=parseInt($selectedItem.attr("data-index"));
      let shapeComponent=view.surface.getShapeComponent(view.selected.obj.oid);
      shapeComponent.deleteNode(index);
      view._saveWS();
    }

    downloadAsPNG($event)
    {
      $event.preventDefault();
      let view=this;
      
      var dataURL=view.surface.getImageData();
      $(".download-trigger").attr("href", dataURL);
      window.setTimeout(()=>
      {
        $(".download-trigger").get()[0].click();
      },10);      
    }

    importDiagram($event)
    {
      $event.preventDefault();
      let view=this;
      view.surface.importFromJson($(".import-data").html());
      view.saveWS();
    }

    ["add-rectangle"](evt)
    {
      let view=this;
      let ctx={name: "shape-"+(view.shapeCount++), text: "[Text]"};
      let oid=view.surface.addShape("rectangle", {x: evt.x - 50, y: evt.y - 25, width: 100, height: 50}, ctx);
    }

    ["add-ellipse"](evt)
    {
      let view=this;
      let ctx={name: "shape-"+(view.shapeCount++), text: "[Text]"};
      view.surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
    }

    ["add-pill"]=(evt)=>
    {
      let view=this;
      let ctx={name: "shape-"+(view.shapeCount++), text: "[Text]"};
      view.surface.addShape("pill", {x: evt.x - 50, y: evt.y - 20, width: 100, height: 40}, ctx);
    }

    ["add-diamond"]=(evt)=>
    {
      let view=this;
      let ctx={name: "shape-"+(view.shapeCount++), text: "[Text]"};
      view.surface.addShape("diamond", {x: evt.x - 45, y: evt.y - 45, width: 90, height: 90}, ctx);
    }

    ["add-list"]=(evt)=>
    {
      let view=this;
      let list=[{text: "[Text]"}, {text: "[Text]"}, {text: "[Text]"}, {text: "[Text]"}]
      let ctx={name: "shape-"+(view.shapeCount++), text: "[Header Text]", list: zn.designer.Utils.flattenList(list)};
  
      view.surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 50}, ctx);
    }

  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = View;

})(window);

