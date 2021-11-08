import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  inputEl: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

refs.btnStart.setAttribute('disabled', '');
let selectedDate = new Date();
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    selectedDate = selectedDates[0];
    if (selectedDates[0] < new Date()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      refs.btnStart.setAttribute('disabled', '');
    } else {
      refs.btnStart.removeAttribute('disabled');
    }
  },
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr(refs.inputEl, options);
let timerId = null;
refs.btnStart.addEventListener('click', onBtnStartClick);
function onBtnStartClick() {
  refs.btnStart.setAttribute('disabled', '');
  refs.inputEl.setAttribute('disabled', '');
  onTimerTick();
  timerId = setInterval(onTimerTick, 1000);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function onTimerTick() {
  const now = new Date();
  let timeDif = Math.max(selectedDate - now, 0);
  let { days, hours, minutes, seconds } = convertMs(timeDif);
  refs.daysEl.textContent = addLeadingZero(days);
  refs.hoursEl.textContent = addLeadingZero(hours);
  refs.minutesEl.textContent = addLeadingZero(minutes);
  refs.secondsEl.textContent = addLeadingZero(seconds);
  if (timeDif === 0) {
    clearInterval(timerId);
    refs.btnStart.removeAttribute('disabled');
    refs.inputEl.removeAttribute('disabled');
  }
}
