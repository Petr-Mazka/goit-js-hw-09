import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const setDate = document.querySelector('#datetime-picker');
const startButton  = document.querySelector("[data-start]");
const tSeconds = document.querySelector("[data-seconds]");
const tMinutes = document.querySelector("[data-minutes]");
const tHours = document.querySelector("[data-hours]");
const tDays = document.querySelector("[data-days]");
let timerId;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose([selectedDates]) {
      const currentDate = Date.now();

    if (currentDate > selectedDates) {
        startButton.disabled = true;
        window.alert('Please choose a date in the future');
          console.log("Incorrect date")
      return;
    }
    startButton.disabled = false;
  },
  };

  const timePicker = flatpickr('#datetime-picker', options);

  function updateClock({ days, hours, minutes, seconds }) {
    tSeconds.textContent = seconds;
    tMinutes.textContent = minutes;
    tHours.textContent = hours;
    tDays.textContent = days;
  }
  
  function calcTime(ms){
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = pad(Math.floor(ms / day));
    const hours = pad(Math.floor((ms % day) / hour));
    const minutes = pad(Math.floor(((ms % day) % hour) / minute));
    const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

    return { days, hours, minutes, seconds };
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function onWork (){
    const selectedDateInMs = timePicker.selectedDates[0].getTime();
    const delta = selectedDateInMs - Date.now();
    const timeLeft = calcTime(delta);

    if (delta <= 0) {
      clearInterval(timerId);
      return;
    }

    updateClock(timeLeft);
  }

  function startTimer() {
    timerId = setInterval(onWork, 1000);
    onWork();
  }

  startButton.addEventListener('click', startButtonActive);

  function startButtonActive(){
    startButton.disabled = true;
    startTimer();
    setDate.disabled = true;
  }