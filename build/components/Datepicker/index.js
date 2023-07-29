"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Calendar = _interopRequireDefault(require("./Calendar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

function computeDatesInRange(startDate, endDate) {
  // Helper function to compute dates between two given dates (inclusive)
  var datesInRange = [];
  var current = new Date(startDate);

  while (current <= endDate) {
    datesInRange.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return datesInRange;
}

var DatePicker = function DatePicker(_ref) {
  var open = _ref.open,
      readOnly = _ref.readOnly,
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

  var onSelect = (0, _react.useCallback)(function (day) {
    if (readOnly) {
      return;
    }

    var selectedDatesPayload = [];
    /* A) First date is chosen - choose the date */

    /* B) Second date is chosen - Compute all the dates from A - B (include in between) - This logic only applies when second date is bigger than first selected. */

    /* C) Second date is chosen - fallback TO (A) - reset dates , and choose it as only date */

    /* D) Third date is chosen - Fallback to (B) - compute dates in between */

    /* F) Third date is chosen - Is same as last date currently chosen - do nothing */

    var findLatestDay = function findLatestDay(dates) {
      // Find the maximum date in the array
      var latestDate = new Date(Math.max.apply(null, dates));
      return latestDate;
    };

    if (selectedDates.length === 0) {
      // A) First date is chosen - choose the date
      selectedDatesPayload = [day]; // start listing
    } else if (selectedDates.length >= 1 && day.getTime() > selectedDates[0].getTime()) {
      // B) Second date is chosen - Compute all dates from A to B (inclusive)
      var datesInRange = computeDatesInRange(selectedDates[0], day);
      selectedDatesPayload = datesInRange;
    } else if (day.getTime() < selectedDates[0].getTime()) {
      // C) Second date is chosen - fallback to A - reset dates and choose it as the only date
      selectedDatesPayload = [day]; // resets
    } else if (day.getTime() === findLatestDay(selectedDates).getTime()) {
      // same day is chosen;
      return;
    }

    dispatch({
      type: 'setSelectedDates',
      payload: selectedDatesPayload
    });
    onChange([selectedDatesPayload[0], findLatestDay(selectedDatesPayload)]);
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
    selectedStartTs: selectedStartTs,
    selectedEndTs: selectedEndTs,
    vacationDaysByIndex: vacationDaysByIndex
  });
};

var _default = DatePicker;
exports["default"] = _default;