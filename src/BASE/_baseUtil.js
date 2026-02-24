
import React from 'react'

function DraggableObject(props){
    function onDragStart(event) {
      event.dataTransfer.setData('text/plain', event.target.id);
    }
  
    function onDropOverParent(event){
      //event.currentTarget.style.backgroundColor = 'white'
    }
  
    return (<span className="draggable-object" id={props.id} draggable={true} onDragStart={onDragStart} onDragEnd={onDropOverParent}>{props.object}</span>)
  }
  
  export function DropZone(props){
  
      function onDragOver(event) {
          event.preventDefault();
        }
  
        function onDrop(event) {
          console.log(event.dataTransfer.getData('text'))
          const id = event.dataTransfer.getData('text');
        
          const draggableElement = document.getElementById(id);
          const dropzone = event.target;
        
          dropzone.appendChild(draggableElement);
        
          event.dataTransfer.clearData();
        }
      return (<div className={props.className} onDragOver={onDragOver} onDrop={onDrop}></div>)
  }

export function getObjectList(componentList){

    const list={};
    for (var key in componentList){
        list[componentList[key].name]= componentList[key]
    }
    return list
}

export function getValue(componentList, name){
    let value = ""
    switch(componentList[name].objectType){
        case "TextBox":
            if(typeof componentList[name].data.value !== 'undefined')
                value = componentList[name].data.value
            break
        case "Label":
            value = componentList[name].schema.value
            break
        default:
    }
    return value
}


export function setValue(componentList, name, value){
    switch(componentList[name].objectType){
        case "TextBox":
            if(typeof componentList[name].data.value !== 'undefined')
                componentList[name].data.value = value
            break
        case "Label":
            componentList[name].schema.value = value
            break
        default:
    }
}

export function retrieveDataJSON(componentList){

    var dataJson = componentList.map(item => item.data).filter(item => (typeof item !== "undefined"))
    
    dataJson = dataJson.reduce(function(json, item, index){ 
        if(index === 1)
            json = {[json.sqlcolumn]:json.value}
        return Object.assign(json, {[item.sqlcolumn]:item.value}) 
    }) 
    
    return dataJson;
}

export function populateForm(dataList, componentList){
    componentList.map(function(key, value) {
        if((typeof componentList[key].data !== "undefined") && (typeof dataList[componentList[key].data.sqlcolumn] !== "undefined"))
        {

            componentList[key].data.value = dataList[componentList[key].data.sqlcolumn]
        }
        else if ((typeof componentList[key].data !== "undefined"))
        {
            componentList[key].data.value = ""
        }
    })

}

export default DraggableObject