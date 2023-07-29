"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = _interopRequireDefault(require("./utils"));

var _Calendar = _interopRequireDefault(require("./Calendar"));

var _core = require("@material-ui/core");

var _styles = require("@material-ui/styles");

var _rendifyHelper = require("./rendifyHelper");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    dialogPaper: _defineProperty({
      minHeight: 660,
      maxHeight: 660,
      display: 'flex'
    }, theme.breakpoints.down('xs'), {
      margin: "".concat(theme.spacing(1), "px")
    })
  };
});

function initState(selectedDates) {
  return {
    selectedDates: selectedDates ? _toConsumableArray(selectedDates) : [],
    minDate: null,
    maxDate: null
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'setSelectedDates':
      return _objectSpread({}, state, {
        selectedDates: action.payload
      });

    default:
      return new Error('wrong action type in multiple date picker reducer');
  }
}

var DatePicker = function DatePicker(_ref) {
  var open = _ref.open,
      readOnly = _ref.readOnly,
      onCancel = _ref.onCancel,
      onSubmit = _ref.onSubmit,
      onChange = _ref.onChange,
      outerSelectedDates = _ref.selectedDates,
      disabledDates = _ref.disabledDates,
      cancelButtonText = _ref.cancelButtonText,
      _ref$submitButtonText = _ref.submitButtonText,
      submitButtonText = _ref$submitButtonText === void 0 ? 'Submit' : _ref$submitButtonText,
      _ref$selectedDatesTit = _ref.selectedDatesTitle,
      selectedDatesTitle = _ref$selectedDatesTit === void 0 ? 'Selected Dates' : _ref$selectedDatesTit,
      disabledDatesTitle = _ref.disabledDatesTitle,
      times = _ref.times,
      halfDisabledDates = _ref.halfDisabledDates,
      chooseMulti = _ref.chooseMulti,
      bgColor = _ref.bgColor,
      selectedStartTs = _ref.selectedStartTs,
      selectedEndTs = _ref.selectedEndTs,
      vacationDaysByIndex = _ref.vacationDaysByIndex;

  // Tekitame aegadest topelt halduse - Komponenti antakse kasutaja puhke kellaajad
  // Kui aga valitud päev on halfDisabledDate - siis näitame algus kella hoopis selle järgi
  var _useState = (0, _react.useState)(times || []),
      _useState2 = _slicedToArray(_useState, 2),
      timesInternal = _useState2[0],
      setTimesInternal = _useState2[1];

  var _React$useState = _react["default"].useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      outterChosenStartTs = _React$useState2[0],
      setChosenOuterStartTs = _React$useState2[1];

  var _React$useState3 = _react["default"].useState(null),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      outterChosenEndTs = _React$useState4[0],
      setChosenOuterEndTs = _React$useState4[1];

  if (cancelButtonText == null) {
    cancelButtonText = readOnly ? 'Dismiss' : 'Cancel';
  }

  var _useReducer = (0, _react.useReducer)(reducer, outerSelectedDates, initState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      _useReducer2$ = _useReducer2[0],
      selectedDates = _useReducer2$.selectedDates,
      minDate = _useReducer2$.minDate,
      maxDate = _useReducer2$.maxDate,
      dispatch = _useReducer2[1];

  var classes = useStyles(); // When triggered internally in Calendar

  var setOuterStartEndTs = function setOuterStartEndTs(start, end) {
    setChosenOuterStartTs(start);
    setChosenOuterEndTs(end);
  };

  var onSelect = (0, _react.useCallback)(function (day) {
    if (readOnly) {
      return;
    }

    var selectedDatesPayload = [];

    if (_utils["default"].dateIn(selectedDates, day)) {
      selectedDatesPayload = selectedDates.filter(function (date) {
        return !_utils["default"].isSameDay(date, day);
      });
      dispatch({
        type: 'setSelectedDates',
        payload: selectedDatesPayload
      });
    } else {
      selectedDatesPayload = [].concat(_toConsumableArray(selectedDates), [day]);
      dispatch({
        type: 'setSelectedDates',
        payload: selectedDatesPayload
      });
    }
    /*// RENDIFY LOGIC BEGIN
    // On toote kella ajad ning on ka renditud päevad
    if (times && halfDisabledDates) {
      const anyHalfRentDay = halfDisabledDates.find(
          half => selectedDatesPayload.find(
              (sel => DateUtilities.isSameDay(sel, half))));
      if (anyHalfRentDay) {
        let startTs, endTs;
        // for Date.prototype And Moment jS
        try {
          //startTs = moment().set('hours', anyHalfRentDay.getHours() + 1).set('minutes', 0)
          startTs = anyHalfRentDay // + 1 on ajabuhver peale renditagastust.
        } catch (e) {
          //startTs = moment().set('hours', anyHalfRentDay.hour() + 1).set('minutes', 0)
          startTs = anyHalfRentDay // + 1 on ajabuhver peale renditagastust.
        }
         try {
          endTs = times[times.length - 1];
        } catch (e) {
          endTs = times[times.length - 1];
        }
         // Arvutame uue alguse kuupäev rendi päeva pealt.
        setTimesInternal(getListForStartAndEndTs(startTs, endTs));
      } else {
        setTimesInternal(times)
      }
    } else {
      return; // Pole bronnitud päevi ja kuupäevad on juba on init paika pandud.
    }*/


    onChange(selectedDatesPayload);
  }, [selectedDates, dispatch, readOnly, halfDisabledDates, times]);
  var onRemoveAtIndex = (0, _react.useCallback)(function (index) {
    if (readOnly) {
      return;
    }

    var newDates = _toConsumableArray(selectedDates);

    if (index > -1) {
      newDates.splice(index, 1);
    }

    dispatch({
      type: 'setSelectedDates',
      payload: newDates
    });
  }, [selectedDates, dispatch, readOnly]);
  /*const dismiss = useCallback(
      () => {
        dispatch({type: 'setSelectedDates', payload: []})
        onCancel()
      },
      [dispatch, onCancel]
  )*/

  /*const handleCancel = useCallback(
      e => {
        e.preventDefault()
        dismiss()
      },
      [dismiss]
  )*/

  /*const handleOk = useCallback(
      e => {
        e.preventDefault()
        if (readOnly) {
          return
        }
         const reset = () => {
          setTimeout(() => {
            setNoticeTxt('');
          }, 3000);
        }
         if (selectedDates.length) {
          const lastDayChosen = selectedDates[selectedDates.length - 1].getDay();
          if(vacationDaysByIndex.includes(lastDayChosen)) {
            setNoticeTxt("Lõpp päev on puhkepäeval.");
            return reset();
          }
        }
         if (!disableClock && (!outterChosenStartTs || !outterChosenEndTs)) {
          setNoticeTxt("Kellaajad valimata.");
          return reset();
        }
          // valitud kuupäevadel on kellaeg muidu 00:00. Panen kõigile algusajaks selectedStartTs.
        // ja võrdleme praeguse hetkega. Kui praegune hetk on pärast algusaega, siis on järelikult minevik.
        const withFormattedTime = selectedDates.map((e) => {
          const formattedHours = moment(e).set({
            hour: moment(outterChosenStartTs).get('hour'),
            minute: moment(outterChosenStartTs).get('minute'),
          })
          return formattedHours;
        });
         if (withFormattedTime.find(e => moment().isAfter(moment(e)))) {
          setNoticeTxt("Kuupäev on minevikus.");
          return reset();
        }
         /!* validation 1 *!/
        if (chooseMulti && (selectedDates.length === 0 || selectedDates.length
            === 1)) {
          setNoticeTxt("Rentija minimaalne rendi aeg on 1 ööpäev.");
          return reset();
        }
         /!* validation 2 *!/
        if (!disableClock && (!outterChosenStartTs || !outterChosenEndTs)) {
          setNoticeTxt("Vali ka rendi algus ja lõpp kellaajad.");
          return reset();
        }
         /!* validation 3 *!/
        if (chooseMulti === false) {
          if (selectedDates.length > 1) {
            setNoticeTxt("Vali ainult üks päev");
            return reset();
          }
           if (moment(outterChosenEndTs).isBefore(outterChosenStartTs)) {
            setNoticeTxt("Alguse kellaaeg on hiljem kui lõpu.");
            return reset();
          }
        }
         if (!disableClock) {
          /!* validation 4 *!/
          const sortedDates = sortDate(selectedDates); // järjekorda ja vaatame et päevade vahel ei oleks tühjust.
          let triggered = false;
           sortedDates.forEach((sd, i) => {
            if (triggered) {
              return;
            }
             const chosen = sd;
            const nextChosen = sortedDates[i + 1];
            const duration = moment.duration(
                moment(nextChosen).diff(moment(chosen)));
             if (nextChosen && duration.asDays() > 1) {
              triggered = true;
              setNoticeTxt("Päevade vahel ei tohi olla tühja päeva.");
              return reset();
            }
          });
           if (triggered) {
            return;
          }
        }
         onSubmit({selectedDates, outterChosenStartTs, outterChosenEndTs})
      },
      [onSubmit, selectedDates, readOnly, outterChosenEndTs,
        outterChosenStartTs, chooseMulti, chooseMulti]
  )*/

  (0, _react.useEffect)(function () {
    if (open) {
      dispatch({
        type: 'setSelectedDates',
        payload: outerSelectedDates != null ? outerSelectedDates : []
      });
    }
  }, [open, outerSelectedDates]);
  return _react["default"].createElement(_Calendar["default"], {
    bgColor: bgColor,
    selectedDates: selectedDates,
    disabledDates: disabledDates,
    disabledDatesTitle: disabledDatesTitle,
    onSelect: onSelect,
    onRemoveAtIndex: onRemoveAtIndex,
    minDate: minDate,
    maxDate: maxDate,
    readOnly: readOnly,
    cancelButtonText: cancelButtonText,
    submitButtonText: submitButtonText,
    selectedDatesTitle: selectedDatesTitle,
    times: timesInternal,
    selectedStartTs: selectedStartTs,
    selectedEndTs: selectedEndTs,
    vacationDaysByIndex: vacationDaysByIndex,
    setOuterStartEndTs: setOuterStartEndTs
  });
};

DatePicker.propTypes = {
  open: _propTypes["default"].bool.isRequired,
  readOnly: _propTypes["default"].bool,
  selectedDates: _propTypes["default"].array,
  selectedDatesTitle: _propTypes["default"].string,
  disabledDatesTitle: _propTypes["default"].string,
  halfDisabledDates: _propTypes["default"].array,
  chooseMulti: _propTypes["default"].bool,
  selectedStartTs: _propTypes["default"].string,
  selectedEndTs: _propTypes["default"].string,
  bgColor: _propTypes["default"].string
};
var _default = DatePicker;
exports["default"] = _default;