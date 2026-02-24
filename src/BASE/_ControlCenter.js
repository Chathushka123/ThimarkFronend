import React, {useCallback} from 'react'

function FrwkControlCenter(props){

    const handlePopulate = useCallback((event) => {
        let dataList = {
            action: "POPULATE",
            data: {}
        }
        if (typeof props.item.event.onPopulate !== 'undefined') {
            dataList = props.item.event.onPopulate(event, (data) => {
                dataList = data
                
                let length = Object.keys(dataList).length
                if (length > 0) {
                    resetData(props.item.schema.controllerObject)
                    readAndApplyData(props.item.schema.controllerObject, dataList, "POPULATED")
                }
                props.item.state.populated = true
                props.item.state.modified = false
                props.item.state.new = false
                props.item.state.deleted = false
                props.item.schema.controllerObject["CONTROL_CENTER"].renderFunction()
            })
 
        } else {
            props.item.state.populated = true
            props.item.state.modified = false
            props.item.state.new = false
            props.item.state.deleted = false
            props.item.schema.controllerObject["CONTROL_CENTER"].renderFunction()
        }
 
    }, [])

    const handleSave = (event) => {
        let dataArr
        if(props.item.state.deleted){
            dataArr = {action: "DELETE",
            data: retrieveData(props.item.schema.controllerObject)}
        }
        else if(props.item.state.new){
            dataArr = {action: "NEW",
            data: retrieveData(props.item.schema.controllerObject)}
        }
        else if(props.item.state.modified){
            dataArr = {action: "MODIFY",
            data: retrieveData(props.item.schema.controllerObject)}
        }
        let receieveArr = {}
        if(typeof props.item.event.onSave !=='undefined') 
        {
            props.item.event.onSave(event, dataArr, (data)=>{
                receieveArr = data
                if(typeof receieveArr !== "undefined"){
                    if((typeof receieveArr.success === "undefined")||(receieveArr.success)){
                        //resetData(props.item.schema.controllerObject)
                        //readAndApplyData(props.item.schema.controllerObject, receieveArr, "POPULATED")
                        props.item.state.populated = true
                        props.item.state.modified = false
                        props.item.state.new = false
                        props.item.state.deleted = false
                        props.item.schema.controllerObject["CONTROL_CENTER"].renderFunction()
                    }
                }
            })
            
            // if(typeof receieveArr !== "undefined"){
            //     if((typeof receieveArr.success === "undefined")||(receieveArr.success)){
            //         resetData(props.item.schema.controllerObject)
            //         readAndApplyData(props.item.schema.controllerObject, receieveArr, "POPULATED")
            //         props.item.state.populated = true
            //         props.item.state.modified = false
            //         props.item.state.new = false
            //         props.item.state.deleted = false
            //         props.item.schema.controllerObject["CONTROL_CENTER"].renderFunction()
            //     }
            // }
        }

    }

    const handleNew = (event) => {
        let dataArr = {action: "NEW"}
        let receieveArr = {}
        if(typeof props.item.event.onNew !=='undefined') 
        {
            receieveArr = props.item.event.onNew(event, dataArr)
        }
        if(typeof receieveArr !== "undefined"){
            resetData(props.item.schema.controllerObject)
            readAndApplyData(props.item.schema.controllerObject, receieveArr, "NEW")
        }

        props.item.state.populated = false
        props.item.state.new = true
        props.item.state.modified = false
        props.item.state.deleted = false
        props.item.schema.controllerObject["CONTROL_CENTER"].renderFunction()
    }

    const handleRefresh = (event) => {

        refreshData(props.item.schema.controllerObject)

        if(typeof props.item.event.onRefresh !=='undefined') 
        {
            props.item.event.onRefresh(event)
        }

        props.item.state.modified = false
        props.item.state.new = false
        props.item.state.deleted = false
        props.item.schema.controllerObject["CONTROL_CENTER"].renderFunction()
    }

    const handleDelete = (event) => {
        let dataArr = {action: "DELETE",
            data: _deleteKeys(props.item.schema.controllerObject)}
        if(typeof props.item.event.onDelete !=='undefined') 
        {
            props.item.event.onDelete(event, dataArr)
        }
        props.item.state.deleted = true
        props.item.state.new = false
        props.item.schema.controllerObject["CONTROL_CENTER"].renderFunction()
    }

    const populate = (dataList) =>{
        if(typeof dataList !== "undefined"){
            props.item.state.populated = true
            props.item.state.modified = false
            props.item.state.new = false
            props.item.state.deleted = false

            resetData(props.item.schema.controllerObject)
            readAndApplyData(props.item.schema.controllerObject, dataList, "POPULATED")
            props.item.schema.controllerObject["CONTROL_CENTER"].renderFunction()
        }
    }

    function renderControlButtons(){
        let controller = props.item.schema.controllerObject["CONTROL_CENTER"]
        if(controller.renderSaveButton)
            controller.renderSaveButton()

        if(controller.renderRefreshButton)
            controller.renderRefreshButton()

        if(controller.renderDeleteButton)
            controller.renderDeleteButton()
    }

    props.item.event.__onPopulate = handlePopulate
    props.item.event.__onSave = handleSave
    props.item.event.__onNew = handleNew
    props.item.event.__onRefresh = handleRefresh
    props.item.event.__onDelete = handleDelete
    props.item.resetData = resetData
    props.item.populate = populate
    props.item.schema.controllerObject["CONTROL_CENTER"].renderControlButtons = renderControlButtons

    return (
        <>
        <div>
            {props.children}
        </div>
    </>)
}


function _deleteKeys(itemList){

    let dataArr = {}
    //dataArr[itemList["my_text_box"].data.sqlcolumn] = itemList["my_text_box"].data.value
    
    return dataArr
}


function retrieveData(itemList){

    let dataArr = {}
    Object.keys(itemList).map(function(key, index, arr) {
        if(typeof itemList[key].data !== "undefined") {
            if(itemList[key].objectType === "Grid"){

                dataArr[itemList[key].controller.name] = {type: "Grid", data: itemList[key].data}

                //itemList[key].sameData = (typeof itemList[key].sameData ==='undefined' ? false : !itemList[key].sameData)
                //alert("Implement refresh for Grid")
            }
            else{
                dataArr[itemList[key].data.sqlcolumn] = itemList[key].data.value
            }
        }
    })
    return dataArr
}

function refreshData(itemList){

    Object.keys(itemList).map(function(key, index, arr) {
        if(typeof itemList[key].data !== "undefined") {
            if(itemList[key].objectType === "Grid"){

                //alert("Implement refresh for Grid")
                //itemList[key].data = dataList[key].data
                //itemList[key].sameData = (typeof itemList[key].sameData ==='undefined' ? false : !itemList[key].sameData)
            }
            else{
                itemList[key].data.value = itemList[key].data.oldValue
            }
        }
    })
    
}



function resetData(itemList){

    Object.keys(itemList).map(function(key, index, arr) {
        if(typeof itemList[key].data !== "undefined") {
            if(itemList[key].objectType === "Grid"){
                itemList[key].resetHeader()

                //alert("Implement refresh for Grid")
                //itemList[key].data = dataList[key].data
                //itemList[key].sameData = (typeof itemList[key].sameData ==='undefined' ? false : !itemList[key].sameData)
            }
            else{
                itemList[key].data.value = ""
            }
        }
    })
    
}

function readAndApplyData(itemList, dataList, action){
    Object.keys(itemList).map(function(key, index, arr) {
        
        if(itemList[key].objectType === "Grid"){

            if(typeof dataList[key] !== 'undefined'){
                if(typeof dataList[key].columns !== 'undefined')
                {
                    itemList[key].setColumns(dataList[key].columns)
                    //itemList[key].sameColumns = (typeof itemList[key].sameColumns ==='undefined' ? false : !itemList[key].sameColumns)
                }
                //itemList[key].data = []

                itemList[key].setData([...dataList[key].data])

                if(action === "POPULATED"){
                    Object.keys(itemList[key].data).map((object, index) => {
                        itemList[key].data[index]["_rowstate"] = "POPULATED"
                    })
                }
            }
            itemList[key].resetFilterData()
        }
        else{
            if((typeof itemList[key].data !== "undefined") && (typeof dataList[itemList[key].data.sqlcolumn.toLowerCase()] !== "undefined"))
            {
                itemList[key].data.value = dataList[itemList[key].data.sqlcolumn.toLowerCase()]
                itemList[key].data.oldValue = itemList[key].data.value
            }
            else if ((typeof itemList[key].data !== "undefined"))
            {
                itemList[key].data.value = ""
                itemList[key].data.oldValue = ""
            }
        }
    })
    
}

export default FrwkControlCenter