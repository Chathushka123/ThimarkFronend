import React, { useState}from "react"
import '../_css/_contextMenu.css'

function FrwkContextMenu(props){
    let [show, setShow] = useState("")
    let [menuStatus, setMenuStatus] = useState({})

    let onClick = {}
    
    let [rendered, setRendered] = useState(true)

    function reRender(){
        setRendered(!rendered)
    }

    function getShow(){
        return show
    }

     if(typeof props.functions !== 'undefined'){
         props.functions.handleClick = handleClick
     }
    function handleClick(event, currentMenuStatus) {
        setMenuStatus(currentMenuStatus)
        setShow("show")
        reRender()
    }
    function handleMouseLeave() {
        setShow("")
        reRender()
    }

    function getMenuItems(){
        let menu = props.children
        
        if(typeof props.menuItems !== 'undefined'){
            menu = Object.keys(props.menuItems.items).map((name) => {
            if(typeof props.menuItems.items[name].id !== 'undefined')
                {
                    let menuItem = <></>
                    if(typeof menuStatus !== 'undefined'){
                        if(menuStatus[name]!==false)
                            menuItem = <a id={props.menuItems.items[name].id} onClick={handleMenuClick}>{props.menuItems.items[name].displayText}</a>
                    }
                    else{
                        menuItem = <a id={props.menuItems.items[name].id} onClick={handleMenuClick}>{props.menuItems.items[name].displayText}</a>
                    }
                    return menuItem
                    //return <a id={props.menuItems.items[name].id} onClick={handleMenuClick}>{props.menuItems.items[name].displayText}</a>
                }
            })
            menu = <div >{menu}
            </div>
        }
        return menu
    }

    function handleMenuClick(event){
        //alert("Click in Menu Click")
        if(typeof props.menuItems.items[event.target.id] !== "undefined"){
            if(typeof props.menuItems.items[event.target.id].event.onClick !== "undefined")
                props.menuItems.items[event.target.id].event.onClick(event, props.itemId, event.target.id)
        }
    }

    if(typeof props.onRenderMenu !=='undefined'){
        onClick = props.onRenderMenu
    }
    else{
        onClick = handleClick
    }

    function getChildren(){
        return getMenuItems()
    }
    // function MoveseEnter(){
        
    // }
    // let MoveseEnter ={};
    // if(typeof props.onHover !=='undefined'){
    //     MoveseEnter = props.onHover
    // }
    
    return(
        <>
            {<div id={props.id} className={"menu"} onMouseEnter={onClick} onClick={onClick} onMouseLeave={handleMouseLeave}>{props.component}
            <div className={"menu-content " + show} id="myPopup">{getChildren()}</div>
            </div>}
        </>
    )
}

function handleView(){

}

export function FrwkMenuItem(props){
    return (<a onClick={handleView}>{props.description}</a>)
}

export default FrwkContextMenu