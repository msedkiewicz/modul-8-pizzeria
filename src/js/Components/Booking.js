import {select, settings, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePickerElem.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePickerElem.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking
                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event
                     + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
    ]).then(function(allResponses){
      const bookingsResponse = allResponses [0];
      return Promise.all([
        bookingsResponse.json(),
      ]);
    }).then(function(responses){
      console.log(responses);
    });
  }

  render(element){
    const thisBooking = this;

    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();
    /* create element using utils.createElementFromHTML */
    thisBooking.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const bookingContainer = document.querySelector(select.containerOf.booking);
    /* add element to menu */
    bookingContainer.appendChild(thisBooking.element).innerHTML;

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);
  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePickerElem = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPickerElem = new HourPicker(thisBooking.dom.hourPicker);
  }
}

export default Booking;