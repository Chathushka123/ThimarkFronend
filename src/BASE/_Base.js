import React, {useState} from 'react'
import {PopUp, ContextMenu} from './Components'
import SweetAlert from 'react-bootstrap-sweetalert'
import { readBuilderProgram } from 'typescript'


function DraggableObject(props){    
    let functions = {}
    let menuStatus
    let menu = Object.keys(props.menuItems.items).map((name) => {
    if(typeof props.menuItems.items[name].id !== 'undefined')
        {
            let menuItem = <></>
            if(typeof menuStatus !== 'undefined'){
                if(menuStatus[name]!==false)
                    menuItem = <a id={props.menuItems.items[name].id} onClick={handleClick}>{props.menuItems.items[name].displayText}</a>
            }
            else{
                menuItem = <a id={props.menuItems.items[name].id} onClick={handleClick}>{props.menuItems.items[name].displayText}</a>
            }
            return menuItem
        }
    })
    function onDragStart(event) {
        let dataJson = [event.target.id, props.index, props.lineIndex]
      event.dataTransfer.setData('text/plain', JSON.stringify(dataJson));
    }

  
    function onDropOverParent(event){
        
    }  

    function clickSpan(event){
        menu = <a id={"CustomID"} onClick={handleClick}>{"CustomDisplayText"}</a>
        //alert("Clicked in span")
    }
    let draggableSpan =  <span id={props.id} onClick={clickSpan} className={props.className} draggable={true} onDragStart={onDragStart} onDragEnd={onDropOverParent}>{props.object}</span>     

    let hybrid = 
        <ContextMenu component={draggableSpan} itemId={props.id} menuItems={props.menuItems} menuStatus={props.menuStatus} functions={functions} onRenderMenu={handleRenderMenu}>
            <div >
                {menu}
            </div>
        </ContextMenu>



function handleRenderMenu(event){
    
    let menuStatus
    if(typeof props.event !== "undefined"){
        if(typeof props.event.onRenderMenu !== "undefined")
            menuStatus = props.event.onRenderMenu(event, props.id, props.item)
    }
    functions.handleClick(event, menuStatus)
}

function handleClick(event, currentMenuStatus){
    menuStatus = currentMenuStatus
    if(typeof props.menuItems.items[event.target.id] !== "undefined"){
        props.menuItems.items[event.target.id].event.onClick(event, props.id, event.target.id)
    }
}
    function handleView(event){
        if(typeof props.event.onViewJobCard !== "undefined"){
            props.event.onViewJobCard(event, props.id)
        }
    }
    function handleIssue(event){
        if(typeof props.event.onIssueJobCard !== "undefined"){
            props.event.onIssueJobCard(event, props.id)
        }
    }
    function handleSetToHold(event){
        if(typeof props.event.onSetToHoldJobCard !== "undefined"){
            props.event.onSetToHoldJobCard(event, props.id)
        }
    }

{/* <div className={"popup"} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>{props.component}
            <div className={"popuptext " + show} id="myPopup">{props.children}</div>
            </div> */}

    let draggableObj = 
        <><div className="my-dropdown show">
            {draggableSpan}
            <div id="myDropdown" className="my-dropdown-content show">
                <div><a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
                </div>
            </div>
        </div></>
  
    return (hybrid)
  }
  
  export function DropZone(props){
  
      function onDragOver(event) {
          event.preventDefault();
        }
  
        function onDrop(event) {
          
            const id = JSON.parse(event.dataTransfer.getData('text'));
            
            const draggableElement = document.getElementById(id[0]);
            const dropzone = event.target;
            
            props.localEvent.jobCardMoved(event, id[2], props.lineIndex, id[1])
            event.dataTransfer.clearData();
        }
      return (<div id="100" height="30" className={props.className} onDragOver={onDragOver} onDrop={onDrop}>{props.children}</div>)
  }

export function AlertMessage(props){
        
    let [showMessage, setShowMessage] = useState(false)
    let [messageTitle, setMessageTitle] = useState("")
    let [myMessage, setMyMessage] = useState("")
    let [messageType, setMessageType] = useState("BaseMessage")

    function promptBaseMessage(title, message){
        setMessageTitle(title)
        setMyMessage(message)
        setMessageType("BaseMessage")
        setShowMessage(true)
    }

    function promptWarningMessage(title, message){
        setMessageTitle(title)
        setMyMessage(message)
        setMessageType("WarningMessage")
        setShowMessage(true)
    }


    function promptErrorMessage(title, message){
        setMessageTitle(title)
        setMyMessage(message)
        setMessageType("ErrorMessage")
        setShowMessage(true)
    }

    props.functions.promptBaseMessage = promptBaseMessage
    props.functions.promptWarningMessage = promptWarningMessage
    props.functions.promptErrorMessage = promptErrorMessage

    function confirmAlert () {
        setShowMessage(false)
    }

    function warningMessage(){
        return (<SweetAlert 
            warning
            openAnim = {{ name: 'showSweetAlert', duration: 0 }}
            show={showMessage}
            title = {messageTitle}
            onConfirm = {confirmAlert}>
            {myMessage}
        </SweetAlert>)
    }


    function ErrorMessage(){
        return (<SweetAlert 
            danger
            openAnim = {{ name: 'showSweetAlert', duration: 0 }}
            show={showMessage}
            title = {messageTitle}
            onConfirm = {confirmAlert}>
            {myMessage}
        </SweetAlert>)
    }

    function baseMessage(){
        return (<SweetAlert 
            success
            openAnim = {{ name: 'showSweetAlert', duration: 0 }}
            show={showMessage}
            title = {messageTitle}
            onConfirm = {confirmAlert}>
            {myMessage}
        </SweetAlert>)
    }

    function callMessage(){
        switch (messageType){
            case "BaseMessage":
                return baseMessage()
            case "WarningMessage":
                return warningMessage()
            case "ErrorMessage":
                return ErrorMessage()
            default:
                return baseMessage()
        }

    }

    return callMessage()
}

export function PopUPDialog(props){
    
    let [rendered, setRendered] = useState(true)
    let [show, setShow] = useState(false)

    function reRender(){
        setRendered(!rendered)
    }

    function renderPopUp(){
    return (

        <>{show && <div>
            <div className={"modal" + (show ? " show d-block " : "") + props.className} style={{background:"rgba(0,0,0,.6)"}} role="dialog"  id={props.id}>
                <div className="modal-dialog"  role="document" style={{width:"100%"}}>
                    <div className="modal-content">

                    <div className="modal-header">
                        <h6>{props.headerText}</h6>
                        <button type="button" className="close" onClick={handleClick}>&times;</button>
                    </div>

                    <div className="modal-pop-up-body">
                        <div>
                            {props.children}
                        </div>
                    </div>

                    {/* <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={handleClick}>Close</button>
                    </div> */}

                    </div>
                </div>
            </div>
        </div>}</>
    );
    }


    function showPopUp(){
        setShow(true)
    }
    function closePopUp(){
        setShow(false)
    }

    function handleClick(event){
        setShow(false)
        if(typeof props.onClosePopUp !== "undefined"){
            props.onClosePopUp(event)
        }
    }
    props.item.showPopUp = showPopUp
    props.item.closePopUp = closePopUp

  return renderPopUp()
}


export function DocumentPreview(props){
    
        
    let [showMessage, setShowMessage] = useState(false)
    let [documentId, setDocumentId] = useState("")
    let [documentSource, setDocumentSource] = useState("")
    let [documentType, setDocumentType] = useState("")
    function showDialog(){
    return (

        <div>
            <div className="modal" id={documentId}>
                <div className="modal-dialog modal-xl" style={{width:"80%"}}>
                    <div className="modal-content">

                    <div className="modal-header">
                        <h6>{props.headerText}</h6>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>

                    <div className="modal-body" style={{height:"530px"}}>
                        <div>
                        <iframe src={documentSource}  style={{height:"500px", width:"100%"}}/>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                    </div>

                    </div>
                </div>
            </div>
        </div>
    );
    }
  function previewPdf(){

  }

  function previewImage(){

}


  function previewDocument(){
    switch (documentType){
        case "pdf":
            return previewPdf()
        case "image":
            return previewImage()
    }

}

  return previewDocument()
}

export default DraggableObject