
"use strict";
import Select from 'react-select';
// Object.defineProperty(exports, "__esModule", { value: true });
// exports._nativeTextBox = _nativeTextBox;
// exports._nativeTextArea = _nativeTextArea;
// exports._nativeTbTextBox = _nativeTbTextBox;
// exports._nativeTbNumberField = _nativeTbNumberField;
// exports._nativeTbLink = _nativeTbLink;
// exports._nativeTbIntegerField = _nativeTbIntegerField;
// exports._nativeTbDropDown = _nativeTbDropDown;
// exports._nativeTbCheckBox = _nativeTbCheckBox;
// exports._nativeTabPage = _nativeTabPage;
// exports._nativeTab = _nativeTab;
// exports._nativeRadio = _nativeRadio;
// exports._nativePopUp = _nativePopUp;
// exports._nativeMessenger = _nativeMessenger;
// exports._nativeMessageListNavigator = _nativeMessageListNavigator;
// exports._nativeLovWindow = _nativeLovWindow;
// exports._nativeLovComboBox = _nativeLovComboBox;
// exports._nativeLabel = _nativeLabel;
// exports._nativeGrid = _nativeGrid;
// exports._nativeFileSelector = _nativeFileSelector;
// exports._nativeDualStateSelector = _nativeDualStateSelector;
// exports._nativeDropDown = _nativeDropDown;
// exports._nativeCheckBox = _nativeCheckBox;
// exports._nativeButton = _nativeButton;
// exports._nativeSearchGrid = _nativeSearchGrid;
// exports.TextBoxProperty = void 0; *** build error therfore change export to jsx way
var _react = _interopRequireWildcard(require("react"));
var _Base = require("../BASE/_Base");
var _Components = require("../BASE/Components.js");
var _TextBox2 = _interopRequireDefault(require("../BASE/_TextBox"));
require("../_css/_popup.css");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
const TextBoxProperty = {
  objectType: "TextBox",
  schema: {
    name: "",
    placeholder: "",
    type: "text",
    length: 100,
    showLabel: true,
    visible: true,
  },
  label: {
    objectType: "Label",
    schema: { name: "label", type: "text", visible: true, value: "" },
    class: "",
  },
  data: { sqlcolumn: "", value: "" },
  class: "",
  event: {},
};
// exports.TextBoxProperty = TextBoxProperty;
export function _nativeTextBox(props) {

  let [value, setValue] = (0, _react.useState)(props.value);
  let [oldValue, setOldValue] = (0, _react.useState)(props.value);
  let [handleChangeValue, setHandleChangeValue] = (0, _react.useState)(false);
  let [style, setStyle] = (0, _react.useState)({});
  let className = props.className;
  (0, _react.useEffect)(() => {
    setValue(props.value);
    setOldValue(props.value);
    //setStyle(props.style);
  }, [props.value, props.value === oldValue]);
  let [visible, setVisible] = (0, _react.useState)(props.visible);
  (0, _react.useEffect)(() => {
    setVisible(props.visible);
  }, [props.visible]);
  if (props.functions) props.functions.setValue = setValue;
  const handleChange = (0, _react.useCallback)((event) => {
    setHandleChangeValue(true);
    setValue(event.target.value);
    if (typeof props.onChange !== "undefined") {
      props.onChange(event);
    }
  }, []);
  const handleBlur = (0, _react.useCallback)((event) => {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event);
    }
  }, []);
  function handleFocus(event) {
    if (typeof props.onFocus !== "undefined") {
      props.onFocus(event);
    }
  }
  function handleKeyPress(event) {
    if (typeof props.onKeyPress !== "undefined") {
      props.onKeyPress(event);
    }
  }
  const handleKeyDown = (0, _react.useCallback)((event) => {
    if (typeof props.onEnterKey !== "undefined" && event.key === "Enter") {
      props.onEnterKey(event);
    }
  });
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    visible &&
    _react["default"].createElement(
      _react["default"].Fragment,
      null,
      _react["default"].createElement("input", {
        type: props.type ? props.type : "text",
        autoComplete: "off",
        disabled: props.disabled,
        id: props.id,
        styleName: props.styleName,
        className: className,
        style: { ...props.style },
        key: props.name,
        name: props.name,
        value: value,
        placeholder: props.placeholder,
        readOnly: props.readOnly,
        onFocus: handleFocus,
        onChange: handleChange,
        onBlur: handleBlur,
        onKeyPress: handleKeyPress,
        onKeyDown: handleKeyDown,
        onKeyUp: props.onKeyUp,
      })
    )
  );
}
export function _nativeTextArea(props) {
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [visible, setVisible] = (0, _react.useState)(props.visible);
  (0, _react.useEffect)(() => {
    setVisible(props.visible);
  }, [props.visible]);
  function handleChange(event) {
    setValue(event.target.value);
    if (typeof props.onChange !== "undefined") {
      props.onChange(event);
    }
  }
  function handleBlur(event) {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event);
    }
  }
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    visible &&
    _react["default"].createElement(
      _react["default"].Fragment,
      null,
      _react["default"].createElement("textarea", {
        id: props.id,
        className: props.className,
        style: props.style,
        key: props.name,
        name: props.name,
        disabled: props.disabled,
        readOnly: props.readOnly,
        value: props.value,
        placeholder: props.placeholder,
        onChange: handleChange,
        onBlur: handleBlur,
      })
    )
  );
}
export function _nativeTbTextBox(props) {

  let comp;
  let [value, setValue] = (0, _react.useState)(
    typeof props.value === "undefined" ? "" : props.value
  );

  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [rowId, setRowId] = (0, _react.useState)(props.rowId);
  (0, _react.useEffect)(() => {
    setRowId(props.rowId);
  }, [props.rowId]);
  let [colId, setColId] = (0, _react.useState)(props.colId);
  (0, _react.useEffect)(() => {
    setColId(props.colId);
  }, [props.colId]);
  function handleChange(event) {
    setValue(event.target.value);
    if (typeof props.onChange !== "undefined") {
      props.onChange(event, rowId, colId);
      //props.onBlur(event, rowId, colId);
    }
  }

  function handlechangeOnBlur(event) {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event, rowId, colId);
    }
  }
  const handleKeyDown = (0, _react.useCallback)((event) => {
    if (typeof props.onEnterKey !== "undefined" && event.key === "Enter") {
      props.onEnterKey(event);
    }
  });
  comp = _react["default"].createElement(_TextBox2["default"], {
    id: props.id,
    style: props.style,
    className: props.className,
    name: props.name,
    styleName: props.styleName,
    value: value,
    placeholder: props.placeholder,
    visible: props.visible,
    onChange: handleChange,
    onEnterKey: handleKeyDown,
    onBlur: handlechangeOnBlur,

  });
  return comp;
}
export function _nativeTbNumberField(props) {
  let comp;
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [rowId, setRowId] = (0, _react.useState)(props.rowId);
  (0, _react.useEffect)(() => {
    setRowId(props.rowId);
  }, [props.rowId]);
  let [colId, setColId] = (0, _react.useState)(props.colId);
  (0, _react.useEffect)(() => {
    setColId(props.colId);
  }, [props.colId]);
  function handleChange(event) {
    setValue(event.target.value);
    if (typeof props.onChange !== "undefined") {
      props.onChange(event, rowId, colId);
    }
  }
  function handleBlur(event) {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event, rowId, colId);
    }
  }
  function isNumber(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 46 &&
      charCode !== 45
    ) {
      event.preventDefault();
    }
    if (
      isNaN(event.target.value + String.fromCharCode(event.which)) &&
      charCode !== 45
    )
      event.preventDefault();
    if (charCode === 45 && event.target.value.length !== 0) {
      event.preventDefault();
    }
  }
  function handleBlur(event) {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event);
    }
  }
  function handleKeyPress(event) {
    if (typeof props.onKeyPress !== "undefined") {
      props.onKeyPress(event);
    }
    return isNumber(event);
  }
  function handleKeyDown(event) {
    if (typeof props.onEnterKey !== "undefined" && event.key === "Enter") {
      props.onEnterKey(event);
    }
  }
  comp = _react["default"].createElement(_TextBox2["default"], {
    id: props.id,
    style: props.style,
    className: props.className,
    name: props.name,
    value: props.value,
    placeholder: props.placeholder,
    styleName: props.styleName,
    visible: props.visible,
    onChange: handleChange,
    onKeyPress: handleKeyPress,
    onEnterKey: handleKeyDown,
    onBlur: handleBlur,
  });
  return comp;
}
export function _nativeTbLink(props) {
  let comp;
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [rowId, setRowId] = (0, _react.useState)(props.rowId);
  (0, _react.useEffect)(() => {
    setRowId(props.rowId);
  }, [props.rowId]);
  let [colId, setColId] = (0, _react.useState)(props.colId);
  (0, _react.useEffect)(() => {
    setColId(props.colId);
  }, [props.colId]);
  function handleClick(event) {
    setValue(event.target.value);
    if (typeof props.onClick !== "undefined") {
      props.onClick(event, rowId, colId);
    }
  }
  function handleBlur(event) {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event, rowId, colId);
    }
  }
  comp = _react["default"].createElement(
    "button",
    {
      href: () => false,
      id: props.id,
      style: props.style,
      className: "btn btn-link " + props.className,
      name: props.name,
      placeholder: props.placeholder,
      visible: props.visible,
      onClick: handleClick,
    },
    " ",
    props.value,
    " "
  );
  return comp;
}
export function _nativeTbIntegerField(props) {
  let comp;
  let [lastIntVal, setLastIntVal] = (0, _react.useState)(props.value);
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [rowId, setRowId] = (0, _react.useState)(props.rowId);
  (0, _react.useEffect)(() => {
    setRowId(props.rowId);
  }, [props.rowId]);
  let [colId, setColId] = (0, _react.useState)(props.colId);
  (0, _react.useEffect)(() => {
    setColId(props.colId);
  }, [props.colId]);
  function handleChange(event) {
    setValue(event.target.value);
    if (typeof props.onChange !== "undefined") {
      props.onChange(event, rowId, colId);
    }
  }
  function handleBlur(event) {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event, rowId, colId);
    }
  }
  function isNumber(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 45) {
      event.preventDefault();
    }
    if (
      isNaN(event.target.value + String.fromCharCode(event.which)) &&
      charCode !== 45
    )
      event.preventDefault();
    if (charCode === 45 && isNaN(event.target.value)) {
      event.preventDefault();
    }
  }
  // function handleBlur(event) {
  //   if (typeof props.onBlur !== "undefined") {
  //     //props.onBlur(event);
  //     props.onBlur(event, rowId, colId);
  //   }
  // }
  function handleKeyPress(event) {
    if (typeof props.onKeyPress !== "undefined") {
      props.onKeyPress(event);
    }
    return isNumber(event);

  }
  function handleKeyUp(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (isNaN(event.target.value)) {
      setValue(lastIntVal);
      event.target.value = lastIntVal;
    } else setLastIntVal(event.target.value);
    return true;
  }
  // function handleKeyDown(event) {
  //   if (typeof props.onEnterKey !== "undefined" && event.key === "Enter") {
  //     props.onEnterKey(event, rowId, colId);
  //   }
  //   props.onFocus(event, rowId, colId);

  // }
  comp = _react["default"].createElement(_TextBox2["default"], {
    id: props.id,
    style: props.style,
    className: props.className,
    name: props.name,
    styleName: props.styleName,
    value: value,
    placeholder: props.placeholder,
    visible: props.visible,
    onChange: handleChange,
    onKeyPress: handleKeyPress,
    onKeyUp: handleKeyUp,
    onBlur: handleBlur,

  });
  return comp;
}

export function _nativeTbDropDown(props) {

  let [rendered, setRendered] = (0, _react.useState)(true);
  function reRender() {
    setRendered(!rendered);
  }
  let [value, setValue] = (0, _react.useState)(selectOptionArray(props.value));
  // (0, _react.useEffect)(() => {
  //   setValue(selectOptionArray(props.value));
  //   //alert();
  // }, [selectOptionArray(props.value)]);

  let [visible, setVisible] = (0, _react.useState)(props.visible);
  (0, _react.useEffect)(() => {
    setVisible(props.visible);
  }, [props.visible]);



  function handleChange(event) {
    setValue(selectOptionArray(event.value));

    event.target = {};
    event.target.value = event.value;
    event.target.name = props.name;
    if (typeof props.onChange !== "undefined") {
      props.onChange(event, props.rowId, props.colId);
    }
    reRender();
  }

  function selectOptionArray(val) {
    let savedVal = {}
    Object.entries(props.options).map(([key, v]) => {

      if (v.value == val) {

        // return {
        //   "value": v.value,
        //   "label": v.text,
        // }
        savedVal.value = v.value;
        savedVal.label = v.text;
      }
    })
    return savedVal;

  }
  function handleBlur(event) {


    event.target = {};
    event.target.value = event.value;
    event.target.name = props.name;
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event);
    }
  }

  let options = props.options;
  const formattedOptions = options.map(option => ({
    value: option.value,
    label: option.text,
  }));

  return (
    <Select
      options={formattedOptions}
      // placeholder={placeholder}
      onChange={handleChange}
      value={value}
      isSearchable={true}
      className="react-select"
      classNamePrefix="select"
      name={props.name}
      key={props.key + props.rowId + props.colId}
      styles={{
        menuPortal: base => ({ ...base, zIndex: 9999 }), // Ensure a high z-index
      }}
      // onBlur= {handleBlur}
      menuPortalTarget={document.body}
    />
  );


  // return _react["default"].createElement(
  //   _react["default"].Fragment,
  //   null,
  //   (typeof visible === "undefined" ? true : visible) &&
  //     _react["default"].createElement(
  //       "select",
  //       {
  //         id: props.id,
  //         disabled: props.disabled,
  //         className: props.className,
  //         style: props.style,
  //         name: props.name,
  //         key: props.key + props.rowId + props.colId,
  //         value: value,
  //         placeholder: props.placeholder,
  //         onChange: handleChange,
  //         onBlur: handleBlur,

  //       },
  //       props.options.map((item) =>
  //         _react["default"].createElement(
  //           "option",
  //           { key: item.value, value: item.value },
  //           item.text
  //         )
  //       )
  //     )
  // );
}


export function _nativeTbDropDown26092024(props) {
  let [rendered, setRendered] = (0, _react.useState)(true);
  function reRender() {
    setRendered(!rendered);
  }
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [visible, setVisible] = (0, _react.useState)(props.visible);
  (0, _react.useEffect)(() => {
    setVisible(props.visible);
  }, [props.visible]);
  function handleChange(event) {
    setValue(event.target.value);
    if (typeof props.onChange !== "undefined") {
      props.onChange(event, props.rowId, props.colId);
    }
  }
  function handleBlur(event) {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event);
    }
  }


  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    (typeof visible === "undefined" ? true : visible) &&
    _react["default"].createElement(
      "select",
      {
        id: props.id,
        disabled: props.disabled,
        className: props.className,
        style: props.style,
        name: props.name,
        key: props.key + props.rowId + props.colId,
        value: value,
        placeholder: props.placeholder,
        onChange: handleChange,
        onBlur: handleBlur,

      },
      props.options.map((item) =>
        _react["default"].createElement(
          "option",
          { key: item.value, value: item.value },
          item.text
        )
      )
    )
  );
}
export function _nativeTbCheckBox(props) {
  let [rowId, setRowId] = (0, _react.useState)(props.rowId);
  let checked = props.checked;
  (0, _react.useEffect)(() => {
    setRowId(props.rowId);
  }, [props.rowId]);
  let [colId, setColId] = (0, _react.useState)(props.colId);
  (0, _react.useEffect)(() => {
    setColId(props.colId);
  }, [props.colId]);
  function handleChange(event) {
    if (typeof props.onChange !== "undefined") {
      props.onChange(event, rowId, colId);
    }
  }
  let comp;
  comp = _react["default"].createElement(_nativeCheckBox, {
    id: props.name,
    style: props.style,
    type: "checkbox",
    className: props.className,
    name: props.name,
    checked: checked,
    disabled: props.disabled,
    placeholder: props.placeholder,
    visible: props.visible,
    showLabel: props.showLabel ? true : false,
    onChange: handleChange,
    onClick: props.onClick,
  });
  return comp;
}
export function _nativeTabPage(props) {
  let comp = _react["default"].createElement(
    "li",
    { className: "nav-item" },
    _react["default"].createElement(
      "a",
      {
        className:
          typeof props.className === "undefined"
            ? "nav-link" + (props.disabled === true ? " disabled" : "")
            : props.className +
            " " +
            (props.disabled === true ? " disabled" : ""),
        id: props.id,
        "data-toggle": props.dataToggle,
        href: props.href,
        role: props.role,
        "aria-controls": props.ariaControls,
        "aria-selected": props.ariaSelected,
      },
      props.text
    )
  );
  return comp;
}
export function _nativeTab(props) {
  let comp = _react["default"].createElement(
    "ul",
    { className: props.className, id: props.id, role: props.role },
    props.children
  );
  return comp;
}
export function _nativeRadio(props) {
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [visible, setVisible] = (0, _react.useState)(props.visible);
  (0, _react.useEffect)(() => {
    setVisible(props.visible);
  }, [props.visible]);
  function handleChange(event) {
    setValue(event.target.value);
    if (typeof props.onChange !== "undefined") {
      props.onChange(event);
    }
  }
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    visible &&
    _react["default"].createElement("input", {
      id: props.id,
      type: "radio",
      className: props.className,
      key: props.id,
      name: props.name,
      disabled: props.disabled,
      readOnly: props.readOnly,
      checked: props.checked,
      value: value,
      onChange: handleChange,
    })
  );
}
export function _nativePopUp(props) {
  let [show, setShow] = (0, _react.useState)("");
  let [rendered, setRendered] = (0, _react.useState)(true);
  function reRender() {
    setRendered(!rendered);
  }
  function handleMouseOver() {
    setShow("show");
    reRender();
  }
  function handleMouseLeave() {
    setShow("");
    reRender();
  }
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    _react["default"].createElement(
      "div",
      {
        className: "popup",
        onMouseOver: handleMouseOver,
        onMouseLeave: handleMouseLeave,
      },
      props.component,
      _react["default"].createElement(
        "span",
        { className: "popuptext " + show, id: "myPopup" },
        props.children
      )
    )
  );
}
export function _nativeMessenger(props) {
  let myMessageFormatter;
  let receivedMessageFormatter;
  let childrenProp;
  let messageArray = [];
  let [rendered, setRendered] = (0, _react.useState)(true);
  function reRender() {
    setRendered(!rendered);
  }
  props.item.reRender = reRender;
  function extractFormatters(children) {
    _react["default"].Children.map(children, (child) => {
      if (child.props && typeof child.props.typeName !== "undefined") {
        if (child.props.typeName === "MyMessageFormatter") {
          myMessageFormatter = child.props.children;
        } else if (child.props.typeName === "ReceivedMessageFormatter") {
          receivedMessageFormatter = child.props.children;
        }
      }
      if (child.props && child.props.children) {
        extractFormatters(child.props.children);
      }
    });
  }
  function applyChatData(children, message, action, time, avatar) {
    return _react["default"].Children.map(children, (child) => {
      if (!child.props) {
        return child;
      }
      if (child.props) {
        if (typeof child.props.typeName !== "undefined") {
          if (child.props.typeName === "MessageText") {
            return _react["default"].cloneElement(child, {
              message: message,
              children: child.props.children,
            });
          }
          if (child.props.typeName === "MessageTime") {
            return _react["default"].cloneElement(child, { time: time });
          }
          if (child.props.typeName === "AvatarImg") {
            return _react["default"].cloneElement(child, { src: avatar });
          }
          if (
            typeof action === "undefined" &&
            child.props.typeName === "MessageAction"
          ) {
            return null;
          } else if (child.props.typeName === "MessageAction")
            return _react["default"].cloneElement(child, { action: action });
        }
        return _react["default"].cloneElement(child, {
          children: applyChatData(
            child.props.children,
            message,
            action,
            time,
            avatar
          ),
        });
      }
      if (child.props && child.props.typeName === "AvatarImg")
        return _react["default"].createElement("img", {
          src: avatar,
          alt: "avatar",
          width: 60,
          className: child.props.className,
        });
      return child;
    });
  }
  function createMessageArray() {
    let messageArray = [];
    let chatHistry = props.item.data.chatHistry;
    chatHistry.forEach((value, index) => {
      if (props.item.data.loggedInUser === value.user)
        messageArray[messageArray.length] = applyChatData(
          myMessageFormatter,
          value.message,
          value.action,
          value.time,
          value.avatarImg
        );
      else
        messageArray[messageArray.length] = applyChatData(
          receivedMessageFormatter,
          value.message,
          value.action,
          value.time,
          value.avatarImg
        );
    });
    return messageArray;
  }
  function renderWrappedChildren(children, item) {
    return _react["default"].Children.map(children, (child) => {
      let shouldReturn = true;
      if (child && !child.props) {
        return child;
      }
      if (child && typeof child.props !== "undefined") {
        if (child.props.typeName === "MessageHistrory") {
          shouldReturn = false;
          return _react["default"].cloneElement(child, {
            children: renderWrappedChildren(messageArray, item),
          });
        }
      }
      if (shouldReturn) {
        if (child && child.props) {
          if (child.props.typeName === "ChatMessageBtton") {
            return _react["default"].cloneElement(child, {
              children: renderWrappedChildren(child.props.children, item),
              item: item,
            });
          }
          return _react["default"].cloneElement(child, {
            children: renderWrappedChildren(child.props.children, item),
          });
        }
        return child;
      }
    });
  }
  extractFormatters(props.children);
  messageArray = createMessageArray();
  childrenProp = renderWrappedChildren(props.children, props.item);
  return childrenProp[0];
}
export function _nativeMessageListNavigator(props) {
  let selectedMessageProps;
  let nonSelectedMessageProps;
  let navigatorItemArray = [];
  let [rendered, setRendered] = (0, _react.useState)(true);
  function reRender() {
    setRendered(!rendered);
  }
  props.item.reRender = reRender;
  function handleChange(event) { }
  function extractFormatters(children) {
    _react["default"].Children.map(children, (child) => {
      if (child.props && typeof child.props.typeName !== "undefined") {
        if (child.props.typeName === "SelectedListItem") {
          selectedMessageProps = child.props;
        } else if (child.props.typeName === "NonSelectedListItem") {
          nonSelectedMessageProps = child.props;
        }
      }
      if (child.props && child.props.children) {
        extractFormatters(child.props.children);
      }
    });
  }
  function applyNavItemData(
    children,
    user,
    message,
    header,
    line3,
    line4,
    line5,
    avatar
  ) {
    return _react["default"].Children.map(children, (child) => {
      if (!child.props) {
        return child;
      }
      if (child.props) {
        if (typeof child.props.typeName !== "undefined") {
          if (child.props.typeName === "MessageText") {
            return _react["default"].cloneElement(child, {
              message: message,
              children: child.props.children,
            });
          } else if (child.props.typeName === "MessageHeader") {
            return _react["default"].cloneElement(child, {
              header: header,
              children: child.props.children,
            });
          } else if (child.props.typeName === "Line3") {
            return _react["default"].cloneElement(child, {
              line3: line3,
              children: child.props.children,
            });
          } else if (child.props.typeName === "Line4") {
            return _react["default"].cloneElement(child, {
              line4: line4,
              children: child.props.children,
            });
          } else if (child.props.typeName === "Line5") {
            return _react["default"].cloneElement(child, {
              line5: line5,
              children: child.props.children,
            });
          } else if (child.props.typeName === "UserName") {
            return _react["default"].cloneElement(child, {
              user: user,
              children: child.props.children,
            });
          } else if (child.props.typeName === "AvatarImg") {
            return _react["default"].cloneElement(child, {
              src: avatar,
              children: child.props.children,
            });
          }
        }
        return _react["default"].cloneElement(child, {
          children: applyNavItemData(
            child.props.children,
            user,
            message,
            header,
            line3,
            line4,
            line5,
            avatar
          ),
        });
      }
      if (child.props && child.props.typeName === "AvatarImg")
        return _react["default"].createElement("img", {
          src: avatar,
          alt: "avatar",
          width: 60,
          className: child.props.className,
        });
      return child;
    });
  }
  function createNavigatorItemArray() {
    let navigatorItemArray = [];
    let messages = props.item.data.messages;
    function createNavigatorItem(className, id, renderedItem) {
      let item = _react["default"].createElement(
        "a",
        { className: className, onClick: handleClick },
        " ",
        renderedItem
      );
      return item;
      function handleClick(event) {
        if (typeof props.onClick !== "undefined") {
          props.onClick(event, id);
        }
      }
    }
    messages.forEach((value, index) => {
      if (value.selected)
        navigatorItemArray[navigatorItemArray.length] = createNavigatorItem(
          selectedMessageProps.className,
          value.id,
          applyNavItemData(
            selectedMessageProps.children,
            value.user,
            value.message,
            value.header,
            value.line3,
            value.line4,
            value.line5,
            value.avatarImg
          )
        );
      else
        navigatorItemArray[navigatorItemArray.length] = createNavigatorItem(
          nonSelectedMessageProps.className,
          value.id,
          applyNavItemData(
            nonSelectedMessageProps.children,
            value.user,
            value.message,
            value.header,
            value.line3,
            value.line4,
            value.line5,
            value.avatarImg
          )
        );
    });
    return navigatorItemArray;
  }
  extractFormatters(props.children);
  navigatorItemArray = createNavigatorItemArray();
  return navigatorItemArray;
}
export function _nativeLovWindow(props) {
  let [rendered, setRendered] = (0, _react.useState)(true);
  let [item, setItem] = (0, _react.useState)({});
  let [isGridActive, setIsGridActive] = (0, _react.useState)(false);
  let [rowSelected, setRowSelected] = (0, _react.useState)(false);
  let [validated, setValidated] = (0, _react.useState)(false);
  let [messageString, setMessageString] = (0, _react.useState)("");
  if (typeof props.item.lovData === "undefined") {
    props.item.lovData = {};
    let columns = props.item.lovData;
    props.item.lovData = {
      objectType: "LovWindow",
      titles: {},
      controllerSearchBar: {
        objectType: "SearchBar",
        searchBarHeader: [],
        searchedData: [],
      },
      rows: [],
    };
  }
  function reRender() {
    setRendered(!rendered);
  }
  function renderHeaderTitle() {
    let tableHeader = props.item.lovData.titles;
    let header = Object.keys(tableHeader).map((name, colIdx) => {
      if (tableHeader[name].visible === true) {
        let colName = tableHeader[name].displayName;
        if (Object.keys(tableHeader).length === colIdx + 1)
          return _react["default"].createElement(
            _react["default"].Fragment,
            null,
            _react["default"].createElement(
              "th",
              { className: "border-bottom-0", key: name + "_grid" },
              colName
            ),
            _react["default"].createElement("th", {
              className: "border-bottom-0",
            })
          );
        return _react["default"].createElement(
          "th",
          { className: "border-bottom-0", key: name + "_grid" },
          colName
        );
      }
    });
    return header;
  }
  function getSearchBarData() {
    let columns = props.item.lovData.controllerSearchBar.searchBarHeader;
    let searchBarData = {};
    let sqlcolumn, value;
    Object.keys(columns).map((name) => {
      if (typeof columns[name].data !== "undefined") {
        sqlcolumn = columns[name].data.sqlcolumn;
        value = columns[name].data.value;
        Object.assign(searchBarData, { [sqlcolumn]: value });
      }
    });
    return searchBarData;
  }
  function resetSearchBarData() {
    let columns = props.item.lovData.controllerSearchBar.searchBarHeader;
    Object.keys(columns).map((name) => {
      if (
        typeof columns[name].data !== "undefined" &&
        columns[name].schema.advanceSearch
      ) {
        if (typeof columns[name].setValue !== "undefined")
          columns[name].setValue("");
        else columns[name].data.value = "";
      }
    });
  }
  function renderSearchBar() {
    resetSearchBarData();
    let tableHeader = props.item.lovData.controllerSearchBar.searchBarHeader;
    function renderCheckBox(properties, data, rowId, colId, disabled) {
      if (typeof properties.event === "undefined") {
        properties.event = {};
      }
      properties.event.onChange = handleChangeTest;
      properties.event.onEnterKey = handleEnterKey;
      function handleEnterKey(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onLovSearch !== "undefined") {
          rows = props.item.event.onLovSearch(
            event,
            searchCriteria,
            (data, message) => {
              rows = data;
              setMessageString(message);
              props.item.lovData.rows = rows;
              props.item.lovData.selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      function handleChangeTest(event) {
        props.item.lovData.controllerSearchBar.searchBarHeader[
          properties.data.sqlcolumn
        ].data.value = properties.data.value;
      }
      properties.schema.showLabel = false;
      return _react["default"].createElement(_Components.CheckBox, {
        item: properties,
        id: properties.name,
        type: "checkbox",
        rowId: rowId,
        colId: colId,
        item: properties,
        name: properties.name,
        value: data,
        disabled: disabled,
        visible: true,
        onEnterKey: handleEnterKey,
      });
    }
    function renderNumberField(properties, data, rowId, colId) {
      if (typeof properties.event === "undefined") {
        properties.event = {};
      }
      properties.event.onChange = handleChangeTest;
      properties.event.onEnterKey = handleEnterKey;
      function handleEnterKey(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onLovSearch !== "undefined") {
          rows = props.item.event.onLovSearch(
            event,
            searchCriteria,
            (data, message) => {
              rows = data;
              setMessageString(message);
              props.item.lovData.rows = rows;
              props.item.lovData.selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      function handleChangeTest(event) {
        props.item.lovData.controllerSearchBar.searchBarHeader[
          properties.data.sqlcolumn
        ].data.value = properties.data.value;
      }
      return _react["default"].createElement(_Components.NumberField, {
        item: properties,
        name: properties.name,
        className: "form-control form-control-sm",
        rowId: rowId,
        colId: colId,
        value: properties.data.value,
        visible: true,
        onEnterKey: handleEnterKey,
      });
    }
    function renderTextBox(properties, data, rowId, colId) {
      if (typeof properties.event === "undefined") {
        properties.event = {};
      }
      properties.event.onChange = handleChangeTest;
      properties.event.onEnterKey = handleEnterKey;
      function handleEnterKey(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onLovSearch !== "undefined") {
          rows = props.item.event.onLovSearch(
            event,
            searchCriteria,
            (data, message) => {
              rows = data;
              setMessageString(message);
              props.item.lovData.rows = rows;
              props.item.lovData.selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      function handleChangeTest(event) {
        props.item.lovData.controllerSearchBar.searchBarHeader[
          properties.data.sqlcolumn
        ].data.value = properties.data.value;
      }
      return _react["default"].createElement(_Components.TextBox, {
        item: properties,
        name: properties.name,
        className: "form-control form-control-sm",
        rowId: rowId,
        colId: colId,
        value: properties.data.value,
        visible: true,
        onEnterKey: handleEnterKey,
      });
    }
    function renderDropDown(properties, data, rowId, colId) {
      if (typeof properties.event === "undefined") {
        properties.event = {};
      }
      properties.event.onChange = handleChangeTest;
      properties.event.onEnterKey = handleEnterKey;
      function handleEnterKey(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onLovSearch !== "undefined") {
          rows = props.item.event.onLovSearch(
            event,
            searchCriteria,
            (data, message) => {
              rows = data;
              setMessageString(message);
              props.item.lovData.rows = rows;
              props.item.lovData.selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      function handleChangeTest(event) {
        props.item.lovData.controllerSearchBar.searchBarHeader[
          properties.data.sqlcolumn
        ].data.value = properties.data.value;
      }
      let item = _react["default"].createElement(_Components.DropDown, {
        item: properties,
        name: properties.name,
        className: "form-control form-control-sm",
        rowId: rowId,
        colId: colId,
        value: data,
        visible: true,
        onEnterKey: handleEnterKey,
      });
      return item;
    }
    function renderSearch() {
      function handleClick(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onLovSearch !== "undefined") {
          rows = props.item.event.onLovSearch(
            event,
            searchCriteria,
            (data, message) => {
              rows = data;
              setMessageString(message);
              props.item.lovData.rows = rows;
              props.item.lovData.selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      return _react["default"].createElement(
        "button",
        { className: "btn btn-link", onClick: handleClick },
        _react["default"].createElement("i", { className: "fa fa-search" })
      );
    }
    tableHeader["colController"] = { objectType: "SearchControl" };
    let header = Object.keys(tableHeader).map((name, colIdx) => {
      let key = tableHeader[name];
      let cell;
      switch (key.objectType) {
        case "TextBox":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderTextBox(tableHeader[name], "", -1, colIdx)
          );
          break;
        case "NumberField":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderNumberField(tableHeader[name], "", -1, colIdx)
          );
          break;
        case "CheckBox":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderCheckBox(tableHeader[name], "", -1, colIdx)
          );
          break;
        case "DropDown":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderDropDown(tableHeader[name], "", -1, colIdx)
          );
          break;
        case "SearchControl":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderSearch()
          );
          break;
        default:
          cell = null;
      }
      return cell;
    });
    return header;
  }
  function renderRows() {
    let columns = props.item.lovData.controllerSearchBar.searchBarHeader;
    let tableHeader = props.item.lovData.controllerSearchBar.searchBarHeader;
    let data = props.item.lovData.rows;
    let header;
    let selectedRow = props.item.lovData.selectedRow;
    function renderCheckBox(properties, data, rowId, colId, disabled) {
      properties.schema.showLabel = false;
      return _react["default"].createElement(_Components.CheckBox, {
        item: properties,
        id: properties.name,
        type: "checkbox",
        rowId: rowId,
        colId: colId,
        item: properties,
        name: properties.name,
        value: data,
        disabled: disabled,
        visible: true,
      });
    }
    tableHeader["colController"] = { objectType: "ControlObject" };
    return data.map((object, rowIdx) => {
      function handleClick(event) {
        props.item.lovData.selectedRow = rowIdx;
        selectedRow = rowIdx;
        setRowSelected(true);
        reRender();
      }
      function handleDbClick(event) {
        let searchData =
          props.item.lovData.rows[props.item.lovData.selectedRow];
        if (typeof props.item.event.onLovDone !== "undefined") {
          props.item.event.onLovDone(event, searchData ? searchData : {});
        }
        resetSearchBarData();
        item.closePopUp();
        setRowSelected(false);
      }
      header = Object.keys(tableHeader).map((name, colIdx) => {
        let key = tableHeader[name];
        if (Object.keys(tableHeader).length === colIdx + 1) {
          return _react["default"].createElement(
            "td",
            {
              style: key.style,
              key: name + "_grid",
              className: selectedRow === rowIdx ? "table-primary" : "",
            },
            selectedRow === rowIdx
              ? _react["default"].createElement(
                "span",
                null,
                _react["default"].createElement("i", {
                  className: "fas fa-check-circle",
                })
              )
              : _react["default"].createElement(
                _react["default"].Fragment,
                null
              )
          );
        }
        if (key.objectType === "CheckBox") {
          return _react["default"].createElement(
            "td",
            {
              key: key.name + rowIdx + colIdx,
              className: selectedRow === rowIdx ? "table-primary" : "",
            },
            _react["default"].createElement("input", {
              type: "checkbox",
              readOnly: true,
              checked: object[key.data.sqlcolumn] === key.schema.checkedValue,
            })
          );
        }
        return _react["default"].createElement(
          "td",
          {
            style: key.style,
            key: name + "_grid",
            className: selectedRow === rowIdx ? "table-primary" : "",
          },
          object[key.data.sqlcolumn]
        );
      });
      return _react["default"].createElement(
        "tr",
        { key: rowIdx, onDoubleClick: handleDbClick, onClick: handleClick },
        header
      );
    });
  }
  function showLovWindow(titles, rows, message) {
    props.item.lovData.titles = titles;
    props.item.lovData.rows = rows;
    props.item.lovData.selectedRow = -1;
    setMessageString(message);
    let columns = titles;
    props.item.lovData.controllerSearchBar = {
      objectType: "SearchBar",
      searchBarHeader: [],
      searchedData: [],
    };
    let tableHeader = props.item.lovData.controllerSearchBar.searchBarHeader;
    Object.keys(columns).map((name) => {
      if (columns[name].visible === true) {
        let tempStr = columns[name].displayName;
        tableHeader[name] = {
          objectType: "TextBox",
          schema: {
            name: "input" + tempStr.replace(" ", ""),
            placeholder: "",
            type: "text",
            length: 100,
            visible: true,
            searchable: true,
            dataSourceController: props.item.schema.dataSourceController,
          },
          data: { sqlcolumn: name, oldValue: "", value: "" },
          class: "",
          event: {},
        };
        tableHeader[name].schema.searchable = true;
        tableHeader[name].schema.readOnly = false;
        tableHeader[name].schema.visible = true;
        tableHeader[name].event = {};
        tableHeader[name].data.value = "";
      }
    });
    item.showPopUp();
    setIsGridActive(false);
    reRender();
  }
  function closeLovWindow() {
    setIsGridActive(false);
    setRowSelected(false);
    item.closePopUp();
  }
  function handleClosePopUp(event) {
    setRowSelected(false);
    resetSearchBarData();
  }
  function searchButton() {
    let disabled = true;
    disabled = !rowSelected;
    function handleButtonClick(event) {
      let searchData = props.item.lovData.rows[props.item.lovData.selectedRow];
      if (typeof props.item.event.onLovDone !== "undefined") {
        props.item.event.onLovDone(event, searchData ? searchData : {});
      }
      resetSearchBarData();
      item.closePopUp();
      setRowSelected(false);
    }
    return _react["default"].createElement(
      _react["default"].Fragment,
      null,
      _react["default"].createElement(
        "div",
        { className: "row" },
        _react["default"].createElement(
          "div",
          { className: "col-8" },
          _react["default"].createElement(
            "div",
            { className: "lov-info-message" },
            messageString
          )
        ),
        _react["default"].createElement(
          "div",
          { className: "col-4" },
          _react["default"].createElement(
            "button",
            {
              type: "button",
              className: "btn btn-primary lov-search-button",
              disabled: disabled,
              onClick: handleButtonClick,
            },
            "OK"
          )
        )
      )
    );
  }
  function searchGrid() {
    return _react["default"].createElement(
      "div",
      { className: "lov-searchtable-wrapper" },
      _react["default"].createElement(
        "table",
        {
          style: { overflowY: "hidden", ...props.style },
          className:
            props.className +
            "table table-responsive table-striped table-sm w-100 d-block d-md-table table table-hover",
        },
        _react["default"].createElement(
          "thead",
          null,
          _react["default"].createElement("tr", null, renderHeaderTitle()),
          _react["default"].createElement("tr", null, renderSearchBar())
        )
      ),
      _react["default"].createElement(
        "table",
        {
          style: { overflowY: "hidden", ...props.style },
          className:
            props.className +
            "table table-responsive table-striped table-sm w-100 d-block d-md-table table table-hover",
        },
        _react["default"].createElement(
          "thead",
          null,
          _react["default"].createElement("tr", null, renderHeaderTitle())
        ),
        _react["default"].createElement("tbody", null, renderRows())
      ),
      searchButton()
    );
  }
  props.item.showLovWindow = showLovWindow;
  props.item.closeLovWindow = closeLovWindow;
  props.item.setSearchValidated = setValidated;
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    _react["default"].createElement(
      _Base.PopUPDialog,
      {
        item: item,
        headerText: props.lovHeaderText,
        className:
          "lov-window " + props.item.schema.name + " " + props.lovClassName,
        onClosePopUp: handleClosePopUp,
      },
      _react["default"].createElement("div", null, searchGrid())
    )
  );
}
export function _nativeLovComboBox(props) {
  let [rendered, setRendered] = (0, _react.useState)(true);
  let [changedOnFocus, setChangedOnFocus] = (0, _react.useState)(false);
  function reRender() {
    setRendered(!rendered);
  }
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [visible, setVisible] = (0, _react.useState)(props.visible);
  (0, _react.useEffect)(() => {
    setVisible(props.visible);
  }, [props.visible]);
  function handleChange(event) {
    setValue(event.target.value);
    setChangedOnFocus(true);
    if (typeof props.onChange !== "undefined") {
      props.onChange(event);
    }
  }
  function handleBlur(event) {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event);
    }
    if (typeof props.onBlurWithChange !== "undefined") {
      if (changedOnFocus) props.onBlurWithChange(event);
    }
    setChangedOnFocus(false);
  }
  function handleLovClick(event) {
    if (typeof props.onComboSearch !== "undefined") {
      props.onComboSearch(event);
    }
  }
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    visible &&
    _react["default"].createElement(
      "div",
      { className: "input-group" },
      _react["default"].createElement("input", {
        type: "text",
        className: "lov-comob-input " + props.className,
        disabled: !props.editable ? !props.editable : props.disabled,
        placeholder: props.placeholder,
        value: props.value,
        onChange: handleChange,
        onBlur: handleBlur,
      }),
      _react["default"].createElement(
        "div",
        { className: "input-group-append" },
        _react["default"].createElement(
          "button",
          {
            className: "btn btn-secondary btn-sm",
            disabled: props.lovDisable ? props.lovDisable : props.disabled,
            type: "button",
            onClick: handleLovClick,
          },
          _react["default"].createElement("i", { className: "fa fa-list" })
        )
      )
    )
  );
}
export function _nativeLabel(props) {
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    props.visible &&
    _react["default"].createElement(
      "label",
      {
        style: props.style,
        className: props.className
      },
      props.value
    )
  );
}
export function _nativeGrid(props) {
  let dataList = props.item.data;
  let objectList = {};
  let maxIndex = 0;
  let index = 0;
  let [sortIcon, setSortIcon] = (0, _react.useState)("fa fa-sort fa-lg");
  let [clickedColumn, setClickedColumn] = (0, _react.useState)(-1);
  let [toggleIcon, setToggleIcon] = (0, _react.useState)(
    "fa fa-toggle-off fa-2x"
  );
  let newRow = { renderedItem: {}, data: {} };
  let [newRowController, setNewRowController] = (0, _react.useState)(newRow);
  let [rendered, setRendered] = (0, _react.useState)(true);
  let [modeEditable, setModeEditable] = (0, _react.useState)(true);
  function reRender() {
    setRendered(!rendered);
  }
  props.item.setModeEditable = setModeEditable;
  if (typeof props.item.schema.controllerObject === "undefined") {
    let schema = props.item.schema;
    schema["controllerObject"] = {};
  }
  if (props.item.schema.filterring === true) {
    let columns = props.item.columns;
    if (
      typeof props.item.schema.controllerObject["tableFilterring"] ===
      "undefined"
    ) {
      props.item.schema.controllerObject["tableFilterring"] = {
        objectType: "FilterBar",
        filterBarHeader: [],
        filterData: [],
      };
    } else {
      if (
        typeof props.item.schema.controllerObject["tableFilterring"]
          .filterBarHeader === "undefined"
      ) {
        props.item.schema.controllerObject.tableFilterring["filterBarHeader"] =
          [];
      }
      if (
        typeof props.item.schema.controllerObject["tableFilterring"]
          .filterData === "undefined"
      ) {
        props.item.schema.controllerObject.tableFilterring["filterData"] = [];
      }
    }
    props.item.schema.controllerObject.tableFilterring["filterBarHeader"] = [];
    let tableHeader =
      props.item.schema.controllerObject["tableFilterring"].filterBarHeader;
    Object.keys(columns).map((name) => {
      if (
        typeof columns[name] !== "undefined" &&
        columns[name].visible !== false
      ) {
        tableHeader[name] = { ...columns[name] };
        tableHeader[name].readOnly = false;
        tableHeader[name].event = {};
        tableHeader[name].value = "";
      }
    });
  }
  function resetHeader() {
    setToggleIcon("fa fa-toggle-off fa-2x");
    setSortIcon("fa fa-sort fa-lg");
    setClickedColumn(-1);
  }
  props.item.resetHeader = resetHeader;
  Object.keys(props.columns).map((name) => {
    if (typeof props.columns[name].colIndex !== "undefined") {
      if (maxIndex < props.columns[name].colIndex) {
        maxIndex = props.columns[name].colIndex;
      }
      if (typeof objectList[props.columns[name].colIndex] === "undefined")
        objectList[props.columns[name].colIndex] = Object.assign(
          {},
          props.columns[name]
        );
      else {
        objectList[maxIndex + 1] = Object.assign({}, props.columns[name]);
        maxIndex = maxIndex + 1;
      }
    }
  });
  index = maxIndex;
  Object.keys(props.columns).map((name) => {
    if (typeof props.columns[name].colIndex === "undefined") {
      objectList[index + 1] = Object.assign({}, props.columns[name]);
      index = index + 1;
    }
  });
  function resetNewRowController() {
    setNewRowController({ renderedItem: {}, data: {} });
  }
  props.item.resetNewRowController = resetNewRowController;
  function renderTableHeader() {
    let columns = objectList;
    let tableHeader = [];
    if (props.controller["delete"]) {
      Object.keys(objectList).map((name) => {
        tableHeader[name] = objectList[name];
      });
      tableHeader["colControlDel"] = { objectType: "Control", delete: true };
    } else {
      tableHeader = objectList;
    }
    let itemVisible = false;
    let header = Object.keys(tableHeader).map((name, index) => {
      let key = tableHeader[name];
      function sortAscending() {
        props.data.sort(function (a, b) {
          var nameA = a[tableHeader[name].sqlColumn].toString().toUpperCase();
          var nameB = b[tableHeader[name].sqlColumn].toString().toUpperCase();
          if (isNaN(nameA) || isNaN(nameB)) {
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          } else {
            return (
              a[tableHeader[name].sqlColumn] - b[tableHeader[name].sqlColumn]
            );
          }
          return 0;
        });
      }
      function sortDescending() {
        props.data.sort(function (a, b) {
          var nameA = a[tableHeader[name].sqlColumn].toString().toUpperCase();
          var nameB = b[tableHeader[name].sqlColumn].toString().toUpperCase();
          if (isNaN(nameA) || isNaN(nameB)) {
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
          } else {
            return (
              b[tableHeader[name].sqlColumn] - a[tableHeader[name].sqlColumn]
            );
          }
          return 0;
        });
      }
      function handleTestClick(event) {
        setClickedColumn(index);
        if (sortIcon === "fa fa-sort-up fa-lg") {
          setSortIcon("fa fa-sort-down fa-lg");
          sortDescending();
        } else {
          setSortIcon("fa fa-sort-up fa-lg");
          sortAscending();
        }
      }
      function handleSelectAllClick(event) {
        let i;
        for (i = 0; i < dataList.length; i++) {
          dataList[i]["_rowselected"] = event.target.checked;
        }
        reRender();
      }
      function handleColumnSelectAllClick(event) {
        let i;
        for (i = 0; i < dataList.length; i++) {
          if (dataList[i].hasOwnProperty('_show') && dataList[i]._show === true) {
            dataList[i]["_rowstate"] = "MODIFIED";
            if (toggleIcon === "fa fa-toggle-off fa-2x")
              dataList[i][key.sqlColumn] = key.checkedValue;
            else dataList[i][key.sqlColumn] = key.uncheckedValue;
          } else if (!dataList[i].hasOwnProperty('_show')) {
            dataList[i]["_rowstate"] = "MODIFIED";
            if (toggleIcon === "fa fa-toggle-off fa-2x")
              dataList[i][key.sqlColumn] = key.checkedValue;
            else dataList[i][key.sqlColumn] = key.uncheckedValue;
          }


          // dataList[i]["_rowstate"] = "MODIFIED";
          // if (toggleIcon === "fa fa-toggle-off fa-2x")
          //   dataList[i][key.sqlColumn] = key.checkedValue;
          // else dataList[i][key.sqlColumn] = key.uncheckedValue;
        }
        if (toggleIcon === "fa fa-toggle-on fa-2x")
          setToggleIcon("fa fa-toggle-off fa-2x");
        else setToggleIcon("fa fa-toggle-on fa-2x");
        props.onSelectAllClick(event, index);
        reRender();
      }
      itemVisible = typeof key.visible === "undefined" ? true : key.visible;
      if (itemVisible) {
        if (
          (typeof props.item.schema.sorting === "undefined" ||
            props.item.schema.sorting === false) &&
          key.objectType === "CheckBox" &&
          key.selectAll
        ) {
          return _react["default"].createElement(
            "th",
            { style: key.style, key: name + "_grid" },
            key.placeholder,
            " ",
            _react["default"].createElement(
              "a",
              { onClick: handleColumnSelectAllClick },
              _react["default"].createElement("i", {
                className: toggleIcon || "grid-sort-icon",
                "aria-hidden": "true",
              })
            )
          );
        }
        if (
          typeof props.item.schema.sorting !== "undefined" &&
          props.item.schema.sorting === true &&
          key.objectType !== "Control" &&
          key.objectType !== "ControlRowSelect"
        ) {
          if (clickedColumn === index) {
            if (key.objectType === "CheckBox" && key.selectAll) {
              return _react["default"].createElement(
                "th",
                { style: key.style, key: name + "_grid" },
                _react["default"].createElement(
                  "a",
                  { onClick: handleColumnSelectAllClick },
                  _react["default"].createElement("i", {
                    className: toggleIcon,
                    "aria-hidden": "true",
                  })
                ),
                " ",
                _react["default"].createElement(
                  "a",
                  { onClick: handleTestClick },
                  key.placeholder,
                  " ",
                  _react["default"].createElement("i", {
                    className: sortIcon || "grid-sort-icon",
                    "aria-hidden": "true",
                  })
                )
              );
            } else {
              return _react["default"].createElement(
                "th",
                { style: key.style, key: name + "_grid" },
                _react["default"].createElement(
                  "a",
                  { onClick: handleTestClick },
                  key.placeholder,
                  _react["default"].createElement("i", {
                    className: sortIcon || "grid-sort-icon",
                    "aria-hidden": "true",
                  })
                )
              );
            }
          } else {
            if (key.objectType === "CheckBox" && key.selectAll) {
              return _react["default"].createElement(
                "th",
                { style: key.style, key: name + "_grid" },
                _react["default"].createElement(
                  "a",
                  { onClick: handleColumnSelectAllClick },
                  _react["default"].createElement("i", {
                    className: toggleIcon,
                    "aria-hidden": "true",
                  })
                ),
                " ",
                _react["default"].createElement(
                  "a",
                  { onClick: handleTestClick },
                  key.placeholder,
                  " ",
                  _react["default"].createElement("i", {
                    className: "fa fa-sort fa-lg grid-sort-icon",
                    "aria-hidden": "true",
                  })
                )
              );
            } else {
              return _react["default"].createElement(
                "th",
                { style: key.style, key: name + "_grid" },
                _react["default"].createElement(
                  "a",
                  { onClick: handleTestClick },
                  key.placeholder,
                  _react["default"].createElement("i", {
                    className: "fa fa-sort fa-lg grid-sort-icon",
                    "aria-hidden": "true",
                  })
                )
              );
            }
          }
        } else if (key.objectType === "ControlRowSelect") {
          return _react["default"].createElement(
            "th",
            { style: key.style, key: name + "_grid" },
            _react["default"].createElement(
              _nativeCheckBox,
              {
                type: "checkbox",
                checkedValue: true,
                uncheckedValue: false,
                showLabel: false,
                visible: true,
                onClick: handleSelectAllClick,
              },
              key.placeholder
            )
          );
        }
        if (key.objectType === "CheckBox" && key.selectAll) {
          return _react["default"].createElement(
            "th",
            { style: key.style, key: name + "_grid" },
            _react["default"].createElement(
              "a",
              { onClick: handleColumnSelectAllClick },
              _react["default"].createElement("i", {
                className: toggleIcon || "grid-sort-icon",
                "aria-hidden": "true",
              })
            ),
            " ",
            key.placeholder
          );
        } else {
          return _react["default"].createElement(
            "th",
            { style: key.style, key: name + "_grid" },
            key.placeholder
          );
        }
      }
    });
    return header;
  }
  function renderFilterBar() {
    if (props.item.schema.filterring) {
      let sqlcolumn, value;
      let columns =
        props.item.schema.controllerObject["tableFilterring"].filterBarHeader;
      let tableHeader = [];
      let filterData =
        props.item.schema.controllerObject["tableFilterring"].filterData;
      function getFilterBarData() {
        return props.item.schema.controllerObject["tableFilterring"].filterData;
      }
      function filterArray() {
        let i;
        for (i = 0; i < props.item.data.length; i++) {
          props.item.data[i]["_show"] = true;
        }
        function filterItems(arr, name, query) {
          return arr.filter(function (el, index) {
            if (
              el[name].toString().toLowerCase().indexOf(query.toLowerCase()) ===
              -1
            ) {
              arr[index]["_show"] = false;
            }
          });
        }
        let searchCriteria = getFilterBarData();
        Object.entries(searchCriteria).forEach(([key, value]) => {
          {
            filterItems(props.item.data, key, value);
          }
        });
        reRender();
      }
      function renderNumberField(properties, data, rowId, colId) {
        if (typeof properties.event === "undefined") {
          properties.event = {};
        }
        properties.event.onEnterKey = handleEnterKey;
        function handleChange(event, rowId, colId) {
          filterData[properties.sqlColumn] = event.target.value;
        }
        function handleEnterKey(event) {
          filterArray();
        }
        return _react["default"].createElement(_Components.TbNumberField, {
          item: properties,
          value: filterData[properties.sqlColumn],
          onEnterKey: handleEnterKey,
          name: properties.name,
          className: "form-control form-control-sm",
          rowId: rowId,
          colId: colId,
          visible: true,
          onChange: handleChange,
        });
      }
      function renderTextBox(properties, data, rowId, colId) {

        if (typeof properties.event === "undefined") {
          properties.event = {};
        }
        properties.event.onKeyPress = handleKeyPress;
        function handleKeyPress(event) {
          event.target.dispatchEvent(
            new KeyboardEvent("keypress", { key: "Enter" })
          );
        }
        properties.event.onEnterKey = handleEnterKey;
        function handleChange(event, rowId, colId) {
          if (properties.objectType === "CheckBox") {
            if (event.target.value === "true")
              filterData[properties.sqlColumn] = properties.checkedValue;
            else if (event.target.value === "false")
              filterData[properties.sqlColumn] = properties.uncheckedValue;
            else filterData[properties.sqlColumn] = "";
          } else {
            filterData[properties.sqlColumn] = event.target.value;
          }
        }
        function handleEnterKey(event) {
          filterArray();
        }
        return _react["default"].createElement(_Components.TbTextBox, {
          item: properties,
          value: filterData[properties.sqlColumn],
          onEnterKey: handleEnterKey,
          name: properties.name,
          className: "form-control form-control-sm",
          rowId: rowId,
          colId: colId,
          visible: true,
          onChange: handleChange,
        });
      }
      function renderDropDown(properties, data, rowId, colId) {
        if (typeof properties.event === "undefined") {
          properties.event = {};
        }
        function handleChange(event, rowId, colId) {
          filterData[properties.sqlColumn] = event.target.value;
          filterArray();
        }
        let item = _react["default"].createElement(_Components.TbDropDown, {
          item: properties,
          name: properties.name,
          className: "form-control form-control-sm",
          rowId: rowId,
          colId: colId,
          value: filterData[properties.sqlColumn],
          visible: true,
          onChange: handleChange,
        });
        return item;
      }
      function renderSearch() {
        function handleClick(event) {
          let searchCriteria = getFilterBarData();
          let rows;
          if (typeof props.item.event.onAdvanceSearch !== "undefined") {
            rows = props.item.event.onAdvanceSearch(
              event,
              searchCriteria,
              (data) => {
                rows = data;
                props.item.schema.controllerObject[
                  "tableFilterring"
                ].filterData = rows;
                props.item.schema.controllerObject[
                  "tableFilterring"
                ].selectedRow = -1;
                reRender();
              }
            );
          }
        }
        return _react["default"].createElement(
          "button",
          { className: "btn btn-link", onClick: handleClick },
          _react["default"].createElement("i", {
            className: "fa fa-search grid-filter-button",
          })
        );
      }
      Object.keys(columns).map((name) => {
        if (
          typeof columns[name] !== "undefined" &&
          columns[name].visible !== false
        )
          tableHeader[name] = { ...columns[name] };
        tableHeader[name].readOnly = false;
        tableHeader[name].event = {};
        tableHeader[name].data = {};
        tableHeader[name].data.value = "";
      });
      if (
        props.controller["delete"] ||
        typeof props.customButton !== "undefined" ||
        typeof props.customButton2 !== "undefined"
      ) {
        tableHeader["colController"] = { objectType: "FilterControl" };
      }
      let header = Object.keys(tableHeader).map((name, colIdx) => {
        let key = tableHeader[name];
        let cell;
        switch (key.objectType) {
          case "TextBox":
            cell = _react["default"].createElement(
              "th",
              { key: name + "-1" + colIdx, className: "border-top-0" },
              renderTextBox(columns[name], "", -1, colIdx)
            );
            break;
          case "DateField":
            cell = _react["default"].createElement(
              "th",
              { key: name + "-1" + colIdx, className: "border-top-0" },
              // renderTextBox(columns[name], "", -1, colIdx)
            );
            break;
          case "IntegerField":
            cell = _react["default"].createElement(
              "th",
              { key: name + "-1" + colIdx, className: "border-top-0" },
              renderNumberField(columns[name], "", -1, colIdx)
            );
            break;
          case "NumberField":
            cell = _react["default"].createElement(
              "th",
              { key: name + "-1" + colIdx, className: "border-top-0" },
              renderNumberField(columns[name], "", -1, colIdx)
            );
            break;
          case "CheckBox":
            cell = _react["default"].createElement("th", {
              key: name + "-1" + colIdx,
              className: "border-top-0",
            });
            break;
          case "DropDown":
            cell = _react["default"].createElement(
              "th",
              { key: name + "-1" + colIdx, className: "border-top-0" },
              renderDropDown(columns[name], "", -1, colIdx)
            );
            break;
          case "FilterControl":
            cell = _react["default"].createElement("th", {
              key: name + "-1" + colIdx,
              className: "border-top-0",
            });
            break;
          default:
            cell = null;
        }
        return cell;
      });
      return _react["default"].createElement(
        "tr",
        { className: "grid-filter-bar" },
        header
      );
    }
  }
  function resetFilterData() {
    if (props.item.schema.filterring) {
      let columns =
        props.item.schema.controllerObject["tableFilterring"].filterData;
      Object.keys(columns).map((name) => {
        columns[name] = "";
      });
    }
  }
  function renderTableData() {

    let data = [...dataList];
    let itemVisible = false;
    var i;

    if (data.length < props.defaultRowCount) {
      var length = props.defaultRowCount - data.length;
      for (i = 0; i < length; i++) {
        data[data.length] = {};
        data[data.length - 1]["_readonly"] = true;
      }
    }
    let tableHeader = [];
    if (props.controller["delete"]) {
      Object.keys(objectList).map((name) => {
        tableHeader[name] = objectList[name];
      });
      tableHeader["colControlDel"] = { objectType: "Control", delete: true };
    } else if (
      typeof props.customButton !== "undefined" ||
      typeof props.customButton2 !== "undefined"
    ) {
      Object.keys(objectList).map((name) => {
        tableHeader[name] = objectList[name];
      });
      tableHeader["colControlDel"] = { objectType: "Control", delete: false };
    } else {
      tableHeader = objectList;
    }
    return data.map((dataItem, rowIdx) => {


      let item;
      if (dataItem["_show"] !== false) {
        item = Object.keys(tableHeader).map((name, colIdx) => {
          let key = tableHeader[name];
          let cell;

          itemVisible = typeof key.visible === "undefined" ? true : key.visible;
          if (itemVisible) {
            if (dataItem._readonly) {
              if (dataItem._rowstate) {
                if (key.objectType === "CheckBox") {
                  cell = _react["default"].createElement(
                    "td",

                    { key: name + rowIdx + colIdx, style: key.style },
                    renderCheckBox(
                      key,
                      dataItem[key.sqlColumn],
                      rowIdx,
                      colIdx,
                      true
                    )
                  );
                } else if (key.objectType === "DropDown") {
                  cell = _react["default"].createElement(
                    "td",

                    { key: name + rowIdx + colIdx, style: key.style },
                    renderDropDown(
                      key,
                      dataItem[key.sqlColumn],
                      rowIdx,
                      colIdx,
                      true
                    )
                  );
                } else if (
                  key.objectType === "Control" &&
                  rowIdx < dataList.length
                ) {
                  cell = _react["default"].createElement(
                    _react["default"].Fragment,
                    null,
                    _react["default"].createElement(
                      "td",

                      { key: name + rowIdx + colIdx, style: key.style },
                      renderDelete(key, rowIdx),
                      renderCustomButton(key, rowIdx),
                      renderCustomButton2(key, rowIdx)
                    )
                  );
                } else {
                  let style = {};
                  if (rowIdx >= 0) {
                    if (dataList[rowIdx]["_rowstate"] === "DELETED")
                      style = {
                        style: style,
                        textDecorationLine: "line-through",
                      };
                  }
                  cell = _react["default"].createElement(
                    "td",

                    { key: name + rowIdx + colIdx, style: key.style },
                    _react["default"].createElement(
                      "label",
                      { style: style },
                      dataItem[key.sqlColumn]
                    )
                  );
                }
              } else {
                cell = _react["default"].createElement(
                  "td",

                  { key: name + rowIdx + colIdx, style: key.style },
                  _react["default"].createElement(
                    "label",
                    { key: name + "LABEL" + rowIdx + colIdx },
                    dataItem[key.sqlColumn]
                  )
                );
              }
            } else {
              if (key.editable ? true : false) {
                switch (key.objectType) {
                  case "TextBox":
                    cell = _react["default"].createElement(
                      "td",

                      { key: name + rowIdx + colIdx, style: key.style },
                      renderTextBox(
                        key,
                        dataItem[key.sqlColumn],
                        rowIdx,
                        colIdx
                      )
                    );
                    break;
                  case "NumberField":
                    cell = _react["default"].createElement(
                      "td",
                      { key: name + rowIdx + colIdx, style: key.style },
                      renderNumberField(
                        key,
                        dataItem[key.sqlColumn],
                        rowIdx,
                        colIdx
                      )
                    );
                    break;
                  case "IntegerField":
                    cell = _react["default"].createElement(
                      "td",
                      { key: name + rowIdx + colIdx, style: key.style },
                      renderIntegerField(
                        key,
                        dataItem[key.sqlColumn],
                        rowIdx,
                        colIdx
                      )
                    );
                    break;
                  case "DateField":
                    cell = _react["default"].createElement(
                      "td",
                      { key: name + rowIdx + colIdx, style: key.style },
                      renderDateField(
                        key,
                        dataItem[key.sqlColumn],
                        rowIdx,
                        colIdx
                      )
                    );

                    break;
                  case "CheckBox":
                    cell = _react["default"].createElement(
                      "td",
                      { key: name + rowIdx + colIdx, style: key.style },
                      renderCheckBox(
                        key,
                        dataItem[key.sqlColumn],
                        rowIdx,
                        colIdx
                      )
                    );
                    break;
                  case "DropDown":
                    cell = _react["default"].createElement(
                      "td",
                      { key: name + rowIdx + colIdx, style: key.style },
                      renderDropDown(
                        key,
                        dataItem[key.sqlColumn],
                        rowIdx,
                        colIdx
                      )
                    );
                    break;
                  case "Link":
                    cell = _react["default"].createElement(
                      "td",
                      { key: name + rowIdx + colIdx, style: key.style },
                      renderLink(key, dataItem[key.sqlColumn], rowIdx, colIdx)
                    );
                    break;
                  default:
                    cell = _react["default"].createElement(
                      "td",
                      {
                        key: name + rowIdx + colIdx,
                        style: key.style,
                        onClick: () => { },
                      },
                      dataItem[key.sqlColumn]
                    );
                }
              } else {
                if (key.objectType === "CheckBox") {
                  cell = _react["default"].createElement(
                    "td",
                    { key: name + rowIdx + colIdx, style: key.style },
                    renderCheckBox(
                      key,
                      dataItem[key.sqlColumn],
                      rowIdx,
                      colIdx,
                      true
                    )
                  );
                } else if (key.objectType === "Link") {
                  cell = _react["default"].createElement(
                    "td",
                    { key: name + rowIdx + colIdx, style: key.style },
                    renderLink(key, dataItem[key.sqlColumn], rowIdx, colIdx)
                  );
                } else if (
                  key.objectType === "Control" &&
                  rowIdx < dataList.length
                ) {
                  cell = _react["default"].createElement(
                    _react["default"].Fragment,
                    null,
                    _react["default"].createElement(
                      "td",
                      { key: name + rowIdx + colIdx, style: key.style },
                      renderDelete(key, rowIdx),
                      renderCustomButton(key, rowIdx),
                      renderCustomButton2(key, rowIdx)
                    )
                  );
                } else if (
                  key.objectType === "ControlRowSelect" &&
                  rowIdx < dataList.length
                ) {
                  cell = _react["default"].createElement(
                    _react["default"].Fragment,
                    null,
                    _react["default"].createElement(
                      "td",
                      { key: name + rowIdx + colIdx, style: key.style },
                      renderRowSelect(key, rowIdx)
                    )
                  );
                } else {
                  let style = {};
                  if (rowIdx >= 0) {
                    if (dataList[rowIdx]["_rowstate"] === "DELETED")
                      style = {
                        style: style,
                        textDecorationLine: "line-through",
                      };
                  }
                  cell = _react["default"].createElement(
                    "td",
                    { key: name + rowIdx + colIdx, style: key.style },
                    _react["default"].createElement(
                      "label",
                      { style: style },
                      dataItem[key.sqlColumn]
                    )
                  );
                }
              }
            }
          }
          return cell;
        });
        if (itemVisible)
          return _react["default"].createElement("tr", { key: rowIdx }, item);
      }
    });
  }
  function handleChange(event, rowId, colId) {


    let { name, value, checked, type } = event.target;

    let objList = props.columns;
    let sqlColumn = objList[name].sqlColumn;
    dataList = props.item.data;
    if (typeof dataList[rowId]["_rowstate"] !== "undefined") {
      if (dataList[rowId]["_rowstate"] !== "NEW") {
        dataList[rowId]["_rowstate"] = "MODIFIED";
      }
    } else {
      dataList[rowId]["_rowstate"] = "MODIFIED";
    }
    if (rowId === -1) {
      if (type === "checkbox") {
        newRowController.data[sqlColumn] = checked
          ? typeof objList[name].checkedValue !== "undefined"
            ? objList[name].checkedValue
            : "Y"
          : typeof objList[name].uncheckedValue !== "undefined"
            ? objList[name].uncheckedValue
            : "N";
      } else {
        newRowController.data[sqlColumn] = value;
      }
      createNewRowController(false);
      setNewRowController({ ...newRowController });
      dataList[dataList.length - 1] = { ...newRowController.data };
    } else {
      let keys = Object.keys(dataList[rowId]);
      if (type === "checkbox") {
        dataList[rowId][sqlColumn] = checked
          ? typeof objList[name].checkedValue !== "undefined"
            ? objList[name].checkedValue
            : "Y"
          : typeof objList[name].uncheckedValue !== "undefined"
            ? objList[name].uncheckedValue
            : "N";


      } else {
        dataList[rowId][sqlColumn] = value;
      }
    }

    props.onChange(event, rowId, colId);

    if (typeof props.onChangeWithColName !== "undefined") {

      props.onChangeWithColName(event, rowId, name);
    }

    reRender();

  }

  function handlechangeOnBlur(event, rowId, name) {

    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event, rowId, name);
    }
    reRender();
  }


  function handleLinkClick(event, rowId, colId) {
    if (typeof props.item.event.onLinkClick !== "undefined")
      props.item.event.onLinkClick(event, rowId, colId);
  }
  function renderNumberField(properties, data, rowId, colId, disabled) {
    let style = {};
    if (rowId >= 0) {
      if (dataList[rowId]["_rowstate"] === "DELETED")
        style = { style: style, textDecorationLine: "line-through" };
    }
    return _react["default"].createElement(_Components.TbNumberField, {
      item: properties,
      id: properties.name + rowId + colId,
      className: "form-control form-control-sm",
      style: style,
      rowId: rowId,
      styleName: properties.styleName,
      colId: colId,
      item: properties,
      placeholder: rowId === -1 ? properties.placeholder : undefined,
      name: properties.name,
      value: data,
      visible: true,
      onChange: handleChange,

    });
  }

  function renderDateField(properties, data, rowId, colId, disabled) {

    let style = {};
    if (rowId >= 0) {
      if (dataList[rowId]["_rowstate"] === "DELETED")
        style = { style: style, textDecorationLine: "line-through" };
    }
    return _react["default"].createElement(_Components.TbDateField, {
      item: properties,
      id: properties.name + rowId + colId,
      className: "form-control form-control-sm",
      style: style,
      rowId: rowId,
      styleName: properties.styleName,
      colId: colId,
      item: properties,
      placeholder: rowId === -1 ? properties.placeholder : undefined,
      name: properties.name,
      value: data,
      visible: true,
      onChange: handleChange,

    });
  }

  function renderIntegerField(properties, data, rowId, colId, disabled) {

    let style = {};
    if (rowId >= 0) {
      if (dataList[rowId]["_rowstate"] === "DELETED")
        style = { style: style, textDecorationLine: "line-through" };
    }
    return _react["default"].createElement(_Components.TbIntegerField, {
      item: properties,
      id: properties.name + rowId + colId,
      className: "form-control form-control-sm",
      style: style,
      styleName: properties.styleName,
      rowId: rowId,
      colId: colId,
      item: properties,
      placeholder: rowId === -1 ? properties.placeholder : undefined,
      name: properties.name,
      value: data,
      visible: true,
      onChange: handleChange,
      onBlur: handlechangeOnBlur,

    });
  }
  function renderCheckBox(properties, data, rowId, colId, disabled) {
    function handleClick(event) { }
    return _react["default"].createElement(_Components.TbCheckBox, {
      item: properties,
      id: properties.name,
      type: "checkbox",
      rowId: rowId,
      colId: colId,
      item: properties,
      name: properties.name,
      value: data,
      disabled: disabled,
      visible: true,
      onChange: handleChange,
      onClick: handleClick,
    });
  }
  function renderLink(properties, data, rowId, colId) {
    let style = {};
    if (rowId >= 0) {
      if (dataList[rowId]["_rowstate"] === "DELETED")
        style = { style: style, textDecorationLine: "line-through" };
    }
    return _react["default"].createElement(_Components.TbLink, {
      item: properties,
      name: properties.name,
      style: style,
      rowId: rowId,
      colId: colId,
      placeholder: rowId === -1 ? properties.placeholder : undefined,
      value: data,
      visible: true,
      onClick: handleLinkClick,
    });
  }
  function renderTextBox(properties, data, rowId, colId) {

    let style = {};
    if (rowId >= 0) {
      if (dataList[rowId]["_rowstate"] === "DELETED")
        style = { style: style, textDecorationLine: "line-through" };
    }
    return _react["default"].createElement(_Components.TbTextBox, {
      item: properties,
      name: properties.name,
      className: "form-control form-control-sm",
      style: style,
      rowId: rowId,
      styleName: properties.styleName,
      colId: colId,
      placeholder: rowId === -1 ? properties.placeholder : undefined,
      value: data,
      visible: true,
      onChange: handleChange,
      onChangeWithColName: handleChange,



    });
  }
  function renderDropDown(properties, data, rowId, colId, disabled) {
    let style = {};
    if (rowId >= 0) {
      if (dataList[rowId]["_rowstate"] === "DELETED")
        style = { style: style, textDecorationLine: "line-through" };
    }
    // Exclusive options: exclude values already selected in other non-deleted rows
    let effectiveProperties = properties;
    if (properties.exclusiveOptions && properties.options && rowId >= 0) {
      const selectedInOtherRows = new Set(
        dataList
          .filter((row, idx) => idx !== rowId && row["_rowstate"] !== "DELETED")
          .map(row => row[properties.sqlColumn])
          .filter(v => v !== undefined && v !== null && v !== "" && v !== 0)
      );
      if (selectedInOtherRows.size > 0) {
        const filteredOptions = properties.options.filter(opt =>
          !selectedInOtherRows.has(opt.value) || opt.value === data
        );
        effectiveProperties = { ...properties, options: filteredOptions };
      }
    }
    let item = _react["default"].createElement(_Components.TbDropDown, {
      key: properties.name + rowId + colId,
      item: effectiveProperties,
      name: properties.name,
      disabled: disabled,
      className: "form-control form-control-sm",
      style: style,
      rowId: rowId,
      colId: colId,
      placeholder: rowId === -1 ? properties.placeholder : undefined,
      value: data,
      visible: true,
      onChange: handleChange,
    });
    return item;
  }
  function renderDelete(properties, rowId) {
    let deleteEnabled = true;
    let deleteVisible = true;
    function handleClick(event) {
      if (dataList[rowId]["_rowstate"] === "NEW") {
        dataList.splice(rowId, 1);
        if (typeof props.onRowDelete !== "undefined") {
          props.onRowDelete(event);
        }
      } else {
        dataList[rowId]["_rowstate"] = "DELETED";
        if (typeof props.onRowDelete !== "undefined") {
          props.onRowDelete(event, rowId);
        }
      }
      reRender();
    }
    if (typeof props.item.event.isDeleteEnabled !== "undefined") {
      deleteEnabled = props.item.event.isDeleteEnabled(dataList[rowId]);
    }
    if (typeof props.item.event.isDeleteVisible !== "undefined") {
      deleteVisible = props.item.event.isDeleteVisible(dataList[rowId]);
    }
    if (
      props.controller["delete"] &&
      typeof props.deleteButton !== "undefined" &&
      modeEditable &&
      deleteVisible
    )
      return _react["default"].createElement(
        "button",
        {
          disabled: !deleteEnabled,
          className: "btn btn-link",
          onClick: handleClick,
        },
        props.deleteButton
      );
    return _react["default"].createElement(_react["default"].Fragment, null);
  }
  function renderRowSelect(properties, rowId) {
    function handleRowSelectClick(event) {
      dataList[rowId]["_rowselected"] = !dataList[rowId]["_rowselected"];
      if (dataList[rowId]["_rowstate"] === "NEW") {
        if (typeof props.onRowSelect !== "undefined") {
          props.onRowSelect(event);
        }
      } else {
        if (typeof props.onRowSelect !== "undefined") {
          props.onRowSelect(event, rowId);
        }
      }
      reRender();
    }
    if (props.item.schema.rowSelection)
      return _react["default"].createElement(
        _nativeCheckBox,
        {
          type: "checkbox",
          checkedValue: true,
          uncheckedValue: false,
          showLabel: false,
          visible: true,
          checked: dataList[rowId]["_rowselected"],
          onClick: handleRowSelectClick,
        },
        props.deleteButton
      );
    return _react["default"].createElement(_react["default"].Fragment, null);
  }
  function renderCustomButton(properties, rowId) {
    let customButton1Enabled = true;
    let customButton1Visible = true;
    function handleClick(event) {
      if (
        dataList[rowId]["_rowstate"] !== "NEW" &&
        dataList[rowId]["_rowstate"] !== "DELETED"
      ) {
        if (typeof props.onRowCustomButton !== "undefined") {
          props.onRowCustomButton(event, rowId);
        }
      } else {
        props.onRowCustomButton(event, undefined);
      }
      reRender();
    }
    if (typeof props.item.event.isCustomButton1Enabled !== "undefined") {
      customButton1Enabled = props.item.event.isCustomButton1Enabled(
        dataList[rowId]
      );
    }
    if (typeof props.item.event.isCustomButton1Visible !== "undefined") {
      customButton1Visible = props.item.event.isCustomButton1Visible(
        dataList[rowId]
      );
    }
    if (
      typeof props.customButton !== "undefined" &&
      modeEditable &&
      customButton1Visible
    )
      return _react["default"].createElement(
        "button",
        {
          disabled: !customButton1Enabled,
          className: "btn btn-link",
          onClick: handleClick,
        },
        props.customButton
      );
    return _react["default"].createElement(_react["default"].Fragment, null);
  }
  function renderCustomButton2(properties, rowId) {
    let customButton2Enabled = true;
    let customButton2Visible = true;
    function handleClick(event) {
      if (
        dataList[rowId]["_rowstate"] !== "NEW" &&
        dataList[rowId]["_rowstate"] !== "DELETED"
      ) {
        if (typeof props.onRowCustomButton2 !== "undefined") {
          props.onRowCustomButton2(event, rowId);
        }
      } else {
        props.onRowCustomButton(event, undefined);
      }
      reRender();
    }
    if (typeof props.item.event.isCustomButton2Enabled !== "undefined") {
      customButton2Enabled = props.item.event.isCustomButton2Enabled(
        dataList[rowId]
      );
    }
    if (typeof props.item.event.isCustomButton2Visible !== "undefined") {
      customButton2Visible = props.item.event.isCustomButton2Visible(
        dataList[rowId]
      );
    }
    if (
      typeof props.customButton2 !== "undefined" &&
      modeEditable &&
      customButton2Visible
    )
      return _react["default"].createElement(
        "button",
        {
          disabled: !customButton2Enabled,
          className: "btn btn-link",
          onClick: handleClick,
        },
        props.customButton2
      );
    return _react["default"].createElement(_react["default"].Fragment, null);
  }
  function createNewRowController(initialize) {
    let item;
    if (initialize) {
      Object.keys(objectList).map((name, colIdx) => {
        let sqlColumn = objectList[name].sqlColumn;
        switch (objectList[name].objectType) {
          case "CheckBox":
            newRowController.data[sqlColumn] =
              typeof objectList[name].uncheckedValue !== "undefined"
                ? objectList[name].uncheckedValue
                : "N";
            break;
          default:
            newRowController.data[sqlColumn] = "";
            break;
        }
      });
      newRowController.data["_rowstate"] = "NEW";
    }
    item = Object.keys(objectList).map((name, colIdx) => {
      let cell;
      let key = objectList[name];
      switch (key.objectType) {
        case "TextBox":
          cell = _react["default"].createElement(
            "td",
            { key: objectList.length + colIdx },
            renderTextBox(key, newRowController.data[key.sqlColumn], -1, colIdx)
          );
          break;
        case "NumberField":
          cell = _react["default"].createElement(
            "td",
            { key: objectList.length + colIdx },
            renderNumberField(
              key,
              newRowController.data[key.sqlColumn],
              -1,
              colIdx
            )
          );
          break;
        case "IntegerField":
          cell = _react["default"].createElement(
            "td",
            { key: objectList.length + colIdx },
            renderIntegerField(
              key,
              newRowController.data[key.sqlColumn],
              -1,
              colIdx
            )
          );
          break;
        case "CheckBox":
          cell = _react["default"].createElement(
            "td",
            { key: objectList.length + colIdx },
            renderCheckBox(
              key,
              newRowController.data[key.sqlColumn],
              -1,
              colIdx
            )
          );
          break;
        default:
          cell = _react["default"].createElement("td", {
            key: objectList.length + colIdx,
          });
          break;
      }
      return cell;
    });
    item = item || _react["default"].createElement("td", null, "delete");
    newRowController.renderItems = _react["default"].createElement(
      "tr",
      { style: { backgroundColor: "#dff0d8" } },
      item
    );
    setNewRowController({ ...newRowController });
  }
  function renderAddNewRow() {
    return newRowController.show && newRowController.renderItems;
  }
  function renderControlHeader(childProps) {
    function handleNew(event) {
      let { name } = event.target;
      if (newRowController.show === true) {
        createNewRowController(true);
      } else {
        newRowController.show = true;
        createNewRowController(true);
      }
      dataList[dataList.length] = { ...newRowController.data };
      if (typeof props.onRowNew !== "undefined") {
        props.onRowNew(event);
      }
    }
    return _react["default"].createElement(
      _react["default"].Fragment,
      null,
      _react["default"].createElement(
        _nativeButton,
        {
          type: "button",
          label: "New",
          className: childProps.className,
          name: "buttonNew",
          visible: modeEditable,
          onClick: handleNew,
        },
        _react["default"].createElement("i", { className: "fas fa-plus" })
      )
    );
  }
  props.item.resetFilterData = resetFilterData;
  function renderWrappedChildren(children, item) {

    return _react["default"].Children.map(children, (child) => {
      let shouldReturn = true;
      if (!child.props) {
        return child;
      }
      if (typeof child.props.typeName !== "undefined") {
        if (child.props.typeName === "GridHeader") {
          return _react["default"].createElement(
            _react["default"].Fragment,
            null,
            _react["default"].createElement(
              "table",
              { style: props.style, className: props.className, id: item.schema.name },
              _react["default"].createElement(
                "thead",
                null,
                _react["default"].createElement(
                  "tr",
                  null,
                  renderTableHeader()
                ),
                renderFilterBar()
              ),
              _react["default"].createElement("tbody", null, renderTableData())
            )
          );
        } else if (child.props.typeName === "AddRowButton") {
          return renderControlHeader(child.props);
        }
      }
      if (child.props.children) {
        return _react["default"].cloneElement(child, {
          children: renderWrappedChildren(child.props.children, item),
        });
      }
      return child;
    });
  }
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    renderWrappedChildren(props.children, props.item)
  );
}
export function _nativeFileSelector(props) {
  let [value, setValue] = (0, _react.useState)(props.value);
  let [rendered, setRendered] = (0, _react.useState)(true);
  let [image, setImage] = (0, _react.useState)(props.imgSrc);
  let typedItem;
  function reRender() {
    setRendered(!rendered);
  }
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let hiddenFileInput = _react["default"].useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (event.target.files[0])
      setImage(URL.createObjectURL(event.target.files[0]));
    if (typeof props.onChange !== "undefined") {
      props.onChange(event);
    }
  };
  if (props.type === "image") {
    typedItem = _react["default"].createElement("input", {
      type: "image",
      src: image,
      width: props.width,
      height: props.height,
      className: props.className,
      onClick: handleClick,
    });
  } else if (props.type === "button") {
    typedItem = _react["default"].createElement(
      "button",
      { type: "button", className: props.className, onClick: handleClick },
      props.children
    );
  }
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    _react["default"].createElement(
      _react["default"].Fragment,
      null,
      typedItem,
      _react["default"].createElement("input", {
        type: "file",
        id: "file-upload",
        ref: hiddenFileInput,
        accept: props.accept,
        onChange: handleChange,
        style: { display: "none" },
      })
    )
  );
}
export function _nativeDualStateSelector(props) {
  let [checkedList, setCheckedList] = (0, _react.useState)([]);
  let items = props.item.items;
  function handleChange(event) {
    let { id, checked } = event.target;
    if (typeof props.onChange !== "undefined") {
      let newCheckedList = [];
      checkedList.forEach((value, index) => {
        if (checked === false && value !== id)
          newCheckedList[newCheckedList.length] = value;
        else if (checked) newCheckedList[newCheckedList.length] = value;
      });
      if (checked) newCheckedList[newCheckedList.length] = id;
      setCheckedList([...newCheckedList]);
      props.onChange(event, newCheckedList);
    }
  }
  function resetCheckedList() {
    setCheckedList([]);
  }
  props.item.resetCheckedList = resetCheckedList;
  function getNonSelectedList() {
    let comp = items.map((item, index) => {
      if (item.selected === false) {
        let nonSelectedItem = _react["default"].createElement(
          "div",
          {
            className:
              typeof props.cardClassName === "undefined"
                ? "col-xl-3 col-md-4 col-sm-6"
                : props.cardClassName,
          },
          _react["default"].createElement(
            "div",
            {
              className:
                typeof props.selectableColor === "undefined"
                  ? "card text-white mb-2 bg-warning"
                  : "card text-white mb-2 " + props.selectableColor,
            },
            _react["default"].createElement(
              "div",
              { className: "card-body" },
              _react["default"].createElement(
                "div",
                { className: "row", style: props.cardStyle },
                _react["default"].createElement(
                  "div",
                  { className: "col-10 col-sm-10" },
                  item.display
                ),
                _react["default"].createElement(
                  "div",
                  { className: "col-2 pt-2" },
                  _react["default"].createElement(
                    "div",
                    { className: "form-check" },
                    _react["default"].createElement(_nativeCheckBox, {
                      id: item.id,
                      style: item.style,
                      type: "checkbox",
                      className: "form-check-input",
                      name: item.name,
                      disabled: false,
                      visible: true,
                      showLabel: false,
                      onChange: handleChange,
                    })
                  )
                )
              )
            )
          )
        );
        return nonSelectedItem;
      }
    });
    return comp;
  }
  function getSelectedList() {
    let comp = items.map((item, index) => {
      if (item.selected === true) {
        let selectedItem = _react["default"].createElement(
          "div",
          {
            className:
              typeof props.cardClassName === "undefined"
                ? "col-xl-3 col-md-4 col-sm-6"
                : props.cardClassName,
          },
          _react["default"].createElement(
            "div",
            {
              className:
                typeof props.nonSelectableColor === "undefined"
                  ? "card text-white mb-2 bg-success"
                  : "card text-white mb-2 " + props.nonSelectableColor,
            },
            _react["default"].createElement(
              "div",
              { className: "card-body" },
              _react["default"].createElement(
                "div",
                { className: "row", style: props.cardStyle },
                _react["default"].createElement(
                  "div",
                  { className: "col-10 col-sm-10" },
                  item.display
                )
              )
            )
          )
        );
        return selectedItem;
      }
    });
    return comp;
  }
  let head = _react["default"].createElement(
    "div",
    {
      className:
        typeof props.className === "undefined"
          ? "row overflow-auto my-card-set"
          : props.className,
      style: props.style,
    },
    getSelectedList(),
    getNonSelectedList()
  );
  return head;
}
export function _nativeDropDown(props) {
  let [rendered, setRendered] = (0, _react.useState)(true);
  function reRender() {
    setRendered(!rendered);
  }
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [visible, setVisible] = (0, _react.useState)(props.visible);
  (0, _react.useEffect)(() => {
    setVisible(props.visible);
  }, [props.visible]);
  function handleChange(event) {
    setValue(event.target.value);
    if (typeof props.onChange !== "undefined") {
      props.onChange(event);
    }
  }
  function handleBlur(event) {
    if (typeof props.onBlur !== "undefined") {
      props.onBlur(event);
    }
  }
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    visible &&
    _react["default"].createElement(
      "select",
      {
        id: props.id,
        className: props.className,
        disabled: props.disabled,
        readOnly: props.readOnly,
        style: props.style,
        name: props.name,
        value: value,
        placeholder: props.placeholder,
        onChange: handleChange,
        onBlur: handleBlur,
      },
      props.options.map((item) =>
        _react["default"].createElement(
          "option",
          { key: item.value, value: item.value },
          item.text
        )
      )
    )
  );
}
export function _nativeCheckBox(props) {
  let [visible, setVisible] = (0, _react.useState)(props.visible);
  (0, _react.useEffect)(() => {
    setVisible(props.visible);
  }, [props.visible]);
  function handleChange(event) {
    if (typeof props.onChange !== "undefined") {
      props.onChange(event);
    }
  }
  function handleClick(event) {
    if (typeof props.onClick !== "undefined") {
      props.onClick(event);
    }
  }
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    visible &&
    (props.showLabel
      ? _react["default"].createElement(
        "label",
        null,
        _react["default"].createElement("input", {
          id: props.id,
          type: props.type,
          className: props.className,
          checked: props.checked,
          style: props.style,
          key: props.name,
          name: props.name,
          onClick: handleClick,
          onChange: handleChange,
        }),
        props.label
      )
      : _react["default"].createElement("input", {
        id: props.id,
        type: props.type,
        className: props.className,
        checked: props.checked,
        style: props.style,
        key: props.name,
        name: props.name,
        disabled: props.disabled,
        onClick: handleClick,
        onChange: handleChange,
      }))
  );
}
export function _nativeButton(props) {
  let [value, setValue] = (0, _react.useState)(props.value);
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [props.value]);
  let [visible, setVisible] = (0, _react.useState)(props.visible);
  (0, _react.useEffect)(() => {
    setVisible(props.visible);
  }, [props.visible]);
  function handleClick(event) {
    setValue(event.target.value);
    if (typeof props.onClick !== "undefined") {
      props.onClick(event);
    }
  }

  return _react["default"].createElement(

    _react["default"].Fragment,
    null,
    visible &&
    _react["default"].createElement(
      "button",
      {
        type: props.type,
        className: props.className,
        style: props.style,
        name: props.name,
        key: props.name,
        value: props.value,
        title: props.label,
        disabled: props.disabled,
        onClick: handleClick,
      },
      typeof props.children === "undefined" ? props.label : props.children
    )
  );
}
export function _nativeSearchGrid(props) {
  let [rendered, setRendered] = (0, _react.useState)(true);
  let [item, setItem] = (0, _react.useState)({});
  let [isGridActive, setIsGridActive] = (0, _react.useState)(false);
  let [rowSelected, setRowSelected] = (0, _react.useState)(false);
  let [validated, setValidated] = (0, _react.useState)(false);
  let [messageString, setMessageString] = (0, _react.useState)("");
  let [page, setPage] = (0, _react.useState)(0);
  let [next, setNext] = (0, _react.useState)(false);
  let [previous, setPrevious] = (0, _react.useState)(false);
  if (
    typeof props.item.schema.controllerObject["controllerSearchBar"] ===
    "undefined"
  ) {
    let columns = props.item.schema.controllerObject;
    props.item.schema.controllerObject["controllerSearchBar"] = {
      objectType: "SearchBar",
      searchBarHeader: [],
      searchedData: [],
    };
    let tableHeader =
      props.item.schema.controllerObject["controllerSearchBar"].searchBarHeader;
    Object.keys(columns).map((name) => {
      if (
        typeof columns[name].schema !== "undefined" &&
        columns[name].schema.advanceSearch
      ) {
        tableHeader[name] = { ...columns[name] };
        tableHeader[name].schema.searchable = true;
        tableHeader[name].schema.readOnly = false;
        tableHeader[name].schema.visible = true;
        tableHeader[name].event = {};
        tableHeader[name].data.value = "";
      }
    });
  }
  function reRender() {
    setRendered(!rendered);
  }
  function renderHeaderTitle() {
    let columns =
      props.item.schema.controllerObject["controllerSearchBar"].searchBarHeader;
    let tableHeader = [];
    Object.keys(columns).map((name) => {
      if (
        typeof columns[name].schema !== "undefined" &&
        columns[name].schema.advanceSearch
      )
        tableHeader[name] = columns[name];
    });
    let header = Object.keys(tableHeader).map((name, colIdx) => {
      let key = tableHeader[name];
      if (Object.keys(tableHeader).length === colIdx + 1)
        return _react["default"].createElement(
          _react["default"].Fragment,
          null,
          _react["default"].createElement(
            "th",
            {
              style: key.style,
              className: "border-bottom-0",
              key: name + "_grid",
            },
            key.schema.labelValue
          ),
          _react["default"].createElement("th", {
            className: "border-bottom-0",
          })
        );
      return _react["default"].createElement(
        "th",
        { style: key.style, className: "border-bottom-0", key: name + "_grid" },
        key.schema.labelValue
      );
    });
    return header;
  }
  function getSearchBarData() {
    let columns =
      props.item.schema.controllerObject["controllerSearchBar"].searchBarHeader;
    let searchBarData = {};
    let sqlcolumn, value;
    Object.keys(columns).map((name) => {
      if (
        typeof columns[name].data !== "undefined" &&
        columns[name].schema.advanceSearch
      ) {
        sqlcolumn = columns[name].data.sqlcolumn;
        value = columns[name].data.value;
        Object.assign(searchBarData, { [sqlcolumn]: value });
      }
    });
    return searchBarData;
  }
  function resetSearchBarData() {
    let columns =
      props.item.schema.controllerObject["controllerSearchBar"].searchBarHeader;
    Object.keys(columns).map((name) => {
      if (
        typeof columns[name].data !== "undefined" &&
        columns[name].schema.advanceSearch
      ) {
        if (typeof columns[name].setValue !== "undefined")
          columns[name].setValue("");
        else columns[name].data.value = "";
      }
    });
  }
  function renderSearchBar() {
    let columns =
      props.item.schema.controllerObject["controllerSearchBar"].searchBarHeader;
    let tableHeader = [];
    function renderCheckBox(properties, data, rowId, colId, disabled) {
      properties.schema.showLabel = false;
      if (typeof properties.event === "undefined") {
        properties.event = {};
      }
      properties.event.onEnterKey = handleEnterKey;
      function handleEnterKey(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onAdvanceSearch !== "undefined") {
          rows = props.item.event.onAdvanceSearch(
            event,
            searchCriteria,
            (data, message, page, next, previous) => {
              rows = data;
              setMessageString(message);
              setPage(typeof page !== "undefined" ? page : false);
              setNext(typeof next !== "undefined" ? next : false);
              setPrevious(typeof previous !== "undefined" ? previous : false);
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].searchedData = rows;
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      return _react["default"].createElement(_Components.CheckBox, {
        item: properties,
        id: properties.name,
        type: "checkbox",
        rowId: rowId,
        colId: colId,
        item: properties,
        name: properties.name,
        value: data,
        disabled: disabled,
        visible: true,
      });
    }
    function renderNumberField(properties, data, rowId, colId) {
      if (typeof properties.event === "undefined") {
        properties.event = {};
      }
      properties.event.onEnterKey = handleEnterKey;
      function handleEnterKey(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onAdvanceSearch !== "undefined") {
          rows = props.item.event.onAdvanceSearch(
            event,
            searchCriteria,
            (data, message, page, next, previous) => {
              rows = data;
              setMessageString(message);
              setPage(typeof page !== "undefined" ? page : false);
              setNext(typeof next !== "undefined" ? next : false);
              setPrevious(typeof previous !== "undefined" ? previous : false);
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].searchedData = rows;
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      return _react["default"].createElement(_Components.NumberField, {
        item: properties,
        name: properties.name,
        className: "form-control form-control-sm",
        rowId: rowId,
        colId: colId,
        value: properties.data.value,
        visible: true,
      });
    }
    function renderTextBox(properties, data, rowId, colId) {
      if (typeof properties.event === "undefined") {
        properties.event = {};
      }
      properties.event.onKeyPress = handleKeyPress;
      function handleKeyPress(event) {
        event.target.dispatchEvent(
          new KeyboardEvent("keypress", { key: "Enter" })
        );
      }
      properties.event.onEnterKey = handleEnterKey;
      function handleEnterKey(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onAdvanceSearch !== "undefined") {
          rows = props.item.event.onAdvanceSearch(
            event,
            searchCriteria,
            (data, message, page, next, previous) => {
              rows = data;
              setMessageString(message);
              setPage(typeof page !== "undefined" ? page : false);
              setNext(typeof next !== "undefined" ? next : false);
              setPrevious(typeof previous !== "undefined" ? previous : false);
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].searchedData = rows;
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      return _react["default"].createElement(_Components.TextBox, {
        item: properties,
        name: properties.name,
        className: "form-control form-control-sm",
        rowId: rowId,
        colId: colId,
        value: properties.data.value,
        visible: true,
      });
    }
    function renderDropDown(properties, data, rowId, colId) {
      if (typeof properties.event === "undefined") {
        properties.event = {};
      }
      properties.event.onEnterKey = handleEnterKey;
      function handleEnterKey(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onAdvanceSearch !== "undefined") {
          rows = props.item.event.onAdvanceSearch(
            event,
            searchCriteria,
            (data, message, page, next, previous) => {
              rows = data;
              setMessageString(message);
              setPage(typeof page !== "undefined" ? page : false);
              setNext(typeof next !== "undefined" ? next : false);
              setPrevious(typeof previous !== "undefined" ? previous : false);
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].searchedData = rows;
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      let item = _react["default"].createElement(_Components.DropDown, {
        item: properties,
        name: properties.name,
        className: "form-control form-control-sm",
        rowId: rowId,
        colId: colId,
        value: data,
        visible: true,
      });
      return item;
    }
    function renderSearch() {
      function handleClick(event) {
        let searchCriteria = getSearchBarData();
        let rows;
        if (typeof props.item.event.onAdvanceSearch !== "undefined") {
          rows = props.item.event.onAdvanceSearch(
            event,
            searchCriteria,
            (data, message, page, next, previous) => {
              rows = data;
              setMessageString(message);
              setPage(typeof page !== "undefined" ? page : false);
              setNext(typeof next !== "undefined" ? next : false);
              setPrevious(typeof previous !== "undefined" ? previous : false);
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].searchedData = rows;
              props.item.schema.controllerObject[
                "controllerSearchBar"
              ].selectedRow = -1;
              reRender();
            }
          );
        }
        setRowSelected(false);
      }
      return _react["default"].createElement(
        "button",
        { className: "btn btn-link", onClick: handleClick },
        _react["default"].createElement("i", { className: "fa fa-search" })
      );
    }
    Object.keys(columns).map((name) => {
      if (
        typeof columns[name].schema !== "undefined" &&
        columns[name].schema.advanceSearch
      )
        tableHeader[name] = { ...columns[name] };
      if (!isGridActive) {
        tableHeader[name].schema.searchable = true;
        tableHeader[name].schema.readOnly = false;
        tableHeader[name].schema.visible = true;
        tableHeader[name].event = {};
        tableHeader[name].data.value = "";
        setIsGridActive(true);
      }
    });
    tableHeader["colController"] = { objectType: "SearchControl" };
    let header = Object.keys(tableHeader).map((name, colIdx) => {
      let key = tableHeader[name];
      let cell;
      switch (key.objectType) {
        case "TextBox":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderTextBox(columns[name], "", -1, colIdx)
          );
          break;
        case "NumberField":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderNumberField(columns[name], "", -1, colIdx)
          );
          break;
        case "CheckBox":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderCheckBox(columns[name], "", -1, colIdx)
          );
          break;
        case "DropDown":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderDropDown(columns[name], "", -1, colIdx)
          );
          break;
        case "SearchControl":
          cell = _react["default"].createElement(
            "th",
            { key: key.name + "-1" + colIdx, className: "border-top-0" },
            renderSearch()
          );
          break;
        default:
          cell = null;
      }
      return cell;
    });
    return header;
  }
  function renderRows() {
    let columns =
      props.item.schema.controllerObject["controllerSearchBar"].searchBarHeader;
    let tableHeader = [];
    let data =
      props.item.schema.controllerObject["controllerSearchBar"].searchedData;
    let header;
    let selectedRow =
      props.item.schema.controllerObject["controllerSearchBar"].selectedRow;
    function renderCheckBox(properties, data, rowId, colId, disabled) {
      properties.schema.showLabel = false;
      return _react["default"].createElement(_Components.CheckBox, {
        item: properties,
        id: properties.name,
        type: "checkbox",
        rowId: rowId,
        colId: colId,
        item: properties,
        name: properties.name,
        value: data,
        disabled: disabled,
        visible: true,
      });
    }
    Object.keys(columns).map((name) => {
      if (
        typeof columns[name].schema !== "undefined" &&
        columns[name].schema.advanceSearch
      )
        tableHeader[name] = columns[name];
    });
    tableHeader["colController"] = { objectType: "ControlObject" };
    return data.map((object, rowIdx) => {
      function handleClick(event) {
        props.item.schema.controllerObject["controllerSearchBar"].selectedRow =
          rowIdx;
        selectedRow = rowIdx;
        setRowSelected(true);
        reRender();
      }
      function handleDbClick(event) {
        let searchData =
          props.item.schema.controllerObject["controllerSearchBar"]
            .searchedData[
          props.item.schema.controllerObject["controllerSearchBar"]
            .selectedRow
          ];
        if (typeof props.item.event.onAdvanceSearchDone !== "undefined") {
          props.item.event.onAdvanceSearchDone(
            event,
            searchData ? searchData : {}
          );
        }
        resetSearchBarData();
        item.closePopUp();
        setRowSelected(false);
      }
      header = Object.keys(tableHeader).map((name, colIdx) => {
        let key = tableHeader[name];
        if (Object.keys(tableHeader).length === colIdx + 1) {
          return _react["default"].createElement(
            "td",
            {
              style: key.style,
              key: name + rowIdx + colIdx + "_grid",
              className: selectedRow === rowIdx ? "table-primary" : "",
            },
            selectedRow === rowIdx
              ? _react["default"].createElement(
                "span",
                null,
                _react["default"].createElement("i", {
                  className: "fas fa-check-circle",
                })
              )
              : _react["default"].createElement(
                _react["default"].Fragment,
                null
              )
          );
        }
        if (key.objectType === "CheckBox") {
          return _react["default"].createElement(
            "td",
            {
              key: name + rowIdx + colIdx + "_grid",
              className: selectedRow === rowIdx ? "table-primary" : "",
            },
            _react["default"].createElement("input", {
              type: "checkbox",
              readOnly: true,
              checked: object[key.data.sqlcolumn] === key.schema.checkedValue,
            })
          );
        }
        return _react["default"].createElement(
          "td",
          {
            style: key.style,
            key: name + rowIdx + colIdx + "_grid",
            className: selectedRow === rowIdx ? "table-primary" : "",
          },
          object[key.data.sqlcolumn]
        );
      });
      return _react["default"].createElement(
        "tr",
        {
          onDoubleClick: handleDbClick,
          key: "row-" + rowIdx,
          onClick: handleClick,
        },
        header
      );
    });
  }
  function showAdvanceSearch(rows, message, page, next, previous) {
    props.item.schema.controllerObject["controllerSearchBar"].searchedData =
      rows;
    props.item.schema.controllerObject["controllerSearchBar"].selectedRow = -1;
    setMessageString(message);
    item.showPopUp();
    setIsGridActive(false);
    setPage(typeof page !== "undefined" ? page : false);
    setNext(typeof next !== "undefined" ? next : false);
    setPrevious(typeof previous !== "undefined" ? previous : false);
    reRender();
  }
  function closeAdvanceSearch() {
    setIsGridActive(false);
    setRowSelected(false);
    item.closePopUp();
  }
  function handleClosePopUp(event) {
    setRowSelected(false);
    resetSearchBarData();
  }
  function searchButton(text) {
    let disabled = true;
    if (props.validation === "enabled") {
      disabled = !rowSelected || !validated;
    } else {
      disabled = !rowSelected;
    }
    function handleSearchClick(event) {
      let searchData =
        props.item.schema.controllerObject["controllerSearchBar"].searchedData[
        props.item.schema.controllerObject["controllerSearchBar"].selectedRow
        ];
      if (typeof props.item.event.onAdvanceSearchDone !== "undefined") {
        props.item.event.onAdvanceSearchDone(
          event,
          searchData ? searchData : {}
        );
      }
      resetSearchBarData();
      item.closePopUp();
      setRowSelected(false);
    }
    function handleNextClick(event) {
      let rows;
      if (typeof props.item.event.onAdvanceSearchNext !== "undefined") {
        rows = props.item.event.onAdvanceSearchNext(
          event,
          page,
          (data, message, page, next, previous) => {
            rows = data;
            setMessageString(message);
            setPage(typeof page !== "undefined" ? page : false);
            setNext(typeof next !== "undefined" ? next : false);
            setPrevious(typeof previous !== "undefined" ? previous : false);
            props.item.schema.controllerObject[
              "controllerSearchBar"
            ].searchedData = data;
            props.item.schema.controllerObject[
              "controllerSearchBar"
            ].selectedRow = -1;
            reRender();
          }
        );
      }
      setRowSelected(false);
    }
    function handlePreviousClick(event) {
      let rows;
      if (typeof props.item.event.onAdvanceSearchPrevious !== "undefined") {
        rows = props.item.event.onAdvanceSearchPrevious(
          event,
          page,
          (data, message, page, next, previous) => {
            rows = data;
            setMessageString(message);
            setPage(typeof page !== "undefined" ? page : false);
            setNext(typeof next !== "undefined" ? next : false);
            setPrevious(typeof previous !== "undefined" ? previous : false);
            props.item.schema.controllerObject[
              "controllerSearchBar"
            ].searchedData = data;
            props.item.schema.controllerObject[
              "controllerSearchBar"
            ].selectedRow = -1;
            reRender();
          }
        );
      }
      setRowSelected(false);
    }
    props.item.onAdvanceSearchNext = handleNextClick;
    return _react["default"].createElement(
      _react["default"].Fragment,
      null,
      _react["default"].createElement(
        "div",
        { className: "row" },
        _react["default"].createElement(
          "div",
          { className: "col-7" },
          _react["default"].createElement(
            "div",
            { className: "adv-search-info-message" },
            messageString
          )
        ),
        _react["default"].createElement(
          "div",
          { className: "col-5" },
          _react["default"].createElement(
            "button",
            {
              type: "button",
              className: "btn btn-primary adv-search-button ml-4",
              disabled: disabled,
              onClick: handleSearchClick,
            },
            text
          )
        )
      )
    );
  }
  function searchGrid() {
    return _react["default"].createElement(
      "div",
      { className: "advance-searchtable-wrapper" },
      _react["default"].createElement(
        "table",
        {
          style: { overflowY: "hidden", ...props.style },
          className:
            props.className +
            "table table-responsive table-striped table-sm w-100 d-block d-md-table table table-hover",
        },
        _react["default"].createElement(
          "thead",
          null,
          _react["default"].createElement("tr", null, renderHeaderTitle()),
          _react["default"].createElement("tr", null, renderSearchBar())
        ),
        _react["default"].createElement(
          "tbody",
          { id: "adv-search-body-id", key: "adv-search-body" },
          renderRows()
        )
      )
    );
  }
  function renderWrappedChildren(children, item) {
    return _react["default"].Children.map(children, (child) => {
      if (!child.props) {
        return child;
      }
      if (child.props) {
        if (typeof child.props.typeName !== "undefined") {
          if (child.props.typeName === "AdvanceSearchGrid") {
            return searchGrid();
          }
          if (child.props.typeName === "AdvanceSearchButton") {
            return searchButton(child.props.text);
          }
        }
        return _react["default"].cloneElement(child, {
          children: renderWrappedChildren(child.props.children, item),
        });
      }
      return child;
    });
  }
  props.item.showAdvanceSearch = showAdvanceSearch;
  props.item.closeAdvanceSearch = closeAdvanceSearch;
  props.item.setSearchValidated = setValidated;
  return _react["default"].createElement(
    _react["default"].Fragment,
    null,
    _react["default"].createElement(
      _Base.PopUPDialog,
      {
        item: item,
        headerText: props.headerText,
        className: props.className,
        onClosePopUp: handleClosePopUp,
      },
      _react["default"].createElement(
        "div",
        null,
        renderWrappedChildren(props.children, props.item)
      )
    )
  );
}


